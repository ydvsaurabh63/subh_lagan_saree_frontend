import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Users, HeartHandshake, Scissors } from 'lucide-react';

const stats = [
  { icon: Award, label: '30+ Years', desc: 'Family Heritage' },
  { icon: Scissors, label: '350+', desc: 'Master Weavers' },
  { icon: HeartHandshake, label: '50,000+', desc: 'Happy Brides' },
  { icon: Sparkles, label: '100%', desc: 'Silk Mark Certified' },
];

const AboutBrandSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Visual 3-Image Collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-gold/40">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"
                  alt="Banarasi Handloom Weaving"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80"
                  alt="Temple Zari Border"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=700&q=80"
                  alt="Bridal Saree Detail"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-gold/40">
                <img
                  src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80"
                  alt="Pure Paithani Drape"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>

          {/* Text & Visual Metrics */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary leading-tight">
                Heritage Since 1994
              </h2>
              <div className="w-12 h-0.5 bg-gold mt-2 mb-3"></div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Centuries of pure silk artistry directly to your doorstep with Cash on Delivery.
              </p>
            </div>

            {/* 4 Visual Metric Cards with Icons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-cream/70 border border-gold/30 flex items-center space-x-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-bold text-primary">{s.label}</p>
                      <p className="text-[11px] text-stone-500 font-medium">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition"
              >
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrandSection;
