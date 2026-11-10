import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const SpecialOfferBanner = () => {
  const { store, isBoutiqueStore, isJewelleryStore, isHairStore } = useStore();
  const promoCode = store?.promoCode || (isBoutiqueStore
    ? `${(store.name || '').replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase()}30`
    : 'SUBHLAGAN30');
  const promoDiscount = store?.promoDiscount || (isJewelleryStore ? 'Flat 20% Off Making' : isHairStore ? 'Flat 25% Off Hair' : 'Flat 30% Off Bridal');
  const offerSubtitle = isJewelleryStore
    ? 'Authentic 22K hallmarked gold & diamond solitaires.'
    : isHairStore
    ? '100% Virgin Remy extensions & salon grade formulas.'
    : 'Handcrafted wedding & festive silks.';
  const offerImage = store?.heroBannerUrl || (isJewelleryStore
    ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85'
    : isHairStore
    ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85'
    : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85');

  const shopLink = isBoutiqueStore
    ? `/store/${store.slug}/shop`
    : '/shop';
  return (
    <section className="py-4 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-primary shadow-lg border border-gold/40">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center lg:h-52 overflow-hidden">
            {/* Left Content */}
            <div className="md:col-span-7 p-4 sm:p-6 lg:py-4 lg:px-8 space-y-2 z-10 text-white flex flex-col justify-center">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/30 w-fit">
                <Gift className="w-3 h-3 text-white" />
                <span>Special Promotion</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-white">
                {promoDiscount}
              </h3>

              <p className="text-xs text-stone-200 leading-snug max-w-md">
                {offerSubtitle}
              </p>

              {/* Promo Code Pill & CTA */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/20 text-xs">
                  <Tag className="w-3 h-3 text-white" />
                  <span className="text-stone-300 text-[11px]">Code:</span>
                  <span className="font-bold text-white tracking-widest text-xs">{promoCode}</span>
                </div>

                <Link
                  to={shopLink}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 relative h-40 sm:h-48 md:h-full lg:h-52 overflow-hidden">
              <img
                src={offerImage}
                alt="Special Offer"
                className="w-full h-full object-cover object-[center_20%] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary via-primary/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOfferBanner;
