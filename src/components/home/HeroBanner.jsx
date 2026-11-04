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
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useTryOn } from '../../context/TryOnContext.jsx';
import { productApi } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

// 10 Curated Royal Indian Saree Looks with Transparent Cutout Full-Length Models
const sareeLooks = [
  {
    id: 1,
    lookNumber: '01',
    lookTitle: 'Royal Crimson Banarasi',
    tagline: 'Bridal Heritage • Handwoven Katan Silk',
    modelImage: '/models/model-1.png',
    sareeSlug: 'royal-crimson-banarasi-katan-silk-saree',
    items: [
      {
        id: 'saree-1',
        type: 'Saree',
        name: 'Royal Crimson Banarasi Katan Silk Saree',
        detail: 'Pure Katan Silk • Gold Zari Kadhwa Weave',
        price: 19999,
        originalPrice: 24999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-1',
        type: 'Blouse Piece',
        name: 'Heavy Zari Brocade Blouse Piece',
        detail: '0.8M Unstitched Pure Brocade Included',
        price: 0,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-1',
        type: 'Accessory',
        name: 'Handcrafted Zari Bridal Potli',
        detail: 'Antique Gold Zardosi Embroidery',
        price: 1499,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 2,
    lookNumber: '02',
    lookTitle: 'Maharani Emerald Temple',
    tagline: 'Temple Korvai • Pure Kanchipuram Weave',
    modelImage: '/models/model-2.png',
    sareeSlug: 'maharani-emerald-gold-kanjivaram-silk-saree',
    items: [
      {
        id: 'saree-2',
        type: 'Saree',
        name: 'Maharani Emerald Gold Kanjivaram Saree',
        detail: 'Pure Mulberry Silk • 2-Ply Golden Zari',
        price: 27499,
        originalPrice: 32999,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-2',
        type: 'Blouse Piece',
        name: 'Contrast Maroon Silk Blouse Piece',
        detail: '0.8M Unstitched with Zari Sleeves',
        price: 0,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-2',
        type: 'Accessory',
        name: 'Temple Zari Woven Kamarbandh Belt',
        detail: 'Traditional Peacock Gold Motif',
        price: 1999,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 3,
    lookNumber: '03',
    lookTitle: 'Heirloom Red Zardozi Bridal',
    tagline: 'Couture Bridal • Velvet & Zardozi Handwork',
    modelImage: '/models/model-3.png',
    sareeSlug: 'heirloom-red-zardozi-bridal-saree',
    items: [
      {
        id: 'saree-3',
        type: 'Saree',
        name: 'Heirloom Red Zardozi Bridal Saree',
        detail: 'Raw Silk & Velvet Border • Dabka Handwork',
        price: 38999,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-3',
        type: 'Blouse Piece',
        name: 'Heavy Zardozi Embroidered Blouse',
        detail: '1.0M Pure Raw Silk Fabric Included',
        price: 0,
        originalPrice: 4999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-3',
        type: 'Accessory',
        name: 'Heirloom Zari Sheer Veil Dupatta',
        detail: 'Bridal Organza with Scallop Border',
        price: 3499,
        originalPrice: 4499,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 4,
    lookNumber: '04',
    lookTitle: 'Gulabi Rani Paithani',
    tagline: 'Maharashtrian Heritage • Peacock Pallu',
    modelImage: '/models/model-4.png',
    sareeSlug: 'gulabi-rani-pure-paithani-silk-saree',
    items: [
      {
        id: 'saree-4',
        type: 'Saree',
        name: 'Gulabi Rani Pure Paithani Silk Saree',
        detail: 'Mulberry Silk • Obverse-Reverse Zari Pallu',
        price: 14999,
        originalPrice: 18499,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-4',
        type: 'Blouse Piece',
        name: 'Running Paithani Silk Blouse Piece',
        detail: '0.8M Unstitched Matching Included',
        price: 0,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-4',
        type: 'Accessory',
        name: 'Handcrafted Peacock Latkan Set',
        detail: 'Pearl & Golden Thread Beads',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 5,
    lookNumber: '05',
    lookTitle: 'Royal Sapphire Brocade',
    tagline: 'Varanasi Zari Heritage • Pure Silk Brocade',
    modelImage: '/models/model-5.png',
    sareeSlug: 'royal-crimson-banarasi-katan-silk-saree',
    items: [
      {
        id: 'saree-5',
        type: 'Saree',
        name: 'Royal Sapphire Blue Brocade Silk Saree',
        detail: 'Pure Mulberry Silk • Antique Gold Zari Brocade',
        price: 21999,
        originalPrice: 26999,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-5',
        type: 'Blouse Piece',
        name: 'Contrast Gold Brocade Blouse Piece',
        detail: '0.8M Unstitched Pure Brocade Included',
        price: 0,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-5',
        type: 'Accessory',
        name: 'Handcrafted Zari Latkan Tassels',
        detail: 'Antique Gold Beaded Accents',
        price: 899,
        originalPrice: 1299,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 6,
    lookNumber: '06',
    lookTitle: 'Sunshine Yellow Haldi Silk',
    tagline: 'Festive Haldi • Pure Chanderi Silk Zari',
    modelImage: '/models/model-6.png',
    sareeSlug: 'mustard-gold-handloom-chanderi-saree',
    items: [
      {
        id: 'saree-6',
        type: 'Saree',
        name: 'Sunshine Yellow Chanderi Silk Saree',
        detail: 'Lightweight Chanderi Silk • Antique Zari Border',
        price: 12499,
        originalPrice: 15999,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-6',
        type: 'Blouse Piece',
        name: 'Matching Chanderi Silk Blouse Piece',
        detail: '0.8M Matching Handloom Fabric Included',
        price: 0,
        originalPrice: 1899,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-6',
        type: 'Accessory',
        name: 'Floral Gota Patti Kamarbandh',
        detail: 'Handcrafted Haldi Festive Accent Belt',
        price: 1199,
        originalPrice: 1699,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 7,
    lookNumber: '07',
    lookTitle: 'Royal Plum Purple Kanjivaram',
    tagline: 'South Indian Royalty • Pure Korvai Silk',
    modelImage: '/models/model-7.png',
    sareeSlug: 'maharani-emerald-gold-kanjivaram-silk-saree',
    items: [
      {
        id: 'saree-7',
        type: 'Saree',
        name: 'Royal Plum Purple Kanjivaram Silk Saree',
        detail: 'Pure Mulberry Silk • Magenta & Gold Heavy Pallu',
        price: 24999,
        originalPrice: 29999,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-7',
        type: 'Blouse Piece',
        name: 'Heavy Contrast Magenta Zari Blouse',
        detail: '0.8M Pure Silk with Broad Zari Border',
        price: 0,
        originalPrice: 2799,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-7',
        type: 'Accessory',
        name: 'Temple Antique Gold Bangle Pair',
        detail: 'South Indian Handcrafted Filigree Work',
        price: 2199,
        originalPrice: 2899,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 8,
    lookNumber: '08',
    lookTitle: 'Pastel Peach Floral Organza',
    tagline: 'Contemporary Soiree • Scallop Resham Weave',
    modelImage: '/models/model-8.png',
    sareeSlug: 'blush-rose-french-organza-saree',
    items: [
      {
        id: 'saree-8',
        type: 'Saree',
        name: 'Pastel Peach Floral Organza Silk Saree',
        detail: 'Sheer Silk Organza • Hand Embroidered Scallop Border',
        price: 16999,
        originalPrice: 21000,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-8',
        type: 'Blouse Piece',
        name: 'Raw Silk Embroidered Blouse Piece',
        detail: '0.8M Pastel Raw Silk with Pearl Work',
        price: 0,
        originalPrice: 2299,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-8',
        type: 'Accessory',
        name: 'Handcrafted Pearl & Zari Clutch',
        detail: 'Ivory Raw Silk with Hand-Sewn Pearls',
        price: 1599,
        originalPrice: 2199,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 9,
    lookNumber: '09',
    lookTitle: 'Midnight Black Banarasi Silk',
    tagline: 'Cocktail Royale • Antique Shikargah Zari',
    modelImage: '/models/model-9.png',
    sareeSlug: 'midnight-navy-sequin-georgette-saree',
    items: [
      {
        id: 'saree-9',
        type: 'Saree',
        name: 'Midnight Black Banarasi Brocade Silk Saree',
        detail: 'Pure Katan Silk • Antique Gold Floral Boota Weave',
        price: 22499,
        originalPrice: 27500,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-9',
        type: 'Blouse Piece',
        name: 'Antique Gold Tissue Silk Blouse',
        detail: '0.8M Heavy Metallic Tissue Included',
        price: 0,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-9',
        type: 'Accessory',
        name: 'Velvet Antique Gold Embroidered Potli',
        detail: 'Black Velvet with Zardozi Embroidery',
        price: 1799,
        originalPrice: 2399,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 10,
    lookNumber: '10',
    lookTitle: 'Peacock Teal Heritage Silk',
    tagline: 'Auspicious Muhurtham • Pure Mulberry Zari',
    modelImage: '/models/model-10.png',
    sareeSlug: 'royal-crimson-banarasi-katan-silk-saree',
    items: [
      {
        id: 'saree-10',
        type: 'Saree',
        name: 'Peacock Teal Heritage Mulberry Silk Saree',
        detail: 'Pure Silk • Intricate Woven Peacock Pallu & Border',
        price: 23999,
        originalPrice: 28999,
        image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=300&q=80',
        isMain: true,
      },
      {
        id: 'blouse-10',
        type: 'Blouse Piece',
        name: 'Contrast Brocade Silk Blouse Piece',
        detail: '0.8M Unstitched Handloom Silk Included',
        price: 0,
        originalPrice: 2599,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        isIncluded: true,
      },
      {
        id: 'acc-10',
        type: 'Accessory',
        name: 'Peacock Motif Handcrafted Zari Latkan',
        detail: 'Antique Gold Thread & Beaded Accents',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

const HeroBanner = () => {
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

  const { addToCart } = useCart();
  const { tryOnProduct } = useTryOn();
  const navigate = useNavigate();

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

  const [looks, setLooks] = useState(sareeLooks);

  // Match curated looks with live DB products by slug if available
  useEffect(() => {
    productApi.getProducts({ limit: 50 }).then((res) => {
      if (res.success && Array.isArray(res.products)) {
        const syncedLooks = sareeLooks.map((curatedLook) => {
          const match = res.products.find((p) => p.slug === curatedLook.sareeSlug);
          if (!match) return curatedLook;
          return {
            ...curatedLook,
            id: match._id,
            items: [
              {
                ...curatedLook.items[0],
                id: match._id,
                price: match.discountPrice || match.price,
                originalPrice: match.price,
              },
              curatedLook.items[1],
              curatedLook.items[2],
            ],
          };
        });
        setLooks(syncedLooks);
      }
    }).catch(() => {});
  }, []);

  const count = looks.length;
  // Active look index derived from 3D turntable rotation angle
  const activeLookIndex = ((Math.round(-currentRotation / 36) % count) + count) % count;
  const currentLook = looks[activeLookIndex] || sareeLooks[0];

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

  const handleAddFullLook = (lookToUse = currentLook) => {
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const bundlePrice = lookToUse.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
    if (mainSaree) {
      addToCart(
        {
          _id: mainSaree.id,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice || mainSaree.price,
          discountPrice: bundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: lookToUse.lookTitle.split(' ')[1] || 'Festive',
        },
        1
      );
      toast.success(`Complete Look "${lookToUse.lookTitle}" added to Bag!`);
    }
  };

  const handleOrderNow = (lookToUse = currentLook) => {
    const mainSaree = lookToUse.items?.find((it) => it.isMain) || lookToUse.items?.[0];
    const bundlePrice = lookToUse.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
    if (mainSaree) {
      addToCart(
        {
          _id: mainSaree.id,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice || mainSaree.price,
          discountPrice: bundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: lookToUse.lookTitle.split(' ')[1] || 'Festive',
        },
        1
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
  const turntableBottomOffset = isMobile ? 65 : isTablet ? 155 : 185;
  const modelBottomOffset = isMobile ? 60 : isTablet ? 150 : 180;

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

  return (
    <div className="relative isolate bg-[#F8F7F4] border-b border-stone-200 overflow-hidden select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: FULL-WIDTH 3D VIRTUAL SAREE RUNWAY            */}
        {/* ========================================================= */}
        <div className="w-full flex flex-col justify-between">
          {/* Header Row: Centered Title */}
          <div className="space-y-1 relative z-10 text-center mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
              Try the Look.
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 font-bold max-w-md mx-auto">
              Drag or tap to spin the 3D runway.
            </p>
          </div>

          {/* Runway Stage with Floor Ambient Shadow and Circular Turntable */}
          <div
            className="relative -mt-1 mb-2 sm:mt-0 sm:mb-4 flex items-center justify-center min-h-[500px] sm:min-h-[540px] lg:min-h-[620px] cursor-grab active:cursor-grabbing select-none"
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
            <div className="relative flex items-end justify-center w-full max-w-7xl h-[470px] sm:h-[510px] lg:h-[600px]">
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
                    <div className="relative w-44 sm:w-56 lg:w-64 h-[410px] sm:h-[470px] lg:h-[540px] flex items-end justify-center">
                      {/* Floating 'Try It On' action badge on model */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTryItOn(look);
                        }}
                        className="absolute top-2 px-3.5 py-1.5 bg-[#18181b]/95 hover:bg-black backdrop-blur-md border border-[#D97706] hover:border-amber-400 rounded-full shadow-xl text-[11px] font-black text-white tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center space-x-1.5 z-30 active:scale-95 hover:scale-105"
                        title="Try It On in AI Fitting Room"
                      >
                        <Shirt className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Try It On</span>
                      </button>

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
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: "IN THIS LOOK" (ENSEMBLE BREAKDOWN BELOW)      */}
        {/* ========================================================= */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-6 lg:mt-8 bg-white rounded-3xl p-5 sm:p-7 lg:p-8 border border-gold/40 shadow-xl transition-all"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-stone-950">
                  In this look
                </h3>
                <span className="px-3 py-1 bg-gold/25 text-gold-dark text-xs font-black uppercase tracking-wider rounded border border-gold/40">
                  Look {currentLook.lookNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
                {currentLook.tagline}
              </p>
            </div>

            <div className="text-xs text-stone-500 font-medium hidden sm:block">
              Full 3-Piece Heritage Bridal & Festive Ensemble
            </div>
          </div>

          {/* Grid Layout: 3 Ensemble Items on Left (8 cols) + Total & CTA Box on Right (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-5">
            {/* The 3 Ensemble Items */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {currentLook.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-3.5 rounded-2xl border border-stone-200 hover:border-gold hover:bg-cream/40 transition group bg-stone-50/50"
                >
                  <div>
                    {/* Item Thumbnail */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-gold-dark">
                        {item.type}
                      </span>
                      {item.isIncluded && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          FREE
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-bold text-stone-950 line-clamp-1" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-600 font-medium line-clamp-1 mt-0.5">
                      {item.detail}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 pt-3 mt-2 border-t border-stone-200/60">
                    <span className="text-sm font-extrabold text-primary font-sans">
                      {item.price === 0 ? 'Complimentary' : formatPrice(item.price)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-stone-400 font-bold line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Ensemble & Checkout Card */}
            <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-cream/60 border border-gold/40 shadow-sm">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark block">
                  Complete Look Ensemble
                </span>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-600 font-semibold">Total Value:</span>
                    <span className="text-xs text-stone-400 font-bold line-through font-sans">
                      {formatPrice(totalOriginalPrice)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-stone-900">Ensemble Price:</span>
                    <span className="font-serif text-2xl font-extrabold text-primary font-sans">
                      {formatPrice(totalBundlePrice)}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-xs font-black text-emerald-800">
                    🎉 You Save {formatPrice(savings)} on this Look!
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => handleTryItOn(currentLook)}
                  className="w-full py-3 px-3 bg-[#18181b] hover:bg-black text-[#F59E0B] hover:text-white border border-[#D97706]/70 hover:border-[#D97706] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                >
                  <Shirt className="w-4 h-4 text-[#D97706]" />
                  <span>Try It On</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddFullLook(currentLook)}
                    className="w-full py-3.5 px-3 bg-primary hover:bg-secondary text-cream rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-gold" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => handleOrderNow(currentLook)}
                    className="w-full py-3.5 px-3 bg-gold hover:bg-gold-light text-stone-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Order Now (COD)</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] px-1 text-stone-600">
                  <Link
                    to={`/product/${currentLook.sareeSlug}`}
                    className="hover:text-primary transition underline font-semibold"
                  >
                    View Saree Details
                  </Link>
                  <span className="flex items-center space-x-1 font-semibold text-stone-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                    <span>Cash on Delivery (COD)</span>
                  </span>
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn select-none"
            onClick={() => setQuickViewLook(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-gold/40 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setQuickViewLook(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition flex items-center justify-center cursor-pointer z-10 shadow-xs active:scale-95"
                aria-label="Close"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-7 items-center">
                {/* Left Column: Model Cutout Image */}
                <div className="sm:col-span-6 h-[380px] sm:h-[470px] rounded-2xl bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#EFEAE2] border border-stone-200/80 overflow-hidden relative flex items-center justify-center p-2 shadow-inner group/img">
                  {/* Luxury Look Badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black text-primary tracking-widest uppercase border border-gold/40 shadow-xs">
                    Look {quickViewLook.lookNumber || '01'}
                  </div>

                  <img
                    src={quickViewLook.modelImage.replace('.png', '-crop.png')}
                    alt={quickViewLook.lookTitle}
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_16px_30px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover/img:scale-105"
                  />
                </div>

                {/* Right Column: Clean & Luxurious Details */}
                <div className="sm:col-span-6 space-y-4">
                  <div>
                    {/* Handloom & Quality Eyebrow */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-black tracking-widest text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                        Pure Handloom
                      </span>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[11px] font-bold text-stone-700">4.9 • Boutique Exclusive</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-950 leading-snug tracking-tight">
                      {quickViewLook.lookTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      {quickViewLook.items?.[0]?.detail || quickViewLook.tagline || 'Pure Silk Saree • Handwoven Zari'}
                    </p>
                  </div>

                  {/* Clean Price Card with Savings */}
                  {(() => {
                    const price = quickViewLook.items?.reduce((acc, it) => acc + it.price, 0) || 19999;
                    const origPrice = quickViewLook.items?.reduce((acc, it) => acc + (it.originalPrice || it.price), 0) || 24999;
                    const savings = Math.max(0, origPrice - price);
                    return (
                      <div className="p-3.5 bg-gradient-to-r from-cream/90 via-cream/60 to-cream/40 rounded-2xl border border-gold/40 space-y-1.5">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl sm:text-3xl font-black text-primary font-sans">
                              {formatPrice(price)}
                            </span>
                            {origPrice > price && (
                              <span className="text-xs text-stone-400 line-through font-bold">
                                {formatPrice(origPrice)}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
                              Save {formatPrice(savings)}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Cash on Delivery (COD) Available</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Trust Micro-Perks */}
                  <div className="space-y-1.5 text-[11px] text-stone-600 font-medium pt-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-gold font-bold">✦</span>
                      <span>Includes free unstitched matching blouse piece</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gold font-bold">✦</span>
                      <span>100% Handcrafted Mulberry Silk • Certified Quality</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1.5">
                    {/* Primary TRY IT ON Button (Clean - no AI Fitting Room text) */}
                    <button
                      type="button"
                      onClick={() => handleTryItOn(quickViewLook)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                    >
                      <Shirt className="w-4 h-4 text-white" />
                      <span>TRY IT ON</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddFullLook(quickViewLook)}
                        className="w-full py-3 px-2 bg-primary hover:bg-[#521321] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                        <span>Add To Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderNow(quickViewLook)}
                        className="w-full py-3 px-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#C5A059] hover:to-[#B38F46] text-stone-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
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
