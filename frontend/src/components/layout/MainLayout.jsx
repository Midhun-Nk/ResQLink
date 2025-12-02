import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Settings, 
  LayoutDashboard, CloudRain, AlertTriangle, Phone, Radio, 
  Shield, Heart, Map as MapIcon, FileText, Siren, 
  Activity, LogOut,
  User,
  Users
} from 'lucide-react';

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SidebarItem } from '../SidebarItem';
import { useApp } from '../../context/AppContext';

export default function MainLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [expandedMenu, setExpandedMenu] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync tab with URL
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

  const {user}= useApp();

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden font-sans">

      {/* SIDEBAR */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-white z-50 transition-all duration-300 border-r border-gray-100 shadow-sm flex flex-col
          ${isMobileOpen ? 'translate-x-0 w-[280px]' : (isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]')}
          ${!isMobileOpen && 'hidden lg:flex'}
          ${isMobileOpen && 'block'}
          lg:translate-x-0
        `}
      >

        {/* Brand */}
        <div className={`p-6 flex items-center gap-3 mb-2 h-[88px] ${isMini ? 'justify-center' : ''}`}>
          <div className="bg-red-600 rounded-lg flex items-center justify-center text-white font-bold w-10 h-10 shadow-lg">
            <Activity size={24} />
          </div>
          {!isMini && <h3 className="font-bold text-2xl text-gray-900">ResQ<span className="text-red-600">Link</span></h3>}
        </div>


        {/* NAV */}
        <div className={`${isMini ? 'px-2' : 'px-4'} pb-8 flex-1 overflow-y-auto custom-scrollbar`}>

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

          {/* {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 uppercase px-3">Monitor</div>}
          {isMini && <div className="border-t w-8 mx-auto my-4"></div>} */}

          {/* <SidebarItem icon={CloudRain} label="Weather" activeId={activeTab} onSelect={() => navigateTo("Weather")} isSidebarCollapsed={isMini} />
          <SidebarItem icon={AlertTriangle} label="Alerts" activeId={activeTab} onSelect={() => navigateTo("Alerts")} isSidebarCollapsed={isMini} /> */}
          {/* <SidebarItem icon={Siren} label="SOS" activeId={activeTab} onSelect={() => navigateTo("SOS")} isSidebarCollapsed={isMini} />
             */}
          {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 uppercase px-3">Emergency Help</div>}
          {isMini && <div className="border-t w-8 mx-auto my-4"></div>}

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

          {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 uppercase px-3">Response</div>}
          {isMini && <div className="border-t w-8 mx-auto my-4"></div>}

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
    // { id: "Resource Requests", label: "Resource Requests", icon: FileText }
  ]}
          />

          
          {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 uppercase px-3">Support</div>}
          {isMini && <div className="border-t w-8 mx-auto my-4"></div>}

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


          {/* <SidebarItem icon={Heart} label="Donate" activeId={activeTab} onSelect={() => navigateTo("Donate")} isSidebarCollapsed={isMini} /> */}

          {!isMini && <div className="text-gray-400 text-xs font-bold mt-6 mb-3 uppercase px-3">Settings</div>}
          {isMini && <div className="border-t w-8 mx-auto my-4"></div>}

          {/* <SidebarItem icon={Shield} label="Safety Info" activeId={activeTab} onSelect={() => navigateTo("Safety Info")} isSidebarCollapsed={isMini} />
          <SidebarItem icon={Phone} label="Contacts" activeId={activeTab} onSelect={() => navigateTo("Contacts")} isSidebarCollapsed={isMini} /> */}
          {/* <SidebarItem icon={Settings} label="Settings" activeId={activeTab} onSelect={() => navigateTo("Settings")} isSidebarCollapsed={isMini} /> */}
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


        {/* Profile */}
        <div className={`p-4 border-t ${isMini ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${isMini ? "justify-center" : ""}`}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-full" />
            {!isMini && <>
              <div>
                <p className="text-sm font-bold">Sarah Connor</p>
                <p className="text-xs text-gray-500">Field Commander</p>
              </div>
              <button className="text-gray-400 hover:text-red-600"><LogOut size={18}/></button>
            </>}
          </div>
        </div>

      </div>


      {/* MAIN CONTENT + TOPBAR */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col
        ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}`}>

        {/* Topbar */}
        <div className="bg-white/80 sticky top-0 border-b shadow-sm px-6 h-[80px] flex justify-between items-center">

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={handleSidebarToggle}>
              <Menu size={20}/>
            </button>
            <h4 className="font-bold text-lg hidden md:block">{activeTab}</h4>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <input className="w-[280px] bg-gray-100 rounded-full pl-5 pr-10 py-2.5 text-sm" placeholder="Search incidents..." />
              <Search size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"/>
            </div>

            <div className="relative">
              <button className="p-2.5 bg-red-50 hover:bg-red-100 rounded-full text-red-600">
                <Bell size={20}/>
              </button>
              <span className="absolute top-0 right-0 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            </div>

            <div className="flex items-center pl-4 border-l">
              <div className="hidden md:block text-right">
                <h6 className="font-bold text-sm">{user?.fullName || "Mike"}</h6>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Coordinator</span>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-full bg-gray-100 border"/>
            </div>
          </div>

        </div>


        {/* Dynamic Page Content */}
        <div className="p-6 pb-20">
          <Outlet /> {/* Your page loads here */}
        </div>

      </div>


      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
             onClick={() => setIsMobileOpen(false)}></div>
      )}

    </div>
  );
}
