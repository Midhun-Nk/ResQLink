import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

const baseURL = import.meta.env.VITE_API_URL;
const googleAuthURL = import.meta.env.VITE_GOOGLE_URL;

export const AppProvider = ({ children }) => {
  const [hotelData, setHotelData] = useState(null);
  const [user, setUser] = useState(null);

  // -------------------------------------------------------
  // 🔵 GOOGLE LOGIN → Redirect to backend
  // -------------------------------------------------------
  const loginWithGoogle = () => {
    window.location.href = `${googleAuthURL}/auth/google`;
  };

  // -------------------------------------------------------
  // 🔵 Handle Google Login Success → Tokens + User
  // Called in /auth/google/page.jsx
  // -------------------------------------------------------
  const handleGoogleLoginSuccess = async (access, refresh, userData) => {
    try {
      // Save tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Save user
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Google OAuth handling failed:", err);
    }
  };

  // -------------------------------------------------------
  // Restore user on refresh
  // -------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // -------------------------------------------------------
  // Axios instance
  // -------------------------------------------------------
  const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Attach access token automatically
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // -------------------------------------------------------
  // Auto-refresh Token on 401
  // -------------------------------------------------------
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) {
          logout();
          return Promise.reject(err);
        }

        try {
          const res = await axios.post(
            "/auth/refresh-token",
            { refresh_token: refresh },
            { baseURL }
          );

          localStorage.setItem("accessToken", res.data.access_token);

          originalRequest.headers.Authorization =
            `Bearer ${res.data.access_token}`;

          return api(originalRequest);
        } catch (refreshErr) {
          logout();
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(err);
    }
  );

  // -------------------------------------------------------
  // Logout
  // -------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // -------------------------------------------------------
  // Fetch hotel data
  // -------------------------------------------------------
  const fetchHotelData = async () => {
    try {
      const { data } = await api.get("/hotels/");
      setHotelData(data);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        hotelData,
        setHotelData,
        api,
        user,
        
        setUser,
        loginWithGoogle,
        handleGoogleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
