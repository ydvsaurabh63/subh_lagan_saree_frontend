import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Users, HeartHandshake, Scissors, Gem, Crown } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const AboutBrandSection = () => {
  const { store, isBoutiqueStore, isJewelleryStore, isHairStore } = useStore();

  const brandTitle = isBoutiqueStore ? `About ${store.name}` : 'Heritage Since 1994';
  const brandTagline = store?.tagline || 'Centuries of artistry directly to your doorstep with Cash on Delivery.';
  const aboutLink = isBoutiqueStore ? `/store/${store.slug}/about` : '/about';

  const stats = isJewelleryStore
    ? [
        { icon: Award, label: '100% BIS', desc: 'Hallmarked 22K' },
        { icon: Gem, label: 'VVS Certified', desc: 'Solitaire Stones' },
        { icon: HeartHandshake, label: '35,000+', desc: 'Heirloom Clients' },
        { icon: Sparkles, label: 'Insured', desc: 'Doorstep Delivery' },
      ]
    : isHairStore
    ? [
        { icon: Crown, label: '100% Remy', desc: 'Pure Virgin Hair' },
        { icon: Scissors, label: 'Salon Grade', desc: 'Double Drawn' },
        { icon: HeartHandshake, label: '25,000+', desc: 'Happy Transformations' },
        { icon: Sparkles, label: 'Toxin Free', desc: 'Heat Resistant' },
      ]
    : [
        { icon: Award, label: '30+ Years', desc: 'Family Heritage' },
        { icon: Scissors, label: '350+', desc: 'Master Weavers' },
        { icon: HeartHandshake, label: '50,000+', desc: 'Happy Brides' },
        { icon: Sparkles, label: '100%', desc: 'Silk Mark Certified' },
      ];

  const collageImages = isJewelleryStore
    ? [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1611591475837-775677dffad3?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80',
      ]
    : isHairStore
    ? [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1608248597359-0a60ff9e03d9?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80',
      ]
    : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
      ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Visual 3-Image Collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-gold/40">
                <img
                  src={collageImages[0]}
                  alt="Brand Craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                <img
                  src={collageImages[1]}
                  alt="Detail Feature"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                <img
                  src={collageImages[2]}
                  alt="Collection Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-gold/40">
                <img
                  src={collageImages[3]}
                  alt="Luxury Drape"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>

          {/* Text & Visual Metrics */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary leading-tight">
                {brandTitle}
              </h2>
              <div className="w-12 h-0.5 bg-gold mt-2 mb-3"></div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {brandTagline}
              </p>
            </div>

            {/* 4 Visual Metric Cards with Icons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-cream/70 border border-gold/30 flex items-center space-x-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-bold text-primary">{s.label}</p>
                      <p className="text-[11px] text-stone-500 font-medium">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                to={aboutLink}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrandSection;
