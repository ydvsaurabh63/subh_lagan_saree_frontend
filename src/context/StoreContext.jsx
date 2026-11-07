import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

// Known client boutique stores
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

export const getStoreBySlug = (slug) => {
  if (!slug || slug === 'subh-lagan' || slug === 'default') {
    return DEFAULT_FLAGSHIP_STORE;
  }
  const cleanSlug = slug.toLowerCase().trim();
  const match = CLIENT_STORES.find((s) => s.slug.toLowerCase() === cleanSlug);
  return match || DEFAULT_FLAGSHIP_STORE;
};

// Extract store slug strictly from current URL:
// 1. Direct path: /store/:storeSlug
// 2. Query param: ?store=:storeSlug
// 3. Fallback for root / and standard routes: 'subh-lagan'
export const detectSlugFromLocation = (pathname = '', search = '') => {
  const pathMatch = pathname.match(/^\/store\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].toLowerCase().trim();
  }
  const params = new URLSearchParams(search);
  const storeParam = params.get('store');
  if (storeParam) {
    return storeParam.toLowerCase().trim();
  }
  return 'subh-lagan';
};

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const location = useLocation();

  // Initialize store strictly based on the current window location
  const [store, setStore] = useState(() => {
    if (typeof window !== 'undefined') {
      const initialSlug = detectSlugFromLocation(window.location.pathname, window.location.search);
      return getStoreBySlug(initialSlug);
    }
    return DEFAULT_FLAGSHIP_STORE;
  });

  const [loadingStore, setLoadingStore] = useState(false);

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

    // Instant snappy local match with zero latency
    const localMatch = getStoreBySlug(cleanSlug);
    setStore(localMatch);

    if (typeof window !== 'undefined') {
      localStorage.setItem('active_store_slug', localMatch.slug);
      localStorage.setItem('sls_store_slug', localMatch.slug);
      localStorage.setItem('active_store_data', JSON.stringify(localMatch));
    }

    // Attempt remote fetch asynchronously for live updates
    try {
      setLoadingStore(true);
      const res = await fetch(`${API_BASE_URL}/api/stores/by-slug/${cleanSlug}`);
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
      console.warn('[StoreContext] Could not fetch remote store, using fallback:', err.message);
    } finally {
      setLoadingStore(false);
    }

    return localMatch;
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
      document.title = `${store.name} | ${store.tagline || 'Boutique Silk Sarees'}`;
    } else {
      document.title = 'Subh Lagan Sarees | Luxury Pure Silk & Bridal Heritage';
    }
  }, [store]);

  const isBoutiqueStore = Boolean(store && store.slug && store.slug !== 'subh-lagan');

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
