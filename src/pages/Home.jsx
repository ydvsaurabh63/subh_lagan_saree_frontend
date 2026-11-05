import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api.js';

import HeroBanner from '../components/home/HeroBanner.jsx';
import VirtualTryOn from '../components/home/VirtualTryOn.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import SpecialOfferBanner from '../components/home/SpecialOfferBanner.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import TestimonialSlider from '../components/home/TestimonialSlider.jsx';
import AboutBrandSection from '../components/home/AboutBrandSection.jsx';
import InstagramGallery from '../components/home/InstagramGallery.jsx';
import NewsletterSection from '../components/home/NewsletterSection.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { Sparkles, ArrowRight, HeartHandshake, Award } from 'lucide-react';
import { fallbackSarees } from '../data/fallbackProducts.js';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState(fallbackSarees.slice(0, 4));
  const [newArrivals, setNewArrivals] = useState(fallbackSarees.slice(4, 8));
  const [bridalCollection, setBridalCollection] = useState(fallbackSarees.filter(p => p.isBridal).slice(0, 4));
  const [silkCollection, setSilkCollection] = useState(fallbackSarees.slice(0, 4));
  const [trending, setTrending] = useState(fallbackSarees.slice(2, 6));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [catRes, allRes, bestRes, newRes, bridalRes, silkRes, trendRes] = await Promise.all([
          categoryApi.getCategories().catch(() => ({ success: false })),
          productApi.getProducts({ limit: 12 }).catch(() => ({ success: false })),
          productApi.getProducts({ isBestSeller: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ isNewArrival: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ isBridal: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ category: 'silk-sarees', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ sort: 'rating', limit: 4 }).catch(() => ({ success: false })),
        ]);

        if (catRes.success) setCategories(catRes.categories || []);

        const allProds = (allRes.success && allRes.products && allRes.products.length > 0)
          ? allRes.products
          : fallbackSarees;

        // Dynamically ensure each home shelf displays sarees from database (with fallback)
        setBestSellers(bestRes.success && bestRes.products?.length > 0 ? bestRes.products : allProds.slice(0, 4));
        setNewArrivals(newRes.success && newRes.products?.length > 0 ? newRes.products : allProds.slice(4, 8));
        setBridalCollection(bridalRes.success && bridalRes.products?.length > 0 ? bridalRes.products : allProds.filter(p => p.isBridal || p.price > 12000).slice(0, 4));
        setSilkCollection(silkRes.success && silkRes.products?.length > 0 ? silkRes.products : allProds.filter(p => p.fabric?.toLowerCase().includes('silk')).slice(0, 4));
        setTrending(trendRes.success && trendRes.products?.length > 0 ? trendRes.products : allProds.slice(0, 4));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. AI Virtual Saree Trial Room (Try-On Mirror) */}
      <VirtualTryOn />

      {/* 2. Shop By 12 Saree Categories (Visual Circular Grid) */}
      <CategoryGrid categories={categories} />

      {/* 3. Shop By Occasion */}
      <section className="pt-2 sm:pt-4 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Shop By Occasion
            </h2>
            <div className="w-14 h-0.5 bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Occasion 1: Wedding & Bridal */}
            <Link
              to="/shop?occasion=Bridal"
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=800&q=80"
                alt="Wedding & Bridal Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Occasion
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Wedding & Bridal
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Grand Heritage Silks & Zari
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Weaves <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Occasion 2: Festive Celebrations */}
            <Link
              to="/shop?occasion=Festive"
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Festive Celebrations Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Occasion
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Festive Celebrations
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Diwali, Karwa Chauth & Navratri
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Weaves <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Occasion 3: Party & Reception */}
            <Link
              to="/shop?occasion=Party%20Wear"
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt="Party & Reception Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Occasion
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Party & Reception
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Cocktail Drapes & Designer Organza
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Weaves <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Occasion 4: Traditional & Puja */}
            <Link
              to="/shop?occasion=Traditional"
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Traditional & Puja Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Occasion
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Traditional & Puja
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Auspicious Temple Borders & Silks
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Weaves <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Best Selling Sarees */}
      <section className="py-12 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Best Sellers
            </h2>
            <Link
              to="/shop?isBestSeller=true"
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section>

      {/* 5. Special Festive Offers Banner */}
      <SpecialOfferBanner />

      {/* 6. Heirloom Bridal Spotlight */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Bridal Sarees
            </h2>
            <Link
              to="/shop?isBridal=true"
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={bridalCollection} loading={loading} />
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="py-12 bg-cream/30 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              New Arrivals
            </h2>
            <Link
              to="/shop?isNewArrival=true"
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* 8. Pure Silk Sarees Showcase */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Silk Sarees
            </h2>
            <Link
              to="/shop?category=silk-sarees"
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={silkCollection} loading={loading} />
        </div>
      </section>

      {/* 9. Trending Masterpieces */}
      <section className="py-12 bg-cream/30 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Trending
            </h2>
            <Link
              to="/shop?sort=rating"
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={trending} loading={loading} />
        </div>
      </section>

      {/* 10. Why Choose Us (Icon Badges) */}
      <WhyChooseUs />

      {/* 11. Customer Testimonials (Bride Photos) */}
      <TestimonialSlider />

      {/* 12. About Brand Section (Visual Stats & Photo Collage) */}
      <AboutBrandSection />

      {/* 13. Instagram Gallery (Photo Grid) */}
      <InstagramGallery />

      {/* 14. Compact Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
