import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MonkeyMood } from '../types/game';

interface MonkeyCharacterProps {
  mood: MonkeyMood;
  combo: number;
}

export const MonkeyCharacter: React.FC<MonkeyCharacterProps> = ({ mood, combo }) => {
  const isFever = combo >= 8 || mood === 'fever';
  const isSoot = mood === 'eating_bad';

  // Unified Beige Palette for the entire body
  const beigeBase = isSoot ? '#4B4643' : '#DBCBB6';
  const beigeShadow = isSoot ? '#363230' : '#C4B29B';
  const beigeHighlight = isSoot ? '#605A56' : '#EFE4D6';

  // Lighter cream tone for face patch
  const faceCream = isSoot ? '#706863' : '#F6F1E9';
  const faceShadow = isSoot ? '#544D49' : '#E8DFD3';

  return (
    <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center select-none">
      {/* Fever Glow */}
      {isFever && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 to-yellow-300/30 blur-2xl -z-10 pointer-events-none"
        />
      )}

      {/* Bomb Soot Smoke */}
      <AnimatePresence>
        {isSoot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.25, y: -26 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-4 z-30 pointer-events-none flex items-center gap-1"
          >
            <span className="text-2xl animate-bounce">💥</span>
            <span className="text-xl animate-pulse">💨</span>
            <span className="text-2xl animate-bounce">💨</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SVG Cute Beige Monkey */}
      <motion.svg
        viewBox="0 0 240 240"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
        animate={
          isSoot
            ? { x: [-3, 3, -3, 3, 0], rotate: [-2, 2, -2, 2, 0] }
            : mood === 'eating_good'
            ? { scale: [1, 1.07, 0.98, 1], y: [0, -5, 0] }
            : mood === 'dodged'
            ? { rotate: [-3, 3, 0], x: [-3, 0] }
            : { y: [0, -2.5, 0] }
        }
        transition={
          isSoot
            ? { duration: 0.28 }
            : mood === 'eating_good'
            ? { duration: 0.2 }
            : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <defs>
          {/* Smooth 3D Beige Shading */}
          <radialGradient id="beigeHead" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={beigeHighlight} />
            <stop offset="60%" stopColor={beigeBase} />
            <stop offset="100%" stopColor={beigeShadow} />
          </radialGradient>

          <radialGradient id="beigeBody" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={beigeHighlight} />
            <stop offset="65%" stopColor={beigeBase} />
            <stop offset="100%" stopColor={beigeShadow} />
          </radialGradient>

          <radialGradient id="facePatch" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor={faceCream} />
            <stop offset="80%" stopColor={faceCream} />
            <stop offset="100%" stopColor={faceShadow} />
          </radialGradient>

          <radialGradient id="earBeige" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={beigeHighlight} />
            <stop offset="70%" stopColor={beigeBase} />
            <stop offset="100%" stopColor={beigeShadow} />
          </radialGradient>
        </defs>

        {/* 1. Curved Tail (Beige) */}
        <path
          d="M 145 174 C 172 185 198 178 206 160 C 212 142 202 134 195 137 C 188 140 192 152 183 161 C 168 173 150 170 145 174 Z"
          fill={beigeShadow}
          stroke={beigeBase}
          strokeWidth="1.2"
        />

        {/* 2. Smaller Beige Ears without Pink Part (귀에 분홍 부분 삭제, 귀는 좀 더 작게) */}
        {/* Left Ear */}
        <circle cx="64" cy="106" r="15" fill="url(#earBeige)" />
        {/* Right Ear */}
        <circle cx="176" cy="106" r="15" fill="url(#earBeige)" />

        {/* 3. Small Chubby Body (Beige 통일) */}
        <ellipse cx="120" cy="166" rx="30" ry="26" fill="url(#beigeBody)" />

        {/* Two Stubby Cute Sitting Feet */}
        <ellipse cx="104" cy="182" rx="13" ry="14" fill="url(#beigeBody)" />
        <ellipse cx="136" cy="182" rx="13" ry="14" fill="url(#beigeBody)" />

        {/* Paws */}
        {mood === 'dodged' ? (
          <g>
            <ellipse cx="90" cy="156" rx="10" ry="8" fill="url(#beigeBody)" />
            <ellipse cx="150" cy="148" rx="10" ry="8" fill="url(#beigeBody)" />
            <text x="154" y="142" fontSize="14">✨</text>
          </g>
        ) : mood === 'eating_good' || isFever ? (
          <g>
            <ellipse cx="88" cy="146" rx="10" ry="9" fill="url(#beigeBody)" />
            <ellipse cx="152" cy="146" rx="10" ry="9" fill="url(#beigeBody)" />
          </g>
        ) : (
          <g>
            <ellipse cx="96" cy="160" rx="10" ry="8" fill="url(#beigeBody)" />
            <ellipse cx="144" cy="160" rx="10" ry="8" fill="url(#beigeBody)" />
          </g>
        )}

        {/* 4. BIGGER HEAD (머리 좀 더 크게: radius 54, 귀여운 대두 비율) */}
        <circle cx="120" cy="102" r="54" fill="url(#beigeHead)" />

        {/* 5. Cute Soft Cream Face Mask */}
        <path
          d="M 80 102 C 78 80 100 75 120 88 C 140 75 162 80 160 102 C 158 122 144 133 120 134 C 96 133 82 122 80 102 Z"
          fill="url(#facePatch)"
        />

        {/* 6. Cheeks: Solid Pink Blush without Gradient (햄홍조 그라데이션 x, 단색처리) */}
        {!isSoot && (
          <>
            <circle cx="92" cy="115" r="7" fill="#F472B6" />
            <circle cx="148" cy="115" r="7" fill="#F472B6" />
          </>
        )}

        {/* 7. Tiny Nose (코는 작게: small delicate dot) */}
        <ellipse cx="120" cy="108" rx="2.8" ry="2" fill="#2E1C12" />

        {/* 8. BIG EYES WITH 1 BIG & 1 SMALL WHITE REFLECTION (눈은 크게, 안광은 흰거 큰 거 하나 작은 거 하나) */}
        {isSoot ? (
          // Soot Dizzy Spiral Eyes
          <g>
            <path
              d="M 96 95 A 6 6 0 1 0 106 101 A 3 3 0 1 0 101 95"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 134 95 A 6 6 0 1 0 144 101 A 3 3 0 1 0 139 95"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'eating_good' ? (
          // Happy Squeezed Joyful Eyes ( ^ ‿ ^ )
          <g>
            <path
              d="M 93 98 Q 103 87 113 98"
              fill="none"
              stroke="#1C140E"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 127 98 Q 137 87 147 98"
              fill="none"
              stroke="#1C140E"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'dodged' ? (
          // One big shiny eye with 2 reflections + one cute wink
          <g>
            {/* Left Eye: Big Dark Eye with 1 Big + 1 Small Reflection */}
            <circle cx="102" cy="97" r="11" fill="#1C140E" />
            <circle cx="99" cy="93.5" r="4.2" fill="#FFFFFF" />
            <circle cx="105.5" cy="100.5" r="2" fill="#FFFFFF" />

            {/* Right Eye: Wink Arc */}
            <path
              d="M 127 98 Q 137 90 147 98"
              fill="none"
              stroke="#1C140E"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // Default & Mouth-Open: BIG SHINY EYES (안광: 큰 거 하나, 작은 거 하나)
          <g>
            {/* Left Big Eye */}
            <circle cx="102" cy="97" r="11" fill="#1C140E" />
            {/* Big reflection */}
            <circle cx="99" cy="93.5" r="4.2" fill="#FFFFFF" />
            {/* Small reflection */}
            <circle cx="105.5" cy="100.5" r="2" fill="#FFFFFF" />

            {/* Right Big Eye */}
            <circle cx="138" cy="97" r="11" fill="#1C140E" />
            {/* Big reflection */}
            <circle cx="135" cy="93.5" r="4.2" fill="#FFFFFF" />
            {/* Small reflection */}
            <circle cx="141.5" cy="100.5" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* 9. SMALL MOUTH (입은 작게: delicate cute mouth) */}
        {isSoot ? (
          // Wobbly charred mouth
          <path
            d="M 114 118 Q 117 115 120 118 Q 123 121 126 118"
            fill="none"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ) : mood === 'eating_good' ? (
          // Satisfied small chewing smile with a tiny banana crumb
          <g>
            <path
              d="M 114 116 Q 120 123 126 116"
              fill="#881337"
              stroke="#1C140E"
              strokeWidth="1.8"
            />
            <circle cx="129" cy="115" r="2.5" fill="#FACC15" />
          </g>
        ) : mood === 'mouth_open' ? (
          // Small open round mouth
          <g>
            <ellipse cx="120" cy="117" rx="5.5" ry="5" fill="#881337" stroke="#1C140E" strokeWidth="1.8" />
            <ellipse cx="120" cy="118.5" rx="3" ry="2.2" fill="#F43F5E" />
          </g>
        ) : (
          // Small cute sweet smile
          <path
            d="M 115 116 Q 120 121 125 116"
            fill="none"
            stroke="#1C140E"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
      </motion.svg>
    </div>
  );
};
