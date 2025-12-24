import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DashboardView } from "./pages/DashboardView";
import Conference from "./pages/Conference";
import { AlertsView } from "./pages/AlertsView";
import { SOSView } from "./pages/SOSView";
import { PlaceholderView } from "./pages/PlaceholderView";

import { Map as MapIcon, Heart, Shield, FileText, Phone } from "lucide-react";
import MainLayout from "./components/layout/MainLayout";
import { DashboardWeatherAlertsView } from "./pages/DashboardWeatherAlertsView";
import LoginRegisterPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import EditProfile from "./pages/EditProfile";
import DonatePage from "./pages/DonatePage";
import LocalSupportNetwork from "./pages/LocalSupportNetwork";
import ResourceRequests from "./pages/ResourceRequests";
import ContactsPage from "./pages/ContactsPage";
import SafetyInfoPage from "./pages/SafetyInfoPage";
import RescueView from "../../frontend/src/pages/RescueView";
import NotificationAdmin from "./pages/NotificationAdmin";
import MapAdmin from "./pages/MapAdmin";
import UserAdmin from "./pages/UserAdmin";
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
        <Route path="/settings-notifications" element={<NotificationAdmin />} />
        <Route path="/map-navigation" element={<MapAdmin/>} />
        {/* <Route path="/donate" element={<PlaceholderView title="Donation Center" icon={Heart} />} /> */}
        {/* <Route path="/safety-info" element={<PlaceholderView title="Safety Guidelines" icon={Shield} />} /> */}
        {/* <Route path="/resource-requests" element={<PlaceholderView title="Resource Requests" icon={FileText} />} /> */}
        {/* <Route path="/contacts" element={<PlaceholderView title="Emergency Contacts" icon={Phone} />} /> */}
        <Route path="/conference/:roomId" element={<Conference />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings-profile" element={<EditProfile section="profile" />} />
        <Route path="/settings-security" element={<UserAdmin section="security" />} />
        <Route path="/donate" element={<DonatePage  />} />

        <Route path="/local-support-network" element={<LocalSupportNetwork />} />
        
        <Route path="/resources-request" element={<ResourceRequests />} />

                <Route path="/contacts" element={<ContactsPage />} />

                <Route path="/safety-info" element={<SafetyInfoPage />} />


        <Route path="*" element={<PlaceholderView title="Page Not Found" icon={Shield} />} />

      </Route>
          <Route path="/login" element={<LoginRegisterPage />} />
    </Routes>
  );
}
