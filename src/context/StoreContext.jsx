import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://subh-lagan-saree-backend.onrender.com';

export const DEFAULT_FLAGSHIP_STORE = {
  name: 'Subh Lagan Sarees',
  slug: 'subh-lagan',
  tagline: 'Authentic Banarasi, Kanjivaram & Pure Silk Heritage Since 1994',
  ownerName: 'Subh Lagan Flagship',
  ownerEmail: 'care@subhlagansarees.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 81475 40362',
  address: 'Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001',
  badge: 'Flagship Heritage Boutique',
  status: 'active',
  isDefault: true,
};

// Known offline / fallback stores in case API is cold-starting
export const CLIENT_STORES = [
  DEFAULT_FLAGSHIP_STORE,
  {
    name: 'Arun Vastralay',
    slug: 'arun-vastralay',
    tagline: 'Traditional Banarasi Brocades & Auspicious Bridal Vastra',
    ownerName: 'Arun Kumar Gupta',
    ownerEmail: 'arun@arunvastralay.com',
    phone: '+91 98390 12345',
    whatsapp: '+91 98390 12345',
    address: 'Main Chowk Market, Godowlia, Varanasi, Uttar Pradesh 221001',
    badge: 'Verified Boutique Partner',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Veeraj Brand Seller',
    slug: 'veeraj-brand-seller',
    tagline: 'Contemporary Royal Silks & Signature Designer Weaves',
    ownerName: 'Veeraj Singhania',
    ownerEmail: 'contact@veerajbrands.com',
    phone: '+91 98250 67890',
    whatsapp: '+91 98250 67890',
    address: 'Millennium Textile Market, Ring Road, Surat, Gujarat 395002',
    badge: 'Verified Boutique Partner',
    status: 'active',
    isDefault: false,
  },
];

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem('active_store_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_FLAGSHIP_STORE;
  });

  const [loadingStore, setLoadingStore] = useState(false);
  const location = useLocation();

  // Extract store slug from:
  // 1. Path: /store/:storeSlug (or /store/:storeSlug/...)
  // 2. Query param: ?store=arun-vastralay
  const detectSlugFromLocation = () => {
    const pathMatch = location.pathname.match(/^\/store\/([a-zA-Z0-9_-]+)/i);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1].toLowerCase();
    }
    const params = new URLSearchParams(location.search);
    const storeParam = params.get('store');
    if (storeParam) {
      return storeParam.toLowerCase().trim();
    }
    return null;
  };

  const loadStoreBySlug = async (slug) => {
    if (!slug || slug === 'subh-lagan' || slug === 'default') {
      setStore(DEFAULT_FLAGSHIP_STORE);
      localStorage.removeItem('active_store_slug');
      localStorage.removeItem('active_store_data');
      return DEFAULT_FLAGSHIP_STORE;
    }

    // First check local catalog for instant snappy rendering without flicker
    const localMatch = CLIENT_STORES.find(
      (s) => s.slug.toLowerCase() === slug.toLowerCase()
    );
    if (localMatch) {
      setStore(localMatch);
      localStorage.setItem('active_store_slug', localMatch.slug);
      localStorage.setItem('active_store_data', JSON.stringify(localMatch));
    }

    // Now try fetching fresh data from backend
    try {
      setLoadingStore(true);
      const res = await fetch(`${API_BASE_URL}/api/stores/by-slug/${slug}`);
      const data = await res.json();
      if (data.success && data.store) {
        setStore(data.store);
        localStorage.setItem('active_store_slug', data.store.slug);
        localStorage.setItem('active_store_data', JSON.stringify(data.store));
        return data.store;
      }
    } catch (err) {
      console.warn('[StoreContext] Could not fetch remote store, using fallback:', err.message);
    } finally {
      setLoadingStore(false);
    }

    return localMatch || DEFAULT_FLAGSHIP_STORE;
  };

  const resetToDefaultStore = () => {
    setStore(DEFAULT_FLAGSHIP_STORE);
    localStorage.removeItem('active_store_slug');
    localStorage.removeItem('active_store_data');
  };

  // Re-check whenever URL changes
  useEffect(() => {
    const slug = detectSlugFromLocation();
    if (slug) {
      loadStoreBySlug(slug);
    }
  }, [location.pathname, location.search]);

  // Dynamic document title based on active store
  useEffect(() => {
    if (store && store.slug !== 'subh-lagan') {
      document.title = `${store.name} | ${store.tagline || 'Boutique Silk Sarees'}`;
    } else {
      document.title = 'Subh Lagan Sarees | Luxury Pure Silk & Bridal Heritage';
    }
  }, [store]);

  const isBoutiqueStore = store && store.slug !== 'subh-lagan';

  return (
    <StoreContext.Provider
      value={{
        store,
        isBoutiqueStore,
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
