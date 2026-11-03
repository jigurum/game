export type ItemType = 'banana' | 'golden_banana' | 'ice_banana' | 'bomb' | 'mega_bomb';

export interface GameItem {
  id: string;
  type: ItemType;
  xPercent: number; // 0 (left at monkey) to 100 (spawn right)
  speed: number;    // travel speed % per second
  points: number;   // points on eat (negative for bomb)
  dodgePoints: number; // points gained if skipped/dodged safely
  resolved: boolean; // whether player took an action on it
  createdTime: number;
}

export type MonkeyMood = 
  | 'idle' 
  | 'mouth_open'
  | 'eating_good' 
  | 'eating_bad' 
  | 'dodged' 
  | 'missed' 
  | 'fever';

export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  bananasEaten: number;
  goldenBananasEaten: number;
  bombsAvoided: number;
  bombsEaten: number;
  missedBananas: number;
}

export interface FloatingText {
  id: string;
  text: string;
  type: 'gain' | 'loss' | 'combo' | 'safe' | 'miss';
  x: number;
  y: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  maxCombo: number;
  bananasEaten: number;
  tier: string;
}
