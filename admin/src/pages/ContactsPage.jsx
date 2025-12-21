import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Plus, Trash2, Edit2, Save, X, 
  Phone, Users, CheckCircle2, AlertCircle, Loader,
  ShieldAlert, Flame, Stethoscope, Siren, LifeBuoy, Zap
} from "lucide-react";

// Dropdown options
const ICONS = ["ShieldAlert", "Flame", "Stethoscope", "Siren", "LifeBuoy", "Zap"];
const COLORS = ["blue", "orange", "rose", "amber", "cyan", "sky", "purple", "yellow", "red"];

// --- SUB-COMPONENT: Contact Editor ---
const ContactEditor = ({ contacts, onChange }) => {
  const addContact = () => {
    onChange([...contacts, { name: "", number: "", icon: "ShieldAlert", color: "blue" }]);
  };

  const updateContact = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    onChange(newContacts);
  };

  const removeContact = (index) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold uppercase text-gray-500">Contact List</h4>
        <button type="button" onClick={addContact} className="text-xs font-bold text-blue-600 flex items-center gap-1">
          <Plus size={14} /> Add Number
        </button>
      </div>
      
      {contacts.map((contact, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800">
          <div className="flex-1 space-y-2">
            <input 
              placeholder="Agency Name (e.g. Police)"
              value={contact.name}
              onChange={(e) => updateContact(idx, 'name', e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
               <input 
                placeholder="Number"
                value={contact.number}
                onChange={(e) => updateContact(idx, 'number', e.target.value)}
                className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono"
              />
              <select 
                value={contact.icon}
                onChange={(e) => updateContact(idx, 'icon', e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 text-xs"
              >
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select 
                value={contact.color}
                onChange={(e) => updateContact(idx, 'color', e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 text-xs"
              >
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="button" onClick={() => removeContact(idx)} className="text-red-400 hover:text-red-600 self-center">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default function ContactsAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // ID of category being edited
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: '',
    items: []
  });

  const API_URL = 'http://127.0.0.1:8000/api/v1/safetyinfo/emergency-contacts/';

  // --- API CALLS ---
  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      showNotify("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ category: '', items: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditId(cat.id);
    setFormData(JSON.parse(JSON.stringify(cat)));
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and all its numbers?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      showNotify("Category deleted", "success");
      fetchContacts();
    } catch (err) {
      showNotify("Delete failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}${editId}/`, formData);
        showNotify("Updated successfully", "success");
      } else {
        await axios.post(API_URL, formData);
        showNotify("Created successfully", "success");
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      showNotify("Save failed", "error");
    }
  };

  const showNotify = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 p-8">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Phone className="text-blue-600" /> Contacts Admin
          </h1>
          <p className="text-gray-500">Manage Emergency Directory</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {loading ? <div className="text-center text-gray-400 flex justify-center gap-2"><Loader className="animate-spin"/> Loading...</div> : 
          categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex justify-between items-start group hover:border-blue-300 transition-all">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {cat.category}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {cat.items.map((item, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700`}>
                      {item.name}: {item.number}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(cat)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-white" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category Title</label>
                  <input 
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Specialized Forces"
                  />
                </div>
                
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-6">
                  <ContactEditor 
                    contacts={formData.items} 
                    onChange={newItems => setFormData({...formData, items: newItems})}
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
              <button type="submit" form="contactForm" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}