import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: 'Ananya Mehra',
    city: 'New Delhi',
    saree: 'Royal Crimson Banarasi',
    quote: 'The kadhwa zari work is breathtaking! Looked so majestic.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Divya Venkatesh',
    city: 'Chennai',
    saree: 'Maharani Emerald Kanjivaram',
    quote: 'Authentic Korvai border and rich zari. Fast Cash on Delivery.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Radhika Singhania',
    city: 'Jaipur',
    saree: 'Blush Rose Organza',
    quote: 'Delicate scallop border. Received so many compliments!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Customer Reviews
        </h2>
        <div className="w-12 h-0.5 bg-gold mx-auto mt-2 mb-6"></div>

        <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-gold/30">
          {/* Avatar & Verified Badge */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold mb-2 shadow"
            />
            <div className="flex items-center space-x-1 text-emerald-700 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Bride</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center text-amber-500 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <p className="font-serif italic text-base sm:text-lg text-brandText leading-relaxed mb-4">
            "{t.quote}"
          </p>

          <h4 className="font-serif text-sm font-bold text-primary">{t.name}</h4>
          <p className="text-[11px] text-stone-500">{t.city} • {t.saree}</p>

          {/* Controls */}
          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={prev}
              className="p-1.5 rounded-full border border-stone-200 hover:border-gold hover:bg-cream text-stone-600 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="p-1.5 rounded-full border border-stone-200 hover:border-gold hover:bg-cream text-stone-600 transition"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
