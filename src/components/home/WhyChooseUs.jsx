import React from 'react';
import { Award, Feather, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Award,
    title: 'Silk Mark Certified',
    subtitle: 'Handloom Silk',
  },
  {
    icon: Feather,
    title: 'Authentic Pure Zari',
    subtitle: 'Gold & Silver Weaves',
  },
  {
    icon: ShieldCheck,
    title: 'Cash on Delivery',
    subtitle: 'Doorstep Payment',
  },
  {
    icon: RefreshCw,
    title: '7-Day Exchange',
    subtitle: 'Doorstep Pickup',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 bg-[#FAF7F2] border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Our Promise
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-gold shadow-xs hover:shadow-luxury-hover transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white border border-primary/20 flex items-center justify-center text-primary mb-3 transition-colors shadow-sm">
                  <Icon className="w-6 h-6 transition-colors" />
                </div>
                <h3 className="font-serif text-sm font-bold text-brandText mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {item.subtitle}
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
