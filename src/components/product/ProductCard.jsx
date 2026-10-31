import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatters.js';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discountLabel = calculateDiscount(product.price, product.discountPrice);
  const primaryImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = (product.images && product.images[1]) || primaryImage;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-gold/60 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isBridal && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-primary text-white rounded shadow-sm">
              Bridal Couture
            </span>
          )}
          {product.isBestSeller && !product.isBridal && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-stone-900 text-white rounded shadow-sm">
              New Arrival
            </span>
          )}
          {discountLabel && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-700 text-white rounded shadow-sm">
              {discountLabel}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-transform active:scale-90 shadow-md z-10 ${
            inWishlist
              ? 'bg-primary text-white'
              : 'bg-white/90 text-stone-600 hover:text-primary hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick Add To Cart on Hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 left-2.5 right-2.5 py-2 px-3 bg-white/95 backdrop-blur-sm text-primary hover:bg-primary hover:text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Fabric & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="truncate uppercase tracking-wider font-medium text-gold-dark">
              {product.fabric || product.category?.name || 'Silk Saree'}
            </span>
            <div className="flex items-center text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-current mr-0.5" />
              <span>{product.ratings || 4.8}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-sm font-semibold text-brandText group-hover:text-primary transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Color & Occasion Specs */}
          <p className="text-[11px] text-stone-400 line-clamp-1 mb-2">
            Color: <span className="text-stone-600">{product.color}</span> • Occasion: <span className="text-stone-600">{product.occasion}</span>
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-bold text-primary font-sans">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">
            COD Avail.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

