import React, { useState, useEffect, useMemo } from 'react';
import {
  Siren, Wind, Radio, Activity, ShieldAlert, Eye, Thermometer, Droplets,
  Search, MapPin, Biohazard, Waves, AlertTriangle, Terminal,
  Cloud, LocateFixed, Clock, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- CONFIGURATION ---
const INITIAL_CITY = "Kozhikode";

// --- HELPERS ---
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', minute: '2-digit', hour12: true 
  });
};

const getDayName = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' });
};

const processDailyForecast = (list) => {
  if (!list) return [];
  const dailyMap = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: item.dt,
        temp_min: item.main.temp,
        temp_max: item.main.temp,
        wind_max: item.wind.speed,
        weather: item.weather[0],
        rain: item.rain ? item.rain['3h'] : 0,
      };
    } else {
      dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp);
      dailyMap[date].wind_max = Math.max(dailyMap[date].wind_max, item.wind.speed);
      dailyMap[date].rain += (item.rain ? item.rain['3h'] : 0);
    }
  });
  return Object.values(dailyMap).slice(0, 5);
};

// --- RISK ENGINE ---
const analyzeRisk = (weather, pollution) => {
  let riskLevel = 'NORMAL';
  let riskColor = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  let icon = Activity;
  
  if (!weather) return { level: 'WAITING', color: 'bg-slate-50', icon: Activity };

  let score = 0;
  if (weather.wind.speed > 10) score += 2;
  if (weather.main.temp > 35) score += 2;
  if (pollution?.list[0].main.aqi >= 4) score += 2;

  if (score >= 4) {
    riskLevel = 'CRITICAL';
    riskColor = 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400';
    icon = Siren;
  } else if (score >= 2) {
    riskLevel = 'ELEVATED';
    riskColor = 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    icon = AlertTriangle;
  }

  return { level: riskLevel, color: riskColor, icon };
};

// --- CHART COMPONENT ---
const AnalyticsChart = ({ data, config }) => {
  if (!data || data.length === 0) return null;
  const { dataKey, color, type, unit } = config;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 border border-slate-200 dark:border-white/10 shadow-xl rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {getDayName(label)}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              {Number(payload[0].value).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">{unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 mt-4 select-none">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="dt" tickFormatter={(t) => getDayName(t)} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="dt" tickFormatter={(t) => getDayName(t)} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} padding={{ top: 20, bottom: 0 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#gradient-${dataKey})`} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// --- MAIN COMPONENT ---
function WeatherView() {
  const apikeyFromEnv = import.meta.env.VITE_WEATHER_API_KEY || "";
  const [apiKey] = useState(apikeyFromEnv);
  const [city, setCity] = useState(INITIAL_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [chartMetric, setChartMetric] = useState('temp');

  const fetchAllData = async (queryType, queryValue) => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
      let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${apiKey}`;
      
      if (queryType === 'city') {
        weatherUrl += `&q=${queryValue}`;
        forecastUrl += `&q=${queryValue}`;
      } else {
        weatherUrl += `&lat=${queryValue.lat}&lon=${queryValue.lon}`;
        forecastUrl += `&lat=${queryValue.lat}&lon=${queryValue.lon}`;
      }

      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Location not found.");
      const weather = await weatherRes.json();
      
      if (queryType === 'coords') setCity(weather.name);

      const forecastRes = await fetch(forecastUrl);
      const forecast = await forecastRes.json();

      const { lat, lon } = weather.coord;
      const pollutionRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const pollution = await pollutionRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
      setPollutionData(pollution);
      setLastUpdated(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllData('city', city);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAllData('coords', { lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => { setError("Location access denied."); setLoading(false); }
    );
  };

  useEffect(() => {
    if (apiKey) fetchAllData('city', INITIAL_CITY);
  }, [apiKey]);

  const riskProfile = useMemo(() => analyzeRisk(weatherData, pollutionData), [weatherData, pollutionData]);
  const dailyForecast = useMemo(() => processDailyForecast(forecastData?.list), [forecastData]);

  const chartConfigs = {
    temp: { dataKey: 'temp_max', label: 'Max Temp', color: '#f97316', type: 'line', unit: '°' },
    wind: { dataKey: 'wind_max', label: 'Wind Speed', color: '#3b82f6', type: 'line', unit: 'm/s' },
    rain: { dataKey: 'rain', label: 'Precipitation', color: '#06b6d4', type: 'bar', unit: 'mm' },
  };

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search sector or city..."
            className={`
              block w-full pl-10 pr-4 py-3 text-sm font-medium rounded-xl outline-none transition-all
              bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              dark:bg-[#0a0a0a] dark:border-white/10 dark:text-white dark:focus:ring-white/10 dark:focus:border-white/30
            `}
          />
        </form>
        <button 
          onClick={handleUseLocation}
          className={`
            px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all
            bg-white border border-slate-200 text-slate-600 hover:bg-slate-50
            dark:bg-[#0a0a0a] dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white
          `}
        >
          <LocateFixed className="w-4 h-4" />
          <span className="hidden sm:inline">Locate Me</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 text-sm font-bold mb-6">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          <div className="h-64 md:col-span-2 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-64 md:col-span-2 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
        </div>
      ) : weatherData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* THREAT STATUS BANNER */}
          <div className={`rounded-xl border p-4 flex items-center justify-between shadow-sm relative overflow-hidden ${riskProfile.color}`}>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <riskProfile.icon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-[10px] font-black opacity-70 tracking-[0.2em] uppercase">Sector Threat Level</h2>
                <p className="text-2xl font-black tracking-tight leading-none mt-0.5">{riskProfile.level}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block relative z-10 opacity-70">
              <div className="flex items-center gap-1.5 text-xs font-bold justify-end">
                <Clock className="w-3 h-3" /> LIVE FEED
              </div>
              <div className="font-mono text-sm">{lastUpdated}</div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 1. CURRENT WEATHER (Large Card) */}
            <div className={`
              md:col-span-2 rounded-2xl p-6 border shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[240px] group
              bg-white border-slate-200
              dark:bg-[#0a0a0a] dark:border-white/10
            `}>
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 dark:bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500"></div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    Live Conditions
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" /> {weatherData.name}, {weatherData.sys.country}
                  </span>
                </div>
                
                <div className="flex items-start gap-4 relative z-10">
                  <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {Math.round(weatherData.main.temp)}°
                  </h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-xl font-bold text-slate-700 dark:text-zinc-200 capitalize leading-tight">
                      {weatherData.weather[0].description}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-zinc-500 font-medium">
                      Feels like {Math.round(weatherData.main.feels_like)}°
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 border-t border-slate-100 dark:border-white/5 pt-4">
                 <MiniStat label="Low / High" value={`${Math.round(weatherData.main.temp_min)}° / ${Math.round(weatherData.main.temp_max)}°`} />
                 <MiniStat label="Sunrise" value={formatTime(weatherData.sys.sunrise)} />
                 <MiniStat label="Sunset" value={formatTime(weatherData.sys.sunset)} />
              </div>
            </div>

            {/* 2. CRITICAL TELEMETRY (2x2 Grid) */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <CompactCard 
                icon={Wind} color="indigo" label="Wind Speed" 
                value={`${weatherData.wind.speed} m/s`} 
                sub={`${weatherData.wind.deg}° Direction`} 
              />
              <CompactCard 
                icon={Droplets} color="cyan" label="Humidity" 
                value={`${weatherData.main.humidity}%`} 
                sub={`Dew Point: ${Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5))}°`} 
              />
              <CompactCard 
                icon={Activity} color="blue" label="Pressure" 
                value={`${weatherData.main.pressure} hPa`} 
                sub="Atmospheric" 
              />
              <CompactCard 
                icon={Biohazard} color="purple" label="Air Quality" 
                value={pollutionData ? `AQI ${pollutionData.list[0].main.aqi}` : 'N/A'} 
                sub={pollutionData ? `PM2.5: ${pollutionData.list[0].components.pm2_5}` : ''}
                alert={pollutionData && pollutionData.list[0].main.aqi > 3}
              />
            </div>

            {/* 3. TACTICAL FORECAST (Strip) */}
            <div className={`
              md:col-span-4 rounded-2xl p-5 shadow-sm border
              bg-slate-900 text-slate-200 border-slate-800
              dark:bg-[#111] dark:border-white/10
            `}>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tactical Forecast (3-Hour)</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {forecastData?.list.slice(0, 12).map((item, i) => (
                  <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">
                      {new Date(item.dt * 1000).getHours()}:00
                    </span>
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                      className="w-10 h-10 my-1 filter drop-shadow-sm" 
                      alt="icon" 
                    />
                    <span className="font-bold text-white text-sm">{Math.round(item.main.temp)}°</span>
                    <span className="text-[9px] text-blue-400 mt-1 flex items-center gap-0.5">
                      <Droplets className="w-2 h-2" /> {Math.round(item.pop * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. ANALYTICS */}
            <div className={`
              md:col-span-4 rounded-2xl p-6 shadow-sm border
              bg-white border-slate-200
              dark:bg-[#0a0a0a] dark:border-white/10
            `}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">Analytics Engine</h3>
                </div>
                
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                  {[
                    { id: 'temp', label: 'Temp' },
                    { id: 'wind', label: 'Wind' },
                    { id: 'rain', label: 'Rain' }
                  ].map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setChartMetric(m.id)}
                      className={`
                        px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${chartMetric === m.id 
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white' 
                          : 'text-slate-500 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'}
                      `}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnalyticsChart data={dailyForecast} config={chartConfigs[chartMetric]} />
              
              <div className="grid grid-cols-5 gap-2 mt-6 border-t border-slate-100 dark:border-white/5 pt-6">
                {dailyForecast.map((day, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase mb-1">
                      {getDayName(day.dt)}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-300">{Math.round(day.temp_max)}°</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ACTION FOOTER */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-red-50 border-2 border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 p-4 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-colors uppercase">
              <ShieldAlert className="w-4 h-4" /> Initiate Evacuation
            </button>
            <button className="bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 p-4 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-colors uppercase">
              <Radio className="w-4 h-4" /> Broadcast Alert
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const MiniStat = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-600">{label}</div>
    <div className="text-sm font-bold text-slate-700 dark:text-zinc-300">{value}</div>
  </div>
);

const CompactCard = ({ icon: Icon, color, label, value, sub, alert }) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400',
    cyan: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-400',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400',
  };

  return (
    <div className={`
      rounded-2xl p-4 shadow-sm flex flex-col justify-between h-28 border transition-all
      ${alert 
        ? 'bg-red-50 border-red-200 ring-2 ring-red-100 dark:bg-red-900/10 dark:border-red-500/30 dark:ring-red-500/20' 
        : 'bg-white border-slate-200 dark:bg-[#0a0a0a] dark:border-white/10'}
    `}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {alert && <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />}
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">{value}</div>
        {sub && <div className="text-[10px] font-medium text-slate-500 dark:text-zinc-600 mt-1 truncate">{sub}</div>}
      </div>
    </div>
  );
};

export default WeatherView;