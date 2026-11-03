import React from 'react';
import { motion } from 'motion/react';
import { Trophy, X, Medal, Calendar, Flame } from 'lucide-react';
import type { LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
  onClear?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  onClose,
  onClear,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/85 to-stone-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl text-white relative flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">
                명예의 전당 (랭킹)
              </h2>
              <p className="text-xs text-amber-300/70">
                바나나 많이 먹기 최고 챔피언 순위
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ranking List */}
        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-2">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              아직 등록된 랭킹 기록이 없습니다.
            </div>
          ) : (
            entries.map((entry, index) => {
              const rank = index + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;

              return (
                <div
                  key={entry.id || index}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isTop1
                      ? 'bg-amber-500/20 border-yellow-400/60 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                      : isTop2
                      ? 'bg-slate-300/15 border-slate-300/50'
                      : isTop3
                      ? 'bg-amber-800/30 border-amber-700/50'
                      : 'bg-stone-900/60 border-stone-800'
                  }`}
                >
                  {/* Rank Icon + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex items-center justify-center font-black text-base">
                      {isTop1 ? (
                        <span className="text-2xl">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-2xl">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="text-stone-400 font-mono text-sm">{rank}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-white">
                        <span>{entry.name}</span>
                        {entry.tier && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-500/30 font-medium">
                            {entry.tier}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </span>
                        {entry.maxCombo > 0 && (
                          <span className="flex items-center gap-0.5 text-orange-400">
                            <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
                            {entry.maxCombo} combo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-lg sm:text-xl font-black font-mono tabular-nums ${
                      isTop1 ? 'text-yellow-300' : isTop2 ? 'text-slate-100' : isTop3 ? 'text-amber-300' : 'text-amber-100'
                    }`}>
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-amber-400/80 font-medium">점수</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1 text-[11px]">
            <Medal className="w-3.5 h-3.5 text-amber-400" />
            <span>최근 상위 10개 기록 보관</span>
          </div>

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              기록 초기화
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
