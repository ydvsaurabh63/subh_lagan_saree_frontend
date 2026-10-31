import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { Sparkles, Award, Heart, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'About Subh Lagan Sarees' }]} />

        {/* Hero Section */}
        <div className="text-center py-12 max-w-3xl mx-auto space-y-4">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            Our Royal Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-primary">
            Weaving Sacred Moments & Eternal Elegance
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Founded with a vision to preserve and elevate India’s priceless textile heritage, Subh Lagan Sarees is a celebration of bridal majesty, handloom purity, and generational craftsmanship.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-12 bg-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-luxury">
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-primary">
              From the Ancient Looms of Varanasi to Your Auspicious Day
            </h2>
            <p>
              "Subh Lagan" translates to an auspicious timing—a celestial moment when lives merge in holy celebration. For more than three decades, our family-owned brand has had the honor of adorning thousands of brides across India and the globe.
            </p>
            <p>
              Every saree in our boutique is individually handwoven on traditional pit looms. From pure Katan and Kanchipuram silk to featherlight organza and fluid georgettes, each piece takes between 14 to 90 days to create. We use real gold electroplated zari and silk-mark certified yarns, guaranteeing heirloom treasures that mothers pass down to daughters.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gold/40 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan weaving a Banarasi saree"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 text-center">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">Silk Mark Certified</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We pledge 100% pure silk authenticity with no polyester blends, upholding the utmost sacred integrity for weddings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">350+ Master Weavers</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Supporting sustainable artisan livelihoods in traditional weaving clusters across Varanasi, Kanchipuram, and Chanderi.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">Direct to Connoisseur</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              By removing traditional middlemen, we deliver bespoke royal bridal sarees with transparent, honest pricing and Cash on Delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

