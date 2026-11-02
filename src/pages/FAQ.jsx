import React, { useState } from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'Order online with zero advance payment. Pay via cash or UPI QR code directly to the courier when your parcel arrives.',
  },
  {
    q: 'Are all sarees 100% pure silk?',
    a: 'Yes. Every saree is Silk Mark certified and handwoven by master artisans in Varanasi and Kanchipuram.',
  },
  {
    q: 'Is a matching blouse piece included?',
    a: 'Yes, standard sarees include a matching 0.8m to 1.0m unstitched blouse piece.',
  },
  {
    q: 'What is the delivery timeframe?',
    a: 'Metros take 3 to 5 business days; other cities take 5 to 7 days. Tracking is sent via SMS & email.',
  },
  {
    q: 'What is the 7-Day Exchange policy?',
    a: 'Contact us within 7 days of delivery. Sarees must be unused, unstitched, and in original packaging.',
  },
  {
    q: 'How should I store and care for my sarees?',
    a: 'Dry clean only. Store wrapped in breathable cotton or muslin cloth.',
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
        <Breadcrumb items={[{ label: 'FAQs' }]} />

        <div className="text-center py-8 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-primary mx-auto mb-2">
            <HelpCircle className="w-5 h-5 text-gold-dark" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-2"></div>
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

