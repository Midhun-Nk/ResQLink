import { AlertsView } from "./AlertsView";
import { WeatherView } from "./WeatherView";

// Combined View for Dashboard > Weather & Alerts
export const DashboardWeatherAlertsView = () => (
  <div className="flex flex-col gap-10">
     {/* Directly embedding the views for a "contained" feel */}
     <div>
        <WeatherView />
     </div>
     <div className="border-t border-gray-200 pt-8">
        <AlertsView />
     </div>
  </div>
);