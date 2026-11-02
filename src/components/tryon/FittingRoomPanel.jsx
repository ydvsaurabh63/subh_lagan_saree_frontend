import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Camera,
  RotateCcw,
  ShoppingBag,
  Check,
  X,
  Search,
  User,
  ShieldCheck,
  Trash2,
  ImagePlus,
} from 'lucide-react';
import { useTryOn, sampleAvatars } from '../../context/TryOnContext.jsx';
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
    currentModel,
    setCurrentModel,
    customUserPhoto,
    setCustomUserPhoto,
    isProcessing,
    processingStep,
  } = useTryOn();

  const { addToCart } = useCart();
  const fileInputRef = useRef(null);
  const [showModelPicker, setShowModelPicker] = useState(false);

  if (!isOpen) return null;

  // Handle Photo Upload from User's Device / Gallery
  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUserPhoto(event.target.result);
        setShowModelPicker(false);
        toast.success('Gallery photo loaded! AI fitting saree...', {
          icon: '📸',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('No saree selected! Click the hanger 👕 on any product first.');
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

  // Determine which image to show in the photo box
  const displayImage = customUserPhoto
    ? customUserPhoto
    : selectedProduct
    ? selectedProduct.drapedPreview
    : currentModel.image;

  return (
    <>
      {/* 
        NO-SCROLLBAR COMPACT DOCKED PANEL
        Everything is visible in one single view without any scrolling!
      */}
      <aside
        aria-label="Virtual Fitting Room"
        className="fixed left-3 sm:left-6 top-16 sm:top-20 z-50 w-[310px] sm:w-[350px] bg-[#161618] border border-stone-800 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden transition-all duration-300 animate-fade-in p-3.5 sm:p-4 space-y-2.5 select-none"
      >
        {/* Hidden File Input for Device/Gallery Photo Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleGalleryUpload}
          accept="image/*"
          className="hidden"
        />

        {/* 1. Header (Compact) */}
        <div className="pb-1.5 border-b border-stone-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Fitting room
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/40 text-[#F59E0B] text-[9.5px] font-bold flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-[#F59E0B]" />
                <span>LightX AI</span>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleStartOver}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Reset Fitting Room"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closeTryOn}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[10.5px] text-stone-400 font-normal mt-0.5 leading-snug">
            Mix & match pieces, choose realistic models or use your photo.
          </p>
        </div>

        {/* 2. Photo Display Card (Sized so everything fits in 1 view with NO scrollbar) */}
        <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner group">
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-stone-200 border border-white/10">
            <User className="w-2.5 h-2.5 text-stone-400" />
            <span className="truncate max-w-[120px]">{customUserPhoto ? 'Your Gallery Photo' : currentModel.name}</span>
          </div>

          <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-stone-200 border border-white/10 uppercase tracking-wider">
            <Camera className="w-2.5 h-2.5 text-stone-400" />
            <span>Photo</span>
          </div>

          {/* Saree Fit Image / Model Render */}
          <div className="w-full h-full flex items-center justify-center p-1.5 bg-gradient-to-b from-stone-900 to-[#19191d]">
            <img
              src={displayImage}
              alt={selectedProduct ? selectedProduct.name : currentModel.name}
              className={`max-h-full max-w-full transition-transform duration-300 ${
                customUserPhoto
                  ? 'object-contain rounded-lg'
                  : 'object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.85)]'
              }`}
            />
          </div>

          {/* Bottom Right Zoom Icon */}
          <button
            onClick={() => toast('Zoom preview')}
            className="absolute bottom-2 right-2 z-10 w-6 h-6 rounded-full bg-black/70 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-white/10 transition active:scale-95"
            title="Inspect Details"
          >
            <Search className="w-3 h-3" />
          </button>

          {/* AI Scanning Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-2 animate-fade-in">
              <div className="w-10 h-10 rounded-full border-2 border-[#D97706] flex items-center justify-center bg-[#D97706]/15 animate-spin">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <p className="text-xs font-serif font-bold text-stone-100">AI Fitting Saree...</p>
              <p className="text-[9.5px] text-stone-400 font-mono truncate max-w-full">{processingStep}</p>
            </div>
          )}
        </div>

        {/* 3. Action Buttons: Gallery Upload & Model Picker */}
        <div className="grid grid-cols-2 gap-2">
          {/* Prominent Gallery Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-1.5 px-2 rounded-xl bg-[#242428] hover:bg-[#2f2f35] text-stone-100 text-[11px] font-bold flex items-center justify-center space-x-1.5 border border-[#D97706]/50 hover:border-[#D97706] transition active:scale-95 shadow-sm"
            title="Upload photo from Gallery or Files"
          >
            <ImagePlus className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Upload Gallery</span>
          </button>

          {/* Model Switcher Button */}
          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="py-1.5 px-2 rounded-xl bg-[#2b2420] hover:bg-[#362d28] text-[#F59E0B] text-[11px] font-bold flex items-center justify-center space-x-1.5 border border-[#D97706]/40 transition active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="truncate">{customUserPhoto ? 'Change Model' : currentModel.name}</span>
          </button>
        </div>

        {/* Collapsible Model Avatar Switcher */}
        {showModelPicker && (
          <div className="p-2 bg-[#1e1e22] rounded-xl border border-stone-800 space-y-1 animate-fade-in">
            <div className="flex items-center justify-between text-[9px] font-bold text-stone-400 uppercase tracking-wider">
              <span>Choose Realistic Model</span>
              {customUserPhoto && (
                <button
                  onClick={() => { setCustomUserPhoto(null); toast('Reset to AI Model'); }}
                  className="text-[#F59E0B] hover:underline"
                >
                  Clear Photo
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {sampleAvatars.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    setCustomUserPhoto(null);
                    setCurrentModel(av);
                    setShowModelPicker(false);
                    toast.success(`Selected ${av.name}`);
                  }}
                  className={`p-1 rounded-lg border text-center transition flex flex-col items-center space-y-0.5 ${
                    currentModel.id === av.id && !customUserPhoto
                      ? 'border-[#D97706] bg-[#D97706]/15 text-[#F59E0B]'
                      : 'border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-800 border border-stone-700">
                    <img src={av.image} alt={av.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="text-[8.5px] truncate max-w-full font-medium">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. "Your picks" Section (Compact, No Overflow) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-xs text-stone-100 font-serif">Your picks</span>
            <span className="text-stone-400 text-[10px]">
              {selectedProduct ? '1 piece' : '0 pieces'}
            </span>
          </div>

          {!selectedProduct ? (
            <div className="py-2 px-2.5 rounded-xl border border-dashed border-stone-800 bg-stone-900/40 text-center">
              <p className="text-[10px] text-stone-400 italic">
                No clothes selected yet. Click the hanger on any product to wear!
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-1.5 rounded-xl border border-[#D97706] bg-[#D97706]/10 text-white animate-fade-in">
              {/* Swatch */}
              <div className="w-8 h-10 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0 bg-stone-800">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 text-left">
                <h6 className="font-serif text-[11px] font-bold truncate text-stone-100 leading-tight">
                  {selectedProduct.name}
                </h6>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-[11px] font-black text-[#F59E0B]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-[9px] text-stone-500 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <button
                  onClick={clearSelectedProduct}
                  className="p-1 rounded text-stone-400 hover:text-red-400 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Engine Footer */}
        <div className="pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[9px] text-stone-400 font-mono">
          <span className="flex items-center space-x-1 text-stone-400">
            <Sparkles className="w-2.5 h-2.5 text-[#F59E0B]" />
            <span>LightX AI Try-On</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>Key secured</span>
          </span>
        </div>

        {/* 6. Bottom Action Buttons */}
        <div className="flex items-center space-x-2 pt-0.5">
          <button
            onClick={handleStartOver}
            className="py-2 px-2.5 rounded-xl bg-[#242428] hover:bg-[#2e2e33] text-[11px] font-semibold text-stone-300 flex items-center justify-center space-x-1 border border-stone-700 transition active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Start over</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct}
            className={`flex-1 py-2 px-3 rounded-xl text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg transition active:scale-98 ${
              selectedProduct
                ? 'bg-[#D97706] hover:bg-[#B45309] cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to bag</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default FittingRoomPanel;
