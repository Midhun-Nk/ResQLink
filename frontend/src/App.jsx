import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Settings, Maximize, 
  LayoutDashboard, CloudRain, AlertTriangle, Phone, Radio, 
  Shield, Heart, Map as MapIcon, FileText, Siren, Navigation,
  ChevronRight, Plus, Filter, CheckCircle, XCircle, Clock,
  Thermometer, Wind, Droplets, MapPin, Activity, MoreHorizontal, Users,
  LogOut
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// --- Mock Data: Disaster Management ---

const dashboardData = {
  incidents: [
    { name: 'Mon', reported: 12, resolved: 8 },
    { name: 'Tue', reported: 19, resolved: 15 },
    { name: 'Wed', reported: 8, resolved: 12 },
    { name: 'Thu', reported: 24, resolved: 20 },
    { name: 'Fri', reported: 15, resolved: 18 },
    { name: 'Sat', reported: 10, resolved: 9 },
    { name: 'Sun', reported: 30, resolved: 25 },
  ],
  evacuation: [
    { time: '06:00', safe: 1200, pending: 3800 },
    { time: '09:00', safe: 2500, pending: 2500 },
    { time: '12:00', safe: 3800, pending: 1200 },
    { time: '15:00', safe: 4500, pending: 500 },
    { time: '18:00', safe: 4800, pending: 200 },
  ],
  severityDistribution: [
    { name: 'Critical', value: 30, color: '#ef4444' },
    { name: 'Moderate', value: 45, color: '#f97316' },
    { name: 'Low', value: 25, color: '#3b82f6' },
  ]
};

const rescueTeamsData = [
  { id: 101, name: "Alpha Squad", type: "Flood Rescue", status: "Deployed", capacity: "20 Boats", image: "https://images.unsplash.com/photo-1599468962656-b09772b2d28f?auto=format&fit=crop&q=80&w=300&h=200", location: "Sector 4" },
  { id: 102, name: "Bravo Medics", type: "Medical Unit", status: "Standby", capacity: "5 Ambulances", image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=300&h=200", location: "Base Camp" },
  { id: 103, name: "Charlie Fire", type: "Firefighters", status: "Active", capacity: "3 Trucks", image: "https://images.unsplash.com/photo-1563821262-e64fc5a95f53?auto=format&fit=crop&q=80&w=300&h=200", location: "Sector 2" },
  { id: 104, name: "Delta Air", type: "Airlift Support", status: "Maintenance", capacity: "2 Choppers", image: "https://images.unsplash.com/photo-1452509133926-2b180c6d6245?auto=format&fit=crop&q=80&w=300&h=200", location: "Heliport" },
];

const alertsData = [
  { id: "A-2901", title: "Flash Flood Warning", area: "Riverside District", severity: "Critical", time: "10 mins ago", type: "Flood", affected: "2.5k People" },
  { id: "A-2902", title: "Heavy Rainfall", area: "Northern Hills", severity: "Moderate", time: "1 hour ago", type: "Weather", affected: "500 People" },
  { id: "A-2903", title: "Landslide Risk", area: "Highway 9", severity: "Low", time: "3 hours ago", type: "Geological", affected: "Road Closed" },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  activeId, 
  isExpanded, 
  onToggle, 
  onSelect, 
  subItems = [], 
  isSidebarCollapsed 
}) => {
  const safeSubItems = subItems || [];
  const hasSub = safeSubItems.length > 0;
  
  const isParentActive = hasSub 
    ? (isExpanded || safeSubItems.some(sub => sub.id === activeId) || activeId === label)
    : activeId === label;

  const [isHovered, setIsHovered] = useState(false);

  const handleMainClick = (e) => {
    if (hasSub && !isSidebarCollapsed) {
      if (onToggle) onToggle();
    } else {
      if (onSelect) onSelect(label);
    }
  };

  return (
    <div 
      className="mb-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Item Click Area */}
      <div 
        className={`flex items-center p-3 cursor-pointer select-none rounded-xl transition-all duration-200 h-[50px]
          ${isParentActive ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
          ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between'}
        `}
        onClick={handleMainClick}
      >
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
          {Icon && <Icon size={20} className={isSidebarCollapsed && isParentActive ? 'text-white' : ''} />}
          {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>
        {!isSidebarCollapsed && hasSub && (
          <ChevronRight size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
        )}
      </div>
      
      {/* 1. Standard Dropdown */}
      {!isSidebarCollapsed && hasSub && isExpanded && (
        <div className="mt-1 mb-2 animate-in slide-in-from-top-2 duration-300">
          {safeSubItems.map((sub) => (
             <div 
               key={sub.id}
               onClick={(e) => { 
                 e.stopPropagation(); 
                 if(onSelect) onSelect(sub.id); 
               }}
               className={`py-2 px-3 ml-4 cursor-pointer block rounded-lg text-sm transition-colors duration-200
                 ${activeId === sub.id ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'}`}
             >
               {sub.label}
             </div>
          ))}
        </div>
      )}

      {/* 2. Floating Hover Menu */}
      {isSidebarCollapsed && isHovered && (
        <div 
          className="absolute bg-white shadow-xl rounded-xl border border-gray-100 z-50"
          style={{ 
            left: '100%', 
            top: 0, 
            width: '220px', 
            marginLeft: '8px' 
          }}
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <span className="font-bold text-red-600">{label}</span>
          </div>
          <div className="py-1">
            {hasSub ? (
              safeSubItems.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if(onSelect) onSelect(sub.id); 
                  }}
                  className={`px-4 py-2 cursor-pointer block text-sm transition-colors
                    ${activeId === sub.id ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {sub.label}
                </div>
              ))
            ) : (
              <div 
                  onClick={() => { if(onSelect) onSelect(label); }}
                  className={`px-4 py-2 cursor-pointer block text-sm transition-colors
                    ${activeId === label ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, children, actions }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
    <div className="p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h5 className="text-lg font-bold text-gray-900">{title}</h5>
        {actions && <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>}
      </div>
      {children}
    </div>
  </div>
);

const RescueTeamCard = ({ team }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Deployed': return 'bg-red-100 text-red-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Standby': return 'bg-yellow-100 text-yellow-700';
      case 'Maintenance': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48">
         <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
         <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(team.status)}`}>
           {team.status}
         </span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-bold text-gray-900 text-lg">{team.name}</h5>
            <p className="text-gray-500 text-sm">{team.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6 text-gray-600 text-sm">
           <MapPin size={16} />
           <span>{team.location}</span>
           <span className="mx-2">•</span>
           <span>{team.capacity}</span>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
             <Radio size={16} /> Contact
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
             <Navigation size={16} /> Track
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertCard = ({ alert }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center
                ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                  alert.severity === 'Moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                <AlertTriangle size={32} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-lg text-gray-900">{alert.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                    alert.severity === 'Moderate' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                   {alert.severity}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><MapPin size={14}/> {alert.area}</p>
              <div className="text-gray-400 text-xs flex items-center gap-4">
                 <span className="flex items-center gap-1"><Clock size={12} /> {alert.time}</span>
                 <span className="font-bold text-gray-700 flex items-center gap-1"><Users size={12} /> {alert.affected}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-end">
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">Details</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700">Deploy Unit</button>
           </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Views ---

const LiveDisasterMap = () => (
   <div className="relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
      <img 
         src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600&h=800" 
         alt="Map Background" 
         className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-blue-900/10"></div>
      
      {/* Map Markers */}
      <div className="absolute top-1/4 left-1/4 animate-pulse">
         <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
         <div className="absolute -inset-2 bg-red-500 rounded-full opacity-30 animate-ping"></div>
         <div className="absolute left-6 top-[-10px] bg-white px-2 py-1 rounded shadow-md text-xs font-bold whitespace-nowrap">
            Flood Zone A
         </div>
      </div>

      <div className="absolute bottom-1/3 right-1/3">
         <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
         <div className="absolute left-6 top-[-10px] bg-white px-2 py-1 rounded shadow-md text-xs font-bold whitespace-nowrap">
            Landslide Warning
         </div>
      </div>

      <div className="absolute top-10 right-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100">
         <h5 className="font-bold text-gray-900 text-sm mb-2">Live Status</h5>
         <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical (3)
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Moderate (5)
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Cleared (12)
         </div>
      </div>
   </div>
);

const DashboardView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
            {/* Legend Overlay */}
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

const WeatherView = () => (
  <div className="animate-in fade-in duration-500">
    <h4 className="text-xl font-bold text-gray-900 mb-6">Live Weather Analysis</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Weather Card */}
      <div className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold mb-2">Heavy Rain</h2>
            <p className="text-blue-100">Riverside District • Monday, 12:00 PM</p>
          </div>
          <CloudRain size={64} className="text-blue-200" />
        </div>
        <div className="mt-12 flex items-end gap-4">
          <h1 className="text-6xl font-bold">24°</h1>
          <p className="mb-2 text-xl text-blue-100">Precipitation: 90%</p>
        </div>
      </div>

      {/* Weather Stats */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Thermometer size={24}/></div>
           <div><p className="text-gray-500 text-sm">Temperature</p><h4 className="font-bold text-lg">24°C</h4></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Wind size={24}/></div>
           <div><p className="text-gray-500 text-sm">Wind Speed</p><h4 className="font-bold text-lg">18 km/h</h4></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-cyan-100 p-3 rounded-full text-cyan-600"><Droplets size={24}/></div>
           <div><p className="text-gray-500 text-sm">Humidity</p><h4 className="font-bold text-lg">82%</h4></div>
        </div>
      </div>
    </div>
  </div>
);

const AlertsView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-6">
       <h4 className="text-xl font-bold text-gray-900">Active Alerts</h4>
       <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
          <Filter size={16} /> Filter Severity
       </button>
    </div>
    {alertsData.map(alert => <AlertCard key={alert.id} alert={alert} />)}
  </div>
);

// Combined View for Dashboard > Weather & Alerts
const DashboardWeatherAlertsView = () => (
  <div className="flex flex-col gap-10">
     {/* Directly embedding the views for a "contained" feel */}
     <div>
        <WeatherView />
     </div>
     <div className="border-t border-gray-200 pt-8">
        <AlertsView />
     </div>
  </div>
);

const RescueView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h4 className="text-xl font-bold text-gray-900">Rescue Teams & Channels</h4>
      <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
        <Plus size={18} /> Deploy New Unit
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rescueTeamsData.map(team => <RescueTeamCard key={team.id} team={team} />)}
    </div>
  </div>
);

const SOSView = () => (
  <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[500px]">
    <button className="group relative w-64 h-64 rounded-full bg-red-600 flex flex-col items-center justify-center shadow-xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95">
      <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20 group-hover:opacity-40"></div>
      <Siren size={80} className="text-white mb-4" />
      <span className="text-3xl font-bold text-white tracking-widest">SOS</span>
      <span className="text-red-200 text-sm mt-2">PRESS FOR EMERGENCY</span>
    </button>
    <p className="mt-8 text-gray-500 max-w-md text-center">
      Pressing this button will immediately broadcast your location to all nearby rescue units and emergency contacts.
    </p>
  </div>
);

const PlaceholderView = ({ title, icon: Icon, color = "text-gray-300" }) => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center">
       {Icon && <Icon size={64} className={`${color} mb-6`} />}
       <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
       <p className="text-gray-500 max-w-md mx-auto">This module is connected to the central grid and will display real-time data when online.</p>
       <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800">Refresh Connection</button>
    </div>
  </div>
);

// --- Main Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [expandedMenu, setExpandedMenu] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Update URL on tab change
  useEffect(() => {
    const slug = activeTab.toLowerCase().replace(/\s+/g, '-');
    window.history.pushState({}, '', `#/${slug}`);
  }, [activeTab]);

  const toggleMenu = (menuLabel) => {
    if (isSidebarCollapsed) {
       setIsSidebarCollapsed(false);
       setExpandedMenu(menuLabel);
    } else {
       setExpandedMenu(expandedMenu === menuLabel ? null : menuLabel);
    }
  };

  const handleSidebarToggle = () => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 992) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardView />;
      case 'Dashboard Overview': return <DashboardView />;
      case 'Weather Alerts': return <DashboardWeatherAlertsView />;
      
      case 'Weather': return <WeatherView />;
      case 'Alerts': return <AlertsView />;
      case 'SOS': return <SOSView />;
      case 'Rescue Channels': return <RescueView />;
      case 'Map Navigation': return <PlaceholderView title="Live Map Navigation" icon={MapIcon} color="text-blue-500" />;
      case 'Donate': return <PlaceholderView title="Donation Center" icon={Heart} color="text-pink-500" />;
      case 'Safety Info': return <PlaceholderView title="Safety Guidelines" icon={Shield} color="text-green-500" />;
      case 'Resource Requests': return <PlaceholderView title="Resource Requests" icon={FileText} color="text-orange-500" />;
      case 'Contacts': return <PlaceholderView title="Emergency Contacts" icon={Phone} color="text-indigo-500" />;
      default: return <DashboardView />;
    }
  };

  const isMini = isSidebarCollapsed && !isMobileOpen;

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-white z-50 transition-all duration-300 border-r border-gray-100 shadow-sm flex flex-col
        ${isMobileOpen ? 'translate-x-0 w-[280px]' : (isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]')}
        ${!isMobileOpen && 'hidden lg:flex'}
        ${isMobileOpen && 'block'}
        lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className={`p-6 flex items-center gap-3 mb-2 h-[88px] ${isMini ? 'justify-center px-0' : ''}`}>
           <div className="bg-red-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 w-10 h-10 shadow-lg">
             <Activity size={24} />
           </div>
           {!isMini && <h3 className="font-bold text-2xl text-gray-900 tracking-tight whitespace-nowrap">ResQ<span className="text-red-600">Link</span></h3>}
        </div>
        
        {/* Navigation Items */}
        <div className={`pb-8 flex-1 flex flex-col ${isMini ? 'overflow-visible px-2' : 'overflow-y-auto px-4 custom-scrollbar'}`}>
           
           <SidebarItem 
             icon={LayoutDashboard} 
             label="Dashboard" 
             activeId={activeTab} 
             isExpanded={expandedMenu === 'Dashboard'} 
             onToggle={() => toggleMenu('Dashboard')}
             onSelect={(id) => setActiveTab(id)}
             isSidebarCollapsed={isMini}
             subItems={[
               { id: 'Dashboard Overview', label: 'Overview' },
               { id: 'Weather Alerts', label: 'Weather & Alerts' }
             ]}
           />
           
           {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 px-3 uppercase tracking-wider">Monitor</div>}
           {isMini && <div className="my-4 border-t border-gray-100 w-8 mx-auto"></div>}

           <SidebarItem icon={CloudRain} label="Weather" activeId={activeTab} onSelect={() => setActiveTab('Weather')} isSidebarCollapsed={isMini} />
           <SidebarItem icon={AlertTriangle} label="Alerts" activeId={activeTab} onSelect={() => setActiveTab('Alerts')} isSidebarCollapsed={isMini} />
           <SidebarItem icon={Siren} label="SOS" activeId={activeTab} onSelect={() => setActiveTab('SOS')} isSidebarCollapsed={isMini} />

           {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 px-3 uppercase tracking-wider">Response</div>}
           {isMini && <div className="my-4 border-t border-gray-100 w-8 mx-auto"></div>}

           <SidebarItem 
             icon={Radio} 
             label="Rescue" 
             activeId={activeTab} 
             isExpanded={expandedMenu === 'Rescue'} 
             onToggle={() => toggleMenu('Rescue')}
             onSelect={(id) => setActiveTab(id)} 
             isSidebarCollapsed={isMini}
             subItems={[
               { id: 'Rescue Channels', label: 'Channels' },
               { id: 'Map Navigation', label: 'Map Navigation' },
               { id: 'Resource Requests', label: 'Resource Requests' }
             ]}
           />
           
           <SidebarItem icon={Heart} label="Donate" activeId={activeTab} onSelect={() => setActiveTab('Donate')} isSidebarCollapsed={isMini} />
           
           {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 px-3 uppercase tracking-wider">Help</div>}
           {isMini && <div className="my-4 border-t border-gray-100 w-8 mx-auto"></div>}

           <SidebarItem icon={Shield} label="Safety Info" activeId={activeTab} onSelect={() => setActiveTab('Safety Info')} isSidebarCollapsed={isMini} />
           <SidebarItem icon={Phone} label="Contacts" activeId={activeTab} onSelect={() => setActiveTab('Contacts')} isSidebarCollapsed={isMini} />
           <SidebarItem icon={Settings} label="Settings" activeId={activeTab} onSelect={() => setActiveTab('Settings')} isSidebarCollapsed={isMini} />
           
        </div>

        {/* User Profile Section (Fixed at bottom) */}
        <div className={`p-4 border-t border-gray-100 ${isMini ? 'flex justify-center' : ''}`}>
           <div className={`flex items-center gap-3 ${isMini ? 'justify-center' : ''}`}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User" className="w-10 h-10 rounded-full bg-red-50" />
              {!isMini && (
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Sarah Connor</p>
                    <p className="text-xs text-gray-500 truncate">Field Commander</p>
                 </div>
              )}
              {!isMini && <button className="text-gray-400 hover:text-red-600"><LogOut size={18} /></button>}
           </div>
        </div>

      </div>

      {/* Main Layout */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col
        ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}
      `}>
        
        {/* Topbar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-6 h-[80px] flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" onClick={handleSidebarToggle}>
                <Menu size={20} />
              </button>
              <h4 className="font-bold text-lg text-gray-900 hidden md:block">{activeTab}</h4>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                 <input 
                    type="text" 
                    placeholder="Search incidents or teams..." 
                    className="w-[280px] bg-gray-100 border-none rounded-full pl-5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 transition-all" 
                 />
                 <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <div className="relative">
                <button className="p-2.5 bg-red-50 hover:bg-red-100 rounded-full text-red-600 transition-colors">
                  <Bell size={20} />
                </button>
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                 <div className="text-right hidden md:block">
                    <h6 className="font-bold text-sm text-gray-900 leading-tight">Sarah Connor</h6>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Coordinator</span>
                 </div>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Admin" className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
              </div>
           </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-6 pb-20">
           {renderContent()}
        </div>

      </div>
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

    </div>
  );
}