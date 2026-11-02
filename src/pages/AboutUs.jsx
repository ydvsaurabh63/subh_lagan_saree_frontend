import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { Sparkles, Award, Heart, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'About Subh Lagan Sarees' }]} />

        {/* Hero Section */}
        <div className="text-center py-10 max-w-2xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
            Our Heritage
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Celebrating bridal elegance, handloom purity, and generational craftsmanship since 1994.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-8 bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-luxury">
          <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
              Varanasi to Your Auspicious Day
            </h2>
            <p>
              "Subh Lagan" translates to an auspicious timing—a celestial moment of sacred celebration. For over three decades, we have adorned brides across India with authentic handwoven sarees.
            </p>
            <p>
              Every saree is individually handwoven on traditional looms with silk-mark certified yarns and real zari, crafted to last for generations.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-10 text-center">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Award className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">Silk Mark Certified</h3>
            <p className="text-xs text-stone-600">
              100% pure silk authenticity with no polyester blends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">350+ Master Weavers</h3>
            <p className="text-xs text-stone-600">
              Direct partnership with artisan clusters across Varanasi and Kanchipuram.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">Direct to Doorstep</h3>
            <p className="text-xs text-stone-600">
              Transparent pricing with safe Cash on Delivery pan-India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

