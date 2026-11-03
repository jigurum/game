/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import type {
  ItemType,
  GameState,
  GameStats,
  FloatingText,
  LeaderboardEntry,
  MonkeyMood,
} from './types/game';
import { soundEngine } from './utils/audio';
import { MonkeyCharacter } from './components/MonkeyCharacter';
import { EatingStage } from './components/EatingStage';
import { TouchGameControls } from './components/TouchGameControls';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TitleScreen } from './components/TitleScreen';
import { FloatingParticles } from './components/FloatingParticles';

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: '바나나대마왕', score: 4800, date: '2026.11.02', maxCombo: 38, bananasEaten: 42, tier: '전설의 바나나 킹 👑' },
  { id: '2', name: '정글타잔', score: 3650, date: '2026.11.01', maxCombo: 26, bananasEaten: 34, tier: '전설의 바나나 킹 👑' },
  { id: '3', name: '몽키셰프', score: 2800, date: '2026.10.30', maxCombo: 20, bananasEaten: 28, tier: '바나나 마스터 🍌' },
  { id: '4', name: '골든고릴라', score: 2150, date: '2026.10.28', maxCombo: 15, bananasEaten: 22, tier: '바나나 마스터 🍌' },
  { id: '5', name: '초보멍키', score: 1300, date: '2026.10.25', maxCombo: 9, bananasEaten: 14, tier: '정글 원숭이 대장 🐵' },
];

function getRandomItemType(): ItemType {
  const rand = Math.random();
  if (rand < 0.52) return 'banana';           // 52% Normal Banana
  if (rand < 0.65) return 'golden_banana';    // 13% Golden Banana (+300 pts)
  if (rand < 0.73) return 'ice_banana';       // 8% Ice Banana (+150 pts & slow)
  if (rand < 0.94) return 'bomb';             // 21% Bomb
  return 'mega_bomb';                         // 6% Mega Bomb
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('READY');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    bananasEaten: 0,
    goldenBananasEaten: 0,
    bombsAvoided: 0,
    bombsEaten: 0,
    missedBananas: 0,
  });

  // Current object waiting in slot until user acts, and upcoming preview
  const [currentItem, setCurrentItem] = useState<ItemType>('banana');
  const [nextItem, setNextItem] = useState<ItemType>('bomb');
  const [itemKey, setItemKey] = useState<number>(0);

  const [monkeyMood, setMonkeyMood] = useState<MonkeyMood>('idle');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [bgmActive, setBgmActive] = useState<boolean>(soundEngine.bgmEnabled);
  const [sfxActive, setSfxActive] = useState<boolean>(soundEngine.sfxEnabled);
  const [iceSlowUntil, setIceSlowUntil] = useState<number>(0);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('monkey_banana_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_LEADERBOARD;
  });

  const highScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.score), 0) : 0;
  const moodTimeoutRef = useRef<number | null>(null);

  // Helper to trigger monkey mood
  const triggerMonkeyMood = useCallback((mood: MonkeyMood, duration = 350) => {
    setMonkeyMood(mood);
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    moodTimeoutRef.current = window.setTimeout(() => {
      setMonkeyMood('idle');
    }, duration);
  }, []);

  // Helper to spawn floating score text
  const addFloatingText = useCallback((text: string, type: FloatingText['type']) => {
    const newText: FloatingText = {
      id: Math.random().toString(),
      text,
      type,
      x: 50 + (Math.random() - 0.5) * 14,
      y: 45 + (Math.random() - 0.5) * 8,
    };
    setFloatingTexts((prev) => [...prev.slice(-6), newText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 750);
  }, []);

  // Screen shake on bomb explosion
  const triggerScreenShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  }, []);

  // Speed / Frenzy progression multiplier
  const getSpeedMultiplier = useCallback(() => {
    const elapsed = 60 - timeLeft;
    if (elapsed > 45) return 2.0; // Frenzy in last 15s
    if (elapsed > 30) return 1.6;
    if (elapsed > 15) return 1.3;
    return 1.0;
  }, [timeLeft]);

  // Start Game
  const startGame = () => {
    setTimeLeft(60);
    setStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      bananasEaten: 0,
      goldenBananasEaten: 0,
      bombsAvoided: 0,
      bombsEaten: 0,
      missedBananas: 0,
    });
    setCurrentItem(getRandomItemType());
    setNextItem(getRandomItemType());
    setItemKey((k) => k + 1);
    setFloatingTexts([]);
    setIsNewRecord(false);
    setMonkeyMood('idle');
    setIceSlowUntil(0);
    setGameState('PLAYING');

    soundEngine.startBgm();
  };

  // End Game (Can be triggered by timeout or explicit "게임 종료" button)
  const endGame = useCallback(() => {
    setGameState('GAME_OVER');
    soundEngine.stopBgm();
    soundEngine.playGameOver();
  }, []);

  // 60-Second Countdown Timer
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }

        if (prev <= 10) {
          soundEngine.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  // High score record check on game over
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      if (stats.score > highScore && stats.score > 0) {
        setIsNewRecord(true);
      }
    }
  }, [gameState, stats.score, highScore]);

  // Advance to next object instantly without glide/travel motion
  const advanceToNextItem = () => {
    setCurrentItem(nextItem);
    setNextItem(getRandomItemType());
    setItemKey((k) => k + 1);
  };

  // ACTION: [먹기] (Eat) - Evaluates current item and instantly shows next!
  const handleEat = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const item = currentItem;

    if (item === 'bomb' || item === 'mega_bomb') {
      // OOPS! Ate a bomb!
      soundEngine.playBomb();
      triggerScreenShake();
      triggerMonkeyMood('eating_bad', 600);

      const penalty = item === 'mega_bomb' ? 300 : 150;
      addFloatingText(`-${penalty} 폭탄! 💥`, 'loss');

      setStats((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - penalty),
        combo: 0,
        bombsEaten: prev.bombsEaten + 1,
      }));
    } else {
      // DELICIOUS BANANA!
      soundEngine.playMunch();

      let points = 100;
      if (item === 'golden_banana') {
        points = 300;
        soundEngine.playGolden();
      } else if (item === 'ice_banana') {
        points = 150;
        soundEngine.playGolden();
        setIceSlowUntil(Date.now() + 4000);
      }

      setStats((prev) => {
        const nextCombo = prev.combo + 1;
        const maxCombo = Math.max(prev.maxCombo, nextCombo);
        const comboBonus = Math.min(nextCombo * 10, 200);
        const earned = points + comboBonus;

        if (nextCombo > 1 && nextCombo % 5 === 0) {
          soundEngine.playCombo(Math.floor(nextCombo / 5));
          addFloatingText(`🔥 ${nextCombo} COMBO!`, 'combo');
        } else {
          addFloatingText(`+${earned}`, 'gain');
        }

        return {
          ...prev,
          score: prev.score + earned,
          combo: nextCombo,
          maxCombo,
          bananasEaten: prev.bananasEaten + (item === 'banana' ? 1 : 0),
          goldenBananasEaten:
            prev.goldenBananasEaten + (item === 'golden_banana' || item === 'ice_banana' ? 1 : 0),
        };
      });

      triggerMonkeyMood('eating_good', 250);
    }

    // Instantly switch to next item!
    advanceToNextItem();
  }, [gameState, currentItem, nextItem, triggerMonkeyMood, triggerScreenShake, addFloatingText]);

  // ACTION: [안 먹기] (Don't Eat / Pass) - Evaluates current item and instantly shows next!
  const handlePass = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const item = currentItem;

    if (item === 'bomb' || item === 'mega_bomb') {
      // SAFE DEFENSE! Dodged the bomb!
      soundEngine.playWhoosh();
      triggerMonkeyMood('dodged', 350);

      const bonus = item === 'mega_bomb' ? 80 : 50;
      addFloatingText(`+${bonus} 회피 성공! 🛡️`, 'safe');

      setStats((prev) => {
        const nextCombo = prev.combo + 1;
        return {
          ...prev,
          score: prev.score + bonus,
          combo: nextCombo,
          maxCombo: Math.max(prev.maxCombo, nextCombo),
          bombsAvoided: prev.bombsAvoided + 1,
        };
      });
    } else {
      // Skipped a banana
      soundEngine.playWhoosh();
      triggerMonkeyMood('missed', 300);
      addFloatingText('바나나 패스 😢', 'miss');

      setStats((prev) => ({
        ...prev,
        combo: 0,
        missedBananas: prev.missedBananas + 1,
      }));
    }

    // Instantly switch to next item!
    advanceToNextItem();
  }, [gameState, currentItem, nextItem, triggerMonkeyMood, addFloatingText]);

  // Keyboard Shortcuts (Space / ArrowRight for Eat, ArrowLeft / A for Don't Eat)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleEat();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'Escape') {
        e.preventDefault();
        handlePass();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleEat, handlePass]);

  // Audio Toggles
  const handleToggleBgm = () => {
    const enabled = soundEngine.toggleBgm();
    setBgmActive(enabled);
  };

  const handleToggleSfx = () => {
    const enabled = soundEngine.toggleSfx();
    setSfxActive(enabled);
  };

  // Save score to leaderboard
  const handleSaveScore = (name: string) => {
    let tier = '아기 원숭이 🍼';
    if (stats.score >= 3500) tier = '전설의 바나나 킹 👑';
    else if (stats.score >= 2200) tier = '바나나 마스터 🍌';
    else if (stats.score >= 1300) tier = '정글 원숭이 대장 🐵';
    else if (stats.score >= 700) tier = '바나나 먹방 유망주 🌴';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const newEntry: LeaderboardEntry = {
      id: Math.random().toString(),
      name,
      score: stats.score,
      date: dateStr,
      maxCombo: stats.maxCombo,
      bananasEaten: stats.bananasEaten + stats.goldenBananasEaten,
      tier,
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updated);
    localStorage.setItem('monkey_banana_leaderboard', JSON.stringify(updated));
  };

  const handleClearLeaderboard = () => {
    if (window.confirm('랭킹 기록을 초기화하시겠습니까?')) {
      setLeaderboard([]);
      localStorage.removeItem('monkey_banana_leaderboard');
    }
  };

  const currentSpeed = getSpeedMultiplier();

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-emerald-950 via-stone-900 to-amber-950 text-white select-none overflow-x-hidden ${
        isShaking ? 'animate-[shake_0.3s_ease-in-out]' : ''
      }`}
    >
      {/* Background Soft 3D Cartoon Jungle Landscape */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Ambient Sunbeam */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-400/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="w-full h-full opacity-30">
          <defs>
            <linearGradient id="hillBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>

          {/* Distant Soft Rolling Hills */}
          <path d="M 0 450 Q 250 320 500 420 Q 750 300 1000 440 L 1000 800 L 0 800 Z" fill="url(#hillBack)" />

          {/* Near Soft Rolling Hills */}
          <path d="M 0 540 Q 300 440 650 530 Q 850 470 1000 550 L 1000 800 L 0 800 Z" fill="url(#hillFront)" />

          {/* Soft Fluffy Floating Cartoon Clouds */}
          <g fill="#FFFFFF" opacity="0.45">
            <path d="M 120 180 Q 150 140 190 160 Q 230 140 260 170 Q 280 190 260 210 Q 200 230 140 210 Q 110 200 120 180 Z" />
            <path d="M 720 140 Q 750 110 790 125 Q 825 105 855 130 Q 875 150 855 170 Q 800 185 745 170 Q 715 160 720 140 Z" />
          </g>
        </svg>
      </div>

      {/* Floating particles (scores, combos) */}
      <FloatingParticles items={floatingTexts} />

      {/* Title Screen View */}
      {gameState === 'READY' && (
        <TitleScreen
          onStart={startGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          bgmEnabled={bgmActive}
          sfxEnabled={sfxActive}
          onToggleBgm={handleToggleBgm}
          onToggleSfx={handleToggleSfx}
          highScore={highScore}
        />
      )}

      {/* Active Game Play View */}
      {gameState === 'PLAYING' && (
        <div className="w-full flex-1 flex flex-col justify-between max-w-xl mx-auto py-2 px-3">
          {/* Top Game HUD with "게임 종료" button */}
          <GameHUD
            timeLeft={timeLeft}
            score={stats.score}
            combo={stats.combo}
            speedMultiplier={currentSpeed}
            bgmEnabled={bgmActive}
            sfxEnabled={sfxActive}
            onToggleBgm={handleToggleBgm}
            onToggleSfx={handleToggleSfx}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onEndGame={endGame}
          />

          {/* Ice Slow Effect Notification */}
          {Date.now() < iceSlowUntil && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs font-bold text-cyan-300 flex items-center justify-center gap-1 my-0.5"
            >
              <span>❄️ 얼음 바나나 효과: 집중 시간!</span>
            </motion.div>
          )}

          {/* Central Play Arena: Cute Monkey Character + Eating Stage Pedestal */}
          <div className="relative w-full my-auto flex flex-col items-center">
            {/* Cute Low-Poly Monkey */}
            <div className="relative z-10 -mb-8 flex justify-center">
              <MonkeyCharacter mood={monkeyMood} combo={stats.combo} />
            </div>

            {/* Eating Stage: Holds item on dish until user presses [먹기] or [안 먹기] */}
            <EatingStage
              currentItem={currentItem}
              nextItem={nextItem}
              itemKey={itemKey}
              isFrenzy={currentSpeed >= 1.8}
            />

            {/* Keyboard Guide */}
            <div className="w-full flex items-center justify-between text-[11px] text-amber-200/60 px-3 mt-1.5">
              <span>← [안 먹기] 폭탄 방어</span>
              <span className="hidden sm:inline font-mono">단축키: [←/A] or [→/Space]</span>
              <span>[먹기] 바나나 냠냠 →</span>
            </div>
          </div>

          {/* Large Ergonomic Touch Controls */}
          <TouchGameControls
            onEat={handleEat}
            onPass={handlePass}
          />
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={stats}
          isNewRecord={isNewRecord}
          onRestart={startGame}
          onGoHome={() => setGameState('READY')}
          onSaveScore={handleSaveScore}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          entries={leaderboard}
          onClose={() => setShowLeaderboard(false)}
          onClear={handleClearLeaderboard}
        />
      )}
    </div>
  );
}
