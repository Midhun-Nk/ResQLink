import React, { useState } from 'react';
import { 
  Phone, MapPin, Users, Shield, Award, Search, 
  Filter, UserPlus, ArrowUpRight, MessageCircle 
} from 'lucide-react';

// --- Mock Data: Registered Support Groups ---
const initialGroups = [
  {
    id: 1,
    name: "NCC Unit 12 - Rapid Response",
    type: "Uniformed Force",
    members: 45,
    location: "Kochi, North Sector",
    status: "Active",
    specialty: ["Crowd Control", "Rescue", "Logistics"],
    phone: "+91 98765 43210",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NCC_flag.svg/1200px-NCC_flag.svg.png" // Placeholder
  },
  {
    id: 2,
    name: "NSS Kerala Volunteers",
    type: "Student Volunteer",
    members: 120,
    location: "Thrissur District",
    status: "Standby",
    specialty: ["Food Distribution", "Cleaning", "First Aid"],
    phone: "+91 99887 76655",
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
    phone: "+91 91234 56789",
    image: null // Will use fallback
  },
  {
    id: 4,
    name: "Trauma Care Unit",
    type: "Medical",
    members: 8,
    location: "Calicut City",
    status: "Active",
    specialty: ["Emergency Medical", "Ambulance"],
    phone: "+91 90000 11111",
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Deployed': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case 'Standby': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      
      {/* --- Header Section --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="text-blue-600" size={36} />
              Local Support Network
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Connect with verifyied response teams, NGOs, and volunteer squads in your area.
            </p>
          </div>
          
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-slate-300">
            <UserPlus size={18} />
            Register Your Team
          </button>
        </div>
      </div>

      {/* --- Search & Filters --- */}
      <div className="max-w-7xl mx-auto mb-8 sticky top-4 z-10">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-2">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by team name or location..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto p-1 md:p-0 no-scrollbar">
            {['All', 'Uniformed Force', 'Civilian Rescue', 'Medical'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border ${
                  filter === type 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
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
          <div key={group.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            
            {/* Card Header / Status */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                  {group.image ? (
                     // In real app, use normal <img />
                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${group.image}')`}}></div>
                  ) : (
                    <Shield className="text-slate-400" size={28} />
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(group.status)}`}>
                  {group.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{group.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <MapPin size={16} />
                <span>{group.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {group.specialty.map((tag, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Divider */}
            <div className="border-t border-slate-100 px-6 py-3 flex gap-6 bg-slate-50/50">
               <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                 <Users size={18} className="text-blue-500" />
                 {group.members} Members
               </div>
               <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                 <Award size={18} className="text-orange-500" />
                 Verified
               </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0 mt-2 flex gap-3">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                <Phone size={18} />
                Call Now
              </button>
              <button className="flex-1 bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                <MessageCircle size={18} />
                Request
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-600">No teams found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LocalSupportNetwork;