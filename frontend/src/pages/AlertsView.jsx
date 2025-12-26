import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BellRing,
  ShieldAlert,
  Radio,
  Filter,
} from "lucide-react";
import AlertCard from "../components/AlertCard";

const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
const API_BASE = `${VITE_API_URL_PYTHON}`;

const TYPE_ORDER = ["all", "alert", "warning", "info", "success"];

const TYPE_LABELS = {
  all: "All Types",
  alert: "Critical",
  warning: "Moderate",
  info: "Low",
  success: "Success",
};

export const AlertsView = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // left-side filter
  const [scopeFilter, setScopeFilter] = useState("all"); 
  // right-side filter
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await axios.get(`${API_BASE}/notifications/`, { headers });
        setAlerts(res.data || []);
      } catch (err) {
        console.error("Alert fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // 🔁 cycle notification_type filter
  const cycleTypeFilter = () => {
    const index = TYPE_ORDER.indexOf(typeFilter);
    const next = TYPE_ORDER[(index + 1) % TYPE_ORDER.length];
    setTypeFilter(next);
  };

  // 🔎 FINAL FILTER LOGIC
  const filteredAlerts = alerts.filter((alert) => {
    // scope filter
    if (scopeFilter === "broadcast" && !alert.is_broadcast) return false;
    if (scopeFilter === "personal" && alert.is_broadcast) return false;

    // type filter
    if (typeFilter !== "all" && alert.notification_type !== typeFilter)
      return false;

    return true;
  });

  return (
    <div className="animate-in fade-in duration-500">

      {/* ================= ACTION BUTTONS ================= */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        {/* PERSONAL */}
        <button
          onClick={() => setScopeFilter("personal")}
          className={
            scopeFilter === "personal"
              ? "p-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              : "p-4 rounded-xl bg-red-50 border-2 border-red-100 text-red-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
          }
        >
          <ShieldAlert className="w-4 h-4" />
          Personal Alert
        </button>

        {/* BROADCAST */}
        <button
          onClick={() => setScopeFilter("broadcast")}
          className={
            scopeFilter === "broadcast"
              ? "p-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 dark:bg-white dark:text-black"
              : "p-4 rounded-xl bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 dark:bg-white/5 dark:text-zinc-400"
          }
        >
          <Radio className="w-4 h-4" />
          Broadcast Alert
        </button>
      </div>

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-600 dark:bg-[#2a0a0a] dark:text-red-500 dark:border dark:border-red-900/30">
            <BellRing size={20} />
          </div>
          <div>
            <h4
              onClick={() => {
                setScopeFilter("all");
                setTypeFilter("all");
              }}
              className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer"
            >
              Active Alerts
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              Click title to reset filters
            </p>
          </div>
        </div>

        {/* ================= TYPE FILTER ================= */}
        <button
          onClick={cycleTypeFilter}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold bg-white border-gray-300 text-slate-700 hover:bg-slate-50 dark:bg-[#0a0a0a] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <Filter size={16} />
          {TYPE_LABELS[typeFilter]}
        </button>
      </div>

      {/* ================= ALERT LIST ================= */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading alerts...
          </p>
        ) : filteredAlerts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No alerts found for this filter.
          </p>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
};
