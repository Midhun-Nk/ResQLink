import React, { useState, useEffect, useMemo } from 'react';
import {
  Siren,
  Wind,
  Radio,
  Activity,
  ShieldAlert,
  CloudLightning,
  Eye,
  Thermometer,
  Droplets,
  Search,
  MapPin,
  Biohazard,
  Navigation,
  Waves,
  AlertTriangle,
  Zap,
  Terminal,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  ArrowUp,
  ArrowDown,
  LocateFixed,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- CONFIGURATION ---
const INITIAL_CITY = "Kozhikode";

// --- HELPERS ---
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const getDayName = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' });
};

// Process 3-hour forecast into Daily summaries
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
        humidity: item.main.humidity,
        count: 1
      };
    } else {
      dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, item.main.temp);
      dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp);
      dailyMap[date].wind_max = Math.max(dailyMap[date].wind_max, item.wind.speed);
      dailyMap[date].rain += (item.rain ? item.rain['3h'] : 0);
      dailyMap[date].count += 1;
    }
  });

  return Object.values(dailyMap).slice(0, 5); // Return next 5 days
};

// --- RISK ENGINE ---
const analyzeRisk = (weather, pollution) => {
  const alerts = [];
  let riskLevel = 'LOW';
  let riskColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
  let iconBg = 'bg-emerald-100 text-emerald-600';
  let riskScore = 0;

  if (!weather) return { level: 'WAITING', color: 'bg-slate-50', alerts: [] };

  // Wind
  if (weather.wind.speed > 10) {
    alerts.push({ type: 'WIND', message: 'High Winds', icon: Wind });
    riskScore += 2;
  }
  if (weather.wind.gust > 25) {
    alerts.push({ type: 'GUST', message: 'Gale Gusts', icon: Waves });
    riskScore += 3;
  }

  // Vis/Pressure
  if (weather.visibility < 1000) {
    alerts.push({ type: 'VIS', message: 'Low Visibility', icon: Eye });
    riskScore += 4;
  }
  if (weather.main.pressure < 990) {
    alerts.push({ type: 'BARO', message: 'Low Pressure', icon: Activity });
    riskScore += 3;
  }

  // Pollution
  if (pollution && pollution.list && pollution.list[0].main.aqi >= 4) {
    alerts.push({ type: 'AIR', message: 'Poor Air Quality', icon: Biohazard });
    riskScore += 3;
  }

  // Temp
  if (weather.main.temp > 38) {
    alerts.push({ type: 'HEAT', message: 'Excessive Heat', icon: Thermometer });
    riskScore += 3;
  }

  if (riskScore >= 6) {
    riskLevel = 'CRITICAL';
    riskColor = 'bg-red-50 border-red-200 text-red-900';
    iconBg = 'bg-red-100 text-red-600 animate-pulse';
  } else if (riskScore >= 3) {
    riskLevel = 'ELEVATED';
    riskColor = 'bg-amber-50 border-amber-200 text-amber-900';
    iconBg = 'bg-amber-100 text-amber-600';
  }

  return { level: riskLevel, color: riskColor, iconBg, alerts };
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    <div className="h-64 md:col-span-2 bg-slate-200 rounded-2xl"></div>
    <div className="h-64 md:col-span-2 bg-slate-200 rounded-2xl"></div>
    <div className="h-32 bg-slate-200 rounded-2xl"></div>
    <div className="h-32 bg-slate-200 rounded-2xl"></div>
    <div className="h-32 bg-slate-200 rounded-2xl"></div>
    <div className="h-32 bg-slate-200 rounded-2xl"></div>
  </div>
);

// --- ADVANCED CHART COMPONENT (RECHARTS) ---
const AnalyticsChart = ({ data, config }) => {
  if (!data || data.length === 0) return null;

  const { dataKey, color, type, unit, label } = config;
  const isBar = type === 'bar';
  
  // Custom Tooltip Component for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {getDayName(label)}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800">
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
        {isBar ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dt" 
              tickFormatter={(tick) => getDayName(tick)} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[6, 6, 0, 0]} 
              barSize={32}
              animationDuration={1500}
            />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dt" 
              tickFormatter={(tick) => getDayName(tick)} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }} 
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 0 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#gradient-${label})`} 
              animationDuration={1500}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

function WeatherView() {

const apikeyFromEnv = import.meta.env.VITE_WEATHER_API_KEY || "";
  const [apiKey, setApiKey] = useState(apikeyFromEnv);
  const [city, setCity] = useState(INITIAL_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Analytics State
  const [chartMetric, setChartMetric] = useState('temp'); // 'temp' | 'wind' | 'rain'

  // --- API HANDLERS ---
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

      // 1. Weather
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Location not found.");
      const weather = await weatherRes.json();
      
      if (queryType === 'coords') setCity(weather.name);

      // 2. Forecast
      const forecastRes = await fetch(forecastUrl);
      const forecast = await forecastRes.json();

      // 3. Pollution (needs coords)
      const { lat, lon } = weather.coord;
      const pollutionRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const pollution = await pollutionRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
      setPollutionData(pollution);
      setLastUpdated(new Date().toLocaleTimeString());
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

  // Initial Load
  useEffect(() => {
    if (apiKey) fetchAllData('city', INITIAL_CITY);
  }, [apiKey]);

  // Derived Data
  const riskProfile = useMemo(() => analyzeRisk(weatherData, pollutionData), [weatherData, pollutionData]);
  const dailyForecast = useMemo(() => processDailyForecast(forecastData?.list), [forecastData]);

  // Chart Configs
  const chartConfigs = {
    temp: { dataKey: 'temp_max', label: 'Max Temp', color: '#f97316', type: 'line', unit: '°' },
    wind: { dataKey: 'wind_max', label: 'Wind Speed', color: '#3b82f6', type: 'line', unit: 'm/s' },
    rain: { dataKey: 'rain', label: 'Precipitation', color: '#06b6d4', type: 'bar', unit: 'mm' },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/10 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Radio className="text-white w-4 h-4" />
            </div>
            <h1 className="font-bold text-base tracking-tight text-slate-900">
              Disaster<span className="text-blue-600">OS</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500 shadow-emerald-200 shadow-md' : 'bg-red-500'}`}></span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider hidden sm:inline">
              {apiKey ? 'SYSTEM ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* SEARCH & CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search sector..."
              className="block w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </form>
          <button 
            onClick={handleUseLocation}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm font-medium text-sm"
          >
            <LocateFixed className="w-4 h-4" />
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}

        {loading ? <SkeletonLoader /> : weatherData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* THREAT STATUS BANNER */}
            <div className={`rounded-xl border p-4 flex items-center justify-between shadow-sm ${riskProfile.color}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${riskProfile.iconBg}`}>
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold opacity-70 tracking-wider">THREAT LEVEL</h2>
                  <p className="text-xl font-black tracking-tight leading-none">{riskProfile.level}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5 text-xs font-bold opacity-60 justify-end mb-0.5">
                  <Clock className="w-3 h-3" /> UPDATED
                </div>
                <div className="font-mono text-sm">{lastUpdated}</div>
              </div>
            </div>

            {/* MAIN BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              
              {/* 1. CURRENT WEATHER (Large Card) */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} className="w-40 h-40 -mt-10 -mr-10" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                      Current Conditions
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <MapPin className="w-3 h-3" /> {weatherData.name}, {weatherData.sys.country}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <h2 className="text-6xl font-bold text-slate-900 tracking-tighter">
                      {Math.round(weatherData.main.temp)}°
                    </h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-medium text-slate-700 capitalize leading-tight">
                        {weatherData.weather[0].description}
                      </p>
                      <p className="text-sm text-slate-400 font-medium">
                        Feels like {Math.round(weatherData.main.feels_like)}°
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6">
                   <MiniStat label="Low/High" value={`${Math.round(weatherData.main.temp_min)}° / ${Math.round(weatherData.main.temp_max)}°`} />
                   <MiniStat label="Sunrise" value={formatTime(weatherData.sys.sunrise)} />
                   <MiniStat label="Sunset" value={formatTime(weatherData.sys.sunset)} />
                </div>
              </div>

              {/* 2. CRITICAL TELEMETRY (2x2 Grid) */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <CompactCard 
                  icon={Wind} color="indigo" label="Wind" 
                  value={`${weatherData.wind.speed} m/s`} 
                  sub={`${weatherData.wind.deg}° ${weatherData.wind.gust ? `/ Gust ${weatherData.wind.gust}` : ''}`} 
                />
                <CompactCard 
                  icon={Droplets} color="cyan" label="Humidity" 
                  value={`${weatherData.main.humidity}%`} 
                  sub={`Dew Point: ${Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5))}°`} 
                />
                <CompactCard 
                  icon={Activity} color="blue" label="Pressure" 
                  value={`${weatherData.main.pressure} hPa`} 
                  sub={weatherData.main.grnd_level ? `Ground: ${weatherData.main.grnd_level}` : 'Sea Level'} 
                />
                <CompactCard 
                  icon={Biohazard} color="purple" label="Air Quality" 
                  value={pollutionData ? `AQI ${pollutionData.list[0].main.aqi}` : 'N/A'} 
                  sub={pollutionData ? `PM2.5: ${pollutionData.list[0].components.pm2_5}` : ''}
                  alert={pollutionData && pollutionData.list[0].main.aqi > 3}
                />
              </div>

              {/* 3. HOURLY STRIP (Full Width) */}
              <div className="md:col-span-4 bg-slate-900 rounded-2xl p-5 shadow-sm text-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tactical Forecast (3-Hour Intervals)</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {forecastData?.list.slice(0, 12).map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] font-mono text-slate-400 mb-1">
                        {new Date(item.dt * 1000).getHours()}:00
                      </span>
                      <img 
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                        className="w-10 h-10 my-1" 
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

              {/* 4. ANALYTICS & TRENDS */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                
                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Analytics Engine</h3>
                  </div>
                  
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button 
                      onClick={() => setChartMetric('temp')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMetric === 'temp' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Temperature
                    </button>
                    <button 
                      onClick={() => setChartMetric('wind')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMetric === 'wind' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Wind
                    </button>
                    <button 
                      onClick={() => setChartMetric('rain')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMetric === 'rain' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Precipitation
                    </button>
                  </div>
                </div>

                {/* The Chart */}
                <AnalyticsChart data={dailyForecast} config={chartConfigs[chartMetric]} />
                
                {/* 5-Day Outlook List below chart */}
                <div className="grid grid-cols-5 gap-2 mt-6 border-t border-slate-100 pt-6">
                  {dailyForecast.map((day, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {getDayName(day.dt)}
                      </span>
                      <div className="bg-slate-100 rounded-full p-1.5 mb-1">
                          <img 
                          src={`https://openweathermap.org/img/wn/${day.weather.icon.replace('n','d')}@2x.png`} 
                          className="w-8 h-8" 
                          alt="icon" 
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{Math.round(day.temp_max)}°</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 p-3.5 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors">
                <ShieldAlert className="w-4 h-4" /> EVACUATION
              </button>
              <button className="bg-slate-900 text-white hover:bg-slate-800 p-3.5 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors">
                <Radio className="w-4 h-4" /> BROADCAST
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const MiniStat = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase font-bold text-slate-400">{label}</div>
    <div className="text-sm font-semibold text-slate-700">{value}</div>
  </div>
);

const CompactCard = ({ icon: Icon, color, label, value, sub, alert }) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className={`bg-white border ${alert ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'} rounded-2xl p-4 shadow-sm flex flex-col justify-between h-28`}>
      <div className="flex justify-between items-start">
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {alert && <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />}
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-xl font-bold text-slate-800 tracking-tight leading-none">{value}</div>
        {sub && <div className="text-[10px] font-medium text-slate-500 mt-1 truncate">{sub}</div>}
      </div>
    </div>
  );
};

export default WeatherView;