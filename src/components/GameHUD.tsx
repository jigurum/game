import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Music, Clock, Zap, Flame } from 'lucide-react';

interface GameHUDProps {
  timeLeft: number;
  score: number;
  combo: number;
  speedMultiplier: number;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onOpenLeaderboard: () => void;
  onEndGame: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  timeLeft,
  score,
  combo,
  speedMultiplier,
  bgmEnabled,
  sfxEnabled,
  onToggleBgm,
  onToggleSfx,
  onOpenLeaderboard,
  onEndGame,
}) => {
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 select-none">
      {/* Top Bar Status */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Score Box */}
        <div className="flex items-center gap-2 bg-amber-900/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-600/40 shadow-sm">
          <span className="text-xl">🍌</span>
          <div>
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              점수
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-100 font-mono tabular-nums leading-none">
              {score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Center: Timer Gauge */}
        <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border transition-all duration-300 ${
          isTimeCritical
            ? 'bg-rose-950/70 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
            : 'bg-emerald-950/50 border-emerald-600/40'
        }`}>
          <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isTimeCritical ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div className="text-center">
            <div className="text-[9px] sm:text-[10px] font-bold text-emerald-200/80 uppercase">남은 시간</div>
            <div className={`text-xl sm:text-2xl font-black font-mono tabular-nums leading-none ${
              isTimeCritical ? 'text-rose-300' : 'text-white'
            }`}>
              {timeLeft}초
            </div>
          </div>
        </div>

        {/* Right: Audio, Ranking & End Game Button */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onToggleBgm}
            title={bgmEnabled ? '배경음악 끄기' : '배경음악 켜기'}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              bgmEnabled
                ? 'bg-amber-500/30 border-amber-400 text-amber-200 hover:bg-amber-500/40'
                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            title={sfxEnabled ? '효과음 끄기' : '효과음 켜기'}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              sfxEnabled
                ? 'bg-amber-500/30 border-amber-400 text-amber-200 hover:bg-amber-500/40'
                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenLeaderboard}
            title="랭킹 보기"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>🏆</span>
            <span className="hidden sm:inline">랭킹</span>
          </button>

          {/* End Game Button (게임 종료) */}
          <button
            type="button"
            onClick={onEndGame}
            title="게임 종료"
            className="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/60 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <span>⏹</span>
            <span>종료</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Combo & Speed Multiplier */}
      <div className="flex items-center justify-between mt-2 px-1 text-xs">
        {/* Combo */}
        <div className="flex items-center gap-1.5">
          {combo > 1 ? (
            <motion.div
              key={combo}
              initial={{ scale: 0.8, y: 2 }}
              animate={{ scale: [1, 1.2, 1], y: 0 }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-white text-orange-200" />
              <span>{combo} COMBO!</span>
            </motion.div>
          ) : (
            <span className="text-amber-200/60 font-medium">콤보를 이어가세요!</span>
          )}
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-1 text-amber-200/90 font-medium bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-700/30">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>속도:</span>
          <span className="font-mono font-bold text-amber-300">
            {speedMultiplier.toFixed(1)}x
          </span>
          {speedMultiplier >= 1.8 && (
            <span className="text-orange-400 font-extrabold animate-pulse ml-0.5">FRENZY!</span>
          )}
        </div>
      </div>
    </div>
  );
};
