import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Sparkles } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already running as installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Check if user dismissed recently (in last 5 days)
    const dismissedTime = localStorage.getItem('sls_pwa_dismissed');
    if (dismissedTime && Date.now() - Number(dismissedTime) < 5 * 24 * 60 * 60 * 1000) {
      return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !/crios|fxios/i.test(userAgent);
    if (isIosDevice) {
      setIsIOS(true);
      // Wait 3.5s before showing gently to iOS visitors
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome / Edge standard beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds after page load before showing
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('sls_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Sleek compact floating app install banner */}
      <aside
        aria-label="Install Subh Lagan App"
        className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-24 sm:max-w-xs z-40 bg-white/95 backdrop-blur-md border border-gold/30 rounded-2xl shadow-[0_8px_25px_rgba(104,27,44,0.15)] px-3 py-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
      >
        <div className="flex items-center gap-2.5">
          {/* App Icon */}
          <div className="w-8 h-8 rounded-xl bg-[#681B2C] p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/pwa-192x192.png"
              alt="Subh Lagan"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Minimal Text */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              Subh Lagan App
            </h4>
          </div>

          {/* Action Button */}
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-[#681B2C] hover:bg-[#521523] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
          >
            <Download className="w-3 h-3 text-gold" />
            Install
          </button>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* iOS Safari Instruction Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#681B2C] p-1 flex items-center justify-center">
                  <img src="/pwa-192x192.png" alt="Subh Lagan" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Install on iPhone</h3>
                  <p className="text-[11px] text-stone-500">2 easy steps to add to home screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-stone-700 my-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>
                  Tap the <strong className="inline-flex items-center gap-1 font-semibold text-stone-900"><Share2 className="w-3.5 h-3.5 inline text-blue-500" /> Share</strong> button in Safari's bottom toolbar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>
                  Scroll down and select <strong className="font-semibold text-stone-900">"Add to Home Screen"</strong>.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 bg-[#681B2C] text-white rounded-xl text-xs font-bold hover:bg-[#521523] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;

