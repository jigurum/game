import React from 'react';
import { motion } from 'motion/react';

interface TouchGameControlsProps {
  onEat: () => void;
  onPass: () => void;
  disabled?: boolean;
}

export const TouchGameControls: React.FC<TouchGameControlsProps> = ({
  onEat,
  onPass,
  disabled = false,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignore haptic errors on unsupported platforms
      }
    }
  };

  const handleEat = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    onEat();
  };

  const handlePass = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    onPass();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 select-none">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Left: 먹기 (Left Arrow Button) */}
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          onClick={handleEat}
          className="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-[0_8px_0_#92400E] active:shadow-[0_2px_0_#92400E] active:translate-y-1.5 transition-all border-2 border-amber-300/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation overflow-hidden"
        >
          {/* Smooth 3D Curvature Gloss Highlight */}
          <div className="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14 text-stone-950 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-active:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-stone-950 drop-shadow mt-0.5">
              먹기
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-950/80 mt-0.5">
              [ ← ]
            </span>
          </div>
        </motion.button>

        {/* Right: 안먹기 (Right Arrow Button) */}
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          onClick={handlePass}
          className="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white shadow-[0_8px_0_#881337] active:shadow-[0_2px_0_#881337] active:translate-y-1.5 transition-all border-2 border-rose-300/60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation overflow-hidden"
        >
          {/* Smooth 3D Curvature Gloss Highlight */}
          <div className="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform group-active:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow mt-0.5">
              안먹기
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-100/90 mt-0.5">
              [ → ]
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
