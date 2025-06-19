// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { isTokenExpired } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (storedToken && parsedUser && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("Error parsing auth data:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
