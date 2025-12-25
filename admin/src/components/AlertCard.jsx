import React from 'react';
import { 
   AlertTriangle,  
   MapPin, 
   Clock, 
   Users, 
   ShieldAlert
} from 'lucide-react';

export const AlertCard = ({ alert }) => {
  
  // Configuration for colors
  const severityConfig = {
    Critical: {
      // Light: Stronger red background for icon
      bg: 'bg-red-100 text-red-700',
      // Dark: Solid dark gray background with red text (No transparency to stop dots showing through)
      darkBg: 'dark:bg-zinc-800 dark:text-red-500',
      border: 'border-red-200 dark:border-red-900/30',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    Moderate: {
      bg: 'bg-orange-100 text-orange-700',
      darkBg: 'dark:bg-zinc-800 dark:text-orange-500',
      border: 'border-orange-200 dark:border-orange-900/30',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    Low: { 
      bg: 'bg-blue-100 text-blue-700',
      darkBg: 'dark:bg-zinc-800 dark:text-blue-500',
      border: 'border-blue-200 dark:border-blue-900/30',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  };

  const style = severityConfig[alert.severity] || severityConfig.Low;

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300
      
      /* LIGHT MODE: Stronger border and shadow */
      bg-white border-gray-300 shadow-sm hover:shadow-md
      
      /* DARK MODE: Solid black background (Opaque) */
      dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-white/20
    `}>
      {/* Decorative colored strip on the left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${alert.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'}`}></div>

      <div className="p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          
          {/* Icon Section - Now using solid backgrounds in dark mode to prevent "dotted lines" */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.darkBg}`}>
              <AlertTriangle size={24} />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-tight">
                {alert.title}
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
                {alert.severity}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-gray-400 dark:text-gray-600" /> 
              {alert.area}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
               <span className="flex items-center gap-1">
                 <Clock size={12} /> {alert.time}
               </span>
               <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
               <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                 <Users size={12} /> {alert.affected} Affected
               </span>
            </div>
          </div>

          {/* Action Section */}
          {/* <div className="w-full md:w-auto flex flex-row gap-3 mt-2 md:mt-0">
             <button className={`
                flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                bg-gray-900 text-white hover:bg-gray-800
                dark:bg-white dark:text-black dark:hover:bg-gray-200
             `}>
                View
             </button>
             <button className={`
                flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border
                border-gray-300 text-gray-700 hover:bg-gray-50
                dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5
             `}>
                Deploy
             </button>
          </div> */}

        </div>
      </div>
    </div>
  );
};