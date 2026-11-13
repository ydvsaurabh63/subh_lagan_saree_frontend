import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  RotateCcw,
  ShoppingBag,
  ImagePlus,
  Camera,
  Sparkles,
  Shirt,
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
    handleStartOver: contextStartOver,
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
  const [isDraped, setIsDraped] = useState(false);
  const [showSareePicker, setShowSareePicker] = useState(false);

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
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Reset input value so selecting the same file later still fires onChange
    const inputElement = e.target;

    // Check if valid image by type or extension (supports Android content URIs & iOS HEIC)
    const isImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(jpe?g|png|webp|gif|bmp|heic|heif|jfif|svg)$/i.test(file.name || '') ||
      !file.type; // Some mobile galleries pass empty MIME type

    if (!isImage) {
      toast.error('Please select an image file from your gallery');
      if (inputElement) inputElement.value = '';
      return;
    }

    // 1. Instant display with Object URL (0ms, synchronous, zero memory overhead)
    try {
      const instantUrl = URL.createObjectURL(file);
      setCustomUserPhoto(instantUrl);
      setIsDraped(false);
      toast.success('Photo loaded! Tap "Generate" to drape saree ✨', {
        id: 'tryon-upload',
        duration: 3500,
      });
    } catch (err) {
      console.warn('URL.createObjectURL failed, falling back to FileReader:', err);
    }

    // 2. Also read via FileReader so the image persists as base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        setCustomUserPhoto(result);
        setIsDraped(false);
      }
    };
    reader.onerror = (err) => {
      console.warn('FileReader error:', err);
    };

    try {
      reader.readAsDataURL(file);
    } catch (readErr) {
      console.warn('readAsDataURL threw:', readErr);
    }

    if (inputElement) {
      inputElement.value = '';
    }
  };

  // Select saree from curated list
  const handleSelectSaree = (look) => {
    const main = look.items?.find((it) => it.isMain) || look.items?.[0];
    setSelectedProduct({
      _id: main?.id || `look-${look.id}`,
      name: main?.name || look.lookTitle,
      fabric: look.tagline?.split('•')[0]?.trim() || 'Pure Katan Silk',
      price: main?.price || 19999,
      originalPrice: main?.originalPrice || 24999,
      image: main?.image || look.cropImage,
      drapedPreview: look.modelImage,
      slug: look.sareeSlug || '',
    });
    setIsDraped(false);
    setShowSareePicker(false);
    toast.success(`Selected "${main?.name || look.lookTitle}"! ✨`);
  };

  // Upload a custom saree image from gallery
  const handleCustomSareeUpload = (e) => {
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const isImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(jpe?g|png|webp|gif|bmp|heic|heif|jfif|svg)$/i.test(file.name || '') ||
      !file.type;

    if (!isImage) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setSelectedProduct({
        _id: 'custom-saree-' + Date.now(),
        name: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Custom Saree',
        fabric: 'Handcrafted Silk',
        price: 19999,
        originalPrice: 24999,
        image: objectUrl,
        drapedPreview: objectUrl,
        slug: '',
      });
      setIsDraped(false);
      setShowSareePicker(false);
      toast.success('Saree image updated! Tap Generate to drape ✨');
    } catch (err) {
      console.warn('Error loading custom saree:', err);
    }
  };

  const handleStartOver = () => {
    setIsDraped(false);
    contextStartOver();
  };

  // 1. "Generate" Action: Runs AI Simulation Draping
  const handleGenerate = () => {
    if (!customUserPhoto) {
      toast('Please upload your photo first to generate trial!', {
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
      setIsDraped(true);
      toast.success(`Draped "${activeProduct.name}" successfully! ✨`, {
        id: 'generate-success',
        duration: 3000,
      });
    }, 1800);
  };

  // 2. "Buy" Action: Adds to Cart and Navigates to Checkout
  const handleBuy = () => {
    if (!activeProduct) {
      toast.error('Please select a saree to buy');
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
      {/* Modal Card / Content Box: Full-page on mobile, Centered Luxury Modal on Laptop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full min-h-screen md:min-h-0 md:h-auto md:max-h-[92vh] md:max-w-md lg:max-w-lg bg-[#121214] md:bg-[#141416] md:border md:border-stone-800/90 md:rounded-3xl md:shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-y-auto"
      >
        {/* Native Hidden File Input (Inside modal card with stopPropagation so it never triggers closeTryOn) */}
        <input
          id="fitting-room-file-input"
          type="file"
          ref={fileInputRef}
          onChange={handleGalleryUpload}
          onClick={(e) => e.stopPropagation()}
          accept="image/*"
          className="sr-only"
        />
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
                type="button"
                onClick={handleStartOver}
                className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
                title="Reset All"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={closeTryOn}
              className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 md:flex-initial w-full max-w-xl mx-auto px-4 py-3 sm:py-4 md:p-5 flex flex-col justify-between md:justify-start space-y-4">
          
          {/* ========================================================= */}
          {/* UPPER SIDE: UPLOAD PHOTO OPTION / PREVIEW FRAME            */}
          {/* ========================================================= */}
          <section aria-label="Upload User Photo" className="w-full">
            {!customUserPhoto ? (
              /* UPPER UPLOAD BOX (Native <label> triggers gallery on all mobile devices) */
              <label
                htmlFor="fitting-room-file-input"
                className="w-full aspect-[3/4] max-w-md mx-auto max-h-[58vh] sm:max-h-[64vh] md:max-h-[360px] lg:max-h-[400px] rounded-3xl border-2 border-dashed border-[#D97706] bg-gradient-to-b from-[#D97706]/15 via-[#D97706]/5 to-transparent hover:bg-[#D97706]/20 transition-all duration-300 p-6 text-center cursor-pointer group shadow-[0_0_40px_rgba(217,119,6,0.25)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] active:scale-98 flex flex-col items-center justify-center space-y-4"
              >
                {/* Circular Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Upload Photo
                  </h4>
                  <p className="text-xs text-amber-200/80 font-medium mt-1">
                    Tap to choose from Gallery
                  </p>
                </div>
              </label>
            ) : (
              /* UPPER PHOTO PREVIEW FRAME (Displays 100% full uncropped user photo) */
              <div className="relative w-full aspect-[3/4] max-w-md mx-auto max-h-[62vh] sm:max-h-[68vh] md:max-h-[420px] rounded-3xl overflow-hidden bg-[#0A0A0C] border border-stone-800 shadow-2xl group flex items-center justify-center">
                {/* Ambient Soft Blur Layer from same photo to fill background seamlessly */}
                <img
                  src={isDraped ? (activeProduct?.drapedPreview || customUserPhoto) : customUserPhoto}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none select-none"
                />

                {/* Subtle vignette over ambient blur */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none select-none z-[5]" />

                {/* 100% Full Uncropped Photo - No parts chopped off */}
                <img
                  src={isDraped ? (activeProduct?.drapedPreview || customUserPhoto) : customUserPhoto}
                  alt="Try-On Preview"
                  onError={(e) => {
                    console.error('Image load error in preview:', e);
                  }}
                  className="relative z-10 w-full h-full object-contain object-center transition-all duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                />

                {/* Upper Left Badge */}
                <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-xs font-bold text-white border border-white/10 shadow-lg flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isDraped ? 'bg-[#D97706] animate-pulse' : 'bg-emerald-500'}`} />
                  <span>{isDraped ? '✨ AI Draped' : 'Your Photo'}</span>
                </div>

                {/* Upper Right "Change Photo" Button (Native label) */}
                <label
                  htmlFor="fitting-room-file-input"
                  className="absolute top-3 right-3 z-20 py-1.5 px-3 rounded-full bg-black/85 hover:bg-black text-xs font-bold text-[#F59E0B] border border-[#F59E0B]/50 shadow-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-md"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4 text-[#F59E0B]" />
                  <span>Change Photo</span>
                </label>

                {/* Processing Overlay when Generating */}
                {isProcessing && (
                  <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-2 animate-fadeIn">
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
            {/* Saree Image Only (Left) & Change Saree Button (Right) */}
            <div className="mb-3 px-1 flex items-center justify-between">
              {/* Only Saree Image (No text! Clickable to change too) */}
              <button
                type="button"
                onClick={() => setShowSareePicker(true)}
                className="relative flex-shrink-0 group focus:outline-none cursor-pointer"
                title="Change Saree"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#D97706] via-amber-400 to-[#D97706] shadow-[0_0_18px_rgba(217,119,6,0.45)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-900 border border-stone-800">
                    <img
                      src={activeProduct?.image || activeProduct?.drapedPreview}
                      alt={activeProduct?.name || 'Selected Saree'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[9px] font-black shadow border border-[#121214]">
                  ✓
                </span>
              </button>

              {/* Change Saree Button */}
              <button
                type="button"
                onClick={() => setShowSareePicker(true)}
                className="py-1.5 px-3.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-xs font-bold text-amber-300 border border-amber-500/50 shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-sm"
                title="Change Saree Design"
              >
                <Shirt className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Saree</span>
              </button>
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
                <span>{isProcessing ? 'Draping...' : isDraped ? 'Re-Drape' : 'Generate'}</span>
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

      {/* ========================================================= */}
      {/* SAREE PICKER MODAL: SELECT OR UPLOAD ANY SAREE DESIGN     */}
      {/* ========================================================= */}
      {showSareePicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setShowSareePicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#141416] border border-stone-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-800/90 flex items-center justify-between bg-stone-900/60">
              <div className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    Change Saree Design
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Pick from collection or upload custom saree
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSareePicker(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-4 overflow-y-auto space-y-3.5 max-h-[65vh]">
              {/* Option 1: Upload Custom Saree from Gallery */}
              <label
                htmlFor="custom-saree-upload-input"
                className="w-full p-3.5 rounded-2xl border-2 border-dashed border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 transition flex items-center gap-3.5 cursor-pointer group active:scale-98"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-bold text-amber-300">
                    Upload Saree Photo from Gallery
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-200/70 mt-0.5">
                    Tap to upload any saree image to drape
                  </p>
                </div>
              </label>
              <input
                id="custom-saree-upload-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCustomSareeUpload}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Option 2: Curated Sarees List */}
              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2 px-1">
                  Royal Curated Sarees ({sareeLooks.length})
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {sareeLooks.map((look) => {
                    const main = look.items?.find((it) => it.isMain) || look.items?.[0];
                    const isSelected =
                      activeProduct?._id === main?.id ||
                      activeProduct?.name === main?.name ||
                      activeProduct?.image === (main?.image || look.cropImage);

                    return (
                      <button
                        key={look.id}
                        type="button"
                        onClick={() => handleSelectSaree(look)}
                        className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition active:scale-98 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500'
                            : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-950 flex-shrink-0 border border-stone-800">
                          <img
                            src={main?.image || look.cropImage}
                            alt={main?.name || look.lookTitle}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-serif font-bold text-white truncate">
                            {main?.name || look.lookTitle}
                          </p>
                          <p className="text-[10px] text-amber-400 font-bold mt-0.5">
                            {formatPrice(main?.price || 19999)}
                          </p>
                          {isSelected && (
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FittingRoomPanel;
