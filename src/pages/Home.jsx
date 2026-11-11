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
  const [occasionProducts, setOccasionProducts] = useState([]);
  const [brandProducts, setBrandProducts] = useState([]);
  const [fabricProducts, setFabricProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dynamic Showcases configured from Client Dashboard / Products
  const defaultOccasions = [
    {
      title: 'Wedding & Bridal',
      occasionTag: 'Bridal',
      link: '/shop?occasion=Bridal',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Festive Celebrations',
      occasionTag: 'Festive',
      link: '/shop?occasion=Festive',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Party & Reception',
      occasionTag: 'Party Wear',
      link: '/shop?occasion=Party%20Wear',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Traditional & Puja',
      occasionTag: 'Traditional',
      link: '/shop?occasion=Traditional',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const dynamicOccasions = defaultOccasions.map((def, idx) => {
    const custom = store?.homeBanners?.shopByOccasion?.[idx];
    const prodMatch = occasionProducts[idx];
    return {
      ...def,
      title: custom?.title || prodMatch?.name || def.title,
      image: prodMatch?.images?.[0] || custom?.image || custom?.imageUrl || def.image,
      link: prodMatch ? `/product/${prodMatch.slug}` : custom?.link || def.link,
    };
  });

  const defaultBrands = [
    {
      name: isBoutiqueStore ? `${store.name} Signature` : 'Subh Lagan Privé',
      subtitle: 'Couture Bridal & Master Zari',
      badge: 'Haute Couture',
      link: '/shop?isBridal=true',
      image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80',
      icon: Sparkles,
    },
    {
      name: 'Varanasi Silk Guild',
      subtitle: 'Pure Katan Silk & Kadhwa',
      badge: 'Silk Mark',
      link: '/shop?category=banarasi',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      icon: Award,
    },
    {
      name: 'Kanchi Royal Weavers',
      subtitle: 'Gold Zari Korvai Handloom',
      badge: 'Heirloom',
      link: '/shop?category=kanjivaram',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      icon: ShieldCheck,
    },
    {
      name: 'Avadh Brocades',
      subtitle: 'Royal Organza & Tissue Silks',
      badge: 'Artisan Collective',
      link: '/shop?category=pure-silk',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
      icon: Store,
    },
  ];

  const dynamicBrands = defaultBrands.map((def, idx) => {
    const custom = store?.homeBanners?.featuredBrands?.[idx];
    const prodMatch = brandProducts[idx];
    return {
      ...def,
      name: custom?.name || prodMatch?.name || def.name,
      subtitle: custom?.subtitle || def.subtitle,
      badge: custom?.badge || def.badge,
      image: prodMatch?.images?.[0] || custom?.image || custom?.imageUrl || def.image,
      link: prodMatch ? `/product/${prodMatch.slug}` : custom?.link || def.link,
    };
  });

  const defaultFabrics = [
    {
      name: 'Pure Katan Silk',
      desc: 'Traditional Banarasi Kadhwa & Brocade',
      badge: 'Hand-Spun',
      link: '/shop?fabric=Pure%20Katan%20Silk',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kanchipuram Silk',
      desc: 'Pure Temple Korvai & Gold Zari',
      badge: 'Mulberry Silk',
      link: '/shop?fabric=Pure%20Kanchipuram%20Silk',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Pure Organza Silk',
      desc: 'Featherlight Drapes & Sheer Grace',
      badge: 'Featherlight',
      link: '/shop?fabric=Pure%20Organza%20Silk',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Viscose Georgette',
      desc: 'Effortless Fall & Embellished Borders',
      badge: 'Flowing & Graceful',
      link: '/shop?fabric=Viscose%20Georgette',
      image: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const dynamicFabrics = defaultFabrics.map((def, idx) => {
    const custom = store?.homeBanners?.shopByFabric?.[idx];
    const prodMatch = fabricProducts[idx];
    return {
      ...def,
      name: custom?.name || prodMatch?.name || def.name,
      desc: custom?.desc || def.desc,
      badge: custom?.badge || def.badge,
      image: prodMatch?.images?.[0] || custom?.image || custom?.imageUrl || def.image,
      link: prodMatch ? `/product/${prodMatch.slug}` : custom?.link || def.link,
    };
  });

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

        const [
          catRes,
          allRes,
          bestRes,
          bestCatRes,
          newRes,
          newCatRes,
          bridalRes,
          bridalCatRes,
          silkRes,
          trendRes,
          trendCatRes,
          occasionRes,
          brandRes,
          fabricRes,
        ] = await Promise.all([
          categoryApi.getCategories().catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, limit: 12 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isBestSeller: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'best-sellers', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isNewArrival: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'new-arrival', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, isBridal: 'true', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'bridal-couture', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'pure-silk', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, sort: 'rating', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'trending', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'shop-by-occasion', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'featured-brands', limit: 4 }).catch(() => ({ success: false })),
          productApi.getProducts({ store: activeSlug, category: 'shop-by-fabric', limit: 4 }).catch(() => ({ success: false })),
        ]);

        const fallback = getFallbackSareesForStore(activeSlug);

        const allProds = (allRes.success && allRes.products && allRes.products.length > 0)
          ? allRes.products
          : fallback;

        // Enrich categories with live uploaded product images from database
        if (catRes.success && Array.isArray(catRes.categories)) {
          const enriched = catRes.categories.map((cat) => {
            const prodMatch = allProds.find((p) => {
              const pCatId = p.category?._id || p.category;
              return (pCatId && pCatId.toString() === cat._id?.toString()) || p.category?.slug === cat.slug;
            });
            return {
              ...cat,
              image: prodMatch?.images?.[0] || cat.image,
            };
          });
          setCategories(enriched);
        }

        // Helper to combine products tagged by category or boolean flag
        const combine = (catList, flagList, fallbackSlice) => {
          const list = [];
          const seen = new Set();
          const add = (p) => {
            if (p && p._id && !seen.has(p._id.toString())) {
              seen.add(p._id.toString());
              list.push(p);
            }
          };
          (catList?.products || []).forEach(add);
          (flagList?.products || []).forEach(add);
          return list.length > 0 ? list.slice(0, 4) : fallbackSlice;
        };

        // Dynamically ensure each home shelf displays sarees from database (with fallback)
        setBestSellers(combine(bestCatRes, bestRes, allProds.slice(0, 4)));
        setNewArrivals(combine(newCatRes, newRes, allProds.slice(4, 8).length ? allProds.slice(4, 8) : allProds.slice(0, 4)));
        setBridalCollection(combine(bridalCatRes, bridalRes, allProds.filter(p => p.isBridal || p.price > 12000).slice(0, 4)));
        setSilkCollection(silkRes.success && silkRes.products?.length > 0 ? silkRes.products : (allProds.filter(p => p.fabric?.toLowerCase().includes('silk')).slice(0, 4)));
        setTrending(combine(trendCatRes, trendRes, allProds.slice(2, 6).length ? allProds.slice(2, 6) : allProds.slice(0, 4)));

        // Live Showcase sections (Shop by Occasion, Featured Brands, Shop by Fabric)
        if (occasionRes.success && occasionRes.products?.length > 0) {
          setOccasionProducts(occasionRes.products);
        }
        if (brandRes.success && brandRes.products?.length > 0) {
          setBrandProducts(brandRes.products);
        }
        if (fabricRes.success && fabricRes.products?.length > 0) {
          setFabricProducts(fabricRes.products);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [store?.slug]);

  return (
    <div className="space-y-0 bg-[#FAF7F2] min-h-screen">
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. AI Virtual Saree Trial Room (Try-On Mirror) */}
      <VirtualTryOn />

      {/* 2. Shop By 12 Saree Categories (Visual Circular Grid) */}
      <CategoryGrid categories={categories} />

      {/* 3. Shop By Occasion */}
      <section className="pt-2 sm:pt-4 pb-10 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Shop By Occasion
            </h2>
            <div className="w-14 h-0.5 bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dynamicOccasions.map((occ, idx) => (
              <Link
                key={idx}
                to={getStoreLink(occ.link)}
                className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
              >
                <img
                  src={occ.image}
                  alt={occ.title}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
                <div className="relative z-10 text-white w-full">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition-colors">
                    {occ.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Selling Sarees */}
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
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
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
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
            {dynamicBrands.map((b, idx) => (
              <Link
                key={idx}
                to={getStoreLink(b.link)}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex flex-col justify-between p-5 bg-stone-900"
              >
                <img
                  src={b.image}
                  alt={b.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {b.badge}
                  </span>
                </div>

                <div className="relative z-10 text-white w-full">
                  <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-2 backdrop-blur-sm group-hover:bg-gold group-hover:text-stone-950 transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition">
                    {b.name}
                  </h3>
                  <p className="text-xs text-white/80 font-medium mt-1">
                    {b.subtitle}
                  </p>
                  <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
                    Explore Brand <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
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
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
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
            {dynamicFabrics.map((f, idx) => (
              <Link
                key={idx}
                to={getStoreLink(f.link)}
                className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5"
              >
                <img
                  src={f.image}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#20040E]/95 via-[#20040E]/40 to-transparent"></div>
                <div className="relative z-10 text-white w-full">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    {f.badge}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
                    {f.name}
                  </h3>
                  <p className="text-xs text-white/85 font-medium mt-1">
                    {f.desc}
                  </p>
                  <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:text-gold-light group-hover:translate-x-1 transition-all">
                    Explore Fabric <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Trending Masterpieces */}
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
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
