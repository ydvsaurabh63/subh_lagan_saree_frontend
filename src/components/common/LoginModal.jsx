import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { X, Phone, ArrowRight, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const { sendMobileOtp, loginWithMobileOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpStep, setOtpStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset state on modal open/close
  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setOtp('');
      setSimulatedOtp('');
      setOtpStep('PHONE');
      setCountdown(0);
    }
  }, [isOpen]);

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

  // 1. Request OTP
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
      setOtp(generatedOtp); // Auto-fill for instant seamless testing
      setOtpStep('OTP');
      setCountdown(30);
    }
  };

  // 2. Verify OTP
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
      onClose();
    }
  };

  const handleUseDemo = () => {
    setPhone('9876543210');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
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
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <span className="text-gold-dark text-[10px] uppercase tracking-[0.25em] font-extrabold block">
            Subh Lagan Sarees
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mt-0.5">
            Customer Login
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {otpStep === 'PHONE'
              ? 'Enter your mobile number to receive a secure OTP.'
              : `Enter the 6-digit OTP sent to +91 ${formattedPhone}`}
          </p>
        </div>

        {/* STEP 1: MOBILE NUMBER INPUT */}
        {otpStep === 'PHONE' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Mobile Number *
              </label>
              <div className="relative flex rounded-xl overflow-hidden border border-stone-300 bg-stone-50 focus-within:border-gold focus-within:bg-white focus-within:ring-2 focus-within:ring-gold/20 transition shadow-xs">
                <div className="px-3 py-3 bg-stone-100 border-r border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 select-none">
                  <span className="text-base leading-none">🇮🇳</span>
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
                An OTP will be sent to this number for quick verification.
              </p>
            </div>

            {/* Quick Demo Customer Pill */}
            <button
              type="button"
              onClick={handleUseDemo}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span>⚡ Quick Demo Mobile:</span>
              <span className="font-mono underline">98765 43210</span>
            </button>

            {/* Request OTP Button */}
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
          /* STEP 2: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            {/* Phone Number Display + Change option */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-[9px] text-stone-400 font-semibold uppercase">OTP Sent To</p>
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

            {/* Simulated OTP Highlight Pill (Instant Testing) */}
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
                  (Auto-filled for rapid test, or use universal: <strong className="font-mono">123456</strong>)
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

            {/* Verify Button */}
            <button
              type="submit"
              disabled={verifyLoading || otp.length < 4}
              className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>{verifyLoading ? 'Verifying...' : 'Verify OTP & Login'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
