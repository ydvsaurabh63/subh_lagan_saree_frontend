import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { productApi, categoryApi, adminApi, uploadApi } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  PackagePlus,
  Layers,
  RotateCcw,
  Upload,
  Loader2,
} from 'lucide-react';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Navigation tab: 'add' (Add New Product form) | 'inventory' (Catalog list)
  const [activeTab, setActiveTab] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State (Cleaned to essentials: Title, Category, Price, Discount Price)
  const initialForm = {
    name: '',
    category: '',
    price: '',
    discountPrice: '',
  };
  const [formData, setFormData] = useState(initialForm);

  // Single Gallery Photo Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
        if (!formData.category && res.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;

      if (user && user.role === 'client' && user.storeName) {
        params.store = user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      }

      const res = await productApi.getProducts(params);
      if (res.success) {
        let list = res.products;
        if (stockFilter === 'low') {
          list = list.filter((p) => p.stock <= 5);
        } else if (stockFilter === 'out') {
          list = list.filter((p) => p.stock === 0);
        }
        setProducts(list);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch saree products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, stockFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
    });
    setImageUrl('');
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category?._id || prod.category || '',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
    });
    setImageUrl(prod.images?.[0] || '');
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
    });
    setImageUrl('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadApi.uploadImage(fd);
      if (res && res.url) {
        setImageUrl(res.url);
        toast.success('Gallery photo uploaded successfully!');
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Name, Price, and Category are required');
      return;
    }

    try {
      setSaving(true);
      const chosenCat = categories.find(c => c._id === formData.category || c.slug === formData.category);
      const catSlug = chosenCat?.slug || '';

      const categoryFallbacks = {
        'banarasi': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'kanjivaram': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        'bridal-couture': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'pure-silk': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
        'try-the-look': '/models/model-1.png',
        'shop-by-occasion': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'best-sellers': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'featured-brands': 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=1000&q=80',
        'new-arrival': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        'shop-by-fabric': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'trending': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      };
      const fallbackImg = chosenCat?.image || categoryFallbacks[catSlug] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';
      const finalImages = imageUrl ? [imageUrl] : (editingProduct?.images?.length ? editingProduct.images : [fallbackImg]);

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        sku: editingProduct?.sku || `SLS-${Date.now().toString(36).toUpperCase()}`,
        stock: editingProduct?.stock !== undefined ? editingProduct.stock : 10,
        fabric: editingProduct?.fabric || 'Pure Silk',
        description: editingProduct?.description || `${formData.name} - Handcrafted luxury saree collection`,
        images: finalImages,
        isBestSeller: catSlug === 'best-sellers',
        isNewArrival: catSlug === 'new-arrival',
        isBridal: catSlug === 'bridal-couture',
        isFeatured: catSlug === 'trending' || catSlug === 'try-the-look',
        storeSlug: (!user?.storeName || user.storeName.toLowerCase().includes('subh lagan') || user.email?.includes('subhlagan') || user.role === 'admin' || user.role === 'superadmin')
          ? 'subh-lagan'
          : (user.storeSlug || user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')),
        storeName: (!user?.storeName || user.storeName.toLowerCase().includes('subh lagan') || user.email?.includes('subhlagan'))
          ? 'Subh Lagan Sarees'
          : (user.storeName || 'Subh Lagan Sarees'),
      };

      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct._id, payload);
        if (res.success) {
          if (formData.category && imageUrl) {
            adminApi.updateCategory(formData.category, { image: imageUrl }).catch(() => {});
          }
          toast.success('Saree product updated successfully');
          setEditingProduct(null);
          setFormData({
            ...initialForm,
            category: categories[0]?._id || '',
          });
          setImageUrl('');
          fetchProducts();
          setActiveTab('inventory');
        }
      } else {
        const res = await adminApi.createProduct(payload);
        if (res.success) {
          if (formData.category && imageUrl) {
            adminApi.updateCategory(formData.category, { image: imageUrl }).catch(() => {});
          }
          toast.success('New saree product published successfully');
          setFormData({
            ...initialForm,
            category: categories[0]?._id || '',
          });
          setImageUrl('');
          fetchProducts();
          setActiveTab('inventory');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      return;
    }
    try {
      const res = await adminApi.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <AdminLayout title="Add Product">
      <div className="space-y-6">
        {/* Top View Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'add'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PackagePlus className="w-4 h-4 text-gold" />
              <span>{editingProduct ? 'Edit Saree Product' : 'Add New Product'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'inventory'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-gold" />
              <span>All Products ({products.length})</span>
            </button>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              Live Categories: <strong className="text-primary">{categories.length} Ready</strong>
            </span>
          </div>
        </div>

        {/* TAB 1: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#2B0A13] via-[#3E101D] to-[#2B0A13] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-gold/20 text-gold text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-1 border border-gold/30">
                  <Sparkles className="w-3 h-3 text-gold" />
                  Product Form
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream">
                  {editingProduct ? `Edit Saree: ${editingProduct.name}` : 'Add New Saree Product'}
                </h2>
                <p className="text-xs text-stone-300 mt-0.5">
                  Enter saree title, choose category, set pricing, and upload photo from gallery.
                </p>
              </div>

              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-cream rounded-lg text-xs font-bold border border-white/20 transition self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold" />
                  Cancel Edit (Add New Instead)
                </button>
              )}
            </div>

            {/* Direct Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 text-xs">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Saree Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Crimson Banarasi Katan Silk Saree"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category * (11 Dynamic Showcase Sections)
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm font-medium"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price & Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="24999"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="19999"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Upload Photo from Gallery */}
              <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200">
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Saree Photo (Gallery Upload)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="flex items-center gap-4 p-2.5 bg-white rounded-xl border border-stone-200 shadow-sm max-w-md">
                    <img
                      src={imageUrl}
                      alt="Uploaded saree"
                      className="w-16 h-20 object-cover rounded-lg border border-stone-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 text-xs">✓ Photo Uploaded from Gallery</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Ready for website showcase</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="text-[11px] text-primary hover:underline font-bold mt-1 inline-block"
                      >
                        Change Photo
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-secondary text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                          <span>Uploading from Gallery...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gold" />
                          <span>📷 Upload Photo from Gallery</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-stone-500">
                      Tap to choose photo from mobile gallery or device files
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      category: categories[0]?._id || '',
                      price: '',
                      discountPrice: '',
                    });
                    setImageUrl('');
                  }}
                  className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-medium"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-lg font-bold shadow-md flex items-center gap-2 text-xs uppercase tracking-wider transition-all"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingProduct ? 'Save Product Changes' : '✨ Publish Saree Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: INVENTORY & CATALOG LIST */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-sm">
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-2 px-3 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="py-2 px-3 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="all">All Stock Status</option>
                  <option value="low">Low Stock (≤ 5)</option>
                  <option value="out">Out of Stock (0)</option>
                </select>
              </div>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-extrabold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4 text-white stroke-[3]" />
                Add New Saree
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider font-extrabold border-b border-stone-200">
                    <tr>
                      <th className="py-3.5 px-4 font-extrabold">Saree & SKU</th>
                      <th className="py-3.5 px-4 font-extrabold">Category</th>
                      <th className="py-3.5 px-4 font-extrabold">Price / Discount</th>
                      <th className="py-3.5 px-4 font-extrabold">Stock Status</th>
                      <th className="py-3.5 px-4 font-extrabold">Highlights</th>
                      <th className="py-3.5 px-4 text-right font-extrabold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-stone-400 font-bold">
                          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          Loading saree inventory...
                        </td>
                      </tr>
                    ) : products.length > 0 ? (
                      products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-stone-50/80 transition-colors">
                          {/* Saree & SKU */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images?.[0] || 'https://via.placeholder.com/60'}
                                alt={prod.name}
                                className="w-12 h-14 object-cover rounded shadow-sm border border-stone-200 shrink-0"
                              />
                              <div>
                                <p className="font-extrabold text-stone-950 text-sm max-w-[220px] truncate leading-tight">
                                  {prod.name}
                                </p>
                                <p className="text-[11px] font-mono font-bold text-stone-500 mt-0.5">
                                  {prod.sku}
                                </p>
                                <a
                                  href={`/product/${prod.slug || prod._id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-bold text-primary hover:text-gold inline-flex items-center gap-0.5 mt-0.5"
                                >
                                  Live View <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-stone-900 text-xs">
                              {prod.category?.name || 'Saree'}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            <p className="font-extrabold text-stone-950 text-xs">
                              {formatPrice(prod.discountPrice || prod.price)}
                            </p>
                            {prod.discountPrice && (
                              <p className="text-[10px] text-stone-400 line-through">
                                {formatPrice(prod.price)}
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded text-xs font-extrabold ${
                                prod.stock <= 0
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : prod.stock <= 5
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {prod.stock <= 0 ? 'Out of Stock' : `${prod.stock} in stock`}
                            </span>
                          </td>

                          {/* Highlights */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                              {prod.isBridal && (
                                <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-extrabold uppercase">
                                  Bridal
                                </span>
                              )}
                              {prod.isBestSeller && (
                                <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-extrabold uppercase">
                                  Best Seller
                                </span>
                              )}
                              {prod.isFeatured && (
                                <span className="px-2 py-0.5 rounded bg-gold text-primary text-[10px] font-extrabold uppercase">
                                  Featured
                                </span>
                              )}
                              {prod.isNewArrival && (
                                <span className="px-2 py-0.5 rounded bg-blue-700 text-white text-[10px] font-extrabold uppercase">
                                  New
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                title="Edit Saree Details"
                                className="p-1.5 text-stone-600 hover:text-primary hover:bg-stone-100 rounded transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(prod._id, prod.name)}
                                title="Remove from Catalog"
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-stone-400">
                          No sarees match your current search and filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
