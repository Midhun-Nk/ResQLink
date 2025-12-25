import React, { useEffect, useState } from 'react';
import { Filter, BellRing } from "lucide-react";
import  AlertCard  from "../components/AlertCard"; 
import axios from 'axios';

export const AlertsView = () => {
   const API_BASE = 'http://127.0.0.1:8000/api/v1'; // Standard Django API URL

 const [banner, setBanner] = useState(null);
 const [alerts, setAlerts] = useState([]);
 const [loadingAlerts, setLoadingAlerts] = useState(true);
   useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {}; // ✅ public request if not logged in

      const [bannerRes, listRes] = await Promise.all([
        axios.get(`${API_BASE}/notifications/banner/`, { headers }),
        axios.get(`${API_BASE}/notifications/`, { headers }),
      ]);

      setBanner(bannerRes.data?.id ? bannerRes.data : null);
      setAlerts(listRes.data || []);
    } catch (err) {
      console.error("Alert Fetch Error", err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  fetchData();
}, []);


   return(
  <div className="animate-in fade-in duration-500">
    
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
       <div className="flex items-center gap-3">
          <div className={`
            p-2.5 rounded-xl
            /* Light: Red background */
            bg-red-100 text-red-600
            /* Dark: Solid dark red background (No transparency) to hide dots */
            dark:bg-[#2a0a0a] dark:text-red-500 dark:border dark:border-red-900/30
          `}>
             <BellRing size={20} />
          </div>
          <div>
             <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Active Alerts</h4>
             <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 font-medium">Real-time incident feed</p>
          </div>
       </div>

       <button className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm
          /* Light: Stronger border */
          bg-white border border-gray-300 text-slate-700 hover:bg-slate-50
          /* Dark: Deep black with subtle border */
          dark:bg-[#0a0a0a] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5
       `}>
          <Filter size={16} /> Filter Severity
       </button>
    </div>

    {/* Alert Cards Grid */}
    <div className="space-y-4">
       {
         loadingAlerts ? (
             <p className="text-center text-gray-500 dark:text-gray-400">Loading alerts...</p>
         ) : alerts.length === 0 ? (
             <p className="text-center text-gray-500 dark:text-gray-400">No active alerts.</p>
         ) : (
               alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
               ))
         )
       }
    </div>
  </div>
)};