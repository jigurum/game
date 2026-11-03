import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Award, CheckCircle, AlertTriangle, Home } from 'lucide-react';
import type { GameStats } from '../types/game';
import { MonkeyCharacter } from './MonkeyCharacter';

interface GameOverModalProps {
  stats: GameStats;
  isNewRecord: boolean;
  onRestart: () => void;
  onGoHome: () => void;
  onSaveScore: (name: string) => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isNewRecord,
  onRestart,
  onGoHome,
  onSaveScore,
  onOpenLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('monkey_player_name') || '슈퍼멍키';
  });
  const [saved, setSaved] = useState(false);

  // Determine Rank Tier
  let tierTitle = '아기 원숭이 🍼';
  let tierBadge = 'bg-stone-500/20 text-stone-200 border-stone-500/40';

  if (stats.score >= 3000) {
    tierTitle = '전설의 바나나 킹 👑';
    tierBadge = 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
  } else if (stats.score >= 2000) {
    tierTitle = '바나나 마스터 🍌';
    tierBadge = 'bg-amber-400/20 text-amber-300 border-amber-400/50';
  } else if (stats.score >= 1200) {
    tierTitle = '정글 원숭이 대장 🐵';
    tierBadge = 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50';
  } else if (stats.score >= 600) {
    tierTitle = '바나나 먹방 유망주 🌴';
    tierBadge = 'bg-blue-400/20 text-blue-300 border-blue-400/50';
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || saved) return;
    localStorage.setItem('monkey_player_name', playerName.trim());
    onSaveScore(playerName.trim());
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/80 to-stone-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl text-white relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Unified In-Game Monkey Face */}
        <div className="text-center relative z-10 flex flex-col items-center">
          {/* Unified Monkey Face from the game! */}
          <div className="w-24 h-24 -mt-2 -mb-2 flex items-center justify-center">
            <MonkeyCharacter
              mood={stats.score >= 1200 ? 'eating_good' : 'idle'}
              combo={stats.score >= 2000 ? 10 : 0}
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight mt-1">
            시간 종료! 게임 오버
          </h2>

          {isNewRecord && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs my-1.5 shadow-lg"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>최고 신기록 달성!</span>
            </motion.div>
          )}

          {/* Tier Badge */}
          <div className="mt-1">
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${tierBadge}`}>
              {tierTitle}
            </span>
          </div>

          {/* Score Display */}
          <div className="w-full my-3 py-2.5 rounded-2xl bg-amber-950/50 border border-amber-700/40">
            <div className="text-xs font-medium text-amber-300">최종 점수</div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tabular-nums">
              {stats.score.toLocaleString()} <span className="text-base font-bold text-amber-400">점</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs my-2.5 bg-stone-950/40 p-2.5 rounded-2xl border border-stone-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-900/20">
            <span className="text-stone-300 flex items-center gap-1">
              <span>🍌</span> 바나나:
            </span>
            <span className="font-bold text-amber-300 font-mono">{stats.bananasEaten}개</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-900/20">
            <span className="text-stone-300 flex items-center gap-1">
              <span>⭐</span> 황금 바나나:
            </span>
            <span className="font-bold text-yellow-300 font-mono">{stats.goldenBananasEaten}개</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-900/20">
            <span className="text-stone-300 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 폭탄 회피:
            </span>
            <span className="font-bold text-emerald-300 font-mono">{stats.bombsAvoided}회</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-rose-900/20">
            <span className="text-stone-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> 폭탄 먹음:
            </span>
            <span className="font-bold text-rose-300 font-mono">{stats.bombsEaten}회</span>
          </div>

          <div className="col-span-2 flex items-center justify-between p-2 rounded-xl bg-stone-800/40">
            <span className="text-stone-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-orange-400" /> 최대 콤보:
            </span>
            <span className="font-bold text-orange-300 font-mono">{stats.maxCombo}연속</span>
          </div>
        </div>

        {/* Name Registration Form */}
        {!saved ? (
          <form onSubmit={handleSave} className="flex gap-2 my-2.5">
            <input
              type="text"
              maxLength={10}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="닉네임 입력 (최대 10자)"
              className="flex-1 bg-stone-900 border border-amber-600/50 rounded-xl px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shrink-0 cursor-pointer transition-colors"
            >
              기록 저장
            </button>
          </form>
        ) : (
          <div className="text-center text-xs font-semibold text-emerald-400 my-2">
            ✓ &ldquo;{playerName}&rdquo; 님의 점수가 랭킹에 등록되었습니다!
          </div>
        )}

        {/* Action Buttons: 다시 시작 + 홈으로 가기 + 랭킹 보기 */}
        <div className="flex flex-col gap-2 mt-3.5">
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>다시 시작</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onGoHome}
              className="py-2.5 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-100 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>홈으로 가기</span>
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="py-2.5 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-200 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>랭킹 보기</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
