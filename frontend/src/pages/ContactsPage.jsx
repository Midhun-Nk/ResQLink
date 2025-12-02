import React, { useState } from 'react';
import { 
  Phone, 
  Copy, 
  ShieldAlert, 
  Flame, 
  Stethoscope, 
  Zap, 
  LifeBuoy, 
  Siren,
  Search,
  Check
} from "lucide-react";

// --- RELEVANT DISASTER DATA ---
// Updated backgrounds to be slightly richer for light mode visibility
const emergencyData = [
  {
    category: "Immediate Response",
    items: [
      { name: "Police Control", number: "100", icon: <ShieldAlert size={20} />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", btn: "bg-blue-600 hover:bg-blue-700" },
      { name: "Fire & Rescue", number: "101", icon: <Flame size={20} />, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", btn: "bg-orange-600 hover:bg-orange-700" },
      { name: "Ambulance", number: "108", icon: <Stethoscope size={20} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", btn: "bg-rose-600 hover:bg-rose-700" },
      { name: "Disaster Management", number: "1077", icon: <Siren size={20} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", btn: "bg-amber-600 hover:bg-amber-700" },
    ]
  },
  {
    category: "Specialized Forces",
    items: [
      { name: "NDRF HQ", number: "011-24363260", icon: <LifeBuoy size={20} />, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", btn: "bg-cyan-600 hover:bg-cyan-700" },
      { name: "Coast Guard Search", number: "1554", icon: <ShieldAlert size={20} />, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100", btn: "bg-sky-600 hover:bg-sky-700" },
      { name: "Women Helpline", number: "1091", icon: <ShieldAlert size={20} />, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", btn: "bg-purple-600 hover:bg-purple-700" },
    ]
  },
  {
    category: "Utilities & Support",
    items: [
      { name: "Electricity Board", number: "1912", icon: <Zap size={20} />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100", btn: "bg-yellow-500 hover:bg-yellow-600" },
      { name: "Gas Leakage", number: "1906", icon: <Flame size={20} />, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", btn: "bg-red-600 hover:bg-red-700" },
    ]
  }
];

// --- CARD COMPONENT ---
const ContactCard = ({ contact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group relative p-5 rounded-2xl bg-white border ${contact.border} hover:shadow-xl hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1 shadow-sm`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${contact.bg} ${contact.color}`}>
          {contact.icon}
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          title="Copy Number"
        >
          {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16} />}
        </button>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{contact.name}</h3>
        <p className="text-2xl font-bold text-gray-900 font-mono tracking-tight">{contact.number}</p>
      </div>

      {/* Action Button */}
      <a 
        href={`tel:${contact.number}`}
        className={`mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 ${contact.btn} shadow-md opacity-90 hover:opacity-100`}
      >
        <Phone size={16} fill="currentColor" /> CALL NOW
      </a>
    </div>
  );
};

// --- MAIN PAGE ---
export function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Siren className="text-red-600" size={28} />
          </div>
          Emergency Directory
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Authorized contact channels for Disaster Management. Tap to call immediately.
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search agency or number..."
            className="w-full bg-white border border-gray-200 text-gray-900 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all placeholder:text-gray-400"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto space-y-12">
        {emergencyData.map((section, index) => (
          <div key={index}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              {section.category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items
                .filter(item => 
                  item.name.toLowerCase().includes(searchTerm) || 
                  item.number.includes(searchTerm)
                )
                .map((contact, idx) => (
                  <ContactCard key={idx} contact={contact} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsPage;