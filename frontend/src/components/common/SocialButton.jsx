export const SocialButton = ({ icon: Icon, label }) => (
  <button className="flex items-center justify-center w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all text-sm font-medium shadow-sm group">
    <Icon size={18} className="mr-2 group-hover:scale-110 transition-transform" />
    {label}
  </button>
);


export const HudCorner = ({ className }) => (
  <div className={`absolute w-6 h-6 border-orange-500/50 ${className}`} />
);