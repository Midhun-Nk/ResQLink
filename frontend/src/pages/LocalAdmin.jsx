import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, CheckCircle2, AlertTriangle, MapPin, Phone, 
  Trash2, ArrowRight, Activity, Shield, Loader, RefreshCw 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1/help-requests';

export default function AdminLocal() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Fetch Data ---
  const fetchRequests = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Optional: Auto-refresh every 30 seconds for a "Live" feel
    const interval = setInterval(() => fetchRequests(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Actions ---
  const updateStatus = async (id, newStatus) => {
    // Optimistic Update (Update UI instantly)
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status on server");
      fetchRequests(); // Revert on fail
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this request record?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- Filtering for Columns ---
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activeRequests = requests.filter(r => r.status === 'In Progress');
  const resolvedRequests = requests.filter(r => r.status === 'Resolved');

  // --- Helper Components ---
  const UrgencyBadge = ({ level }) => {
    const styles = {
      Critical: "bg-red-500 text-white animate-pulse shadow-red-500/50",
      Urgent: "bg-orange-500 text-white",
      Normal: "bg-blue-500 text-white"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${styles[level] || styles.Normal}`}>
        {level}
      </span>
    );
  };

  const RequestCard = ({ req }) => (
    <div className={`bg-white dark:bg-[#111] p-4 rounded-xl border-l-4 shadow-sm mb-4 transition-all hover:translate-y-[-2px] hover:shadow-md
      ${req.urgency === 'Critical' ? 'border-l-red-500 dark:border-l-red-600' : 'border-l-slate-200 dark:border-l-zinc-700'}
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <UrgencyBadge level={req.urgency} />
        <span className="text-[10px] font-mono text-slate-400">#{req.id}</span>
      </div>

      {/* Content */}
      <h4 className="font-bold text-slate-900 dark:text-white">{req.requesterName}</h4>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
        <MapPin size={12} /> {req.location}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
        <Phone size={12} /> <a href={`tel:${req.contact}`} className="hover:text-blue-500">{req.contact}</a>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-white/5 p-2 rounded-lg border border-slate-100 dark:border-white/5">
        "{req.message}"
      </p>

      {/* Team Info */}
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-500">
        <Shield size={12} className="text-blue-500"/>
        Assigned: {req.SupportGroup ? req.SupportGroup.name : 'Unknown Team'}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
        <button onClick={() => handleDelete(req.id)} className="text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>

        {/* Status Actions based on current status */}
        {req.status === 'Pending' && (
          <button 
            onClick={() => updateStatus(req.id, 'In Progress')}
            className="bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            Dispatch <ArrowRight size={12} />
          </button>
        )}

        {req.status === 'In Progress' && (
          <button 
            onClick={() => updateStatus(req.id, 'Resolved')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            Resolve <CheckCircle2 size={12} />
          </button>
        )}
        
        {req.status === 'Resolved' && (
           <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
             <CheckCircle2 size={12}/> Done
           </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-6 transition-colors duration-300">
      
      {/* --- Dashboard Header --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-red-600" /> MISSION CONTROL
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm mt-1">Real-time assistance coordination</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Feed
          </div>
          <button onClick={() => fetchRequests(true)} disabled={refreshing} className="p-2 bg-white dark:bg-[#111] rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-all">
            <RefreshCw size={20} className={refreshing ? 'animate-spin text-blue-500' : 'text-slate-500'} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-500" size={40} /></div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: PENDING */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-slate-200 dark:border-zinc-800 h-fit">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" /> Incoming
              </h3>
              <span className="bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingRequests.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingRequests.map(req => <RequestCard key={req.id} req={req} />)}
              {pendingRequests.length === 0 && <div className="text-center py-10 text-slate-400 text-xs italic">No new alerts</div>}
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-900/30 h-fit">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Clock size={18} /> Active / Assigned
              </h3>
              <span className="bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">
                {activeRequests.length}
              </span>
            </div>
            <div className="space-y-3">
              {activeRequests.map(req => <RequestCard key={req.id} req={req} />)}
              {activeRequests.length === 0 && <div className="text-center py-10 text-slate-400 text-xs italic">No active missions</div>}
            </div>
          </div>

          {/* Column 3: RESOLVED */}
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 h-fit">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={18} /> Resolved
              </h3>
              <span className="bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs font-bold">
                {resolvedRequests.length}
              </span>
            </div>
            <div className="space-y-3">
              {resolvedRequests.map(req => <RequestCard key={req.id} req={req} />)}
              {resolvedRequests.length === 0 && <div className="text-center py-10 text-slate-400 text-xs italic">History empty</div>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}