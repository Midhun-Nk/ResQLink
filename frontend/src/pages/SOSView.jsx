import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { 
  Siren, MapPin, AlertTriangle, CheckCircle2, X, Radio, Loader2, ShieldCheck
} from "lucide-react";

// REPLACE WITH YOUR ACTUAL BACKEND URL
const SOCKET_URL = "http://localhost:5000"; 

export const SOSView = () => {
  const [status, setStatus] = useState('idle'); // idle | confirming | locating | sent
  const [coords, setCoords] = useState(null);
  const [socket, setSocket] = useState(null);

  // 1. Initialize Socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const handleSOSClick = () => {
    if (status === 'idle') setStatus('confirming');
  };

  const handleCancel = () => setStatus('idle');

  const confirmEmergency = () => {
    setStatus('locating');

    let userData = {};
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) userData = JSON.parse(storedUser);
    } catch (error) {
        console.error("Failed to load user data", error);
        userData = { name: "Unknown", id: "Guest" }; 
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const emergencyPayload = {
            userId: userData._id || userData.id || 'guest',
            userName: userData.fullName || userData.userName || 'Anonymous',
            contactNumber: userData.phoneNumber || 'N/A',
            location: {
                lat: latitude,
                lng: longitude,
                accuracy: position.coords.accuracy,
            },
            timestamp: new Date().toISOString(),
            status: "CRITICAL",
            message: "SOS Button Triggered"
        };
        
        setCoords({ lat: latitude, lng: longitude });

        if (socket) {
            console.log("🚀 [EMITTING SOS]", emergencyPayload);
            socket.emit("send_sos_alert", emergencyPayload); 
        }

        setTimeout(() => setStatus('sent'), 2000); // Slight delay for dramatic effect
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
    <div className={`
      relative min-h-[600px] w-full flex flex-col items-center justify-center p-6 overflow-hidden rounded-3xl border transition-all duration-500
      /* Light Mode */
      bg-red-50/50 border-red-100
      /* Dark Mode */
      dark:bg-[#050505] dark:border-white/5
    `}>
      
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] border border-red-200 dark:border-red-900/20 rounded-full animate-ping [animation-duration:3s]"></div>
        <div className="w-[450px] h-[450px] absolute border border-red-300 dark:border-red-800/30 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
      </div>

      {/* --- IDLE STATE --- */}
      {status === 'idle' && (
        <div className="z-10 flex flex-col items-center animate-in zoom-in duration-500">
           
           {/* Status Badge */}
           <div className={`
             mb-12 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border shadow-sm
             bg-white border-slate-200 text-slate-500
             dark:bg-white/5 dark:border-white/10 dark:text-zinc-400
           `}>
              <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-emerald-500 animate-pulse shadow-emerald-500/50' : 'bg-red-500'}`}></div>
              {socket?.connected ? 'System Online' : 'Connecting...'}
           </div>

           {/* THE SOS BUTTON */}
           <button 
             onClick={handleSOSClick}
             className="group relative w-72 h-72 rounded-full flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95"
           >
             {/* Glow Effect */}
             <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[60px] group-hover:bg-red-500/40 transition-all duration-500"></div>
             
             {/* Button Body */}
             <div className={`
               relative w-full h-full rounded-full flex flex-col items-center justify-center z-10 shadow-2xl border-4
               /* Light: Gradient */
               bg-gradient-to-br from-red-500 to-red-700 border-red-400
               /* Dark: Deep Red */
               dark:bg-[#b91c1c] dark:border-red-500/30 dark:shadow-[0_0_60px_rgba(220,38,38,0.4)]
             `}>
                {/* Rotating Ring */}
                <div className="absolute inset-6 rounded-full border-2 border-white/20 border-dashed animate-[spin_20s_linear_infinite]"></div>
                
                <Siren size={80} className="text-white mb-2 drop-shadow-md group-hover:animate-pulse" />
                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-md">SOS</span>
                <span className="text-red-100 text-xs font-bold tracking-[0.3em] mt-3 group-hover:text-white transition-colors">TAP FOR HELP</span>
             </div>
           </button>

           <p className="mt-12 text-slate-500 dark:text-zinc-500 max-w-xs text-center text-sm font-medium">
             Pressing this sends your precise location to Rescue Teams immediately.
           </p>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG --- */}
      {status === 'confirming' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6">
          <div className={`
            max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center border
            bg-white border-slate-100
            dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-black/50
          `}>
            <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-500/20">
              <AlertTriangle size={36} className="text-red-600 dark:text-red-500" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Are you in danger?</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              This action will alert local authorities and share your live location. <br/>
              <span className="text-red-600 dark:text-red-400 font-bold">Use only in emergencies.</span>
            </p>
            
            <div className="flex flex-col gap-3">
               <button 
                 onClick={confirmEmergency}
                 className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all active:scale-95 text-sm uppercase tracking-wider"
               >
                 Yes, Send Alert
               </button>
               <button 
                 onClick={handleCancel}
                 className="w-full py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
               >
                 Cancel
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LOCATING STATE --- */}
      {status === 'locating' && (
        <div className="z-10 flex flex-col items-center text-center animate-in fade-in">
           {/* Radar Animation */}
           <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
             <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
             <div className="absolute inset-4 border-2 border-slate-100 dark:border-white/5 rounded-full border-dashed animate-spin [animation-duration:5s] reverse"></div>
             
             <div className="w-20 h-20 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-lg dark:shadow-red-900/20 z-10 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
                <MapPin size={36} className="text-red-600 dark:text-red-500" />
             </div>
           </div>
           
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Acquiring GPS...</h3>
           <p className="text-slate-500 dark:text-zinc-500 font-mono text-xs bg-white dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
             Triangulating Signal
           </p>
        </div>
      )}

      {/* --- SENT / SUCCESS STATE --- */}
      {status === 'sent' && (
        <div className="z-10 flex flex-col items-center text-center animate-in zoom-in duration-500">
           <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/40 relative">
             <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping [animation-duration:2s]"></div>
             <CheckCircle2 size={64} className="text-white drop-shadow-md" />
           </div>
           
           <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Help Sent!</h2>
           <p className="text-slate-600 dark:text-zinc-400 text-sm mb-8 font-medium">Rescue teams have received your location.</p>
           
           <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm mb-10 w-full max-w-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Broadcasted Coordinates</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xl flex items-center justify-center gap-2">
                <MapPin size={20} />
                {coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}
              </p>
           </div>
           
           <button 
             onClick={() => setStatus('idle')}
             className="px-8 py-3.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95
             bg-slate-900 text-white hover:bg-slate-800
             dark:bg-white dark:text-black dark:hover:bg-zinc-200
             "
           >
             <ShieldCheck size={18} /> Return to Safety
           </button>
        </div>
      )}

    </div>
  );
};