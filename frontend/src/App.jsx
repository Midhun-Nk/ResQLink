import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DashboardView } from "./pages/DashboardView";
import Conference from "./pages/Conference";
import { AlertsView } from "./pages/AlertsView";
import { SOSView } from "./pages/SOSView";
import { RescueView } from "./pages/RescueView";
import { PlaceholderView } from "./pages/PlaceholderView";

import { Map as MapIcon, Heart, Shield, FileText, Phone } from "lucide-react";
import MainLayout from "./components/layout/MainLayout";
import { DashboardWeatherAlertsView } from "./pages/DashboardWeatherAlertsView";
import LoginRegisterPage from "./pages/LoginPage";
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardView />} />
        <Route path="/dashboard-overview" element={<DashboardView />} />
        <Route path="/weather-alerts" element={<DashboardWeatherAlertsView />} />
        <Route path="/alerts" element={<AlertsView />} />
        <Route path="/sos" element={<SOSView />} />
        <Route path="/rescue-channels" element={<RescueView />} />
        <Route path="/map-navigation" element={<PlaceholderView title="Live Map Navigation" icon={MapIcon} />} />
        <Route path="/donate" element={<PlaceholderView title="Donation Center" icon={Heart} />} />
        <Route path="/safety-info" element={<PlaceholderView title="Safety Guidelines" icon={Shield} />} />
        <Route path="/resource-requests" element={<PlaceholderView title="Resource Requests" icon={FileText} />} />
        <Route path="/contacts" element={<PlaceholderView title="Emergency Contacts" icon={Phone} />} />
        <Route path="/conference" element={<Conference />} />
    

        <Route path="*" element={<PlaceholderView title="Page Not Found" icon={Shield} />} />

      </Route>
          <Route path="/login" element={<LoginRegisterPage />} />
    </Routes>
  );
}
