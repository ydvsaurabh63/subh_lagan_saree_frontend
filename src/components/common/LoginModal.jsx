import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { triggerGoogleAuth } from '../../utils/googleAuth.js';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Password Login Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res?.success) {
      onClose();
      // Redirect based on role if admin/superadmin/client
      const role = res.user?.role;
      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/admin-portal');
      } else if (role === 'client') {
        navigate('/admin');
      }
    }
  };

  // 2. Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      toast.loading('Opening Google Sign-In...', { id: 'google-login' });
      const authResult = await triggerGoogleAuth();
      toast.loading('Signing in...', { id: 'google-login' });
      const res = await loginWithGoogle(authResult);
      if (res?.success) {
        toast.success(`Welcome, ${res.user?.name || 'Customer'}! ✨`, { id: 'google-login' });
        onClose();
        // Redirect based on role if admin/superadmin/client
        const role = res.user?.role;
        if (role === 'superadmin') {
          navigate('/superadmin');
        } else if (role === 'admin') {
          navigate('/admin-portal');
        } else if (role === 'client') {
          navigate('/admin');
        }
      } else {
        toast.error(res?.message || 'Google Sign-In failed', { id: 'google-login' });
      }
    } catch (err) {
      if (err.message && (err.message.includes('closed') || err.message.includes('popup_closed'))) {
        toast.dismiss('google-login');
      } else {
        toast.error(err.message || 'Could not complete Google Sign-In', { id: 'google-login' });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-gold/40 shadow-2xl p-6 sm:p-8 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <Link to="/" onClick={onClose} className="inline-block mb-2 group">
            <img
              src="/logo.png"
              alt="Subh Lagan Sarees"
              className="h-12 w-auto mx-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </Link>
          <span className="text-gold-dark text-[10px] uppercase tracking-[0.25em] font-extrabold block">
            Welcome to Subh Lagan
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mt-0.5">
            Customer Sign In
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Sign in to access your royal saree orders, wishlist & account.
          </p>
        </div>

        {/* Option 1: Official Google Sign-In Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-3 cursor-pointer active:scale-99 disabled:opacity-60"
          >
            {/* Google Multi-Color SVG Logo */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Or with Email
          </span>
          <div className="border-t border-stone-200 w-full" />
        </div>

        {/* Option 2: Email & Password Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-medium text-stone-600 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white text-stone-900"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-stone-600">Password</label>
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="text-primary hover:text-gold-dark font-medium underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white text-stone-900"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-99"
          >
            <span>{loading ? 'Signing In...' : 'Sign In with Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Modal Footer */}
        <div className="pt-3 mt-4 text-center text-xs text-stone-500 border-t border-stone-100">
          Don't have an account?{' '}
          <Link
            to="/register"
            onClick={onClose}
            className="text-primary hover:underline font-bold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
