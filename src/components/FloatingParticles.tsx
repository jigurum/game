import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FloatingText } from '../types/game';

interface FloatingParticlesProps {
  items: FloatingText[];
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ items }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {items.map((item) => {
          let colorClass = 'text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
          if (item.type === 'gain') {
            colorClass = 'text-yellow-300 font-black text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)]';
          } else if (item.type === 'loss') {
            colorClass = 'text-rose-500 font-black text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]';
          } else if (item.type === 'safe') {
            colorClass = 'text-emerald-300 font-extrabold text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(16,185,129,0.8)]';
          } else if (item.type === 'combo') {
            colorClass = 'text-orange-400 font-black text-2xl sm:text-3xl drop-shadow-[0_2px_10px_rgba(249,115,22,0.9)]';
          } else if (item.type === 'miss') {
            colorClass = 'text-slate-400 font-bold text-base';
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, scale: 0.6, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                scale: [0.8, 1.25, 1],
                y: -65,
                x: (Math.random() - 0.5) * 30,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`select-none pointer-events-none whitespace-nowrap ${colorClass}`}
            >
              {item.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
