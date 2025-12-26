import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, Trash2, Pencil, Shield, Mail, Phone, MapPin, X, Save 
} from 'lucide-react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const API_URL = `${VITE_API_URL}/auth`;

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    userName: '', fullName: '', email: '', phoneNumber: '', 
    password: '', role: 'people', bloodGroup: '', 
    location: { country: 'India', state: 'Kerala', city: '' }
  };
  
  const [formData, setFormData] = useState(initialForm);

  // --- 1. Fetch Users ---
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- 2. Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // For update, remove password if empty so we don't re-hash empty string
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        
        await axios.put(`${API_URL}/${currentId}`, payload);
        alert("User Updated!");
      } else {
        await axios.post(API_URL, formData);
        alert("User Created!");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      alert("Operation Failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this user permanently?")) return;
    try { await axios.delete(`${API_URL}/${id}`); fetchUsers(); }
    catch(err) { alert("Delete failed"); }
  };

  const openEdit = (user) => {
    setFormData({ 
      ...user, 
      password: '', // Clear password field for security
      location: user.location || initialForm.location 
    });
    setCurrentId(user.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData(initialForm);
  };

  // --- Helper: Role Badge ---
  const getRoleBadge = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-blue-100 text-blue-700 border-blue-200',
      manager: 'bg-orange-100 text-orange-700 border-orange-200',
      agent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      people: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${colors[role] || colors.people}`}>{role.replace('_', ' ')}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 p-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Users className="text-blue-600" /> User Management
          </h1>
          <p className="text-slate-500 mt-1">Manage system access and roles</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="p-4">User Details</th>
              <th className="p-4">Role</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-white">{user.fullName}</div>
                  <div className="text-xs text-slate-500">@{user.userName}</div>
                </td>
                <td className="p-4">{getRoleBadge(user.role)}</td>
                <td className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400"><Mail size={12}/> {user.email}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400"><Phone size={12}/> {user.phoneNumber || 'N/A'}</div>
                </td>
                <td className="p-4 text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1"><MapPin size={14}/> {user.location?.city || 'Unknown'}, {user.location?.state}</div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(user)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Create/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] w-full max-w-2xl rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">{isEditing ? 'Edit User' : 'Create New User'}</h2>
              <button onClick={closeModal}><X className="text-slate-400 hover:text-red-500"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                  <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                  <input required className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                    value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                  <input required type="email" className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                  <input className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                    value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="people">Civilian (People)</option>
                    <option value="agent">Field Agent</option>
                    <option value="manager">District Manager</option>
                    <option value="admin">State Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Blood Group</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none"
                    value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Password {isEditing && '(Leave blank to keep current)'}</label>
                <input type="password" required={!isEditing} className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 mt-2">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Location Details</label>
                <div className="grid grid-cols-2 gap-4">
                   <input placeholder="City" className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                     value={formData.location?.city || ''} 
                     onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
                   <input placeholder="State" className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl dark:border-zinc-800 outline-none" 
                     value={formData.location?.state || ''} 
                     onChange={e => setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2">
                <Save size={18} /> {isEditing ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}