import React, { useState } from 'react';
import { 
  Package, Truck, MapPin, Clock, AlertCircle, 
  CheckCircle, Filter, Search, Plus, Archive, ChevronRight 
} from 'lucide-react';

// --- Mock Data: Active Requests ---
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
    requester: "Camp Officer: Rahul K.",
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
    requester: "Volunteer: Anjali M.",
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
    requester: "Dr. Ahmed",
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
    requester: "NGO Link",
    description: "Matta rice needed for community kitchen serving 300 people."
  }
];

const ResourceRequests = () => {
  const [filter, setFilter] = useState('All');

  // Filter Logic
  const filteredRequests = initialRequests.filter(req => 
    filter === 'All' || req.category === filter
  );

  // Helper: Urgency Styles
  const getUrgencyStyle = (level) => {
    switch(level) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  // Helper: Category Icons
  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Medical': return <div className="p-2 bg-red-50 text-red-500 rounded-lg"><Plus size={20} /></div>;
      case 'Food & Water': return <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Archive size={20} /></div>;
      default: return <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Package size={20} /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">

      {/* --- Hero Section --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
           {/* Abstract Background Element */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-10 translate-x-10"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
               <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full text-sm text-blue-300 font-medium mb-4 border border-slate-700">
                 <Truck size={14} />
                 <span>Logistics & Supply Chain</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-bold mb-4">Resource Requests</h1>
               <p className="text-slate-400 max-w-xl text-lg">
                 Directly ship or drop off essential materials to relief camps. 
                 Real-time inventory tracking prevents wastage and duplication.
               </p>
             </div>
             
             <div className="flex gap-3">
               <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2">
                 <Plus size={20} />
                 Request Material
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* --- Stats Row --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         {[
           { label: 'Active Requests', val: '124', icon: AlertCircle, color: 'text-orange-500' },
           { label: 'Items Delivered', val: '8.5k', icon: CheckCircle, color: 'text-emerald-500' },
           { label: 'Camps Served', val: '12', icon: MapPin, color: 'text-blue-500' },
           { label: 'Transit Vehicles', val: '45', icon: Truck, color: 'text-purple-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
               <stat.icon size={24} />
             </div>
             <div>
               <h4 className="text-2xl font-bold text-slate-800">{stat.val}</h4>
               <p className="text-xs text-slate-500 font-medium uppercase">{stat.label}</p>
             </div>
           </div>
         ))}
      </div>

      {/* --- Filters --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['All', 'Food & Water', 'Medical', 'Shelter', 'Clothing'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border ${
                filter === cat 
                ? 'bg-slate-800 text-white border-slate-800' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text"
             placeholder="Search items or camps..."
             className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
           />
        </div>
      </div>

      {/* --- Request Cards Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((req) => {
          const percentage = Math.min((req.collected / req.required) * 100, 100);
          
          return (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* Card Header */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex gap-4">
                   {getCategoryIcon(req.category)}
                   <div>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{req.category}</span>
                     <h3 className="text-lg font-bold text-slate-900 leading-tight mt-1">{req.item}</h3>
                   </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getUrgencyStyle(req.urgency)}`}>
                  {req.urgency}
                </span>
              </div>

              {/* Card Body */}
              <div className="px-6 space-y-3 flex-1">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {req.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <MapPin size={14} className="text-slate-400" />
                  {req.location}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                   <Clock size={14} />
                   <span>Expires in: <span className="text-slate-700 font-bold">{req.deadline}</span></span>
                </div>
              </div>

              {/* Progress Bar Area */}
              <div className="px-6 py-4 mt-2">
                <div className="flex justify-between text-sm mb-1 font-bold">
                  <span className={percentage >= 100 ? "text-emerald-600" : "text-blue-600"}>
                    {req.collected} <span className="text-slate-400 font-normal">collected</span>
                  </span>
                  <span className="text-slate-900">
                    {req.required} <span className="text-slate-400 font-normal">needed</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                <button 
                   disabled={percentage >= 100}
                   className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                     percentage >= 100 
                     ? 'bg-emerald-100 text-emerald-600 cursor-default'
                     : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-slate-300'
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