import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MapPin, 
  Phone, 
  Clock, 
  AlertOctagon, 
  Activity, 
  ShieldAlert,
  Navigation,
  User
} from 'lucide-react';

// Initialize Socket outside component to prevent re-connections
const socket = io("http://localhost:5000");

// Simple beep sound for alerts (Base64)
const ALERT_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // Shortened for brevity, logic below uses a generated beep

export const SOSView = () => {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  // Audio Ref
  const audioContextRef = useRef(null);

  // Function to play a digital "beep" sound
  const playAlertSound = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1); // Drop pitch
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    // Socket Connection Status
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Listen for SOS
    socket.on("alert_rescue_team", (data) => {
      console.log("⚠️ NEW INCIDENT REPORT:", data);
      playAlertSound();
      
      // Add 'id' timestamp to handle React keys effectively if backend doesn't send one
      const newAlert = { ...data, receivedAt: new Date() };
      
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("alert_rescue_team");
    };
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    return new Date(isoString).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- TOP BAR --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">
                <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">RESCUE<span className="text-red-600">OPS</span></h1>
                <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Emergency Response Console</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${isConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <Activity size={14} className={isConnected ? "animate-pulse" : ""} />
                {isConnected ? "SYSTEM LIVE" : "DISCONNECTED"}
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-md border border-slate-200">
                <span className="text-slate-500 text-xs font-bold mr-2">ACTIVE ALERTS</span>
                <span className="text-lg font-bold text-red-600">{alerts.length}</span>
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto p-6">
        
        {alerts.length === 0 ? (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert size={48} className="opacity-20" />
                </div>
                <h2 className="text-lg font-semibold text-slate-500">All Systems Normal</h2>
                <p className="text-sm">Waiting for incoming distress signals...</p>
            </div>
        ) : (
            // ALERT GRID
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alerts.map((alert, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-in slide-in-from-top-4 duration-500"
                    >
                        {/* Card Header */}
                        <div className="bg-red-50 border-b border-red-100 p-4 flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <AlertOctagon className="text-red-600 animate-pulse" size={20} />
                                <span className="text-sm font-bold text-red-700 tracking-wider">CRITICAL SOS</span>
                            </div>
                            <span className="text-xs font-mono font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                                {formatTime(alert.timestamp)}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-4">
                            
                            {/* Victim Info */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <User size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Victim Name</p>
                                    <h3 className="text-lg font-bold text-slate-800">{alert.userName || "Unknown User"}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-slate-600 text-sm">
                                        <Phone size={12} />
                                        <span>{alert.contactNumber || "No contact info"}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Location Data */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-slate-500 font-bold uppercase">GPS Coordinates</p>
                                    {alert.location.accuracy && (
                                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
                                            ± {Math.round(alert.location.accuracy)}m Accuracy
                                        </span>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-sm text-slate-700 flex items-center justify-between">
                                    <span>
                                        {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                                    </span>
                                    <MapPin size={16} className="text-slate-400" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <a 
                                    href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                                >
                                    <Navigation size={16} />
                                    Locate
                                </a>
                                <button className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                                    <Activity size={16} />
                                    Assign Team
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};