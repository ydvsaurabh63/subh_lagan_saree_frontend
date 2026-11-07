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
import { Sparkles, ArrowRight, HeartHandshake, Award, Store, ShieldCheck } from 'lucide-react';
import { getFallbackSareesForStore } from '../data/fallbackProducts.js';
import { useStore } from '../context/StoreContext.jsx';

const Home = () => {
  const { store, isBoutiqueStore } = useStore();
  const currentStoreSlug = store?.slug || 'subh-lagan';
  const initialFallback = getFallbackSareesForStore(currentStoreSlug);

  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState(initialFallback.slice(0, 4));
  const [newArrivals, setNewArrivals] = useState(initialFallback.slice(4, 8).length ? initialFallback.slice(4, 8) : initialFallback.slice(0, 4));
  const [bridalCollection, setBridalCollection] = useState(initialFallback.filter(p => p.isBridal).slice(0, 4));
  const [silkCollection, setSilkCollection] = useState(initialFallback.slice(0, 4));
  const [trending, setTrending] = useState(initialFallback.slice(2, 6).length ? initialFallback.slice(2, 6) : initialFallback.slice(0, 4));
  const [loading, setLoading] = useState(false);

  // Helper to keep links within boutique store if active
  const getStoreLink = (path) => {
    if (!isBoutiqueStore) return path;
    if (path.startsWith('/shop')) {
      return path.includes('?')
        ? `/store/${store.slug}/shop${path.substring(5)}`
        : `/store/${store.slug}/shop`;
    }
    return path;
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const activeSlug = store?.slug || 'subh-lagan';

        const [catRes, allRes, bestRes, newRes, bridalRes, silkRes, trendRes] = await Promise.all([
          categoryApi.getCategories().catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, limit: 12 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isBestSeller: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isNewArrival: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isBridal: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'silk-sarees', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, sort: 'rating', limit: 4 }).catch(() => ({ success: false })),
        ]);

        if (catRes.success) setCategories(catRes.categories || []);

        const fallback = getFallbackSareesForStore(activeSlug);

        const allProds = (allRes.success && allRes.products && allRes.products.length > 0)
          ? allRes.products
          : fallback;

        // Dynamically ensure each home shelf displays sarees from database (with fallback)
        setBestSellers(bestRes.success && bestRes.products?.length > 0 ? bestRes.products : allProds.slice(0, 4));
        setNewArrivals(newRes.success && newRes.products?.length > 0 ? newRes.products : (allProds.slice(4, 8).length ? allProds.slice(4, 8) : allProds.slice(0, 4)));
        setBridalCollection(bridalRes.success && bridalRes.products?.length > 0 ? bridalRes.products : (allProds.filter(p => p.isBridal || p.price > 12000).slice(0, 4)));
        setSilkCollection(silkRes.success && silkRes.products?.length > 0 ? silkRes.products : (allProds.filter(p => p.fabric?.toLowerCase().includes('silk')).slice(0, 4)));
        setTrending(trendRes.success && trendRes.products?.length > 0 ? trendRes.products : (allProds.slice(2, 6).length ? allProds.slice(2, 6) : allProds.slice(0, 4)));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [store?.slug]);

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
              to={getStoreLink('/shop?occasion=Bridal')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Wedding & Bridal Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition-colors">
                  Wedding & Bridal
                </h3>
              </div>
            </Link>

            {/* Occasion 2: Festive Celebrations */}
            <Link
              to={getStoreLink('/shop?occasion=Festive')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Festive Celebrations Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition-colors">
                  Festive Celebrations
                </h3>
              </div>
            </Link>

            {/* Occasion 3: Party & Reception */}
            <Link
              to={getStoreLink('/shop?occasion=Party%20Wear')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt="Party & Reception Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition-colors">
                  Party & Reception
                </h3>
              </div>
            </Link>

            {/* Occasion 4: Traditional & Puja */}
            <Link
              to={getStoreLink('/shop?occasion=Traditional')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Traditional & Puja Sarees"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition-colors">
                  Traditional & Puja
                </h3>
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
              to={getStoreLink('/shop?isBestSeller=true')}
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

      {/* 6. Featured Brands */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Featured Brands
            </h2>
            <Link
              to={getStoreLink('/shop')}
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Brand 1: Boutique Signature or Subh Lagan Privé */}
            <Link
              to={getStoreLink('/shop?isBridal=true')}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex flex-col justify-between p-5 bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80"
                alt={isBoutiqueStore ? `${store.name} Signature` : 'Subh Lagan Privé'}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Haute Couture
                </span>
              </div>

              <div className="relative z-10 text-white w-full">
                <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-2 backdrop-blur-sm group-hover:bg-gold group-hover:text-stone-950 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition">
                  {isBoutiqueStore ? `${store.name} Signature` : 'Subh Lagan Privé'}
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Couture Bridal & Master Zari
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
                  Explore Brand <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Brand 2: Varanasi Silk Guild */}
            <Link
              to={getStoreLink('/shop?category=banarasi-sarees')}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex flex-col justify-between p-5 bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                alt="Varanasi Silk Guild"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Silk Mark
                </span>
              </div>

              <div className="relative z-10 text-white w-full">
                <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-2 backdrop-blur-sm group-hover:bg-gold group-hover:text-stone-950 transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition">
                  Varanasi Silk Guild
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Pure Katan Silk & Kadhwa
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
                  Explore Brand <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Brand 3: Kanchi Royal Weavers */}
            <Link
              to="/shop?category=kanjivaram-sarees"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex flex-col justify-between p-5 bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
                alt="Kanchi Royal Weavers"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Heirloom
                </span>
              </div>

              <div className="relative z-10 text-white w-full">
                <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-2 backdrop-blur-sm group-hover:bg-gold group-hover:text-stone-950 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition">
                  Kanchi Royal Weavers
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Gold Zari Korvai Handloom
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
                  Explore Brand <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Brand 4: Avadh Brocades */}
            <Link
              to="/shop?category=organza-sarees"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex flex-col justify-between p-5 bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80"
                alt="Avadh Brocades"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Artisan Collective
                </span>
              </div>

              <div className="relative z-10 text-white w-full">
                <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-2 backdrop-blur-sm group-hover:bg-gold group-hover:text-stone-950 transition-colors">
                  <Store className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition">
                  Avadh Brocades
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Royal Organza & Tissue Silks
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
                  Explore Brand <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>
          </div>
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
              to={getStoreLink('/shop?isNewArrival=true')}
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* 8. Shop By Fabric */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Shop By Fabric
            </h2>
            <Link
              to={getStoreLink('/shop')}
              className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold-dark transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Fabric 1: Pure Katan Silk */}
            <Link
              to={getStoreLink('/shop?fabric=Pure%20Katan%20Silk')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Pure Katan Silk"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Hand-Spun
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Pure Katan Silk
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Traditional Banarasi Kadhwa & Brocade
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Fabric <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Fabric 2: Kanchipuram Silk */}
            <Link
              to={getStoreLink('/shop?fabric=Pure%20Kanchipuram%20Silk')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Pure Kanchipuram Silk"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Mulberry Silk
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Kanchipuram Silk
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Pure Temple Korvai & Gold Zari
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Fabric <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Fabric 3: Pure Organza Silk */}
            <Link
              to={getStoreLink('/shop?fabric=Pure%20Organza%20Silk')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
                alt="Pure Organza Silk"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Featherlight
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Pure Organza Silk
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Sheer Drapes & Modern Elegance
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Fabric <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>

            {/* Fabric 4: Viscose Georgette */}
            <Link
              to={getStoreLink('/shop?fabric=Viscose%20Georgette')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
            >
              <img
                src="https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=800&q=80"
                alt="Viscose Georgette"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
              <div className="relative z-10 text-white w-full">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Flowing & Graceful
                </span>
                <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                  Viscose Georgette
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  Effortless Fall & Embellished Borders
                </p>
                <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                  Explore Fabric <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>
          </div>
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
              to={getStoreLink('/shop?sort=rating')}
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
