import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, Droplets, Flame, Zap, Wind, 
  BriefcaseMedical, AlertTriangle, 
  Info, ChevronRight, Waves, 
  MountainSnow, Skull, ThermometerSun, Volume2, 
  Activity, ExternalLink, Loader
} from "lucide-react";

// --- ICON MAPPING ---
const ICON_MAP = {
  "Droplets": Droplets,
  "Flame": Flame,
  "Zap": Zap,
  "Wind": Wind,
  "Waves": Waves,
  "MountainSnow": MountainSnow,
  "Skull": Skull,
  "ThermometerSun": ThermometerSun
};

// --- COMPONENT: FIRST AID CARD ---
const FirstAidCard = ({ title, steps, type }) => (
  <div className={`
    p-5 rounded-2xl border-solid border shadow-sm transition-all group
    bg-white border-gray-200
    dark:bg-[#0a0a0a] dark:border-zinc-800
  `}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`
        p-2 rounded-lg
        ${type === 'critical' 
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' 
          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500'}
      `}>
        <Activity size={18} />
      </div>
      <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">{title}</h4>
    </div>
    <ul className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="text-xs text-gray-600 dark:text-zinc-400 flex items-start gap-2">
          <span className="font-bold text-gray-400 dark:text-zinc-600">{i+1}.</span> {step}
        </li>
      ))}
    </ul>
  </div>
);

// --- COMPONENT: SOS SIGNALS ---
const SOSGuide = () => (
  <div className={`
    rounded-2xl p-6 mt-6 border-solid border
    bg-slate-900 text-white border-slate-800
    dark:bg-[#0a0a0a] dark:border-zinc-800
  `}>
    <div className="flex items-center gap-3 mb-4">
      <Volume2 className="text-emerald-400" />
      <h3 className="font-bold text-white">Distress Signals</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="bg-slate-800 dark:bg-zinc-900 p-3 rounded-xl border border-transparent dark:border-zinc-800">
        <span className="block text-slate-400 text-xs uppercase mb-1 font-bold tracking-wider">Whistle Code</span>
        <span className="font-mono font-bold text-emerald-400">3 Short Blasts</span>
        <p className="text-xs text-slate-500 mt-1">(Pause 1 min, Repeat)</p>
      </div>
      <div className="bg-slate-800 dark:bg-zinc-900 p-3 rounded-xl border border-transparent dark:border-zinc-800">
        <span className="block text-slate-400 text-xs uppercase mb-1 font-bold tracking-wider">Visual (Torch)</span>
        <span className="font-mono font-bold text-emerald-400">3 Short Flashes</span>
        <p className="text-xs text-slate-500 mt-1">(Pause 1 min, Repeat)</p>
      </div>
      <div className="col-span-2 bg-slate-800 dark:bg-zinc-900 p-3 rounded-xl flex justify-between items-center border border-transparent dark:border-zinc-800">
        <div>
           <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider">Ground to Air</span>
           <span className="font-bold text-white">Large "X" or "V"</span>
        </div>
        <AlertTriangle className="text-amber-500" size={20}/>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function SafetyInfoPage() {
  const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
  const [disasters, setDisasters] = useState({});
  const [firstAidList, setFirstAidList] = useState([]);
  
  const [selectedDisasterSlug, setSelectedDisasterSlug] = useState(''); 
  const [phase, setPhase] = useState('during'); 
  
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Live Intel State
  const [liveReports, setLiveReports] = useState([]);
  const [intelLoading, setIntelLoading] = useState(false);

  // --- 1. FETCH INITIAL DATA FROM DJANGO API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- FETCH DISASTERS ---
        const disasterRes = await axios.get(`${VITE_API_URL_PYTHON}/safetyinfo/disasters/`);
        
        const rawData = disasterRes.data;
        const dataArray = Array.isArray(rawData) ? rawData : rawData.results || [];
        
        const formattedDisasters = {};
        dataArray.forEach(item => {
          formattedDisasters[item.slug] = item;
        });
        
        setDisasters(formattedDisasters);

        if (dataArray.length > 0 && !selectedDisasterSlug) {
            setSelectedDisasterSlug(dataArray[0].slug);
        }

        // --- FETCH FIRST AID ---
        const firstAidRes = await axios.get(`${VITE_API_URL_PYTHON}/safetyinfo/first-aid/`);
        const firstAidRaw = firstAidRes.data;
        const firstAidArray = Array.isArray(firstAidRaw) ? firstAidRaw : firstAidRaw.results || [];
        
        setFirstAidList(firstAidArray);

      } catch (error) {
        console.error("Failed to connect to Django API:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. FETCH LIVE INTEL (RELIEFWEB) ---
  const apiQueryMap = {
    flood: "flood",
    fire: "wild fire",
    earthquake: "earthquake",
    cyclone: "tropical cyclone",
    tsunami: "tsunami",
    landslide: "land slide",
    chemical: "technological disaster",
    heatwave: "heat wave"
  };

  useEffect(() => {
    if (phase !== 'live') return;

    const fetchReports = async () => {
      setIntelLoading(true);
      const query = apiQueryMap[selectedDisasterSlug] || selectedDisasterSlug;
      const url = `https://api.reliefweb.int/v1/reports?appname=rw-docs&query[value]=${query}&limit=5&sort[]=date:desc`;

      try {
        const response = await axios.get(url);
        setLiveReports(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch live intel", error);
      } finally {
        setIntelLoading(false);
      }
    };

    fetchReports();
  }, [selectedDisasterSlug, phase]);


  const getColorClasses = (color) => {
    const configs = {
      blue:   { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/30', accent: 'bg-blue-600 dark:bg-blue-500' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-900/30', accent: 'bg-orange-600 dark:bg-orange-500' },
      amber:  { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/30', accent: 'bg-amber-600 dark:bg-amber-500' },
      teal:   { bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-900/30', accent: 'bg-teal-600 dark:bg-teal-500' },
      cyan:   { bg: 'bg-cyan-50 dark:bg-cyan-900/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-900/30', accent: 'bg-cyan-600 dark:bg-cyan-500' },
      stone:  { bg: 'bg-stone-50 dark:bg-stone-900/10', text: 'text-stone-700 dark:text-stone-400', border: 'border-stone-200 dark:border-stone-900/30', accent: 'bg-stone-600 dark:bg-stone-500' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-900/30', accent: 'bg-purple-600 dark:bg-purple-500' },
      rose:   { bg: 'bg-rose-50 dark:bg-rose-900/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/30', accent: 'bg-rose-600 dark:bg-rose-500' },
    };
    return configs[color] || configs.blue;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-500 gap-2">
        <Loader className="animate-spin" /> Loading Protocols...
      </div>
    );
  }

  const activeData = disasters[selectedDisasterSlug];
  const ActiveIcon = ICON_MAP[activeData?.icon_name] || Activity; 
  const colors = getColorClasses(activeData?.color_theme || 'blue');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-4 md:p-8 font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-500" size={36} />
          Civil Defense Manual
        </h1>
        <p className="text-gray-500 dark:text-zinc-500">Comprehensive disaster protocols and real-time intelligence.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* --- LEFT SIDEBAR: NAVIGATION --- */}
        <div className="xl:col-span-1 space-y-2 h-fit overflow-y-auto max-h-[500px] xl:max-h-none custom-scrollbar">
          <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-3 px-2">Disaster Scenarios</h3>
          {Object.keys(disasters).map((slug) => {
            const item = disasters[slug];
            const ItemIcon = ICON_MAP[item.icon_name] || Activity;
            
            return (
              <button
                key={slug}
                onClick={() => setSelectedDisasterSlug(slug)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold border border-transparent
                  ${selectedDisasterSlug === slug 
                    ? 'bg-white shadow-md text-gray-900 border-gray-200 dark:bg-[#0a0a0a] dark:text-white dark:border-zinc-800' 
                    : 'text-gray-500 hover:bg-white/60 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300'}
                `}
              >
                <div className={`p-2 rounded-lg ${selectedDisasterSlug === slug ? 'bg-gray-100 dark:bg-white/10' : 'bg-transparent'}`}>
                  <ItemIcon size={18} />
                </div>
                {item.title}
                {selectedDisasterSlug === slug && <ChevronRight className="ml-auto text-gray-400 dark:text-zinc-600" size={16} />}
              </button>
            );
          })}
        </div>

        {/* --- CENTER: MAIN CONTENT --- */}
        <div className="xl:col-span-2">
          {activeData && (
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-solid border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[600px] flex flex-col transition-colors duration-300">
              
              {/* Hero Section of Card */}
              <div className={`p-8 border-b border-solid transition-colors duration-300 ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl shadow-sm bg-white dark:bg-[#0a0a0a] ${colors.text}`}>
                    <ActiveIcon size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeData.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-white/60 dark:bg-white/10 ${colors.text}`}>OFFICIAL PROTOCOL</span>
                    </div>
                  </div>
                </div>

                {/* Phase Tabs */}
                <div className="flex p-1 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-solid border-white/50 dark:border-white/5">
                  {['before', 'during', 'after'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPhase(p)}
                      className={`
                        flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all
                        ${phase === p 
                          ? 'bg-white shadow-sm text-gray-900 dark:bg-[#1a1a1a] dark:text-white' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                  {/* Live Intel Tab */}
                  <button
                      onClick={() => setPhase('live')}
                      className={`
                        flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1
                        ${phase === 'live' 
                          ? 'bg-red-500 shadow-sm text-white' 
                          : 'text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}
                      `}
                    >
                     <Activity size={12} /> LIVE
                    </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex-1">
                
                {/* CONDITION: If Live Tab is selected */}
                {phase === 'live' ? (
                  <div className="animate-in fade-in duration-500">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <Activity className="text-red-500" size={20} />
                             Real-Time Global Reports
                          </h3>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-gray-500">Source: ReliefWeb API</span>
                      </div>

                      {intelLoading ? (
                           <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
                              <Loader className="animate-spin" size={32} />
                              <p className="text-sm font-medium">Scanning global networks...</p>
                           </div>
                      ) : (
                          <div className="space-y-3">
                              {liveReports.length > 0 ? (
                                  liveReports.map((report) => (
                                      <a 
                                          key={report.id}
                                          href={report.href}
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="group block p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                                      >
                                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 line-clamp-2">
                                              {report.fields?.title || report.title}
                                          </h4>
                                          <div className="flex items-center justify-between">
                                              <span className="text-[10px] uppercase font-bold text-gray-400 bg-white dark:bg-black/40 px-2 py-1 rounded border border-gray-100 dark:border-white/5">
                                                  Situation Report
                                              </span>
                                              <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500" />
                                          </div>
                                      </a>
                                  ))
                              ) : (
                                  <div className="text-center py-12 text-gray-400 text-sm">
                                      No immediate critical reports found for this category.
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                ) : (
                  // CONDITION: Standard Static Phases (Before, During, After)
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 capitalize">
                      <div className={`w-2 h-2 rounded-full ${colors.accent}`}></div>
                      Actions: {phase} the event
                    </h3>
                    
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* --- FIX: OPTIONAL CHAINING --- */}
                      {/* Check if activeData.phases exists AND if the specific phase exists */}
                      {activeData?.phases?.[phase] && activeData.phases[phase].length > 0 ? (
                        activeData.phases[phase].map((item, index) => (
                          <div key={index} className="flex gap-4 group">
                            <div className={`
                              mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm transition-transform group-hover:scale-110
                              ${colors.accent}
                            `}>
                              {index + 1}
                            </div>
                            <div className="pt-1.5 pb-4 border-b border-solid border-gray-100 dark:border-zinc-800 w-full">
                              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{item}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400 italic gap-2 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl">
                            <Info size={20} />
                            <p>No protocols found for this phase.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Warning Footer */}
              <div className="bg-slate-50 dark:bg-white/5 p-4 border-t border-solid border-slate-100 dark:border-zinc-800 flex items-start gap-3">
                <Info className="text-slate-400 dark:text-zinc-500 mt-0.5" size={18} />
                <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">
                  <strong className="text-slate-700 dark:text-zinc-300">Disclaimer:</strong> Always follow the specific instructions issued by local emergency management authorities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDEBAR: QUICK REFS --- */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* First Aid Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <BriefcaseMedical size={14} /> Rapid First Aid
            </h3>
            <div className="space-y-3">
              {firstAidList.map((guide) => (
                <FirstAidCard 
                  key={guide.id}
                  type={guide.guide_type}
                  title={guide.title} 
                  steps={guide.steps} 
                />
              ))}
            </div>
          </div>

          {/* SOS Module */}
          <SOSGuide />
          
        </div>

      </div>
    </div>
  );
}