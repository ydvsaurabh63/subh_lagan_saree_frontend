import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  RotateCcw,
  ShoppingBag,
  ImagePlus,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useTryOn } from '../../context/TryOnContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import { sareeLooks } from '../../data/curatedSarees.js';
import toast from 'react-hot-toast';

const FittingRoomPanel = () => {
  const {
    isOpen,
    closeTryOn,
    selectedProduct,
    setSelectedProduct,
    handleStartOver,
    customUserPhoto,
    setCustomUserPhoto,
    isProcessing,
    setIsProcessing,
    processingStep,
    setProcessingStep,
  } = useTryOn();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // Initialize selected product if none was pre-selected
  useEffect(() => {
    if (isOpen && !selectedProduct && sareeLooks.length > 0) {
      const first = sareeLooks[0];
      const main = first.items?.find((it) => it.isMain) || first.items?.[0];
      setSelectedProduct({
        _id: main?.id || `look-${first.id}`,
        name: main?.name || first.lookTitle,
        fabric: first.tagline?.split('•')[0]?.trim() || 'Pure Katan Silk',
        price: main?.price || 19999,
        originalPrice: main?.originalPrice || 24999,
        image: main?.image || first.cropImage,
        drapedPreview: first.modelImage,
        slug: first.sareeSlug || '',
      });
    }
  }, [isOpen, selectedProduct, setSelectedProduct]);

  // Lock body scroll while full-page Fitting Room is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Active product to display
  const activeProduct = selectedProduct || {
    _id: 'saree-1',
    name: sareeLooks[0]?.items?.[0]?.name || 'Royal Crimson Banarasi Katan Silk Saree',
    fabric: 'Pure Katan Silk',
    price: sareeLooks[0]?.items?.[0]?.price || 19999,
    originalPrice: sareeLooks[0]?.items?.[0]?.originalPrice || 24999,
    image: sareeLooks[0]?.cropImage || '/models/model-1-crop.png',
    drapedPreview: sareeLooks[0]?.modelImage || '/models/model-1.png',
    slug: sareeLooks[0]?.sareeSlug || '',
  };

  // Handle Photo Upload directly from Gallery / Files
  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUserPhoto(event.target.result);
        toast.success('Photo uploaded from gallery!', { icon: '📸' });
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. "Generate" Action: Runs AI Simulation Draping
  const handleGenerate = () => {
    if (!customUserPhoto) {
      toast('Please upload your photo at the top first to generate try-on!', {
        icon: '📸',
      });
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Detecting posture & body silhouette...');

    setTimeout(() => {
      setProcessingStep('Aligning saree pleats, pallu drape & zari shine...');
    }, 600);

    setTimeout(() => {
      setProcessingStep('Finalizing photorealistic Indian drape...');
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Draped "${activeProduct.name}" successfully! ✨`, {
        id: 'generate-success',
        duration: 3000,
      });
    }, 1800);
  };

  // 2. "Buy" Action: Adds to Cart and Navigates to Checkout
  const handleBuy = () => {
    if (!activeProduct) {
      toast.error('Please select a cloth / saree to buy');
      return;
    }

    addToCart(
      {
        _id: activeProduct._id,
        name: `${activeProduct.name} (Virtual Fitting)`,
        price: activeProduct.originalPrice || activeProduct.price,
        discountPrice: activeProduct.price,
        images: [activeProduct.image || activeProduct.drapedPreview],
        fabric: activeProduct.fabric || 'Pure Handloom Silk',
        color: 'Royal Festive',
      },
      1
    );

    toast.success(`"${activeProduct.name}" added! Opening checkout...`, {
      icon: '🛍️',
    });

    closeTryOn();
    navigate('/checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fitting Room"
      onClick={closeTryOn}
      className="fixed inset-0 z-[9999] w-full h-[100dvh] max-h-[100dvh] bg-[#121214] md:bg-black/80 md:backdrop-blur-md text-white flex flex-col md:items-center md:justify-center md:p-3 lg:p-4 overflow-hidden select-none animate-fadeIn"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGalleryUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Modal Card / Content Box: Single Screen, Zero Scrollbar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full md:h-auto md:max-h-[94vh] md:max-w-md lg:max-w-lg bg-[#121214] md:bg-[#141416] md:border md:border-stone-800/90 md:rounded-3xl md:shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
      >
        {/* Full-Page / Modal Header */}
        <header className="flex-shrink-0 z-30 w-full bg-[#141416]/95 backdrop-blur-md border-b border-stone-800/90 px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-md md:rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
              Fitting room
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-[#D97706]/15 border border-[#D97706]/30 px-2 py-0.5 rounded-full">
              Virtual Trial
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {customUserPhoto && (
              <button
                onClick={handleStartOver}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
                title="Reset All"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeTryOn}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content: Single screen, flex-1 min-h-0, overflow-hidden (Never scrolls) */}
        <main className="flex-1 min-h-0 w-full max-w-xl mx-auto px-4 py-2 sm:py-3 flex flex-col justify-between overflow-hidden">
          
          {/* ========================================================= */}
          {/* UPPER SIDE: UPLOAD PHOTO OPTION / PREVIEW FRAME            */}
          {/* ========================================================= */}
          <section aria-label="Upload User Photo" className="flex-1 min-h-0 w-full flex items-center justify-center py-1">
            {!customUserPhoto ? (
              /* UPPER UPLOAD BOX (Auto-adapts to available screen height) */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full max-h-[48vh] md:max-h-[300px] lg:max-h-[340px] aspect-[4/3] sm:aspect-[3/4] max-w-sm mx-auto rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#D97706] bg-gradient-to-b from-[#D97706]/15 via-[#D97706]/5 to-transparent hover:bg-[#D97706]/20 transition-all duration-300 p-4 text-center cursor-pointer group shadow-[0_0_30px_rgba(217,119,6,0.25)] hover:shadow-[0_0_50px_rgba(217,119,6,0.4)] active:scale-99 flex flex-col items-center justify-center space-y-2.5 sm:space-y-3"
              >
                {/* Circular Icon */}
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  Upload Photo
                </h4>
              </div>
            ) : (
              /* UPPER PHOTO PREVIEW FRAME (When Photo is Uploaded) */
              <div className="relative w-full h-full max-h-[48vh] md:max-h-[300px] lg:max-h-[340px] aspect-[4/3] sm:aspect-[3/4] max-w-sm mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-2xl group">
                <img
                  src={activeProduct?.drapedPreview || customUserPhoto}
                  alt="Try-On Preview"
                  className="w-full h-full object-contain sm:object-cover object-top transition-all duration-300"
                />

                {/* Upper Left Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Your Photo</span>
                </div>

                {/* Upper Right "Change Photo" Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2.5 right-2.5 z-10 py-1 px-2.5 rounded-full bg-black/80 hover:bg-black text-[11px] font-bold text-[#F59E0B] border border-[#F59E0B]/40 shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-md"
                  title="Change Photo"
                >
                  <Camera className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Change Photo</span>
                </button>

                {/* Processing Overlay when Generating */}
                {isProcessing && (
                  <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center text-white space-y-2 animate-fadeIn">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin"></div>
                    <p className="text-xs font-serif font-bold text-[#F59E0B]">
                      {processingStep || 'Draping Saree with AI...'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ========================================================= */}
          {/* BOTTOM ACTION ROW: "GENERATE" & "BUY"                     */}
          {/* ========================================================= */}
          <section aria-label="Trial Actions" className="flex-shrink-0 w-full pt-2 border-t border-stone-800/80">
            {/* Big Circle of Selected Product directly above Generate Button (No text, only image) */}
            <div className="mb-2 px-1 flex items-center">
              <div className="relative flex-shrink-0" title={activeProduct?.name}>
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full p-1 bg-gradient-to-tr from-[#D97706] via-amber-400 to-[#D97706] shadow-[0_0_18px_rgba(217,119,6,0.5)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-900 border-2 border-stone-800">
                    <img
                      src={activeProduct?.image || activeProduct?.drapedPreview}
                      alt={activeProduct?.name || 'Selected Saree'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shadow-md border-2 border-[#121214]">
                  ✓
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              
              {/* 1. GENERATE BUTTON */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                title="Generate AI Virtual Trial"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 animate-pulse text-amber-200" />
                <span>{isProcessing ? 'Generating...' : 'Generate'}</span>
              </button>

              {/* 2. BUY BUTTON */}
              <button
                type="button"
                onClick={handleBuy}
                className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-[#681B2C] hover:bg-[#852338] text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-black/40 border border-[#D4AF37]/50 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title={`Buy ${activeProduct.name}`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-[#D4AF37]" />
                <span className="truncate">Buy • {formatPrice(activeProduct.price)}</span>
              </button>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default FittingRoomPanel;