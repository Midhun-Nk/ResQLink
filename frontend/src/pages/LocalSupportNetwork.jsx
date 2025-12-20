import React, { useState } from 'react';
import { 
  Phone, MapPin, Users, Shield, Award, Search, 
  UserPlus, MessageCircle, Siren 
} from 'lucide-react';

// --- Mock Data ---
const initialGroups = [
  {
    id: 1,
    name: "NCC Unit 12 - Rapid Response",
    type: "Uniformed Force",
    members: 45,
    location: "Kochi, North Sector",
    status: "Active",
    specialty: ["Crowd Control", "Rescue", "Logistics"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NCC_flag.svg/1200px-NCC_flag.svg.png"
  },
  {
    id: 2,
    name: "NSS Kerala Volunteers",
    type: "Student Volunteer",
    members: 120,
    location: "Thrissur District",
    status: "Standby",
    specialty: ["Food Distribution", "Cleaning", "First Aid"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NSS-symbol.jpeg/800px-NSS-symbol.jpeg"
  },
  {
    id: 3,
    name: "Coastal Warriors (Fishermen)",
    type: "Civilian Rescue",
    members: 15,
    location: "Alappuzha Coast",
    status: "Deployed",
    specialty: ["Boat Rescue", "Water Navigation"],
    image: null 
  },
  {
    id: 4,
    name: "Trauma Care Unit",
    type: "Medical",
    members: 8,
    location: "Calicut City",
    status: "Active",
    specialty: ["Emergency Medical", "Ambulance"],
    image: null
  }
];

const LocalSupportNetwork = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Logic
  const filteredGroups = initialGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          group.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || group.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': 
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'Deployed': 
        return 'bg-red-100 text-red-700 border-red-200 animate-pulse dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'Standby': 
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      default: 
        return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-4 md:p-8 transition-colors duration-300">
      
      {/* --- Header Section --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              Local Support Network
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-lg">
              Connect with verified response teams, NGOs, and volunteer squads in your area.
            </p>
          </div>
          
          <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
            <UserPlus size={18} />
            Register Team
          </button>
        </div>
      </div>

      {/* --- Search & Filters --- */}
      <div className="max-w-7xl mx-auto mb-8 sticky top-4 z-20">
        <div className="bg-white dark:bg-[#0a0a0a] p-2 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-2">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by team name or location..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto p-1 md:p-0 no-scrollbar">
            {['All', 'Uniformed Force', 'Civilian Rescue', 'Medical'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border
                  ${filter === type 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30' 
                    : 'bg-white dark:bg-transparent text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            
            {/* Card Header / Status */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                  {group.image ? (
                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${group.image}')`}}></div>
                  ) : (
                    <Shield className="text-slate-400 dark:text-zinc-600" size={32} />
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(group.status)}`}>
                  {group.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">{group.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500 text-sm mb-5 font-medium">
                <MapPin size={16} />
                <span>{group.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {group.specialty.map((tag, idx) => (
                  <span key={idx} className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-zinc-400 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-100 dark:border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Divider */}
            <div className="border-t border-slate-100 dark:border-white/5 px-6 py-4 flex gap-6 bg-slate-50/50 dark:bg-white/[0.02]">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                 <Users size={16} className="text-blue-500" />
                 {group.members} Members
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                 <Award size={16} className="text-orange-500" />
                 Verified
               </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0 mt-2 flex gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                <Phone size={18} />
                Call
              </button>
              <button className="flex-1 bg-white dark:bg-transparent border-2 border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-zinc-400 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                <MessageCircle size={18} />
                Request
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-zinc-600">
              <Siren size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No teams found</h3>
            <p className="text-slate-500 dark:text-zinc-500">We couldn't find any teams matching your search in this area.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LocalSupportNetwork;