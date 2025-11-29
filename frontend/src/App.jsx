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
import { DashboardView } from './pages/DashboardView';
import { DashboardWeatherAlertsView } from './pages/DashboardWeatherAlertsView';
import { WeatherView } from './pages/WeatherView';
import { AlertsView } from './pages/AlertsView';
import { SOSView } from './pages/SOSView';
import { RescueView } from './pages/RescueView';
import { PlaceholderView } from './pages/PlaceholderView';
import { SidebarItem } from './components/SidebarItem';


// --- Components ---


// --- Views ---








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