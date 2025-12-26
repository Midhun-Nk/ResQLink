import { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;
const API_BASE = `${VITE_API_URL_PYTHON}`;

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await axios.get(`${API_BASE}/notifications/`, { headers });

        // 🔁 MAP BACKEND → UI FORMAT
        const formatted = res.data.map((n) => ({
          id: n.id,
          title: n.title,
          severity:
            n.notification_type === "alert"
              ? "Critical"
              : n.notification_type === "warning"
              ? "Moderate"
              : "Low",
          area: n.is_broadcast ? "All Regions" : "Personal Alert",
          time: new Date(n.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          affected: n.is_broadcast ? "Public" : "You",
        }));

        setAlerts(formatted);
      } catch (err) {
        console.error("Alert fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading };
};

