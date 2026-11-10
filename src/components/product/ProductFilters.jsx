import React from 'react';
import { RotateCcw, X, SlidersHorizontal, Check } from 'lucide-react';

// Color map for luxury visual color swatches
const COLOR_SWATCH_MAP = {
  'Red': { hex: '#DC2626', label: 'Red' },
  'Bridal Red': { hex: '#B91C1C', label: 'Bridal Red' },
  'Crimson Red': { hex: '#991B1B', label: 'Crimson' },
  'Sindoor Scarlet': { hex: '#E11D48', label: 'Scarlet' },
  'Ruby Red': { hex: '#9F1239', label: 'Ruby Red' },
  'Maroon': { hex: '#831843', label: 'Maroon' },
  'Royal Maroon': { hex: '#681B2C', label: 'Royal Maroon' },
  'Deep Wine Plum': { hex: '#4A044E', label: 'Wine Plum' },
  'Wine Purple': { hex: '#581C87', label: 'Wine' },
  'Pink': { hex: '#EC4899', label: 'Pink' },
  'Rani Pink': { hex: '#BE185D', label: 'Rani Pink' },
  'Royal Rani Pink': { hex: '#9D174D', label: 'Rani Pink' },
  'Blush Pink': { hex: '#F472B6', label: 'Blush' },
  'Pastel Peach': { hex: '#FDA4AF', label: 'Peach' },
  'Coral Peach': { hex: '#FB923C', label: 'Coral' },
  'Green': { hex: '#16A34A', label: 'Green' },
  'Emerald Green': { hex: '#059669', label: 'Emerald' },
  'Royal Emerald Green': { hex: '#064E3B', label: 'Emerald' },
  'Teal Turquoise': { hex: '#0D9488', label: 'Teal' },
  'Turquoise Blue': { hex: '#06B6D4', label: 'Turquoise' },
  'Blue': { hex: '#2563EB', label: 'Blue' },
  'Navy Blue': { hex: '#1E3A8A', label: 'Navy' },
  'Indigo Blue': { hex: '#3730A3', label: 'Indigo' },
  'Yellow': { hex: '#EAB308', label: 'Yellow' },
  'Mustard Gold': { hex: '#CA8A04', label: 'Mustard' },
  'Haldi Mustard Yellow': { hex: '#EAB308', label: 'Mustard' },
  'Gold': { hex: '#D4AF37', label: 'Gold' },
  'Antique Gold': { hex: '#B8860B', label: 'Antique Gold' },
  'Champagne Gold': { hex: '#E5D3B3', label: 'Champagne' },
  'Rose Gold': { hex: '#B76E79', label: 'Rose Gold' },
  'White': { hex: '#FFFFFF', label: 'White' },
  'Black': { hex: '#1C1917', label: 'Black' },
};

const getColorInfo = (rawColor) => {
  if (!rawColor) return { hex: '#A8A29E', label: 'Other' };
  if (COLOR_SWATCH_MAP[rawColor]) return COLOR_SWATCH_MAP[rawColor];

  const lower = rawColor.toLowerCase();
  for (const [key, val] of Object.entries(COLOR_SWATCH_MAP)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return { hex: '#A8A29E', label: rawColor.length > 10 ? rawColor.slice(0, 10) : rawColor };
};

const ProductFilters = ({
  categories = [],
  filterOptions = { fabrics: [], colors: [], occasions: [] },
  selectedFilters,
  onFilterChange,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  // Clean Fabrics list: remove blanks and duplicates
  const rawFabrics = filterOptions.fabrics?.length
    ? filterOptions.fabrics
    : ['Pure Katan Silk', 'Pure Kanchipuram Silk', 'Paithani Silk', 'Chanderi Cotton Silk', 'Pure Organza Silk', 'Viscose Georgette', 'Pure Chiffon'];
  const fabricsList = Array.from(new Set(rawFabrics.filter((f) => f && f.trim() !== '')));

  // Clean Colors list: remove blanks and duplicates
  const rawColors = filterOptions.colors?.length
    ? filterOptions.colors
    : ['Royal Maroon', 'Emerald Green', 'Rani Pink', 'Bridal Red', 'Mustard Gold', 'Blush Pink', 'Navy Blue', 'Coral Peach', 'Turquoise Blue', 'Antique Gold', 'Wine Purple'];
  const colorsList = Array.from(new Set(rawColors.filter((c) => c && c.trim() !== '')));

  // Clean Occasions list: filter out non-fashion or long composite junk
  const rawOccasions = filterOptions.occasions?.length
    ? filterOptions.occasions
    : ['Bridal', 'Wedding', 'Festive', 'Party Wear', 'Traditional'];
  const occasionsList = Array.from(
    new Set(
      rawOccasions
        .filter((o) => o && o.trim() !== '')
        .map((o) => {
          // Simplify long salon/composite tags
          if (o.includes('Bridal')) return 'Bridal';
          if (o.includes('Wedding')) return 'Wedding';
          if (o.includes('Festive')) return 'Festive';
          if (o.includes('Party')) return 'Party Wear';
          if (o.includes('Hair') || o.includes('Curling') || o.includes('Glam')) return null;
          return o.length > 15 ? o.split('/')[0].trim() : o;
        })
        .filter(Boolean)
    )
  );

  const activeCount = [
    selectedFilters.category,
    selectedFilters.fabric,
    selectedFilters.color,
    selectedFilters.occasion,
    selectedFilters.minPrice || selectedFilters.maxPrice,
  ].filter(Boolean).length;

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
    <div
      className={`space-y-5 ${
        isMobileDrawer
          ? 'p-4'
          : 'bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-serif text-sm font-bold text-stone-900">Filters</h3>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 text-[11px] text-stone-500 hover:text-primary transition cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          {isMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-md text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Categories */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Category
        </h4>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onFilterChange('category', '')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              !selectedFilters.category
                ? 'bg-primary text-white font-bold shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
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
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Occasion Filter (Clean, Concise Pills) */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Occasion
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {occasionsList.map((occ) => {
            const active = selectedFilters.occasion?.split(',').includes(occ);
            return (
              <button
                key={occ}
                type="button"
                onClick={() => handleOccasionToggle(occ)}
                className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer font-medium select-none ${
                  active
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-transparent'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Pure Fabrics (Clean, No blanks) */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Fabric
        </h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {fabricsList.map((fabric) => {
            const checked = selectedFilters.fabric?.split(',').includes(fabric);
            return (
              <label
                key={fabric}
                className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer hover:text-primary select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked || false}
                  onChange={() => handleFabricToggle(fabric)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-stone-300 cursor-pointer"
                />
                <span className="truncate">{fabric}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Color Palette (Visual Color Swatches with -70% Text Reduction) */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Colors
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {colorsList.map((color) => {
            const active = selectedFilters.color?.split(',').includes(color);
            const info = getColorInfo(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => handleColorToggle(color)}
                title={color}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition cursor-pointer select-none border ${
                  active
                    ? 'border-primary bg-primary text-white font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    active ? 'ring-1 ring-white' : 'border border-black/20'
                  }`}
                  style={{ backgroundColor: info.hex }}
                />
                <span className="truncate max-w-[80px]">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Range Filter */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={selectedFilters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full text-xs pl-6 pr-2 py-1.5 border border-stone-200 rounded-lg focus:border-primary focus:outline-none bg-stone-50/50"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={selectedFilters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full text-xs pl-6 pr-2 py-1.5 border border-stone-200 rounded-lg focus:border-primary focus:outline-none bg-stone-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
