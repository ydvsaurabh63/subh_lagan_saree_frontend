import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const AboutBrandSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images Montage */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury border-2 border-gold/40">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                alt="Subh Lagan Sarees Artisan Heritage"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Small Floating Card */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-cream p-5 rounded-2xl shadow-xl border border-gold/50 max-w-[240px] hidden sm:block">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Since 1994</span>
              </div>
              <p className="text-xs text-stone-600">
                Crafting royal Indian heirloom bridal sarees for over three generations.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
              The Legacy of Weaving
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Honoring Sacred Traditions in Every Single Warp & Weft
            </h2>
            <div className="w-16 h-0.5 bg-gold"></div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              At <strong>Subh Lagan Sarees</strong>, we believe every saree is an auspicious blessing. Born in the sacred handloom clusters of Varanasi and the revered temples of Kanchipuram, our creations are woven with pure mulberry silk and electroplated zari that stand the test of time.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our direct association with over 350 hereditary master weavers ensures that each bridal trousseau drape supports generational artisan livelihoods while bringing you pure, unadulterated luxury.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-gold-dark transition"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrandSection;

