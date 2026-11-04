import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RotateCcw,
  Play,
  Pause,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';

/**
 * Model360Viewer: An interactive 360° turntable viewer for sarees and models.
 * Allows customers to rotate the model in place via touch swipe, mouse drag,
 * preset angle buttons, auto-spin, or scrubber slider.
 */
const Model360Viewer = ({
  frontImage,
  backImage,
  title = 'Saree Model',
  sareeName = '',
}) => {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const dragStartRef = useRef({ x: 0, angle: 0 });
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Normalize angle to [0, 359]
  const normalizedAngle = ((Math.round(angle) % 360) + 360) % 360;

  // Compute view label based on current angle
  const getViewLabel = useCallback((deg) => {
    if (deg >= 330 || deg < 30) return 'Front View (0°)';
    if (deg >= 30 && deg < 75) return 'Left 3/4 Angle (45°)';
    if (deg >= 75 && deg < 115) return 'Left Profile (90°)';
    if (deg >= 115 && deg < 165) return 'Back 3/4 Drape (135°)';
    if (deg >= 165 && deg < 195) return 'Pallu & Back Drape (180°)';
    if (deg >= 195 && deg < 245) return 'Right 3/4 Drape (225°)';
    if (deg >= 245 && deg < 285) return 'Right Profile (270°)';
    return 'Right 3/4 Angle (315°)';
  }, []);

  // Auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpin) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const spinSpeedDegPerSec = 40; // 360 degrees in ~9 seconds

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setAngle((prev) => (prev + spinSpeedDegPerSec * deltaSec) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpin]);

  // Pointer drag handlers (supports mouse and touch smoothly with setPointerCapture)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false); // pause auto-spin on user gesture
    dragStartRef.current = { x: e.clientX, angle };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    // 1px drag = 0.85 degrees rotation
    const newAngle = dragStartRef.current.angle + dx * 0.85;
    setAngle(newAngle);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Preset rotation jumps
  const rotateBy = (delta) => {
    setIsAutoSpin(false);
    setAngle((prev) => prev + delta);
  };

  const setPresetAngle = (targetDeg) => {
    setIsAutoSpin(false);
    // Find shortest rotation path from current angle
    const currentNorm = ((angle % 360) + 360) % 360;
    let diff = targetDeg - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setAngle((prev) => prev + diff);
  };

  // High-res fallback for back drape image
  const resolvedBackImage = backImage
    ? backImage.replace('w=300', 'w=800')
    : frontImage;

  return (
    <div className="relative w-full h-[410px] sm:h-[490px] rounded-3xl bg-gradient-to-b from-[#FAF8F5] via-[#F3EFEA] to-[#EAE4DC] border border-stone-200/90 overflow-hidden flex flex-col justify-between shadow-inner select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP OVERLAY BAR: Badges & Zoom Toggle */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 flex items-center justify-between p-3 pointer-events-auto">
        {/* Interactive 360 Indicator */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-gold/40 shadow-xs">
          <RotateCw
            className={`w-3.5 h-3.5 text-primary ${
              isAutoSpin ? 'animate-spin' : ''
            }`}
          />
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-800">
            360° In-Place View
          </span>
        </div>

        {/* View angle & Zoom controls */}
        <div className="flex items-center space-x-1.5">
          <div className="px-2.5 py-1 rounded-full bg-stone-900/85 text-gold text-[10px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            {getViewLabel(normalizedAngle)}
          </div>

          <button
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200 shadow-xs transition cursor-pointer"
            title={isZoomed ? 'Reset Zoom' : 'Zoom Fabric Detail'}
          >
            {isZoomed ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN 3D ROTATIONAL STAGE */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Ambient Studio Lighting Backdrop Glow */}
        <div className="absolute inset-x-8 top-6 bottom-12 rounded-full bg-radial from-amber-100/70 via-stone-200/30 to-transparent blur-xl pointer-events-none" />

        {/* 3D Turntable Pedestal Floor Disc Under Model's Feet */}
        <div
          className="absolute bottom-5 sm:bottom-6 w-44 sm:w-60 h-14 rounded-[50%] pointer-events-none transition-transform"
          style={{
            transform: 'rotateX(74deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer Gold Turntable Ring */}
          <div className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-stone-100 via-amber-50 to-stone-300 border-2 border-gold/70 shadow-[0_12px_24px_rgba(180,83,9,0.22)]" />
          {/* Inner Inset Rim */}
          <div className="absolute inset-1.5 rounded-[50%] border border-gold/40 border-dashed" />
          <div className="absolute inset-4 rounded-[50%] bg-amber-50/50 shadow-inner" />

          {/* Synchronized Turntable Needle & Cardinal Compass Ticks */}
          <div
            className="absolute inset-0 rounded-[50%] flex items-center justify-center"
            style={{ transform: `rotate(${normalizedAngle}deg)` }}
          >
            <div className="absolute top-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white shadow-sm" />
            <div className="absolute bottom-1 w-2 h-2 rounded-full bg-gold shadow-xs" />
            <div className="absolute left-1.5 w-1.5 h-1.5 rounded-full bg-stone-400" />
            <div className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-stone-400" />
          </div>

          {/* Contact Shadow directly under feet */}
          <div className="absolute inset-x-10 inset-y-2 rounded-[50%] bg-stone-950/30 blur-xs" />
        </div>

        {/* 3D ROTATING FIGURE CONTAINER */}
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none select-none transition-transform"
          style={{
            perspective: '1100px',
            perspectiveOrigin: '50% 60%',
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${angle}deg) ${isZoomed ? 'scale(1.22)' : 'scale(1)'}`,
              transition: isDragging
                ? 'none'
                : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transformOrigin: '50% 88%',
            }}
          >
            {/* ------------------------------------------------------- */}
            {/* FRONT FACE: Full-Length Draped Model Cutout */}
            {/* ------------------------------------------------------- */}
            <div
              className="absolute inset-0 flex items-end justify-center pb-5 sm:pb-6"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={frontImage}
                alt={`${title} - Front View`}
                className="max-h-[310px] sm:max-h-[390px] w-auto object-contain object-bottom drop-shadow-[0_16px_28px_rgba(0,0,0,0.24)]"
                draggable={false}
              />

              {/* Dynamic Fabric Sheen Shimmer on Golden Zari as Model Spins */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 transition-opacity"
                style={{
                  background: `linear-gradient(${
                    90 + (normalizedAngle % 180)
                  }deg, transparent 20%, rgba(255, 235, 180, 0.7) 50%, transparent 80%)`,
                }}
              />
            </div>

            {/* ------------------------------------------------------- */}
            {/* BACK FACE: Authentic Pallu & Back Drape View */}
            {/* ------------------------------------------------------- */}
            <div
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-5 pb-7 sm:pb-8"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="relative w-[86%] sm:w-[82%] h-[88%] sm:h-[90%] rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-stone-900 flex flex-col items-center justify-center">
                <img
                  src={resolvedBackImage}
                  alt={`${title} - Pallu & Back Drape`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-stone-950/20" />

                {/* Saree Pallu Badge */}
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Back & Pallu Drape</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Hint Overlay (fades out while dragging) */}
        {!isDragging && !isAutoSpin && (
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center pointer-events-none opacity-60 transition">
            <span className="text-[10px] font-bold text-stone-500 tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded-full backdrop-blur-xs">
              ⇄ Drag left/right to rotate
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM CONTROLS: Quick Angles, Auto-Spin & Scrubber */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 p-2.5 sm:p-3 bg-white/90 backdrop-blur-md border-t border-stone-200/80 space-y-2 pointer-events-auto">
        {/* Preset Angle Buttons & Rotation Jump */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Rotate Left 45° */}
          <button
            onClick={() => rotateBy(-45)}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition active:scale-95 cursor-pointer shadow-xs"
            title="Rotate Left 45°"
            aria-label="Rotate Left 45 degrees"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Angle Presets */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setPresetAngle(0)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                normalizedAngle >= 330 || normalizedAngle < 30
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Front
            </button>

            <button
              onClick={() => setPresetAngle(45)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                normalizedAngle >= 30 && normalizedAngle < 115
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Side
            </button>

            <button
              onClick={() => setPresetAngle(180)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                normalizedAngle >= 150 && normalizedAngle < 210
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Pallu (Back)
            </button>
          </div>

          {/* Auto Spin Toggle */}
          <button
            onClick={() => setIsAutoSpin((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer shadow-xs ${
              isAutoSpin
                ? 'bg-gold text-stone-950 ring-2 ring-gold/40'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title="Toggle 360° Auto Spin"
          >
            {isAutoSpin ? (
              <>
                <Pause className="w-3 h-3 text-primary" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-gold fill-gold" />
                <span>Auto Spin</span>
              </>
            )}
          </button>

          {/* Rotate Right 45° */}
          <button
            onClick={() => rotateBy(45)}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition active:scale-95 cursor-pointer shadow-xs"
            title="Rotate Right 45°"
            aria-label="Rotate Right 45 degrees"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Continuous 360° Scrub Range Slider */}
        <div className="flex items-center space-x-2 pt-0.5">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
            0°
          </span>
          <input
            type="range"
            min="0"
            max="359"
            value={normalizedAngle}
            onChange={(e) => {
              setIsAutoSpin(false);
              setAngle(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-hidden"
            aria-label="360 degree angle scrubber"
          />
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
            360°
          </span>
        </div>
      </div>
    </div>
  );
};

export default Model360Viewer;
