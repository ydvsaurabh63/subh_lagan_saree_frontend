import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  RotateCw,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

// 5 Curated Royal Indian Saree Looks with Transparent Cutout Full-Length Models
const sareeLooks = [
  {
    id: 1,
    lookNumber: '01',
    lookTitle: 'Royal Crimson Banarasi',
    tagline: 'Bridal Heritage • Handwoven Katan Silk',
    modelImage: '/models/model-1.png',
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
    lookTitle: 'Maharani Emerald Temple',
    tagline: 'Temple Korvai • Pure Kanchipuram Weave',
    modelImage: '/models/model-2.png',
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
    lookTitle: 'Heirloom Red Zardozi Bridal',
    tagline: 'Couture Bridal • Velvet & Zardozi Handwork',
    modelImage: '/models/model-3.png',
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
    lookTitle: 'Gulabi Rani Paithani',
    tagline: 'Maharashtrian Heritage • Peacock Pallu',
    modelImage: '/models/model-4.png',
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
    lookTitle: 'Royal Sapphire Brocade',
    tagline: 'Varanasi Zari Heritage • Pure Silk Brocade',
    modelImage: '/models/model-5.png',
    sareeSlug: 'mustard-gold-handloom-chanderi-saree',
    items: [
      {
        id: 'saree-5',
        type: 'Saree',
        name: 'Royal Sapphire Blue Brocade Silk Saree',
        detail: 'Pure Mulberry Silk • Antique Gold Zari Brocade',
        price: 21999,
        originalPrice: 26999,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-5',
        type: 'Blouse Piece',
        name: 'Contrast Gold Brocade Blouse Piece',
        detail: '0.8M Unstitched Pure Brocade Included',
        price: 0,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-5',
        type: 'Accessory',
        name: 'Handcrafted Zari Latkan Tassels',
        detail: 'Antique Gold Beaded Accents',
        price: 899,
        originalPrice: 1299,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

const HeroBanner = () => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [touchStartX, setTouchStartX] = useState(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentLook = sareeLooks[activeLookIndex];

  // Calculate ensemble total
  const totalBundlePrice = currentLook.items.reduce((acc, it) => acc + it.price, 0);
  const totalOriginalPrice = currentLook.items.reduce(
    (acc, it) => acc + (it.originalPrice || it.price),
    0
  );
  const savings = totalOriginalPrice - totalBundlePrice;

  const handlePrev = () => {
    setActiveLookIndex((prev) => (prev === 0 ? sareeLooks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveLookIndex((prev) => (prev === sareeLooks.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - touchStartX;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    setTouchStartX(null);
  };

  const handleAddFullLook = () => {
    const mainSaree = currentLook.items.find((it) => it.isMain);
    if (mainSaree) {
      addToCart(
        {
          _id: mainSaree.id,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice,
          discountPrice: totalBundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: currentLook.lookTitle.split(' ')[1] || 'Festive',
        },
        1
      );
      toast.success(`Complete Look "${currentLook.lookTitle}" added to Bag!`);
    }
  };

  // 3D Circular Orbit calculations
  const getModelStyle = (idx) => {
    const count = sareeLooks.length;
    let offset = (idx - activeLookIndex) % count;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;

    // Responsive horizontal distance
    const spacing = windowWidth < 640 ? 75 : windowWidth < 1024 ? 120 : 160;
    const translateX = offset * spacing;

    // 3D Depth Scale, Opacity, and Z-Index
    const scale = isCenter ? 1.08 : absOffset === 1 ? 0.88 : 0.74;
    const opacity = isCenter ? 1 : absOffset === 1 ? 0.82 : 0.45;
    const zIndex = isCenter ? 40 : absOffset === 1 ? 25 : 10;
    const rotateY = -offset * 10; // inward curve toward center

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
    };
  };

  return (
    <div className="relative bg-[#F8F7F4] border-b border-stone-200 overflow-hidden select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT & CENTER: THE VIRTUAL SAREE RUNWAY (CIRCULAR ORBIT)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header Titles */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-gold-dark flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Virtual Saree Runway</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
                Try the Look.
              </h1>
              <p className="text-xs sm:text-sm text-stone-700 font-bold max-w-md">
                Pure handloom sarees & bridal trousseau. Click any model or tap rotate to center the look.
              </p>
            </div>

            {/* Runway Stage with Floor Ambient Shadow and Circular Turntable */}
            <div
              className="relative my-6 lg:my-8 flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
            >
              {/* Studio Floor Soft Contact Shadows */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-stone-300/40 rounded-full blur-2xl pointer-events-none"></div>

              {/* 3D Circular Turntable Pedestal on Floor beneath center model */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] lg:w-[460px] h-[90px] sm:h-[110px] pointer-events-none flex items-center justify-center">
                {/* Rotating golden dashed orbit ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/60 animate-spin-slow scale-y-[0.32] shadow-[0_0_25px_rgba(198,161,91,0.25)]"></div>
                {/* Inner golden concentric rim */}
                <div className="absolute inset-3 rounded-full border border-gold/40 scale-y-[0.32]"></div>
                {/* Radial spotlight floor glow */}
                <div className="w-4/5 h-4/5 rounded-full bg-radial from-gold/30 via-gold/10 to-transparent blur-md scale-y-[0.30]"></div>
                {/* Center contact shadow under model feet */}
                <div className="w-44 sm:w-52 h-8 bg-stone-900/35 rounded-full blur-md scale-y-[0.32]"></div>
              </div>

              {/* Floating Circular Rotate Dial beside Center Model */}
              <div
                className="absolute left-1/2 top-[46%] -translate-y-1/2 z-50 pointer-events-auto"
                style={{
                  transform: 'translate(calc(-50% + 125px), -50%)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  title="Rotate to Next Saree Look"
                  aria-label="Rotate Saree Look"
                  className="relative group flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border-2 border-gold/60 shadow-[0_8px_25px_rgba(104,27,44,0.18)] hover:shadow-[0_12px_32px_rgba(198,161,91,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  {/* Subtle golden pulse aura */}
                  <span className="absolute -inset-1.5 rounded-full border border-gold/40 animate-ping opacity-40 pointer-events-none"></span>

                  {/* Circular Rotating Dashed Ring on Hover */}
                  <span className="absolute inset-0.5 rounded-full border border-dashed border-gold/50 group-hover:rotate-180 transition-transform duration-700 ease-in-out pointer-events-none"></span>

                  {/* Rotate Icon */}
                  <RotateCw className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500 ease-out" />
                  
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-900 mt-0.5 group-hover:text-primary transition-colors">
                    Rotate
                  </span>
                </button>
              </div>

              {/* Models Lineup (Full Length Saree Cutouts in 3D Circular Orbit) */}
              <div className="relative flex items-end justify-center w-full max-w-4xl h-[460px] sm:h-[520px] lg:h-[560px]">
                {sareeLooks.map((look, idx) => {
                  const isActive = idx === activeLookIndex;
                  const style = getModelStyle(idx);

                  return (
                    <div
                      key={look.id}
                      onClick={() => setActiveLookIndex(idx)}
                      style={style}
                      className="absolute bottom-2 cursor-pointer transition-all duration-500 ease-out flex flex-col items-center group"
                    >
                      {/* Active Center Indicator Pill */}
                      {isActive && (
                        <div className="mb-2 flex items-center space-x-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gold/50 text-[10px] font-bold uppercase tracking-wider text-primary">
                          <Eye className="w-3 h-3 text-gold" />
                          <span>Active Look {look.lookNumber}</span>
                        </div>
                      )}

                      {/* Transparent Standing Model (Authentic Full-Length Saree) */}
                      <div className="relative w-48 sm:w-56 lg:w-64 h-[400px] sm:h-[460px] lg:h-[500px] flex items-end justify-center">
                        {/* Soft Backdrop Spotlight Halo behind active model */}
                        {isActive && (
                          <div className="absolute inset-0 -top-6 bg-radial from-gold/20 via-gold/5 to-transparent rounded-full filter blur-xl pointer-events-none -z-10"></div>
                        )}

                        <img
                          src={look.modelImage}
                          alt={look.lookTitle}
                          className={`w-full h-full object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] transition-all duration-500 ${
                            isActive
                              ? 'filter drop-shadow-[0_20px_35px_rgba(104,27,44,0.22)]'
                              : 'grayscale-[10%] hover:grayscale-0'
                          }`}
                        />
                      </div>

                      {/* Natural Elliptical Floor Contact Shadow under each model */}
                      <div
                        className={`w-36 h-4 bg-stone-900/25 rounded-full blur-md -mt-2 transition-all ${
                          isActive ? 'scale-110 opacity-70' : 'opacity-40'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scrubber & Navigation Controls */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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

              {/* Minimalist Scrubber Timeline Bar with Clickable Segments */}
              <div className="flex items-center space-x-2 w-full sm:w-64">
                <span className="text-[10px] font-mono text-stone-400">01</span>
                <div className="relative flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden flex items-center">
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
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-extrabold text-stone-950">
                    In this look
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">
                    {currentLook.tagline}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-gold/25 text-gold-dark text-[11px] font-black uppercase tracking-wider rounded border border-gold/40">
                  Look {currentLook.lookNumber}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5">
                {currentLook.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-stone-200 hover:border-gold hover:bg-cream/40 transition group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gold-dark">
                          {item.type}
                        </span>
                        {item.isIncluded && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            FREE
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-sm font-bold text-stone-950 truncate mt-0.5" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium truncate">
                        {item.detail}
                      </p>

                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-sm font-extrabold text-primary font-sans">
                          {item.price === 0 ? 'Complimentary' : formatPrice(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-stone-400 font-bold line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3 mt-4">
              {/* Savings Card */}
              <div className="bg-cream/80 rounded-xl p-3.5 border border-gold/40 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700 font-bold">Complete the look:</span>
                  <span className="text-stone-500 line-through text-xs font-bold font-sans">
                    {formatPrice(totalOriginalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black text-emerald-800">
                    Bundle & Save {formatPrice(savings)}
                  </span>
                  <span className="font-serif text-xl font-extrabold text-primary font-sans">
                    {formatPrice(totalBundlePrice)}
                  </span>
                </div>
              </div>

              {/* Add full look to bag */}
              <button
                onClick={handleAddFullLook}
                className="w-full py-3.5 px-4 bg-primary hover:bg-secondary text-cream rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add full look to bag</span>
                <ArrowRight className="w-4 h-4 text-gold stroke-[2.5]" />
              </button>

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
