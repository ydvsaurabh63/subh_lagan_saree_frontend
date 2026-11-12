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
            <Link to="/" className="inline-block mb-3 group" title="Subh Lagan Sarees">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-16 sm:h-20 w-auto mx-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <span className="text-gold-dark text-[10px] uppercase tracking-[0.25em] font-semibold block">
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
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Or Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-stone-400 text-[10px] font-bold uppercase tracking-wider">or continue with</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              const result = await login('customer@subhlagansarees.com', 'password123');
              setLoading(false);
              if (result?.success) {
                navigate(redirectPath, { replace: true });
              }
            }}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-lg border border-stone-300 shadow-xs transition flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

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

