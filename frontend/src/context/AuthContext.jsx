import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for token and set user if present
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.replace("/login");
      }
    }
  }, [location.pathname]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

