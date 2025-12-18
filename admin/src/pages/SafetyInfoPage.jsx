import React, { useState } from 'react';
import { 
  ShieldCheck, Droplets, Flame, Zap, Wind, 
  BriefcaseMedical, CheckCircle2, AlertTriangle, 
  Info, ChevronRight, PackageCheck, Waves, 
  MountainSnow, Skull, ThermometerSun, Volume2, 
  Activity, ArrowRight
} from "lucide-react";

// --- EXTENSIVE SAFETY DATA ---
const safetyData = {
  flood: {
    title: "Flood & Flash Floods",
    icon: <Droplets />,
    color: "blue",
    phases: {
      before: [
        "Know the elevation of your property in relation to flood plains.",
        "Install check valves in sewer traps to prevent floodwater backing up.",
        "Seal walls in basements with waterproofing compounds.",
        "Elevate the furnace, water heater, and electric panel."
      ],
      during: [
        "Turn off utilities at the main switches or valves.",
        "Disconnect electrical appliances (do not touch if you are wet).",
        "Do not walk through moving water. Six inches is enough to knock you down.",
        "If trapped in a building, move to the highest level (roof) and signal for help."
      ],
      after: [
        "Listen for news reports to learn whether the community's water supply is safe.",
        "Avoid floodwaters; water may be contaminated by oil, gasoline, or raw sewage.",
        "Clean and disinfect everything that got wet.",
        "Watch out for snakes and animals that may have entered your home."
      ]
    }
  },
  fire: {
    title: "Structural Fire",
    icon: <Flame />,
    color: "orange",
    phases: {
      before: [
        "Install smoke alarms on every level of your home.",
        "Plan two ways out of every room.",
        "Check electrical wiring and replace frayed cords immediately.",
        "Keep a fire extinguisher in the kitchen and garage."
      ],
      during: [
        "Crawl low under smoke. The cleanest air is 12 to 24 inches off the floor.",
        "Test doors with the back of your hand before opening. If hot, use another exit.",
        "If your clothes catch fire: Stop, Drop, and Roll.",
        "Never use an elevator during a fire."
      ],
      after: [
        "Do not enter the building until authorities say it is safe.",
        "Check for structural damage to roofs and walls.",
        "Discard food, beverages, and medicines exposed to heat or smoke."
      ]
    }
  },
  earthquake: {
    title: "Earthquake",
    icon: <Zap />,
    color: "amber",
    phases: {
      before: [
        "Secure heavy furniture (bookshelves, water heaters) to wall studs.",
        "Practice 'Drop, Cover, and Hold On'.",
        "Locate safe spots in each room (under sturdy tables).",
        "Store breakable items in low, closed cabinets with latches."
      ],
      during: [
        "If indoors: Drop to the ground, Cover your head, Hold on to shelter.",
        "Stay away from glass, windows, outside doors, and walls.",
        "If outdoors: Move to a clear area away from trees, signs, and buildings.",
        "If driving: Pull over to a clear location and stop."
      ],
      after: [
        "Expect aftershocks. Each time you feel one, drop, cover, and hold on.",
        "Check for gas leaks. If you smell gas, turn off the main valve and leave.",
        "Open cabinets cautiously. Beware of objects that can fall off shelves."
      ]
    }
  },
  cyclone: {
    title: "Cyclone & Storms",
    icon: <Wind />,
    color: "teal",
    phases: {
      before: [
        "Trim trees and shrubs around your home to make them more wind resistant.",
        "Clear loose and clogged rain gutters and downspouts.",
        "Bring in outdoor furniture, decorations, and garbage cans.",
        "Board up windows or use storm shutters."
      ],
      during: [
        "Stay indoors and away from windows and glass doors.",
        "Close all interior doors—secure and brace external doors.",
        "Lie on the floor under a table or another sturdy object.",
        "Do not be fooled if the eye of the storm passes (winds will return)."
      ],
      after: [
        "Stay out of damaged buildings.",
        "Watch out for fallen power lines and report them.",
        "Use battery-powered flashlights. Do not use candles (gas leak risk)."
      ]
    }
  },
  tsunami: {
    title: "Tsunami",
    icon: <Waves />,
    color: "cyan",
    phases: {
      before: ["Map out evacuation routes to high ground (100ft above sea level).", "Listen for warning sirens."],
      during: ["If you feel an earthquake near the coast, move to high ground immediately.", "Do not wait for an official warning.", "Never go to the beach to watch the waves."],
      after: ["Stay away from coastal areas until officials say it is safe.", "Be aware of secondary waves which can be larger."]
    }
  },
  landslide: {
    title: "Landslide",
    icon: <MountainSnow />,
    color: "stone",
    phases: {
      before: ["Monitor drainage patterns on land.", "Plant ground cover on slopes."],
      during: ["Listen for unusual sounds like trees cracking or boulders knocking.", "Move away from the path of the slide.", "Curl into a tight ball and protect your head."],
      after: ["Stay away from the slide area (flooding may follow).", "Check for injured trapped persons without entering the slide area."]
    }
  },
  chemical: {
    title: "Chemical Leak",
    icon: <Skull />,
    color: "purple",
    phases: {
      before: ["Make an internal shelter kit (duct tape, plastic sheeting)."],
      during: ["Close all windows, vents, and fireplace dampers.", "Turn off air conditioning.", "Go into an interior room and seal it (Shelter-in-place)."],
      after: ["Open windows to ventilate once 'All Clear' is given.", "Shower and change clothes immediately."]
    }
  },
  heatwave: {
    title: "Extreme Heat",
    icon: <ThermometerSun />,
    color: "rose",
    phases: {
      before: ["Install window reflectors.", "Insulate water pipes."],
      during: ["Stay indoors during the hottest part of the day.", "Drink plenty of water even if not thirsty.", "Wear light, loose-fitting clothing."],
      after: ["Continue to hydrate.", "Check on elderly neighbors."]
    }
  }
};

// --- COMPONENT: FIRST AID CARD ---
const FirstAidCard = ({ title, steps, type }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-2 rounded-lg ${type === 'critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
        <Activity size={18} />
      </div>
      <h4 className="font-bold text-gray-800">{title}</h4>
    </div>
    <ul className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
          <span className="font-bold text-gray-400">{i+1}.</span> {step}
        </li>
      ))}
    </ul>
  </div>
);

// --- COMPONENT: SOS SIGNALS ---
const SOSGuide = () => (
  <div className="bg-slate-900 text-white rounded-2xl p-6 mt-6">
    <div className="flex items-center gap-3 mb-4">
      <Volume2 className="text-emerald-400" />
      <h3 className="font-bold">Distress Signals</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="bg-slate-800 p-3 rounded-lg">
        <span className="block text-slate-400 text-xs uppercase mb-1">Whistle Code</span>
        <span className="font-mono font-bold text-emerald-400">3 Short Blasts</span>
        <p className="text-xs text-slate-400 mt-1">(Pause 1 min, Repeat)</p>
      </div>
      <div className="bg-slate-800 p-3 rounded-lg">
        <span className="block text-slate-400 text-xs uppercase mb-1">Visual (Torch)</span>
        <span className="font-mono font-bold text-emerald-400">3 Short Flashes</span>
        <p className="text-xs text-slate-400 mt-1">(Pause 1 min, Repeat)</p>
      </div>
      <div className="col-span-2 bg-slate-800 p-3 rounded-lg flex justify-between items-center">
        <div>
           <span className="block text-slate-400 text-xs uppercase">Ground to Air</span>
           <span className="font-bold text-white">Large "X" or "V"</span>
        </div>
        <AlertTriangle className="text-yellow-500" size={20}/>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function SafetyInfoPage() {
  const [selectedDisaster, setSelectedDisaster] = useState('flood');
  const [phase, setPhase] = useState('during'); // 'before', 'during', 'after'

  const activeData = safetyData[selectedDisaster];

  const getTheme = (color) => {
    // Returns [bg, text, border, accent]
    const themes = {
      blue: ["bg-blue-50", "text-blue-700", "border-blue-200", "bg-blue-600"],
      orange: ["bg-orange-50", "text-orange-700", "border-orange-200", "bg-orange-600"],
      amber: ["bg-amber-50", "text-amber-700", "border-amber-200", "bg-amber-600"],
      teal: ["bg-teal-50", "text-teal-700", "border-teal-200", "bg-teal-600"],
      cyan: ["bg-cyan-50", "text-cyan-700", "border-cyan-200", "bg-cyan-600"],
      stone: ["bg-stone-50", "text-stone-700", "border-stone-200", "bg-stone-600"],
      purple: ["bg-purple-50", "text-purple-700", "border-purple-200", "bg-purple-600"],
      rose: ["bg-rose-50", "text-rose-700", "border-rose-200", "bg-rose-600"],
    };
    return themes[color] || themes.blue;
  };

  const theme = getTheme(activeData.color);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ShieldCheck className="text-emerald-600" size={36} />
          Civil Defense Manual
        </h1>
        <p className="text-gray-500">Comprehensive disaster protocols and life-saving techniques.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* --- LEFT SIDEBAR: NAVIGATION --- */}
        <div className="xl:col-span-1 space-y-2 h-fit overflow-y-auto max-h-[500px] xl:max-h-none custom-scrollbar">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Disaster Scenarios</h3>
          {Object.keys(safetyData).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedDisaster(key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${selectedDisaster === key ? 'bg-white shadow-md text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'}`}
            >
              <div className={`p-2 rounded-lg ${selectedDisaster === key ? 'bg-gray-100' : 'bg-transparent'}`}>
                {safetyData[key].icon}
              </div>
              {safetyData[key].title}
              {selectedDisaster === key && <ChevronRight className="ml-auto text-gray-400" size={16} />}
            </button>
          ))}
        </div>

        {/* --- CENTER: MAIN CONTENT --- */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Hero Section of Card */}
            <div className={`p-8 ${theme[0]} border-b ${theme[2]}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-white shadow-sm ${theme[1]}`}>
                  {React.cloneElement(activeData.icon, { size: 40 })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeData.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold bg-white/60 ${theme[1]}`}>OFFICIAL PROTOCOL</span>
                  </div>
                </div>
              </div>

              {/* Phase Tabs */}
              <div className="flex p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                {['before', 'during', 'after'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPhase(p)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${phase === p ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {p} Event
                  </button>
                ))}
              </div>
            </div>

            {/* Action List */}
            <div className="p-8 flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 capitalize">
                Actions: {phase} the event
              </h3>
              
              <div className="space-y-4">
                {activeData.phases[phase].map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${theme[3]} shadow-sm group-hover:scale-110 transition-transform`}>
                      {index + 1}
                    </div>
                    <div className="pt-1.5 pb-4 border-b border-gray-100 w-full">
                      <p className="text-gray-700 leading-relaxed font-medium">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-start gap-3">
              <Info className="text-slate-400 mt-0.5" size={18} />
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Disclaimer:</strong> Always follow the specific instructions issued by local emergency management authorities. This guide is a general reference.
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR: QUICK REFS --- */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* First Aid Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rapid First Aid</h3>
            <div className="space-y-3">
              <FirstAidCard 
                type="critical"
                title="CPR (Adult)" 
                steps={["Check breathing/response.", "Call 108/Ambulance.", "Push hard & fast in center of chest.", "30 compressions, 2 breaths."]} 
              />
              <FirstAidCard 
                type="critical"
                title="Severe Bleeding" 
                steps={["Apply direct pressure with cloth.", "Do not remove cloth if soaked, add more.", "Elevate injury above heart.", "Keep victim warm."]} 
              />
              <FirstAidCard 
                type="standard"
                title="Burns" 
                steps={["Cool with running water (10 mins).", "Remove jewelry/tight items.", "Cover with cling film/clean bag.", "Do NOT apply ice or creams."]} 
              />
            </div>
          </div>

          {/* SOS Module */}
          <SOSGuide />
          
        </div>

      </div>
    </div>
  );
}