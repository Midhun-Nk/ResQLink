import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Loader2, CloudSun, MapPin, Phone, BookOpen, ExternalLink, Wind, Info, Megaphone
} from 'lucide-react';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
const API_BASE = `${VITE_API_URL_PYTHON}`; // Standard Django API URL

export const DashboardView = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  
  // Notification State
  const [banner, setBanner] = useState(null); // The dedicated banner
  const [alerts, setAlerts] = useState([]); // The list of all notifications
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const DEFAULT_CITY = "Kozhikode"; 

  // --- 1. FETCH WEATHER ---
  useEffect(() => {
    const fetchWeather = async () => {
      if (!WEATHER_API_KEY) { setLoadingWeather(false); return; }
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${WEATHER_API_KEY}`);
        if (response.ok) setWeather(await response.json());
      } catch (error) { console.error("Weather Error", error); } 
      finally { setLoadingWeather(false); }
    };
    fetchWeather();
  }, []);

  // --- 2. FETCH ALERTS (Banner + List) ---
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

  // --- 3. ALERT ROTATION LOGIC ---
  useEffect(() => {
    // If a Banner exists, DO NOT rotate. Keep the banner static.
    if (banner) return; 

    // If no banner, but we have alerts, rotate through them
    if (alerts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [alerts, banner]);

  // --- HELPER: Styles based on Severity ---
  const getAlertStyle = (severity) => {
    switch(severity) {
      case 'alert': return { // Critical
        bg: 'bg-red-50 dark:bg-[#0a0a0a]', 
        border: 'border-red-500', 
        iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', 
        icon: ShieldAlert,
        badge: 'bg-red-500'
      };
      case 'warning': return {
        bg: 'bg-orange-50 dark:bg-[#0a0a0a]', 
        border: 'border-orange-500', 
        iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', 
        icon: Wind,
        badge: 'bg-orange-500'
      };
      case 'success': return {
        bg: 'bg-emerald-50 dark:bg-[#0a0a0a]', 
        border: 'border-emerald-500', 
        iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', 
        icon: Info,
        badge: 'bg-emerald-500'
      };
      default: return { // Info
        bg: 'bg-blue-50 dark:bg-[#0a0a0a]', 
        border: 'border-blue-500', 
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', 
        icon: Megaphone,
        badge: 'bg-blue-500'
      };
    }
  };

  // Determine what to display: Banner > Rotating Alert > Null
  const displayAlert = banner || alerts[currentAlertIndex];
  const alertStyle = displayAlert ? getAlertStyle(displayAlert.notification_type) : {};

  return (
    <div className={`
      animate-in fade-in duration-500 pb-10 min-h-screen
      bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] 
      dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)]
    `}>
      <div className="space-y-6">
        
        {/* --- DYNAMIC ALERT BANNER --- */}
        {loadingAlerts ? (
           <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse border border-slate-200 dark:border-white/10"></div>
        ) : displayAlert ? (
          <div className={`
            relative overflow-hidden rounded-xl p-5 shadow-sm border-l-4 transition-all duration-500
            ${alertStyle.bg} ${alertStyle.border} shadow-slate-200/60 ring-1 ring-slate-200 dark:shadow-none dark:ring-white/10
          `}>
            <div className="flex items-start relative z-10">
              <div className={`p-2.5 rounded-lg mr-4 mt-1 ${alertStyle.iconBg}`}>
                 <alertStyle.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                        {displayAlert.title}
                     </h3>
                     {/* Show Banner Badge if it comes from the banner endpoint */}
                     {banner && displayAlert.id === banner.id && (
                        <span className="bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Important
                        </span>
                     )}
                   </div>

                   {/* Pagination Dots (Only show if NO banner is active and we are rotating) */}
                   {!banner && alerts.length > 1 && (
                     <div className="flex gap-1">
                       {alerts.map((_, idx) => (
                         <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentAlertIndex ? 'bg-slate-800 dark:bg-white w-3' : 'bg-slate-300 dark:bg-white/20'}`} />
                       ))}
                     </div>
                   )}
                </div>
                <p className="text-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {displayAlert.message}
                </p>
                <p className="text-xs font-mono font-bold mt-3 text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${alertStyle.badge}`}></span>
                  Updated: {new Date(displayAlert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // "All Clear" State
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 p-5 rounded-xl flex items-center gap-4 ring-1 ring-emerald-100 dark:ring-emerald-500/20">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600"><ShieldAlert size={24}/></div>
             <div>
               <h3 className="font-bold text-emerald-900 dark:text-emerald-100">All Clear</h3>
               <p className="text-emerald-700 dark:text-emerald-400 text-sm">No active alerts at this time. Stay safe!</p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* SOS CARD */}
            <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-red-500/20 relative overflow-hidden group bg-gradient-to-br from-red-600 to-red-700 text-white dark:from-red-700 dark:to-red-900">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Emergency Mode
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Emergency SOS</h3>
                <p className="mt-2 text-red-50 max-w-md text-sm leading-relaxed font-medium">If you are in immediate danger, press the SOS button to instantly alert rescue teams.</p>
              </div>
              <button onClick={() => navigate("/sos")} className="mt-8 md:mt-0 flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl transition-all duration-300 relative z-10 bg-white text-red-600 border-4 border-red-100 hover:scale-110 active:scale-95">SOS</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LIVE WEATHER */}
              <div className="p-6 rounded-2xl transition-all h-full flex flex-col justify-between bg-white border border-slate-200 shadow-lg shadow-slate-200/50 dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="font-bold text-slate-700 dark:text-white text-lg flex items-center gap-2">
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg"><CloudSun size={18} className="text-blue-500" /></div> Weather
                   </h4>
                   {weather && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-400 px-2.5 py-1 rounded-md">{weather.name}</span>}
                </div>
                
                {loadingWeather ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 gap-2"><Loader2 className="animate-spin w-5 h-5" /> Loading...</div>
                ) : weather ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" className="w-16 h-16 -ml-2 filter drop-shadow-md" />
                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(weather.main.temp)}°</span>
                      </div>
                      <div className="text-right">
                        <p className="capitalize font-bold text-lg text-slate-700 dark:text-gray-200">{weather.weather[0].description}</p>
                        <p className="text-sm text-slate-500 font-medium">Feels {Math.round(weather.main.feels_like)}°</p>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                       <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl text-center border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Humidity</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-gray-300 text-lg">{weather.main.humidity}%</span>
                       </div>
                       <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl text-center border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Wind</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-gray-300 text-lg">{weather.wind.speed}</span><span className="text-[10px] text-slate-400 ml-1">m/s</span>
                       </div>
                    </div>
                  </div>
                ) : <div className="flex flex-col items-center justify-center h-32 opacity-50"><CloudSun className="w-10 h-10 mb-2"/><p className="text-sm">Unavailable</p></div>}
                
                <button onClick={() => navigate("/weather-alerts")} className="w-full mt-5 py-2.5 text-xs font-bold text-center border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">Full Forecast <ExternalLink size={12} /></button>
              </div>

              {/* ACTIVE ALERTS LIST */}
              <div className="p-6 rounded-2xl transition-all h-full flex flex-col bg-white border border-slate-200 shadow-lg shadow-slate-200/50 dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-700 dark:text-white text-lg">Alert List</h4>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${alerts.length > 0 ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${alerts.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span> {alerts.length} Active
                  </span>
                </div>
                
                <div className="space-y-4 flex-1 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                  {alerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" onClick={() => navigate('/alerts')}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse ${alert.notification_type === 'alert' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                      <div>
                         <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800 dark:text-gray-200 line-clamp-1">{alert.title}</p>
                            {/* Small Banner Badge in List */}
                            {alert.is_banner && <span className="text-[8px] bg-purple-100 text-purple-700 px-1 rounded uppercase font-bold">Banner</span>}
                         </div>
                         <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 line-clamp-1">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && <div className="text-center py-8 text-slate-400 text-xs italic">No active alerts to list.</div>}
                </div>
                <button onClick={() => navigate("/alerts")} className="w-full mt-5 py-2.5 text-xs font-bold text-center border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">View All Alerts</button>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="p-6 rounded-2xl transition-all h-full bg-white border border-slate-200 shadow-lg shadow-slate-200/50 dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none">
            <h4 className="font-bold text-slate-700 dark:text-white text-lg mb-6 flex items-center gap-2">⚡ Quick Actions</h4>
            <div className="space-y-3">
              {[
                { icon: Phone, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20', hover: 'hover:border-blue-200', title: 'Helplines', sub: 'Emergency numbers', nav: '/contacts' },
                { icon: MapPin, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20', hover: 'hover:border-green-200', title: 'Nearby Shelters', sub: 'Safe locations map', nav: "/map-navigation" },
                { icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/20', hover: 'hover:border-indigo-200', title: 'Safety Guides', sub: 'Preparedness tips', nav: '/safety-info' }
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.nav)} className={`w-full text-left flex items-center p-4 rounded-xl border transition-all group bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20 ${action.hover}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform ${action.bg}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-gray-200">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">{action.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};