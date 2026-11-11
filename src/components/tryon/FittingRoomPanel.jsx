import React, { useRef, useEffect } from 'react';
import {
  X,
  RotateCcw,
  ShoppingBag,
  ImagePlus,
  Camera,
} from 'lucide-react';
import { useTryOn } from '../../context/TryOnContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

const FittingRoomPanel = () => {
  const {
    isOpen,
    closeTryOn,
    selectedProduct,
    clearSelectedProduct,
    handleStartOver,
    customUserPhoto,
    setCustomUserPhoto,
    isProcessing,
  } = useTryOn();

  const { addToCart } = useCart();
  const fileInputRef = useRef(null);

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
        toast.success('Photo uploaded from gallery!', {
          icon: '📸',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('Select a saree from the catalog to add to bag');
      return;
    }

    addToCart(
      {
        _id: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.originalPrice,
        discountPrice: selectedProduct.price,
        images: [selectedProduct.image],
        fabric: selectedProduct.fabric,
        color: selectedProduct.color || 'Royal',
      },
      1
    );
    toast.success(`"${selectedProduct.name}" added to bag!`, {
      icon: '🛍️',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fitting Room"
      className="fixed inset-0 z-[9999] w-full h-full min-h-screen bg-[#121214] text-white flex flex-col overflow-y-auto select-none animate-fadeIn"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGalleryUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Full-Page Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-[#141416]/95 backdrop-blur-md border-b border-stone-800/90 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
            Fitting room
          </h3>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            Virtual Trial
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {customUserPhoto && (
            <button
              onClick={handleStartOver}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={closeTryOn}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition active:scale-95 cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Full-Page Content View */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
        {/* 
          STATE 1: NO PHOTO UPLOADED YET 
          LARGE FULL-PAGE "UPLOAD GALLERY" BOX
        */}
        {!customUserPhoto ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 my-auto">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[3/4] max-w-md max-h-[58vh] sm:max-h-[64vh] rounded-3xl border-2 border-dashed border-[#D97706] bg-gradient-to-b from-[#D97706]/15 via-[#D97706]/5 to-transparent hover:bg-[#D97706]/20 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer group shadow-[0_0_40px_rgba(217,119,6,0.25)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] active:scale-98"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D97706] text-white flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <ImagePlus className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                Upload Gallery
              </h4>
              <p className="text-sm sm:text-base text-[#F59E0B] font-semibold mt-1.5">
                Tap to upload your photo
              </p>

              {selectedProduct && (
                <div className="mt-4 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-stone-200 truncate max-w-[280px]">
                  Saree: <span className="text-[#F59E0B] font-bold">{selectedProduct.name}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-stone-400 text-center max-w-sm">
              Upload a full-length or portrait photo to instantly try on authentic royal sarees.
            </p>
          </div>
        ) : (
          /* 
            STATE 2: PHOTO UPLOADED FROM GALLERY (FULL-PAGE PORTRAIT)
          */
          <div className="w-full flex-1 flex flex-col justify-between space-y-4 my-auto animate-fadeIn">
            {/* Main Full-Size Portrait Photo Frame */}
            <div className="relative w-full aspect-[3/4] max-w-md max-h-[60vh] sm:max-h-[65vh] mx-auto rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-2xl">
              <img
                src={selectedProduct?.drapedPreview || customUserPhoto}
                alt="Your Photo"
                className="w-full h-full object-contain sm:object-cover object-top"
              />

              {/* Top-Left Badge */}
              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-white border border-white/10 shadow-sm">
                Your Photo
              </div>

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full border-3 border-[#D97706] border-t-transparent animate-spin"></div>
                  <p className="text-sm font-serif font-bold text-stone-100">Fitting Saree...</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="w-full max-w-md mx-auto space-y-3 pt-2">
              {/* Change Photo Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-[#222226] hover:bg-[#2c2c32] text-white text-sm font-bold flex items-center justify-center space-x-2 border border-stone-700/60 transition active:scale-98 shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#F59E0B]" />
                <span>Change Photo</span>
              </button>

              {/* Selected Saree & Add to Bag */}
              {selectedProduct && (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm px-1">
                    <span className="font-serif font-bold text-stone-200 truncate max-w-[240px]">
                      {selectedProduct.name}
                    </span>
                    <span className="font-bold text-[#F59E0B]">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to bag</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FittingRoomPanel;
