import React from 'react';
import { Shirt } from 'lucide-react';
import { useTryOn } from '../../context/TryOnContext.jsx';

const VirtualTryOn = () => {
  const { isOpen, toggleTryOn } = useTryOn();

  return (
    <>
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
