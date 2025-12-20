import React, { useState } from 'react';
import { 
  Package, Truck, MapPin, Clock, AlertCircle, 
  CheckCircle, Filter, Search, Plus, Archive, ChevronRight, Activity 
} from 'lucide-react';

// --- Mock Data ---
const initialRequests = [
  {
    id: 1,
    item: "Blankets & Bedsheets",
    category: "Shelter",
    location: "Govt High School Camp, Wayanad",
    urgency: "Critical",
    required: 500,
    collected: 320,
    deadline: "24 Hours",
    description: "Urgent need for clean woolen blankets for elderly and children displaced by landslide."
  },
  {
    id: 2,
    item: "Drinking Water (20L Cans)",
    category: "Food & Water",
    location: "Community Hall, Nilambur",
    urgency: "High",
    required: 200,
    collected: 45,
    deadline: "Immediate",
    description: "Clean drinking water supply cut off. Need sealed 20L cans."
  },
  {
    id: 3,
    item: "Paracetamol & Dettol",
    category: "Medical",
    location: "Primary Health Center, District 4",
    urgency: "Normal",
    required: 1000,
    collected: 850,
    deadline: "3 Days",
    description: "Basic first aid kits and fever medication for flood victims."
  },
  {
    id: 4,
    item: "Rice Bags (10kg)",
    category: "Food & Water",
    location: "Relief Base 2, Aluva",
    urgency: "High",
    required: 50,
    collected: 0,
    deadline: "48 Hours",
    description: "Matta rice needed for community kitchen serving 300 people."
  }
];

const ResourceRequests = () => {
  const [filter, setFilter] = useState('All');

  const filteredRequests = initialRequests.filter(req => 
    filter === 'All' || req.category === filter
  );

  // Helper: Urgency Styles
  const getUrgencyStyle = (level) => {
    switch(level) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200 animate-pulse dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    }
  };

  // Helper: Category Icons
  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Medical': return <div className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl"><Plus size={20} /></div>;
      case 'Food & Water': return <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl"><Archive size={20} /></div>;
      default: return <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl"><Package size={20} /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-4 md:p-8 transition-colors duration-300">

      {/* --- Hero Section --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-slate-900 dark:bg-[#0a0a0a] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl dark:shadow-none border border-transparent dark:border-white/10">
           {/* Abstract Background Element */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-20 translate-x-20"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
               <div className="inline-flex items-center gap-2 bg-slate-800/50 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sm text-blue-300 dark:text-blue-200 font-medium mb-4 border border-slate-700 dark:border-white/10">
                 <Truck size={14} />
                 <span>Logistics & Supply Chain</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Resource Requests</h1>
               <p className="text-slate-400 dark:text-zinc-400 max-w-xl text-lg font-medium">
                 Directly ship or drop off essential materials to relief camps. 
                 Real-time inventory tracking prevents wastage.
               </p>
             </div>
             
             <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95">
               <Plus size={20} />
               Request Material
             </button>
           </div>
        </div>
      </div>

      {/* --- Stats Row --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         {[
           { label: 'Active Requests', val: '124', icon: AlertCircle, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
           { label: 'Items Delivered', val: '8.5k', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
           { label: 'Camps Served', val: '12', icon: MapPin, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
           { label: 'Transit Vehicles', val: '45', icon: Truck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-xl ${stat.color}`}>
               <stat.icon size={24} />
             </div>
             <div>
               <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{stat.val}</h4>
               <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</p>
             </div>
           </div>
         ))}
      </div>

      {/* --- Filters --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-2 z-20 bg-slate-50/95 dark:bg-[#050505]/95 backdrop-blur-sm py-2">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {['All', 'Food & Water', 'Medical', 'Shelter', 'Clothing'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border
                ${filter === cat 
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:border-white/10 dark:hover:bg-white/5'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
           <input 
             type="text"
             placeholder="Search items or camps..."
             className={`
               w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all
               bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
               dark:bg-[#0a0a0a] dark:border-white/10 dark:text-white dark:placeholder:text-zinc-600 dark:focus:ring-white/10 dark:focus:border-white/30
             `}
           />
        </div>
      </div>

      {/* --- Request Cards Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((req) => {
          const percentage = Math.min((req.collected / req.required) * 100, 100);
          
          return (
            <div key={req.id} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
              
              {/* Card Header */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex gap-4">
                   {getCategoryIcon(req.category)}
                   <div>
                     <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{req.category}</span>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{req.item}</h3>
                   </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getUrgencyStyle(req.urgency)}`}>
                  {req.urgency}
                </span>
              </div>

              {/* Card Body */}
              <div className="px-6 space-y-4 flex-1">
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {req.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 font-bold bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  <MapPin size={14} className="text-slate-400 dark:text-zinc-600 shrink-0" />
                  <span className="truncate">{req.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 font-medium">
                   <Clock size={14} />
                   <span>Expires in: <span className="text-slate-700 dark:text-zinc-300 font-bold">{req.deadline}</span></span>
                </div>
              </div>

              {/* Progress Bar Area */}
              <div className="px-6 py-5 mt-2">
                <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider">
                  <span className={percentage >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}>
                    {req.collected} <span className="text-slate-400 dark:text-zinc-600 font-normal normal-case">collected</span>
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {req.required} <span className="text-slate-400 dark:text-zinc-600 font-normal normal-case">needed</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${percentage >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <button 
                   disabled={percentage >= 100}
                   className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                     percentage >= 100 
                     ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                     : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white shadow-lg'
                   }`}
                >
                  {percentage >= 100 ? (
                    <>
                      <CheckCircle size={18} />
                      Goal Reached
                    </>
                  ) : (
                    <>
                      <Truck size={18} />
                      I can Send This
                      <ChevronRight size={16} className="opacity-50" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceRequests;