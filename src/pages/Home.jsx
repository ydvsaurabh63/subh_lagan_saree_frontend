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
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Sparkles, ArrowRight } from 'lucide-react';

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
        // Fetch categories
        const catRes = await categoryApi.getCategories();
        if (catRes.success) setCategories(catRes.categories || []);

        // Fetch products by curated filters
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
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Shop By Categories (12 Categories) */}
      <CategoryGrid categories={categories} />

      {/* 3. Best Selling Sarees */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
                Most Cherished Drapes
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                Best Selling Sarees
              </h2>
            </div>
            <Link
              to="/shop?isBestSeller=true"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section>

      {/* 4. Bridal Collection Spotlight */}
      <section className="py-16 bg-cream/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-1 text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>The Subh Lagan Trousseau</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                Heirloom Bridal Collection
              </h2>
            </div>
            <Link
              to="/shop?isBridal=true"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>Explore Bridal Sarees</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={bridalCollection} loading={loading} />
        </div>
      </section>

      {/* 5. Special Festive Offers Banner */}
      <SpecialOfferBanner />

      {/* 6. New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
                Fresh From The Looms
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?isNewArrival=true"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* 7. Silk Sarees Collection Showcase */}
      <section className="py-16 bg-cream/40 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
                Pure Mulberry & Tussar
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                Royal Silk Sarees Collection
              </h2>
            </div>
            <Link
              to="/shop?category=silk-sarees"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>Explore Pure Silks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={silkCollection} loading={loading} />
        </div>
      </section>

      {/* 8. Trending Products */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
                Celebrated by Connoisseurs
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                Trending Saree Masterpieces
              </h2>
            </div>
            <Link
              to="/shop?sort=rating"
              className="mt-3 md:mt-0 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>Explore All Trending</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={trending} loading={loading} />
        </div>
      </section>

      {/* 9. Why Choose Us (Pillars) */}
      <WhyChooseUs />

      {/* 10. Customer Testimonials */}
      <TestimonialSlider />

      {/* 11. About Brand Section */}
      <AboutBrandSection />

      {/* 12. Instagram Gallery */}
      <InstagramGallery />

      {/* 13. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default Home;

