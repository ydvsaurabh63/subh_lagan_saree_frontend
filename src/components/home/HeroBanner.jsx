import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
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

  const snapTimeoutRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [looks, setLooks] = useState(sareeLooks);

  // Dynamically load live sarees from database while keeping fallbacks
  useEffect(() => {
    productApi.getProducts({ limit: 10 }).then((res) => {
      if (res.success && res.products && res.products.length >= 3) {
        const dynamicLooks = res.products.slice(0, 10).map((prod, idx) => {
          const defaultLook = sareeLooks[idx] || sareeLooks[0];
          return {
            id: prod._id,
            lookNumber: String(idx + 1).padStart(2, '0'),
            lookTitle: prod.name,
            tagline: `${prod.fabric} • ${prod.occasion || 'Handcrafted'}`,
            modelImage: defaultLook.modelImage,
            sareeSlug: prod.slug,
            items: [
              {
                id: prod._id,
                type: 'Saree',
                name: prod.name,
                detail: `${prod.fabric} • ${prod.color}`,
                price: prod.discountPrice || prod.price,
                originalPrice: prod.price,
                image: (prod.images && prod.images[0]) || defaultLook.items[0].image,
                isMain: true,
              },
              defaultLook.items[1],
              defaultLook.items[2],
            ],
          };
        });
        setLooks(dynamicLooks);
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
    let diff = (targetIdx - activeLookIndex) % count;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    triggerSnap(Math.round(currentRotation / 36) * 36 - diff * (360 / count));
  };

  // Drag / swipe 3D rotation gestures
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsSnapping(false);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragStartRotation(currentRotation);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX;
    // Rotate in 3D: 1px drag = 0.35 deg rotation
    setCurrentRotation(dragStartRotation + deltaX * 0.35);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap cleanly to nearest look (multiple of 36 deg)
    triggerSnap(Math.round(currentRotation / 36) * 36);
  };

  const handleAddFullLook = () => {
    const mainSaree = currentLook.items.find((it) => it.isMain);
    if (mainSaree) {
      addToCart(
        {
          _id: mainSaree.id,
          name: `${mainSaree.name} (Full Look Ensemble)`,
          price: mainSaree.originalPrice,
          discountPrice: totalBundlePrice,
          images: [mainSaree.image],
          fabric: 'Pure Handloom Silk',
          color: currentLook.lookTitle.split(' ')[1] || 'Festive',
        },
        1
      );
      toast.success(`Complete Look "${currentLook.lookTitle}" added to Bag!`);
    }
  };

  // Responsive turntable dimensions & 3D focal parameters
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isLaptop = windowWidth >= 1024 && windowWidth < 1280;

  const R = isMobile
    ? Math.max(120, Math.min(160, (windowWidth - 32) * 0.40))
    : isTablet
    ? Math.min(270, windowWidth * 0.35)
    : isLaptop
    ? 320
    : 370;

  const maxFloorDepth = isMobile ? 28 : isTablet ? 48 : 68;

  // Turntable dimensions on the floor (strictly matching the 3D orbit perimeter)
  const turntableWidth = isMobile
    ? Math.max(260, Math.min(340, windowWidth - 24))
    : isTablet
    ? 560
    : isLaptop
    ? 680
    : 760;

  const turntableScaleY = isMobile ? 0.24 : isTablet ? 0.22 : 0.20;
  const turntableHeight = Math.round(turntableWidth * turntableScaleY);
  const turntableBottomOffset = isMobile ? 80 : isTablet ? 110 : 135;
  const modelBottomOffset = isMobile ? 75 : isTablet ? 105 : 130;

  // 3D Circular Orbit calculations: all 10 models rotate in a real 3D circle
  const getModelStyle = (idx) => {
    const baseAngle = idx * (360 / count);
    
    // Effective angle relative to front camera (0 deg is front center)
    let effAngle = (baseAngle + currentRotation) % 360;
    if (effAngle < 0) effAngle += 360;
    if (effAngle > 180) effAngle -= 360; // range [-180, 180]

    const rad = (effAngle * Math.PI) / 180;
    const z = Math.cos(rad); // +1 at front, -1 at back
    const x = Math.sin(rad) * R;
    const y = ((1 - z) / 2) * maxFloorDepth;

    // 3D perspective scale: 1.08 at front, down to 0.58 at back
    const scale = (0.58 + ((z + 1) / 2) * 0.50).toFixed(3);
    const depthRatio = (z + 1) / 2;

    const isCenter = Math.abs(effAngle) < 18;
    const opacity = isCenter
      ? 1
      : Math.max(0.40, +(0.38 + depthRatio * 0.62).toFixed(2));

    const zIndex = isCenter ? 60 : Math.round(depthRatio * 50) + 5;
    const rotateY = (-effAngle * 0.28).toFixed(1);

    return {
      transform: `translate(${x.toFixed(2)}px, -${y.toFixed(2)}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      transition: isDragging || !isSnapping
        ? 'opacity 0.4s ease-out'
        : 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease-out',
    };
  };

  return (
    <div className="relative bg-[#F8F7F4] border-b border-stone-200 overflow-hidden select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT & CENTER: THE VIRTUAL SAREE RUNWAY (CIRCULAR ORBIT)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header Titles */}
            <div className="space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
                Try the Look.
              </h1>
              <p className="text-xs sm:text-sm text-stone-700 font-bold max-w-md">
                Drag or tap to spin the 3D runway.
              </p>
            </div>

            {/* Runway Stage with Floor Ambient Shadow and Circular Turntable */}
            <div
              className="relative mt-2 mb-4 sm:mt-3 sm:mb-6 flex items-center justify-center min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] cursor-grab active:cursor-grabbing select-none"
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

              {/* Models Lineup (All 10 Saree Models Arranged in 3D Orbiting Circle) */}
              <div className="relative flex items-end justify-center w-full max-w-5xl h-[420px] sm:h-[500px] lg:h-[580px]">
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
                      {/* Transparent Standing Model (Authentic Full-Length Saree in 3D Circle) */}
                      <div className="relative w-44 sm:w-60 lg:w-68 h-[370px] sm:h-[460px] lg:h-[530px] flex items-end justify-center">
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

                      {/* Natural Elliptical Floor Contact Shadow under each model on the circle */}
                      <div
                        className={`w-36 h-4 bg-stone-900/25 rounded-full blur-md -mt-2 transition-all ${
                          isActive ? 'scale-110 opacity-70' : 'opacity-40'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation Controls */}
            <div className="pt-2 flex items-center justify-start">
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full border border-stone-300 hover:border-gold hover:bg-white text-stone-700 transition active:scale-95 shadow-sm"
                  aria-label="Previous Look"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full border border-stone-300 hover:border-gold hover:bg-white text-stone-700 transition active:scale-95 shadow-sm"
                  aria-label="Next Look"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE PANEL: "IN THIS LOOK" (ENSEMBLE BREAKDOWN)     */}
          {/* ========================================================= */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gold/40 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-extrabold text-stone-950">
                    In this look
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">
                    {currentLook.tagline}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-gold/25 text-gold-dark text-[11px] font-black uppercase tracking-wider rounded border border-gold/40">
                  Look {currentLook.lookNumber}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5">
                {currentLook.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-stone-200 hover:border-gold hover:bg-cream/40 transition group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gold-dark">
                          {item.type}
                        </span>
                        {item.isIncluded && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            FREE
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-sm font-bold text-stone-950 truncate mt-0.5" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium truncate">
                        {item.detail}
                      </p>

                      <div className="flex items-baseline space-x-2 mt-1">
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
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3 mt-4">
              {/* Savings Card */}
              <div className="bg-cream/80 rounded-xl p-3 border border-gold/40 flex justify-between items-center text-xs">
                <div>
                  <span className="text-stone-500 line-through font-sans block text-[11px] font-bold">
                    {formatPrice(totalOriginalPrice)}
                  </span>
                  <span className="font-serif text-lg font-extrabold text-primary font-sans">
                    {formatPrice(totalBundlePrice)}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800">
                  Save {formatPrice(savings)}
                </span>
              </div>

              {/* Add full look to bag */}
              <button
                onClick={handleAddFullLook}
                className="w-full py-3.5 px-4 bg-primary hover:bg-secondary text-cream rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add full look</span>
                <ArrowRight className="w-4 h-4 text-gold stroke-[2.5]" />
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <Link
                  to={`/product/${currentLook.sareeSlug}`}
                  className="text-stone-500 hover:text-primary transition underline font-medium"
                >
                  View Saree
                </Link>
                <span className="text-stone-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>COD</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
