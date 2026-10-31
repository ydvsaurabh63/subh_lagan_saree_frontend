import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';

const PrivacyPolicy = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-6 mt-6">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500">Effective Date: October 2026</p>
          <div className="w-16 h-0.5 bg-gold"></div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h3 className="font-serif text-base font-bold text-brandText">1. Information We Collect</h3>
            <p>
              When you browse our online boutique or place a Cash on Delivery order, we collect information necessary to fulfill your request, including your name, email address, mobile phone number, and delivery street address.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">2. How We Use Your Data</h3>
            <p>
              Your data is solely used to:
              <br />• Coordinate shipping and doorstep cash delivery with logistics partners.
              <br />• Send order confirmations, invoices, and password reset OTPs.
              <br />• Provide customer support and saree styling consultations.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">3. Data Security</h3>
            <p>
              We implement industry-standard encryption, password hashing (bcrypt), and secure token authentication (JWT). We never sell, rent, or trade your personal information with external advertising networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

