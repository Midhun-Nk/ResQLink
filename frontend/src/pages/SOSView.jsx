import React, { useState } from 'react';
import { 
  Siren, 
  MapPin, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  X,
  ShieldCheck,
  Radio
} from "lucide-react";

export const SOSView = () => {
  const [status, setStatus] = useState('idle'); // idle | confirming | locating | sent
  const [coords, setCoords] = useState(null);

  const handleSOSClick = () => {
    if (status === 'idle') {
      setStatus('confirming');
    }
  };

  const handleCancel = () => {
    setStatus('idle');
  };

  const confirmEmergency = () => {
    setStatus('locating');

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = {
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
            accuracy: position.coords.accuracy
        };
        
        setCoords(locationData);

        // --- MOCK BACKEND CALL ---
        console.log("🚀 [EMERGENCY API TRIGGERED]");
        console.log("📍 PRECISE LOCATION SENT:", locationData);
        // -------------------------

        setTimeout(() => {
            setStatus('sent');
        }, 1500);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve location. Please check GPS settings.");
        setStatus('idle');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative min-h-[600px] w-full bg-red-50 flex flex-col items-center justify-center p-6 overflow-hidden rounded-xl border border-red-100 font-sans">
      
      {/* Background Pulse Animation (Red Ripples on White) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] border border-red-200 rounded-full animate-ping [animation-duration:3s]"></div>
        <div className="absolute w-[400px] h-[400px] border border-red-300 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
      </div>

      {/* --- IDLE STATE --- */}
      {status === 'idle' && (
        <div className="z-10 flex flex-col items-center animate-in zoom-in duration-500">
           {/* Status Badge */}
           <div className="mb-10 flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-red-100 shadow-sm text-gray-500 text-xs font-bold tracking-wider">
              <Radio size={14} className="text-emerald-500 animate-pulse" />
              GPS SIGNAL: ACTIVE
           </div>

           {/* The Main Button */}
           <button 
             onClick={handleSOSClick}
             className="group relative w-72 h-72 rounded-full flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
           >
             {/* Outer Soft Shadow/Glow */}
             <div className="absolute inset-0 rounded-full bg-red-200 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
             
             {/* Main Circle */}
             <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-xl border-4 border-red-400 flex flex-col items-center justify-center z-10">
                
                {/* Spinning Dashed Ring */}
                <div className="absolute inset-4 rounded-full border-2 border-white/30 border-dashed animate-[spin_12s_linear_infinite]"></div>
                
                <Siren size={80} className="text-white mb-2 drop-shadow-md" />
                <span className="text-5xl font-black text-white tracking-widest drop-shadow-sm">SOS</span>
                <span className="text-red-100 text-xs font-bold tracking-[0.2em] mt-2 group-hover:text-white transition-colors">TAP FOR HELP</span>
             </div>
           </button>

           <p className="mt-10 text-gray-500 max-w-xs text-center text-sm font-medium">
             Pressing this sends your precise location to Rescue Teams immediately.
           </p>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG --- */}
      {status === 'confirming' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl text-center border border-gray-100 transform transition-all scale-100">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you in danger?</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              This action will alert local authorities and share your live location. Use only in emergencies.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={handleCancel}
                 className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmEmergency}
                 className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
               >
                 YES, ALERT
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LOCATING STATE --- */}
      {status === 'locating' && (
        <div className="z-10 flex flex-col items-center text-center animate-in fade-in">
           <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
              {/* Center Icon */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <MapPin size={32} className="text-red-500 animate-bounce" />
              </div>
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Acquiring Location...</h3>
           <p className="text-gray-500 font-mono text-xs bg-white px-3 py-1 rounded-full border border-gray-200">Triangulating via GPS</p>
        </div>
      )}

      {/* --- SENT / SUCCESS STATE --- */}
      {status === 'sent' && (
        <div className="z-10 flex flex-col items-center text-center animate-in zoom-in duration-500">
           <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200">
              <CheckCircle2 size={56} className="text-white" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Help is on the way!</h2>
           <p className="text-gray-500 text-sm mb-6">Location broadcasted successfully.</p>
           
           <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm mb-8 w-64">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Your Coordinates</p>
              <p className="text-emerald-600 font-mono font-bold text-lg flex items-center justify-center gap-2">
                <MapPin size={16} />
                {coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}
              </p>
           </div>
           
           <button 
             onClick={() => setStatus('idle')}
             className="px-8 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
           >
             <X size={18} /> Close & Reset
           </button>
        </div>
      )}

    </div>
  );
};