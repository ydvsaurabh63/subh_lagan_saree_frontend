import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="py-12 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
            Curated Weaves
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
            Shop By Saree Categories
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2"></div>
        </div>

        {/* Categories Grid (Visual focus) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-gold shadow-sm hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              {/* Category Circle Image with Gold Border */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 border-2 border-gold/30 group-hover:border-gold transition-colors p-0.5 shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title only - clean & punchy */}
              <h3 className="font-serif text-xs sm:text-sm font-bold text-brandText group-hover:text-primary transition line-clamp-1">
                {cat.name}
              </h3>

              {/* Small Visual Pill */}
              <span className="inline-flex items-center text-[10px] font-semibold text-gold-dark mt-1 group-hover:text-primary transition">
                <span>View</span>
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
