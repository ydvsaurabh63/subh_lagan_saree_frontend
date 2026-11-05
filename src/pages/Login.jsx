import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      const userRole = result.user?.role;
      if (userRole === 'superadmin' || email.toLowerCase().includes('superadmin')) {
        navigate('/superadmin', { replace: true });
      } else if (userRole === 'admin') {
        navigate('/admin-portal', { replace: true });
      } else if (userRole === 'client' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('client')) {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    }
  };

  const handleUseDemo = () => {
    setEmail('customer@subhlagansarees.com');
    setPassword('password123');
  };

  const handleUseSuperAdmin = () => {
    setEmail('superadmin@subhlagansarees.com');
    setPassword('superadmin123');
  };

  const handleUseAdmin = () => {
    setEmail('admin@subhlagansarees.com');
    setPassword('admin123');
  };

  const handleUseClient = () => {
    setEmail('client@subhlagansarees.com');
    setPassword('client123');
  };

  return (
    <div className="bg-cream/30 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Sign In' }]} />

        <div className="bg-white rounded-3xl p-8 border border-gold/40 shadow-luxury space-y-6 mt-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary flex items-center justify-center text-gold border-2 border-gold font-serif font-bold text-lg mb-3">
              SL
            </div>
            <span className="text-gold-dark text-[10px] uppercase tracking-[0.25em] font-semibold">
              Welcome to Subh Lagan
            </span>
            <h1 className="font-serif text-2xl font-bold text-primary mt-1">
              Customer Sign In
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Sign in to manage your orders, wishlist, and saved addresses.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          {/* Demo Login Credentials for All Roles */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-2">
            <p className="font-bold text-[10px] text-amber-950 uppercase tracking-wider">
              Quick One-Click Demo Access
            </p>

            {/* 1. SuperAdmin */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
              <div>
                <p className="font-bold text-purple-900">SuperAdmin (Master Portal):</p>
                <p className="text-[10px] text-stone-600">superadmin@subhlagansarees.com</p>
              </div>
              <button
                type="button"
                onClick={handleUseSuperAdmin}
                className="px-2.5 py-1 bg-purple-900 hover:bg-purple-950 text-white rounded text-[10px] font-bold transition shadow-xs cursor-pointer"
              >
                Fill SuperAdmin
              </button>
            </div>

            {/* 2. Admin */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
              <div>
                <p className="font-bold text-stone-900">Admin Portal (3 Tabs):</p>
                <p className="text-[10px] text-stone-600">admin@subhlagansarees.com</p>
              </div>
              <button
                type="button"
                onClick={handleUseAdmin}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white rounded text-[10px] font-bold transition shadow-xs cursor-pointer"
              >
                Fill Admin
              </button>
            </div>

            {/* 3. Client */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
              <div>
                <p className="font-bold text-primary">Client Store Dashboard:</p>
                <p className="text-[10px] text-stone-600">client@subhlagansarees.com</p>
              </div>
              <button
                type="button"
                onClick={handleUseClient}
                className="px-2.5 py-1 bg-primary hover:bg-secondary text-white rounded text-[10px] font-bold transition shadow-xs cursor-pointer"
              >
                Fill Client
              </button>
            </div>

            {/* 4. Customer */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
              <div>
                <p className="font-bold text-amber-950">Customer Account:</p>
                <p className="text-[10px] text-amber-800">customer@subhlagansarees.com</p>
              </div>
              <button
                type="button"
                onClick={handleUseDemo}
                className="px-2.5 py-1 bg-gold hover:bg-gold-dark text-white rounded text-[10px] font-bold transition shadow-xs cursor-pointer"
              >
                Fill Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-stone-600 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-stone-600">Password</label>
                <Link
                  to="/forgot-password"
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
                  className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-gold-dark underline">
              Create One Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

