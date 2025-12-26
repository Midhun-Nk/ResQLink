import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Truck, MapPin, Clock, AlertCircle, 
  CheckCircle, Search, Plus, Archive, ChevronRight, 
  Loader, X, Save, ShieldCheck 
} from 'lucide-react';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const API_URL = `${VITE_API_URL}/resources`;

const ResourceRequests = () => {
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Modal States ---
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isFulfillModalOpen, setFulfillModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Forms
  const [formData, setFormData] = useState({
    item: '', category: 'Food & Water', location: '', urgency: 'Normal', 
    required: '', deadline: '24 Hours', description: ''
  });

  // Contribution Form State
  const [fulfillAmount, setFulfillAmount] = useState('');
  const [contributor, setContributor] = useState({ name: '', contact: '' });

  // --- 1. Fetch Data from API ---
  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- 2. Handlers ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      alert("Request Posted Successfully!");
      setCreateModalOpen(false);
      fetchRequests();
      setFormData({ item: '', category: 'Food & Water', location: '', urgency: 'Normal', required: '', deadline: '', description: '' });
    } catch (err) { alert("Failed to post request"); }
  };

  const handleFulfillSubmit = async (e) => {
    e.preventDefault();
    if (!fulfillAmount || fulfillAmount <= 0) return alert("Enter valid quantity");
    if (!contributor.name || !contributor.contact) return alert("Please fill in your contact details");

    try {
      // CHANGED: Post to 'contribute' endpoint instead of direct update
      await axios.post(`${API_URL}/contribute`, { 
        resourceRequestId: selectedRequest.id,
        amount: fulfillAmount,
        donorName: contributor.name,
        contact: contributor.contact
      });

      alert("Thank you! Your donation pledge has been sent to the admins for verification.");
      
      // Reset and Close
      setFulfillModalOpen(false);
      setFulfillAmount('');
      setContributor({ name: '', contact: '' });
      
      // We do NOT fetchRequests() immediately because the count only updates after Admin approval.
    } catch (err) { 
      console.error(err);
      alert("Failed to send pledge. Please try again."); 
    }
  };

  const openFulfillModal = (req) => {
    setSelectedRequest(req);
    setFulfillModalOpen(true);
  };

  // --- Filtering Logic ---
  const filteredRequests = requests.filter(req => {
    const matchesCategory = filter === 'All' || req.category === filter;
    const matchesSearch = req.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
             
             <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95">
               <Plus size={20} />
               Request Material
             </button>
           </div>
        </div>
      </div>

      {/* --- Stats Row --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         {[
           { label: 'Active Requests', val: requests.length, icon: AlertCircle, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
           { label: 'Items Delivered', val: requests.reduce((acc, curr) => acc + curr.collected, 0), icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
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
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className={`
               w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all
               bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
               dark:bg-[#0a0a0a] dark:border-white/10 dark:text-white dark:placeholder:text-zinc-600 dark:focus:ring-white/10 dark:focus:border-white/30
             `}
           />
        </div>
      </div>

      {/* --- Request Cards Grid --- */}
      {loading ? <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-500" size={40}/></div> : (
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
                   onClick={() => openFulfillModal(req)}
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
      )}

      {/* --- Create Request Modal --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Supplies</h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} placeholder="Item Name (e.g. Rice Bags)" />
              <div className="grid grid-cols-2 gap-4">
                 <select className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {['Food & Water', 'Medical', 'Shelter', 'Clothing', 'Logistics'].map(c => <option key={c}>{c}</option>)}
                 </select>
                 <select className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                    <option>Normal</option><option>High</option><option>Critical</option>
                 </select>
              </div>
              <input required type="number" className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.required} onChange={e => setFormData({...formData, required: e.target.value})} placeholder="Quantity Required" />
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" />
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} placeholder="Deadline (e.g. 24 Hours)" />
              <textarea required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Details..." />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4"><Save size={18} className="inline mr-2"/> Post Request</button>
            </form>
          </div>
        </div>
      )}

      {/* --- Fulfill Modal (Send Supplies) --- */}
      {isFulfillModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl">
             <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Supplies</h2>
                  <p className="text-sm text-slate-500 mt-1">For: <span className="font-bold text-blue-600">{selectedRequest.item}</span></p>
               </div>
               <button onClick={() => setFulfillModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleFulfillSubmit} className="space-y-4">
                <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl text-center">
                   <p className="text-xs font-bold uppercase text-slate-400">Still Needed</p>
                   <p className="text-3xl font-black text-slate-900 dark:text-white">{Math.max(0, selectedRequest.required - selectedRequest.collected)}</p>
                </div>

                {/* Name Input */}
                <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name / Org</label>
                   <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                     value={contributor.name} onChange={e => setContributor({...contributor, name: e.target.value})} placeholder="John Doe" />
                </div>

                {/* Contact Input */}
                <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Number</label>
                   <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                     value={contributor.contact} onChange={e => setContributor({...contributor, contact: e.target.value})} placeholder="+91 98765 43210" />
                </div>

                {/* Quantity Input */}
                <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quantity Sending</label>
                   <input required type="number" className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                     value={fulfillAmount} onChange={e => setFulfillAmount(e.target.value)} placeholder="Enter quantity" />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl flex gap-3 items-start border border-blue-100 dark:border-blue-900/20">
                    <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                       This is a pledge. An admin will contact you to verify and collect the items before updating the live count.
                    </p>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-2 flex items-center justify-center gap-2">
                   <Truck size={18} /> Send Pledge
                </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResourceRequests;