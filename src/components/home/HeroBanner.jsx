import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const slides = [
  {
    tag: 'THE ROYAL HERITAGE COLLECTION',
    title: 'Auspicious Elegance for the Eternal Indian Bride',
    subtitle: 'Handcrafted Banarasi and Kanjivaram masterpieces woven with authentic gold zari threads.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'Explore Bridal Sarees',
    ctaLink: '/shop?category=bridal-sarees',
    secondaryCta: 'View Silk Collection',
    secondaryLink: '/shop?category=silk-sarees',
  },
  {
    tag: 'TEMPLE ARTISANAL WEAVES',
    title: 'Pure Kanjivaram Silks of Supreme Luster',
    subtitle: 'Heirloom Korvai borders, peacock motifs, and rich festive drapes crafted in Tamil Nadu.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'Discover Kanjivaram',
    ctaLink: '/shop?category=kanjivaram-sarees',
    secondaryCta: 'Shop All Sarees',
    secondaryLink: '/shop',
  },
  {
    tag: 'FESTIVE COUTURE 2026',
    title: 'Organza, Georgette & Modern Designer Drapes',
    subtitle: 'Weightless silhouettes accented with Lucknowi chikankari, cutdana, and shimmering scallop borders.',
    image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1800&q=85',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/shop?isNewArrival=true',
    secondaryCta: 'Explore Best Sellers',
    secondaryLink: '/shop?isBestSeller=true',
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-[500px] lg:min-h-[620px] bg-secondary-dark overflow-hidden flex items-center">
      {/* Background Images with Crossfade */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === idx ? 'opacity-55' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-top filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary-dark/70 to-transparent"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            <span>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
            {slide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-gold hover:bg-gold-light text-secondary-dark font-semibold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={slide.secondaryLink}
              className="inline-flex items-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-widest rounded-lg backdrop-blur-sm border border-white/20 hover:border-gold transition-all"
            >
              {slide.secondaryCta}
            </Link>
          </div>

          {/* Cash on delivery notice */}
          <div className="pt-4 flex items-center space-x-2 text-xs text-gold-light/90">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Cash On Delivery (COD) Available Pan-India • Free Shipping Above ₹1,999</span>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 lg:right-12 z-20 flex space-x-2">
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

