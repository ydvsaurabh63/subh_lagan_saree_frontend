import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatters.js';

import CartItem from '../components/cart/CartItem.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

const Cart = () => {
  const { items, subtotal, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 1999;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (!items || items.length === 0) {
    return (
      <div className="bg-cream/20 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
          <EmptyState
            icon={ShoppingBag}
            title="Your Saree Cart is Empty"
            description="Explore our magnificent collection of handwoven Banarasi, Kanjivaram, and pure silk sarees to adorn your celebrations."
            buttonText="Explore Sarees"
            buttonLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

        <div className="flex flex-col sm:flex-row items-baseline justify-between pb-4 border-b border-stone-200 mt-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Shopping Cart ({totalQuantity} {totalQuantity === 1 ? 'Saree' : 'Sarees'})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-rose-600 transition underline mt-2 sm:mt-0"
          >
            Clear All Sarees
          </button>
        </div>

        {/* Free Delivery Progress Banner */}
        <div className="mt-6 p-4 rounded-xl bg-white border border-gold/40 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary mb-2">
            <Truck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>
              {isFreeDelivery
                ? 'Congratulations! You unlocked Free Pan-India Delivery!'
                : `Add ${formatPrice(amountNeededForFreeDelivery)} more to unlock Free Pan-India Delivery`}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Main Grid: Cart Items & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
            <div className="divide-y divide-stone-100">
              {items.map((item) => (
                <CartItem
                  key={item.product?._id || item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="pt-6 flex justify-between items-center text-xs">
              <Link
                to="/shop"
                className="text-primary hover:text-gold-dark font-semibold uppercase tracking-wider flex items-center space-x-1"
              >
                <span>← Continue Shopping</span>
              </Link>
              <span className="text-stone-400">All prices include GST</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-brandText border-b border-stone-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} items):</span>
                  <span className="font-semibold text-brandText">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-brandText">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Payment Method:</span>
                  <span className="font-medium text-primary">Cash on Delivery (COD)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-primary">Total Amount:</span>
                <span className="font-sans text-xl font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="bg-cream/60 rounded-xl p-3 border border-gold/30 text-[11px] text-stone-600 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  Safe & hassle-free Cash on Delivery order placement. No advance payment required!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
