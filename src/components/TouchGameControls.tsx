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
        {/* Smooth 3D Pillowy Pass / Don't Eat Button (안 먹기) */}
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          onClick={handlePass}
          className="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white shadow-[0_8px_0_#881337] active:shadow-[0_2px_0_#881337] active:translate-y-1.5 transition-all border-2 border-rose-300/60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation overflow-hidden"
        >
          {/* Smooth 3D Curvature Gloss Highlight */}
          <div className="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🚫</span>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow">
              안 먹기
            </span>
          </div>

          <span className="relative z-10 text-xs font-bold text-rose-100 mt-0.5">
            폭탄 피하기 (회피)
          </span>

          <span className="relative z-10 hidden sm:inline-block text-[10px] font-mono text-rose-100 mt-1.5 px-2.5 py-0.5 bg-rose-900/60 border border-rose-400/30 rounded-full">
            [ ← ] or [ A ]
          </span>
        </motion.button>

        {/* Smooth 3D Pillowy Eat Button (먹기) */}
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          onClick={handleEat}
          className="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-[0_8px_0_#92400E] active:shadow-[0_2px_0_#92400E] active:translate-y-1.5 transition-all border-2 border-amber-300/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation overflow-hidden"
        >
          {/* Smooth 3D Curvature Gloss Highlight */}
          <div className="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🍌</span>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-stone-950 drop-shadow">
              먹 기 !
            </span>
          </div>

          <span className="relative z-10 text-xs font-black text-amber-950 mt-0.5">
            바나나 냠냠 (득점)
          </span>

          <span className="relative z-10 hidden sm:inline-block text-[10px] font-mono text-stone-900 font-bold mt-1.5 px-2.5 py-0.5 bg-amber-300/90 border border-amber-600/40 rounded-full">
            [ Space ] or [ → ]
          </span>
        </motion.button>
      </div>
    </div>
  );
};
