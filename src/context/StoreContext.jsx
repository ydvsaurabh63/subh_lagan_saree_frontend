import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://subh-lagan-saree-backend.onrender.com';

// Utility to lighten or darken hex colors for dynamic button hover and dark variants
const adjustColor = (hex = '#681B2C', percent = 0) => {
  try {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch (e) {
    return hex;
  }
};

export const DEFAULT_FLAGSHIP_STORE = {
  name: 'Subh Lagan Sarees',
  slug: 'subh-lagan',
  storeType: 'saree',
  customDomain: '',
  tagline: 'Authentic Banarasi, Kanjivaram & Pure Silk Heritage Since 1994',
  ownerName: 'Subh Lagan Flagship',
  ownerEmail: 'care@subhlagansarees.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 81475 40362',
  address: 'Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001',
  badge: 'Flagship Heritage Boutique',
  trustBadge: '100% Pure Silk Mark Certified Heritage',
  primaryColor: '#681B2C',
  secondaryColor: '#C6A15B',
  accentColor: '#8B0000',
  fontFamily: 'serif',
  themePreset: 'heritage',
  heroHeading: 'Royal Handcrafted Silk Sarees',
  heroSubheading: 'Authentic Banarasi & Kanjivaram Bridal Weaves direct to your doorstep.',
  promoCode: 'SUBHLAGAN30',
  promoDiscount: 'Flat 30% Off Bridal',
  status: 'active',
  isDefault: true,
};

// Seed stores for offline / initial snappy loading
export const CLIENT_STORES = [
  DEFAULT_FLAGSHIP_STORE,
  {
    name: 'Arun Vastralay',
    slug: 'arun-vastralay',
    storeType: 'saree',
    customDomain: 'arunvastralay.com',
    tagline: 'Traditional Banarasi Brocades & Auspicious Bridal Vastra',
    ownerName: 'Arun Kumar Gupta',
    ownerEmail: 'arun@arunvastralay.com',
    phone: '+91 98390 12345',
    whatsapp: '+91 98390 12345',
    address: 'Main Chowk Market, Godowlia, Varanasi, Uttar Pradesh 221001',
    badge: 'Verified Boutique Partner',
    trustBadge: '100% Varanasi Handloom Mark Certified',
    primaryColor: '#831843', // Deep Rose Wine
    secondaryColor: '#D97706', // Antique Gold
    fontFamily: 'serif',
    themePreset: 'heritage',
    promoCode: 'ARUNVAST30',
    promoDiscount: 'Flat 30% Off Festive Brocades',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Veeraj Brand Seller',
    slug: 'veeraj-brand-seller',
    storeType: 'saree',
    customDomain: 'veerajbrandseller.com',
    tagline: 'Contemporary Royal Silks & Signature Designer Weaves',
    ownerName: 'Veeraj Singhania',
    ownerEmail: 'contact@veerajbrands.com',
    phone: '+91 98250 67890',
    whatsapp: '+91 98250 67890',
    address: 'Millennium Textile Market, Ring Road, Surat, Gujarat 395002',
    badge: 'Verified Boutique Partner',
    trustBadge: 'Surat Master Weavers Authenticated',
    primaryColor: '#1E3A8A', // Royal Navy Blue
    secondaryColor: '#E0A96D', // Warm Rose Gold
    fontFamily: 'luxury',
    themePreset: 'modern',
    promoCode: 'VEERAJBR30',
    promoDiscount: 'Flat 25% Off Modern Silk & Organza',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Kundan Heritage Jewellers',
    slug: 'kundan-heritage-jewellers',
    storeType: 'jewellery',
    customDomain: 'kashijewels.com',
    tagline: '22K Hallmarked Gold, Polki & Solitaire Diamond Masterpieces',
    ownerName: 'Rameshwar Soni',
    ownerEmail: 'contact@kashijewels.com',
    phone: '+91 98390 55443',
    whatsapp: '+91 98390 55443',
    address: 'Thatheri Bazaar, Chowk, Varanasi, Uttar Pradesh 221001',
    badge: 'Certified Master Jeweller',
    trustBadge: '100% BIS Hallmarked • Certified Gold & Diamonds • Insured Shipping',
    primaryColor: '#064E3B', // Luxury Emerald Green
    secondaryColor: '#D97706', // 22K Gold
    fontFamily: 'serif',
    themePreset: 'heritage',
    heroHeading: 'Sacred Gold & Polki Jewellery',
    heroSubheading: 'Authentic 22K hallmarked bridal chokers, bangles & diamond solitaires.',
    promoCode: 'JEWELS20',
    promoDiscount: 'Flat 20% Off Making Charges',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Crown Luxe Hair Studio',
    slug: 'crown-luxe-hair',
    storeType: 'hair',
    customDomain: 'luxehair.com',
    tagline: '100% Virgin Remy Human Hair Extensions & Salon Grade Hair Care',
    ownerName: 'Priya Malhotra',
    ownerEmail: 'contact@luxehair.com',
    phone: '+91 98112 33445',
    whatsapp: '+91 98112 33445',
    address: 'Bandra West, Linking Road, Mumbai, Maharashtra 400050',
    badge: 'Salon Certified Hair Brand',
    trustBadge: '100% Virgin Remy Human Hair • Salon Grade & Toxin Free • Heat Resistant',
    primaryColor: '#831843', // Luxe Berry Pink
    secondaryColor: '#F472B6', // Rose Gold Shimmer
    fontFamily: 'sans',
    themePreset: 'boutique',
    heroHeading: 'Flawless Remy Hair Extensions & Care',
    heroSubheading: 'Seamless clip-ins, lace front wigs & organic hair repair serums.',
    promoCode: 'LUXEHAIR25',
    promoDiscount: 'Flat 25% Off Premium Extensions',
    status: 'active',
    isDefault: false,
  },
];

export const getStoreBySlug = (slug) => {
  if (!slug || slug === 'subh-lagan' || slug === 'default') {
    return DEFAULT_FLAGSHIP_STORE;
  }
  const cleanSlug = slug.toLowerCase().trim();
  const match = CLIENT_STORES.find(
    (s) => s.slug.toLowerCase() === cleanSlug || (s.customDomain && s.customDomain.toLowerCase() === cleanSlug)
  );
  return match || DEFAULT_FLAGSHIP_STORE;
};

// Extract store slug strictly from current URL:
// 1. Direct path: /store/:storeSlug
// 2. Query param: ?store=:storeSlug
// 3. Custom domain matching: e.g. kashijewels.com
// 4. Fallback for root / and standard routes: 'subh-lagan'
export const detectSlugFromLocation = (pathname = '', search = '') => {
  // 1. Path Match /store/:storeSlug
  const pathMatch = pathname.match(/^\/store\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].toLowerCase().trim();
  }

  // 2. Query param ?store=slug
  const params = new URLSearchParams(search);
  const storeParam = params.get('store');
  if (storeParam) {
    return storeParam.toLowerCase().trim();
  }

  // 3. Custom domain hostname detection
  if (typeof window !== 'undefined') {
    const rawHost = window.location.hostname.toLowerCase().replace(/^www\./, '').trim();
    if (rawHost && !rawHost.includes('localhost') && !rawHost.includes('127.0.0.1') && !rawHost.includes('vercel.app')) {
      const match = CLIENT_STORES.find(
        (s) => s.customDomain && s.customDomain.toLowerCase() === rawHost
      );
      if (match) return match.slug;
      return `domain:${rawHost}`;
    }
  }

  return 'subh-lagan';
};

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const location = useLocation();

  // Initialize store strictly based on current URL / domain
  const [store, setStore] = useState(() => {
    if (typeof window !== 'undefined') {
      const initialSlug = detectSlugFromLocation(window.location.pathname, window.location.search);
      if (initialSlug.startsWith('domain:')) {
        return DEFAULT_FLAGSHIP_STORE;
      }
      return getStoreBySlug(initialSlug);
    }
    return DEFAULT_FLAGSHIP_STORE;
  });

  const [loadingStore, setLoadingStore] = useState(false);

  // Dynamic CSS Variables Injection whenever store colors change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const primary = store?.primaryColor || '#681B2C';
      const secondary = store?.secondaryColor || '#C6A15B';

      root.style.setProperty('--color-primary', primary);
      root.style.setProperty('--color-primary-light', adjustColor(primary, 22));
      root.style.setProperty('--color-primary-dark', adjustColor(primary, -25));
      root.style.setProperty('--color-gold', secondary);
      root.style.setProperty('--color-gold-light', adjustColor(secondary, 20));
      root.style.setProperty('--color-gold-dark', adjustColor(secondary, -20));
    }
  }, [store?.primaryColor, store?.secondaryColor]);

  const resetToDefaultStore = () => {
    setStore(DEFAULT_FLAGSHIP_STORE);
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_store_slug', 'subh-lagan');
      localStorage.setItem('sls_store_slug', 'subh-lagan');
      localStorage.setItem('active_store_data', JSON.stringify(DEFAULT_FLAGSHIP_STORE));
    }
    return DEFAULT_FLAGSHIP_STORE;
  };

  const loadStoreBySlug = async (slug) => {
    const cleanSlug = (slug || 'subh-lagan').toLowerCase().trim();
    if (cleanSlug === 'subh-lagan' || cleanSlug === 'default') {
      return resetToDefaultStore();
    }

    // Handle domain: lookup
    let isDomainLookup = cleanSlug.startsWith('domain:');
    let domainParam = isDomainLookup ? cleanSlug.replace('domain:', '') : null;

    // Instant local match
    const localMatch = isDomainLookup
      ? CLIENT_STORES.find((s) => s.customDomain && s.customDomain.toLowerCase() === domainParam)
      : getStoreBySlug(cleanSlug);

    if (localMatch) {
      setStore(localMatch);
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_store_slug', localMatch.slug);
        localStorage.setItem('sls_store_slug', localMatch.slug);
        localStorage.setItem('active_store_data', JSON.stringify(localMatch));
      }
    }

    // Fetch fresh details from backend
    try {
      setLoadingStore(true);
      const url = isDomainLookup
        ? `${API_BASE_URL}/api/stores/by-domain/${domainParam}`
        : `${API_BASE_URL}/api/stores/by-slug/${cleanSlug}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.store) {
        setStore(data.store);
        if (typeof window !== 'undefined') {
          localStorage.setItem('active_store_slug', data.store.slug);
          localStorage.setItem('sls_store_slug', data.store.slug);
          localStorage.setItem('active_store_data', JSON.stringify(data.store));
        }
        return data.store;
      }
    } catch (err) {
      console.warn('[StoreContext] Remote store fetch fallback:', err.message);
    } finally {
      setLoadingStore(false);
    }

    return localMatch || DEFAULT_FLAGSHIP_STORE;
  };

  // Re-synchronize store strictly whenever the route / URL changes
  useEffect(() => {
    const currentSlug = detectSlugFromLocation(location.pathname, location.search);
    if (currentSlug === 'subh-lagan') {
      resetToDefaultStore();
    } else {
      loadStoreBySlug(currentSlug);
    }
  }, [location.pathname, location.search]);

  // Dynamic document title based on active store
  useEffect(() => {
    if (store && store.slug !== 'subh-lagan') {
      document.title = `${store.name} | ${store.tagline || 'Exclusive Heritage & Luxury'}`;
    } else {
      document.title = 'Subh Lagan Sarees | Luxury Pure Silk & Bridal Heritage';
    }
  }, [store]);

  const isBoutiqueStore = Boolean(store && store.slug && store.slug !== 'subh-lagan');
  const storeType = store?.storeType || 'saree';
  const isJewelleryStore = storeType === 'jewellery';
  const isHairStore = storeType === 'hair';
  const isSareeStore = storeType === 'saree';

  return (
    <StoreContext.Provider
      value={{
        store,
        isBoutiqueStore,
        storeType,
        isJewelleryStore,
        isHairStore,
        isSareeStore,
        loadingStore,
        loadStoreBySlug,
        resetToDefaultStore,
        allClientStores: CLIENT_STORES,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
