import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  X,
  Sparkles,
  Truck,
  RotateCcw,
  Shirt,
  Star,
  Minus,
  Plus,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useTryOn } from '../../context/TryOnContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

import { sareeLooks } from '../../data/curatedSarees.js';

const HeroBanner = () => {
  const { store, isBoutiqueStore, isJewelleryStore, isHairStore, isSareeStore } = useStore();
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [quickViewLook, setQuickViewLook] = useState(null);
  const dragDistanceRef = useRef(0);

  const snapTimeoutRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const { addToCart, items = [], updateQuantity, removeFromCart } = useCart();
  const { tryOnProduct } = useTryOn();
  const navigate = useNavigate();
  const [modalQty, setModalQty] = useState(1);
  const [sectionQty, setSectionQty] = useState(1);

  // Lock body scroll and close on Escape when QuickView modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewLook(null);
      }
    };
    if (quickViewLook) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [quickViewLook]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 10 authentic curated royal sarees (strictly fixed, no custom override from anywhere)
  const looks = sareeLooks;

  const count = looks.length;
  // Active look index derived from 3D turntable rotation angle
  const activeLookIndex = ((Math.round(-currentRotation / 36) % count) + count) % count;
  const currentLook = looks[activeLookIndex] || sareeLooks[0];
  const mainSaree = currentLook?.items?.find((it) => it.isMain) || currentLook?.items?.[0] || {};
  const currentSareePrice = mainSaree.price || 19999;
  const currentSareeOrigPrice = mainSaree.originalPrice || 24999;
  const currentDiscountPercent = currentSareeOrigPrice > currentSareePrice
    ? Math.round(((currentSareeOrigPrice - currentSareePrice) / currentSareeOrigPrice) * 100)
    : 0;

  // Slow clockwise 3D rotation (~4.5 deg/sec => 80s for 1 complete revolution)
  useEffect(() => {
    const SPEED_DEG_PER_SEC = 4.5;

    const animate = (time) => {
      if (lastTimeRef.current != null) {
        const deltaSec = (time - lastTimeRef.current) / 1000;
        const safeDelta = Math.min(deltaSec, 0.1);

        if (!isDragging && !isHovered && !isSnapping) {
          // Clockwise rotation: subtract angle so models move clockwise around turntable
          setCurrentRotation((prev) => prev - SPEED_DEG_PER_SEC * safeDelta);
        }
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging, isHovered, isSnapping]);

  // Calculate ensemble total
  const totalBundlePrice = currentLook.items.reduce((acc, it) => acc + it.price, 0);
  const totalOriginalPrice = currentLook.items.reduce(
    (acc, it) => acc + (it.originalPrice || it.price),
    0
  );
  const savings = totalOriginalPrice - totalBundlePrice;

  // Snap to specific angle with smooth easing transition, pausing auto-rotation momentarily
  const triggerSnap = (targetRotation) => {
    setIsSnapping(true);
    setCurrentRotation(targetRotation);
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      setIsSnapping(false);
    }, 1200);
  };

  // 3D Turntable rotation handlers
  const handlePrev = () => {
    triggerSnap(Math.round(currentRotation / 36) * 36 + 36);
  };

  const handleNext = () => {
    triggerSnap(Math.round(currentRotation / 36) * 36 - 36);
  };

  const handleSelectModel = (targetIdx) => {
    // If the user was dragging/swiping the 3D turntable, do not open modal
    if (dragDistanceRef.current > 6) {
      dragDistanceRef.current = 0;
      return;
    }
    let diff = (targetIdx - activeLookIndex) % count;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    triggerSnap(Math.round(currentRotation / 36) * 36 - diff * (360 / count));
    
    // Open Quick View & Instant Order modal for this look
    if (looks[targetIdx]) {
      setQuickViewLook(looks[targetIdx]);
    }
  };

  // Drag / swipe 3D rotation gestures
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsSnapping(false);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    dragDistanceRef.current = 0;
    setDragStartRotation(currentRotation);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX;
    dragDistanceRef.current = Math.abs(deltaX);
    // Rotate in 3D: 1px drag = 0.35 deg rotation
    setCurrentRotation(dragStartRotation + deltaX * 0.35);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap cleanly to nearest look (multiple of 36 deg)
    triggerSnap(Math.round(currentRotation / 36) * 36);
  };

  const getLookCartQuantity = (look) => {
    if (!look) return 0;
    const mainSaree = look.items?.find((it) => it.isMain) || look.items?.[0];
    const prodId = mainSaree?.id || mainSaree?._id || `look-${look.id}`;
    const cartItem = items.find((it) => {
      const itId = it.product?._id || it.product?.id || it.product;
      return itId === prodId || (it.product?.name && it.product.name.includes(look.lookTitle));
    });
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    if (quickViewLook) {
      const inCart = getLookCartQuantity(quickViewLook);
      setModalQty(inCart > 0 ? inCart : 1);
    }
  }, [quickViewLook, items]);

  useEffect(() => {
    if (currentLook) {
      const inCart = getLookCartQuantity(currentLook);
      setSectionQty(inCart > 0 ? inCart : 1);
    }
  }, [currentLook, items]);

  const handleAddFullLook = (lookToUse = currentLook, quantity = 1) => {
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const bundlePrice = lookToUse.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
    const prodId = mainSaree?.id || mainSaree?._id || `look-${lookToUse.id}`;
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (mainSaree) {
      addToCart(
        {
          _id: prodId,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice || mainSaree.price,
          discountPrice: bundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: lookToUse.lookTitle.split(' ')[1] || 'Festive',
        },
        qtyToAdd
      );
    }
  };

  const handleIncrementModalQty = (lookToUse = quickViewLook) => {
    if (!lookToUse) return;
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const prodId = mainSaree?.id || mainSaree?._id || `look-${lookToUse.id}`;
    const inCartQty = getLookCartQuantity(lookToUse);

    if (inCartQty > 0) {
      const nextQty = inCartQty + 1;
      setModalQty(nextQty);
      setSectionQty(nextQty);
      updateQuantity(prodId, nextQty);
      toast.success(`Updated to ${nextQty} in Bag!`, { id: 'modal-cart-qty' });
    } else {
      setModalQty(1);
      setSectionQty(1);
      handleAddFullLook(lookToUse, 1);
    }
  };

  const handleDecrementModalQty = (lookToUse = quickViewLook) => {
    if (!lookToUse) return;
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const prodId = mainSaree?.id || mainSaree?._id || `look-${lookToUse.id}`;
    const inCartQty = getLookCartQuantity(lookToUse);

    if (inCartQty > 1) {
      const nextQty = inCartQty - 1;
      setModalQty(nextQty);
      setSectionQty(nextQty);
      updateQuantity(prodId, nextQty);
      toast.success(`Updated to ${nextQty} in Bag!`, { id: 'modal-cart-qty' });
    } else if (inCartQty === 1) {
      setModalQty(1);
      setSectionQty(1);
      removeFromCart(prodId);
    } else {
      setModalQty((prev) => Math.max(1, prev - 1));
      setSectionQty((prev) => Math.max(1, prev - 1));
    }
  };

  const handleOrderNow = (lookToUse = currentLook, quantity = 1) => {
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const bundlePrice = lookToUse.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
    const prodId = mainSaree?.id || mainSaree?._id || `look-${lookToUse.id}`;
    const qtyToOrder = Math.max(1, parseInt(quantity, 10) || 1);

    if (mainSaree) {
      addToCart(
        {
          _id: prodId,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice || mainSaree.price,
          discountPrice: bundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: lookToUse.lookTitle.split(' ')[1] || 'Festive',
        },
        qtyToOrder
      );
      setQuickViewLook(null);
      navigate('/checkout');
    }
  };

  const handleTryItOn = (lookToUse = currentLook) => {
    if (!lookToUse) return;
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const bundlePrice = lookToUse.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
    
    // Close the Quick View modal if open
    setQuickViewLook(null);

    // Launch the AI Virtual Fitting Room with this exact saree and draped preview
    tryOnProduct({
      _id: mainSaree?.id || `look-${lookToUse.id}`,
      name: mainSaree?.name || lookToUse.lookTitle,
      fabric: lookToUse.tagline?.split('•')[0]?.trim() || 'Pure Handloom Silk',
      price: bundlePrice,
      originalPrice: lookToUse.items?.reduce((acc, it) => acc + (it.originalPrice || it.price), 0) || 24999,
      image: mainSaree?.image || lookToUse.modelImage,
      drapedPreview: lookToUse.modelImage,
      slug: lookToUse.sareeSlug || '',
    });
  };

  const handleTryItem = (item, lookToUse = currentLook) => {
    if (!item) return;
    setQuickViewLook(null);
    tryOnProduct({
      _id: item.id || `item-${item.name}`,
      name: item.name,
      fabric: item.detail || 'Pure Silk Handloom',
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      image: item.image,
      drapedPreview: lookToUse?.modelImage || item.image,
      slug: lookToUse?.sareeSlug || '',
    });
  };

  // Responsive turntable dimensions & 3D focal parameters
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isLaptop = windowWidth >= 1024 && windowWidth < 1280;

  // Horizontal Radius (Rx): Full screen width runway
  const Rx = isMobile
    ? Math.max(210, Math.min(250, (windowWidth - 20) * 0.60))
    : isTablet
    ? Math.min(320, windowWidth * 0.38)
    : isLaptop
    ? 400
    : 470;

  const maxFloorDepth = isMobile ? 26 : isTablet ? 48 : 68;

  // Turntable dimensions on the floor (strictly matching the 3D orbit perimeter)
  const turntableWidth = isMobile
    ? Math.round(Rx * 2.05)
    : isTablet
    ? 620
    : isLaptop
    ? 800
    : 940;

  const turntableScaleY = isMobile ? 0.22 : isTablet ? 0.22 : 0.20;
  const turntableHeight = Math.round(turntableWidth * turntableScaleY);
  const turntableBottomOffset = isMobile ? 85 : isTablet ? 155 : 185;
  const modelBottomOffset = isMobile ? 80 : isTablet ? 150 : 180;

  // 3D Circular Orbit calculations: all 10 models rotate in a real 3D circle
  const getModelStyle = (idx) => {
    const baseAngle = idx * (360 / count);
    
    // Effective angle relative to front camera (0 deg is front center)
    let effAngle = (baseAngle + currentRotation) % 360;
    if (effAngle < 0) effAngle += 360;
    if (effAngle > 180) effAngle -= 360; // range [-180, 180]

    const rad = (effAngle * Math.PI) / 180;
    const z = Math.cos(rad); // +1 at front, -1 at back

    // Smooth horizontal position with continuous outward separation on mobile to prevent models from sticking to center
    const sinVal = Math.sin(rad);
    const lateralClearance = isMobile
      ? Math.sign(sinVal) * Math.pow(Math.abs(sinVal), 0.65) * 75
      : 0;
    const x = sinVal * Rx + lateralClearance;
    const y = ((1 - z) / 2) * maxFloorDepth;

    // 3D perspective scale:
    // On mobile: Dramatic Center Spotlight Zoom (~1.88 at center front for large height & width, ~1.12 flanking)
    // On desktop: Center is 1.40, flanking 1.10
    const depthRatio = (z + 1) / 2;
    const focalBoost = isMobile
      ? Math.pow(Math.max(0, z), 5.0) * 1.05
      : Math.pow(Math.max(0, z), 3.5) * 0.36;

    const baseMin = isMobile ? 0.38 : 0.52;
    const depthMul = isMobile ? 0.44 : 0.48;
    const scale = (baseMin + depthRatio * depthMul + focalBoost).toFixed(3);

    const isCenter = Math.abs(effAngle) < 18;
    // On mobile, gently reduce opacity of back background models to avoid visual clutter
    const opacity = isCenter
      ? 1
      : isMobile
      ? Math.max(0.18, +(0.15 + Math.pow(depthRatio, 2.0) * 0.75).toFixed(2))
      : Math.max(0.40, +(0.38 + depthRatio * 0.62).toFixed(2));

    const zIndex = isCenter ? 70 : Math.round(depthRatio * 50) + 5;
    const rotateY = (-effAngle * 0.28).toFixed(1);

    return {
      transform: `translate(${x.toFixed(2)}px, -${y.toFixed(2)}px) scale(${scale}) rotateY(${rotateY}deg)`,
      transformOrigin: 'bottom center',
      zIndex,
      opacity,
      transition: isDragging || !isSnapping
        ? 'opacity 0.4s ease-out'
        : 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease-out',
    };
  };

  // If store is non-saree (jewellery, hair, general) or has a custom uploaded hero banner, render adapted hero
  if (store?.heroBannerUrl || !isSareeStore) {
    const bgImage =
      store?.heroBannerUrl ||
      (isJewelleryStore
        ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=85'
        : isHairStore
        ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=85'
        : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85');

    const heading =
      store?.heroHeading ||
      (isJewelleryStore
        ? 'Sacred 22K Gold & Polki Jewellery'
        : isHairStore
        ? 'Flawless Virgin Hair Extensions & Studio Care'
        : store?.name || 'Exclusive Luxury Collection');

    const subheading =
      store?.heroSubheading ||
      store?.tagline ||
      (isJewelleryStore
        ? 'Authentic 22K hallmarked bridal chokers, bangles & diamond solitaires.'
        : isHairStore
        ? 'Seamless clip-ins, lace front wigs & organic hair repair serums.'
        : 'Curated premium quality direct to your doorstep.');

    const shopUrl = isBoutiqueStore ? `/store/${store.slug}/shop` : '/shop';
    const cleanWhatsapp = (store?.whatsapp || '+918147540362').replace(/[^0-9]/g, '');

    return (
      <div className="relative isolate overflow-hidden bg-stone-950 text-white select-none border-b border-gold/30">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt={heading}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/60"></div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl space-y-6">
            {/* Trust Pill / Promo Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/50 shadow-lg">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-amber-200 tracking-wider uppercase font-sans">
                {store?.trustBadge ||
                  (isJewelleryStore
                    ? '100% BIS Hallmarked • Certified Gold & Diamonds'
                    : isHairStore
                    ? '100% Virgin Remy Hair • Salon Grade Quality'
                    : 'Premium Curated Quality')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
              {heading}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-300 font-medium leading-relaxed max-w-xl">
              {subheading}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to={shopUrl}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hello%20${encodeURIComponent(store?.name || 'Store')},%20I%20am%20interested%20in%20your%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>WhatsApp Order</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div className="space-y-0.5">
                <p className="text-gold font-bold text-xs sm:text-sm">Express Shipping</p>
                <p className="text-[10px] sm:text-[11px] text-stone-400">Insured Delivery</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gold font-bold text-xs sm:text-sm">COD Available</p>
                <p className="text-[10px] sm:text-[11px] text-stone-400">Pay on Delivery</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gold font-bold text-xs sm:text-sm">100% Certified</p>
                <p className="text-[10px] sm:text-[11px] text-stone-400">Authentic Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate bg-[#FAF7F2] border-b border-stone-200 overflow-hidden select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-6 lg:pb-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: FULL-WIDTH 3D VIRTUAL SAREE RUNWAY            */}
        {/* ========================================================= */}
        <div className="w-full flex flex-col justify-between">
          {/* Header Row: Left-Aligned Title (Refined Compact Typography) */}
          <div className="space-y-0 relative z-10 text-left -mt-0.5 sm:-mt-1">
            <h1 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-stone-900 tracking-tight leading-tight">
              Try the Look.
            </h1>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide">
              Powered by TryoAI
            </p>
          </div>

          {/* Runway Stage with Floor Ambient Shadow and Circular Turntable */}
          <div
            className="relative -mt-1 sm:-mt-3 mb-16 xs:mb-20 sm:mb-4 flex items-center justify-center min-h-[460px] xs:min-h-[480px] sm:min-h-[540px] lg:min-h-[620px] cursor-grab active:cursor-grabbing select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragging) setIsDragging(false);
            }}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
          >
            {/* Studio Floor Soft Contact Shadows */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-4/5 h-12 bg-stone-300/40 rounded-full blur-2xl pointer-events-none"
              style={{ bottom: `${turntableBottomOffset}px` }}
            ></div>

            {/* 3D Circular Turntable Floor Platform (encapsulates all models inside the circle) */}
            <div
              className="absolute pointer-events-none flex items-center justify-center -translate-x-1/2"
              style={{
                bottom: `${turntableBottomOffset}px`,
                left: '50%',
                width: `${turntableWidth}px`,
                height: `${turntableHeight}px`,
              }}
            >
              {/* 3D Perspective Flattened Local Circle Container */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: `${turntableWidth}px`,
                  height: `${turntableWidth}px`,
                  transform: `scaleY(${turntableScaleY})`,
                }}
              >
                {/* Rotating golden dashed orbit ring synced to models */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-gold/70 shadow-[0_0_35px_rgba(198,161,91,0.25)]"
                  style={{
                    transform: `rotate(${-currentRotation}deg)`,
                    transition: isSnapping ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                  }}
                ></div>
                {/* Inner golden concentric rim */}
                <div className="absolute inset-8 sm:inset-12 rounded-full border border-gold/45"></div>
                {/* Radial spotlight floor glow */}
                <div className="w-4/5 h-4/5 rounded-full bg-radial from-gold/30 via-gold/10 to-transparent blur-md"></div>
              </div>
              {/* Soft ambient ground contact shadow */}
              <div
                className="absolute bg-stone-900/25 rounded-full blur-xl"
                style={{
                  width: `${turntableWidth * 0.85}px`,
                  height: `${turntableHeight * 0.65}px`,
                  bottom: '4px',
                }}
              ></div>
            </div>

            {/* Models Lineup (All 10 Saree Models in 3D Full-Width Orbiting Circle) */}
            <div className="relative flex items-end justify-center w-full max-w-7xl h-[440px] xs:h-[460px] sm:h-[510px] lg:h-[600px]">
              {looks.map((look, idx) => {
                const isActive = idx === activeLookIndex;
                const style = getModelStyle(idx);

                return (
                  <div
                    key={look.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectModel(idx);
                    }}
                    style={{
                      ...style,
                      bottom: `${modelBottomOffset}px`,
                    }}
                    className="absolute cursor-pointer flex flex-col items-center group"
                  >
                    {/* Transparent Standing Model */}
                    <div className="relative w-40 xs:w-44 sm:w-56 lg:w-64 h-[380px] xs:h-[410px] sm:h-[470px] lg:h-[540px] flex items-end justify-center">
                      {/* Soft Backdrop Spotlight Halo behind active model */}
                      {isActive && (
                        <div className="absolute inset-0 -top-6 bg-radial from-gold/20 via-gold/5 to-transparent rounded-full filter blur-xl pointer-events-none -z-10"></div>
                      )}

                      <img
                        src={look.modelImage}
                        alt={look.lookTitle}
                        draggable={false}
                        className={`w-full h-full object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] transition-all duration-500 ${
                          isActive
                            ? 'filter drop-shadow-[0_20px_35px_rgba(104,27,44,0.22)]'
                            : 'grayscale-[10%] hover:grayscale-0'
                        }`}
                      />
                    </div>

                    {/* Floor Contact Shadow */}
                    <div
                      className={`w-32 sm:w-36 h-4 bg-stone-900/25 rounded-full blur-md -mt-2 transition-all ${
                        isActive ? 'scale-110 opacity-70' : 'opacity-40'
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* FLOATING RUNWAY SAREE CARD (Shifted Down & Left-Docked on Mobile) */}
            {/* ========================================================= */}
            <div
              className="absolute -bottom-12 xs:-bottom-14 sm:bottom-4 left-2 xs:left-3 sm:left-1/2 translate-x-0 sm:-translate-x-1/2 z-20 bg-white/95 backdrop-blur-md border border-gold/50 rounded-2xl sm:rounded-3xl p-2 xs:p-2.5 sm:p-3 shadow-luxury flex items-stretch gap-2 xs:gap-2.5 sm:gap-3.5 w-[calc(100%-72px)] xs:w-[calc(100%-80px)] sm:w-auto max-w-[285px] xs:max-w-[315px] sm:max-w-[405px] h-[126px] xs:h-[135px] sm:h-[150px] transition-all duration-300 cursor-default select-none"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Saree Thumbnail */}
              <Link
                to={currentLook.sareeSlug ? `/product/${currentLook.sareeSlug}` : '#'}
                className="w-20 xs:w-24 sm:w-28 h-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-gold/35 shadow-xs block group/thumb relative"
                title={mainSaree.name || currentLook.lookTitle}
              >
                <img
                  src={currentLook.cropImage || `/models/model-${currentLook.id}-crop.png`}
                  alt={mainSaree.name || currentLook.lookTitle}
                  className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 left-1 bg-stone-900/75 backdrop-blur-xs text-white text-[8px] xs:text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  {currentLook.lookNumber}
                </span>
              </Link>

              {/* Saree Details & Controls (Right Column, vertically spaced) */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                {/* Title & Tagline */}
                <div>
                  <Link
                    to={currentLook.sareeSlug ? `/product/${currentLook.sareeSlug}` : '#'}
                    className="block font-serif text-[11px] xs:text-xs sm:text-sm font-bold text-stone-900 hover:text-primary transition-colors line-clamp-1 xs:line-clamp-2 leading-tight"
                    title={mainSaree.name || currentLook.lookTitle}
                  >
                    {mainSaree.name || currentLook.lookTitle}
                  </Link>

                  <p className="text-[9px] xs:text-[10px] text-stone-500 font-medium truncate mt-0.5">
                    {mainSaree.detail || currentLook.tagline}
                  </p>
                </div>

                {/* Price & Offer Badge */}
                <div className="flex items-center gap-1 xs:gap-1.5 flex-wrap">
                  <span className="font-sans font-black text-xs xs:text-sm sm:text-base text-primary">
                    {formatPrice(currentSareePrice)}
                  </span>
                  {currentSareeOrigPrice > currentSareePrice && (
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] text-stone-400 font-bold line-through">
                      {formatPrice(currentSareeOrigPrice)}
                    </span>
                  )}
                  {currentDiscountPercent > 0 && (
                    <span className="text-[8px] xs:text-[9px] font-black text-emerald-700 bg-emerald-50 px-1 xs:px-1.5 py-0.5 rounded border border-emerald-200">
                      {currentDiscountPercent}% Off
                    </span>
                  )}
                </div>

                {/* Interactive Controller Row (- Qty + and Add to Cart Button) */}
                <div className="flex items-center gap-1 xs:gap-1.5 pt-0.5 xs:pt-1 border-t border-stone-100">
                  <div className="flex items-center bg-stone-100 border border-stone-200/80 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrementModalQty(currentLook);
                      }}
                      className="w-5 h-5 xs:w-6 xs:h-6 rounded flex items-center justify-center hover:bg-stone-200 text-stone-700 transition active:scale-90 cursor-pointer"
                      aria-label="Decrease"
                      title="Decrease quantity"
                    >
                      <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>

                    <span className="font-sans font-bold text-[11px] xs:text-xs px-1 min-w-[14px] text-center select-none text-stone-900">
                      {getLookCartQuantity(currentLook) > 0 ? getLookCartQuantity(currentLook) : 1}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrementModalQty(currentLook);
                      }}
                      className="w-5 h-5 xs:w-6 xs:h-6 rounded flex items-center justify-center hover:bg-stone-200 text-stone-700 transition active:scale-90 cursor-pointer"
                      aria-label="Increase"
                      title="Increase quantity"
                    >
                      <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const inCart = getLookCartQuantity(currentLook);
                      if (inCart > 0) {
                        toast.success(`Already in Bag (${inCart})!`, { id: 'runway-bag' });
                      } else {
                        handleAddFullLook(currentLook, 1);
                        toast.success(`${mainSaree.name || currentLook.lookTitle} added to Bag!`, { id: 'runway-bag' });
                      }
                    }}
                    className={`flex-1 py-1 xs:py-1.5 px-2 rounded-lg text-[10px] xs:text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer truncate ${
                      getLookCartQuantity(currentLook) > 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary hover:bg-primary-light text-white'
                    }`}
                    title={getLookCartQuantity(currentLook) > 0 ? 'Item In Bag' : 'Add to Bag'}
                  >
                    <ShoppingBag className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0" />
                    <span>{getLookCartQuantity(currentLook) > 0 ? 'Added' : 'Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* QUICK VIEW & DIRECT ORDER MODAL ON MODEL CLICK (PORTALED) */}
      {/* ========================================================= */}
      {quickViewLook &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn select-none"
            onClick={() => setQuickViewLook(null)}
          >
            <div
              className="relative w-full max-w-lg sm:max-w-2xl bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-gold/40 max-h-[94vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setQuickViewLook(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition flex items-center justify-center cursor-pointer z-20 shadow-xs active:scale-95"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-7 items-center">
                {/* Left Column: Model Cutout Image */}
                <div className="sm:col-span-6 h-[340px] xs:h-[380px] sm:h-[490px] rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#EFEAE2] border border-stone-200/80 overflow-hidden relative flex items-center justify-center pt-2 px-1 pb-0 shadow-inner group/img">
                  <img
                    src={quickViewLook.modelImage.replace('.png', '-crop.png')}
                    alt={quickViewLook.lookTitle}
                    onError={(e) => {
                      if (e.currentTarget.src.includes('-crop.png')) {
                        e.currentTarget.src = quickViewLook.modelImage;
                      }
                    }}
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)] sm:drop-shadow-[0_16px_30px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover/img:scale-105"
                  />
                </div>

                {/* Right Column: Clean Details */}
                <div className="sm:col-span-6 space-y-3 sm:space-y-4">
                  {/* Title Row with Quantity Selector (- & +) where user highlighted */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg sm:text-2xl font-black text-stone-950 leading-tight sm:leading-snug tracking-tight">
                        {quickViewLook.lookTitle}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 line-clamp-1">
                        {quickViewLook.items?.[0]?.detail || quickViewLook.tagline || 'Pure Silk Saree • Handwoven Zari'}
                      </p>
                    </div>

                    {/* Quantity Controller (- & +) */}
                    <div className="shrink-0 flex items-center bg-primary text-white rounded-xl p-1 shadow-xs border border-primary/20">
                      <button
                        type="button"
                        onClick={() => handleDecrementModalQty(quickViewLook)}
                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                        aria-label="Decrease quantity"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <span className="font-sans font-black text-xs sm:text-sm text-white select-none px-2 min-w-[22px] text-center">
                        {getLookCartQuantity(quickViewLook) > 0
                          ? getLookCartQuantity(quickViewLook)
                          : modalQty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncrementModalQty(quickViewLook)}
                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                        aria-label="Increase quantity"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Price Card with Savings */}
                  {(() => {
                    const price = quickViewLook.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
                    const origPrice = quickViewLook.items?.reduce((acc, it) => acc + (it.originalPrice || it.price), 0) || 24999;
                    const savings = Math.max(0, origPrice - price);
                    return (
                      <div className="p-2.5 sm:p-3.5 bg-gradient-to-r from-cream/90 via-cream/60 to-cream/40 rounded-xl sm:rounded-2xl border border-gold/40">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xl sm:text-3xl font-black text-primary font-sans">
                              {formatPrice(price)}
                            </span>
                            {origPrice > price && (
                              <span className="text-xs text-stone-400 line-through font-bold">
                                {formatPrice(origPrice)}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-300">
                              Save {formatPrice(savings)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons: Virtual Trial & Order Now */}
                  <div className="pt-1 sm:pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Virtual Trial Button (Replaced bottom - + button) */}
                      <button
                        type="button"
                        onClick={() => handleTryItOn(quickViewLook)}
                        className="w-full py-2.5 sm:py-3 px-2 bg-stone-900 hover:bg-black text-white border border-amber-500/50 hover:border-amber-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 stroke-[2.2]" />
                        <span>Virtual Trial</span>
                      </button>

                      {/* Order Now Button */}
                      <button
                        type="button"
                        onClick={() => handleOrderNow(quickViewLook, modalQty)}
                        className="w-full py-2.5 sm:py-3 px-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Order Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HeroBanner;
