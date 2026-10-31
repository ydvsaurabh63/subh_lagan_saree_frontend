import React from 'react';
import { Award, Feather, ShieldCheck, RefreshCw } from 'lucide-react';

const pillars = [
  {
    icon: Award,
    title: 'Certified Handloom Heritage',
    desc: 'Each saree carries the stamp of handloom authenticity, directly sourced from our master weavers in Varanasi and Kanchipuram.',
  },
  {
    icon: Feather,
    title: 'Pure Zari & Mulberry Silk',
    desc: 'Woven with certified pure mulberry silk yarns and genuine silver-gilt electroplated zari that retains its luster for decades.',
  },
  {
    icon: ShieldCheck,
    title: 'Cash on Delivery Across India',
    desc: 'Shop with complete peace of mind. Pay safely in cash or UPI at your doorstep after verifying your package arrival.',
  },
  {
    icon: RefreshCw,
    title: '7-Day Hassle-Free Exchange',
    desc: 'Not entirely satisfied with color or drape? Enjoy our swift, customer-friendly exchange assistance with zero questions asked.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            The Subh Lagan Promise
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary mt-2">
            Why Discerning Brides Choose Us
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3 mb-3"></div>
          <p className="text-xs sm:text-sm text-stone-600">
            For over three decades, Subh Lagan Sarees has been adorning Indian celebrations with timeless craftsmanship and integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-cream/60 border border-stone-200/80 hover:border-gold shadow-sm hover:shadow-luxury-hover transition-all text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-base font-bold text-brandText mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

