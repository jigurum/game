import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Sparkles, Volume2, Music } from 'lucide-react';
import { MonkeyCharacter } from './MonkeyCharacter';

interface TitleScreenProps {
  onStart: () => void;
  onOpenLeaderboard: () => void;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  highScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenLeaderboard,
  bgmEnabled,
  sfxEnabled,
  onToggleBgm,
  onToggleSfx,
  highScore,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-between min-h-[580px] p-4 text-white">
      {/* Top Bar with Audio Toggles & High Score */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>내 최고 기록:</span>
          <span className="font-mono text-white tabular-nums">{highScore.toLocaleString()}점</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleBgm}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              bgmEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title="BGM 토글"
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleSfx}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              sfxEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title="효과음 토글"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title Banner & Mascot */}
      <div className="flex flex-col items-center my-3 text-center">
        <motion.div
          animate={{ rotate: [-2, 2, -2], y: [-2, 2, -2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black mb-2 shadow-sm"
        >
          {/* Low-Poly Sparkle Icon */}
          <svg viewBox="0 0 16 16" className="w-4 h-4 fill-amber-300">
            <polygon points="8,1 10,6 15,8 10,10 8,15 6,10 1,8 6,6" />
          </svg>
          <span>30초 스릴 만점 바나나 먹방</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          몽키 바나나 패닉!
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 mt-1 font-medium">
          다가오는 바나나는 냠냠 먹고, 무시무시한 폭탄은 피해라!
        </p>

        {/* Mascot Centerpiece */}
        <div className="my-2">
          <MonkeyCharacter mood="idle" combo={0} />
        </div>
      </div>

      {/* Quick Rules Card - Smooth 3D Styled */}
      <div className="w-full bg-stone-900/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 space-y-2 text-xs shadow-xl">
        <div className="font-black text-amber-300 flex items-center gap-1.5 pb-1 border-b border-amber-800/40">
          <span>🎮 게임 조작 가이드</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Banana rule (Left Arrow) */}
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/50 flex items-start gap-2.5">
            <span className="text-3xl font-black text-amber-300">←</span>
            <div>
              <div className="font-black text-amber-300">왼쪽 [먹기] 화살표</div>
              <div className="text-[11px] text-stone-300 mt-0.5">
                바나나 먹으면 <span className="text-emerald-400 font-bold">+100점</span> & 콤보!
              </div>
            </div>
          </div>

          {/* Bomb rule (Right Arrow) */}
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-700/50 flex items-start gap-2.5">
            <span className="text-3xl font-black text-rose-300">→</span>
            <div>
              <div className="font-black text-rose-300">오른쪽 [안먹기] 화살표</div>
              <div className="text-[11px] text-stone-300 mt-0.5">
                폭탄 넘기면 <span className="text-emerald-400 font-bold">+50점</span>!<br />
                먹으면 <span className="text-rose-400 font-bold">-150점</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-amber-200/80 text-center pt-1 font-medium">
          ⚡ 30초 동안 점점 속도가 빨라져요! 집중해서 최고 기록에 도전하세요!
        </div>
      </div>

      {/* Bottom Start Actions */}
      <div className="w-full space-y-2.5 mt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 font-black text-xl flex items-center justify-center gap-2 shadow-[0_6px_0_#92400E] active:shadow-[0_2px_0_#92400E] active:translate-y-1 transition-all cursor-pointer"
        >
          <Play className="w-6 h-6 fill-stone-950 text-stone-950" />
          <span>게임 시작 (30초 도전!)</span>
        </motion.button>

        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="w-full py-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-800/80 border border-amber-600/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>명예의 전당 (랭킹 보기)</span>
        </button>
      </div>
    </div>
  );
};
