import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { 
  Siren, MapPin, AlertTriangle, CheckCircle2, ShieldCheck, Mic, Phone, ShieldAlert
} from "lucide-react";

// REPLACE WITH YOUR ACTUAL BACKEND URL
const SOCKET_URL = "http://localhost:5000"; 

export const SOSView = () => {
  const [status, setStatus] = useState('idle'); // idle | confirming | locating | sent
  const [coords, setCoords] = useState(null);
  const [socket, setSocket] = useState(null);

  // --- Voice State ---
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  
  // --- NEW: AI Response State ---
  const [aiResponse, setAiResponse] = useState(null); // Stores { advice, contact }

  const recognitionRef = useRef(null);

  // 1. Initialize Socket & Listeners
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // --- NEW: Listen for AI Response from Server ---
    newSocket.on("sos_acknowledged", (data) => {
        console.log("✅ AI Advice Received:", data);
        setAiResponse(data); // Save the advice and contact info
    });

    return () => newSocket.close();
  }, []);

  // 2. Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
        }
        setVoiceText(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // 3. Voice Handlers
  const startRecording = () => {
    if (recognitionRef.current && status === 'idle') {
      try {
        setVoiceText("");
        setAiResponse(null); // Reset previous AI advice
        recognitionRef.current.start();
        setIsRecording(true);
      } catch(e) { console.error("Mic Error:", e); }
    }
  };

  const stopRecordingAndProceed = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (status === 'idle') setStatus('confirming');
  };

  const handleCancel = () => {
    setStatus('idle');
    setVoiceText(""); 
    setAiResponse(null);
  };

  const confirmEmergency = () => {
    setStatus('locating');

    let userData = {};
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) userData = JSON.parse(storedUser);
    } catch (error) {
        userData = { name: "Unknown", id: "Guest" }; 
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
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
            message: voiceText.trim() ? `VOICE MSG: ${voiceText}` : "SOS Button Triggered",
            voiceNote: voiceText.trim() 
        };
        
        setCoords({ lat: latitude, lng: longitude });

        if (socket) {
            console.log("🚀 [EMITTING SOS]", emergencyPayload);
            socket.emit("send_sos_alert", emergencyPayload); 
        }

        setTimeout(() => setStatus('sent'), 2000); 
      },
      (error) => {
        alert("Unable to retrieve location.");
        setStatus('idle');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`
      relative min-h-[700px] w-full flex flex-col items-center justify-center p-6 overflow-hidden rounded-3xl border transition-all duration-500
      bg-red-50/50 border-red-100 dark:bg-[#050505] dark:border-white/5
    `}>
      
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className={`w-[600px] h-[600px] border border-red-200 dark:border-red-900/20 rounded-full ${isRecording ? 'animate-pulse bg-red-500/10' : 'animate-ping [animation-duration:3s]'}`}></div>
        <div className="w-[450px] h-[450px] absolute border border-red-300 dark:border-red-800/30 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
      </div>

      {/* --- IDLE STATE (BUTTON) --- */}
      {status === 'idle' && (
        <div className="z-10 flex flex-col items-center animate-in zoom-in duration-500">
           
           <div className={`
             mb-12 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border shadow-sm
             bg-white border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400
           `}>
              <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-emerald-500 animate-pulse shadow-emerald-500/50' : 'bg-red-500'}`}></div>
              {socket?.connected ? 'System Online' : 'Connecting...'}
           </div>

           <button 
             onMouseDown={startRecording}
             onMouseUp={stopRecordingAndProceed}
             onMouseLeave={stopRecordingAndProceed}
             onTouchStart={(e) => { startRecording(); }}
             onTouchEnd={(e) => { e.preventDefault(); stopRecordingAndProceed(); }}
             onContextMenu={(e) => e.preventDefault()}
             className="group relative w-72 h-72 rounded-full flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 select-none touch-none outline-none -webkit-user-select-none"
             style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'none' }}
           >
             <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-500 ${isRecording ? 'bg-red-600/60 scale-110' : 'bg-red-500/20 group-hover:bg-red-500/40'}`}></div>
             
             <div className={`
               relative w-full h-full rounded-full flex flex-col items-center justify-center z-10 shadow-2xl border-4
               bg-gradient-to-br from-red-500 to-red-700 border-red-400
               dark:bg-[#b91c1c] dark:border-red-500/30 dark:shadow-[0_0_60px_rgba(220,38,38,0.4)]
               ${isRecording ? 'scale-95 ring-4 ring-white/30' : ''}
             `}>
                {isRecording ? (
                    <>
                        <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                        <Mic size={80} className="text-white mb-2 animate-pulse" />
                        <span className="text-2xl font-black text-white tracking-widest">REC</span>
                    </>
                ) : (
                    <>
                        <div className="absolute inset-6 rounded-full border-2 border-white/20 border-dashed animate-[spin_20s_linear_infinite]"></div>
                        <Siren size={80} className="text-white mb-2 drop-shadow-md group-hover:animate-pulse" />
                        <span className="text-6xl font-black text-white tracking-tighter drop-shadow-md">SOS</span>
                        <span className="text-red-100 text-xs font-bold tracking-[0.3em] mt-3 group-hover:text-white transition-colors">HOLD TO SPEAK</span>
                    </>
                )}
             </div>
           </button>

           <p className="mt-12 text-slate-500 dark:text-zinc-500 max-w-xs text-center text-sm font-medium">
             Hold to record voice message.<br/>Release to alert authorities.
           </p>
        </div>
      )}

      {/* --- CONFIRMATION STATE --- */}
      {status === 'confirming' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6">
          <div className="max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center border bg-white border-slate-100 dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-black/50">
            <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-500/20">
              <AlertTriangle size={36} className="text-red-600 dark:text-red-500" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Confirm Alert?</h2>
            
            {voiceText && voiceText.trim().length > 0 && (
                <div className="mb-4 p-3 bg-slate-100 dark:bg-white/5 rounded-lg text-left">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Voice Note Attached:</p>
                    <p className="text-sm text-slate-800 dark:text-slate-200 italic">"{voiceText}"</p>
                </div>
            )}

            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              This action will alert local authorities and share your live location.
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
           {/* ... (Same as before) ... */}
           <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
             <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
             <div className="w-20 h-20 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-lg dark:shadow-red-900/20 z-10 relative">
                <MapPin size={36} className="text-red-600 dark:text-red-500" />
             </div>
           </div>
           
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Acquiring GPS...</h3>
           <p className="text-slate-500 dark:text-zinc-500 font-mono text-xs bg-white dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
             Analyzing Situation...
           </p>
        </div>
      )}

      {/* --- SENT / SUCCESS STATE (UPDATED WITH AI ADVICE) --- */}
      {status === 'sent' && (
        <div className="z-10 w-full max-w-md flex flex-col items-center text-center animate-in zoom-in duration-500">
           
           <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 relative">
             <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping [animation-duration:2s]"></div>
             <CheckCircle2 size={40} className="text-white drop-shadow-md" />
           </div>
           
           <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Help Sent!</h2>

           {/* 1. EMERGENCY CONTACT CARD (Based on AI Detection) */}
           {aiResponse?.contact && (
             <div className="w-full bg-red-600 text-white p-5 rounded-2xl shadow-xl shadow-red-900/20 mb-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Phone size={80} />
                </div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Recommended Emergency Line</p>
                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <h3 className="text-xl font-bold">{aiResponse.contact.name}</h3>
                        <p className="text-sm opacity-90">Based on your voice input</p>
                    </div>
                    <a href={`tel:${aiResponse.contact.phone}`} className="bg-white text-red-600 px-4 py-2 rounded-lg font-black text-xl hover:scale-105 transition-transform">
                        {aiResponse.contact.phone}
                    </a>
                </div>
             </div>
           )}

           {/* 2. AI ADVICE CARD */}
           {aiResponse?.advice ? (
             <div className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 p-5 rounded-2xl mb-8 text-left shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-white">
                    <ShieldAlert size={18} className="text-amber-500" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">AI Safety Instructions</h3>
                </div>
                <div className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium">
                    {aiResponse.advice}
                </div>
             </div>
           ) : (
             // Loading state if AI hasn't responded yet
             <div className="mb-8 flex items-center gap-2 text-slate-400 text-sm animate-pulse">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                Waiting for safety instructions...
             </div>
           )}
           
           <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 w-full mb-6 flex justify-between items-center">
              <div>
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Location Shared</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm">
                  {coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}
                </p>
              </div>
              <MapPin size={20} className="text-emerald-500" />
           </div>
           
           <button 
             onClick={() => { setStatus('idle'); setVoiceText(""); setAiResponse(null); }}
             className="w-full py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 hover:scale-105 active:scale-95
             bg-slate-900 text-white hover:bg-slate-800
             dark:bg-white dark:text-black dark:hover:bg-zinc-200"
           >
             <ShieldCheck size={18} /> Return to Safety
           </button>
        </div>
      )}
    </div>
  );
};