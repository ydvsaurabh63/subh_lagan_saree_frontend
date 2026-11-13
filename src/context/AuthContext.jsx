import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, managementApi } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sls_token') || null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(() => !!sessionStorage.getItem('sls_impersonator_token'));

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

  // Google OAuth Login handler
  const loginWithGoogle = async (googleData) => {
    try {
      const res = await authApi.googleLogin(googleData);
      if (res.success) {
        localStorage.setItem('sls_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}! ✨`);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (error) {
      toast.error(error.message || 'Google login failed');
      return { success: false, message: error.message };
    }
  };

  // Mobile OTP Request handler
  const sendMobileOtp = async (phone) => {
    try {
      const res = await authApi.sendMobileOtp({ phone });
      if (res.success) {
        toast.success(res.message || 'OTP sent to mobile!', { icon: '📱' });
        return { success: true, phone: res.phone, otp: res.otp, userName: res.userName };
      }
      return { success: false, message: res.message };
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
      return { success: false, message: error.message };
    }
  };

  // Mobile OTP Login handler
  const loginWithMobileOtp = async (phone, otp) => {
    try {
      const res = await authApi.verifyMobileOtp({ phone, otp });
      if (res.success) {
        localStorage.setItem('sls_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}! ✨`);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
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
    sessionStorage.removeItem('sls_impersonator_token');
    sessionStorage.removeItem('sls_impersonator_role');
    setIsImpersonating(false);
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Direct login / impersonation to client account
  const impersonateAsClient = async (clientId) => {
    try {
      const res = await managementApi.impersonateUser(clientId);
      if (res.success && res.token) {
        // Save original admin/superadmin token and role
        if (!sessionStorage.getItem('sls_impersonator_token')) {
          sessionStorage.setItem('sls_impersonator_token', token);
          sessionStorage.setItem('sls_impersonator_role', user?.role || 'superadmin');
        }
        localStorage.setItem('sls_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsImpersonating(true);
        toast.success(`Direct login to ${res.user.storeName || res.user.name} successful!`);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Direct login failed' };
    } catch (error) {
      toast.error(error.message || 'Direct login failed');
      return { success: false, message: error.message };
    }
  };

  // Return to SuperAdmin / Admin portal
  const stopImpersonation = async () => {
    try {
      const savedToken = sessionStorage.getItem('sls_impersonator_token');
      const savedRole = sessionStorage.getItem('sls_impersonator_role') || 'superadmin';

      if (savedToken) {
        sessionStorage.removeItem('sls_impersonator_token');
        sessionStorage.removeItem('sls_impersonator_role');
        localStorage.setItem('sls_token', savedToken);
        setToken(savedToken);
        setIsImpersonating(false);

        // Fetch original admin/superadmin user
        try {
          const response = await authApi.getMe();
          if (response.success) {
            setUser(response.user);
          }
        } catch {
          // If token fetch fails, the token useEffect will handle it
        }

        const returnPath = savedRole === 'superadmin' ? '/superadmin' : '/admin-portal';
        toast.success(`Returned to ${savedRole === 'superadmin' ? 'SuperAdmin' : 'Admin'} Portal`);
        return { success: true, returnPath };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.message || 'Error restoring session');
      return { success: false };
    }
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
        isImpersonating,
        login,
        loginWithGoogle,
        sendMobileOtp,
        loginWithMobileOtp,
        register,
        logout,
        impersonateAsClient,
        stopImpersonation,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

