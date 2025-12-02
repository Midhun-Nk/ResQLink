import { useState } from "react";
import { User, Lock, Bell, Shield, LogOut, ArrowRight } from "lucide-react";
import EditProfile from "./EditProfile";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="glass-panel rounded-3xl shadow-2xl w-full max-w-5xl min-h-[70vh] flex overflow-hidden border border-white/50 ring-1 ring-slate-900/5">

        {/* Left Settings Navigation */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm border-r border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 tracking-wide">Settings</h2>

          <nav className="space-y-2 text-sm font-medium text-slate-600">
            
            <button 
              className={`flex items-center w-full px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all 
              ${activeSection === "profile" && "bg-slate-900 text-white"}`}
              onClick={() => setActiveSection("profile")}
            >
              <User size={18} className="mr-3" /> Edit Profile
            </button>

            <button 
              className={`flex items-center w-full px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all 
              ${activeSection === "security" && "bg-slate-900 text-white"}`}
              onClick={() => setActiveSection("security")}
            >
              <Shield size={18} className="mr-3" /> Security
            </button>

            <button 
              className={`flex items-center w-full px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all 
              ${activeSection === "notifications" && "bg-slate-900 text-white"}`}
              onClick={() => setActiveSection("notifications")}
            >
              <Bell size={18} className="mr-3" /> Notifications
            </button>

            <button className="flex items-center w-full px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white mt-6 transition">
              <LogOut size={18} className="mr-3" /> Logout
            </button>

          </nav>
        </aside>

        
        {/* Main Content */}
        <main className="flex-1 p-10">
          {activeSection === "profile" && <EditProfile />}
          {activeSection === "security" && (
            <div className="text-slate-600 text-center text-lg">
              Security Options Coming Soon 🔐
            </div>
          )}
          {activeSection === "notifications" && (
            <div className="text-slate-600 text-center text-lg">
              Notification Settings Coming Soon 🔔
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default SettingsPage;
