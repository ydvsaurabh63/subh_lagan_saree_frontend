import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Sparkles, Shirt } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatters.js';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useTryOn } from '../../context/TryOnContext.jsx';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { tryOnProduct } = useTryOn();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discountLabel = calculateDiscount(product.price, product.discountPrice);
  const primaryImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

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

  const handleTryOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    tryOnProduct(product);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-gold/60 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col">
      {/* Saree Image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Visual Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isBridal && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-primary text-white rounded shadow-sm">
              Bridal
            </span>
          )}
          {product.isBestSeller && !product.isBridal && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded shadow-sm">
              Best Seller
            </span>
          )}
          {discountLabel && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-emerald-700 text-white rounded shadow-sm">
              {discountLabel}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-transform active:scale-90 shadow-md z-10 ${
            inWishlist
              ? 'bg-primary text-white'
              : 'bg-white/90 text-stone-600 hover:text-primary hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Try On Button (matching Image 2 amber shirt icon) */}
        <button
          onClick={handleTryOnClick}
          className="absolute top-10 right-2 p-1.5 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white shadow-md transition-all active:scale-90 hover:scale-110 z-10 flex items-center justify-center group/try"
          title="Try on this saree in Fitting Room"
          aria-label="Try on saree"
        >
          <Shirt className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>

        {/* Quick Add To Cart on Hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 left-2 right-2 py-2 px-3 bg-white/95 backdrop-blur-sm text-primary hover:bg-primary hover:text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </Link>

      {/* Product Details (Compact & Visual) */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Fabric Pill & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-gold-dark font-extrabold truncate uppercase tracking-wider text-[11px]">
              {product.fabric}
            </span>
            <div className="flex items-center text-amber-500 font-extrabold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
              <span>{product.ratings || 4.8}</span>
            </div>
          </div>

          {/* Saree Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-xs sm:text-sm font-bold text-stone-950 group-hover:text-primary transition-colors line-clamp-1 mb-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Tag */}
        <div className="pt-2 border-t border-stone-200/90 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm font-black text-primary font-sans tracking-tight">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-[11px] font-bold text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleTryOnClick}
              className="text-[10px] px-2 py-0.5 bg-[#D97706]/10 hover:bg-[#D97706] text-[#B45309] hover:text-white rounded font-extrabold border border-[#D97706]/30 transition-all flex items-center space-x-1"
              title="Try this on in Fitting Room"
            >
              <Shirt className="w-3 h-3 stroke-[2.2]" />
              <span>Try On</span>
            </button>
            <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-800 rounded font-extrabold border border-stone-200">
              COD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
