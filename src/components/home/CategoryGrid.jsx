import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Reliable fallback imagery for every category to avoid broken images
const categoryFallbacks = {
  'banarasi-sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'bridal-sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'chiffon-sarees': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
  'cotton-sarees': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
  'designer-sarees': 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=400&q=80',
  'georgette-sarees': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
  'kanjivaram-sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
  'organza-sarees': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
  'party-wear-sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'printed-sarees': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
  'silk-sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
  'wedding-sarees': 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=400&q=80',
};

const CategoryGrid = ({ categories = [] }) => {
  const scrollRef = useRef(null);

  // If no categories from API, provide defaults
  const displayList = categories.length > 0 ? categories : Object.keys(categoryFallbacks).map((slug) => ({
    slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    image: categoryFallbacks[slug],
  }));

  // Duplicate items for continuous seamless loop
  const loopItems = [...displayList, ...displayList];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 bg-cream/50 overflow-hidden select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="text-center sm:text-left">
            <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
              Curated Weaves
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
              Shop By Saree Categories
            </h2>
            <div className="w-12 h-0.5 bg-gold mt-1.5 mx-auto sm:mx-0"></div>
          </div>

          {/* Quick Manual Navigation Controls */}
          <div className="hidden sm:flex items-center space-x-2 mt-3 sm:mt-0">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-primary hover:border-gold shadow-sm transition active:scale-95"
              title="Previous Categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-primary hover:border-gold shadow-sm transition active:scale-95"
              title="Next Categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 
          SINGLE LINE CONTINUOUS MOVING TRACK (RIGHT TO LEFT)
        */}
        <div className="relative group/track">
          {/* Edge Fade Gradients for Luxury Aesthetic */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-cream/90 via-cream/50 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-cream/90 via-cream/50 to-transparent z-10"></div>

          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            <div className="animate-marquee-left flex space-x-3 sm:space-x-4">
              {loopItems.map((cat, index) => {
                const fallbackImg = categoryFallbacks[cat.slug] || '/models/model-1.png';
                const imgSrc = cat.image || fallbackImg;

                return (
                  <Link
                    key={`${cat._id || cat.slug}-${index}`}
                    to={`/shop?category=${cat.slug}`}
                    className="w-40 sm:w-44 flex-shrink-0 group flex flex-col items-center p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-gold shadow-sm hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    {/* Category Circle Image with Gold Accent Border */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden mb-2.5 border-2 border-gold/30 group-hover:border-gold transition-colors p-0.5 shadow-sm bg-stone-100 flex items-center justify-center">
                      <img
                        src={imgSrc}
                        alt={cat.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImg;
                        }}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Category Title */}
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-brandText group-hover:text-primary transition line-clamp-1 w-full">
                      {cat.name}
                    </h3>

                    {/* Small Visual Action Pill */}
                    <span className="inline-flex items-center text-[10px] font-semibold text-gold-dark mt-1 group-hover:text-primary transition">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
