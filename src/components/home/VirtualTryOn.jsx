import React from 'react';
import { Shirt } from 'lucide-react';
import { useTryOn } from '../../context/TryOnContext.jsx';

const VirtualTryOn = () => {
  const { openTryOn, isOpen, toggleTryOn } = useTryOn();

  return (
    <>
      {/* =================================================================== */}
      {/* "TRY IT ON" PILL TRIGGER BUTTON (EXACT MATCH TO REFERENCE)          */}
      {/* =================================================================== */}
      <section className="py-3 sm:py-4 bg-[#F8F7F4] border-b border-stone-200 select-none">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
          <button
            onClick={openTryOn}
            aria-label="Open Virtual Fitting Room"
            className="group flex items-center space-x-3.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#18181b] hover:bg-[#222226] text-white rounded-full border-2 border-[#D97706] shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(217,119,6,0.35)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {/* Circular Icon Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              <Shirt className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            </div>

            {/* Button Titles */}
            <div className="text-left pr-2">
              <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-white font-sans leading-tight">
                TRY IT ON
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-[#F59E0B] leading-tight">
                Virtual Fitting Room
              </div>
            </div>

            {/* Right Accent Pulse Dot */}
            <div className="relative w-2.5 h-2.5 flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              <span className="absolute inset-0 rounded-full bg-[#D97706] animate-ping opacity-60"></span>
            </div>
          </button>
        </div>
      </section>

      {/* Floating Sticky Widget on Bottom-Left for Quick Access Anywhere */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
          <button
            onClick={toggleTryOn}
            title="Try on any Saree virtually"
            className="group flex items-center space-x-3 px-4 py-2.5 bg-[#18181b]/95 hover:bg-[#18181b] backdrop-blur-md text-white rounded-full border-2 border-[#D97706] shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_45px_rgba(217,119,6,0.45)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow flex-shrink-0">
              <Shirt className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-black tracking-wider uppercase text-white font-sans leading-tight">
                TRY IT ON
              </div>
              <div className="text-[10px] font-semibold text-[#F59E0B] leading-tight">
                Fitting Room
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
          </button>
        </div>
      )}
    </>
  );
};

export default VirtualTryOn;
