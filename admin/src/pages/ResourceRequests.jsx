import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Trash2, Pencil, Package, AlertCircle, 
  CheckCircle2, Search, X, Save, Clock, Truck, XCircle 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/resources';

export default function ResourceRequests() {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'pledges'
  const [requests, setRequests] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // --- 1. Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'requests') {
        const res = await axios.get(API_URL);
        setRequests(res.data);
      } else {
        const res = await axios.get(`${API_URL}/contributions/pending`);
        setPledges(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- 2. Request Management (CRUD) ---
  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${currentId}`, editForm);
      alert("Updated successfully");
      setIsEditOpen(false);
      fetchData();
    } catch (err) { alert("Update failed"); }
  };

  // --- 3. Pledge Management (Approve/Reject) ---
  const handleApprovePledge = async (id) => {
    try {
      await axios.put(`${API_URL}/contributions/${id}/approve`);
      alert("Contribution verified! Stock updated.");
      fetchData();
    } catch (err) { alert("Error approving"); }
  };

  const handleRejectPledge = async (id) => {
    if (!window.confirm("Reject this pledge?")) return;
    try {
      await axios.put(`${API_URL}/contributions/${id}/reject`);
      fetchData();
    } catch (err) { alert("Error rejecting"); }
  };

  // --- Helper: Open Edit ---
  const openEdit = (req) => {
    setEditForm({ ...req });
    setCurrentId(req.id);
    setIsEditOpen(true);
  };

  // --- Helper: Status Badge ---
  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
      'Fulfilled': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Expired': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status]}`}>{status}</span>;
  };

  // Filter requests for search
  const filteredRequests = requests.filter(r => 
    r.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <LayoutDashboard className="text-blue-600" /> Resource Admin
        </h1>
        
        {/* Tabs */}
        <div className="flex bg-white dark:bg-[#111] p-1 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
          >
            Manage Requests
          </button>
          <button 
            onClick={() => setActiveTab('pledges')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pledges' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
          >
            Verify Collections
            {pledges.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pledges.length}</span>}
          </button>
        </div>
      </div>

      {/* --- TAB 1: PENDING COLLECTIONS (The "Pledge" System) --- */}
      {activeTab === 'pledges' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl mb-6 flex items-start gap-3">
             <AlertCircle className="text-blue-600 mt-0.5" size={20} />
             <div>
               <h3 className="font-bold text-blue-900 dark:text-blue-200">Pending Collections</h3>
               <p className="text-sm text-blue-700 dark:text-blue-400">
                 These users have pledged to send items. Verify receipt before clicking "Collect" to update inventory.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pledges.map(pledge => (
              <div key={pledge.id} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-bl-xl">PENDING</div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                    <Package size={20} className="text-slate-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Donating</div>
                    <div className="text-lg font-black">{pledge.amount} x {pledge.ResourceRequest?.item || 'Item'}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-5 text-sm bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-lg">
                  <div className="flex justify-between"><span className="text-slate-500">Donor:</span> <span className="font-bold">{pledge.donorName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Contact:</span> <span className="font-bold">{pledge.contact}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date:</span> <span>{new Date(pledge.createdAt).toLocaleDateString()}</span></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleRejectPledge(pledge.id)} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1">
                    <XCircle size={16} /> Reject
                  </button>
                  <button onClick={() => handleApprovePledge(pledge.id)} className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-lg">
                    <CheckCircle2 size={16} /> Confirm Receipt
                  </button>
                </div>
              </div>
            ))}
            
            {pledges.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-slate-400 italic">No pending donations to verify.</div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: MANAGE REQUESTS (CRUD) --- */}
      {activeTab === 'requests' && (
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-zinc-900 text-xs font-bold uppercase text-slate-500 dark:text-zinc-500">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {req.item}
                      {req.urgency === 'Critical' && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">CRITICAL</span>}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{req.category}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{req.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span className="text-blue-600">{req.collected}</span> / <span className="text-slate-600">{req.required}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${Math.min((req.collected/req.required)*100, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(req.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit(req)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 rounded-lg">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteRequest(req.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && !loading && (
              <div className="p-10 text-center text-slate-400 italic">No requests found</div>
            )}
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Edit Request</h2>
              <button onClick={() => setIsEditOpen(false)}><X className="text-slate-400 hover:text-red-500"/></button>
            </div>
            
            <form onSubmit={handleUpdateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Item Name</label>
                  <input className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg outline-none" 
                    value={editForm.item} onChange={e => setEditForm({...editForm, item: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                  <select className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg"
                    value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                    <option>Active</option><option>Fulfilled</option><option>Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Collected</label>
                  <input type="number" className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg" 
                    value={editForm.collected} onChange={e => setEditForm({...editForm, collected: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Required</label>
                  <input type="number" className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg" 
                    value={editForm.required} onChange={e => setEditForm({...editForm, required: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                  <input className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg" 
                    value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Urgency</label>
                  <select className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg"
                    value={editForm.urgency} onChange={e => setEditForm({...editForm, urgency: e.target.value})}>
                    <option>Normal</option><option>High</option><option>Critical</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                <Save size={18} /> Update Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}