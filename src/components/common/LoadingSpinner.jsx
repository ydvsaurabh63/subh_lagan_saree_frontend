import React from 'react';

const LoadingSpinner = ({ text = 'Loading luxury sarees...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-14 h-14">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-stone-200"></div>
        {/* Spinning Gold/Maroon Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-gold animate-spin"></div>
        {/* Center Emblem */}
        <div className="absolute inset-2 rounded-full bg-cream flex items-center justify-center text-primary font-serif font-bold text-xs">
          SL
        </div>
      </div>
      {text && (
        <p className="mt-4 text-xs font-serif italic text-stone-500 tracking-wider">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

