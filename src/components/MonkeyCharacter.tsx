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

  // Unified Soft Beige Palette for the entire body
  const beigeBase = isSoot ? '#4B4643' : '#DBCBB6';
  const beigeShadow = isSoot ? '#363230' : '#C4B29B';
  const beigeHighlight = isSoot ? '#605A56' : '#EFE4D6';

  // Lighter cream tone for face patch
  const faceCream = isSoot ? '#706863' : '#F6F1E9';
  const faceShadow = isSoot ? '#544D49' : '#E8DFD3';

  return (
    <div className="relative w-56 h-52 sm:w-64 sm:h-56 flex items-center justify-center select-none">
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
        viewBox="0 0 240 220"
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

        {/* 1. Cute Smaller Tail (꼬리도 좀 작게) */}
        <path
          d="M 136 160 C 154 168 170 163 175 149 C 178 138 172 133 167 135 C 163 137 166 145 160 151 C 150 159 140 157 136 160 Z"
          fill={beigeShadow}
          stroke={beigeBase}
          strokeWidth="1.2"
        />

        {/* 2. Small Beige Ears on the sides of the wide head (귀는 좀 더 작게, 분홍 부분 없음) */}
        {/* Left Ear */}
        <circle cx="52" cy="98" r="13" fill="url(#earBeige)" />
        {/* Right Ear */}
        <circle cx="188" cy="98" r="13" fill="url(#earBeige)" />

        {/* 3. Significantly Smaller Cute Body (원숭이 몸을 더 작게 - 귀여운 대두/초소형 몸체 비율) */}
        <ellipse cx="120" cy="158" rx="20" ry="17" fill="url(#beigeBody)" />

        {/* Two Tiny Stubby Sitting Feet */}
        <ellipse cx="108" cy="170" rx="9" ry="10" fill="url(#beigeBody)" />
        <ellipse cx="132" cy="170" rx="9" ry="10" fill="url(#beigeBody)" />

        {/* Small Hands / Paws */}
        {mood === 'dodged' ? (
          <g>
            <ellipse cx="98" cy="152" rx="7" ry="6" fill="url(#beigeBody)" />
            <ellipse cx="144" cy="146" rx="7" ry="6" fill="url(#beigeBody)" />
            <text x="148" y="140" fontSize="13">✨</text>
          </g>
        ) : mood === 'eating_good' || isFever ? (
          <g>
            <ellipse cx="96" cy="144" rx="7" ry="6" fill="url(#beigeBody)" />
            <ellipse cx="144" cy="144" rx="7" ry="6" fill="url(#beigeBody)" />
          </g>
        ) : (
          <g>
            <ellipse cx="103" cy="155" rx="7" ry="6" fill="url(#beigeBody)" />
            <ellipse cx="137" cy="155" rx="7" ry="6" fill="url(#beigeBody)" />
          </g>
        )}

        {/* 4. WIDER HEAD (얼굴은 가로로 조금 더 길게: rx=64, ry=50) */}
        <ellipse cx="120" cy="98" rx="64" ry="50" fill="url(#beigeHead)" />

        {/* 5. WIDER CREAM FACE MASK (얼굴의 밝은 부분도 좀 더 길게: 가로로 확장) */}
        <path
          d="M 66 98 C 64 74 92 70 120 84 C 148 70 176 74 174 98 C 172 120 152 132 120 133 C 88 132 68 120 66 98 Z"
          fill="url(#facePatch)"
        />

        {/* 6. PASTEL PINK HORIZONTAL OVAL BLUSH (홍조는 가로로 긴 타원이고 색은 파스텔 분홍 #FBCFE8) */}
        {!isSoot && (
          <>
            <ellipse cx="82" cy="112" rx="9.5" ry="4.5" fill="#FBCFE8" />
            <ellipse cx="158" cy="112" rx="9.5" ry="4.5" fill="#FBCFE8" />
          </>
        )}

        {/* 7. Tiny Nose (코는 작게) */}
        <ellipse cx="120" cy="106" rx="2.5" ry="1.8" fill="#2E1C12" />

        {/* 8. WIDER EYE SPACING & ONLY ONE BIG REFLECTION (원숭이 눈 사이를 좀 더 멀게, 눈은 안광 작은 것 삭제) */}
        {isSoot ? (
          // Soot Dizzy Spiral Eyes (Wider Spacing: cx=94, cx=146)
          <g>
            <path
              d="M 88 94 A 6 6 0 1 0 98 100 A 3 3 0 1 0 93 94"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 142 94 A 6 6 0 1 0 152 100 A 3 3 0 1 0 147 94"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'eating_good' ? (
          // Happy Squeezed Joyful Eyes (Wider Spacing)
          <g>
            <path
              d="M 85 96 Q 94 85 103 96"
              fill="none"
              stroke="#1C140E"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
            <path
              d="M 137 96 Q 146 85 155 96"
              fill="none"
              stroke="#1C140E"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'dodged' ? (
          // One big shiny eye with single big reflection + one cute wink
          <g>
            {/* Left Eye: Big Dark Eye with ONLY ONE BIG reflection */}
            <circle cx="94" cy="95" r="10.5" fill="#1C140E" />
            <circle cx="91.5" cy="91.5" r="4.3" fill="#FFFFFF" />

            {/* Right Eye: Wink Arc */}
            <path
              d="M 137 96 Q 146 88 155 96"
              fill="none"
              stroke="#1C140E"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // Default & Mouth-Open: WIDER EYES WITH ONLY ONE BIG REFLECTION (작은 안광 삭제!)
          <g>
            {/* Left Big Eye (cx = 94) */}
            <circle cx="94" cy="95" r="10.5" fill="#1C140E" />
            {/* Only One Big Reflection */}
            <circle cx="91.5" cy="91.5" r="4.3" fill="#FFFFFF" />

            {/* Right Big Eye (cx = 146) */}
            <circle cx="146" cy="95" r="10.5" fill="#1C140E" />
            {/* Only One Big Reflection */}
            <circle cx="143.5" cy="91.5" r="4.3" fill="#FFFFFF" />
          </g>
        )}

        {/* 9. Small Mouth (입은 작게) */}
        {isSoot ? (
          <path
            d="M 115 116 Q 117.5 113 120 116 Q 122.5 119 125 116"
            fill="none"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : mood === 'eating_good' ? (
          <g>
            <path
              d="M 115 114 Q 120 120 125 114"
              fill="#881337"
              stroke="#1C140E"
              strokeWidth="1.8"
            />
            <circle cx="127" cy="113" r="2.2" fill="#FACC15" />
          </g>
        ) : mood === 'mouth_open' ? (
          <g>
            <ellipse cx="120" cy="115" rx="5" ry="4.5" fill="#881337" stroke="#1C140E" strokeWidth="1.8" />
            <ellipse cx="120" cy="116.5" rx="2.8" ry="2" fill="#F43F5E" />
          </g>
        ) : (
          <path
            d="M 115 114 Q 120 118 125 114"
            fill="none"
            stroke="#1C140E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
      </motion.svg>
    </div>
  );
};
