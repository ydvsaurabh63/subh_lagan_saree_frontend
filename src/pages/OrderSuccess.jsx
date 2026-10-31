import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { CheckCircle2, Package, ArrowRight, Home, ShieldCheck } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-cream/30 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/40 shadow-luxury text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-md">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
              Subh Lagan Mubarak
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-1">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
              Thank you, <strong>{order.customerDetails?.name}</strong>. Your royal saree order has been received. Our weavers and quality inspection team are preparing your handcrafted trousseau with the utmost devotion.
            </p>
          </div>

          {/* Order Details Badge Box */}
          <div className="bg-cream/70 rounded-2xl p-5 border border-gold/40 text-left text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Order Number:</span>
              <strong className="font-sans text-sm text-primary">{order.orderNumber}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Payment Mode:</span>
              <strong className="text-stone-800">Cash On Delivery (COD)</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Total Payable at Delivery:</span>
              <strong className="font-sans text-base text-primary">{formatPrice(order.totalAmount)}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between pt-1">
              <span className="text-stone-500">Delivery Address:</span>
              <span className="text-stone-800 text-right max-w-sm">
                {order.shippingAddress?.houseNo}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </span>
            </div>
          </div>

          {/* Ordered items summary */}
          <div className="border border-stone-200 rounded-2xl p-4 text-left divide-y divide-stone-100">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary pb-2">
              Items in this Parcel
            </h4>
            {order.items?.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-10 h-12 object-cover object-top rounded border border-stone-200"
                  />
                  <div>
                    <p className="font-medium text-brandText">{it.name}</p>
                    <p className="text-stone-400">Qty: {it.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-brandText">{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>A confirmation email with dispatch details has been scheduled for your inbox.</span>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/profile?tab=orders"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow transition"
            >
              <Package className="w-4 h-4" />
              <span>Track Your Order</span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-cream hover:bg-stone-100 text-brandText border border-stone-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition"
            >
              <Home className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

