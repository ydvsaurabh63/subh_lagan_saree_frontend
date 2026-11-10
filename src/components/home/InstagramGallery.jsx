import React from 'react';
import { Instagram } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const instaPosts = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=600&q=80',
];

const InstagramGallery = () => {
  const { store, isBoutiqueStore } = useStore();
  const handle = isBoutiqueStore && store?.name
    ? `@${store.name.replace(/\s+/g, '')}`
    : '@SubhLaganSarees';

  return (
    <section className="py-12 bg-[#FAF7F2] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <Instagram className="w-4 h-4 text-gold" />
            <span>{handle}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brandText">
            Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instaPosts.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm"
            >
              <img
                src={img}
                alt={`Instagram gallery drape ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6 text-gold" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;

