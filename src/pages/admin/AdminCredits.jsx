import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Coins,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCredits = () => {
  const handleRefill = (tier) => {
    toast.success(`Refill request for ${tier} credits submitted to Subh Lagan Billing!`);
  };

  return (
    <AdminLayout title="Try-On AI Credits">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
              <Coins className="w-6 h-6 text-gold" />
              AI Try-On Credits & Engine Quota
            </h1>
            <p className="text-sm text-brandText-muted">
              Monitor neural draping credits, LightX API key security, and monthly quota
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              API Key Secured on Backend Server
            </span>
          </div>
        </div>

        {/* Credit Balance Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#2B0A13] via-[#42101E] to-[#1E060D] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">
                  Active Quota Balance
                </span>
                <div className="font-serif text-4xl sm:text-5xl font-black text-white mt-1">
                  8,742 <span className="text-lg font-sans text-gold font-bold">Credits</span>
                </div>
                <p className="text-xs text-cream/70 mt-1">
                  Out of 10,000 monthly enterprise quota (87.4% remaining)
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                <Zap className="w-6 h-6 text-gold animate-pulse" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 my-6">
              <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold via-amber-400 to-emerald-400 rounded-full w-[87.4%]"></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-cream/80 mt-2">
                <span>Used: 1,258 drapes</span>
                <span className="text-gold font-bold">8,742 remaining</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
              <span className="text-xs text-cream/80">
                1 Credit = 1 Realtime Saree Draping Trial
              </span>
              <span className="text-xs text-emerald-400 font-bold ml-auto flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-renew: 1st of next month
              </span>
            </div>
          </div>

          {/* Quick Plan Card */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider bg-gold/15 text-primary font-extrabold px-2.5 py-1 rounded-full">
                Active Tier
              </span>
              <h3 className="font-serif text-xl font-bold text-brandText mt-3">
                Royal Boutique Tier
              </h3>
              <p className="text-xs text-brandText-muted mt-1 leading-relaxed">
                Dedicated high-throughput GPU cluster with instant cloth wrapping, photorealistic banarasi zari reflections, and priority queueing.
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Server Status</span>
                  <span className="font-bold text-emerald-600">99.98% Uptime</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Avg Draping Latency</span>
                  <span className="font-bold text-brandText">1.2 seconds</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Model Resolution</span>
                  <span className="font-bold text-brandText">4K Ultra HD</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRefill('Enterprise Booster')}
              className="mt-6 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider transition shadow"
            >
              Add Extra Credits
            </button>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brandText">
            Instant Credit Top-Up Packs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-stone-200 hover:border-gold transition shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-brandText">
                  Festive Rush Pack
                </h4>
                <div className="font-serif text-2xl font-black text-primary mt-2">
                  +2,500 <span className="text-xs font-sans text-stone-500">Credits</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Ideal for Diwali, Karwa Chauth & wedding season spikes.
                </p>
              </div>
              <button
                onClick={() => handleRefill('Festive Rush (2,500)')}
                className="mt-4 w-full py-2 bg-stone-100 hover:bg-gold hover:text-white text-stone-800 text-xs font-bold rounded-lg transition"
              >
                Refill 2,500 Credits
              </button>
            </div>

            <div className="p-5 rounded-xl bg-white border-2 border-gold shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gold text-primary font-extrabold text-[9px] uppercase tracking-wider">
                Popular
              </span>
              <div>
                <h4 className="font-serif text-base font-bold text-brandText">
                  Boutique Pro Pack
                </h4>
                <div className="font-serif text-2xl font-black text-primary mt-2">
                  +10,000 <span className="text-xs font-sans text-stone-500">Credits</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Full seasonal bridal campaign with zero slowdown.
                </p>
              </div>
              <button
                onClick={() => handleRefill('Boutique Pro (10,000)')}
                className="mt-4 w-full py-2 bg-gold hover:bg-gold-dark text-primary font-bold text-xs rounded-lg transition"
              >
                Refill 10,000 Credits
              </button>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 hover:border-gold transition shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-brandText">
                  Unlimited Annual
                </h4>
                <div className="font-serif text-2xl font-black text-primary mt-2">
                  Unlimited <span className="text-xs font-sans text-stone-500">Drapes</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Zero credit limits, dedicated custom AI models training.
                </p>
              </div>
              <button
                onClick={() => handleRefill('Unlimited Annual')}
                className="mt-4 w-full py-2 bg-stone-100 hover:bg-gold hover:text-white text-stone-800 text-xs font-bold rounded-lg transition"
              >
                Upgrade to Unlimited
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCredits;
