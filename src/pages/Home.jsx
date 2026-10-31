import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api.js';

import HeroBanner from '../components/home/HeroBanner.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import SpecialOfferBanner from '../components/home/SpecialOfferBanner.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import TestimonialSlider from '../components/home/TestimonialSlider.jsx';
import AboutBrandSection from '../components/home/AboutBrandSection.jsx';
import InstagramGallery from '../components/home/InstagramGallery.jsx';
import NewsletterSection from '../components/home/NewsletterSection.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { Sparkles, ArrowRight, HeartHandshake, Award } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bridalCollection, setBridalCollection] = useState([]);
  const [silkCollection, setSilkCollection] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const catRes = await categoryApi.getCategories();
        if (catRes.success) setCategories(catRes.categories || []);

        const [bestRes, newRes, bridalRes, silkRes, trendRes] = await Promise.all([
          productApi.getProducts({ isBestSeller: 'true', limit: 4 }),
          productApi.getProducts({ isNewArrival: 'true', limit: 4 }),
          productApi.getProducts({ isBridal: 'true', limit: 4 }),
          productApi.getProducts({ category: 'silk-sarees', limit: 4 }),
          productApi.getProducts({ sort: 'rating', limit: 4 }),
        ]);

        if (bestRes.success) setBestSellers(bestRes.products || []);
        if (newRes.success) setNewArrivals(newRes.products || []);
        if (bridalRes.success) setBridalCollection(bridalRes.products || []);
        if (silkRes.success) setSilkCollection(silkRes.products || []);
        if (trendRes.success) setTrending(trendRes.products || []);
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

      {/* 2. Shop By 12 Saree Categories (Visual Circular Grid) */}
      <CategoryGrid categories={categories} />

      {/* 3. Visual Curated Edits Lookbook */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1 */}
            <Link
              to="/shop?isBridal=true"
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-gold/30 flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=800&q=80"
                alt="Bridal Trousseau"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
              <div className="relative z-10 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Curated Edit</span>
                <h3 className="font-serif text-xl font-bold">Bridal Trousseau</h3>
                <span className="inline-flex items-center text-xs text-stone-200 mt-1 font-medium group-hover:text-gold transition">
                  Shop Edit <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Box 2 */}
            <Link
              to="/shop?category=banarasi-sarees"
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-gold/30 flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Royal Banarasi"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
              <div className="relative z-10 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Heritage Weave</span>
                <h3 className="font-serif text-xl font-bold">Royal Banarasi Silks</h3>
                <span className="inline-flex items-center text-xs text-stone-200 mt-1 font-medium group-hover:text-gold transition">
                  Shop Edit <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Box 3 */}
            <Link
              to="/shop?category=kanjivaram-sarees"
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-gold/30 flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Kanjivaram Temple Weaves"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
              <div className="relative z-10 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Temple Zari</span>
                <h3 className="font-serif text-xl font-bold">Pure Kanjivaram</h3>
                <span className="inline-flex items-center text-xs text-stone-200 mt-1 font-medium group-hover:text-gold transition">
                  Shop Edit <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
            <div>
              <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
                Most Cherished
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                Best Selling Sarees
              </h2>
            </div>
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
            <div>
              <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
                Bridal Trousseau
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                Bridal & Wedding Collection
              </h2>
            </div>
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
            <div>
              <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
                Fresh From Looms
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                New Arrivals
              </h2>
            </div>
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
            <div>
              <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
                Pure Mulberry & Tussar
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                Silk Sarees Collection
              </h2>
            </div>
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
            <div>
              <span className="text-gold-dark text-[11px] uppercase tracking-[0.25em] font-bold">
                Highest Rated
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                Trending Sarees
              </h2>
            </div>
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
