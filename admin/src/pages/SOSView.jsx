import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';

// Icons
import { 
  MapPin, Phone, AlertOctagon, Activity, ShieldAlert, 
  Navigation, User, ArrowLeft, Siren, ExternalLink, Clock, Radio, Globe, Target, Mic, MessageSquareWarning
} from 'lucide-react';

// --- CONFIGURATION ---
const socket = io("http://localhost:5000");

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const victimIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 46], 
  iconAnchor: [15, 46],
  popupAnchor: [1, -40],
  shadowSize: [41, 41]
});

const rescuerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -40],
  shadowSize: [41, 41]
});

// --- HELPER: AUTO ZOOM ---
const FitBoundsToMarkers = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const group = new L.FeatureGroup(
      markers.map(m => L.marker([m.location.lat, m.location.lng]))
    );
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }, [markers, map]);
  return null;
};

// --- SUB-COMPONENT: ROUTING MACHINE ---
const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      show: false, 
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#dc2626', weight: 6, opacity: 0.9, dashArray: '1, 10' }] 
      },
      createMarker: function() { return null; } 
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

// --- MAIN COMPONENT ---
export const SOSView = () => {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [viewMode, setViewMode] = useState('dashboard'); 
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  
  const audioContextRef = useRef(null);

  const playAlertSound = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location", error)
      );
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on("alert_rescue_team", (data) => {
      playAlertSound();
      const newAlert = { ...data, receivedAt: new Date() };
      setAlerts((prev) => [newAlert, ...prev]);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("alert_rescue_team");
    };
  }, []);

  const handleLocate = (alert) => {
    if (!myLocation) {
       setMyLocation({ lat: 11.25, lng: 75.78 }); // Default fallback for dev
      return;
    }
    setSelectedAlert(alert);
    setViewMode('navigation');
  };

  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    return new Date(isoString).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] font-sans text-slate-900 dark:text-gray-200 flex flex-col transition-colors duration-300">
      
      {/* HEADER */}
      <header className="bg-slate-900 dark:bg-[#0a0a0a] text-white sticky top-0 z-[1000] px-6 py-4 flex justify-between items-center shadow-lg border-b border-slate-700 dark:border-white/10">
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
                    <Siren className="text-white" size={26} />
                </div>
                {alerts.length > 0 && (
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                   </span>
                )}
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter">RESCUE<span className="text-red-500">OPS</span></h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                  {viewMode === 'navigation' ? ' // TACTICAL NAVIGATION' : viewMode === 'global-map' ? ' // GLOBAL SITUATION' : ' // COMMAND CENTER'}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {viewMode === 'dashboard' && alerts.length > 0 && (
                <button 
                    onClick={() => setViewMode('global-map')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-900/20"
                >
                    <Globe size={16} />
                    LOCATE ALL
                </button>
            )}

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black tracking-widest transition-colors ${isConnected ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400' : 'bg-red-950/50 border-red-800 text-red-400'}`}>
                <Activity size={14} className={isConnected ? "animate-pulse" : ""} />
                {isConnected ? "SYSTEM ONLINE" : "OFFLINE"}
            </div>
        </div>
      </header>

      {/* CONTENT SWITCHER */}
      {viewMode === 'dashboard' && (
        // --- DASHBOARD VIEW ---
        <main className="max-w-7xl mx-auto p-6 w-full">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Live Incident Feed</h2>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                    <Radio size={16} className="animate-pulse text-red-500" />
                    Scanning frequencies for distress beacons...
                  </p>
               </div>
               <div className="text-right bg-white dark:bg-[#0a0a0a] px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                  <span className="text-4xl font-black text-slate-900 dark:text-white block">{alerts.length}</span>
                  <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Active Alerts</span>
               </div>
            </div>

            {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 dark:text-zinc-600 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <ShieldAlert size={48} className="opacity-20" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-600 dark:text-zinc-400">All Sectors Clear</h2>
                    <p className="text-sm mt-2">No distress signals detected in current range.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alerts.map((alert, index) => (
                        <div key={index} className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
                            {/* Urgent Strip */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-lg border border-red-100 dark:border-red-500/20">
                                        <AlertOctagon size={16} className="animate-pulse" />
                                        <span className="text-xs font-black tracking-wider uppercase">SOS CRITICAL</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatTime(alert.timestamp)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/5 shrink-0">
                                        <User size={24} className="text-slate-600 dark:text-zinc-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">{alert.userName || "Unknown Victim"}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                                            <Phone size={12} />
                                            <span>{alert.contactNumber || "No Contact Info"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- NEW: MESSAGE / VOICE NOTE DISPLAY --- */}
                                {(alert.voiceNote || alert.message) && (
                                    <div className={`
                                        p-3 rounded-xl mb-5 text-sm border
                                        ${alert.voiceNote 
                                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-100' 
                                            : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-300'
                                        }
                                    `}>
                                        <div className="flex items-start gap-2">
                                            {alert.voiceNote ? <Mic size={16} className="mt-0.5 shrink-0 opacity-70" /> : <MessageSquareWarning size={16} className="mt-0.5 shrink-0 opacity-70" />}
                                            <p className={`leading-relaxed ${alert.voiceNote ? 'italic font-medium' : ''}`}>
                                                "{alert.voiceNote || alert.message}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 mb-4 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase">Lat</p>
                                        <p className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">{alert.location.lat.toFixed(5)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase">Lng</p>
                                        <p className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">{alert.location.lng.toFixed(5)}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleLocate(alert)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg"
                                >
                                    <Navigation size={18} />
                                    DEPLOY RESCUE UNIT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
      )}

      {/* --- NEW: GLOBAL MAP VIEW (LOCATE ALL) --- */}
      {viewMode === 'global-map' && (
        <div className="flex-1 relative flex flex-col bg-slate-900">
            {/* Top Bar for Global Map */}
            <div className="absolute top-4 left-4 z-[500] flex gap-2 pointer-events-none">
                <button 
                    onClick={() => setViewMode('dashboard')}
                    className="pointer-events-auto flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-all"
                >
                    <ArrowLeft size={18} />
                    BACK TO DASHBOARD
                </button>
            </div>

            <MapContainer 
                center={[11.25, 75.78]} 
                zoom={5} 
                className="flex-1 w-full h-full z-0"
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <FitBoundsToMarkers markers={alerts} />

                {alerts.map((alert, idx) => (
                    <Marker key={idx} position={[alert.location.lat, alert.location.lng]} icon={victimIcon}>
                        <Popup>
                            <div className="p-1 min-w-[200px] text-center font-sans">
                                <h3 className="font-bold text-lg text-slate-800">{alert.userName}</h3>
                                {/* Popup Message Display */}
                                {(alert.voiceNote || alert.message) && (
                                    <div className="my-2 p-2 bg-amber-50 border border-amber-100 rounded text-left text-xs text-amber-900 italic flex gap-1">
                                        <Mic size={12} className="shrink-0 mt-0.5" />
                                        "{alert.voiceNote || alert.message}"
                                    </div>
                                )}
                                <p className="text-xs text-slate-500 mb-2">SOS at {formatTime(alert.timestamp)}</p>
                                <button 
                                    onClick={() => handleLocate(alert)}
                                    className="w-full bg-red-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 hover:bg-red-700"
                                >
                                    <Target size={14} /> NAVIGATE TO VICTIM
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {myLocation && (
                    <Marker position={[myLocation.lat, myLocation.lng]} icon={rescuerIcon}>
                        <Popup>Your Team Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
      )}

      {/* --- NAVIGATION MAP VIEW (INDIVIDUAL) --- */}
      {viewMode === 'navigation' && (
        <div className="flex-1 relative flex flex-col bg-slate-900">
            {/* HUD: Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-[500] p-4 pointer-events-none flex justify-between">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('dashboard')}
                        className="pointer-events-auto flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-all"
                    >
                        <ArrowLeft size={18} />
                        DASHBOARD
                    </button>
                    <button 
                        onClick={() => setViewMode('global-map')}
                        className="pointer-events-auto flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-xl shadow-2xl font-bold border border-indigo-700 hover:bg-indigo-800 transition-all"
                    >
                        <Globe size={18} />
                        GLOBAL VIEW
                    </button>
                </div>

                <div className="pointer-events-auto bg-red-600 text-white px-6 py-2 rounded-xl shadow-2xl shadow-red-900/40 border border-red-500/50 flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Target Status</span>
                    <span className="text-lg font-black tracking-tight flex items-center gap-2">
                        <span className="animate-ping w-2 h-2 bg-white rounded-full inline-block"></span>
                        LIVE TRACKING
                    </span>
                </div>
            </div>

            {/* LEAFLET MAP */}
            <MapContainer 
                center={[selectedAlert.location.lat, selectedAlert.location.lng]} 
                zoom={14} 
                className="flex-1 w-full h-full z-0"
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {myLocation && (
                    <Marker position={[myLocation.lat, myLocation.lng]} icon={rescuerIcon}>
                        <Popup>
                           <div className="text-center p-2">
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Your Unit</span>
                              <div className="font-bold text-slate-800">Current Location</div>
                           </div>
                        </Popup>
                    </Marker>
                )}

                <Marker position={[selectedAlert.location.lat, selectedAlert.location.lng]} icon={victimIcon}>
                    <Popup className="custom-popup" minWidth={200}>
                        <div className="p-1 font-sans">
                            <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
                                <AlertOctagon size={16} className="text-red-600" />
                                <strong className="text-red-600 text-sm font-bold uppercase">Victim Located</strong>
                            </div>
                            
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-slate-800">{selectedAlert.userName}</h3>
                                {/* Navigation Popup Message Display */}
                                {(selectedAlert.voiceNote || selectedAlert.message) && (
                                    <div className="my-2 p-2 bg-red-50 border border-red-100 rounded text-left text-xs text-red-900 italic flex gap-1">
                                        <Mic size={12} className="shrink-0 mt-0.5" />
                                        "{selectedAlert.voiceNote || selectedAlert.message}"
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">Signal: {formatTime(selectedAlert.timestamp)}</p>
                            </div>

                            <button 
                                onClick={() => openGoogleMaps(selectedAlert.location.lat, selectedAlert.location.lng)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <ExternalLink size={14} />
                                Track on Google Maps
                            </button>
                        </div>
                    </Popup>
                </Marker>

                {myLocation && (
                    <RoutingControl 
                        start={myLocation} 
                        end={selectedAlert.location} 
                    />
                )}
            </MapContainer>
        </div>
      )}
    </div>
  );
};