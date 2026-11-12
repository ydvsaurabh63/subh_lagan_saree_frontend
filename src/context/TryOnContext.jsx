import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const TryOnContext = createContext(null);

// Preset Avatar Models matching Reference UI
export const sampleAvatars = [
  {
    id: 'av-arjun',
    name: 'Arjun Sharma',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    type: 'male',
  },
  {
    id: 'av-priya',
    name: 'Priya Sharma',
    image: '/models/model-1.png',
    type: 'female',
  },
  {
    id: 'av-ananya',
    name: 'Ananya Verma',
    image: '/models/model-2.png',
    type: 'female',
  },
  {
    id: 'av-divya',
    name: 'Divya Patel',
    image: '/models/model-3.png',
    type: 'female',
  },
];

// Curated draping mapping for catalog sarees
const modelDrapes = [
  '/models/model-1.png',
  '/models/model-2.png',
  '/models/model-3.png',
  '/models/model-4.png',
  '/models/model-5.png',
  '/models/model-6.png',
  '/models/model-7.png',
  '/models/model-8.png',
  '/models/model-9.png',
  '/models/model-10.png',
];

export const TryOnProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentModel, setCurrentModel] = useState(sampleAvatars[0]); // Default to Arjun Sharma as in Image 2, or Priya Sharma
  const [customUserPhoto, setCustomUserPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Helper to resolve the best drape image
  const getDrapedImage = (product) => {
    if (!product) return currentModel.image;
    if (product.drapedPreview) return product.drapedPreview;
    
    // Hash the ID or slug to pick one of the 10 luxury saree model renders
    const str = product._id || product.slug || product.name || '0';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % modelDrapes.length;
    return modelDrapes[idx];
  };

  // Trigger AI Draping Simulation
  const triggerAiDraping = (productName) => {
    setIsProcessing(true);
    setProcessingStep('Detecting posture & body silhouette...');

    setTimeout(() => {
      setProcessingStep('Aligning pleats, pallu drape & zari reflection...');
    }, 700);

    setTimeout(() => {
      setIsProcessing(false);
      if (productName) {
        toast.success(`"${productName}" draped on model!`, {
          icon: '✨',
          duration: 2500,
        });
      }
    }, 1400);
  };

  // Try on a product from any ProductCard or detail page
  const tryOnProduct = (product) => {
    if (!product) return;
    
    const formattedProduct = {
      _id: product._id,
      name: product.name,
      fabric: product.fabric || (typeof product.category === 'object' ? product.category?.name : product.category) || 'Pure Silk',
      price: product.discountPrice || product.price,
      originalPrice: product.discountPrice ? product.price : (product.originalPrice || Math.round(product.price * 1.25)),
      image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      drapedPreview: getDrapedImage(product),
      slug: product.slug,
    };

    setSelectedProduct(formattedProduct);
    setIsOpen(true);
    triggerAiDraping(formattedProduct.name);
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    toast('Fitting room cleared. Pick any product to wear!');
  };

  const handleStartOver = () => {
    setSelectedProduct(null);
    setCustomUserPhoto(null);
    setCurrentModel(sampleAvatars[0]);
    toast.success('Fitting room reset to initial state!');
  };

  return (
    <TryOnContext.Provider
      value={{
        isOpen,
        setIsOpen,
        openTryOn: () => setIsOpen(true),
        closeTryOn: () => setIsOpen(false),
        toggleTryOn: () => setIsOpen((prev) => !prev),
        selectedProduct,
        setSelectedProduct,
        tryOnProduct,
        clearSelectedProduct,
        handleStartOver,
        currentModel,
        setCurrentModel,
        customUserPhoto,
        setCustomUserPhoto,
        isProcessing,
        setIsProcessing,
        processingStep,
        setProcessingStep,
        triggerAiDraping,
        getDrapedImage,
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
};

export const useTryOn = () => {
  const context = useContext(TryOnContext);
  if (!context) {
    throw new Error('useTryOn must be used within a TryOnProvider');
  }
  return context;
};

