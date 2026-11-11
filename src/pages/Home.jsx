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
import { Sparkles, ArrowRight, HeartHandshake, Award, Store, ShieldCheck } from 'lucide-react';
import { getFallbackSareesForStore } from '../data/fallbackProducts.js';
import { useStore } from '../context/StoreContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import ArunVastralayHome from './stores/ArunVastralayHome.jsx';

// Unified Luxury Showcase Card (Matches Featured Brands reference)
const ShowcaseCard = ({ link, image, title, subtitle, exploreText = 'Explore Saree' }) => (
  <Link
    to={link}
    className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-gold/30 hover:border-gold hover:shadow-luxury transition-all duration-500 flex items-end p-5 bg-stone-900"
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A030A] via-[#1A030A]/40 to-black/30"></div>

    <div className="relative z-10 text-white w-full">
      <h3 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-gold-light transition line-clamp-1">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-white/80 font-medium mt-1 line-clamp-1">
          {subtitle}
        </p>
      )}
      <span className="inline-flex items-center text-xs text-gold font-bold mt-2.5 group-hover:translate-x-1 transition-transform">
        {exploreText} <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </span>
    </div>
  </Link>
);

const Home = () => {
  const { store, isBoutiqueStore } = useStore();

  // If Arun Vastralay is active, render its dedicated custom visual landing page
  if (store?.slug === 'arun-vastralay') {
    return <ArunVastralayHome />;
  }

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
      subtitle: 'Bridal Heritage & Master Zari',
      occasionTag: 'Bridal',
      link: '/shop?occasion=Bridal',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Festive Celebrations',
      subtitle: 'Rich Colors & Temple Motifs',
      occasionTag: 'Festive',
      link: '/shop?occasion=Festive',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Party & Reception',
      subtitle: 'Contemporary Sheer & Shimmer',
      occasionTag: 'Party Wear',
      link: '/shop?occasion=Party%20Wear',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Traditional & Puja',
      subtitle: 'Auspicious Weaves & Pure Silks',
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
      subtitle: custom?.subtitle || (prodMatch?.fabric ? `${prodMatch.fabric} Couture` : def.subtitle),
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
      <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Shop By Occasion
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
            {dynamicOccasions.map((occ, idx) => (
              <ShowcaseCard
                key={idx}
                link={getStoreLink(occ.link)}
                image={occ.image}
                title={occ.title}
                subtitle={occ.subtitle}
                exploreText="Explore Occasion"
              />
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 sm:h-96 rounded-2xl bg-stone-200/70 animate-pulse border border-stone-200" />
              ))
            ) : (
              bestSellers.slice(0, 4).map((p, idx) => (
                <ShowcaseCard
                  key={p._id || idx}
                  link={getStoreLink(`/product/${p.slug}`)}
                  image={p.images?.[0] || p.image}
                  title={p.name}
                  subtitle={p.fabric ? `${p.fabric} • ${formatPrice(p.discountPrice || p.price)}` : formatPrice(p.discountPrice || p.price)}
                  exploreText="Explore Saree"
                />
              ))
            )}
          </div>
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
              <ShowcaseCard
                key={idx}
                link={getStoreLink(b.link)}
                image={b.image}
                title={b.name}
                subtitle={b.subtitle}
                exploreText="Explore Brand"
              />
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 sm:h-96 rounded-2xl bg-stone-200/70 animate-pulse border border-stone-200" />
              ))
            ) : (
              newArrivals.slice(0, 4).map((p, idx) => (
                <ShowcaseCard
                  key={p._id || idx}
                  link={getStoreLink(`/product/${p.slug}`)}
                  image={p.images?.[0] || p.image}
                  title={p.name}
                  subtitle={p.fabric ? `${p.fabric} • ${formatPrice(p.discountPrice || p.price)}` : formatPrice(p.discountPrice || p.price)}
                  exploreText="Explore Saree"
                />
              ))
            )}
          </div>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dynamicFabrics.map((f, idx) => (
              <ShowcaseCard
                key={idx}
                link={getStoreLink(f.link)}
                image={f.image}
                title={f.name}
                subtitle={f.desc}
                exploreText="Explore Fabric"
              />
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 sm:h-96 rounded-2xl bg-stone-200/70 animate-pulse border border-stone-200" />
              ))
            ) : (
              trending.slice(0, 4).map((p, idx) => (
                <ShowcaseCard
                  key={p._id || idx}
                  link={getStoreLink(`/product/${p.slug}`)}
                  image={p.images?.[0] || p.image}
                  title={p.name}
                  subtitle={p.fabric ? `${p.fabric} • ${formatPrice(p.discountPrice || p.price)}` : formatPrice(p.discountPrice || p.price)}
                  exploreText="Explore Saree"
                />
              ))
            )}
          </div>
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
