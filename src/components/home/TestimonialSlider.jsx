import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ananya Mehra',
    city: 'New Delhi',
    saree: 'Royal Crimson Banarasi Katan Silk Saree',
    quote: 'My wedding bridal saree from Subh Lagan was the centerpiece of my special day. The kadhwa zari work is truly regal, and the fabric drape was light yet looked so grand in all our photographs!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Divya Venkatesh',
    city: 'Chennai',
    saree: 'Maharani Emerald Gold Kanjivaram Silk Saree',
    quote: 'As someone who appreciates authentic Korvai weaving, I was blown away by the richness of the temple borders. The delivery was fast with Cash on Delivery, and the saree came packed like royal treasure.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Radhika Singhania',
    city: 'Jaipur',
    saree: 'Blush Rose French Organza Saree',
    quote: 'I wore the blush organza saree for my sister sangeet. The hand-painted florals and scallop border got me so many compliments. Subh Lagan Sarees has earned a lifetime customer in me!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
          Words of Love
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary mt-2">
          Bridal Testimonials
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-3 mb-10"></div>

        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-luxury border border-gold/30">
          <Quote className="w-10 h-10 text-gold/30 mx-auto mb-4" />

          {/* Stars */}
          <div className="flex justify-center text-amber-500 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <p className="font-serif italic text-base sm:text-xl text-brandText leading-relaxed mb-8">
            "{t.quote}"
          </p>

          <div className="flex flex-col items-center">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gold mb-2 shadow"
            />
            <h4 className="font-serif text-base font-bold text-primary">{t.name}</h4>
            <p className="text-xs text-stone-500">{t.city} • Purchased {t.saree}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-stone-200 hover:border-gold hover:bg-cream text-stone-600 transition"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full border border-stone-200 hover:border-gold hover:bg-cream text-stone-600 transition"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;

