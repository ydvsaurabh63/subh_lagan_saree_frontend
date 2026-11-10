import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { categoryApi, adminApi, uploadApi, storeApi } from '../../services/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import toast from 'react-hot-toast';
import {
  Upload,
  Loader2,
  Sparkles,
  Camera,
  Check,
  Eye,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

const DYNAMIC_CATEGORIES_CONFIG = [
  {
    id: 'banarasi-sarees',
    slug: 'banarasi-sarees',
    name: 'Banarasi',
    categoryType: 'collection',
    sectionTitle: 'Banarasi Silk Sarees',
    badge: 'Category & Collection',
    location: 'Home Category Carousel, Navbar & Shop Filter',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Pure Katan Silk & Royal Kadhwa Handloom Sarees',
    link: '/shop?category=banarasi-sarees',
  },
  {
    id: 'kanjivaram-sarees',
    slug: 'kanjivaram-sarees',
    name: 'Kanjivaram',
    categoryType: 'collection',
    sectionTitle: 'Kanjivaram Silk Sarees',
    badge: 'Category & Collection',
    location: 'Home Category Carousel, Navbar & Shop Filter',
    defaultImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    description: 'Gold Zari Temple Korvai Kanchipuram Silk Sarees',
    link: '/shop?category=kanjivaram-sarees',
  },
  {
    id: 'bridal-sarees',
    slug: 'bridal-sarees',
    name: 'Bridal Couture',
    categoryType: 'collection',
    sectionTitle: 'Bridal Couture (Bridel culture)',
    badge: 'Category & Bridal Showcase',
    location: 'Home Category Carousel, Navbar & Shop Filter',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted Velvet Border, Zardozi & Wedding Heritage',
    link: '/shop?isBridal=true',
  },
  {
    id: 'silk-sarees',
    slug: 'silk-sarees',
    name: 'Pure Silk',
    categoryType: 'collection',
    sectionTitle: 'Pure Silk Sarees',
    badge: 'Category & Collection',
    location: 'Home Category Carousel, Navbar & Shop Filter',
    defaultImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    description: '100% Silk Mark Certified Handloom Silk Sarees',
    link: '/shop?category=silk-sarees',
  },
  {
    id: 'try-the-look',
    slug: 'try-the-look',
    name: 'Try the look',
    categoryType: 'showcase_single',
    sectionTitle: 'Try the look (3D Virtual Trial)',
    badge: 'Hero Lookbook Showcase',
    location: 'Hero 3D Turntable & AI Virtual Fitting Room',
    defaultImage: '/models/model-1.png',
    description: 'Full-length transparent cutout model photo for 3D Saree draping trial',
    link: '/#try-on',
  },
  {
    id: 'shop-by-occasion',
    slug: 'shop-by-occasion',
    name: 'Shop by occasion',
    categoryType: 'showcase_multi',
    sectionTitle: 'Shop by occasion (4 Grid Cards)',
    badge: 'Home Showcase Grid',
    location: 'Homepage "Shop By Occasion" Section',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: '4 Curated Occasions: Wedding & Bridal, Festive, Party Wear, Traditional',
    link: '/shop',
    subCards: [
      { id: 0, title: 'Wedding & Bridal', tag: 'Bridal', link: '/shop?occasion=Bridal', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { id: 1, title: 'Festive Celebrations', tag: 'Festive', link: '/shop?occasion=Festive', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { id: 2, title: 'Party & Reception', tag: 'Party Wear', link: '/shop?occasion=Party%20Wear', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { id: 3, title: 'Traditional & Puja', tag: 'Traditional', link: '/shop?occasion=Traditional', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 'best-sellers',
    slug: 'best-sellers',
    name: 'Best sellers',
    categoryType: 'showcase_banner',
    sectionTitle: 'Best sellers Showcase',
    badge: 'Home Product Shelf',
    location: 'Homepage "Best Sellers" Section Banner',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Top-selling luxury sarees tagged as Best Sellers in products catalog',
    link: '/shop?isBestSeller=true',
  },
  {
    id: 'featured-brands',
    slug: 'featured-brands',
    name: 'Featured brands',
    categoryType: 'showcase_multi',
    sectionTitle: 'Featured brands (4 Brand Cards)',
    badge: 'Home Showcase Grid',
    location: 'Homepage "Featured Brands" Section',
    defaultImage: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80',
    description: '4 Signature Brands: Subh Lagan Privé, Varanasi Silk Guild, Kanchi Weavers, Avadh Brocades',
    link: '/shop',
    subCards: [
      { id: 0, title: 'Subh Lagan Privé', badge: 'Haute Couture', subtitle: 'Couture Bridal & Master Zari', link: '/shop?isBridal=true', image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80' },
      { id: 1, title: 'Varanasi Silk Guild', badge: 'Silk Mark', subtitle: 'Pure Katan Silk & Kadhwa', link: '/shop?category=banarasi-sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
      { id: 2, title: 'Kanchi Royal Weavers', badge: 'Heirloom', subtitle: 'Gold Zari Korvai Handloom', link: '/shop?category=kanjivaram-sarees', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
      { id: 3, title: 'Avadh Brocades', badge: 'Artisan Collective', subtitle: 'Royal Organza & Tissue Silks', link: '/shop?category=organza-sarees', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'new-arrival',
    slug: 'new-arrival',
    name: 'New arrival',
    categoryType: 'showcase_banner',
    sectionTitle: 'New arrival (New arraivel) Showcase',
    badge: 'Home Product Shelf',
    location: 'Homepage "New Arrivals" Section Banner',
    defaultImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly launched handcrafted saree collection on the boutique',
    link: '/shop?isNewArrival=true',
  },
  {
    id: 'shop-by-fabric',
    slug: 'shop-by-fabric',
    name: 'Shop by fabric',
    categoryType: 'showcase_multi',
    sectionTitle: 'Shop by fabric (Shop by febric 4 Cards)',
    badge: 'Home Showcase Grid',
    location: 'Homepage "Shop By Fabric" Section',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: '4 Signature Weaves: Pure Katan Silk, Kanchipuram Silk, Organza, Georgette',
    link: '/shop',
    subCards: [
      { id: 0, title: 'Pure Katan Silk', badge: 'Hand-Spun', desc: 'Traditional Banarasi Kadhwa & Brocade', link: '/shop?fabric=Pure%20Katan%20Silk', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { id: 1, title: 'Kanchipuram Silk', badge: 'Mulberry Silk', desc: 'Pure Temple Korvai & Gold Zari', link: '/shop?fabric=Pure%20Kanchipuram%20Silk', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
      { id: 2, title: 'Pure Organza Silk', badge: 'Featherlight', desc: 'Featherlight Drapes & Sheer Grace', link: '/shop?fabric=Pure%20Organza%20Silk', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80' },
      { id: 3, title: 'Viscose Georgette', badge: 'Flowing & Graceful', desc: 'Effortless Fall & Embellished Borders', link: '/shop?fabric=Viscose%20Georgette', image: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 'trending',
    slug: 'trending',
    name: 'Trending',
    categoryType: 'showcase_banner',
    sectionTitle: 'Trending (Treanding) Masterpieces',
    badge: 'Home Product Shelf',
    location: 'Homepage "Trending" Section Banner',
    defaultImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Top-rated bridal sarees receiving highest customer interest and trials',
    link: '/shop?sort=rating',
  },
];

const AdminCategories = () => {
  const { store, setStore, refreshStore } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all | collections | showcases
  const [savingCategory, setSavingCategory] = useState(null);

  // Active modal for uploading / editing a specific category or card
  const [activeEditingItem, setActiveEditingItem] = useState(null);
  const [activeSubCardIndex, setActiveSubCardIndex] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper to get active live image for any of the 11 categories
  const getActiveImageForCategory = (catConfig) => {
    // 1. Check if store has customized homeBanners
    const banners = store?.homeBanners || {};

    if (catConfig.id === 'try-the-look') {
      return banners.tryTheLookImage || banners.tryTheLook?.[0]?.image || catConfig.defaultImage;
    }

    if (catConfig.id === 'shop-by-occasion') {
      return banners.shopByOccasion?.[0]?.image || banners.shopByOccasion?.[0]?.imageUrl || catConfig.defaultImage;
    }

    if (catConfig.id === 'featured-brands') {
      return banners.featuredBrands?.[0]?.image || banners.featuredBrands?.[0]?.imageUrl || catConfig.defaultImage;
    }

    if (catConfig.id === 'shop-by-fabric') {
      return banners.shopByFabric?.[0]?.image || banners.shopByFabric?.[0]?.imageUrl || catConfig.defaultImage;
    }

    if (catConfig.id === 'best-sellers') {
      return banners.bestSellersImage || catConfig.defaultImage;
    }

    if (catConfig.id === 'new-arrival') {
      return banners.newArrivalImage || catConfig.defaultImage;
    }

    if (catConfig.id === 'trending') {
      return banners.trendingImage || catConfig.defaultImage;
    }

    // For collections (Banarasi, Kanjivaram, Bridal, Pure Silk)
    const dbCat = categories.find((c) => c.slug === catConfig.slug || c.name.toLowerCase().includes(catConfig.name.toLowerCase()));
    if (dbCat && dbCat.image) return dbCat.image;

    if (banners[catConfig.id]?.image) return banners[catConfig.id].image;

    return catConfig.defaultImage;
  };

  // Open Image Upload Modal for a category
  const handleOpenUploadModal = (catConfig, subCardIdx = null) => {
    setActiveEditingItem(catConfig);
    setActiveSubCardIndex(subCardIdx);

    let currentUrl = '';
    if (subCardIdx !== null && catConfig.subCards?.[subCardIdx]) {
      const banners = store?.homeBanners || {};
      const customSub = banners[catConfig.id === 'shop-by-occasion' ? 'shopByOccasion' : catConfig.id === 'featured-brands' ? 'featuredBrands' : 'shopByFabric']?.[subCardIdx];
      currentUrl = customSub?.image || customSub?.imageUrl || catConfig.subCards[subCardIdx].image;
    } else {
      currentUrl = getActiveImageForCategory(catConfig);
    }

    setImageUrlInput(currentUrl);
  };

  // Upload image to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('image', file);

      const res = await uploadApi.uploadImage(fd);
      if (res && res.url) {
        setImageUrlInput(res.url);
        toast.success('Image uploaded to Cloudinary successfully!', { icon: '📸' });
      }
    } catch (err) {
      toast.error('Image upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save new image for category or showcase
  const handleSaveImage = async () => {
    if (!imageUrlInput.trim() || !activeEditingItem) {
      toast.error('Please upload an image or provide a valid image URL');
      return;
    }

    const newUrl = imageUrlInput.trim();
    const item = activeEditingItem;
    const subIdx = activeSubCardIndex;

    try {
      setSavingCategory(item.id);

      const currentBanners = { ...(store?.homeBanners || {}) };

      // 1. If it's a sub-card in multi-card section (Occasion, Brands, Fabric)
      if (subIdx !== null && item.subCards?.[subIdx]) {
        const key = item.id === 'shop-by-occasion'
          ? 'shopByOccasion'
          : item.id === 'featured-brands'
          ? 'featuredBrands'
          : 'shopByFabric';

        const baseList = currentBanners[key]?.length
          ? [...currentBanners[key]]
          : item.subCards.map((c) => ({ ...c }));

        baseList[subIdx] = {
          ...baseList[subIdx],
          image: newUrl,
          imageUrl: newUrl,
        };

        currentBanners[key] = baseList;
      } else if (item.id === 'try-the-look') {
        currentBanners.tryTheLookImage = newUrl;
        currentBanners.tryTheLook = [
          {
            lookTitle: 'Royal Crimson Banarasi Look',
            modelImage: newUrl,
            image: newUrl,
          },
        ];
      } else if (item.id === 'best-sellers') {
        currentBanners.bestSellersImage = newUrl;
      } else if (item.id === 'new-arrival') {
        currentBanners.newArrivalImage = newUrl;
      } else if (item.id === 'trending') {
        currentBanners.trendingImage = newUrl;
      } else {
        // Saree Collection: Banarasi, Kanjivaram, Bridal Couture, Pure Silk
        currentBanners[item.id] = { image: newUrl, title: item.name };

        // Also update the database Category collection if matched
        const dbCat = categories.find((c) => c.slug === item.slug || c.name.toLowerCase().includes(item.name.toLowerCase()));
        if (dbCat && dbCat._id) {
          await adminApi.updateCategory(dbCat._id, {
            name: dbCat.name,
            image: newUrl,
            status: 'active',
          });
        }
      }

      // Save to Store document in MongoDB
      if (store?._id) {
        await storeApi.updateStore(store._id, { homeBanners: currentBanners });
      }

      // Update local state in React Context immediately so user sees it instantly
      setStore((prev) => ({
        ...prev,
        homeBanners: currentBanners,
      }));

      toast.success(`Image for "${item.name}" updated successfully!`, { icon: '✨' });
      setActiveEditingItem(null);
      setActiveSubCardIndex(null);
      fetchCategories();
      refreshStore?.();
    } catch (err) {
      console.error('Failed to save category image:', err);
      toast.error('Failed to save image: ' + (err.message || 'Server error'));
    } finally {
      setSavingCategory(null);
    }
  };

  const filteredCategories = DYNAMIC_CATEGORIES_CONFIG.filter((c) => {
    if (activeFilter === 'collections') return c.categoryType === 'collection';
    if (activeFilter === 'showcases') return c.categoryType !== 'collection';
    return true;
  });

  return (
    <AdminLayout title="11 Categories & Dynamic Showcases">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#20040E] via-[#3B0C18] to-[#20040E] text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-extrabold uppercase tracking-widest">
                Dynamic Storefront Manager
              </span>
              <span className="text-xs text-white/60">• 11 Active Sections</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-white">
              11 Categories & Homepage Showcase Images
            </h2>
            <p className="text-xs text-cream/80 max-w-2xl mt-1">
              Banarasi, Kanjivaram, Bridal Couture, Pure Silk, Try The Look, Occasions, Best Sellers, Brands, New Arrival, Fabric & Trending.
              Aap jis category me photo upload karenge, live website par usi section me turant dikhegi!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                fetchCategories();
                refreshStore?.();
                toast.success('Categories synchronized with database');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold" />
              Sync Live
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              activeFilter === 'all'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-gold'
            }`}
          >
            All 11 Categories & Showcases (11)
          </button>
          <button
            onClick={() => setActiveFilter('collections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              activeFilter === 'collections'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-gold'
            }`}
          >
            👑 Saree Collections (4)
          </button>
          <button
            onClick={() => setActiveFilter('showcases')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              activeFilter === 'showcases'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-gold'
            }`}
          >
            ✨ Homepage Showcases (7)
          </button>
        </div>

        {/* Grid of the 11 Categories & Showcases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat, idx) => {
            const currentImg = getActiveImageForCategory(cat);
            const isSavingThis = savingCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-gold/60 shadow-sm hover:shadow-luxury transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Top Header */}
                <div className="p-4 border-b border-stone-100 flex items-start justify-between gap-3 bg-stone-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold/20 text-primary font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold mt-1">
                      {cat.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-stone-400 text-right max-w-[130px] line-clamp-1">
                    {cat.location}
                  </span>
                </div>

                {/* Card Center: Live Image Preview */}
                <div className="p-4 space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner group/img">
                    <img
                      src={currentImg}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay & Tag */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                      <div className="text-white w-full">
                        <p className="text-[11px] font-medium text-white/90 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenUploadModal(cat)}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border border-white/20 shadow transition active:scale-95"
                    >
                      <Camera className="w-3 h-3 text-gold" />
                      Change Image
                    </button>
                  </div>

                  {/* Multi-card thumbnail strip (For Occasion, Brands, Fabrics) */}
                  {cat.subCards && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                        <span>4 Sub-Cards in this section:</span>
                        <span className="text-primary font-medium text-[10px]">Click any card to change</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {cat.subCards.map((sub, sIdx) => {
                          const banners = store?.homeBanners || {};
                          const key = cat.id === 'shop-by-occasion'
                            ? 'shopByOccasion'
                            : cat.id === 'featured-brands'
                            ? 'featuredBrands'
                            : 'shopByFabric';
                          const customSub = banners[key]?.[sIdx];
                          const activeSubImg = customSub?.image || customSub?.imageUrl || sub.image;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleOpenUploadModal(cat, sIdx)}
                              className="group/sub relative aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-gold hover:ring-2 hover:ring-gold/30 transition text-left"
                              title={`Click to change image for "${sub.title}"`}
                            >
                              <img src={activeSubImg} alt={sub.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/sub:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white px-1 truncate text-center">
                                {sub.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="p-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <a
                    href={cat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-primary font-semibold transition"
                  >
                    <span>View on Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleOpenUploadModal(cat)}
                    disabled={isSavingThis}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    {isSavingThis ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-gold" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 text-gold" />
                        Upload Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload / Change Image Modal */}
        {activeEditingItem && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gold/30 space-y-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                    <Camera className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      Upload Image for {activeEditingItem.name}
                    </h3>
                    {activeSubCardIndex !== null && activeEditingItem.subCards?.[activeSubCardIndex] && (
                      <p className="text-[11px] text-primary font-bold">
                        Card: {activeEditingItem.subCards[activeSubCardIndex].title}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveEditingItem(null);
                    setActiveSubCardIndex(null);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Image Preview:
                </label>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200">
                  {imageUrlInput ? (
                    <img
                      src={imageUrlInput}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                      No Image Selected
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Option 1: File from Device (Cloudinary) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  1. Upload from Mobile / Computer:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-[#852338] text-white text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-sm disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-gold" />
                      Choose Photo from Device
                    </>
                  )}
                </button>
              </div>

              {/* Upload Option 2: Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  2. Or Paste Image Link (URL):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  onClick={() => {
                    setActiveEditingItem(null);
                    setActiveSubCardIndex(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImage}
                  disabled={savingCategory !== null || uploadingImage}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-gold" />
                  Save & Publish Live
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
