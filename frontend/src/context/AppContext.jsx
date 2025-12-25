import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const baseURL = import.meta.env.VITE_API_URL;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Attach access token automatically
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
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
  navigate("/login", { replace: true });
};


 
  return (
    <AppContext.Provider
      value={{
    
      
        api,
        user,
        
        setUser,

        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
