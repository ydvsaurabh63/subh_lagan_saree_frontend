import React, { useRef } from 'react';
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
    <>
      {/* Semi-transparent backdrop overlay to dim background and close on outside tap */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[105] transition-opacity duration-300"
        onClick={closeTryOn}
        aria-hidden="true"
      />

      {/* 
        FITTING ROOM CARD: HORIZONTALLY CENTERED & POSITIONED BELOW HEADER
      */}
      <aside
        aria-label="Fitting Room"
        className="fixed left-1/2 -translate-x-1/2 top-[96px] sm:top-[112px] lg:top-[124px] z-[110] w-[320px] sm:w-[370px] max-w-[calc(100vw-28px)] max-h-[calc(100vh-125px)] overflow-y-auto bg-[#141416] border border-stone-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white transition-all duration-300 animate-fade-in p-3.5 sm:p-4 space-y-3 select-none"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleGalleryUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Header (Exact Match to Screenshot) */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800/90">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
            Fitting room
          </h3>
          <div className="flex items-center space-x-1">
            {customUserPhoto && (
              <button
                onClick={handleStartOver}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeTryOn}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 
          STATE 1: NO PHOTO UPLOADED YET 
          HIGHLIGHTED "UPLOAD GALLERY" BOX
        */}
        {!customUserPhoto ? (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/5] max-h-[350px] sm:max-h-[390px] rounded-2xl border-2 border-dashed border-[#D97706] bg-gradient-to-b from-[#D97706]/15 via-[#D97706]/5 to-transparent hover:bg-[#D97706]/20 transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-5 text-center cursor-pointer group shadow-[0_0_35px_rgba(217,119,6,0.2)] hover:shadow-[0_0_50px_rgba(217,119,6,0.35)] active:scale-98"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>

              <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                Upload Gallery
              </h4>
              <p className="text-xs sm:text-sm text-[#F59E0B] font-semibold mt-1">
                Tap to upload your photo
              </p>

              {selectedProduct && (
                <div className="mt-3.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] text-stone-200 truncate max-w-[240px]">
                  Saree: <span className="text-[#F59E0B] font-bold">{selectedProduct.name}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 
            STATE 2: PHOTO UPLOADED FROM GALLERY
          */
          <div className="space-y-3 animate-fade-in">
            {/* Main Portrait Photo Frame */}
            <div className="relative w-full aspect-[4/5] max-h-[350px] sm:max-h-[390px] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner">
              <img
                src={selectedProduct?.drapedPreview || customUserPhoto}
                alt="Your Photo"
                className="w-full h-full object-cover object-top"
              />

              {/* Top-Left Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 shadow-sm">
                Your Photo
              </div>

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center text-white space-y-2 animate-fade-in">
                  <div className="w-8 h-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin"></div>
                  <p className="text-xs font-serif font-bold text-stone-100">Fitting Saree...</p>
                </div>
              )}
            </div>

            {/* Change Photo Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#222226] hover:bg-[#2c2c32] text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border border-stone-700/60 transition active:scale-98 shadow-sm"
            >
              <Camera className="w-4 h-4 text-[#F59E0B]" />
              <span>Change Photo</span>
            </button>

            {/* Selected Saree & Add to Bag (When product is selected) */}
            {selectedProduct && (
              <div className="space-y-2 pt-1 border-t border-stone-800/80">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-serif font-bold text-stone-200 truncate max-w-[200px]">
                    {selectedProduct.name}
                  </span>
                  <span className="font-bold text-[#F59E0B]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to bag</span>
                </button>
              </div>
            )}
          </div>
        )}

      </aside>
    </>
  );
};

export default FittingRoomPanel;
