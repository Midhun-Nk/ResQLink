import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  ShieldAlert, Mail, Lock, User, ArrowRight, Github, 
  Activity, Globe, Wifi, Database, Terminal 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SLIDES } from "../assets/data";
import { HudCorner } from "../components/common/SocialButton"; // Assuming HudCorner is visual only
import axios from "axios";

// --- CUSTOM INPUT COMPONENT FOR ONYX THEME ---
const CustomInput = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-orange-500 transition-colors">
      <Icon size={20} />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all font-medium border
        /* Light Mode */
        bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
        /* Dark Mode */
        dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-orange-500/50 dark:focus:ring-orange-500/10
      `}
    />
  </div>
);

// --- SOCIAL BUTTON COMPONENT ---
const CustomSocialButton = ({ icon: Icon, label }) => (
  <button className={`
    flex items-center justify-center gap-3 py-3 rounded-xl border transition-all font-medium text-sm
    /* Light */
    bg-white border-slate-200 text-slate-600 hover:bg-slate-50
    /* Dark */
    dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white
  `}>
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const LoginRegisterPage = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLoginView && !fullName)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const url = isLoginView
        ? `${VITE_API_URL}/auth/login`
        : `${VITE_API_URL}/auth/register`;

      const body = isLoginView
        ? { email, password }
        : { fullName, email, password };

      const response = await axios.post(url, body);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(isLoginView ? "Login Successful" : "Registration Successful");
      navigate("/dashboard-overview"); 

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>

      {/* BACKGROUND CONTAINER */}
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center p-4 font-sans text-slate-800 transition-colors duration-500 relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-orange-500/10 rounded-full blur-[120px] opacity-50 animate-pulse" />
          <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] opacity-50" />
        </div>

        {/* Main Card Container */}
        <div className={`
          w-full max-w-[1200px] h-[85vh] min-h-[650px] flex overflow-hidden relative rounded-[2.5rem] shadow-2xl transition-all duration-700
          bg-white border border-white/50
          dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]
          ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          
          {/* LEFT PANEL: Immersive Visuals */}
          <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 flex-col justify-between overflow-hidden">
            
            {/* Background Images */}
            {SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear opacity-60 ${index === currentSlide ? "scale-110" : "scale-100"}`}
                />
                {/* Gradient Overlay to blend with dark mode */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/20" />
              </div>
            ))}

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-scan" />
              <HudCorner className="top-8 left-8 border-t-2 border-l-2 border-white/20" />
              <HudCorner className="top-8 right-8 border-t-2 border-r-2 border-white/20" />
              <HudCorner className="bottom-8 left-8 border-b-2 border-l-2 border-white/20" />
              <HudCorner className="bottom-8 right-8 border-b-2 border-r-2 border-white/20" />
            </div>

            {/* Top Branding */}
            <div className="relative z-20 p-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                  <ShieldAlert className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl tracking-tight text-white">SENTINEL</h3>
                  <p className="text-orange-500 text-[10px] font-mono tracking-[0.2em] uppercase">Disaster Response OS</p>
                </div>
              </div>
              
              {/* Live Tickers */}
              <div className="flex gap-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center space-x-3">
                  <Wifi size={14} className="text-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-zinc-400 font-mono">NET: ONLINE</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center space-x-3">
                  <Database size={14} className="text-blue-400" />
                  <span className="text-[10px] text-zinc-400 font-mono">DB: SYNCED</span>
                </div>
              </div>
            </div>

            {/* Bottom Dynamic Info */}
            <div className="relative z-20 p-10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-orange-400 text-xs font-mono mb-2">
                    <Activity size={12} />
                    <span>{SLIDES[currentSlide].coords}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                    {SLIDES[currentSlide].title}
                  </h2>
                  <p className="text-zinc-400 text-sm max-w-xs font-light leading-relaxed border-l-2 border-orange-500/50 pl-3">
                    {SLIDES[currentSlide].subtitle}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden flex">
                {SLIDES.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-full transition-all duration-500 ease-out ${idx === currentSlide ? "bg-orange-500 flex-grow shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "bg-transparent flex-none w-0"}`} 
                  />
                ))}
                <div className="flex-grow bg-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Auth Forms */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-8 lg:p-20 relative bg-white dark:bg-[#0a0a0a]">
            
            {/* Background Grid Pattern for Right Side */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Top Right Navigation */}
            <div className="absolute top-8 right-8 flex items-center text-sm z-10">
              <span className="text-slate-500 dark:text-zinc-500 mr-3 hidden sm:inline">
                {isLoginView ? "New user?" : "Have credentials?"}
              </span>
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className={`
                  px-5 py-2.5 rounded-xl font-bold transition-all
                  bg-white border border-slate-200 text-slate-600 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50
                  dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white
                `}
              >
                {isLoginView ? "Register" : "Login"}
              </button>
            </div>

            <div className="w-full max-w-md relative z-10">
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  {isLoginView ? "Welcome Back" : "User Access"}
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 text-lg font-medium">
                  {isLoginView 
                    ? "Enter your credentials to access the grid." 
                    : "Create your account to join the response network."}
                </p>
              </div>

              {/* Forms */}
              <form className="space-y-4">
                {!isLoginView && (
                  <CustomInput 
                    icon={User} 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                  />
                )}
                
                <CustomInput 
                  icon={Mail} 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
                <CustomInput 
                  icon={Lock} 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />

                {isLoginView && (
                  <div className="flex justify-between items-center mb-8 text-sm text-slate-500 dark:text-zinc-500">
                    <label className="flex items-center cursor-pointer hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
                      <input type="checkbox" className="mr-2 rounded border-slate-300 dark:border-zinc-700 text-orange-600 focus:ring-orange-500 dark:bg-white/5" />
                      Keep session active
                    </label>
                    <a href="#" className="text-orange-600 hover:text-orange-500 transition-colors font-bold">Forgot Key?</a>
                  </div>
                )}

                <button 
                  onClick={handleSubmit} 
                  className={`
                    w-full py-4 rounded-xl font-bold flex items-center justify-center group relative overflow-hidden shadow-lg transition-all active:scale-[0.98]
                    bg-slate-900 text-white hover:bg-slate-800
                    dark:bg-white dark:text-black dark:hover:bg-zinc-200
                  `}
                >
                  <span className="relative flex items-center gap-2">
                    {isLoginView ? "AUTHENTICATE" : "ESTABLISH ACCESS"}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#0a0a0a] px-4 text-slate-400 dark:text-zinc-600 tracking-widest font-bold">Or authorize via</span>
                </div>
              </div>

              {/* Social / Federated Login */}
              <div className="grid grid-cols-2 gap-4">
                <CustomSocialButton icon={Terminal} label="SysAdmin" />
                <CustomSocialButton icon={Github} label="GitHub" />
              </div>

              {/* Footer */}
              <p className="text-center text-[10px] text-slate-400 dark:text-zinc-600 mt-10 font-mono tracking-widest">
                SECURE CONNECTION • ENCRYPTED SHA-256
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterPage;