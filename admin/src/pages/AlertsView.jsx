import { Filter } from "lucide-react";
import { alertsData } from "../assets/data";
import { AlertCard } from "../components/AlertCard";

export const AlertsView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-6">
       <h4 className="text-xl font-bold text-gray-900">Active Alerts</h4>
       <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
          <Filter size={16} /> Filter Severity
       </button>
    </div>
    {alertsData.map(alert => <AlertCard key={alert.id} alert={alert} />)}
  </div>
);
