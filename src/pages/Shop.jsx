import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api.js';

import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X, AlertCircle, RefreshCw } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ fabrics: [], colors: [], occasions: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Extract query filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const selectedFabric = searchParams.get('fabric') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedOccasion = searchParams.get('occasion') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const isBridal = searchParams.get('isBridal') || '';
  const isBestSeller = searchParams.get('isBestSeller') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';

  // Fetch Categories & Filter Facets once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, filterRes] = await Promise.all([
          categoryApi.getCategories(),
          productApi.getFilters(),
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (filterRes.success) setFilterOptions(filterRes);
      } catch (err) {
        console.error('Error fetching filter facets:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedFabric) params.fabric = selectedFabric;
      if (selectedColor) params.color = selectedColor;
      if (selectedOccasion) params.occasion = selectedOccasion;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (isBridal) params.isBridal = isBridal;
      if (isBestSeller) params.isBestSeller = isBestSeller;
      if (isNewArrival) params.isNewArrival = isNewArrival;

      const res = await productApi.getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || 0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setFetchError(err.message || 'Server is waking up or database is connecting.');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, selectedCategory, searchQuery, selectedFabric, selectedColor, selectedOccasion, minPrice, maxPrice, isBridal, isBestSeller, isNewArrival]);

  // Fetch Products whenever URL search params change
  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setMobileDrawerOpen(false);
  };

  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
    }
  };

  return (
    <div className="bg-cream/30 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-primary-dark text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'All Sarees' }]} />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
            All Sarees
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Control Bar: Search & Active Filters Counter & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold uppercase tracking-wider text-primary shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <p className="text-xs text-stone-600 font-medium">
              Showing <span className="font-bold text-primary">{totalProducts}</span> sarees
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <label className="text-xs text-stone-500 whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold font-medium text-brandText"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="best-seller">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              categories={categories}
              filterOptions={filterOptions}
              selectedFilters={{
                category: selectedCategory,
                fabric: selectedFabric,
                color: selectedColor,
                occasion: selectedOccasion,
                minPrice,
                maxPrice,
              }}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {fetchError && products.length === 0 && !loading ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto my-6">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                  Connecting to Saree Vault...
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mb-5">
                  The live cloud backend or database is initializing. Please click below to refresh and load sarees.
                </p>
                <button
                  onClick={fetchProducts}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-secondary text-cream rounded-lg text-xs font-bold transition shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Sarees
                </button>
              </div>
            ) : (
              <ProductGrid
                products={products}
                loading={loading}
                emptyTitle="No Sarees Match Your Filters"
                emptyDescription="Try clearing some filter options or selecting another category."
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-8 border-t border-stone-200">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-stone-300 bg-white text-stone-600 hover:border-gold hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                        page === pageNum
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white border border-stone-300 text-stone-700 hover:border-gold hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-stone-300 bg-white text-stone-600 hover:border-gold hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto">
            <ProductFilters
              categories={categories}
              filterOptions={filterOptions}
              selectedFilters={{
                category: selectedCategory,
                fabric: selectedFabric,
                color: selectedColor,
                occasion: selectedOccasion,
                minPrice,
                maxPrice,
              }}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
