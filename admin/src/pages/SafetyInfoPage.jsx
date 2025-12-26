
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Plus, Trash2, Edit2, Save, X, 
  ChevronRight, AlertCircle, CheckCircle2, Loader,ShieldCheck ,
  Droplets, Flame, Zap, Wind, Waves, MountainSnow, Skull, ThermometerSun, Activity
} from "lucide-react";

// Icons available for selection
const AVAILABLE_ICONS = [
  "Droplets", "Flame", "Zap", "Wind", "Waves", 
  "MountainSnow", "Skull", "ThermometerSun", "Activity"
];

// Colors available for selection
const AVAILABLE_COLORS = [
  "blue", "orange", "amber", "teal", "cyan", "stone", "purple", "rose"
];

// --- SUB-COMPONENT: Phase Editor (Handles the list of strings) ---
const PhaseEditor = ({ phaseName, steps, onChange }) => {
  const addStep = () => {
    onChange([...steps, ""]);
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    onChange(newSteps);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(newSteps);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-wider">
          {phaseName} Event
        </h4>
        <button 
          type="button"
          onClick={addStep}
          className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold"
        >
          <Plus size={14} /> Add Step
        </button>
      </div>
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="text-gray-400 text-sm py-2 w-6 text-center">{idx + 1}.</span>
            <input 
              type="text" 
              value={step}
              onChange={(e) => updateStep(idx, e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder={`Step ${idx + 1}`}
            />
            <button 
              type="button"
              onClick={() => removeStep(idx)}
              className="text-red-400 hover:text-red-600 p-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {steps.length === 0 && (
          <div className="text-sm text-gray-400 italic text-center py-2 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
            No steps defined.
          </div>
        )}
      </div>
    </div>
  );
};

export default function SafetyInfoPage() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // false = create, true = edit
  
  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    icon_name: 'Activity',
    color_theme: 'blue',
    phases: {
      before: [],
      during: [],
      after: []
    }
  });

  const [notification, setNotification] = useState(null);

  const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
  const API_BASE = `${VITE_API_URL_PYTHON}`; // Standard Django API URL

  // --- API CALLS ---
  const fetchDisasters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/safetyinfo/disasters/`);
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setDisasters(data);
    } catch (err) {
      showNotify("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  // --- HANDLERS ---

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({
      slug: '', title: '', icon_name: 'Activity', color_theme: 'blue',
      phases: { before: [], during: [], after: [] }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (disaster) => {
    setEditMode(true);
    // Deep copy to ensure we don't mutate state directly
    setFormData(JSON.parse(JSON.stringify(disaster))); 
    setIsModalOpen(true);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this disaster?")) return;
    try {
      await axios.delete(`${API_BASE}/safetyinfo/disasters/${slug}/`);
      showNotify("Deleted successfully", "success");
      fetchDisasters();
    } catch (err) {
      showNotify("Failed to delete", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_BASE}/safetyinfo/disasters/${formData.slug}/`, formData);
        showNotify("Updated successfully", "success");
      } else {
        await axios.post(`${API_BASE}/safetyinfo/disasters/`, formData);
        showNotify("Created successfully", "success");
      }
      setIsModalOpen(false);
      fetchDisasters();
    } catch (err) {
      console.error(err);
      showNotify("Operation failed. Check console.", "error");
    }
  };

  // Helper to show toast
  const showNotify = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 p-8">
      
      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" /> Safety Informations
          </h1>
          <p className="text-gray-500 mt-1">Manage Disaster Protocols</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> New Entry
        </button>
      </div>

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-5 z-50 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* --- DATA TABLE --- */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400 gap-2">
            <Loader className="animate-spin" /> Loading...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Disaster</th>
                <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Slug (ID)</th>
                <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider">Theme</th>
                <th className="p-5 text-xs font-bold uppercase text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disasters.map((item) => (
                <tr key={item.slug} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="p-5 font-bold flex items-center gap-3">
                    <span className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-500">
                       <Activity size={16} /> {/* Placeholder icon */}
                    </span>
                    {item.title}
                  </td>
                  <td className="p-5 text-sm font-mono text-gray-500">{item.slug}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase bg-${item.color_theme}-100 text-${item.color_theme}-600 dark:bg-white/10 dark:text-gray-300`}>
                      {item.color_theme}
                    </span>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.slug)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/30 rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editMode ? <Edit2 size={20} className="text-blue-500"/> : <Plus size={20} className="text-emerald-500"/>}
                {editMode ? "Edit Disaster" : "Create New Disaster"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="disasterForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Flash Flood"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Slug (Unique ID)</label>
                    <input 
                      required
                      disabled={editMode} // Slug is PK, cannot change on edit
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                      placeholder="e.g. flash-flood"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Icon</label>
                    <select 
                      value={formData.icon_name}
                      onChange={e => setFormData({...formData, icon_name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Color Theme</label>
                    <div className="flex gap-2 flex-wrap">
                      {AVAILABLE_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({...formData, color_theme: color})}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color_theme === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                          style={{ backgroundColor: color === 'stone' ? '#78716c' : color }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 my-6"></div>

                {/* Section 2: Protocols */}
                <div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-500"/> Safety Protocols
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Before */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                      <PhaseEditor 
                        phaseName="Before" 
                        steps={formData.phases.before}
                        onChange={(newSteps) => setFormData({
                          ...formData, 
                          phases: { ...formData.phases, before: newSteps }
                        })}
                      />
                    </div>
                    
                    {/* During */}
                    <div className="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                       <PhaseEditor 
                        phaseName="During" 
                        steps={formData.phases.during}
                        onChange={(newSteps) => setFormData({
                          ...formData, 
                          phases: { ...formData.phases, during: newSteps }
                        })}
                      />
                    </div>

                    {/* After */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                       <PhaseEditor 
                        phaseName="After" 
                        steps={formData.phases.after}
                        onChange={(newSteps) => setFormData({
                          ...formData, 
                          phases: { ...formData.phases, after: newSteps }
                        })}
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/30 rounded-b-3xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="disasterForm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}