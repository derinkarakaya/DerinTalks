import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, getStoredUser, setStoredToken, setStoredUser, removeStoredToken, removeStoredUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          setStoredUser(userData);
        } catch {
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
    setStoredToken(res.access_token);
    setStoredUser(res.user);
    return res;
  };

  const handleRegister = async (payload) => {
    const res = await api.register(payload);
    setToken(res.access_token);
    setUser(res.user);
    setStoredToken(res.access_token);
    setStoredUser(res.user);
    return res;
  };

  const handleDemoLogin = async (role) => {
    try {
      const res = await api.demoLogin(role);
      setToken(res.access_token);
      setUser(res.user);
      setStoredToken(res.access_token);
      setStoredUser(res.user);
      return res.user;
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      setStoredUser(userData);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        loading,
        login: handleLogin,
        register: handleRegister,
        demoLogin: handleDemoLogin,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
