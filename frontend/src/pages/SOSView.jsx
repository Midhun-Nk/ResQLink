import { Siren } from "lucide-react";

export const SOSView = () => (
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
