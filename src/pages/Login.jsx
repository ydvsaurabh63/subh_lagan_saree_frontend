import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Briefcase,
  Store,
  User,
} from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import toast from 'react-hot-toast';

const Login = ({ portal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Detect portal from prop or pathname
  const path = location.pathname.toLowerCase();
  const portalType =
    portal ||
    (path.startsWith('/superadmin')
      ? 'superadmin'
      : path.startsWith('/admin')
      ? 'admin'
      : path.startsWith('/client')
      ? 'client'
      : 'customer');

  // Clean empty inputs - no pre-fill!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  // Portal metadata
  const portalConfig = {
    superadmin: {
      tag: 'MASTER SECURITY PORTAL',
      title: 'SuperAdmin Sign In',
      subtitle: 'Enter your SuperAdmin credentials to access the master control panel.',
      placeholder: 'superadmin@subhlagansarees.com',
      buttonText: 'Sign In to SuperAdmin',
      buttonBg: 'bg-purple-900 hover:bg-purple-950',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      icon: Shield,
      targetRole: 'superadmin',
      redirectTarget: '/superadmin',
    },
    admin: {
      tag: 'ADMIN MANAGEMENT PORTAL',
      title: 'Admin Sign In',
      subtitle: 'Enter your Admin credentials to manage platform operations.',
      placeholder: 'admin@subhlagansarees.com',
      buttonText: 'Sign In to Admin Portal',
      buttonBg: 'bg-stone-900 hover:bg-black',
      badgeColor: 'text-stone-700 bg-stone-100 border-stone-200',
      icon: Briefcase,
      targetRole: 'admin',
      redirectTarget: '/admin-portal',
    },
    client: {
      tag: 'CLIENT STORE DASHBOARD',
      title: 'Client Store Sign In',
      subtitle: 'Enter your Boutique credentials to manage products, sales & orders.',
      placeholder: 'client@subhlagansarees.com',
      buttonText: 'Sign In to Client Store',
      buttonBg: 'bg-primary hover:bg-primary-light',
      badgeColor: 'text-primary bg-primary/10 border-primary/20',
      icon: Store,
      targetRole: 'client',
      redirectTarget: '/admin',
    },
    customer: {
      tag: 'WELCOME TO SUBH LAGAN',
      title: 'Customer Sign In',
      subtitle: 'Sign in to access your royal saree orders, wishlist & account.',
      placeholder: 'name@example.com',
      buttonText: 'Sign In with Password',
      buttonBg: 'bg-primary hover:bg-primary-light',
      badgeColor: 'text-gold-dark bg-cream border-gold/30',
      icon: User,
      targetRole: 'customer',
      redirectTarget: redirectPath,
    },
  }[portalType] || {
    tag: 'WELCOME TO SUBH LAGAN',
    title: 'Customer Sign In',
    subtitle: 'Sign in to access your royal saree orders, wishlist & account.',
    placeholder: 'name@example.com',
    buttonText: 'Sign In with Password',
    buttonBg: 'bg-primary hover:bg-primary-light',
    badgeColor: 'text-gold-dark bg-cream border-gold/30',
    icon: User,
    targetRole: 'customer',
    redirectTarget: redirectPath,
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result?.success) {
      const user = result.user;
      const role = user?.role;
      const em = (user?.email || email).toLowerCase();

      // Role check for dedicated portals
      if (portalType === 'superadmin' && role !== 'superadmin' && !em.includes('superadmin')) {
        toast.error('Access Denied: Only SuperAdmin accounts can sign in here.');
        return;
      }
      if (
        portalType === 'admin' &&
        !['admin', 'superadmin'].includes(role) &&
        !em.includes('admin')
      ) {
        toast.error('Access Denied: Only Admin accounts can sign in here.');
        return;
      }
      if (
        portalType === 'client' &&
        !['client', 'admin', 'superadmin'].includes(role) &&
        !em.includes('client')
      ) {
        toast.error('Access Denied: Only Client Store accounts can sign in here.');
        return;
      }

      toast.success(`Welcome back, ${user?.name || 'User'}! ✨`);

      // Destination routing
      if (portalType === 'superadmin' || role === 'superadmin') {
        navigate('/superadmin', { replace: true });
      } else if (portalType === 'admin' || role === 'admin') {
        navigate('/admin-portal', { replace: true });
      } else if (portalType === 'client' || role === 'client') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    }
  };

  return (
    <div className="bg-cream/30 min-h-screen py-10 sm:py-14 select-none flex flex-col justify-center">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: portalConfig.title }]} />

        {/* Clean Login Card matching Screenshot 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-luxury space-y-5 mt-4">
          
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-block mb-2.5 group" title="Subh Lagan Sarees">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-14 sm:h-18 w-auto mx-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <span className="text-gold-dark text-[10px] uppercase tracking-[0.25em] font-extrabold block">
              {portalConfig.tag}
            </span>
            <h1 className="font-serif text-2xl font-bold text-primary mt-1">
              {portalConfig.title}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {portalConfig.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-stone-600 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portalConfig.placeholder}
                  required
                  autoFocus
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
              className={`w-full py-3 ${portalConfig.buttonBg} text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-99`}
            >
              <span>{loading ? 'Signing In...' : portalConfig.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation Links */}
          <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
            {portalType === 'customer' ? (
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-bold">
                  Create Account
                </Link>
              </p>
            ) : (
              <p>
                Looking for customer store?{' '}
                <Link to="/login" className="text-primary hover:underline font-bold">
                  Customer Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
