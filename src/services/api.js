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
  getFilters: () => api.get('/products/filters/options'),
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

// Upload API (Cloudinary via backend)
export const uploadApi = {
  uploadImage: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadMultiple: (formData) =>
    api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;

