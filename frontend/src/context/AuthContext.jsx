import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartart_token');
    const stored = localStorage.getItem('smartart_admin');
    if (token && stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await adminApi.login(credentials);
    localStorage.setItem('smartart_token', data.token);
    localStorage.setItem('smartart_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartart_token');
    localStorage.removeItem('smartart_admin');
    setAdmin(null);
  };

  const isAuthenticated = !!admin;

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
