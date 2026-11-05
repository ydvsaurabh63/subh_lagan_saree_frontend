import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

const announcements = [
  { icon: Sparkles, text: 'Festive & Wedding Showcase 2026' },
  { icon: Truck, text: 'Free Delivery on Orders Above ₹1,999' },
  { icon: ShieldCheck, text: 'Cash on Delivery (COD) Available' },
  { icon: HeartHandshake, text: '100% Silk Mark Certified' },
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-primary-dark text-white py-2 px-4 text-xs font-extrabold tracking-wider border-b border-gold/30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-center transition-all duration-500 ease-in-out">
        <Icon className="w-3.5 h-3.5 text-white animate-pulse flex-shrink-0" />
        <span className="truncate text-white font-medium">{current.text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;

