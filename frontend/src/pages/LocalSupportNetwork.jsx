import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Phone, MapPin, Users, Shield, Award, Search, 
  UserPlus, MessageCircle, Siren, Loader, X, Save,
  Pencil, Trash2, Send, AlertTriangle 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1/support-groups';

export default function LocalSupportNetwork() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- Modals State ---
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // New Request Modal
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // The team being requested

  const REQUEST_API_URL = 'http://localhost:5000/api/v1/help-requests'; // <--- NEW API URL

// ... inside the component ...

  // --- 3. Handle Help Request (Connected to Backend) ---
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    // UI Feedback
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML; // Save icon+text
    btn.innerText = "Sending...";
    btn.disabled = true;

    try {
        const payload = {
            ...requestData,
            supportGroupId: selectedGroup.id // IMPORTANT: Link request to specific team
        };

        await axios.post(REQUEST_API_URL, payload);

        alert(`Request Sent Successfully!\n\nTeam "${selectedGroup.name}" has been notified.\nPriority: ${requestData.urgency}`);
        
        setIsRequestModalOpen(false);
        setRequestData({ requesterName: '', contact: '', location: '', urgency: 'Normal', message: '' });
    
    } catch (err) {
        console.error(err);
        alert("Failed to send request. Please check your connection.");
    } finally {
        // Reset UI
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
  };

  // Forms
  const [formData, setFormData] = useState({
    name: '', type: 'Uniformed Force', location: '', members: '', contactNumber: '', specialty: '', image: ''
  });

  const [requestData, setRequestData] = useState({
    requesterName: '', contact: '', location: '', urgency: 'Normal', message: ''
  });

  // --- 1. Fetch Data ---
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filter !== 'All') params.type = filter;
      const res = await axios.get(API_URL, { params });
      setGroups(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchGroups(), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filter]);

  // --- 2. Handle Register/Update Team ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, specialty: typeof formData.specialty === 'string' ? formData.specialty.split(',') : formData.specialty };
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, payload);
        alert("Team Updated!");
      } else {
        await axios.post(API_URL, payload);
        alert("Team Registered!");
      }
      closeRegisterModal();
      fetchGroups(); 
    } catch (err) { alert("Operation failed"); }
  };

  

  // --- 4. Helpers ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      await axios.delete(`${API_URL}/${id}`);
      fetchGroups();
    }
  };

  const openEditModal = (group) => {
    setFormData({
        name: group.name, type: group.type, location: group.location, members: group.members,
        contactNumber: group.contactNumber, specialty: group.specialty.join(', '), image: group.image || ''
    });
    setCurrentId(group.id);
    setIsEditing(true);
    setIsRegisterModalOpen(true);
  };

  const openRequestModal = (group) => {
    setSelectedGroup(group);
    setIsRequestModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false); setIsEditing(false); setCurrentId(null);
    setFormData({ name: '', type: 'Uniformed Force', location: '', members: '', contactNumber: '', specialty: '', image: '' });
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Deployed': return 'bg-red-100 text-red-700 border-red-200 animate-pulse dark:bg-red-500/10 dark:text-red-400';
      case 'Standby': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-4 md:p-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              Local Support Network
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-lg">Connect with verified response teams, NGOs, and volunteer squads.</p>
          </div>
          <button onClick={() => { setIsEditing(false); setIsRegisterModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
            <UserPlus size={18} /> Register Team
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-8 sticky top-4 z-30">
        <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20} />
            <input type="text" placeholder="Search teams..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white font-medium" 
                   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto p-1 md:p-0">
            {['All', 'Uniformed Force', 'Student Volunteer', 'Civilian Rescue', 'Medical'].map((type) => (
              <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filter === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/50 dark:bg-transparent text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/10 hover:bg-slate-50'}`}>{type}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? ( <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-500" size={40} /></div> ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="relative bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group-card">
              
              {/* Admin Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-card-hover:opacity-100 transition-opacity z-10">
                 <button onClick={() => openEditModal(group)} className="p-2 bg-white dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm border border-slate-100 dark:border-zinc-700"><Pencil size={16} /></button>
                 <button onClick={() => handleDelete(group.id, group.name)} className="p-2 bg-white dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 shadow-sm border border-slate-100 dark:border-zinc-700"><Trash2 size={16} /></button>
              </div>
              <style>{`.group-card:hover .opacity-0 { opacity: 1; }`}</style>

              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                    <img src={group.image || 'fallback'} alt={group.name} className="w-full h-full object-cover" 
                         onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                    <div className="hidden absolute"><Shield className="text-slate-400 dark:text-zinc-600" size={32} /></div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(group.status)}`}>{group.status}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight pr-8">{group.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500 text-sm mb-5 font-medium">
                  <MapPin size={16} /> <span>{group.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.specialty.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-zinc-400 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-100 dark:border-white/5">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 px-6 py-4 flex gap-6 bg-slate-50/50 dark:bg-white/[0.02]">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide"><Users size={16} className="text-blue-500" /> {group.members} Members</div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide"><Award size={16} className="text-orange-500" /> Verified</div>
              </div>

              <div className="p-4 pt-0 mt-2 flex gap-3">
                <button onClick={() => window.open(`tel:${group.contactNumber}`)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                  <Phone size={18} /> Call
                </button>
                {/* Request Button */}
                <button onClick={() => openRequestModal(group)} className="flex-1 bg-white dark:bg-transparent border-2 border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-700 dark:text-zinc-400 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                  <MessageCircle size={18} /> Request
                </button>
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-zinc-600"><Siren size={40} /></div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No teams found</h3>
            </div>
          )}
        </div>
      )}

      {/* --- Register/Edit Modal --- */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Update Team' : 'Register Team'}</h2>
              <button onClick={closeRegisterModal} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Form fields same as before... simplified for brevity in this display */}
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Team Name" />
              <div className="grid grid-cols-2 gap-4">
                 <select className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Uniformed Force</option><option>Student Volunteer</option><option>Civilian Rescue</option><option>Medical</option>
                 </select>
                 <input type="number" required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} placeholder="Members" />
              </div>
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" />
              <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} placeholder="Contact" />
              <input className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="Specialties (comma separated)" />
              <input className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Image URL (optional)" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2"><Save size={18} /> Save Team</button>
            </form>
          </div>
        </div>
      )}

      {/* --- Request Assistance Modal (New) --- */}
      {isRequestModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request Assistance</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">To: <span className="font-bold text-blue-600">{selectedGroup.name}</span></p>
              </div>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Normal', 'Urgent', 'Critical'].map(level => (
                        <button type="button" key={level} onClick={() => setRequestData({...requestData, urgency: level})}
                            className={`py-2 rounded-lg text-xs font-bold border transition-all ${requestData.urgency === level 
                                ? (level === 'Critical' ? 'bg-red-600 text-white border-red-600' : level === 'Urgent' ? 'bg-orange-500 text-white border-orange-500' : 'bg-blue-600 text-white border-blue-600') 
                                : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500'}`}>
                            {level}
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
                <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                  value={requestData.requesterName} onChange={e => setRequestData({...requestData, requesterName: e.target.value})} placeholder="Jane Doe" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location Required</label>
                <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                  value={requestData.location} onChange={e => setRequestData({...requestData, location: e.target.value})} placeholder="Building 4, Sector 7" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Number</label>
                <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500" 
                  value={requestData.contact} onChange={e => setRequestData({...requestData, contact: e.target.value})} placeholder="+91 00000 00000" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Request Details</label>
                <textarea required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 outline-none focus:border-blue-500 h-24 resize-none" 
                  value={requestData.message} onChange={e => setRequestData({...requestData, message: e.target.value})} placeholder="We need 3 people for..." />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-3 flex gap-3 items-start">
                 <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                 <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">Only use "Critical" for life-threatening situations. False alerts may lead to bans.</p>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white font-bold py-4 rounded-xl mt-2 flex items-center justify-center gap-2">
                <Send size={18} /> Send Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}