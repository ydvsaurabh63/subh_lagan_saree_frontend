import React, { useState, useRef, useEffect } from 'react';
import {
  Shirt,
  Sparkles,
  Camera,
  RotateCcw,
  ShoppingBag,
  Check,
  X,
  Search,
  User,
  ShieldCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

// 10 Curated Royal Sarees for the Fitting Room
const tryOnSarees = [
  {
    id: 'try-1',
    name: 'Royal Crimson Banarasi Katan Silk',
    fabric: 'Pure Katan Silk • Gold Zari Kadhwa',
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
    name: 'Royal Sapphire Brocade Silk Saree',
    fabric: 'Pure Silk • Antique Gold Brocade',
    price: 21999,
    originalPrice: 26999,
    color: 'Sapphire Blue',
    colorHex: '#1e3a8a',
    swatch: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-5.png',
    slug: 'royal-sapphire-blue-brocade-silk-saree',
  },
  {
    id: 'try-6',
    name: 'Sunshine Yellow Chanderi Silk Saree',
    fabric: 'Festive Chanderi • Zari Border',
    price: 12499,
    originalPrice: 15999,
    color: 'Mustard Yellow',
    colorHex: '#b45309',
    swatch: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-6.png',
    slug: 'mustard-gold-handloom-chanderi-saree',
  },
  {
    id: 'try-7',
    name: 'Royal Plum Purple Kanjivaram Silk',
    fabric: 'Pure Korvai Silk • Magenta Zari Pallu',
    price: 24999,
    originalPrice: 29999,
    color: 'Plum Purple',
    colorHex: '#581c87',
    swatch: 'https://images.unsplash.com/photo-1610030469668-9655519803b0?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-7.png',
    slug: 'maharani-emerald-gold-kanjivaram-silk-saree',
  },
  {
    id: 'try-8',
    name: 'Pastel Peach Floral Organza Saree',
    fabric: 'Silk Organza • Scalloped Resham Weave',
    price: 16999,
    originalPrice: 21000,
    color: 'Pastel Peach',
    colorHex: '#fed7aa',
    swatch: 'https://images.unsplash.com/photo-1609357605051-bd6b7588e1aa?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-8.png',
    slug: 'blush-rose-french-organza-saree',
  },
  {
    id: 'try-9',
    name: 'Midnight Black Banarasi Brocade Silk',
    fabric: 'Pure Katan Silk • Shikargah Zari',
    price: 22499,
    originalPrice: 27500,
    color: 'Midnight Black',
    colorHex: '#18181b',
    swatch: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-9.png',
    slug: 'midnight-navy-sequin-georgette-saree',
  },
  {
    id: 'try-10',
    name: 'Peacock Teal Heritage Mulberry Silk',
    fabric: 'Mulberry Silk • Woven Peacock Pallu',
    price: 23999,
    originalPrice: 28999,
    color: 'Peacock Teal',
    colorHex: '#0f766e',
    swatch: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=400&q=80',
    drapedPreview: '/models/model-10.png',
    slug: 'royal-crimson-banarasi-katan-silk-saree',
  },
];

// Preset model avatars
const sampleAvatars = [
  { id: 'av-1', name: 'Priya Sharma', image: '/models/model-1.png' },
  { id: 'av-2', name: 'Ananya Verma', image: '/models/model-2.png' },
  { id: 'av-3', name: 'Divya Patel', image: '/models/model-3.png' },
  { id: 'av-4', name: 'Arjun Sharma', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
];

const VirtualTryOn = () => {
  const { addToCart } = useCart();
  const fileInputRef = useRef(null);

  // Modal Open/Close State
  const [isOpen, setIsOpen] = useState(false);

  // Fitting Room States
  const [currentModel, setCurrentModel] = useState(sampleAvatars[0]);
  const [customUserPhoto, setCustomUserPhoto] = useState(null);
  const [selectedSaree, setSelectedSaree] = useState(tryOnSarees[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle User Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image (PNG, JPG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUserPhoto(event.target.result);
        triggerAiDraping();
        toast.success('Your photo uploaded! AI fitting saree...');
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Draping Simulation
  const triggerAiDraping = () => {
    setIsProcessing(true);
    setProcessingStep('Detecting posture & body silhouette...');

    setTimeout(() => {
      setProcessingStep('Aligning pleats, pallu drape & zari reflection...');
    }, 800);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${selectedSaree.name} draped successfully!`);
    }, 1600);
  };

  const handleSareeSelect = (saree) => {
    setSelectedSaree(saree);
    triggerAiDraping();
  };

  const handleStartOver = () => {
    setCustomUserPhoto(null);
    setCurrentModel(sampleAvatars[0]);
    setSelectedSaree(tryOnSarees[0]);
    toast.success('Fitting room reset to default!');
  };

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
    toast.success(`"${selectedSaree.name}" added to Bag!`);
  };

  return (
    <>
      {/* =================================================================== */}
      {/* 1. "TRY IT ON" PILL TRIGGER BUTTON (EXACT MATCH TO 2ND REFERENCE)   */}
      {/* =================================================================== */}
      <section className="py-3 sm:py-4 bg-[#F8F7F4] border-b border-stone-200 select-none">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Virtual Fitting Room"
            className="group flex items-center space-x-3.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#18181b] hover:bg-[#222226] text-white rounded-full border-2 border-[#D97706] shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(217,119,6,0.35)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {/* Circular Icon Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              <Shirt className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            </div>

            {/* Button Titles */}
            <div className="text-left pr-2">
              <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-white font-sans leading-tight">
                TRY IT ON
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-[#F59E0B] leading-tight">
                Virtual Fitting Room
              </div>
            </div>

            {/* Right Accent Pulse Dot */}
            <div className="relative w-2.5 h-2.5 flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              <span className="absolute inset-0 rounded-full bg-[#D97706] animate-ping opacity-60"></span>
            </div>
          </button>
        </div>
      </section>

      {/* Floating Sticky Widget on Bottom-Left for Quick Access Anywhere */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          onClick={() => setIsOpen(true)}
          title="Try on any Saree virtually"
          className="group flex items-center space-x-3 px-4 py-2.5 bg-[#18181b]/95 hover:bg-[#18181b] backdrop-blur-md text-white rounded-full border-2 border-[#D97706] shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_45px_rgba(217,119,6,0.45)] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow flex-shrink-0">
            <Shirt className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-black tracking-wider uppercase text-white font-sans leading-tight">
              TRY IT ON
            </div>
            <div className="text-[10px] font-semibold text-[#F59E0B] leading-tight">
              Fitting Room
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 2. "FITTING ROOM" DARK MODAL DIALOG (EXACT MATCH TO 3RD REFERENCE) */}
      {/* =================================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          {/* Backdrop Click to close */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="w-full max-w-[430px] bg-[#161618] border border-stone-800 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white overflow-hidden flex flex-col max-h-[92vh] relative my-auto animate-scale-up">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Top Modal Header */}
            <div className="px-5 pt-5 pb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-xl font-extrabold text-white tracking-tight">
                    Fitting room
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/40 text-[#F59E0B] text-[10px] font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                    <span>LightX AI Ready</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleStartOver}
                    className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                    title="Reset Fitting Room"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-stone-400 font-normal mt-1 leading-snug">
                Mix & match pieces, choose realistic models or use your photo.
              </p>
            </div>

            {/* Scrollable Body Content */}
            <div className="overflow-y-auto px-5 py-3 space-y-3.5 custom-scrollbar flex-1">
              
              {/* Photo Display Card */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner group">
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] font-semibold text-stone-200 border border-white/10">
                  <User className="w-3 h-3 text-stone-400" />
                  <span>{customUserPhoto ? 'Your Photo' : currentModel.name}</span>
                </div>

                <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-bold text-stone-200 border border-white/10 uppercase tracking-wider">
                  <Camera className="w-3 h-3 text-stone-400" />
                  <span>Photo</span>
                </div>

                {/* Saree Fit Image / Model */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-stone-900 to-[#1e1e24]">
                  {customUserPhoto ? (
                    <img
                      src={customUserPhoto}
                      alt="Your Photo"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <img
                      src={selectedSaree.drapedPreview}
                      alt={selectedSaree.name}
                      className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                    />
                  )}
                </div>

                {/* Bottom Right Zoom Icon */}
                <button
                  onClick={() => toast('Zoom preview view')}
                  className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/65 backdrop-blur-md text-stone-200 hover:text-white flex items-center justify-center border border-white/10 transition active:scale-95"
                  title="Inspect Details"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Processing Overlay Scanner */}
                {isProcessing && (
                  <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fade-in">
                    <div className="w-14 h-14 rounded-full border-2 border-[#D97706] flex items-center justify-center bg-[#D97706]/10 animate-spin">
                      <Sparkles className="w-7 h-7 text-[#F59E0B]" />
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-bold text-stone-100">
                        AI Fitting Saree...
                      </h5>
                      <p className="text-[11px] text-stone-400 mt-1 font-mono">
                        {processingStep}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Row directly below photo */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-[#242428] hover:bg-[#2e2e33] text-xs font-semibold text-stone-200 flex items-center justify-center space-x-2 border border-stone-700/60 transition active:scale-95"
                >
                  <Camera className="w-4 h-4 text-stone-400" />
                  <span>Change Your Photo</span>
                </button>

                <button
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="py-2.5 px-3 rounded-xl bg-[#2b2420] hover:bg-[#362d28] text-xs font-semibold text-[#F59E0B] flex items-center justify-center space-x-2 border border-[#D97706]/40 transition active:scale-95"
                >
                  <User className="w-4 h-4 text-[#F59E0B]" />
                  <span className="truncate">{currentModel.name}</span>
                </button>
              </div>

              {/* Collapsible Model Avatar Switcher */}
              {showModelPicker && (
                <div className="p-3 bg-[#1e1e22] rounded-xl border border-stone-800 space-y-2 animate-fade-in">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Avatar Model
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleAvatars.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setCustomUserPhoto(null);
                          setCurrentModel(av);
                          setShowModelPicker(false);
                          triggerAiDraping();
                        }}
                        className={`p-1.5 rounded-lg border text-center transition flex flex-col items-center space-y-1 ${
                          currentModel.id === av.id && !customUserPhoto
                            ? 'border-[#D97706] bg-[#D97706]/10 text-[#F59E0B]'
                            : 'border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-800 border border-stone-700">
                          <img src={av.image} alt={av.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[10px] truncate max-w-full font-medium">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saree Selection ("Your picks") */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sm text-stone-100 font-serif">
                    Your picks
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    1 piece selected
                  </span>
                </div>

                {/* Saree List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {tryOnSarees.map((saree) => {
                    const isSelected = selectedSaree.id === saree.id;
                    return (
                      <div
                        key={saree.id}
                        onClick={() => handleSareeSelect(saree)}
                        className={`flex items-center space-x-3 p-2 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'border-[#D97706] bg-[#D97706]/10 text-white'
                            : 'border-stone-800 hover:border-stone-700 bg-stone-900/60 text-stone-300'
                        }`}
                      >
                        {/* Swatch */}
                        <div className="w-11 h-13 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0 bg-stone-800">
                          <img src={saree.swatch} alt={saree.name} className="w-full h-full object-cover object-top" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 text-left">
                          <h6 className="font-serif text-xs font-bold truncate text-stone-100">
                            {saree.name}
                          </h6>
                          <p className="text-[10px] text-stone-400 truncate">
                            {saree.fabric}
                          </p>
                          <div className="flex items-baseline space-x-2 mt-0.5">
                            <span className="text-xs font-extrabold text-[#F59E0B]">
                              {formatPrice(saree.price)}
                            </span>
                            <span className="text-[10px] text-stone-500 line-through">
                              {formatPrice(saree.originalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Check Indicator */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-[#D97706] text-white' : 'border border-stone-700 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Footer Info */}
            <div className="px-5 pt-2 pb-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span className="flex items-center space-x-1 text-stone-400">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>LightX AI Try-On Engine</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Key secured on server</span>
              </span>
            </div>

            {/* Bottom Action Buttons */}
            <div className="px-5 pb-5 pt-2 flex items-center space-x-3">
              <button
                onClick={handleStartOver}
                className="py-3 px-3.5 rounded-xl bg-[#242428] hover:bg-[#2e2e33] text-xs font-semibold text-stone-300 flex items-center justify-center space-x-1.5 border border-stone-700 transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start over</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add to bag</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTryOn;
