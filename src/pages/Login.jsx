import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import toast from 'react-hot-toast';

const Login = () => {
  // Login mode: 'OTP' (Default / Flipkart style) or 'PASSWORD' (Admin / Email)
  const [loginMode, setLoginMode] = useState('OTP');

  // Mobile OTP state
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpStep, setOtpStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { login, sendMobileOtp, loginWithMobileOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  // Timer for OTP resend countdown
  useEffect(() => {
    let timer;
    if (otpStep === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  const handlePostLoginRedirect = (user, fallbackEmail = '') => {
    const userRole = user?.role;
    const em = (user?.email || fallbackEmail).toLowerCase();
    if (userRole === 'superadmin' || em.includes('superadmin')) {
      navigate('/superadmin', { replace: true });
    } else if (userRole === 'admin') {
      navigate('/admin-portal', { replace: true });
    } else if (userRole === 'client' || em.includes('admin') || em.includes('client')) {
      navigate('/admin', { replace: true });
    } else {
      navigate(redirectPath, { replace: true });
    }
  };

  // 1. Mobile OTP: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    const res = await sendMobileOtp(cleanPhone);
    setOtpLoading(false);

    if (res?.success) {
      setFormattedPhone(cleanPhone);
      const generatedOtp = res.otp || '123456';
      setSimulatedOtp(generatedOtp);
      setOtp(generatedOtp); // Auto-fill for ultra-smooth testing
      setOtpStep('OTP');
      setCountdown(30);
    } else if (res?.isNewUser) {
      // Prompt user to register if account doesn't exist
      navigate('/register', { state: { phone: cleanPhone } });
    }
  };

  // 2. Mobile OTP: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setVerifyLoading(true);
    const res = await loginWithMobileOtp(formattedPhone, otp.trim());
    setVerifyLoading(false);

    if (res?.success) {
      handlePostLoginRedirect(res.user);
    }
  };

  // 3. Email & Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    const result = await login(email, password);
    setPasswordLoading(false);

    if (result?.success) {
      handlePostLoginRedirect(result.user, email);
    }
  };

  // Demo Autofill Handlers
  const handleUseDemoCustomerMobile = () => {
    setLoginMode('OTP');
    setPhone('9876543210');
    setOtpStep('PHONE');
    setOtp('');
  };

  const handleUseDemoCustomerPassword = () => {
    setLoginMode('PASSWORD');
    setEmail('customer@subhlagansarees.com');
    setPassword('password123');
  };

  const handleUseSuperAdmin = () => {
    setLoginMode('PASSWORD');
    setEmail('superadmin@subhlagansarees.com');
    setPassword('superadmin123');
  };

  const handleUseAdmin = () => {
    setLoginMode('PASSWORD');
    setEmail('admin@subhlagansarees.com');
    setPassword('admin123');
  };

  const handleUseClient = () => {
    setLoginMode('PASSWORD');
    setEmail('client@subhlagansarees.com');
    setPassword('client123');
  };

  return (
    <div className="bg-cream/30 min-h-screen py-10 sm:py-14 select-none">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: 'Customer Sign In' }]} />

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
              Welcome to Subh Lagan
            </span>
            <h1 className="font-serif text-2xl font-bold text-primary mt-1">
              Customer Sign In
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {loginMode === 'OTP'
                ? 'Sign in instantly with your registered mobile number & OTP.'
                : 'Sign in to access your royal saree orders, wishlist & account.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Mobile OTP vs Email/Password) */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-bold border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setLoginMode('OTP');
                setOtpStep('PHONE');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                loginMode === 'OTP'
                  ? 'bg-primary text-white shadow-xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
              <span className="text-[9px] px-1 py-0.2 bg-gold/90 text-stone-950 font-black rounded-xs">
                HOT
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMode('PASSWORD')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                loginMode === 'PASSWORD'
                  ? 'bg-primary text-white shadow-xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: FLIPKART STYLE MOBILE NUMBER + OTP LOGIN           */}
          {/* ========================================================= */}
          {loginMode === 'OTP' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* STEP 1: ENTER 10-DIGIT MOBILE NUMBER */}
              {otpStep === 'PHONE' ? (
                <form onSubmit={handleRequestOtp} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Registered Mobile Number *
                    </label>
                    <div className="relative flex rounded-xl overflow-hidden border border-stone-300 bg-stone-50 focus-within:border-gold focus-within:bg-white focus-within:ring-2 focus-within:ring-gold/20 transition shadow-xs">
                      <div className="px-3 py-3 bg-stone-100 border-r border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 select-none">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        required
                        autoFocus
                        className="w-full px-3.5 py-3 bg-transparent text-sm font-semibold tracking-wider text-stone-900 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      An OTP will be sent to this number for instant verification.
                    </p>
                  </div>

                  {/* 1-Click Demo Customer Mobile Pill */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={handleUseDemoCustomerMobile}
                      className="w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span>⚡ Quick Demo Customer Mobile:</span>
                      <span className="underline font-mono">98765 43210</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || phone.length !== 10}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{otpLoading ? 'Sending OTP...' : 'Request OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* STEP 2: VERIFY OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  
                  {/* Phone number & Edit option */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-semibold uppercase">OTP Sent To</p>
                        <p className="text-xs font-bold text-stone-900 font-mono tracking-wide">
                          +91 {formattedPhone}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('PHONE');
                        setOtp('');
                      }}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Simulated OTP Highlight Pill (Instant Testing for User) */}
                  {simulatedOtp && (
                    <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Instant Verification Code:</span>
                      </div>
                      <p className="font-mono text-2xl font-black text-emerald-900 tracking-[0.3em] select-all">
                        {simulatedOtp}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        (Auto-filled for rapid test, or use universal code: <strong className="font-mono">123456</strong>)
                      </p>
                    </div>
                  )}

                  {/* OTP Input */}
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Enter 6-Digit OTP *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      required
                      autoFocus
                      className="w-full py-3 px-4 bg-stone-50 border-2 border-gold/70 rounded-xl text-center font-mono font-black text-xl tracking-[0.4em] text-stone-950 focus:outline-none focus:border-gold focus:bg-white shadow-inner"
                    />
                  </div>

                  {/* Resend OTP Counter */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    {countdown > 0 ? (
                      <span className="text-stone-400 text-[11px]">
                        Resend OTP in <strong className="text-stone-600">{countdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={otpLoading}
                        className="text-primary hover:text-gold-dark font-bold text-xs underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resend OTP</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="text-[10px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Fill Universal OTP (123456)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={verifyLoading || otp.length < 4}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                    <span>{verifyLoading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: EMAIL & PASSWORD LOGIN (ADMIN / CLIENT / FALLBACK) */}
          {/* ========================================================= */}
          {loginMode === 'PASSWORD' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Quick Demo Access Credentials */}
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
                    onClick={handleUseDemoCustomerPassword}
                    className="px-2.5 py-1 bg-gold hover:bg-gold-dark text-white rounded text-[10px] font-bold transition shadow-xs cursor-pointer"
                  >
                    Fill Customer
                  </button>
                </div>
              </div>

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
                  disabled={passwordLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{passwordLoading ? 'Signing In...' : 'Sign In with Password'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Or Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
              or continue with
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={async () => {
              setPasswordLoading(true);
              const result = await login('customer@subhlagansarees.com', 'password123');
              setPasswordLoading(false);
              if (result?.success) {
                navigate(redirectPath, { replace: true });
              }
            }}
            disabled={passwordLoading || otpLoading || verifyLoading}
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

          {/* Footer: Create Account Link */}
          <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100">
            Don’t have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-primary hover:text-gold-dark underline uppercase tracking-wider text-[11px]"
            >
              Sign Up / Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
