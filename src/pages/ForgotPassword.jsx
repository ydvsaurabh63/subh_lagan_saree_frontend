import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api.js';
import { Mail, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      if (res.success) {
        toast.success(res.message || 'OTP sent to your email!');
        // If local dev OTP exists, display it for ease of testing
        if (res.devOtp) {
          toast(`Your testing OTP is: ${res.devOtp}`, { icon: '🔑', duration: 8000 });
        }
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream/30 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Sign In', link: '/login' }, { label: 'Forgot Password' }]} />

        <div className="bg-white rounded-3xl p-8 border border-gold/40 shadow-luxury space-y-6 mt-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-primary mb-3">
              <Mail className="w-6 h-6 text-gold-dark" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">
              Forgot Password
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter your registered email address to receive a 6-digit verification code.
            </p>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-gold-dark underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
