import React from 'react';
import { RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

const ProductFilters = ({
  categories = [],
  filterOptions = { fabrics: [], colors: [], occasions: [] },
  selectedFilters,
  onFilterChange,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const fabricsList = filterOptions.fabrics?.length
    ? filterOptions.fabrics
    : ['Pure Katan Silk', 'Pure Kanchipuram Silk', 'Paithani Silk', 'Chanderi Cotton Silk', 'Pure Organza Silk', 'Viscose Georgette', 'Pure Chiffon'];

  const colorsList = filterOptions.colors?.length
    ? filterOptions.colors
    : ['Royal Maroon', 'Emerald Green', 'Rani Pink', 'Bridal Red', 'Mustard Gold', 'Blush Pink', 'Navy Blue', 'Coral Peach', 'Turquoise Blue', 'Antique Gold', 'Wine Purple'];

  const occasionsList = filterOptions.occasions?.length
    ? filterOptions.occasions
    : ['Bridal', 'Wedding', 'Festive', 'Party Wear', 'Traditional'];

  const handleCategorySelect = (slug) => {
    onFilterChange('category', slug === selectedFilters.category ? '' : slug);
  };

  const handleFabricToggle = (fabric) => {
    let current = selectedFilters.fabric ? selectedFilters.fabric.split(',') : [];
    if (current.includes(fabric)) {
      current = current.filter((f) => f !== fabric);
    } else {
      current.push(fabric);
    }
    onFilterChange('fabric', current.join(','));
  };

  const handleColorToggle = (color) => {
    let current = selectedFilters.color ? selectedFilters.color.split(',') : [];
    if (current.includes(color)) {
      current = current.filter((c) => c !== color);
    } else {
      current.push(color);
    }
    onFilterChange('color', current.join(','));
  };

  const handleOccasionToggle = (occasion) => {
    let current = selectedFilters.occasion ? selectedFilters.occasion.split(',') : [];
    if (current.includes(occasion)) {
      current = current.filter((o) => o !== occasion);
    } else {
      current.push(occasion);
    }
    onFilterChange('occasion', current.join(','));
  };

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-5' : 'bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-brandText">
          <SlidersHorizontal className="w-4 h-4 text-gold-dark" />
          <h3 className="font-serif text-base font-bold">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-xs text-stone-500 hover:text-primary transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-md text-stone-500 hover:text-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange('category', '')}
            className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition ${
              !selectedFilters.category
                ? 'bg-primary text-white font-medium'
                : 'text-stone-600 hover:bg-cream'
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => {
            const isSelected = selectedFilters.category === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition ${
                  isSelected
                    ? 'bg-primary text-white font-medium'
                    : 'text-stone-600 hover:bg-cream'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasion Filter */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
          Occasion
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {occasionsList.map((occ) => {
            const active = selectedFilters.occasion?.split(',').includes(occ);
            return (
              <button
                key={occ}
                onClick={() => handleOccasionToggle(occ)}
                className={`px-2.5 py-1 rounded-full text-xs transition border ${
                  active
                    ? 'bg-gold text-white border-gold font-medium'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-gold'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
          Pure Fabrics
        </h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {fabricsList.map((fabric) => {
            const checked = selectedFilters.fabric?.split(',').includes(fabric);
            return (
              <label
                key={fabric}
                className="flex items-center space-x-2 text-xs text-stone-600 cursor-pointer hover:text-primary select-none"
              >
                <input
                  type="checkbox"
                  checked={checked || false}
                  onChange={() => handleFabricToggle(fabric)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-stone-300"
                />
                <span className="truncate">{fabric}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
          Color Palette
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {colorsList.map((color) => {
            const active = selectedFilters.color?.split(',').includes(color);
            return (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`px-2 py-1 text-xs rounded border transition ${
                  active
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-white'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-500 uppercase">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={selectedFilters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-500 uppercase">Max Price</label>
            <input
              type="number"
              placeholder="50000"
              value={selectedFilters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

