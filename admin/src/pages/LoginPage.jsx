import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight, 
  Github, 
  Activity,
  Globe,
  Wifi,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SLIDES } from "../assets/data";
import { HudCorner, SocialButton } from "../components/common/SocialButton";
import { InputField } from "../components/common/InputField";
import axios from "axios";

const LoginRegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState();
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
      ? "http://localhost:5000/api/v1/auth/login"
      : "http://localhost:5000/api/v1/auth/register";

    const body = isLoginView
      ? { email, password }
      : { fullName, email, password };

    const response = await axios.post(url, body);

    // Store JWT token
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    toast.success(isLoginView ? "Login Successful" : "Registration Successful");

    // Redirect to dashboard or homepage
    navigate("/dashboard-overview");  // change route as needed

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
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden">
        
        {/* Abstract Background Elements (Light Mode Optimized) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-orange-500/5 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl opacity-50" />
          {/* Subtle geometric pattern for professional look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        {/* Main Card Container */}
        <div className={`glass-panel rounded-3xl shadow-2xl w-full max-w-[1200px] h-[85vh] min-h-[650px] flex overflow-hidden relative border border-white/50 ring-1 ring-slate-900/5 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* LEFT PANEL: Immersive Visuals (Dark Contrast maintained for images) */}
          <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 flex-col justify-between overflow-hidden group">
            
            {/* Background Images */}
            {SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear opacity-70 ${
                    index === currentSlide ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/30" />
              </div>
            ))}

            {/* HUD Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-scan" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.02),rgba(0,0,0,0),rgba(255,255,255,0.02))] z-10 bg-[length:100%_4px,4px_100%] pointer-events-none" />
              
              {/* HUD Corners */}
              <HudCorner className="top-8 left-8 border-t-2 border-l-2" />
              <HudCorner className="top-8 right-8 border-t-2 border-r-2" />
              <HudCorner className="bottom-8 left-8 border-b-2 border-l-2" />
              <HudCorner className="bottom-8 right-8 border-b-2 border-r-2" />
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
              
              {/* Live Data Tickers */}
              <div className="flex gap-4">
                <div className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 flex items-center space-x-3">
                  <Wifi size={14} className="text-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-mono">NET: ONLINE</span>
                </div>
                <div className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 flex items-center space-x-3">
                  <Database size={14} className="text-blue-400" />
                  <span className="text-[10px] text-slate-400 font-mono">DB: SYNCED</span>
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
                  <p className="text-slate-300 text-sm max-w-xs font-light leading-relaxed border-l-2 border-orange-500/50 pl-3">
                    {SLIDES[currentSlide].subtitle}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="hidden xl:block">
                  <div className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] font-bold tracking-wider">
                    {SLIDES[currentSlide].status}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex">
                {SLIDES.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-full transition-all duration-500 ease-out ${
                      idx === currentSlide ? "bg-orange-500 flex-grow" : "bg-transparent flex-none w-0"
                    }`} 
                  />
                ))}
                {/* Background track for inactive slides */}
                <div className="flex-grow bg-slate-800" />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Auth Forms (White Mode) */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-8 lg:p-20 relative bg-white/40 backdrop-blur-sm">
            
            {/* Corner Decorative Elements */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Globe size={120} className="text-slate-900 rotate-12" />
            </div>

            {/* Top Right Navigation */}
            <div className="absolute top-8 right-8 flex items-center text-sm z-10">
              <span className="text-slate-500 mr-3 hidden sm:inline">
                {isLoginView ? "New user?" : "Have credentials?"}
              </span>
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all font-medium bg-white shadow-sm"
              >
                {isLoginView ? "Register" : "Login"}
              </button>
            </div>

            <div className="w-full max-w-md relative z-10">
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  {isLoginView ? "Welcome Back" : "User Access"}
                </h1>
                <p className="text-slate-500 text-lg font-light">
                  {isLoginView 
                    ? "Enter your credentials to access the grid." 
                    : " Create your account to join the response network."}
                </p>
              </div>

              {/* Forms */}
              <form className="space-y-4 " >
                {!isLoginView && (
                  <div className="">
                    <InputField icon={User} type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                    {/* <InputField icon={Building2} type="text" placeholder="Unit ID" /> */}
                  </div>
                )}
                
                <InputField icon={Mail} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <InputField icon={Lock} type="password" placeholder="Password " value={password} onChange={e => setPassword(e.target.value)} />
                
           

                {isLoginView && (
                  <div className="flex justify-between items-center mb-8 text-sm text-slate-500">
                    <label className="flex items-center cursor-pointer hover:text-slate-700 transition-colors">
                      <input type="checkbox" className="mr-2 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                      Keep session active
                    </label>
                    <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors font-medium">Forgot Key?</a>
                  </div>
                )}

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center group relative overflow-hidden" onClick={handleSubmit}  >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                  <span className="relative flex items-center">
                    {isLoginView ? "AUTHENTICATE" : "ESTABLISH ACCESS"}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-4 text-slate-400 tracking-widest font-mono font-semibold">Or authorize via</span>
                </div>
              </div>

              {/* Social / Federated Login */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={Activity} label="SysAdmin" />
                <SocialButton icon={Github} label="GitHub" />
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-slate-400 mt-10 font-mono">
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