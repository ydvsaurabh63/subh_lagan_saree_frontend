import React, { useState } from 'react';

const ProductGallery = ({ images = [], productName = 'Subh Lagan Saree' }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  const galleryImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] pb-2 md:pb-0 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition ${
                activeImage === idx
                  ? 'border-primary shadow-md'
                  : 'border-stone-200 hover:border-gold opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image with Zoom */}
      <div
        className="relative flex-1 aspect-[3/4] bg-cream rounded-2xl overflow-hidden border border-stone-200 cursor-crosshair group shadow-sm"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={galleryImages[activeImage]}
          alt={productName}
          className="w-full h-full object-cover object-top"
        />

        {/* Hover Zoom Magnifier Overlay */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none transition-opacity duration-150 rounded-2xl"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${galleryImages[activeImage]})`,
            backgroundSize: '220%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Indicator */}
        <div className="hidden lg:block absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Hover to Zoom
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;

