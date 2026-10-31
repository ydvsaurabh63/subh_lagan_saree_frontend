import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Shipping & Delivery Policy' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-6 mt-6">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-stone-500">Effective Date: October 2026</p>
          <div className="w-16 h-0.5 bg-gold"></div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h3 className="font-serif text-base font-bold text-brandText">1. Free Delivery on Orders Over ₹1,999</h3>
            <p>
              Subh Lagan Sarees offers complimentary standard express shipping across all states and Union Territories in India for every order with a subtotal exceeding ₹1,999. For orders below this amount, a flat subsidized shipping fee of ₹99 is applicable.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">2. Cash on Delivery (COD)</h3>
            <p>
              Cash on Delivery (COD) is available nationwide for eligible pin codes. No advance payment or card details are requested online. Customers are requested to have the exact cash amount ready upon delivery.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">3. Dispatch & Transit Timeline</h3>
            <p>
              - <strong>Order Processing:</strong> All orders are carefully quality inspected and dispatched within 24 to 48 hours of order placement.<br />
              - <strong>Metro Cities:</strong> Delivery in 3 to 5 business days.<br />
              - <strong>Non-Metro / Rest of India:</strong> Delivery in 5 to 7 business days.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">4. Parcel Tracking</h3>
            <p>
              Once your parcel leaves our Jaipur central fulfillment warehouse, tracking details are updated directly under your <strong>My Orders</strong> profile tab and dispatched to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

