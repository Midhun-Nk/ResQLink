import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Plus, Trash2, Edit2, Save, X, 
  Radio, Loader, AlertCircle, CheckCircle2,
  Users, Activity, LogIn, LogOut
} from "lucide-react";

// --- SUB-COMPONENT: Status Toggle ---
const StatusToggle = ({ isLive, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!isLive)}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
      ${isLive 
        ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' 
        : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700'}
    `}
  >
    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
    <span className="text-xs font-bold uppercase tracking-wider">{isLive ? 'Live Active' : 'Offline'}</span>
  </button>
);

export default function RescueView() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: 'General',
    isLive: false
  });

const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;

  const API_URL = `${VITE_API_URL_PYTHON}/rescue-channels/`;

  // --- API CALLS ---
  const fetchChannels = async () => {
    try {
      const res = await axios.get(API_URL);
      setChannels(res.data);
    } catch (err) {
      showNotify("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChannels(); }, []);

  // --- HANDLERS ---
  
  // 1. JOIN / LEAVE ROOM LOGIC
  const handleJoinLeave = async (channelId) => {
    try {
      // Call the custom API endpoint
      const res = await axios.post(`${API_URL}${channelId}/join_leave/`, { user_id: 1 });
      
      const { status, totalParticipants } = res.data;
      
      // Update local state immediately
      setChannels(prevChannels => prevChannels.map(ch => 
        ch.id === channelId 
          ? { ...ch, totalParticipants: totalParticipants } 
          : ch
      ));

      if (status === 'joined') {
        showNotify("You joined the channel", "success");
      } else {
        showNotify("You left the channel", "default");
      }

    } catch (err) {
      console.error(err);
      showNotify("Action failed", "error");
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ title: '', description: '', sector: 'General', isLive: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (channel) => {
    setEditId(channel.id);
    setFormData({
      title: channel.title,
      description: channel.description,
      sector: channel.sector,
      isLive: channel.isLive // Serializer sends 'isLive', so we use it here
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this channel permanently?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      showNotify("Channel deleted", "success");
      fetchChannels();
    } catch (err) {
      showNotify("Delete failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- FIX: USE 'isLive' (camelCase) ---
    // Your serializer definition: isLive = serializers.BooleanField(...)
    // This means the API expects the key 'isLive', NOT 'is_live'.
    const payload = {
        title: formData.title,
        description: formData.description,
        sector: formData.sector,
        isLive: formData.isLive 
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}${editId}/`, payload);
        showNotify("Updated successfully", "success");
      } else {
        await axios.post(API_URL, payload);
        showNotify("Created successfully", "success");
      }
      setIsModalOpen(false);
      fetchChannels();
    } catch (err) {
      console.error(err.response?.data);
      // Show specific error from backend if available
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : "Save failed";
      showNotify(errMsg, "error");
    }
  };

  const showNotify = (msg, type = "default") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radio className="text-blue-600" /> Rescue Ops Admin
          </h1>
          <p className="text-gray-500">Manage communication channels</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
          <Plus size={20} /> Create Channel
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-top-2 ${
          notification.type === 'error' ? 'bg-red-500' : 
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-slate-800'
        } text-white`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* List */}
      <div className="max-w-6xl mx-auto grid gap-4">
        {loading ? <div className="text-center p-10"><Loader className="animate-spin inline"/></div> : 
          channels.map(channel => (
            <div key={channel.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 transition-all shadow-sm">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-gray-100 dark:bg-zinc-800 text-gray-500`}>
                    {channel.sector}
                  </span>
                  {channel.isLive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/> Live
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold">{channel.title}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-1">{channel.description}</p>
              </div>

              <div className="flex items-center gap-6">
                
                {/* Active Users Indicator */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-800">
                   <Users size={16} className="text-blue-500"/> 
                   <span>{channel.totalParticipants}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleJoinLeave(channel.id)}
                    className="p-2 hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-900/20 rounded-lg border border-transparent hover:border-emerald-200 transition-all"
                    title="Simulate Join/Leave"
                  >
                    <LogIn size={18} />
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(channel)} 
                    className="p-2 hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/20 rounded-lg border border-transparent hover:border-blue-200 transition-all"
                    title="Edit Channel"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(channel.id)} 
                    className="p-2 hover:bg-red-50 text-red-500 dark:hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-200 transition-all"
                    title="Delete Channel"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

            </div>
          ))
        }
        {channels.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                <p>No channels found. Create one to get started.</p>
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50 rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editId ? <Edit2 size={20} className="text-blue-500"/> : <Plus size={20} className="text-emerald-500"/>}
                {editId ? "Edit Channel" : "New Channel"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-red-500 transition-colors" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="channelForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Channel Name</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Flood Command Alpha"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Describe the purpose..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sector</label>
                    <select 
                      value={formData.sector}
                      onChange={e => setFormData({...formData, sector: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="General">General</option>
                      <option value="Fire">Fire & Rescue</option>
                      <option value="Medical">Medical</option>
                      <option value="Police">Police</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Status</label>
                    <StatusToggle 
                      isLive={formData.isLive} 
                      onChange={(val) => setFormData({...formData, isLive: val})} 
                    />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/50 rounded-b-3xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
              <button type="submit" form="channelForm" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}