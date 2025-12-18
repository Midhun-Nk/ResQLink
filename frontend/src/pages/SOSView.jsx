import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client"; // Import Socket.io
import { 
  Siren, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Radio
} from "lucide-react";

// REPLACE WITH YOUR ACTUAL BACKEND URL
const SOCKET_URL = "http://localhost:5000"; 

export const SOSView = () => {
  const [status, setStatus] = useState('idle'); // idle | confirming | locating | sent
  const [coords, setCoords] = useState(null);
  const [socket, setSocket] = useState(null);

  // 1. Initialize Socket Connection on Component Mount
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Cleanup: Disconnect when component unmounts
    return () => newSocket.close();
  }, []);

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

    // 2. Retrieve User Data from Local Storage
    // We try/catch this in case JSON parse fails or data is missing
    let userData = {};
    try {
        const storedUser = localStorage.getItem("user"); // Change "user" to your specific key
        if (storedUser) {
            userData = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Failed to load user data", error);
        userData = { name: "Unknown", id: "Guest" }; // Fallback
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // 3. Prepare the Complete Payload (Location + User Info)
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

        // 4. Emit to Backend via Socket
        if (socket) {
            console.log("🚀 [EMITTING SOS]", emergencyPayload);
            socket.emit("send_sos_alert", emergencyPayload); 
        } else {
            console.error("Socket not connected");
        }

        // Simulate network delay for UX (or listen for a 'received' event from server)
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
      
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] border border-red-200 rounded-full animate-ping [animation-duration:3s]"></div>
        <div className="absolute w-[400px] h-[400px] border border-red-300 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
      </div>

      {/* --- IDLE STATE --- */}
      {status === 'idle' && (
        <div className="z-10 flex flex-col items-center animate-in zoom-in duration-500">
           {/* Status Badge */}
           <div className="mb-10 flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-red-100 shadow-sm text-gray-500 text-xs font-bold tracking-wider">
              <Radio size={14} className={`text-emerald-500 ${socket?.connected ? 'animate-pulse' : 'text-gray-400'}`} />
              {socket?.connected ? 'SYSTEM: ONLINE' : 'CONNECTING...'}
           </div>

           {/* The Main Button */}
           <button 
             onClick={handleSOSClick}
             className="group relative w-72 h-72 rounded-full flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
           >
             <div className="absolute inset-0 rounded-full bg-red-200 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
             <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-xl border-4 border-red-400 flex flex-col items-center justify-center z-10">
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
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl text-center border border-gray-100">
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
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
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