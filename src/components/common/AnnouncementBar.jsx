import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, ShieldCheck, HeartHandshake, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const AnnouncementBar = () => {
  const { store, isBoutiqueStore } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = isBoutiqueStore
    ? [
        { icon: Store, text: `Welcome to ${store.name}` },
        { icon: Sparkles, text: `${store.tagline || 'Exclusive Heritage Silks & Sarees'}` },
        { icon: ShieldCheck, text: `Direct WhatsApp Orders: ${store.whatsapp || '+91 81475 40362'}` },
        { icon: Truck, text: 'Cash on Delivery (COD) Available • Silk Mark Certified' },
      ]
    : [
        { icon: Sparkles, text: 'Festive & Wedding Showcase 2026' },
        { icon: Truck, text: 'Free Delivery on Orders Above ₹1,999' },
        { icon: ShieldCheck, text: 'Cash on Delivery (COD) Available' },
        { icon: HeartHandshake, text: '100% Silk Mark Certified' },
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const current = announcements[currentIndex % announcements.length];
  const Icon = current.icon;

  return (
    <div className="bg-primary-dark text-white py-2 px-4 text-xs font-extrabold tracking-wider border-b border-gold/30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-center transition-all duration-500 ease-in-out">
        <Icon className="w-3.5 h-3.5 text-gold-light animate-pulse flex-shrink-0" />
        <span className="truncate text-white font-medium">{current.text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
