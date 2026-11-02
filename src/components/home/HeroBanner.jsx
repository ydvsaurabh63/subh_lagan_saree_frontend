import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Check,
  ShieldCheck,
  ArrowRight,
  Eye,
  Plus,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

// 5 Curated Royal Saree Looks
const sareeLooks = [
  {
    id: 1,
    lookNumber: '01',
    lookTitle: 'The Royal Crimson Banarasi',
    tagline: 'Bridal Heritage • Handwoven Katan Silk',
    modelImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    sareeSlug: 'royal-crimson-banarasi-katan-silk-saree',
    items: [
      {
        id: 'saree-1',
        type: 'Saree',
        name: 'Royal Crimson Banarasi Katan Silk Saree',
        detail: 'Pure Katan Silk • Gold Zari Kadhwa Weave',
        price: 19999,
        originalPrice: 24999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-1',
        type: 'Blouse Piece',
        name: 'Heavy Zari Brocade Blouse Piece',
        detail: '0.8M Unstitched Pure Brocade Included',
        price: 0,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-1',
        type: 'Accessory',
        name: 'Handcrafted Zari Bridal Potli',
        detail: 'Antique Gold Zardosi Embroidery',
        price: 1499,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 2,
    lookNumber: '02',
    lookTitle: 'The Maharani Emerald Temple',
    tagline: 'Temple Korvai • Pure Kanchipuram Weave',
    modelImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    sareeSlug: 'maharani-emerald-gold-kanjivaram-silk-saree',
    items: [
      {
        id: 'saree-2',
        type: 'Saree',
        name: 'Maharani Emerald Gold Kanjivaram Saree',
        detail: 'Pure Mulberry Silk • 2-Ply Golden Zari',
        price: 27499,
        originalPrice: 32999,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-2',
        type: 'Blouse Piece',
        name: 'Contrast Maroon Silk Blouse Piece',
        detail: '0.8M Unstitched with Zari Sleeves',
        price: 0,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-2',
        type: 'Accessory',
        name: 'Temple Zari Woven Kamarbandh Belt',
        detail: 'Traditional Peacock Gold Motif',
        price: 1999,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 3,
    lookNumber: '03',
    lookTitle: 'The Auspicious Heirloom Trousseau',
    tagline: 'Couture Bridal • Velvet & Zardozi Handwork',
    modelImage: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=900&q=85',
    sareeSlug: 'heirloom-red-zardozi-bridal-saree',
    items: [
      {
        id: 'saree-3',
        type: 'Saree',
        name: 'Heirloom Red Zardozi Bridal Saree',
        detail: 'Raw Silk & Velvet Border • Dabka Handwork',
        price: 38999,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-3',
        type: 'Blouse Piece',
        name: 'Heavy Zardozi Embroidered Blouse',
        detail: '1.0M Pure Raw Silk Fabric Included',
        price: 0,
        originalPrice: 4999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-3',
        type: 'Accessory',
        name: 'Heirloom Zari Sheer Veil Dupatta',
        detail: 'Bridal Organza with Scallop Border',
        price: 3499,
        originalPrice: 4499,
        image: 'https://images.unsplash.com/photo-1609357605051-bd6b7588e1aa?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 4,
    lookNumber: '04',
    lookTitle: 'The Gulabi Paithani Splendor',
    tagline: 'Maharashtrian Heritage • Peacock Pallu',
    modelImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
    sareeSlug: 'gulabi-rani-pure-paithani-silk-saree',
    items: [
      {
        id: 'saree-4',
        type: 'Saree',
        name: 'Gulabi Rani Pure Paithani Silk Saree',
        detail: 'Mulberry Silk • Obverse-Reverse Zari Pallu',
        price: 14999,
        originalPrice: 18499,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-4',
        type: 'Blouse Piece',
        name: 'Running Paithani Silk Blouse Piece',
        detail: '0.8M Unstitched Matching Included',
        price: 0,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-4',
        type: 'Accessory',
        name: 'Handcrafted Peacock Latkan Set',
        detail: 'Pearl & Golden Thread Beads',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 5,
    lookNumber: '05',
    lookTitle: 'The Midnight Starlight Cocktail',
    tagline: 'Modern Designer • Georgette & Micro-Sequins',
    modelImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=900&q=85',
    sareeSlug: 'midnight-navy-sequin-georgette-saree',
    items: [
      {
        id: 'saree-5',
        type: 'Saree',
        name: 'Midnight Navy Sequin Georgette Saree',
        detail: 'Viscose Georgette • Tone-on-tone Micro Sequins',
        price: 10999,
        originalPrice: 13999,
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-5',
        type: 'Blouse Piece',
        name: 'Embellished Designer Bustier Fabric',
        detail: '0.8M Micro-Sequin Blouse Fabric Included',
        price: 0,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1610030469884-25e2270912f2?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-5',
        type: 'Accessory',
        name: 'Metallic Shimmer Evening Potli',
        detail: 'Navy Velvet & Crystal Chain Handle',
        price: 1299,
        originalPrice: 1799,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

const HeroBanner = () => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const currentLook = sareeLooks[activeLookIndex];

  // Calculate ensemble total
  const totalBundlePrice = currentLook.items.reduce((acc, it) => acc + it.price, 0);
  const totalOriginalPrice = currentLook.items.reduce((acc, it) => acc + (it.originalPrice || it.price), 0);
  const savings = totalOriginalPrice - totalBundlePrice;

  const handlePrev = () => {
    setActiveLookIndex((prev) => (prev === 0 ? sareeLooks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveLookIndex((prev) => (prev === sareeLooks.length - 1 ? 0 : prev + 1));
  };

  // Add full look to bag
  const handleAddFullLook = () => {
    // Add primary saree
    const mainSaree = currentLook.items.find((it) => it.isMain);
    if (mainSaree) {
      addToCart(
        {
          _id: mainSaree.id,
          name: `${mainSaree.name} (Complete Look Ensemble)`,
          price: mainSaree.originalPrice,
          discountPrice: totalBundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: currentLook.lookTitle.split(' ')[2] || 'Royal',
        },
        1
      );
      toast.success(`Complete Look "${currentLook.lookTitle}" added to Bag!`);
    }
  };

  return (
    <div className="relative bg-[#FAFAFA] border-b border-stone-200 overflow-hidden select-none">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT & CENTER: THE VIRTUAL SAREE RUNWAY (MODEL LINEUP)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header Titles */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-dark flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Subh Lagan Virtual Runway</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brandText tracking-tight">
                Drape the Look.
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                Interactive bridal trousseau & heirloom styling. Click on any model to inspect the complete ensemble.
              </p>
            </div>

            {/* Models Lineup Stage */}
            <div className="relative my-6 lg:my-8 flex items-center justify-center min-h-[420px] sm:min-h-[500px] lg:min-h-[540px]">
              {/* Studio Backdrop Floor Shadow */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-stone-300/40 rounded-full blur-xl pointer-events-none"></div>

              {/* 5 Models Horizontal Lineup */}
              <div className="relative flex items-end justify-center w-full max-w-4xl h-[420px] sm:h-[480px] lg:h-[520px]">
                {sareeLooks.map((look, idx) => {
                  const isActive = idx === activeLookIndex;
                  const distance = idx - activeLookIndex; // -2, -1, 0, 1, 2
                  
                  // Calculate dynamic positioning for 3D depth runway effect
                  let translateX = `${distance * 110}px`;
                  let zIndex = 20 - Math.abs(distance) * 5;
                  let scale = isActive ? 1 : 0.82 - Math.abs(distance) * 0.05;
                  let opacity = isActive ? 1 : Math.max(0.35, 0.75 - Math.abs(distance) * 0.2);

                  return (
                    <div
                      key={look.id}
                      onClick={() => setActiveLookIndex(idx)}
                      style={{
                        transform: `translateX(${translateX}) scale(${scale})`,
                        zIndex,
                        opacity,
                      }}
                      className="absolute bottom-0 cursor-pointer transition-all duration-500 ease-out flex flex-col items-center group"
                    >
                      {/* Active Center Indicator Ring / Badge */}
                      {isActive && (
                        <div className="mb-2 animate-bounce flex items-center space-x-1 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-gold/40 text-[10px] font-bold uppercase tracking-wider text-primary">
                          <Eye className="w-3 h-3 text-gold" />
                          <span>Active Look {look.lookNumber}</span>
                        </div>
                      )}

                      {/* Model Card / Cutout Silhouette */}
                      <div
                        className={`relative w-44 sm:w-56 lg:w-60 h-[360px] sm:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden transition-all duration-500 ${
                          isActive
                            ? 'ring-4 ring-gold/60 shadow-2xl scale-100'
                            : 'shadow-lg grayscale-[20%] hover:grayscale-0 hover:opacity-90'
                        }`}
                      >
                        <img
                          src={look.modelImage}
                          alt={look.lookTitle}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Caption on Model */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-light">
                            {look.tagline.split('•')[0]}
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold truncate">
                            {look.lookTitle}
                          </h4>
                        </div>
                      </div>

                      {/* Soft Floor Shadow under Model */}
                      <div className="w-36 h-4 bg-black/25 rounded-full blur-md -mt-2"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scrubber & Navigation Controls */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Prev / Next Arrows & Current Look Name */}
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1.5">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-stone-300 hover:border-gold hover:bg-white text-stone-700 transition active:scale-95 shadow-sm"
                    aria-label="Previous Look"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-stone-300 hover:border-gold hover:bg-white text-stone-700 transition active:scale-95 shadow-sm"
                    aria-label="Next Look"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs">
                  <span className="font-serif font-bold text-primary">
                    {currentLook.lookNumber} / 05
                  </span>
                  <span className="text-stone-400 mx-2">•</span>
                  <span className="font-semibold text-brandText">
                    {currentLook.lookTitle}
                  </span>
                </div>
              </div>

              {/* Minimal Scrubber Line Bar */}
              <div className="flex items-center space-x-2 w-full sm:w-64">
                <span className="text-[10px] font-mono text-stone-400">01</span>
                <div className="relative flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${((activeLookIndex + 1) / sareeLooks.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-stone-400">05</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE PANEL: "IN THIS LOOK" (ENSEMBLE BREAKDOWN)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gold/40 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brandText">
                    In this look
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {currentLook.tagline}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-gold/20 text-gold-dark text-[10px] font-bold uppercase tracking-wider rounded">
                  Look {currentLook.lookNumber}
                </span>
              </div>

              {/* Items List in this Look */}
              <div className="space-y-3.5">
                {currentLook.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-stone-100 hover:border-gold/40 hover:bg-cream/30 transition group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gold-dark">
                          {item.type}
                        </span>
                        {item.isIncluded && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            FREE
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-xs font-semibold text-brandText truncate mt-0.5" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate">
                        {item.detail}
                      </p>

                      <div className="flex items-baseline space-x-1.5 mt-1">
                        <span className="text-xs font-bold text-primary font-sans">
                          {item.price === 0 ? 'Complimentary' : formatPrice(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Complete the Look Action Card */}
            <div className="pt-4 border-t border-stone-100 space-y-3 mt-4">
              {/* Savings & Bundle pricing */}
              <div className="bg-cream/60 rounded-xl p-3 border border-gold/30 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 font-medium">Complete the look:</span>
                  <span className="text-stone-400 line-through text-[11px] font-sans">
                    {formatPrice(totalOriginalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold text-emerald-700">
                    Bundle & Save {formatPrice(savings)}
                  </span>
                  <span className="font-serif text-lg font-bold text-primary font-sans">
                    {formatPrice(totalBundlePrice)}
                  </span>
                </div>
              </div>

              {/* Main CTA: Add full look to bag */}
              <button
                onClick={handleAddFullLook}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 active:scale-98"
              >
                <span>Add full look to bag</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </button>

              {/* View Saree Product Detail Link */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <Link
                  to={`/product/${currentLook.sareeSlug}`}
                  className="text-stone-500 hover:text-primary transition underline font-medium"
                >
                  Inspect Saree Spec Sheet
                </Link>
                <span className="text-stone-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>COD Available</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
