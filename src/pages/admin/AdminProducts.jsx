import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { productApi, categoryApi, adminApi, uploadApi } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    sku: '',
    category: '',
    price: '',
    discountPrice: '',
    fabric: 'Pure Katan Silk',
    color: 'Royal Maroon',
    sareeLength: '5.5 Meters',
    blouseDetails: '0.8 Meters Unstitched Silk Blouse Piece',
    occasion: 'Bridal',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'],
    description: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isBridal: false,
  };
  const [formData, setFormData] = useState(initialForm);
  const [imageInput, setImageInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      if (res.success) {
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

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
    });
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      sku: prod.sku || '',
      category: prod.category?._id || prod.category || '',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
      fabric: prod.fabric || 'Pure Silk',
      color: prod.color || 'Maroon',
      sareeLength: prod.sareeLength || '5.5 Meters',
      blouseDetails: prod.blouseDetails || '0.8 Meters Unstitched Silk Blouse',
      occasion: prod.occasion || 'Wedding',
      stock: prod.stock !== undefined ? prod.stock : 10,
      images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'],
      description: prod.description || '',
      isFeatured: Boolean(prod.isFeatured),
      isBestSeller: Boolean(prod.isBestSeller),
      isNewArrival: Boolean(prod.isNewArrival),
      isBridal: Boolean(prod.isBridal),
    });
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput.trim()],
    }));
    setImageInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.url],
        }));
        toast.success('Image uploaded to Cloudinary successfully!');
      }
    } catch (err) {
      toast.error('Image upload failed: ' + (err.message || 'Error'));
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
      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct._id, formData);
        if (res.success) {
          toast.success('Saree product updated successfully');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await adminApi.createProduct(formData);
        if (res.success) {
          toast.success('New saree added to boutique catalog');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
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
    <AdminLayout title="Saree Inventory & Catalog">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-sm">
          <div className="flex-1 flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, fabric..."
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
            onClick={handleOpenAddModal}
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
                  <th className="py-3.5 px-4 font-extrabold">Category & Fabric</th>
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

                      {/* Category & Fabric */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 text-xs">
                          {prod.category?.name || 'Unassigned'}
                        </span>
                        <p className="text-[11px] text-stone-600 font-semibold mt-0.5">
                          {prod.fabric} • {prod.color}
                        </p>
                      </td>

                      {/* Price / Discount */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-sm text-primary">
                          {formatPrice(prod.discountPrice || prod.price)}
                        </div>
                        {prod.discountPrice && prod.discountPrice < prod.price && (
                          <div className="text-[11px] font-bold text-stone-400 line-through">
                            {formatPrice(prod.price)}
                          </div>
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
                            onClick={() => handleOpenEditModal(prod)}
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

      {/* Add / Edit Saree Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-gold/30 my-8">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingProduct ? 'Edit Saree Details' : 'Add New Saree to Boutique'}
                </h3>
                <p className="text-[11px] text-white/80">
                  Update product descriptions, high-resolution photography, and live inventory
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
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
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
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

              {/* Row 2: Price, Discount Price, Stock, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Auto-generated if blank"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Row 3: Fabric, Color, Occasion, Length */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Pure Katan Silk"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Royal Maroon"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="Party Wear">Party Wear</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Length</label>
                  <input
                    type="text"
                    value={formData.sareeLength}
                    onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                    placeholder="5.5 Meters"
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Row 4: Blouse Details */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Blouse Piece Details
                </label>
                <input
                  type="text"
                  value={formData.blouseDetails}
                  onChange={(e) => setFormData({ ...formData, blouseDetails: e.target.value })}
                  placeholder="0.8 Meters Unstitched Brocade Silk Blouse Piece with Zari Border"
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 5: Product Images (Cloudinary Direct File Upload & URL list) */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product Photography (Cloudinary Upload / Image URLs)
                </label>

                {/* Upload from Device or Paste URL */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 font-semibold shrink-0"
                    >
                      Add URL
                    </button>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:brightness-110 font-bold transition shadow-sm disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gold" />
                          Upload from Device
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Previews */}
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-24 rounded-lg overflow-hidden border border-stone-200 shadow-sm"
                    >
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 shadow transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Artisanal Story & Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the zari craftsmanship, weave history, and pallu detailing..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 7: Badges Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBridal}
                    onChange={(e) => setFormData({ ...formData, isBridal: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Bridal Couture</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Featured Saree</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-bold shadow-md flex items-center gap-2"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Publish Saree to Boutique'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;

