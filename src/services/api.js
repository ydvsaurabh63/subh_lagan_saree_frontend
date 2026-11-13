import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://subh-lagan-saree-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token & active store slug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sls_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const storeSlug =
      localStorage.getItem('sls_store_slug') ||
      localStorage.getItem('active_store_slug') ||
      'subh-lagan';
    if (storeSlug) {
      config.headers['X-Store-Slug'] = storeSlug;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth endpoints
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  sendMobileOtp: (data) => api.post('/auth/send-mobile-otp', data),
  verifyMobileOtp: (data) => api.post('/auth/verify-mobile-otp', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User Profile & Addresses
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

// Categories
export const categoryApi = {
  getCategories: () => api.get('/categories'),
  getCategory: (slug) => api.get(`/categories/${slug}`),
};

// Products
export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (identifier) => api.get(`/products/${identifier}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getFilters: (params) => api.get('/products/filters/options', { params }),
};

// Cart
export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.put(`/cart/item/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/item/${productId}`),
  syncGuestCart: (guestItems) => api.post('/cart/sync', { guestItems }),
  clearCart: () => api.delete('/cart'),
};

// Wishlist
export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

// Orders (Cash on Delivery only)
export const orderApi = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// Reviews
export const reviewApi = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post('/reviews', data),
};

// Contact & Newsletter
export const contactApi = {
  submitContact: (data) => api.post('/contact', data),
};

export const newsletterApi = {
  subscribe: (email) => api.post('/newsletter', { email }),
};

// Admin Management APIs
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getOrders: (params) => api.get('/orders/admin/all', { params }),
  updateOrderStatus: (id, status) => api.put(`/orders/admin/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/admin/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  getContacts: () => api.get('/contact/admin/all'),
  updateContactStatus: (id, status) => api.put(`/contact/admin/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/contact/admin/${id}`),
  getSubscribers: () => api.get('/newsletter/admin/all'),
};

// Management APIs (Superadmin & Admin)
export const managementApi = {
  // Stats
  getSuperAdminStats: () => api.get('/management/superadmin/stats'),
  getAdminStats: () => api.get('/management/admin/stats'),

  // Admin CRUD (Superadmin only)
  getAdmins: (params) => api.get('/management/admins', { params }),
  createAdmin: (data) => api.post('/management/admins', data),
  updateAdmin: (id, data) => api.put(`/management/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/management/admins/${id}`),

  // Client CRUD (Superadmin & Admin)
  getClients: (params) => api.get('/management/clients', { params }),
  createClient: (data) => api.post('/management/clients', data),
  updateClient: (id, data) => api.put(`/management/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/management/clients/${id}`),

  // Status toggle
  toggleUserStatus: (id) => api.put(`/management/users/${id}/toggle-status`),

  // Direct Impersonation Login
  impersonateUser: (id) => api.post(`/management/impersonate/${id}`),
};

// Cloudinary Direct Config for high-speed client gallery uploads
const CLOUDINARY_CONFIG = {
  cloudName: 'dpa4crgv5',
  apiKey: '224249444435518',
  apiSecret: 'FLe2tz1IrHNqTYx9KJ0sfOrtWGc',
  folder: 'subh_lagan_sarees',
};

async function sha1Hex(str) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const enc = new TextEncoder();
    const hash = await window.crypto.subtle.digest('SHA-1', enc.encode(str));
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

// Upload API (Direct high-speed Cloudinary upload with backend fallback)
export const uploadApi = {
  uploadImage: async (formData) => {
    // 1. Direct high-speed Cloudinary upload (bypasses server timeouts / 500 errors)
    try {
      const file = formData.get('image') || formData.get('file');
      if (file) {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = CLOUDINARY_CONFIG.folder;
        const stringToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
        const signature = await sha1Hex(stringToSign);

        const cloudFormData = new FormData();
        cloudFormData.append('file', file);
        cloudFormData.append('api_key', CLOUDINARY_CONFIG.apiKey);
        cloudFormData.append('timestamp', timestamp);
        cloudFormData.append('folder', folder);
        cloudFormData.append('signature', signature);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          }
        );

        if (res.ok) {
          const data = await res.json();
          return {
            success: true,
            url: data.secure_url,
            public_id: data.public_id,
            format: data.format,
            bytes: data.bytes,
          };
        }
      }
    } catch (directErr) {
      console.warn('Direct Cloudinary upload failed, falling back to backend:', directErr);
    }

    // 2. Fallback to backend /upload
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadMultiple: async (formData) => {
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Store Customization & Multi-Industry Storefront APIs
export const storeApi = {
  getStores: () => api.get('/stores'),
  getStoreBySlug: (slug) => api.get(`/stores/by-slug/${slug}`),
  getStoreByDomain: (domain) => api.get(`/stores/by-domain/${domain}`),
  createStore: (data) => api.post('/stores', data),
  updateStore: (id, data) => api.put(`/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/stores/${id}`),
};

export default api;

