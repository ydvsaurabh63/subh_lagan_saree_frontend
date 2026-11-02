import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { categoryApi, adminApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Tags, Sparkles } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        const res = await adminApi.updateCategory(editingCategory._id, formData);
        if (res.success) {
          toast.success('Category updated successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await adminApi.createCategory(formData);
        if (res.success) {
          toast.success('New saree category created');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }
    try {
      const res = await adminApi.deleteCategory(id);
      if (res.success) {
        toast.success('Category deleted');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <AdminLayout title="Saree Category Management">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-sm">
          <div>
            <h3 className="font-serif text-lg font-extrabold text-primary">
              All Saree Categories ({categories.length})
            </h3>
            <p className="text-xs text-stone-600 font-bold">
              Categories displayed across the navbar, shop filters, and homepage collections
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-cream font-extrabold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 text-gold stroke-[3]" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400 font-bold">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="font-mono text-[11px] text-gold uppercase tracking-wider font-extrabold">
                      slug: {cat.slug}
                    </span>
                    <h4 className="font-serif text-lg font-extrabold leading-tight">
                      {cat.name}
                    </h4>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-700 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {cat.description || 'Artisanal collection curated by Subh Lagan Sarees.'}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase">
                      {cat.status || 'Active'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit Category"
                        className="p-1.5 text-stone-600 hover:text-primary hover:bg-stone-100 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        title="Delete Category"
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gold/40">
            <div className="p-4 bg-primary text-cream flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-cream">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chanderi Silk Sarees"
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {formData.image && (
                  <div className="mt-2 h-24 rounded-lg overflow-hidden border border-stone-200">
                    <img
                      src={formData.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short artisanal narrative about this saree category..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

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
                  className="px-6 py-2 bg-primary hover:bg-secondary text-cream rounded-lg font-bold shadow-md flex items-center gap-2"
                >
                  {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;

