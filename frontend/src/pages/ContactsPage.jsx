import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Phone, Copy, ShieldAlert, Flame, Stethoscope, Zap, 
  LifeBuoy, Siren, Search, Check, Loader
} from "lucide-react";

// --- ICON MAPPING ---
// Maps the string 'icon_name' from your Database to the actual Component
const ICON_MAP = {
  "ShieldAlert": <ShieldAlert size={20} />,
  "Flame": <Flame size={20} />,
  "Stethoscope": <Stethoscope size={20} />,
  "Siren": <Siren size={20} />,
  "LifeBuoy": <LifeBuoy size={20} />,
  "Zap": <Zap size={20} />,
  // Add a fallback just in case
  "default": <ShieldAlert size={20} />
};

// --- CARD COMPONENT ---
const ContactCard = ({ contact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic Theme Colors
  const themes = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20', btn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/20', btn: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500' },
    rose:   { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20', btn: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', btn: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500' },
    cyan:   { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/20', btn: 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500' },
    sky:    { bg: 'bg-sky-50 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-500/20', btn: 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/20', btn: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-500/20', btn: 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-400' },
    red:    { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/20', btn: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500' },
  };

  const theme = themes[contact.color] || themes.blue;
  // Get the correct icon component from the map, or use default
  const IconComponent = ICON_MAP[contact.icon] || ICON_MAP["default"];

  return (
    <div className={`
      relative p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group
      bg-white border-gray-100 shadow-sm hover:shadow-xl
      dark:bg-[#0a0a0a] dark:border-white/5 dark:hover:border-white/20
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
          {IconComponent}
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          title="Copy Number"
        >
          {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16} />}
        </button>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-gray-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{contact.name}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">{contact.number}</p>
      </div>

      {/* Action Button */}
      <a 
        href={`tel:${contact.number}`}
        className={`mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 shadow-md ${theme.btn}`}
      >
        <Phone size={16} fill="currentColor" /> CALL NOW
      </a>
    </div>
  );
};

// --- MAIN PAGE ---
export function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [emergencyData, setEmergencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
  const API_BASE = `${VITE_API_URL_PYTHON}`; // Standard Django API URL

  // --- API FETCH ---
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // Replace with your actual backend URL
        const response = await axios.get(`${API_BASE}/safetyinfo/emergency-contacts/`);
        setEmergencyData(response.data);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setError("Unable to load emergency contacts at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-500 gap-2">
        <Loader className="animate-spin" /> Loading Directory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-red-500 gap-2">
        <ShieldAlert /> {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-6 md:p-10 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="p-2.5 bg-red-100 dark:bg-red-500/20 rounded-xl">
            <Siren className="text-red-600 dark:text-red-500" size={28} />
          </div>
          Emergency Directory
        </h1>
        <p className="text-gray-500 dark:text-zinc-500 max-w-2xl text-lg">
          Authorized contact channels for Disaster Management. Tap to call immediately.
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search agency or number..."
            className={`
              w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all shadow-sm
              bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              dark:bg-[#0a0a0a] dark:border-white/10 dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5
            `}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto space-y-12">
        {emergencyData.map((section, index) => {
          // Filter items based on search term before rendering
          const filteredItems = section.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.number.includes(searchTerm)
          );

          // If no items match in this category, don't render the category
          if (filteredItems.length === 0) return null;

          return (
            <div key={index}>
              <h2 className="text-sm font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-6 border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                {section.category}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((contact, idx) => (
                  <ContactCard key={idx} contact={contact} />
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Empty State if search yields no results across all sections */}
        {emergencyData.every(section => 
           section.items.filter(item => 
             item.name.toLowerCase().includes(searchTerm) || 
             item.number.includes(searchTerm)
           ).length === 0
        ) && (
          <div className="text-center py-20 text-gray-400">
            <p>No contacts found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsPage;