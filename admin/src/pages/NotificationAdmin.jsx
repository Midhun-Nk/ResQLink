import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Send, Trash2, Bell, X, 
  Loader, AlertCircle, CheckCircle2, Users,
  Info, AlertTriangle, User
} from "lucide-react";

// --- COMPONENTS ---

// Helper to render the type badge
const TypeBadge = ({ type }) => {
  const styles = {
    info: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    warning: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    alert: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  };
  
  const icons = {
    info: <Info size={12} />,
    warning: <AlertTriangle size={12} />,
    alert: <AlertCircle size={12} />,
    success: <CheckCircle2 size={12} />
  };

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider w-fit ${styles[type] || styles.info}`}>
      {icons[type]} {type}
    </span>
  );
};

export default function NotificationAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: 'info',
    recipient: '', // ID of user
    send_to_all: false
  });

  const API_URL = 'http://127.0.0.1:8000/api/v1/admin/notifications/';
  const USERS_URL = 'http://127.0.0.1:8000/api/v1/admin/users/';

  // --- API CALLS ---
  const fetchData = async () => {
    try {
      const [notifRes, userRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(USERS_URL)
      ]);
      setNotifications(notifRes.data);
      setUsers(userRes.data);
    } catch (err) {
      showNotify("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification record?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      showNotify("Deleted successfully", "success");
      fetchData();
    } catch (err) {
      showNotify("Delete failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        title: formData.title,
        message: formData.message,
        notification_type: formData.notification_type,
        send_to_all: formData.send_to_all,
        recipient: formData.send_to_all ? null : formData.recipient
    };

    try {
      await axios.post(API_URL, payload);
      showNotify(formData.send_to_all ? "Broadcast sent to everyone!" : "Notification sent!", "success");
      setIsModalOpen(false);
      // Reset form
      setFormData({ title: '', message: '', notification_type: 'info', recipient: '', send_to_all: false });
      fetchData();
    } catch (err) {
      console.error(err);
      showNotify("Failed to send", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (msg, type) => {
    setNotificationMsg({ msg, type });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-blue-600" /> Notification Center
          </h1>
          <p className="text-gray-500">Broadcast alerts and messages</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Send size={18} /> Compose New
        </button>
      </div>

      {/* Toast Notification */}
      {notificationMsg && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-top-2 ${notificationMsg.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white`}>
          {notificationMsg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-bold text-sm">{notificationMsg.msg}</span>
        </div>
      )}

      {/* History Table */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg">Sent History</h3>
        </div>
        
        {loading && notifications.length === 0 ? (
          <div className="p-10 text-center"><Loader className="animate-spin inline text-gray-400"/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-zinc-900/50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {notifications.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{note.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate" title={note.message}>
                      {note.message}
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={note.notification_type} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-500">
                           {/* Assuming backend sends recipient ID/Name, if bulk sent, this logic might need adjustment based on how you want to display it */}
                           <User size={12} />
                        </div>
                        {/* Note: The standard serializer shows recipient ID. In a real admin, you'd nest the User object to show the name */}
                        <span className="text-gray-600 dark:text-zinc-400">User #{note.recipient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {new Date(note.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notifications.length === 0 && (
                <div className="p-10 text-center text-gray-400 italic">No notifications sent yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50 rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Send size={20} className="text-blue-500"/> Compose Notification
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-red-500 transition-colors" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="notifyForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subject</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Flash Flood Warning"
                  />
                </div>

                {/* Recipient Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Recipient</label>
                  
                  {/* Send to All Toggle */}
                  <div 
                    onClick={() => setFormData({...formData, send_to_all: !formData.send_to_all})}
                    className={`
                      cursor-pointer mb-3 p-3 rounded-xl border flex items-center gap-3 transition-all
                      ${formData.send_to_all 
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                        : 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 hover:border-blue-300'}
                    `}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.send_to_all ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400'}`}>
                      {formData.send_to_all && <CheckCircle2 size={14} />}
                    </div>
                    <div>
                        <span className={`font-bold text-sm ${formData.send_to_all ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>Broadcast to All Users</span>
                        <p className="text-xs text-gray-500">Send this message to everyone registered.</p>
                    </div>
                    <Users className={`ml-auto ${formData.send_to_all ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
                  </div>

                  {/* Dropdown (Only if not sending to all) */}
                  {!formData.send_to_all && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                        <select 
                            required={!formData.send_to_all}
                            value={formData.recipient}
                            onChange={e => setFormData({...formData, recipient: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select a User...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                            ))}
                        </select>
                    </div>
                  )}
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Alert Level</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['info', 'warning', 'alert', 'success'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({...formData, notification_type: type})}
                                className={`
                                    py-2 rounded-lg text-xs font-bold uppercase border-2 transition-all
                                    ${formData.notification_type === type 
                                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                                        : 'border-transparent bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500 hover:bg-gray-200'}
                                `}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Type your alert details here..."
                  />
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/50 rounded-b-3xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
              <button disabled={loading} type="submit" form="notifyForm" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50">
                {loading ? <Loader className="animate-spin" size={18}/> : <Send size={18} />} 
                {formData.send_to_all ? "Broadcast" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}