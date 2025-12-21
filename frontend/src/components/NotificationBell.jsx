import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, X, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/v1/notifications/';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // --- 1. FETCH & POLLING LOGIC ---
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Notification fetch error", err);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    
    // Poll every 5 seconds to make it feel "Alive"
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. HANDLERS ---
  const handleMarkRead = async (id) => {
    try {
      await axios.post(`${API_URL}${id}/mark_read/`);
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post(`${API_URL}mark_all_read/`);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // --- 3. HELPER VARS ---
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertCircle size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2.5 rounded-full transition-colors relative
          ${isOpen ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/40'}
        `}
      >
        <Bell size={20}/>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#050505]"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((note) => (
                <div 
                  key={note.id}
                  onClick={() => handleMarkRead(note.id)}
                  className={`
                    p-4 border-b border-gray-50 dark:border-zinc-800/50 cursor-pointer transition-colors
                    hover:bg-gray-50 dark:hover:bg-zinc-900
                    ${!note.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                  `}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(note.notification_type)}
                    </div>
                    <div className="flex-1">
                      <h5 className={`text-sm ${!note.is_read ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {note.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 line-clamp-2">
                        {note.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block">
                        {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!note.is_read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}