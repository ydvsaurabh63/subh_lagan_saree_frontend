import React from 'react';
import { Shirt } from 'lucide-react';
import { useTryOn } from '../../context/TryOnContext.jsx';

const VirtualTryOn = () => {
  const { isOpen, toggleTryOn } = useTryOn();

  return (
    <>
      {/* Floating Sticky Widget on Bottom-Left for Quick Access Anywhere */}
      {!isOpen && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 block">
          <button
            onClick={toggleTryOn}
            title="Try on any Saree virtually"
            className="group flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#18181b]/95 hover:bg-[#18181b] backdrop-blur-md text-white rounded-full border-2 border-[#D97706] shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_45px_rgba(217,119,6,0.45)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow flex-shrink-0">
              <Shirt className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
            </div>
            <div className="text-left pr-1">
              <div className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-white font-sans leading-tight">
                TRY IT ON
              </div>
              <div className="text-[9px] sm:text-[10px] font-semibold text-[#F59E0B] leading-tight">
                Fitting Room
              </div>
            </div>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D97706] animate-pulse"></span>
          </button>
        </div>
      )}
    </>
  );
};

export default VirtualTryOn;
