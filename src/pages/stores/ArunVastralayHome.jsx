import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
  Heart,
  ShoppingBag,
  Zap,
  Star,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Gem,
  Palette,
  Compass,
  Gift,
  Truck,
  Eye,
  ChevronRight,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { productApi } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';

// Deep Teal Theme Palettes
// Primary: #125454 | Deep Teal: #0B3838 | Dark Pine: #062626
// Warm Gold: #D4AF37 | Champagne: #F5E8C7 | Soft Ivory: #F6F9F9

const ARUN_CATEGORIES = [
  { id: 'katan', name: 'Katan Silk', icon: Crown, count: '48 Designs', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85' },
  { id: 'bridal', name: 'Bridal Vastra', icon: Gem, count: '36 Designs', image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=800&q=85' },
  { id: 'kadhwa', name: 'Kadhwa Brocade', icon: Sparkles, count: '28 Designs', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85' },
  { id: 'organza', name: 'Tissue Organza', icon: Palette, count: '24 Designs', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=85' },
  { id: 'festive', name: 'Festive Drapes', icon: Gift, count: '52 Designs', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85' },
];

const LOOKBOOK_TILES = [
  {
    title: 'Imperial Kadhwa Weave',
    subtitle: 'Pure Mulberry Katan',
    price: 18999,
    tag: 'Masterpiece',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Emerald Zari Brocade',
    subtitle: 'Antique Gold Resham',
    price: 14499,
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Royal Tissue Organza',
    subtitle: 'Featherlight Sheer',
    price: 11999,
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Bridal Heritage Red',
    subtitle: 'Hand-dyed Auspicious Silk',
    price: 24999,
    tag: 'Bridal Heirloom',
    image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Shimmer Viscose Georgette',
    subtitle: 'Contemporary Party Drape',
    price: 8999,
    tag: 'New Edition',
    image: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Varanasi Neelam Brocade',
    subtitle: 'Peacock Motif Borders',
    price: 16500,
    tag: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=900&q=85',
  },
];

const REAL_BRIDES = [
  {
    name: 'Ananya Sharma',
    city: 'Varanasi',
    occasion: 'Wedding Day',
    image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'Ritu Khandelwal',
    city: 'Jaipur',
    occasion: 'Sangeet Ceremony',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'Pooja Singhania',
    city: 'Kolkata',
    occasion: 'Reception Night',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'Dr. Sneha Verma',
    city: 'Delhi',
    occasion: 'Traditional Puja',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=85',
  },
];

const ArunVastralayHome = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArunProducts = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProducts({ store: 'arun-vastralay', limit: 8 });
        if (res.success && res.products && res.products.length > 0) {
          setProducts(res.products);
        } else {
          // Fallback to sample luxury products
          setProducts(LOOKBOOK_TILES.map((t, idx) => ({
            _id: `arun-${idx}`,
            name: t.title,
            fabric: t.subtitle,
            price: t.price,
            discountPrice: Math.round(t.price * 0.85),
            images: [t.image],
            slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          })));
        }
      } catch (err) {
        console.warn('Error fetching Arun Vastralay products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArunProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F9F9] text-stone-900 font-sans">
      {/* 1. TOP BRAND STRIP WITH DIRECT ACTIONS */}
      <section className="bg-[#0B3838] border-b border-white/10 text-white py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wider uppercase text-[11px] text-[#F5E8C7]">
              Arun Vastralay • Varanasi Heritage Store
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://wa.me/919839012345?text=Namaste%20Arun%20Vastralay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Store</span>
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-white/80">
              <MapPin className="w-3 h-3 text-[#D4AF37]" /> Godowlia Chowk, Varanasi
            </span>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC VISUAL HERO (Visual-First, Minimum Text) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B3838] via-[#125454] to-[#0A3434] text-white">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (Minimal Text, Icon Badges, Direct Action) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-bold tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Estd. 1988 • Varanasi Handloom</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Arun Vastralay
                </h1>
                <p className="text-sm sm:text-base text-emerald-100/90 font-medium">
                  Pure Kashi Katan & Heritage Bridal Vastra
                </p>
              </div>

              {/* Quick Icon Feature Tags */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Silk Mark Certified</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Pure Zari Brocade</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Direct Weaver Rate</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Worldwide Delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/store/arun-vastralay/shop"
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c5a030] text-[#0B3838] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <a
                  href="https://wa.me/919839012345?text=Namaste%2C%20I%20want%20to%20view%20Arun%20Vastralay%20bridal%20collection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border border-white/20 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp Styling</span>
                </a>
              </div>
            </div>

            {/* Right Visual Collage (4 Curated High-Impact Photos) */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 group">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
                    alt="Pure Katan Silk"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white tracking-wide">Katan Silk</span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group sm:translate-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=700&q=85"
                    alt="Bridal Heritage"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white tracking-wide">Bridal Vastra</span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group col-span-2 sm:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
                    alt="Gold Zari Kadhwa"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white tracking-wide">Gold Zari Brocade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ICONIC QUICK-CATEGORY TILES (Icon + Visual Photo) */}
      <section className="py-10 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#125454]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#125454]">
                Signature Categories
              </h2>
            </div>
            <Link
              to="/store/arun-vastralay/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#125454] hover:text-[#D4AF37] flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {ARUN_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/store/arun-vastralay/shop?category=${cat.id}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-stone-200/90 hover:border-[#125454] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-3.5 bg-stone-900"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3838] via-[#0B3838]/40 to-black/20"></div>

                  <div className="relative z-10 self-end">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-[#F5E8C7] group-hover:bg-[#D4AF37] group-hover:text-[#0B3838] transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="relative z-10 text-white">
                    <h3 className="font-serif text-sm sm:text-base font-bold drop-shadow-sm group-hover:text-[#F5E8C7] transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-white/70 font-medium">
                      {cat.count}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. VISUAL LOOKBOOK GRID (High Image Density, Minimum Text) */}
      <section className="py-12 sm:py-16 bg-[#F6F9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Curated Gallery
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#125454]">
                Arun Vastralay Lookbook
              </h2>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              {['all', 'bridal', 'katan', 'organza'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    activeTab === tab
                      ? 'bg-[#125454] text-white shadow-xs'
                      : 'text-stone-600 hover:text-[#125454]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Visual Saree Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {LOOKBOOK_TILES.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-stone-200/90 hover:border-[#125454] transition-all duration-500 bg-stone-900 flex flex-col justify-between p-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3838] via-[#0B3838]/30 to-black/20"></div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E8C7] text-[10px] font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-rose-400 transition cursor-pointer">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Details & Direct WhatsApp/Explore CTA */}
                <div className="relative z-10 text-white space-y-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold drop-shadow-sm group-hover:text-[#F5E8C7] transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    {item.subtitle}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-white/20">
                    <span className="font-sans font-black text-sm text-[#F5E8C7]">
                      {formatPrice(item.price)}
                    </span>
                    <a
                      href={`https://wa.me/919839012345?text=Namaste%2C%20I%20am%20interested%20in%20${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:bg-white text-[#0B3838] font-bold text-[11px] flex items-center gap-1 shadow-sm transition active:scale-95"
                    >
                      <MessageCircle className="w-3 h-3 text-[#0B3838]" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & WEAVING REEL (Icons & Photos) */}
      <section className="py-12 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-[#F6F9F9] border border-stone-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[#125454]/10 text-[#125454] flex items-center justify-center mb-3">
                <Crown className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-black text-[#125454]">36+</span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-0.5">Years Heritage</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F9F9] border border-stone-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[#125454]/10 text-[#125454] flex items-center justify-center mb-3">
                <Gem className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-black text-[#125454]">100%</span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-0.5">Varanasi Handloom</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F9F9] border border-stone-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[#125454]/10 text-[#125454] flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-black text-[#125454]">350+</span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-0.5">Master Weavers</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F9F9] border border-stone-200/80 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[#125454]/10 text-[#125454] flex items-center justify-center mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-black text-[#125454]">20,000+</span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-0.5">Happy Brides</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL BRIDES OF ARUN VASTRALAY (Visual Story Cards) */}
      <section className="py-12 bg-[#F6F9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Real Brides
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#125454]">
              Styled in Arun Vastralay Vastra
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {REAL_BRIDES.map((b, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200/80 transition-all flex items-end p-4 bg-stone-900"
              >
                <img
                  src={b.image}
                  alt={b.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                <div className="relative z-10 text-white">
                  <div className="flex items-center text-amber-400 text-xs gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-tight">
                    {b.name}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    {b.occasion} • {b.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VISUAL STORE VISIT & VIP CONCIERGE BANNER */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0B3838] via-[#125454] to-[#0A3434] text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F5E8C7] text-xs font-bold uppercase tracking-wider border border-white/20">
                <Store className="w-3.5 h-3.5 text-[#D4AF37]" /> Flagship Store
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                Visit Arun Vastralay in Godowlia, Varanasi
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Connect directly with our master drapers on WhatsApp or call for private bridal consultations and custom handloom weaving.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="https://wa.me/919839012345?text=Namaste%20Arun%20Vastralay%2C%20I%20want%20to%20schedule%20a%20bridal%20appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-white text-[#0B3838] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Appointment</span>
                </a>

                <a
                  href="tel:+919839012345"
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/20 transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-[#F5E8C7]" />
                  <span>Call +91 98390 12345</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArunVastralayHome;
