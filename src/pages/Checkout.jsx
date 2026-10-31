import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orderApi, userApi } from '../services/api.js';
import { formatPrice } from '../utils/formatters.js';

import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { ShieldCheck, Truck, Check, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  // Pre-fill user data and saved addresses if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));

      // Fetch saved addresses
      userApi.getAddresses().then((res) => {
        if (res.success && res.addresses && res.addresses.length > 0) {
          setSavedAddresses(res.addresses);
          const defaultAddr = res.addresses.find((a) => a.isDefault) || res.addresses[0];
          setFormData((prev) => ({
            ...prev,
            houseNo: defaultAddr.houseNo,
            street: defaultAddr.street,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            phone: defaultAddr.phone || prev.phone,
          }));
        }
      }).catch((err) => console.error('Error fetching addresses:', err));
    }
  }, [isAuthenticated, user]);

  // If cart is empty, redirect to cart
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const deliveryFee = subtotal >= 1999 || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      houseNo: addr.houseNo,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone || prev.phone,
    }));
    toast.success('Address applied!');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to place your order');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.houseNo ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error('Please fill in all delivery details completely');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          houseNo: formData.houseNo,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        notes: formData.notes,
        items: items.map((it) => ({
          productId: it.product?._id || it.product,
          name: it.product?.name || 'Saree',
          quantity: it.quantity,
          price: it.product?.discountPrice || it.product?.price || 0,
        })),
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        toast.success('Order placed successfully via Cash on Delivery!');
        navigate('/order-success', { state: { order: res.order } });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Cart', link: '/cart' }, { label: 'Cash on Delivery Checkout' }]} />

        <div className="pb-4 border-b border-stone-200 mt-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Cash On Delivery (COD) Checkout
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Safe, verified ordering. Pay in cash when your handcrafted saree arrives at your doorstep.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>You are currently checking out as a guest. Please sign in to link this order with your profile.</span>
            </div>
            <Link to="/login" className="px-3 py-1 bg-primary text-white rounded font-medium hover:bg-primary-light">
              Sign In
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Columns: Address Form & Payment Method Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saved Addresses quick select */}
            {savedAddresses.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
                <h3 className="font-serif text-sm font-bold text-brandText">
                  Select a Saved Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <button
                      type="button"
                      key={addr._id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="p-3 text-left border rounded-xl hover:border-gold hover:bg-cream/40 transition text-xs space-y-1"
                    >
                      <p className="font-semibold text-brandText">{addr.fullName} ({addr.phone})</p>
                      <p className="text-stone-500 line-clamp-2">
                        {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Address Form */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-primary border-b border-stone-100 pb-2">
                1. Customer & Delivery Address Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Email Address * (For order confirmation & tracking updates)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Flat / House No. / Building *
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 302, Krishna Heights"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Street Address / Colony / Landmark *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. Opp. City Garden, MG Road"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Jaipur"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajasthan"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 302001"
                    required
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before delivery, deliver after 2 PM"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method: Cash on Delivery Only */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
              <h2 className="font-serif text-base font-bold text-primary border-b border-stone-100 pb-2">
                2. Payment Method
              </h2>
              <div className="p-4 rounded-xl border-2 border-primary bg-cream/40 flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-primary">Cash on Delivery (COD)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      VERIFIED & FREE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Pay with exact cash or scan UPI directly at your doorstep when the delivery partner hands over your royal saree parcel. No advance online payment needed!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Preview & Submit */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4 sticky top-28">
              <h2 className="font-serif text-base font-bold text-brandText border-b border-stone-100 pb-3">
                Ordered Sarees ({items.length})
              </h2>

              {/* Items List Mini Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => {
                  const product = it.product;
                  const price = product?.discountPrice || product?.price || 0;
                  return (
                    <div key={product?._id || it._id} className="flex items-center space-x-3 text-xs">
                      <img
                        src={(product?.images && product?.images[0]) || ''}
                        alt={product?.name}
                        className="w-12 h-14 object-cover object-top rounded border border-stone-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-brandText truncate">{product?.name}</p>
                        <p className="text-stone-400">Qty: {it.quantity}</p>
                      </div>
                      <span className="font-bold text-brandText">
                        {formatPrice(price * it.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-brandText">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges:</span>
                  <span className="font-semibold text-brandText">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-primary">Payable on Delivery:</span>
                  <span className="font-sans text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-gold" />
                <span>{loading ? 'Placing Order...' : 'Place Order (Cash On Delivery)'}</span>
              </button>

              <p className="text-[11px] text-stone-400 text-center">
                By placing your order, you agree to Subh Lagan Sarees' Terms of Service and Delivery Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

