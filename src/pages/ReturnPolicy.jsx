import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';

const ReturnPolicy = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Return & Exchange Policy' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-6 mt-6">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Return & Exchange Policy
          </h1>
          <p className="text-xs text-stone-500">Effective Date: October 2026</p>
          <div className="w-16 h-0.5 bg-gold"></div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h3 className="font-serif text-base font-bold text-brandText">1. 7-Day Doorstep Exchange Policy</h3>
            <p>
              We want you to love your Subh Lagan drape. If you are not completely enchanted with the color, fabric texture, or motif of your saree, you may initiate an exchange request within 7 calendar days of receipt.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">2. Conditions for Exchange</h3>
            <p>
              To qualify for an exchange:
              <br />• The saree must be unused, unwashed, and unpleated.
              <br />• The attached blouse piece must be intact and strictly unstitched.
              <br />• The original brand tags, Silk Mark tags, and royal heritage box packaging must be in pristine condition.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">3. How to Request an Exchange</h3>
            <p>
              Contact our concierge team at <strong>care@subhlagansarees.com</strong> or WhatsApp our support line at <strong>+91 98765 43210</strong> with your Order Number and photos of the saree parcel. Our courier partner will arrange a complimentary doorstep pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

