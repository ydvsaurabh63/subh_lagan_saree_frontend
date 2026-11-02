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

  // Handle User Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUserPhoto(event.target.result);
        toast.success('Your photo uploaded! AI fitting saree...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('No saree selected! Click the hanger on any saree first.');
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
        NON-BLOCKING DOCKED LEFT SIDE PANEL (MATCHING IMAGE 2)
        Does NOT block background scrolling or clicking on product cards!
      */}
      <aside
        aria-label="Virtual Fitting Room"
        className="fixed left-3 sm:left-6 top-16 sm:top-20 bottom-3 sm:bottom-6 z-50 w-[330px] sm:w-[380px] max-h-[calc(100vh-5.5rem)] flex flex-col bg-[#161618] border border-stone-800 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden transition-all duration-300 animate-fade-in"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Top Header */}
        <div className="px-5 pt-4 pb-2 border-b border-stone-800/60 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                Fitting room
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/40 text-[#F59E0B] text-[10px] font-bold flex items-center space-x-1">
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
                onClick={closeTryOn}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Close Fitting Room"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-400 font-normal mt-1 leading-snug">
            Mix & match pieces, choose realistic models or use your photo.
          </p>
        </div>

        {/* Scrollable Center Body */}
        <div className="overflow-y-auto px-4 sm:px-5 py-3 space-y-3 custom-scrollbar flex-1">
          
          {/* Main Photo Card Frame */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner group flex-shrink-0">
            
            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] font-semibold text-stone-200 border border-white/10">
              <User className="w-3 h-3 text-stone-400" />
              <span>{customUserPhoto ? 'Your Photo' : currentModel.name}</span>
            </div>

            <div className="absolute top-2.5 right-2.5 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-bold text-stone-200 border border-white/10 uppercase tracking-wider">
              <Camera className="w-3 h-3 text-stone-400" />
              <span>Photo</span>
            </div>

            {/* Saree Fit Image / Model Render */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-stone-900 to-[#1e1e24]">
              <img
                src={displayImage}
                alt={selectedProduct ? selectedProduct.name : currentModel.name}
                className={`w-full h-full transition-transform duration-500 ${
                  customUserPhoto
                    ? 'object-cover object-top'
                    : selectedProduct
                    ? 'object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]'
                    : 'object-cover object-top'
                }`}
              />
            </div>

            {/* Bottom Right Zoom Icon */}
            <button
              onClick={() => toast('Zoom preview')}
              className="absolute bottom-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-white/10 transition active:scale-95"
              title="Inspect Details"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Processing Overlay Scanner */}
            {isProcessing && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full border-2 border-[#D97706] flex items-center justify-center bg-[#D97706]/15 animate-spin">
                  <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div>
                  <h5 className="font-serif text-xs sm:text-sm font-bold text-stone-100">
                    AI Fitting Saree...
                  </h5>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">
                    {processingStep}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-2.5 rounded-xl bg-[#242428] hover:bg-[#2e2e33] text-[11px] font-semibold text-stone-200 flex items-center justify-center space-x-1.5 border border-stone-700/60 transition active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-stone-400" />
              <span>Change Your Photo</span>
            </button>

            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="py-2 px-2.5 rounded-xl bg-[#2b2420] hover:bg-[#362d28] text-[11px] font-semibold text-[#F59E0B] flex items-center justify-center space-x-1.5 border border-[#D97706]/40 transition active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="truncate">{currentModel.name}</span>
            </button>
          </div>

          {/* Collapsible Model Avatar Switcher */}
          {showModelPicker && (
            <div className="p-2.5 bg-[#1e1e22] rounded-xl border border-stone-800 space-y-1.5 animate-fade-in">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Select Model
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {sampleAvatars.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      setCustomUserPhoto(null);
                      setCurrentModel(av);
                      setShowModelPicker(false);
                      toast.success(`Switched model to ${av.name}`);
                    }}
                    className={`p-1 rounded-lg border text-center transition flex flex-col items-center space-y-1 ${
                      currentModel.id === av.id && !customUserPhoto
                        ? 'border-[#D97706] bg-[#D97706]/10 text-[#F59E0B]'
                        : 'border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-800 border border-stone-700">
                      <img src={av.image} alt={av.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[9px] truncate max-w-full font-medium">
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* "Your picks" Section (Exact replica of Image 2) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-xs sm:text-sm text-stone-100 font-serif">
                Your picks
              </span>
              <span className="text-stone-400 text-[10px] sm:text-[11px]">
                {selectedProduct ? '1 piece' : '0 pieces'}
              </span>
            </div>

            {/* When NO Product Selected yet (Exact text & style from Image 2) */}
            {!selectedProduct ? (
              <div className="py-3 px-3 rounded-xl border border-dashed border-stone-800/90 bg-stone-900/40 text-center">
                <p className="text-[11px] text-stone-400 italic leading-relaxed">
                  No clothes selected yet. Click the hanger on any product to wear!
                </p>
              </div>
            ) : (
              /* When Product Selected: Display the Saree card */
              <div className="flex items-center space-x-2.5 p-2 rounded-xl border border-[#D97706] bg-[#D97706]/10 text-white animate-fade-in">
                {/* Swatch */}
                <div className="w-10 h-12 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0 bg-stone-800">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-left">
                  <h6 className="font-serif text-xs font-bold truncate text-stone-100">
                    {selectedProduct.name}
                  </h6>
                  <p className="text-[10px] text-stone-400 truncate">
                    {selectedProduct.fabric}
                  </p>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-xs font-extrabold text-[#F59E0B]">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-[10px] text-stone-500 line-through">
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove / Check Action */}
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <button
                    onClick={clearSelectedProduct}
                    className="p-1 rounded text-stone-400 hover:text-red-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Engine Footer */}
        <div className="px-5 py-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400 font-mono flex-shrink-0 bg-[#141416]">
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
        <div className="px-5 pb-4 pt-2 flex items-center space-x-2.5 flex-shrink-0 bg-[#161618]">
          <button
            onClick={handleStartOver}
            className="py-2.5 px-3 rounded-xl bg-[#242428] hover:bg-[#2e2e33] text-xs font-semibold text-stone-300 flex items-center justify-center space-x-1.5 border border-stone-700 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg transition active:scale-98 ${
              selectedProduct
                ? 'bg-[#D97706] hover:bg-[#B45309] cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to bag</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default FittingRoomPanel;

