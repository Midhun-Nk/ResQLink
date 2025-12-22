import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Settings, 
  LayoutDashboard, CloudRain, AlertTriangle, Phone, Radio, 
  Shield, Heart, Map as MapIcon, FileText, Siren, 
  Activity, LogOut, User, Users,
  Moon, Sun 
} from 'lucide-react';

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SidebarItem } from '../SidebarItem';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../NotificationBell';

export default function MainLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [expandedMenu, setExpandedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user } = useApp();

  useEffect(() => {
    let tab = location.pathname.replace("/", "").replace(/-/g, " ");
    if (tab.length === 0) tab = "Dashboard";
    setActiveTab(tab.replace(/\b\w/g, c => c.toUpperCase()));
  }, [location.pathname]);

  const navigateTo = (label) => {
    const path = "/" + label.toLowerCase().replace(/\s+/g, "-");
    setActiveTab(label);
    navigate(path);
  };

  const toggleMenu = (menuLabel) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setExpandedMenu(menuLabel);
    } else {
      setExpandedMenu(expandedMenu === menuLabel ? null : menuLabel);
    }
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth < 992) setIsMobileOpen(!isMobileOpen);
    else setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isMini = isSidebarCollapsed && !isMobileOpen;

  return (
    // MAIN CONTAINER
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden font-sans transition-colors duration-300 text-gray-900 dark:text-gray-100 selection:bg-red-500/30">
      
      {/* --- CUSTOM RED SCROLLBAR STYLES --- */}
      <style>{`
        /* Width */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        /* Track */
        ::-webkit-scrollbar-track {
          background: ${isDark ? '#0a0a0a' : '#f1f5f9'}; 
        }
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: #b91c1c; /* Red-700 */
          border-radius: 10px;
        }
        /* Handle on hover (Glow Effect) */
        ::-webkit-scrollbar-thumb:hover {
          background: #ef4444; /* Red-500 */
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7); 
        }
        /* Firefox support */
        * {
          scrollbar-width: thin;
          scrollbar-color: #b91c1c ${isDark ? '#0a0a0a' : '#f1f5f9'};
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <div 
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 flex flex-col border-r border-solid
          /* Light Mode */
          bg-white border-gray-100
          
          /* Dark Mode: Solid background (No Blur) */
          dark:bg-[#0a0a0a] dark:border-zinc-900

          ${isMobileOpen ? 'translate-x-0 w-[280px]' : (isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]')}
          ${!isMobileOpen && 'hidden lg:flex'}
          ${isMobileOpen && 'block'}
          lg:translate-x-0
        `}
      >

        {/* Brand Section */}
        <div className={`p-6 flex items-center gap-3 mb-2 h-[88px] ${isMini ? 'justify-center' : ''}`}>
          <div className="bg-red-600 rounded-xl flex items-center justify-center text-white font-bold w-10 h-10 shadow-lg shadow-red-600/20 ring-2 ring-red-500/20">
            <Activity size={24} />
          </div>
          {!isMini && <h3 className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">ResQ<span className="text-red-600">Link</span></h3>}
        </div>

        {/* Navigation Items */}
        <div className={`${isMini ? 'px-2' : 'px-4'} pb-8 flex-1 overflow-y-auto`}>

          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            activeId={activeTab}
            isExpanded={expandedMenu === "Dashboard"}
            onToggle={() => toggleMenu("Dashboard")}
            onSelect={navigateTo}
            isSidebarCollapsed={isMini}
            subItems={[
                { id: "Dashboard Overview", label: "Overview", icon: LayoutDashboard },
                { id: "Weather Alerts", label: "Weather & Alerts", icon: CloudRain }
            ]}
          />

          {/* Section: Emergency Help */}
          {!isMini && <div className="text-gray-400 dark:text-zinc-600 text-[11px] font-bold mt-6 mb-3 uppercase px-3 tracking-widest">Emergency Help</div>}
          {isMini && <div className="border-t border-gray-100 dark:border-zinc-900 w-8 mx-auto my-4"></div>}

          <SidebarItem 
            icon={Siren}
            label="SOS"
            activeId={activeTab}
            isExpanded={expandedMenu === "SOS"}
            onToggle={() => toggleMenu("SOS")}
            onSelect={navigateTo}
            isSidebarCollapsed={isMini}
              subItems={[
                { id: "SOS", label: "SOS", icon: Siren },
                { id: "Safety Info", label: "Safety Info", icon: Shield },
                { id: "Contacts", label: "Contacts", icon: Phone }
              ]}
          />

          {/* Section: Response */}
          {!isMini && <div className="text-gray-400 dark:text-zinc-600 text-[11px] font-bold mt-6 mb-3 uppercase px-3 tracking-widest">Response</div>}
          {isMini && <div className="border-t border-gray-100 dark:border-zinc-900 w-8 mx-auto my-4"></div>}

          <SidebarItem 
            icon={Radio}
            label="Rescue"
            activeId={activeTab}
            isExpanded={expandedMenu === "Rescue"}
            onToggle={() => toggleMenu("Rescue")}
            onSelect={navigateTo}
            isSidebarCollapsed={isMini}
              subItems={[
                { id: "Rescue Channels", label: "Channels", icon: Radio },
                { id: "Map Navigation", label: "Map Navigation", icon: MapIcon },
              ]}
          />
          
          {/* Section: Support */}
          {!isMini && <div className="text-gray-400 dark:text-zinc-600 text-[11px] font-bold mt-6 mb-3 uppercase px-3 tracking-widest">Support</div>}
          {isMini && <div className="border-t border-gray-100 dark:border-zinc-900 w-8 mx-auto my-4"></div>}

          <SidebarItem 
            icon={Heart}
            label="Support"
            activeId={activeTab}
            isExpanded={expandedMenu === "Support"}
            onToggle={() => toggleMenu("Support")}
            onSelect={navigateTo}
            isSidebarCollapsed={isMini}
              subItems={[
                { id: "Donate", label: "Donate", icon: Heart },
                { id: "Local Support Network", label: "Local Support Network", icon: Users },
                { id: "Resources Request", label: "Resources Request", icon: FileText }
              ]}
          />

          {/* Section: Settings */}
          {!isMini && <div className="text-gray-400 dark:text-zinc-600 text-[11px] font-bold mt-6 mb-3 uppercase px-3 tracking-widest">Settings</div>}
          {isMini && <div className="border-t border-gray-100 dark:border-zinc-900 w-8 mx-auto my-4"></div>}

            <SidebarItem
            icon={Settings}
            label="Settings"
            activeId={activeTab}
            isExpanded={expandedMenu === "Settings"}
            onToggle={() => toggleMenu("Settings")}
            onSelect={navigateTo}
            isSidebarCollapsed={isMini}
            subItems={[
                { id: "Settings Profile", label: "Profile", icon: User },
                { id: "Settings Security", label: "Security", icon: Shield },
                { id: "Settings Notifications", label: "Notifications", icon: Bell }
            ]}
          />

        </div>

        {/* Sidebar Footer (Profile) */}
        <div className={`p-4 border-t border-solid border-gray-100 dark:border-zinc-900 ${isMini ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${isMini ? "justify-center" : ""}`}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-800" alt="profile" />
            {!isMini && <>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Sarah Connor</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Field Commander</p>
              </div>
              <button className="text-gray-400 hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-500 ml-auto transition-colors">
                <LogOut size={18}/>
              </button>
            </>}
          </div>
        </div>

      </div>


      {/* --- MAIN CONTENT AREA --- */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col
        ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}>

        {/* Top Header */}
        <div className={`
          sticky top-0 h-[80px] z-40 px-6 flex justify-between items-center border-b border-solid
          /* Light Mode */
          bg-white border-gray-100
          /* Dark Mode: Solid Deep Black (No Transparency/Blur) */
          dark:bg-[#050505] dark:border-zinc-900
        `}>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-300 transition-colors" onClick={handleSidebarToggle}>
              <Menu size={20}/>
            </button>
            <h4 className="font-bold text-lg hidden md:block text-gray-800 dark:text-white tracking-tight">{activeTab}</h4>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search Input */}
            <div className="hidden md:block relative">
              <input 
                className={`
                  w-[280px] rounded-full pl-5 pr-10 py-2.5 text-sm transition-all outline-none border border-transparent focus:border-gray-200 dark:focus:border-zinc-800
                  /* Light */
                  bg-gray-100 text-gray-700 placeholder:text-gray-400 
                  /* Dark */
                  dark:bg-[#111] dark:text-gray-200 dark:placeholder:text-zinc-600
                `}
                placeholder="Search incidents..." 
              />
              <Search size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 dark:text-zinc-600"/>
            </div>

            {/* Stylish Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`
                p-2.5 rounded-full transition-all duration-300
                hover:scale-105 active:scale-95
                /* Light */
                text-gray-500 hover:bg-gray-100 
                /* Dark */
                dark:text-zinc-400 dark:hover:bg-[#111] dark:hover:text-white
              `}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            {/* <div className="relative">
              <button className={`
                p-2.5 rounded-full transition-colors
                bg-red-50 text-red-600 hover:bg-red-100
                dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/40
              `}>
                <Bell size={20}/>
              </button>
              <span className="absolute top-0 right-0 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#050505]"></span>
              </span>
            </div> */}
            <NotificationBell />

            {/* Profile (Header) */}
            <div className="flex items-center pl-4 border-l border-solid border-gray-200 dark:border-zinc-900">
              <div className="hidden md:block text-right mr-3">
                <h6 className="font-bold text-sm text-gray-900 dark:text-white">{user?.fullName || "Mike"}</h6>
                <span className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">Coordinator</span>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-800"/>
            </div>
          </div>

        </div>

        {/* Dynamic Page Content */}
        <div className="p-6 pb-20 overflow-y-auto h-[calc(100vh-80px)]">
          <Outlet />
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
             onClick={() => setIsMobileOpen(false)}></div>
      )}

    </div>
  );
}