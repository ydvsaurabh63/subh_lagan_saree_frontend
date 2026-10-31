import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Feather, Truck, Award } from 'lucide-react';

const slides = [
  {
    tag: 'ROYAL HERITAGE 2026',
    title: 'Auspicious Bridal & Heirloom Sarees',
    subtitle: 'Handcrafted Banarasi and Kanjivaram drapes in pure silk & gold zari.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'Shop Bridal',
    ctaLink: '/shop?category=bridal-sarees',
    secondaryCta: 'View Silks',
    secondaryLink: '/shop?category=silk-sarees',
  },
  {
    tag: 'TEMPLE KORVAI WEAVES',
    title: 'Pure Kanjivaram Silk Masterpieces',
    subtitle: 'Woven with certified gold zari and rich festive temple borders.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'Shop Kanjivaram',
    ctaLink: '/shop?category=kanjivaram-sarees',
    secondaryCta: 'All Sarees',
    secondaryLink: '/shop',
  },
  {
    tag: 'FESTIVE DESIGNER WEAVES',
    title: 'Organza & Chikankari Georgette',
    subtitle: 'Weightless festive silhouettes with delicate scallop border craft.',
    image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'New Arrivals',
    ctaLink: '/shop?isNewArrival=true',
    secondaryCta: 'Best Sellers',
    secondaryLink: '/shop?isBestSeller=true',
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-[480px] lg:min-h-[580px] bg-secondary-dark overflow-hidden flex items-center">
      {/* Background Images */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === idx ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-top filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary-dark/65 to-transparent"></div>
        </div>
      ))}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 w-full">
        <div className="max-w-xl space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-[11px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            {slide.title}
          </h1>

          {/* Short subtitle */}
          <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center space-x-2 px-5 py-3 bg-gold hover:bg-gold-light text-secondary-dark font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition transform hover:-translate-y-0.5"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={slide.secondaryLink}
              className="inline-flex items-center px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-lg backdrop-blur-sm border border-white/25 hover:border-gold transition"
            >
              {slide.secondaryCta}
            </Link>
          </div>

          {/* Visual Icon Badges */}
          <div className="pt-4 grid grid-cols-3 gap-2 border-t border-white/15">
            <div className="flex items-center space-x-1.5 text-white text-[11px]">
              <Award className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Silk Mark</span>
            </div>
            <div className="flex items-center space-x-1.5 text-white text-[11px]">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center space-x-1.5 text-white text-[11px]">
              <Truck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Free Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 right-6 z-20 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
