import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Coins,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCredits = () => {
  const handleRefill = (tier) => {
    toast.success(`Request for ${tier} credits submitted`);
  };

  return (
    <AdminLayout title="Credits">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
              <Coins className="w-5 h-5 text-gold" />
              Credits
            </h1>
            <p className="text-xs text-brandText-muted">
              AI Try-On usage quota
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            API Key Secured
          </span>
        </div>

        {/* Credit Balance Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-5 rounded-xl bg-gradient-to-br from-[#2B0A13] via-[#42101E] to-[#1E060D] text-white shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                  Balance
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-white mt-0.5">
                  8,742 <span className="text-sm font-sans text-gold font-semibold">Credits</span>
                </div>
                <p className="text-xs text-cream/70 mt-0.5">
                  10,000 monthly quota (87% remaining)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                <Zap className="w-5 h-5 text-gold" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="my-4">
              <div className="w-full h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold to-emerald-400 rounded-full w-[87%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-cream/70 mt-1.5 font-mono">
                <span>Used: 1,258</span>
                <span className="text-gold font-bold">8,742 left</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-xs text-cream/70 flex justify-between">
              <span>1 credit = 1 trial</span>
              <span className="text-emerald-400 font-bold">Renews next month</span>
            </div>
          </div>

          {/* Tier Info */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider bg-gold/15 text-primary font-bold px-2 py-0.5 rounded-full">
                Royal Tier
              </span>
              <h3 className="font-serif text-base font-bold text-brandText mt-2">
                Enterprise Plan
              </h3>
              <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-bold text-emerald-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed</span>
                  <span className="font-bold text-brandText">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality</span>
                  <span className="font-bold text-brandText">4K HD</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRefill('Extra')}
              className="mt-4 w-full py-2 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Add Credits
            </button>
          </div>
        </div>

        {/* Top-up Packs */}
        <div className="space-y-2">
          <h2 className="font-serif text-sm font-bold text-brandText">
            Top-Up Packs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="font-serif text-sm font-bold text-brandText">Rush Pack</p>
                <div className="font-serif text-xl font-bold text-primary mt-1">
                  +2,500 <span className="text-xs font-sans text-stone-500">Credits</span>
                </div>
              </div>
              <button
                onClick={() => handleRefill('2,500')}
                className="mt-3 w-full py-1.5 bg-stone-100 hover:bg-gold hover:text-white text-stone-800 text-xs font-bold rounded-lg transition"
              >
                Refill 2,500
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-gold shadow-sm flex flex-col justify-between">
              <div>
                <p className="font-serif text-sm font-bold text-brandText">Pro Pack</p>
                <div className="font-serif text-xl font-bold text-primary mt-1">
                  +10,000 <span className="text-xs font-sans text-stone-500">Credits</span>
                </div>
              </div>
              <button
                onClick={() => handleRefill('10,000')}
                className="mt-3 w-full py-1.5 bg-gold hover:bg-gold-dark text-primary font-bold text-xs rounded-lg transition"
              >
                Refill 10,000
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="font-serif text-sm font-bold text-brandText">Unlimited</p>
                <div className="font-serif text-xl font-bold text-primary mt-1">
                  Unlimited
                </div>
              </div>
              <button
                onClick={() => handleRefill('Unlimited')}
                className="mt-3 w-full py-1.5 bg-stone-100 hover:bg-gold hover:text-white text-stone-800 text-xs font-bold rounded-lg transition"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCredits;
