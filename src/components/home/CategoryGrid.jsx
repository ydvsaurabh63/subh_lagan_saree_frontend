import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="py-16 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            Artisanal Heritage Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary mt-2">
            Shop By Saree Categories
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3 mb-3"></div>
          <p className="text-xs sm:text-sm text-stone-600">
            Explore 12 signature Indian weaves crafted by master artisans across Banaras, Kanchipuram, Chanderi, and Jaipur.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-gold shadow-sm hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Circle */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-gold/30 group-hover:border-gold transition-colors p-0.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-xs sm:text-sm font-bold text-brandText group-hover:text-primary transition line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                {cat.description}
              </p>

              {/* Link indicator */}
              <span className="inline-flex items-center text-[10px] font-semibold text-gold-dark mt-2 group-hover:text-primary transition">
                <span>Explore</span>
                <ArrowRight className="w-2.5 h-2.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

