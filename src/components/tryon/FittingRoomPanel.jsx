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
      className="fixed inset-0 z-[9999] w-full h-full min-h-screen bg-[#121214] md:bg-black/80 md:backdrop-blur-md text-white flex flex-col md:items-center md:justify-center md:p-4 lg:p-6 overflow-y-auto select-none animate-fadeIn"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGalleryUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Modal Card / Content Box: Full-page on mobile, Centered Luxury Modal on Laptop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full min-h-screen md:min-h-0 md:h-auto md:max-h-[92vh] md:max-w-md lg:max-w-lg bg-[#121214] md:bg-[#141416] md:border md:border-stone-800/90 md:rounded-3xl md:shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-y-auto"
      >
        {/* Full-Page Sticky Header on Mobile, Modal Header on Laptop */}
        <header className="sticky top-0 z-30 w-full bg-[#141416]/95 backdrop-blur-md border-b border-stone-800/90 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-md md:rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
              Fitting room
            </h3>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F59E0B] bg-[#D97706]/15 border border-[#D97706]/30 px-2 py-0.5 rounded-full">
              Virtual Trial
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {customUserPhoto && (
              <button
                onClick={handleStartOver}
                className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
                title="Reset All"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={closeTryOn}
              className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* Main Content: Justify-between on Mobile, Compact & Flush on Laptop (No Empty Gap) */}
        <main className="flex-1 md:flex-initial w-full max-w-xl mx-auto px-4 py-3 sm:py-4 md:p-5 flex flex-col justify-between md:justify-start space-y-4">
          
          {/* ========================================================= */}
          {/* UPPER SIDE: UPLOAD PHOTO OPTION / PREVIEW FRAME            */}
          {/* ========================================================= */}
          <section aria-label="Upload User Photo" className="w-full">
            {!customUserPhoto ? (
              /* UPPER UPLOAD BOX */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[3/4] max-w-md mx-auto max-h-[58vh] sm:max-h-[64vh] md:max-h-[360px] lg:max-h-[400px] rounded-3xl border-2 border-dashed border-[#D97706] bg-gradient-to-b from-[#D97706]/15 via-[#D97706]/5 to-transparent hover:bg-[#D97706]/20 transition-all duration-300 p-6 text-center cursor-pointer group shadow-[0_0_40px_rgba(217,119,6,0.25)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] active:scale-99 flex flex-col items-center justify-center space-y-4"
              >
                {/* Circular Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Upload Photo
                </h4>
              </div>
            ) : (
              /* UPPER PHOTO PREVIEW FRAME (When Photo is Uploaded) */
              <div className="relative w-full aspect-[3/4] max-w-md mx-auto max-h-[58vh] sm:max-h-[64vh] md:max-h-[360px] lg:max-h-[400px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-2xl group">
                <img
                  src={activeProduct?.drapedPreview || customUserPhoto}
                  alt="Try-On Preview"
                  className="w-full h-full object-contain sm:object-cover object-top transition-all duration-300"
                />

                {/* Upper Left Badge */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-white border border-white/10 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Your Photo</span>
                </div>

                {/* Upper Right "Change Photo" Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-3 right-3 z-10 py-1.5 px-3 rounded-full bg-black/80 hover:bg-black text-xs font-bold text-[#F59E0B] border border-[#F59E0B]/40 shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-md"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4 text-[#F59E0B]" />
                  <span>Change Photo</span>
                </button>

                {/* Processing Overlay when Generating */}
                {isProcessing && (
                  <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-2 animate-fadeIn">
                    <div className="w-10 h-10 rounded-full border-3 border-[#D97706] border-t-transparent animate-spin"></div>
                    <p className="text-xs sm:text-sm font-serif font-bold text-[#F59E0B]">
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
          <section aria-label="Trial Actions" className="w-full pt-2 md:pt-3 border-t border-stone-800/80">
            {/* Big Circle of Selected Product directly above Generate Button (No text, only image) */}
            <div className="mb-3 px-1 flex items-center">
              <div className="relative flex-shrink-0" title={activeProduct?.name}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#D97706] via-amber-400 to-[#D97706] shadow-[0_0_22px_rgba(217,119,6,0.5)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-900 border-2 border-stone-800">
                    <img
                      src={activeProduct?.image || activeProduct?.drapedPreview}
                      alt={activeProduct?.name || 'Selected Saree'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md border-2 border-[#121214]">
                  ✓
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              
              {/* 1. GENERATE BUTTON */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                title="Generate AI Virtual Trial"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-200" />
                <span>{isProcessing ? 'Generating...' : 'Generate'}</span>
              </button>

              {/* 2. BUY BUTTON */}
              <button
                type="button"
                onClick={handleBuy}
                className="w-full py-3 px-3 rounded-xl bg-[#681B2C] hover:bg-[#852338] text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 border border-[#D4AF37]/50 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title={`Buy ${activeProduct.name}`}
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
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