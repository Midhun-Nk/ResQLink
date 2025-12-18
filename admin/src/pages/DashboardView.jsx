import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { LiveDisasterMap } from '../components/LiveDisasterMap';
import { dashboardData } from '../assets/data';
import { StatCard } from '../components/StatCard';
import { BookOpen, CloudSun, MapPin, Phone, ShieldAlert, Loader2 } from 'lucide-react';

export const DashboardView = () => {
  const navigate = useNavigate();
  
  // --- WEATHER STATE ---
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // You can change this default city or use Geolocation logic here
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
    <div className="animate-in fade-in duration-500">
      <div className="space-y-6">
        
        {/* Latest Alert Section */}
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg shadow-md flex items-start">
          <ShieldAlert className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold">LATEST ALERT: High Wind Advisory</h3>
            <p className="text-sm">
              Strong winds expected across coastal areas from 4:00 PM onwards.
              Secure loose objects and avoid coastal travel. Updated: 5 mins ago.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* SOS Card */}
            <div className="bg-red-600 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-red-200">
              <div>
                <h3 className="text-3xl font-bold">Emergency SOS</h3>
                <p className="mt-2 text-red-100 max-w-md">
                  If you are in immediate danger, press the SOS button to alert
                  authorities with your location.
                </p>
              </div>
              <button
                onClick={() => navigate("/sos")}
                className="sos-button mt-6 md:mt-0 flex-shrink-0 w-28 h-28 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-3xl shadow-2xl hover:scale-105 transition-transform"
              >
                SOS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* --- LIVE WEATHER CARD --- */}
              <div className="bg-white p-6 rounded-2xl shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-slate-800 text-lg">Current Weather</h4>
                   {weather && (
                     <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                       {weather.name}
                     </span>
                   )}
                </div>
                
                {loading ? (
                  <div className="h-24 flex items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Loading live data...
                  </div>
                ) : weather ? (
                  // LIVE DATA VIEW
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt="weather icon"
                        className="w-16 h-16 -ml-2"
                      />
                      <span className="text-4xl font-bold text-slate-900">
                        {Math.round(weather.main.temp)}°
                      </span>
                    </div>
                    <div className="text-right text-slate-500">
                      <p className="capitalize font-medium text-slate-700">{weather.weather[0].description}</p>
                      <p className="text-sm">Feels like {Math.round(weather.main.feels_like)}°</p>
                      <p className="text-xs mt-1 text-slate-400">H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°</p>
                    </div>
                  </div>
                ) : (
                  // FALLBACK STATIC VIEW (If API Fails)
                  <div className="flex items-center justify-between mt-4 opacity-50">
                    <div className="flex items-center">
                      <CloudSun className="w-12 h-12 text-slate-400" />
                      <span className="text-4xl font-bold ml-4 text-slate-900">--°</span>
                    </div>
                    <div className="text-right text-slate-500">
                      <p>Data Unavailable</p>
                      <p>Check API Connection</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => navigate("/weather-alerts")}
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                  View Full Forecast &rarr;
                </button>
              </div>

              {/* Active Alerts Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h4 className="font-bold text-slate-800 text-lg">
                  Active Alerts Summary
                </h4>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                    <p className="ml-3 text-sm text-slate-600">
                      <strong>High Surf Warning</strong>
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                    <p className="ml-3 text-sm text-slate-600">
                      <strong>Severe Thunderstorm Watch</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/alerts")}
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                >
                  View All Alerts &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h4 className="font-bold text-slate-800 text-lg mb-4">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/contacts")}
                className="w-full text-left flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Phone className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Helplines</p>
                  <p className="text-sm text-slate-500">
                    Find emergency numbers.
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate("/map")}
                className="w-full text-left flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <MapPin className="h-6 w-6 text-green-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Nearby Shelters</p>
                  <p className="text-sm text-slate-500">
                    View safe locations on map.
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate("/safety-info")}
                className="w-full text-left flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-indigo-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Safety Guides</p>
                  <p className="text-sm text-slate-500">
                    Read preparedness checklists.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Disaster Command Center</h3>
          <p className="text-gray-500">Live Situation Monitoring System</p>
        </div>
        <div className="flex gap-6 items-center">
           <div className="text-right">
             <h4 className="text-xl font-bold text-red-600">3</h4>
             <span className="text-gray-400 text-xs uppercase tracking-wider">Critical Alerts</span>
           </div>
           <div className="w-px h-10 bg-gray-200"></div>
           <div className="text-right">
             <h4 className="text-xl font-bold text-green-600">12</h4>
             <span className="text-gray-400 text-xs uppercase tracking-wider">Teams Deployed</span>
           </div>
        </div>
      </div>

      {/* Live Map Section */}
      <div className="mb-6">
         <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-900">Live Crisis Map</h4>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Fullscreen</button>
         </div>
         <LiveDisasterMap />
      </div>
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evacuation Progress Chart */}
        <StatCard title="Evacuation Progress" actions>
          <div className="flex gap-6 mb-6">
             <div>
               <p className="text-gray-400 text-xs mb-1">Evacuated</p>
               <h4 className="text-xl font-bold text-green-600">4,800</h4>
             </div>
             <div>
               <p className="text-gray-400 text-xs mb-1">Pending</p>
               <h4 className="text-xl font-bold text-orange-500">200</h4>
             </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.evacuation}>
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis hide />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="safe" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Incident Distribution Pie Chart */}
        <StatCard title="Incident Severity">
           <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={dashboardData.severityDistribution}
                       innerRadius={60}
                       outerRadius={100}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {dashboardData.severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <RechartsTooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute">
                 <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">100%</span>
                    <p className="text-xs text-gray-500 uppercase">Total</p>
                 </div>
              </div>
           </div>
           <div className="flex justify-center gap-4 mt-[-20px]">
              {dashboardData.severityDistribution.map((item) => (
                 <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                    <span className="text-xs text-gray-600">{item.name}</span>
                 </div>
              ))}
           </div>
        </StatCard>
      </div>
    </div>
  );
};