import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sls_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on app mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Session expired or invalid:', error.message);
        localStorage.removeItem('sls_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        localStorage.setItem('sls_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, message: error.message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      if (res.success) {
        localStorage.setItem('sls_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome to Subh Lagan Sarees, ${res.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('sls_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

