import React from 'react';
import { motion } from 'motion/react';
import type { ItemType } from '../types/game';

interface EatingStageProps {
  currentItem: ItemType;
  nextItem?: ItemType;
  itemKey: number;
  isFrenzy: boolean;
}

export const EatingStage: React.FC<EatingStageProps> = ({
  currentItem,
  nextItem,
  itemKey,
  isFrenzy,
}) => {
  const isBomb = currentItem === 'bomb' || currentItem === 'mega_bomb';

  return (
    <div className="relative w-full max-w-lg mx-auto py-2 flex flex-col items-center justify-center select-none">
      {/* Smooth 3D Porcelain Stage Card */}
      <div className="relative w-full h-56 sm:h-60 rounded-3xl bg-gradient-to-b from-stone-900/95 via-amber-950/85 to-stone-900/95 border-2 border-amber-500/40 shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-4 overflow-hidden">
        
        {/* Soft Ambient 3D Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header inside Stage: Decision Hint & Next Item Preview */}
        <div className="w-full flex items-center justify-between z-10">
          {/* Status Prompt Badge */}
          <div className={`px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border shadow-sm transition-colors ${
            isBomb
              ? 'bg-rose-500/25 text-rose-200 border-rose-400/50 animate-pulse'
              : 'bg-amber-400/25 text-amber-200 border-amber-400/50'
          }`}>
            <span className="text-base">{isBomb ? '💣' : '🍌'}</span>
            <span>{isBomb ? '귀여운 폭탄이다! [안 먹기] 로 피하기!' : '맛있는 바나나! [먹기] 로 냠냠!'}</span>
          </div>

          {/* Next Item Mini Preview */}
          {nextItem && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300 shadow-sm">
              <span className="text-stone-400 font-semibold">다음:</span>
              <div className="w-5 h-5 flex items-center justify-center">
                {renderMiniItem(nextItem)}
              </div>
            </div>
          )}
        </div>

        {/* Center Display: Smooth 3D Serving Plate & Cute 3D Object */}
        <div className="relative flex-1 flex flex-col items-center justify-center w-full z-10 my-1">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            
            {/* Smooth 3D Ceramic Plate SVG */}
            <svg viewBox="0 0 200 140" className="absolute bottom-1 w-52 h-36 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <defs>
                <linearGradient id="plateRim" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="40%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <radialGradient id="plateInner" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#FFFBEB" />
                  <stop offset="100%" stopColor="#FDE68A" />
                </radialGradient>

                <linearGradient id="plateBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>

              {/* Base shadow */}
              <ellipse cx="100" cy="112" rx="60" ry="14" fill="#000000" opacity="0.3" filter="blur(4px)" />

              {/* Plate Base Pedestal */}
              <ellipse cx="100" cy="106" rx="55" ry="12" fill="url(#plateBase)" />

              {/* Outer Plate Rim */}
              <ellipse cx="100" cy="80" rx="86" ry="34" fill="url(#plateRim)" />

              {/* Inner Plate Surface */}
              <ellipse cx="100" cy="78" rx="72" ry="26" fill="url(#plateInner)" />

              {/* Soft Food Shadow on Plate */}
              <ellipse cx="100" cy="78" rx="34" ry="12" fill="#78350F" opacity="0.2" filter="blur(3px)" />
            </svg>

            {/* Current Cute 3D Item - Instantly swaps on button tap */}
            <div key={itemKey} className="relative z-20 -mt-6">
              <motion.div
                initial={{ scale: 0.88, opacity: 0.95 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.08 }}
              >
                {renderCute3DItem(currentItem, isFrenzy)}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="w-full text-center z-10 text-[11px] font-medium text-amber-200/80">
          버튼을 누르면 즉시 판정되고 다음 귀여운 물건으로 바뀝니다!
        </div>
      </div>
    </div>
  );
};

// Render mini icon for Next preview
function renderMiniItem(type: ItemType) {
  switch (type) {
    case 'banana':
      return <span className="text-base">🍌</span>;
    case 'golden_banana':
      return <span className="text-base">⭐</span>;
    case 'ice_banana':
      return <span className="text-base">❄️</span>;
    case 'bomb':
      return <span className="text-base">💣</span>;
    case 'mega_bomb':
      return <span className="text-base">☠️</span>;
    default:
      return null;
  }
}

// Render Cute 3D Character Items (Banana & Bomb)
function renderCute3DItem(type: ItemType, isFrenzy: boolean) {
  switch (type) {
    case 'banana':
      return (
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.4)]">
          {/* Smooth Cute 3D Banana with Cute Face */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              {/* 3D Banana Skin Gradient */}
              <radialGradient id="banana3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="45%" stopColor="#FACC15" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>

              {/* 3D Stem Gradient */}
              <linearGradient id="stem3D" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="50%" stopColor="#65A30D" />
                <stop offset="100%" stopColor="#3F6212" />
              </linearGradient>

              {/* Eye Gloss */}
              <linearGradient id="bananaEye" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#0C0A09" />
              </linearGradient>
            </defs>

            {/* Plump Curved Banana Body */}
            <path
              d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z"
              fill="url(#banana3DGloss)"
              stroke="#B45309"
              strokeWidth="2.5"
            />

            {/* Banana Curved Top Highlight Streak */}
            <path
              d="M 36 26 C 46 22, 66 28, 76 48 C 78 54, 76 58, 73 54 C 65 36, 48 30, 36 26 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />

            {/* Green Stem with Cute Sprout Leaf */}
            <path
              d="M 28 24 C 24 18, 20 16, 17 19 C 15 22, 19 26, 23 26 Z"
              fill="url(#stem3D)"
              stroke="#365314"
              strokeWidth="1.5"
            />
            <circle cx="17" cy="19" r="2.5" fill="#4D7C0F" />

            {/* Bottom Tip Point */}
            <circle cx="62" cy="85" r="3" fill="#713F12" />

            {/* CUTE SMILING FACE ON BANANA (단색 홍조, 큰 눈, 흰 안광 큰 거 하나 작은 거 하나, 작은 입) */}
            {/* Solid Flat Pink Blushing Cheeks (햄홍조 그라데이션 x, 단색처리) */}
            <circle cx="50" cy="58" r="4.5" fill="#F472B6" />
            <circle cx="72" cy="62" r="4.5" fill="#F472B6" />

            {/* Left Big Sparkly Eye */}
            <circle cx="56" cy="52" r="5.5" fill="#1C140E" />
            <circle cx="54.5" cy="50" r="2.2" fill="#FFFFFF" />
            <circle cx="57.8" cy="53.8" r="1.1" fill="#FFFFFF" />

            {/* Right Big Sparkly Eye */}
            <circle cx="68" cy="54" r="5.5" fill="#1C140E" />
            <circle cx="66.5" cy="52" r="2.2" fill="#FFFFFF" />
            <circle cx="69.8" cy="55.8" r="1.1" fill="#FFFFFF" />

            {/* Small Cute Mouth */}
            <path
              d="M 60 59 Q 62.5 62 65 59"
              fill="none"
              stroke="#713F12"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Cute Blue Star Sticker */}
            <polygon points="46,40 48,36 50,40 54,41 51,43 52,47 48,44 44,47 45,43 42,41" fill="#3B82F6" />
          </svg>
        </div>
      );

    case 'golden_banana':
      return (
        <div className="w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(250,204,21,0.9)]">
          {/* Smooth 3D Radiant Golden Banana */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="gold3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>
            </defs>

            {/* Golden Body */}
            <path
              d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z"
              fill="url(#gold3DGloss)"
              stroke="#D97706"
              strokeWidth="2.8"
            />

            {/* Stem */}
            <path
              d="M 28 24 C 24 18, 20 16, 17 19 C 15 22, 19 26, 23 26 Z"
              fill="#F59E0B"
              stroke="#92400E"
              strokeWidth="1.5"
            />

            {/* Solid Pink Blushing Cheeks */}
            <circle cx="50" cy="58" r="4.5" fill="#F472B6" />
            <circle cx="72" cy="62" r="4.5" fill="#F472B6" />

            {/* Big Sparkly Eyes (큰 거 하나 작은 거 하나) */}
            <circle cx="56" cy="52" r="5.5" fill="#2E1605" />
            <circle cx="54.5" cy="50" r="2.2" fill="#FFFFFF" />
            <circle cx="57.8" cy="53.8" r="1.1" fill="#FFFFFF" />

            <circle cx="68" cy="54" r="5.5" fill="#2E1605" />
            <circle cx="66.5" cy="52" r="2.2" fill="#FFFFFF" />
            <circle cx="69.8" cy="55.8" r="1.1" fill="#FFFFFF" />

            <path d="M 60 59 Q 62.5 62.5 65 59" fill="none" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />

            {/* Sparkle Stars */}
            <text x="74" y="28" fontSize="14" fill="#FFFFFF">✨</text>
            <text x="24" y="80" fontSize="14" fill="#FFFFFF">✨</text>
          </svg>
        </div>
      );

    case 'ice_banana':
      return (
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(56,189,248,0.9)]">
          {/* Smooth 3D Frosty Ice Banana */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="ice3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#BAE6FD" />
                <stop offset="75%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </radialGradient>
            </defs>

            <path
              d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z"
              fill="url(#ice3DGloss)"
              stroke="#0369A1"
              strokeWidth="2.5"
            />

            {/* Solid Pink Blushing Cheeks */}
            <circle cx="50" cy="58" r="4.5" fill="#F472B6" />
            <circle cx="72" cy="62" r="4.5" fill="#F472B6" />

            {/* Big Sparkly Eyes */}
            <circle cx="56" cy="52" r="5.5" fill="#0C4A6E" />
            <circle cx="54.5" cy="50" r="2.2" fill="#FFFFFF" />
            <circle cx="57.8" cy="53.8" r="1.1" fill="#FFFFFF" />

            <circle cx="68" cy="54" r="5.5" fill="#0C4A6E" />
            <circle cx="66.5" cy="52" r="2.2" fill="#FFFFFF" />
            <circle cx="69.8" cy="55.8" r="1.1" fill="#FFFFFF" />

            <path d="M 60 60 Q 62.5 63 65 60" fill="none" stroke="#0C4A6E" strokeWidth="1.8" strokeLinecap="round" />
            <text x="32" y="44" fontSize="14">❄️</text>
          </svg>
        </div>
      );

    case 'bomb':
      return (
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.6)]">
          {/* Adorable Chunky 3D Cartoon Bomb Mascot */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="bomb3DGloss" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="35%" stopColor="#475569" />
                <stop offset="75%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#090D16" />
              </radialGradient>

              <linearGradient id="bombNeck" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* Burning Fuse with Cute Star Spark */}
            <path
              d="M 50 30 Q 56 16 66 18"
              fill="none"
              stroke="#D97706"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="68" cy="18" r="5" fill="#EF4444" className="animate-ping" />
            <polygon points="68,12 70,16 74,18 70,20 68,24 66,20 62,18 66,16" fill="#FACC15" />

            {/* Brass Collar */}
            <rect x="42" y="28" width="16" height="7" rx="3" fill="url(#bombNeck)" />

            {/* Cute Plump 3D Bomb Body */}
            <circle cx="50" cy="58" r="32" fill="url(#bomb3DGloss)" />

            {/* Specular 3D Light Highlight Streak */}
            <ellipse cx="38" cy="42" rx="10" ry="6" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 38 42)" />

            {/* Solid Pink Blushing Cheeks (단색처리) */}
            <circle cx="36" cy="64" r="4.5" fill="#F472B6" />
            <circle cx="64" cy="64" r="4.5" fill="#F472B6" />

            {/* Left Big Cute Sparkly Eye (큰 거 하나 작은 거 하나) */}
            <circle cx="42" cy="56" r="6" fill="#0F172A" />
            <circle cx="40.5" cy="54" r="2.4" fill="#FFFFFF" />
            <circle cx="44" cy="58" r="1.1" fill="#FFFFFF" />

            {/* Right Big Cute Sparkly Eye (큰 거 하나 작은 거 하나) */}
            <circle cx="58" cy="56" r="6" fill="#0F172A" />
            <circle cx="56.5" cy="54" r="2.4" fill="#FFFFFF" />
            <circle cx="60" cy="58" r="1.1" fill="#FFFFFF" />

            {/* Small Cute Smile */}
            <path
              d="M 48 64 Q 50 66.5 52 64"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Little Cute Stubby Feet */}
            <ellipse cx="40" cy="88" rx="6" ry="4" fill="#E11D48" />
            <ellipse cx="60" cy="88" rx="6" ry="4" fill="#E11D48" />
          </svg>
        </div>
      );

    case 'mega_bomb':
      return (
        <div className="w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(239,68,68,0.9)]">
          {/* Adorable Mega Bomb with Cute Soft Spikes */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="megaBomb3DGloss" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FCA5A5" />
                <stop offset="40%" stopColor="#EF4444" />
                <stop offset="75%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#450A0A" />
              </radialGradient>
            </defs>

            {/* Soft Rounded Spikes */}
            <circle cx="50" cy="18" r="8" fill="#DC2626" />
            <circle cx="50" cy="94" r="8" fill="#991B1B" />
            <circle cx="12" cy="56" r="8" fill="#DC2626" />
            <circle cx="88" cy="56" r="8" fill="#DC2626" />

            {/* Burning Fuse */}
            <path d="M 50 26 Q 58 12 68 14" fill="none" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
            <circle cx="70" cy="14" r="5" fill="#EF4444" className="animate-ping" />
            <polygon points="70,8 72,12 76,14 72,16 70,20 68,16 64,14 68,12" fill="#FEF08A" />

            {/* Plump Red Body */}
            <circle cx="50" cy="56" r="34" fill="url(#megaBomb3DGloss)" />

            {/* Specular Highlight */}
            <ellipse cx="38" cy="38" rx="10" ry="6" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 38 38)" />

            {/* Cute Pouty Face on Mega Bomb! */}
            <ellipse cx="34" cy="62" rx="4.5" ry="3" fill="#FECDD3" opacity="0.9" />
            <ellipse cx="66" cy="62" rx="4.5" ry="3" fill="#FECDD3" opacity="0.9" />

            {/* Cute Determined Pout Eyes ( > < ) */}
            <path d="M 38 52 L 44 56 L 38 60" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 62 52 L 56 56 L 62 60" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Pout Mouth */}
            <ellipse cx="50" cy="65" rx="3.5" ry="3" fill="#FFFFFF" />

            {/* Cute Skull Ribbon on Forehead */}
            <circle cx="50" cy="40" r="5" fill="#FFFFFF" />
            <circle cx="48" cy="39" r="1.2" fill="#991B1B" />
            <circle cx="52" cy="39" r="1.2" fill="#991B1B" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
