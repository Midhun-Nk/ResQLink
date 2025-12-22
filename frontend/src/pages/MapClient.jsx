import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Navigation, ShieldAlert, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// IMPORTANT: Adjust this import path to your actual ThemeContext location

// --- 1. ICON CONFIGURATION ---

// User Position (Blue Pulse)
const userIcon = new L.Icon({ 
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', 
  iconSize: [40, 40],
  iconAnchor: [20, 20], 
  popupAnchor: [0, -20],
  className: 'animate-pulse' 
});

// Safe Location Icon (Green Check Mark Pin)
const safeIcon = new L.Icon({ 
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5290/5290145.png', 
  iconSize: [42, 42], 
  iconAnchor: [21, 42], 
  popupAnchor: [0, -42]
});

// Danger Zone (Red Hazard)
const dangerIcon = new L.Icon({ 
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const API_URL = 'http://127.0.0.1:8000/api/v1/map-locations/';

// --- 2. ROUTING CONTROL ---
function RoutingControl({ start, end }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end || !map) return;
    if (routingControlRef.current) { try { map.removeControl(routingControlRef.current); } catch (e) {} }

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#000', opacity: 0.8, weight: 8 }, { color: '#0ea5e9', opacity: 1, weight: 4 }] 
      },
      show: false, addWaypoints: false, draggableWaypoints: false, fitSelectedRoutes: true, createMarker: () => null 
    });

    routingControl.addTo(map);
    routingControlRef.current = routingControl;
    return () => { try { if (routingControlRef.current) map.removeControl(routingControlRef.current); } catch (e) {} };
  }, [start, end, map]);

  return null;
}

export default function MapClient() {
  const { isDark } = useTheme(); 
  const [locations, setLocations] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [warning, setWarning] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- DYNAMIC STYLES ---
  const mapStyles = `
    .leaflet-popup-content-wrapper, .leaflet-popup-tip {
      background-color: ${isDark ? '#18181b' : '#ffffff'} !important;
      color: ${isDark ? '#ffffff' : '#1f2937'} !important;
      border: 1px solid ${isDark ? '#3f3f46' : '#e5e7eb'};
      border-radius: 12px !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2) !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .leaflet-popup-close-button { color: ${isDark ? '#a1a1aa' : '#9ca3af'} !important; }
    .leaflet-routing-container { display: none !important; }
  `;

  // 1. Fetch Locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setLocations(data);
      } catch (err) { console.error("Map Data Error:", err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // 2. Track User
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(currentPos);
        if (locations.length > 0) checkDangerZones(currentPos, locations);
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [locations.length]);

  // --- GEOFENCING ---
  const checkDangerZones = (currentPos, locs) => {
    const userLatLng = L.latLng(currentPos.lat, currentPos.lng);
    let activeAlert = null;

    locs.forEach(loc => {
      if (loc.location_type === 'danger') {
        const zoneCenter = L.latLng(loc.latitude, loc.longitude);
        const distance = userLatLng.distanceTo(zoneCenter);
        if (distance < loc.radius) {
          activeAlert = { title: "CRITICAL ALERT", msg: `Restricted Zone: ${loc.title}. Evacuate immediately.` };
        }
      }
    });
    setWarning(activeAlert);
  };

  const handleNavigate = (loc) => {
    if (!userPos) return alert("Waiting for satellite lock...");
    setDestination({ lat: loc.latitude, lng: loc.longitude });
  };

  return (
    <div className={`relative w-full h-[calc(100vh-80px)] overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-500
      ${isDark ? 'border-gray-800 bg-[#050505]' : 'border-gray-200 bg-gray-50'}`}>
      
      <style>{mapStyles}</style>

      {/* --- HUD: WARNING OVERLAY --- */}
      {warning && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-auto animate-in fade-in zoom-in duration-300">
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl border-4 border-red-800 flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg animate-pulse">
                <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-1">{warning.title}</h3>
              <p className="font-mono text-sm opacity-90">{warning.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- HUD: GPS STATUS --- */}
      <div className={`absolute top-6 right-6 z-[1000] backdrop-blur-md px-4 py-2 rounded-lg border shadow-xl flex items-center gap-3 transition-colors duration-300
        ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-gray-200'}
      `}>
        <div className="flex flex-col items-end">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Signal Status</span>
            <span className={`text-xs font-mono font-bold ${userPos ? 'text-emerald-500' : 'text-amber-500'}`}>
                {userPos ? "LOCKED // 3m ACCURACY" : "SEARCHING..."}
            </span>
        </div>
        <div className={`w-3 h-3 rounded-full ${userPos ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-amber-500 animate-bounce'}`}></div>
      </div>

      {loading ? (
        <div className={`h-full flex flex-col items-center justify-center gap-3 ${isDark ? 'bg-[#0a0a0a] text-zinc-500' : 'bg-gray-50 text-gray-400'}`}>
          <Loader className="animate-spin text-blue-500" size={32} /> 
          <span className="font-mono text-xs tracking-widest">INITIALIZING MAP DATA...</span>
        </div>
      ) : (
        <MapContainer 
          center={userPos || [11.2588, 75.7804]} 
          zoom={13} 
          style={{ height: "100%", width: "100%", background: isDark ? '#0a0a0a' : '#f8fafc' }}
          className="z-0"
        >
          {/* TILE LAYER */}
          <TileLayer 
            attribution='&copy; CartoDB'
            url={isDark 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />

          {/* User Marker */}
          {userPos && (
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div className="text-center">
                    <span className="font-bold text-emerald-500 uppercase text-xs">Your Location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Database Locations */}
          {Array.isArray(locations) && locations.map(loc => (
            <React.Fragment key={loc.id}>
              <Marker 
                position={[loc.latitude, loc.longitude]} 
                icon={loc.location_type === 'danger' ? dangerIcon : safeIcon}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border 
                          ${loc.location_type === 'danger' 
                            ? 'border-red-800 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                            : 'border-emerald-800 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            {loc.location_type === 'danger' ? 'HAZARD ZONE' : 'SAFE HAVEN'}
                        </span>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{loc.title}</h3>
                    <p className={`text-xs mb-4 leading-relaxed font-mono ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{loc.description}</p>
                    
                    {loc.location_type === 'safe' && (
                      <button 
                        onClick={() => handleNavigate(loc)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Navigation size={14} /> NAVIGATE TO SAFETY
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* DANGER ZONE CIRCLE (Red) */}
              {loc.location_type === 'danger' && (
                <Circle 
                  center={[loc.latitude, loc.longitude]} 
                  radius={loc.radius} 
                  pathOptions={{ 
                    color: '#ef4444', 
                    weight: 1, 
                    fillColor: '#ef4444', 
                    fillOpacity: isDark ? 0.15 : 0.25,
                    dashArray: '10, 10'
                  }} 
                />
              )}

              {/* SAFE ZONE CIRCLE (Green) - ADDED HERE */}
              {loc.location_type === 'safe' && (
                <Circle 
                  center={[loc.latitude, loc.longitude]} 
                  // If database radius is 0, default to 300m for visual clarity
                  radius={loc.radius > 0 ? loc.radius : 300} 
                  pathOptions={{ 
                    color: '#10b981', // Emerald-500
                    weight: 1, 
                    fillColor: '#10b981', 
                    fillOpacity: isDark ? 0.15 : 0.25,
                  }} 
                />
              )}
            </React.Fragment>
          ))}

          {/* Routing */}
          {userPos && destination && <RoutingControl start={userPos} end={destination} />}

        </MapContainer>
      )}
    </div>
  );
}