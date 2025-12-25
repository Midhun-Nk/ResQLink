import React from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users
} from "lucide-react";

const severityConfig = {
  alert: {
    label: "Critical",
    strip: "bg-red-600",
    bg: "bg-red-100 text-red-700",
    darkBg: "dark:bg-zinc-800 dark:text-red-500",
    badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  },
  warning: {
    label: "Moderate",
    strip: "bg-orange-500",
    bg: "bg-orange-100 text-orange-700",
    darkBg: "dark:bg-zinc-800 dark:text-orange-500",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  },
  info: {
    label: "Low",
    strip: "bg-blue-500",
    bg: "bg-blue-100 text-blue-700",
    darkBg: "dark:bg-zinc-800 dark:text-blue-500",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  success: {
    label: "Success",
    strip: "bg-emerald-500",
    bg: "bg-emerald-100 text-emerald-700",
    darkBg: "dark:bg-zinc-800 dark:text-emerald-500",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
  }
};

const AlertCard = ({ alert }) => {
  const config = severityConfig[alert.notification_type] || severityConfig.info;

  return (
    <div
      className="
        relative overflow-hidden rounded-xl border transition-all duration-300
        bg-white border-gray-300 shadow-sm hover:shadow-md
        dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-white/20
      "
    >
      {/* Left severity strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.strip}`} />

      <div className="p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">

          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.darkBg}`}
            >
              <AlertTriangle size={24} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-tight">
                {alert.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${config.badge}`}
              >
                {config.label}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-gray-400 dark:text-gray-600" />
              {alert.location || "All Regions"}
            </p>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(alert.created_at).toLocaleString()}
              </span>

              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />

              <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Users size={12} />
                {alert.is_broadcast ? "Public" : "You"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertCard;
