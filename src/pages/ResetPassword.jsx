import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api.js';
import { KeyRound, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    if (password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({ email, otp, password });
      if (res.success) {
        toast.success(res.message || 'Password reset successfully!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream/30 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Sign In', link: '/login' }, { label: 'Reset Password' }]} />

        <div className="bg-white rounded-3xl p-8 border border-gold/40 shadow-luxury space-y-6 mt-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-primary mb-3">
              <KeyRound className="w-6 h-6 text-gold-dark" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">
              Reset Your Password
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter the 6-digit OTP sent to <strong>{email || 'your email'}</strong> and set a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!searchParams.get('email') && (
              <div>
                <label className="font-medium text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="font-medium text-stone-600 block mb-1">6-Digit OTP *</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full text-center tracking-[0.5em] font-mono text-base font-bold py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
              />
            </div>

            <div>
              <label className="font-medium text-stone-600 block mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              <label className="font-medium text-stone-600 block mb-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100">
            Back to{' '}
            <Link to="/login" className="font-bold text-primary hover:text-gold-dark underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
