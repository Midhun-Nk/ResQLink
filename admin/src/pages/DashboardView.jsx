import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Loader2, CloudSun, MapPin, Phone, BookOpen, ExternalLink, Wind
} from 'lucide-react';

export const DashboardView = () => {
  const navigate = useNavigate();
  
  // --- WEATHER STATE ---
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const DEFAULT_CITY = "Kozhikode"; 
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // --- FETCH WEATHER ---
  useEffect(() => {
    const fetchWeather = async () => {
      if (!apiKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${apiKey}`
        );
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard weather", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [apiKey]);

  return (
    // MAIN WRAPPER WITH DOTTED BACKGROUND
    <div className={`
      animate-in fade-in duration-500 pb-10 min-h-screen
      /* Dotted Pattern Logic */
      bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] 
      dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)]
    `}>
      <div className="space-y-6">
        
        {/* --- LATEST ALERT BANNER --- */}
        <div className={`
          relative overflow-hidden rounded-xl p-5 shadow-sm border-l-4 transition-all
          /* Light Mode: Card pop */
          bg-white border-amber-500 shadow-slate-200/60 ring-1 ring-slate-200
          /* Dark Mode */
          dark:bg-[#0a0a0a] dark:text-amber-100 dark:border-amber-500 dark:shadow-none dark:ring-white/10
        `}>
          <div className="flex items-start relative z-10">
            <div className="p-2.5 bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-lg mr-4 mt-1">
               <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">LATEST ALERT: High Wind Advisory</h3>
              <p className="text-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Strong winds expected across coastal areas from 4:00 PM onwards.
                Secure loose objects and avoid coastal travel.
              </p>
              <p className="text-xs font-mono font-bold mt-3 text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Updated: 5 mins ago
              </p>
            </div>
          </div>
          {/* Decorative Background Icon */}
          <Wind className="absolute right-[-20px] top-[-20px] h-32 w-32 text-slate-100 dark:text-amber-500/5 -rotate-12 pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- SOS CARD --- */}
            <div className={`
              rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-red-500/20 relative overflow-hidden group
              /* Light Mode */
              bg-gradient-to-br from-red-600 to-red-700 text-white
              /* Dark Mode */
              dark:from-red-700 dark:to-red-900
            `}>
              {/* Background texture for SOS */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Emergency Mode
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Emergency SOS</h3>
                <p className="mt-2 text-red-50 max-w-md text-sm leading-relaxed font-medium">
                  If you are in immediate danger, press the SOS button to instantly alert
                  rescue teams with your live GPS location.
                </p>
              </div>

              <button
                onClick={() => navigate("/sos")}
                className={`
                  sos-button mt-8 md:mt-0 flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl transition-all duration-300 relative z-10
                  bg-white text-red-600 border-4 border-red-100
                  hover:scale-110 hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]
                  active:scale-95
                `}
              >
                SOS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* --- LIVE WEATHER CARD --- */}
              <div className={`
                p-6 rounded-2xl transition-all h-full flex flex-col justify-between
                /* Light Mode: Clean White Card */
                bg-white border border-slate-200 shadow-lg shadow-slate-200/50
                /* Dark Mode: Deep Black Card */
                dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none
              `}>
                <div className="flex justify-between items-start mb-4">
                   <h4 className="font-bold text-slate-700 dark:text-white text-lg flex items-center gap-2">
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <CloudSun size={18} className="text-blue-500" /> 
                     </div>
                     Weather
                   </h4>
                   {weather && (
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-400 px-2.5 py-1 rounded-md">
                       {weather.name}
                     </span>
                   )}
                </div>
                
                {loading ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 dark:text-zinc-600 gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Loading...
                  </div>
                ) : weather ? (
                  // LIVE DATA VIEW
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                          alt="weather icon"
                          className="w-16 h-16 -ml-2 filter drop-shadow-md"
                        />
                        <div>
                           <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                             {Math.round(weather.main.temp)}°
                           </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="capitalize font-bold text-lg text-slate-700 dark:text-gray-200">{weather.weather[0].description}</p>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">Feels {Math.round(weather.main.feels_like)}°</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                       <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl text-center border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-500 font-bold block mb-1">Humidity</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-gray-300 text-lg">{weather.main.humidity}%</span>
                       </div>
                       <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl text-center border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-500 font-bold block mb-1">Wind</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-gray-300 text-lg">{weather.wind.speed}</span>
                          <span className="text-[10px] text-slate-400 ml-1">m/s</span>
                       </div>
                    </div>
                  </div>
                ) : (
                  // FALLBACK
                  <div className="flex flex-col items-center justify-center h-32 opacity-50">
                     <CloudSun className="w-10 h-10 text-slate-300 dark:text-zinc-600 mb-2" />
                     <p className="text-sm text-slate-400">Unavailable</p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate("/weather-alerts")}
                  className="w-full mt-5 py-2.5 text-xs font-bold text-center border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  Full Forecast <ExternalLink size={12} />
                </button>
              </div>

              {/* --- ACTIVE ALERTS SUMMARY --- */}
              <div className={`
                p-6 rounded-2xl transition-all h-full flex flex-col
                /* Light Mode */
                bg-white border border-slate-200 shadow-lg shadow-slate-200/50
                /* Dark Mode */
                dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none
              `}>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-700 dark:text-white text-lg">
                    Alerts
                  </h4>
                  <span className="bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/20 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    2 Active
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/10">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0 animate-pulse"></div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 dark:text-gray-200">High Surf Warning</p>
                       <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">Coastal areas affected.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/10">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0 animate-pulse"></div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 dark:text-gray-200">Severe Thunderstorm</p>
                       <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">Potential flooding.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/alerts")}
                  className="w-full mt-5 py-2.5 text-xs font-bold text-center border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  View All Alerts
                </button>
              </div>
            </div>
          </div>

          {/* --- QUICK ACTIONS --- */}
          <div className={`
            p-6 rounded-2xl transition-all h-full
            /* Light Mode */
            bg-white border border-slate-200 shadow-lg shadow-slate-200/50
            /* Dark Mode */
            dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none
          `}>
            <h4 className="font-bold text-slate-700 dark:text-white text-lg mb-6 flex items-center gap-2">
              ⚡ Quick Actions
            </h4>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate("/contacts")}
                className={`
                  w-full text-left flex items-center p-4 rounded-xl border transition-all group
                  /* Light Mode */
                  bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md
                  /* Dark Mode */
                  dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20
                `}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-gray-200">Helplines</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">Emergency numbers</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/map")}
                className={`
                  w-full text-left flex items-center p-4 rounded-xl border transition-all group
                  /* Light Mode */
                  bg-slate-50 border-slate-100 hover:bg-white hover:border-green-200 hover:shadow-md
                  /* Dark Mode */
                  dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20
                `}
              >
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-gray-200">Nearby Shelters</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">Safe locations map</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/safety-info")}
                className={`
                  w-full text-left flex items-center p-4 rounded-xl border transition-all group
                  /* Light Mode */
                  bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-md
                  /* Dark Mode */
                  dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20
                `}
              >
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-gray-200">Safety Guides</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">Preparedness tips</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};