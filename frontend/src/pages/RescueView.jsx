import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, Mic, Activity, ShieldAlert, Stethoscope, 
  Flame, Radio, Signal, Map, Loader, AlertCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// --- CONSTANTS ---
// In a real app, replace '1' with the actual logged-in User ID from your Auth Context
const CURRENT_USER_ID = 1; 
const API_URL = 'http://127.0.0.1:8000/api/v1/rescue-channels/';

// --- THE CARD COMPONENT ---
const ConferenceChannelCard = ({ channel, onJoinSession }) => {
  
  // Theme Logic based on sector
  const getSectorTheme = (sector) => {
    switch(sector) {
      case 'Medical': return { 
        bg: 'bg-rose-50 dark:bg-[#1a0505]', 
        border: 'border-rose-200 dark:border-rose-900/30', 
        text: 'text-rose-700 dark:text-rose-400', 
        btn: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600',
        icon: <Stethoscope size={18} /> 
      };
      case 'Fire': return { 
        bg: 'bg-orange-50 dark:bg-[#1a0a05]', 
        border: 'border-orange-200 dark:border-orange-900/30', 
        text: 'text-orange-700 dark:text-orange-400', 
        btn: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600',
        icon: <Flame size={18} /> 
      };
      case 'Police': return { 
        bg: 'bg-blue-50 dark:bg-[#050a1a]', 
        border: 'border-blue-200 dark:border-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400', 
        btn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600',
        icon: <ShieldAlert size={18} /> 
      };
      default: return { 
        bg: 'bg-slate-50 dark:bg-[#111]', 
        border: 'border-slate-200 dark:border-white/10', 
        text: 'text-slate-700 dark:text-slate-400', 
        btn: 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black',
        icon: <Radio size={18} /> 
      };
    }
  };

  const theme = getSectorTheme(channel.sector);

  return (
    <div className={`
      flex flex-col h-full rounded-2xl border-solid border transition-all duration-300 overflow-hidden group
      bg-white shadow-sm hover:shadow-lg hover:-translate-y-1
      dark:bg-[#0a0a0a] dark:shadow-none
      ${theme.border}
    `}>
      {/* Top Strip */}
      <div className={`h-1 w-full ${theme.text.replace('text-', 'bg-')}`}></div>
      
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Header: Badge & Status */}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
            {React.cloneElement(theme.icon, { size: 14 })} {channel.sector}
          </span>
          
          {channel.isLive ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-50 dark:bg-red-950 rounded-lg border border-red-100 dark:border-red-900/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">LIVE</span>
            </div>
          ) : (
             <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-600 bg-gray-50 dark:bg-[#111] px-2 py-1 rounded-lg">
               <Signal size={12} /> Offline
             </span>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {channel.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-2 font-medium">
            {channel.description}
          </p>
        </div>

        {/* Participants Strip */}
        <div className="mt-auto mb-5">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5">
             <div className="flex items-center -space-x-2">
               {channel.participants && channel.participants.slice(0, 4).map((img, i) => (
                 <img key={i} src={img} alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] object-cover shadow-sm transition-transform hover:scale-110 z-10"/>
               ))}
               {channel.totalParticipants > 4 && (
                 <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 z-0">
                   +{channel.totalParticipants - 4}
                 </div>
               )}
             </div>
             <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">
               <Activity size={14} className={channel.isLive ? "text-emerald-500" : "text-gray-400 dark:text-zinc-700"} />
               {channel.totalParticipants} Active
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {/* Listen Button: Just marks presence (Audio Mode) */}
          <button 
            onClick={() => onJoinSession(channel.id, false)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Mic size={16} /> Listen
          </button>

          {/* Join Button: Marks presence AND Navigates to Video Conference */}
          <button 
            onClick={() => onJoinSession(channel.id, true)} 
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 ${theme.btn}`}
          >
            <Video size={16} /> Join
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN CLIENT VIEW ---
export default function RescueView() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setChannels(response.data);
      } catch (err) {
        console.error("Failed to fetch channels", err);
        setError("Failed to load rescue channels.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // --- HANDLE JOIN & NAVIGATION ---
  const handleJoinSession = async (channelId, isVideo = true) => {
    try {
      // 1. Call API to add user to "Active Participants" list in DB
      const response = await axios.post(`${API_URL}${channelId}/join_leave/`, {
        user_id: CURRENT_USER_ID 
      });

      const { status, totalParticipants, participants } = response.data;

      // 2. Update Local State (to show new count immediately)
      setChannels(prevChannels => prevChannels.map(ch => 
        ch.id === channelId 
          ? { ...ch, totalParticipants, participants } // Update count and avatar list
          : ch
      ));

      // 3. IF Video Mode was selected, Navigate to Zego Page
      if (isVideo) {
        navigate(`/conference/${channelId}`);
      }

    } catch (err) {
      console.error("Join failed", err);
      // Fallback: If API fails, try to navigate anyway so user isn't blocked
      if (isVideo) navigate(`/conference/${channelId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-500 gap-3">
        <Loader className="animate-spin" size={24} /> 
        <span className="font-bold text-sm tracking-wider uppercase">Loading Comms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-red-500 gap-3">
        <AlertCircle size={24} /> 
        <span className="font-bold">{error}</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-gray-50 dark:bg-[#050505] p-6">
      
      {/* Header Section (Client View) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Radio className="text-blue-600 dark:text-blue-400" size={24} />
           </div>
           <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Rescue Channels</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 font-medium">Real-time inter-agency communication</p>
           </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Map size={16} /> View Map
           </button>
        </div>
      </div>

      {/* Grid Layout */}
      {channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full pb-10">
          {channels.map((channel) => (
            <ConferenceChannelCard 
              key={channel.id} 
              channel={channel} 
              onJoinSession={handleJoinSession} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <Radio size={48} className="mb-4 opacity-20" />
          <p className="font-bold">No Active Channels</p>
          <p className="text-sm">Rescue operations are currently offline.</p>
        </div>
      )}
    </div>
  );
}