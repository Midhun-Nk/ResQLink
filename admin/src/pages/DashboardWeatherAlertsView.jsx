import { AlertsView } from "./AlertsView";
import WeatherView from "./WeatherView";

// Combined View for Dashboard > Weather & Alerts
export const DashboardWeatherAlertsView = () => (
  <div className="flex flex-col gap-10 animate-in fade-in duration-500">
     {/* Weather Section */}
     <div>
        <WeatherView />
     </div>
     
     {/* Separator - Now compatible with Midnight Onyx Theme */}
     <div className="border-t border-gray-200 dark:border-white/10 pt-8">
        <AlertsView />
     </div>
  </div>
);