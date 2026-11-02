import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Camera,
  RotateCcw,
  ShoppingBag,
  Download,
  Check,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

// Curated Sarees for the Virtual Fitting Room
const tryOnSarees = [
  {
    id: 'try-1',
    name: 'Royal Crimson Banarasi Katan Silk',
    fabric: 'Pure Katan Silk • Gold Zari',
    price: 19999,
    originalPrice: 24999,
    color: 'Crimson Red',
    colorHex: '#881337',
    swatch: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-1.png',
    slug: 'royal-crimson-banarasi-katan-silk-saree',
  },
  {
    id: 'try-2',
    name: 'Maharani Emerald Temple Kanjivaram',
    fabric: 'Pure Mulberry Silk • Temple Korvai',
    price: 27499,
    originalPrice: 32999,
    color: 'Emerald Green',
    colorHex: '#064e3b',
    swatch: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-2.png',
    slug: 'maharani-emerald-gold-kanjivaram-silk-saree',
  },
  {
    id: 'try-3',
    name: 'Heirloom Red Zardozi Bridal Saree',
    fabric: 'Raw Silk & Velvet • Dabka Handwork',
    price: 38999,
    originalPrice: 45000,
    color: 'Bridal Vermillion',
    colorHex: '#991b1b',
    swatch: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-3.png',
    slug: 'heirloom-red-zardozi-bridal-saree',
  },
  {
    id: 'try-4',
    name: 'Gulabi Rani Pure Paithani Silk',
    fabric: 'Paithani Silk • Peacock Zari Pallu',
    price: 14999,
    originalPrice: 18499,
    color: 'Rani Pink',
    colorHex: '#be185d',
    swatch: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-4.png',
    slug: 'gulabi-rani-pure-paithani-silk-saree',
  },
  {
    id: 'try-5',
    name: 'Mustard Gold Handloom Chanderi',
    fabric: 'Chanderi Cotton Silk • Zari Booti',
    price: 4999,
    originalPrice: 6499,
    color: 'Haldi Mustard',
    colorHex: '#b45309',
    swatch: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-5.png',
    slug: 'mustard-gold-handloom-chanderi-saree',
  },
];

// Preset model avatars for customers who want to test without uploading immediately
const sampleAvatars = [
  {
    id: 'avatar-1',
    name: 'Model Priya',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Model Ananya',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Model Divya',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
];

const VirtualTryOn = () => {
  const { addToCart } = useCart();
  const fileInputRef = useRef(null);

  // States
  const [userPhoto, setUserPhoto] = useState(sampleAvatars[0].image);
  const [selectedSaree, setSelectedSaree] = useState(tryOnSarees[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isDraped, setIsDraped] = useState(true);
  const [sliderPos, setSliderPos] = useState(50); // Split comparison slider position (0-100)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
        triggerAiDraping();
        toast.success('Photo uploaded! AI draping your saree...');
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate AI Drape Processing Steps
  const triggerAiDraping = () => {
    setIsProcessing(true);
    setIsDraped(false);

    setProcessingStep('Detecting body posture & neckline...');
    setTimeout(() => {
      setProcessingStep('Aligning pleats, pallu drape & zari reflections...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Fitting royal fabric & adjusting ambient shadows...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDraped(true);
      toast.success(`${selectedSaree.name} fitted successfully!`);
    }, 2600);
  };

  // Switch Saree
  const handleSareeSelect = (saree) => {
    setSelectedSaree(saree);
    triggerAiDraping();
  };

  // Add Draped Saree to Cart
  const handleAddToCart = () => {
    addToCart(
      {
        _id: selectedSaree.id,
        name: selectedSaree.name,
        price: selectedSaree.originalPrice,
        discountPrice: selectedSaree.price,
        images: [selectedSaree.swatch],
        fabric: selectedSaree.fabric.split('•')[0].trim(),
        color: selectedSaree.color,
      },
      1
    );
    toast.success(`"${selectedSaree.name}" added to Cart!`);
  };

  // Download Trial Photo
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedSaree.drapedPreview;
    link.download = `SubhLagan_VirtualTrial_${selectedSaree.slug}.png`;
    link.click();
    toast.success('Trial photo downloaded!');
  };

  return (
    <section className="py-14 bg-gradient-to-b from-[#F8F7F4] via-white to-cream/30 border-b border-stone-200 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-dark text-[11px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            <span>AI Virtual Saree Trial Room</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            See How the Saree Drapes on You.
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-2 mb-3"></div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Upload your photo or choose an avatar, pick any royal handloom saree, and watch our AI drape the fabric with realistic pleats, pallu, and zari luster.
          </p>
        </div>

        {/* Main Trial Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gold/40 shadow-luxury">
          
          {/* ========================================================= */}
          {/* LEFT: THE INTERACTIVE MIRROR (BEFORE / AFTER SPLIT SLIDER)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Mirror Frame */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border-2 border-gold/50 shadow-2xl flex items-center justify-center group">
              
              {/* 1. Underlying Original Photo (Before) */}
              <img
                src={userPhoto}
                alt="Original Look"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* 2. Draped Saree Overlay (After) with Split Clip */}
              {isDraped && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none transition-all"
                  style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                  {/* Studio Tint Backdrop behind transparent model */}
                  <div className="absolute inset-0 bg-[#F4F1EA]"></div>
                  <img
                    src={selectedSaree.drapedPreview}
                    alt="Draped Saree Look"
                    className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-2xl"
                  />
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                    AI Saree Fit
                  </div>
                </div>
              )}

              {/* 3. Original Label on Left */}
              <div
                className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none"
                style={{ opacity: sliderPos > 20 ? 1 : 0 }}
              >
                Original Photo
              </div>

              {/* 4. Split Slider Bar (Draggable divider) */}
              {isDraped && !isProcessing && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-xl flex items-center justify-center text-white text-xs -ml-0.5">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Native range scrubber for touch & click control */}
              {isDraped && !isProcessing && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  title="Drag left/right to compare Before & After"
                />
              )}

              {/* 5. Processing Scanner Animation Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-secondary-dark/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                  {/* Laser Scanning Line */}
                  <div className="relative w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gold animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-gold-light">
                      AI Saree Draping in Progress
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 font-mono animate-pulse">
                      {processingStep}
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gold animate-pulse rounded-full w-3/4"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Slider Hint */}
            <p className="text-[11px] text-stone-500 mt-3 text-center flex items-center justify-center space-x-1">
              <span>← Drag split slider to compare Before & Draped Saree →</span>
            </p>

            {/* Action Bar Below Mirror */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
                title="Download this trial look"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Trial Photo</span>
              </button>

              <button
                onClick={triggerAiDraping}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
                title="Re-run draping alignment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Fit Drape</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PHOTO UPLOADER & SAREE SELECTION CONTROLS         */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Upload Your Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-brandText flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-sans font-bold">1</span>
                  <span>Upload Your Photo or Choose Avatar</span>
                </h3>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-gold hover:bg-cream/40 cursor-pointer transition text-center flex flex-col items-center justify-center space-y-1 group"
              >
                <div className="w-9 h-9 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-brandText mt-1">
                  Click to Upload Your Full-Length Photo
                </p>
                <p className="text-[10px] text-stone-400">
                  Best with standing front-facing pose (PNG, JPG, WEBP)
                </p>
              </div>

              {/* Or Quick Sample Avatars */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-stone-500">Quick Test Models:</span>
                <div className="flex space-x-2">
                  {sampleAvatars.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        setUserPhoto(av.image);
                        triggerAiDraping();
                      }}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                        userPhoto === av.image
                          ? 'border-primary ring-2 ring-primary/30 scale-105'
                          : 'border-stone-200 hover:border-gold opacity-75 hover:opacity-100'
                      }`}
                      title={`Try with ${av.name}`}
                    >
                      <img src={av.image} alt={av.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Choose Saree to Fit */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-serif text-sm font-bold text-brandText flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-sans font-bold">2</span>
                <span>Select Handcrafted Saree to Drape</span>
              </h3>

              {/* Saree List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {tryOnSarees.map((saree) => {
                  const isSelected = selectedSaree.id === saree.id;
                  return (
                    <div
                      key={saree.id}
                      onClick={() => handleSareeSelect(saree)}
                      className={`flex items-center space-x-3 p-2.5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-stone-200 hover:border-gold hover:bg-cream/30'
                      }`}
                    >
                      {/* Saree Swatch */}
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0">
                        <img src={saree.swatch} alt={saree.name} className="w-full h-full object-cover object-top" />
                        <span
                          className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: saree.colorHex }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold text-brandText truncate">
                          {saree.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate">
                          {saree.fabric}
                        </p>
                        <div className="flex items-baseline space-x-2 mt-0.5">
                          <span className="text-xs font-bold text-primary font-sans">
                            {formatPrice(saree.price)}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(saree.originalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Checkmark indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary text-white' : 'border border-stone-300 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Selected Saree Checkout / Cart CTA */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Fitted Saree</span>
                  <p className="font-serif font-bold text-brandText text-sm truncate max-w-[220px]">
                    {selectedSaree.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">100% Fit Match</span>
                  <p className="font-sans font-bold text-primary text-base">
                    {formatPrice(selectedSaree.price)}
                  </p>
                </div>
              </div>

              {/* Add Saree to Bag */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Buy This Draped Saree (COD)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Cash on Delivery Available • 7-Day Doorstep Exchange</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default VirtualTryOn;

