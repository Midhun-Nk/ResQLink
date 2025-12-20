import React from 'react';
import { 
  Video, Mic, Activity, ShieldAlert, Stethoscope, 
  Flame, Radio, Signal, Plus, Map
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// --- THE CARD COMPONENT ---
const ConferenceChannelCard = ({ channel, onJoin }) => {
  const navigate = useNavigate();
  
  // Theme Logic: Solid colors for Dark Mode to prevent "dotted" bleed-through
  const getSectorTheme = (sector) => {
    switch(sector) {
      case 'Medical': return { 
        bg: 'bg-rose-50 dark:bg-[#1a0505]', // Solid very dark rose
        border: 'border-rose-200 dark:border-rose-900/30', 
        text: 'text-rose-700 dark:text-rose-400', 
        btn: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600',
        icon: <Stethoscope size={18} /> 
      };
      case 'Fire': return { 
        bg: 'bg-orange-50 dark:bg-[#1a0a05]', // Solid very dark orange
        border: 'border-orange-200 dark:border-orange-900/30', 
        text: 'text-orange-700 dark:text-orange-400', 
        btn: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600',
        icon: <Flame size={18} /> 
      };
      case 'Police': return { 
        bg: 'bg-blue-50 dark:bg-[#050a1a]', // Solid very dark blue
        border: 'border-blue-200 dark:border-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400', 
        btn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600',
        icon: <ShieldAlert size={18} /> 
      };
      default: return { 
        bg: 'bg-slate-50 dark:bg-[#111]', // Solid dark gray
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
      /* Light Mode */
      bg-white shadow-sm hover:shadow-lg hover:-translate-y-1
      /* Dark Mode: Solid Deep Black (No Transparency) */
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
                {channel.participants.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] object-cover shadow-sm"/>
                ))}
                {channel.totalParticipants > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
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
          <button 
            onClick={() => onJoin(channel.id, 'audio')} 
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Mic size={16} /> Listen
          </button>
          <button 
            onClick={() => navigate(`/conference/${channel.id}`)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 ${theme.btn}`}
          >
            <Video size={16} /> Join
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export const RescueView = () => {
  // Mock Data
  const channels = [
    { id: '1', title: 'Kerala Flood Command', description: 'Rescue boat coordination channel.', sector: 'Fire', isLive: true, totalParticipants: 12, participants: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=8'] },
    { id: '2', title: 'Trauma Unit Alpha', description: 'Medical triage support and ambulance routing.', sector: 'Medical', isLive: true, totalParticipants: 8, participants: ['https://i.pravatar.cc/150?u=2'] },
    { id: '3', title: 'Traffic Sector 7', description: 'Route clearance for emergency vehicles.', sector: 'Police', isLive: false, totalParticipants: 3, participants: ['https://i.pravatar.cc/150?u=3'] },
    { id: '4', title: 'Public Helpline', description: 'General inquiries and volunteer coordination.', sector: 'General', isLive: true, totalParticipants: 24, participants: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=9'] }
  ];

  const handleJoin = (id, type) => { console.log(id, type); };

  return (
    // Solid background container to block any global patterns
    <div className="animate-in fade-in duration-500 min-h-screen bg-gray-50 dark:bg-[#050505] p-6">
      
      {/* Header Section */}
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
           <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Plus size={16} /> New Channel
           </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full pb-10">
        {channels.map((channel) => (
          <ConferenceChannelCard key={channel.id} channel={channel} onJoin={handleJoin} />
        ))}
      </div>
    </div>
  );
};