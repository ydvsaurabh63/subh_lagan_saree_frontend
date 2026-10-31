import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, calculateDiscount } from '../utils/formatters.js';

import Breadcrumb from '../components/common/Breadcrumb.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-cream/20 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'My Wishlist' }]} />
          <EmptyState
            icon={Heart}
            title="Your Wishlist is Empty"
            description="You haven't saved any sarees yet. Save your favorite Banarasi, Kanjivaram, and designer drapes for later!"
            buttonText="Discover Sarees"
            buttonLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />

        <div className="pb-4 border-b border-stone-200 mt-2 flex items-baseline justify-between">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Saved Sarees ({wishlist.length})
          </h1>
          <Link to="/shop" className="text-xs font-semibold text-primary hover:text-gold-dark uppercase tracking-wider">
            Explore More Sarees →
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {wishlist.map((item) => {
            const product = item;
            if (!product) return null;
            const price = product.discountPrice || product.price;
            const discountLabel = calculateDiscount(product.price, product.discountPrice);
            const image = (product.images && product.images[0]) || '';

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-luxury-hover transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-cream overflow-hidden">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {discountLabel && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white rounded">
                      {discountLabel}
                    </span>
                  )}

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-stone-500 hover:text-rose-600 rounded-full shadow transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-dark">
                      {product.fabric || 'Pure Silk'}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block font-serif text-sm font-semibold text-brandText hover:text-primary transition line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-sm font-bold text-primary font-sans">{formatPrice(price)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full py-2.5 px-3 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move To Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

