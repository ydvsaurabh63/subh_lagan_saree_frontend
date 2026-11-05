import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, Tag, Clock } from 'lucide-react';

const SpecialOfferBanner = () => {
  return (
    <section className="py-10 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary shadow-xl border border-gold/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="p-8 sm:p-12 space-y-4 z-10 text-white">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider border border-white/30">
                <Gift className="w-3.5 h-3.5 text-white" />
                <span>Festive Offer</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
                Flat <span className="text-amber-200">30% Off</span> Bridal
              </h3>

              <p className="text-xs sm:text-sm text-stone-100 leading-relaxed max-w-md">
                Handcrafted wedding & festive silks.
              </p>

              {/* Promo Code Pill & CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center space-x-2 bg-black/40 px-3.5 py-2 rounded-lg border border-white/20 text-xs">
                  <Tag className="w-3.5 h-3.5 text-white" />
                  <span className="text-stone-200">Code:</span>
                  <span className="font-bold text-white tracking-widest">SUBHLAGAN30</span>
                </div>

                <Link
                  to="/shop?isBridal=true"
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition"
                >
                  <span>Shop</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-60 lg:h-full min-h-[260px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="Bridal Saree Special Offer"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOfferBanner;
