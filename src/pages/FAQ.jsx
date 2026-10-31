import React, { useState } from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does Cash on Delivery (COD) work at Subh Lagan Sarees?',
    a: 'We offer convenient Cash on Delivery across 19,000+ pincodes in India. You place your order online without entering credit/debit card numbers. Once our logistics executive arrives at your doorstep with the sealed parcel, you simply hand over the exact order amount in cash or scan the courier UPI QR code.',
  },
  {
    q: 'Are all your sarees 100% pure silk and authentic handloom?',
    a: 'Yes, absolutely. Every Banarasi, Kanjivaram, and pure silk saree sold on Subh Lagan Sarees carries verified Silk Mark standards. We source directly from master handloom weaving clusters in Varanasi, Kanchipuram, and Chanderi.',
  },
  {
    q: 'Does each saree include a matching blouse piece?',
    a: 'Yes. Unless specified as pre-stitched, all our standard 5.5-meter sarees include an additional 0.8-meter to 1.0-meter unstitched blouse piece in complementary fabric or heavy matching brocade with zari sleeve borders.',
  },
  {
    q: 'What is the estimated delivery timeframe?',
    a: 'Metropolitan cities typically receive orders within 3 to 5 business days. Other non-metro and tier-2/3 cities across India take 5 to 7 business days. You will receive real-time SMS and email tracking links upon parcel dispatch.',
  },
  {
    q: 'What is your 7-Day Exchange policy?',
    a: 'If you wish to exchange your saree for a different color, fabric, or design, contact our concierge within 7 days of package delivery. The saree must remain unused, unstitched, and in its original luxury box with all tags intact.',
  },
  {
    q: 'How should I store and care for my pure Banarasi & Kanjivaram sarees?',
    a: 'We recommend dry cleaning only for all pure silk, zari, and embroidered sarees. Store your sarees wrapped in breathable unbleached muslin or cotton cloth rather than plastic. Occasionally refold the saree along different creases to keep the zari threads supple for generations.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="text-center py-10 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-primary mx-auto mb-3">
            <HelpCircle className="w-6 h-6 text-gold-dark" />
          </div>
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            Got Questions?
          </span>
          <h1 className="font-serif text-3xl font-bold text-primary mt-1">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3"></div>
        </div>

        <div className="space-y-3 mt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-semibold text-brandText hover:text-primary transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
