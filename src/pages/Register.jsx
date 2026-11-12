import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: cleanPhone,
      password: formData.password,
    });
    setLoading(false);

    if (result?.success) {
      toast.success('Account created! You can now log in anytime with Mobile OTP.', {
        duration: 4000,
        icon: '📱',
      });
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="bg-cream/30 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Create Account' }]} />

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
              Join Subh Lagan Sarees
            </span>
            <h1 className="font-serif text-2xl font-bold text-primary mt-1">
              Create Customer Account
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enjoy seamless Cash on Delivery ordering, order tracking, and curated royal trousseau offers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-medium text-stone-600 block mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-600 block mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-stone-700">Mobile Number *</label>
                <span className="text-[10px] text-primary font-bold">Used for OTP Login</span>
              </div>
              <div className="relative flex rounded-lg overflow-hidden border border-stone-200 bg-stone-50 focus-within:border-gold focus-within:bg-white transition shadow-xs">
                <div className="px-3 py-2.5 bg-stone-100/90 border-r border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  required
                  maxLength={10}
                  className="w-full px-3 py-2.5 bg-transparent text-xs font-medium focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                10-digit Indian mobile number for instant OTP verification upon login.
              </p>
            </div>

            <div>
              <label className="font-medium text-stone-600 block mb-1">Create Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
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

            <div>
              <label className="font-medium text-stone-600 block mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-gold-dark underline">
              Sign In with Mobile OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

