import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

const SpecialOfferBanner = () => {
  return (
    <section className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary shadow-xl border border-gold/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-16 space-y-6 z-10 text-white">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-semibold uppercase tracking-wider border border-gold/30">
                <Gift className="w-3.5 h-3.5 text-gold" />
                <span>Special Festive Celebration Offer</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Up to <span className="text-gold">30% Off</span> On Pure Bridal & Heirloom Sarees
              </h3>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-lg">
                Celebrate your auspicious occasions with hand-embellished zardozi drapes, genuine silver-dipped brocade, and authentic Banarasi silks crafted for generations to cherish.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop?isBridal=true"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gold hover:bg-gold-light text-secondary-dark text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition transform hover:-translate-y-0.5"
                >
                  <span>Shop Bridal Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-xs text-gold-light font-medium bg-black/30 px-3.5 py-2.5 rounded-lg border border-gold/30">
                  Use Code: <span className="font-bold text-white tracking-wider">SUBHLAGAN30</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-64 lg:h-full min-h-[300px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=85"
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

