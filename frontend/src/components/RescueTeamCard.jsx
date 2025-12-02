import React, { use } from 'react';
import { 
  Video, 
  Mic, 
  Activity, 
  ShieldAlert, 
  Stethoscope, 
  Flame, 
  Radio, 
  Navigation,
  Signal,
  Plus
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// --- THE CARD COMPONENT ---
const ConferenceChannelCard = ({ channel, onJoin }) => {
    const navigate = useNavigate();
  const getSectorTheme = (sector) => {
    switch(sector) {
      case 'Medical': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', btn: 'bg-rose-600 hover:bg-rose-700', icon: <Stethoscope size={18} /> };
      case 'Fire': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700', icon: <Flame size={18} /> };
      case 'Police': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700', icon: <ShieldAlert size={18} /> };
      default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', btn: 'bg-slate-800 hover:bg-slate-900', icon: <Radio size={18} /> };
    }
  };

  const theme = getSectorTheme(channel.sector);

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${theme.border} bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      <div className={`h-1.5 w-full ${theme.text.replace('text', 'bg')}/30`}></div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.bg} ${theme.text}`}>
            {theme.icon} {channel.sector}
          </span>
          {channel.isLive ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-50 rounded-lg border border-red-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-600">LIVE</span>
            </div>
          ) : (
             <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg"><Signal size={12} /> Offline</span>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{channel.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{channel.description}</p>
        </div>

        <div className="mt-auto mb-5">
          <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
             <div className="flex items-center -space-x-2">
                {channel.participants.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"/>
                ))}
             </div>
             <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
               <Activity size={14} className={channel.isLive ? "text-emerald-500" : "text-gray-400"} />
               {channel.totalParticipants} Active
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button onClick={() => onJoin(channel.id, 'audio')} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            <Mic size={16} /> Listen
          </button>
          <button onClick={() => navigate(`/conference/${channel.id}`)}className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md shadow-${theme.btn.split('-')[1]}-200 ${theme.btn} transition-transform active:scale-95`}>
            <Video size={16} /> Join
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function RescueTeamCard({team}) {
  
  const channels = [
    { id: '1', title: 'Kerala Flood Command', description: 'Rescue boat coordination.', sector: 'Fire', isLive: true, totalParticipants: 12, participants: ['https://i.pravatar.cc/150?u=1'] },
    { id: '2', title: 'Trauma Unit Alpha', description: 'Medical triage support.', sector: 'Medical', isLive: true, totalParticipants: 8, participants: ['https://i.pravatar.cc/150?u=2'] },
    { id: '3', title: 'Traffic Sector 7', description: 'Route clearance.', sector: 'Police', isLive: false, totalParticipants: 3, participants: ['https://i.pravatar.cc/150?u=3'] },
    { id: '4', title: 'Public Helpline', description: 'General inquiries.', sector: 'General', isLive: true, totalParticipants: 24, participants: ['https://i.pravatar.cc/150?u=4'] }
  ];

  const handleJoin = (id, type) => { console.log(id, type); };

  return (
    <div className="w-full bg-gray-50 p-6">
      
      {/* HEADER - Only renders once */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
          <p className="text-gray-500">Real-time inter-agency communication</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"><Navigation size={16} /> Map</button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"><Plus size={16} /> New</button>
        </div>
      </div>

      {/* GRID - Forced to 2 Columns */}
     <div className="grid gap-6 grid-cols-2">

        {channels.map((channel) => (
          <ConferenceChannelCard key={channel.id} channel={channel} onJoin={handleJoin} />
        ))}
      </div>

    </div>
  );
}