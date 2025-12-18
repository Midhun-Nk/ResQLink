export const LiveDisasterMap = () => (
   <div className="relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
      <img 
         src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600&h=800" 
         alt="Map Background" 
         className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-blue-900/10"></div>
      
      {/* Map Markers */}
      <div className="absolute top-1/4 left-1/4 animate-pulse">
         <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
         <div className="absolute -inset-2 bg-red-500 rounded-full opacity-30 animate-ping"></div>
         <div className="absolute left-6 top-[-10px] bg-white px-2 py-1 rounded shadow-md text-xs font-bold whitespace-nowrap">
            Flood Zone A
         </div>
      </div>

      <div className="absolute bottom-1/3 right-1/3">
         <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
         <div className="absolute left-6 top-[-10px] bg-white px-2 py-1 rounded shadow-md text-xs font-bold whitespace-nowrap">
            Landslide Warning
         </div>
      </div>

      <div className="absolute top-10 right-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100">
         <h5 className="font-bold text-gray-900 text-sm mb-2">Live Status</h5>
         <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical (3)
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Moderate (5)
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Cleared (12)
         </div>
      </div>
   </div>
);
