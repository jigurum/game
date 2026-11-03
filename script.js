/**
 * 몽키 바나나 패닉! - 바나나 많이 먹기 게임
 * Vanilla JavaScript (ES6+) Implementation for Direct GitHub Pages Deployment
 * No build tools required - works natively in any web browser!
 */

// ==========================================
// 1. Audio Engine (Web Audio API Synthesizer)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.step = 0;
    this.bgmEnabled = localStorage.getItem('monkey_bgm_enabled') !== 'false';
    this.sfxEnabled = localStorage.getItem('monkey_sfx_enabled') !== 'false';
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? 0.35 : 0;
      this.sfxGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmEnabled ? 0.18 : 0;
      this.bgmGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMunch() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(340, t);
    osc1.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    g1.gain.setValueAtTime(0.8, t);
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc1.connect(g1);
    g1.connect(this.sfxGain);
    osc1.start(t);
    osc1.stop(t + 0.08);

    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(500, t + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(260, t + 0.14);
    g2.gain.setValueAtTime(0.6, t + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    osc2.connect(g2);
    g2.connect(this.sfxGain);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.14);
  }

  playBomb() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.45);
    g.gain.setValueAtTime(1.0, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.45);

    const bufferSize = this.ctx.sampleRate * 0.35;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.35);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    whiteNoise.start(t);
  }

  playWhoosh() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.12);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playCombo(count) {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
    const note = scale[Math.min(count - 1, scale.length - 1)] || 523.25;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, t);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playGolden() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      g.gain.setValueAtTime(0.4, t + idx * 0.05);
      g.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.15);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.15);
    });
  }

  playTick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playGameOver() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      const start = t + i * 0.12;
      const dur = i === notes.length - 1 ? 0.6 : 0.2;
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.5, start);
      g.gain.exponentialRampToValueAtTime(0.01, start + dur);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  startBgm() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    const tempo = 136;
    const stepDuration = 60 / tempo / 2;

    const melodyNotes = [
      523.25, 0, 659.25, 783.99,
      880.00, 783.99, 659.25, 0,
      587.33, 0, 659.25, 587.33,
      523.25, 659.25, 783.99, 0
    ];
    const bassNotes = [
      261.63, 0, 261.63, 0,
      220.00, 0, 220.00, 0,
      174.61, 0, 174.61, 0,
      196.00, 0, 196.00, 0
    ];

    this.step = 0;
    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const currentStep = this.step % 16;

      const mFreq = melodyNotes[currentStep];
      if (mFreq > 0 && this.bgmEnabled) {
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'triangle';
        mOsc.frequency.setValueAtTime(mFreq, t);
        mGain.gain.setValueAtTime(0.2, t);
        mGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        mOsc.connect(mGain);
        mGain.connect(this.bgmGain);
        mOsc.start(t);
        mOsc.stop(t + 0.18);
      }

      const bFreq = bassNotes[currentStep];
      if (bFreq > 0 && this.bgmEnabled) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, t);
        bGain.gain.setValueAtTime(0.35, t);
        bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        bOsc.connect(bGain);
        bGain.connect(this.bgmGain);
        bOsc.start(t);
        bOsc.stop(t + 0.22);
      }

      if (this.bgmEnabled && (currentStep % 2 === 1 || currentStep === 4 || currentStep === 12)) {
        const pOsc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        pOsc.type = 'sine';
        pOsc.frequency.setValueAtTime(currentStep % 4 === 2 ? 800 : 1200, t);
        pGain.gain.setValueAtTime(0.08, t);
        pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        pOsc.connect(pGain);
        pGain.connect(this.bgmGain);
        pOsc.start(t);
        pOsc.stop(t + 0.04);
      }

      this.step++;
    };

    this.bgmTimer = window.setInterval(playStep, stepDuration * 1000);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    localStorage.setItem('monkey_bgm_enabled', String(this.bgmEnabled));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? 0.18 : 0, this.ctx.currentTime);
    }
    if (this.bgmEnabled && !this.isBgmPlaying) {
      this.startBgm();
    }
    return this.bgmEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('monkey_sfx_enabled', String(this.sfxEnabled));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.35 : 0, this.ctx.currentTime);
    }
    return this.sfxEnabled;
  }
}

const soundEngine = new SoundEngine();

// ==========================================
// 2. Default Leaderboard & Persistence
// ==========================================
const DEFAULT_LEADERBOARD = [
  { id: '1', name: '바나나대마왕', score: 4800, date: '2026.11.02', maxCombo: 38, bananasEaten: 42, tier: '전설의 바나나 킹 👑' },
  { id: '2', name: '정글타잔', score: 3650, date: '2026.11.01', maxCombo: 26, bananasEaten: 34, tier: '전설의 바나나 킹 👑' },
  { id: '3', name: '몽키셰프', score: 2800, date: '2026.10.30', maxCombo: 20, bananasEaten: 28, tier: '바나나 마스터 🍌' },
  { id: '4', name: '골든고릴라', score: 2150, date: '2026.10.28', maxCombo: 15, bananasEaten: 22, tier: '바나나 마스터 🍌' },
  { id: '5', name: '초보멍키', score: 1300, date: '2026.10.25', maxCombo: 9, bananasEaten: 14, tier: '정글 원숭이 대장 🐵' },
];

function getLeaderboard() {
  try {
    const saved = localStorage.getItem('monkey_banana_leaderboard');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // fallback
  }
  return DEFAULT_LEADERBOARD;
}

function saveLeaderboard(list) {
  try {
    localStorage.setItem('monkey_banana_leaderboard', JSON.stringify(list));
  } catch (e) {}
}

// ==========================================
// 3. SVG Character and Object Generators
// ==========================================
function renderMonkeySvg(mood, combo) {
  const isFever = combo >= 8 || mood === 'fever';
  const isSoot = mood === 'eating_bad';

  const beigeBase = isSoot ? '#4B4643' : '#DBCBB6';
  const beigeShadow = isSoot ? '#363230' : '#C4B29B';
  const beigeHighlight = isSoot ? '#605A56' : '#EFE4D6';
  const faceCream = isSoot ? '#706863' : '#F6F1E9';
  const faceShadow = isSoot ? '#544D49' : '#E8DFD3';

  let eyeHtml = '';
  if (isSoot) {
    eyeHtml = `
      <path d="M 88 94 A 6 6 0 1 0 98 100 A 3 3 0 1 0 93 94" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 142 94 A 6 6 0 1 0 152 100 A 3 3 0 1 0 147 94" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (mood === 'eating_good') {
    eyeHtml = `
      <path d="M 85 96 Q 94 85 103 96" fill="none" stroke="#1C140E" stroke-width="3.8" stroke-linecap="round" />
      <path d="M 137 96 Q 146 85 155 96" fill="none" stroke="#1C140E" stroke-width="3.8" stroke-linecap="round" />
    `;
  } else if (mood === 'dodged') {
    eyeHtml = `
      <circle cx="94" cy="95" r="10.5" fill="#1C140E" />
      <circle cx="91.5" cy="91.5" r="4.3" fill="#FFFFFF" />
      <path d="M 137 96 Q 146 88 155 96" fill="none" stroke="#1C140E" stroke-width="3.6" stroke-linecap="round" />
    `;
  } else {
    // Default & mouth_open: Wider eyes with single big reflection dot!
    eyeHtml = `
      <circle cx="94" cy="95" r="10.5" fill="#1C140E" />
      <circle cx="91.5" cy="91.5" r="4.3" fill="#FFFFFF" />
      <circle cx="146" cy="95" r="10.5" fill="#1C140E" />
      <circle cx="143.5" cy="91.5" r="4.3" fill="#FFFFFF" />
    `;
  }

  let mouthHtml = '';
  if (isSoot) {
    mouthHtml = `<path d="M 115 116 Q 117.5 113 120 116 Q 122.5 119 125 116" fill="none" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />`;
  } else if (mood === 'eating_good') {
    mouthHtml = `
      <path d="M 115 114 Q 120 120 125 114" fill="#881337" stroke="#1C140E" stroke-width="1.8" />
      <circle cx="127" cy="113" r="2.2" fill="#FACC15" />
    `;
  } else if (mood === 'mouth_open') {
    mouthHtml = `
      <ellipse cx="120" cy="115" rx="5" ry="4.5" fill="#881337" stroke="#1C140E" stroke-width="1.8" />
      <ellipse cx="120" cy="116.5" rx="2.8" ry="2" fill="#F43F5E" />
    `;
  } else {
    mouthHtml = `<path d="M 115 114 Q 120 118 125 114" fill="none" stroke="#1C140E" stroke-width="2.2" stroke-linecap="round" />`;
  }

  let pawsHtml = '';
  if (mood === 'dodged') {
    pawsHtml = `
      <ellipse cx="98" cy="152" rx="7" ry="6" fill="url(#mBeigeBody)" />
      <ellipse cx="144" cy="146" rx="7" ry="6" fill="url(#mBeigeBody)" />
      <text x="148" y="140" font-size="13">✨</text>
    `;
  } else if (mood === 'eating_good' || isFever) {
    pawsHtml = `
      <ellipse cx="96" cy="144" rx="7" ry="6" fill="url(#mBeigeBody)" />
      <ellipse cx="144" cy="144" rx="7" ry="6" fill="url(#mBeigeBody)" />
    `;
  } else {
    pawsHtml = `
      <ellipse cx="103" cy="155" rx="7" ry="6" fill="url(#mBeigeBody)" />
      <ellipse cx="137" cy="155" rx="7" ry="6" fill="url(#mBeigeBody)" />
    `;
  }

  const smokeBadge = isSoot ? `
    <div class="absolute -top-4 z-30 pointer-events-none flex items-center gap-1 animate-bounce">
      <span class="text-2xl">💥</span>
      <span class="text-xl">💨</span>
    </div>
  ` : '';

  const feverGlow = isFever ? `
    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 to-yellow-300/30 blur-2xl -z-10 animate-pulse pointer-events-none"></div>
  ` : '';

  return `
    <div class="relative w-56 h-52 sm:w-64 sm:h-56 flex items-center justify-center select-none">
      ${feverGlow}
      ${smokeBadge}
      <svg viewBox="0 0 240 220" class="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] ${mood === 'eating_bad' ? 'animate-wiggle' : 'animate-breathing'}">
        <defs>
          <radialGradient id="mBeigeHead" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="${beigeHighlight}" />
            <stop offset="60%" stop-color="${beigeBase}" />
            <stop offset="100%" stop-color="${beigeShadow}" />
          </radialGradient>
          <radialGradient id="mBeigeBody" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="${beigeHighlight}" />
            <stop offset="65%" stop-color="${beigeBase}" />
            <stop offset="100%" stop-color="${beigeShadow}" />
          </radialGradient>
          <radialGradient id="mFacePatch" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stop-color="${faceCream}" />
            <stop offset="80%" stop-color="${faceCream}" />
            <stop offset="100%" stop-color="${faceShadow}" />
          </radialGradient>
          <radialGradient id="mEarBeige" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="${beigeHighlight}" />
            <stop offset="70%" stop-color="${beigeBase}" />
            <stop offset="100%" stop-color="${beigeShadow}" />
          </radialGradient>
        </defs>

        <!-- Tail (Smaller) -->
        <path d="M 136 160 C 154 168 170 163 175 149 C 178 138 172 133 167 135 C 163 137 166 145 160 151 C 150 159 140 157 136 160 Z" fill="${beigeShadow}" stroke="${beigeBase}" stroke-width="1.2" />

        <!-- Ears (Smaller, Beige) -->
        <circle cx="52" cy="98" r="13" fill="url(#mEarBeige)" />
        <circle cx="188" cy="98" r="13" fill="url(#mEarBeige)" />

        <!-- Body (Small Chibi) -->
        <ellipse cx="120" cy="158" rx="20" ry="17" fill="url(#mBeigeBody)" />
        <ellipse cx="108" cy="170" rx="9" ry="10" fill="url(#mBeigeBody)" />
        <ellipse cx="132" cy="170" rx="9" ry="10" fill="url(#mBeigeBody)" />
        ${pawsHtml}

        <!-- Wider Head (rx=64, ry=50) -->
        <ellipse cx="120" cy="98" rx="64" ry="50" fill="url(#mBeigeHead)" />

        <!-- Wider Cream Face Mask -->
        <path d="M 66 98 C 64 74 92 70 120 84 C 148 70 176 74 174 98 C 172 120 152 132 120 133 C 88 132 68 120 66 98 Z" fill="url(#mFacePatch)" />

        <!-- Pastel Pink Horizontal Oval Blush -->
        ${!isSoot ? `
          <ellipse cx="82" cy="112" rx="9.5" ry="4.5" fill="#FBCFE8" />
          <ellipse cx="158" cy="112" rx="9.5" ry="4.5" fill="#FBCFE8" />
        ` : ''}

        <!-- Tiny Nose -->
        <ellipse cx="120" cy="106" rx="2.5" ry="1.8" fill="#2E1C12" />

        <!-- Eyes & Mouth -->
        ${eyeHtml}
        ${mouthHtml}
      </svg>
    </div>
  `;
}

function renderItemSvg(type) {
  switch (type) {
    case 'banana':
      return `
        <div class="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.4)]">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <radialGradient id="b3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#FEF9C3" />
                <stop offset="45%" stop-color="#FACC15" />
                <stop offset="85%" stop-color="#EAB308" />
                <stop offset="100%" stop-color="#CA8A04" />
              </radialGradient>
              <linearGradient id="bStem3D" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#84CC16" />
                <stop offset="50%" stop-color="#65A30D" />
                <stop offset="100%" stop-color="#3F6212" />
              </linearGradient>
            </defs>
            <path d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z" fill="url(#b3DGloss)" stroke="#B45309" stroke-width="2.5" />
            <path d="M 36 26 C 46 22, 66 28, 76 48 C 78 54, 76 58, 73 54 C 65 36, 48 30, 36 26 Z" fill="#FFFFFF" opacity="0.45" />
            <path d="M 28 24 C 24 18, 20 16, 17 19 C 15 22, 19 26, 23 26 Z" fill="url(#bStem3D)" stroke="#365314" stroke-width="1.5" />
            <circle cx="17" cy="19" r="2.5" fill="#4D7C0F" />
            <circle cx="62" cy="85" r="3" fill="#713F12" />
            <ellipse cx="50" cy="58" rx="5.5" ry="3" fill="#FBCFE8" />
            <ellipse cx="72" cy="62" rx="5.5" ry="3" fill="#FBCFE8" />
            <circle cx="56" cy="52" r="5.5" fill="#1C140E" />
            <circle cx="54.5" cy="50" r="2.4" fill="#FFFFFF" />
            <circle cx="68" cy="54" r="5.5" fill="#1C140E" />
            <circle cx="66.5" cy="52" r="2.4" fill="#FFFFFF" />
            <path d="M 60 59 Q 62.5 62 65 59" fill="none" stroke="#713F12" stroke-width="1.8" stroke-linecap="round" />
            <polygon points="46,40 48,36 50,40 54,41 51,43 52,47 48,44 44,47 45,43 42,41" fill="#3B82F6" />
          </svg>
        </div>
      `;
    case 'golden_banana':
      return `
        <div class="w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(250,204,21,0.9)]">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <radialGradient id="g3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#FFFBEB" />
                <stop offset="35%" stop-color="#FEF08A" />
                <stop offset="70%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#B45309" />
              </radialGradient>
            </defs>
            <path d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z" fill="url(#g3DGloss)" stroke="#D97706" stroke-width="2.8" />
            <path d="M 28 24 C 24 18, 20 16, 17 19 C 15 22, 19 26, 23 26 Z" fill="#F59E0B" stroke="#92400E" stroke-width="1.5" />
            <ellipse cx="50" cy="58" rx="5.5" ry="3" fill="#FBCFE8" />
            <ellipse cx="72" cy="62" rx="5.5" ry="3" fill="#FBCFE8" />
            <circle cx="56" cy="52" r="5.5" fill="#2E1605" />
            <circle cx="54.5" cy="50" r="2.4" fill="#FFFFFF" />
            <circle cx="68" cy="54" r="5.5" fill="#2E1605" />
            <circle cx="66.5" cy="52" r="2.4" fill="#FFFFFF" />
            <path d="M 60 59 Q 62.5 62.5 65 59" fill="none" stroke="#78350F" stroke-width="1.8" stroke-linecap="round" />
            <text x="74" y="28" font-size="14" fill="#FFFFFF">✨</text>
            <text x="24" y="80" font-size="14" fill="#FFFFFF">✨</text>
          </svg>
        </div>
      `;
    case 'ice_banana':
      return `
        <div class="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(56,189,248,0.9)]">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <radialGradient id="i3DGloss" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="40%" stop-color="#BAE6FD" />
                <stop offset="75%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#0284C7" />
              </radialGradient>
            </defs>
            <path d="M 28 24 C 42 16, 70 24, 82 50 C 90 66, 82 82, 62 86 C 48 89, 40 80, 44 68 C 48 52, 34 38, 28 24 Z" fill="url(#i3DGloss)" stroke="#0369A1" stroke-width="2.5" />
            <ellipse cx="50" cy="58" rx="5.5" ry="3" fill="#FBCFE8" />
            <ellipse cx="72" cy="62" rx="5.5" ry="3" fill="#FBCFE8" />
            <circle cx="56" cy="52" r="5.5" fill="#0C4A6E" />
            <circle cx="54.5" cy="50" r="2.4" fill="#FFFFFF" />
            <circle cx="68" cy="54" r="5.5" fill="#0C4A6E" />
            <circle cx="66.5" cy="52" r="2.4" fill="#FFFFFF" />
            <path d="M 60 60 Q 62.5 63 65 60" fill="none" stroke="#0C4A6E" stroke-width="1.8" stroke-linecap="round" />
            <text x="32" y="44" font-size="14">❄️</text>
          </svg>
        </div>
      `;
    case 'bomb':
      return `
        <div class="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.6)]">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <radialGradient id="bombGloss" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#94A3B8" />
                <stop offset="35%" stop-color="#475569" />
                <stop offset="75%" stop-color="#1E293B" />
                <stop offset="100%" stop-color="#090D16" />
              </radialGradient>
              <linearGradient id="bNeck" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FBBF24" />
                <stop offset="100%" stop-color="#B45309" />
              </linearGradient>
            </defs>
            <path d="M 50 30 Q 56 16 66 18" fill="none" stroke="#D97706" stroke-width="3.5" stroke-linecap="round" />
            <circle cx="68" cy="18" r="5" fill="#EF4444" class="animate-ping" />
            <polygon points="68,12 70,16 74,18 70,20 68,24 66,20 62,18 66,16" fill="#FACC15" />
            <rect x="42" y="28" width="16" height="7" rx="3" fill="url(#bNeck)" />
            <circle cx="50" cy="58" r="32" fill="url(#bombGloss)" />
            <ellipse cx="38" cy="42" rx="10" ry="6" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 38 42)" />
            <ellipse cx="36" cy="64" rx="5.5" ry="3" fill="#FBCFE8" />
            <ellipse cx="64" cy="64" rx="5.5" ry="3" fill="#FBCFE8" />
            <circle cx="42" cy="56" r="6" fill="#0F172A" />
            <circle cx="40.5" cy="53.8" r="2.6" fill="#FFFFFF" />
            <circle cx="58" cy="56" r="6" fill="#0F172A" />
            <circle cx="56.5" cy="53.8" r="2.6" fill="#FFFFFF" />
            <path d="M 48 64 Q 50 66.5 52 64" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" />
            <ellipse cx="40" cy="88" rx="6" ry="4" fill="#E11D48" />
            <ellipse cx="60" cy="88" rx="6" ry="4" fill="#E11D48" />
          </svg>
        </div>
      `;
    case 'mega_bomb':
      return `
        <div class="w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(239,68,68,0.9)]">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <radialGradient id="megaGloss" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#FCA5A5" />
                <stop offset="40%" stop-color="#EF4444" />
                <stop offset="75%" stop-color="#991B1B" />
                <stop offset="100%" stop-color="#450A0A" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="18" r="8" fill="#DC2626" />
            <circle cx="50" cy="94" r="8" fill="#991B1B" />
            <circle cx="12" cy="56" r="8" fill="#DC2626" />
            <circle cx="88" cy="56" r="8" fill="#DC2626" />
            <path d="M 50 26 Q 58 12 68 14" fill="none" stroke="#EA580C" stroke-width="4" stroke-linecap="round" />
            <circle cx="70" cy="14" r="5" fill="#EF4444" class="animate-ping" />
            <polygon points="70,8 72,12 76,14 72,16 70,20 68,16 64,14 68,12" fill="#FEF08A" />
            <circle cx="50" cy="56" r="34" fill="url(#megaGloss)" />
            <ellipse cx="38" cy="38" rx="10" ry="6" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 38 38)" />
            <ellipse cx="34" cy="62" rx="5" ry="3" fill="#FECDD3" />
            <ellipse cx="66" cy="62" rx="5" ry="3" fill="#FECDD3" />
            <circle cx="42" cy="54" r="5.5" fill="#1C0505" />
            <circle cx="40.5" cy="52" r="2.4" fill="#FFFFFF" />
            <circle cx="58" cy="54" r="5.5" fill="#1C0505" />
            <circle cx="56.5" cy="52" r="2.4" fill="#FFFFFF" />
            <ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="#FFFFFF" />
            <circle cx="50" cy="40" r="5" fill="#FFFFFF" />
            <circle cx="48" cy="39" r="1.2" fill="#991B1B" />
            <circle cx="52" cy="39" r="1.2" fill="#991B1B" />
          </svg>
        </div>
      `;
    default:
      return '';
  }
}

function getRandomItemType() {
  const rand = Math.random();
  if (rand < 0.52) return 'banana';
  if (rand < 0.65) return 'golden_banana';
  if (rand < 0.73) return 'ice_banana';
  if (rand < 0.94) return 'bomb';
  return 'mega_bomb';
}

// ==========================================
// 4. Game State & Logic Controller
// ==========================================
class BananaGame {
  constructor() {
    this.appEl = document.getElementById('app');
    this.gameState = 'READY'; // READY, PLAYING, GAME_OVER
    this.timeLeft = 30;
    this.timer = null;
    this.stats = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      bananasEaten: 0,
      goldenBananasEaten: 0,
      bombsAvoided: 0,
      bombsEaten: 0,
      missedBananas: 0,
    };
    this.currentItem = 'banana';
    this.nextItem = 'bomb';
    this.monkeyMood = 'idle';
    this.moodTimer = null;
    this.iceSlowUntil = 0;
    this.isShaking = false;
    this.showLeaderboard = false;
    this.leaderboard = getLeaderboard();

    this.bindEvents();
    this.render();
  }

  getHighScore() {
    return this.leaderboard.length > 0 ? Math.max(...this.leaderboard.map(e => e.score), 0) : 0;
  }

  getSpeedMultiplier() {
    const elapsed = 30 - this.timeLeft;
    if (elapsed > 20) return 2.0;
    if (elapsed > 10) return 1.5;
    return 1.0;
  }

  triggerMonkeyMood(mood, duration = 350) {
    this.monkeyMood = mood;
    if (this.moodTimer) clearTimeout(this.moodTimer);
    this.updateMonkey();
    this.moodTimer = setTimeout(() => {
      this.monkeyMood = 'idle';
      this.updateMonkey();
    }, duration);
  }

  triggerHaptic(ms = 25) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  triggerScreenShake() {
    const arena = document.getElementById('game-arena-wrapper');
    if (arena) {
      arena.classList.add('animate-shake');
      setTimeout(() => arena.classList.remove('animate-shake'), 300);
    }
  }

  addFloatingText(text, type = 'gain') {
    const container = document.getElementById('floating-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'absolute select-none pointer-events-none whitespace-nowrap font-black transform -translate-x-1/2 -translate-y-1/2 animate-floatUp ';

    if (type === 'gain') {
      el.className += 'text-yellow-300 text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)]';
    } else if (type === 'loss') {
      el.className += 'text-rose-500 text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]';
    } else if (type === 'safe') {
      el.className += 'text-emerald-300 text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(16,185,129,0.8)]';
    } else if (type === 'combo') {
      el.className += 'text-orange-400 text-2xl sm:text-3xl drop-shadow-[0_2px_10px_rgba(249,115,22,0.9)]';
    } else {
      el.className += 'text-slate-400 text-base font-bold';
    }

    const randomX = 50 + (Math.random() - 0.5) * 16;
    const randomY = 46 + (Math.random() - 0.5) * 8;
    el.style.left = `${randomX}%`;
    el.style.top = `${randomY}%`;
    el.textContent = text;

    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 750);
  }

  startGame() {
    this.timeLeft = 30;
    this.stats = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      bananasEaten: 0,
      goldenBananasEaten: 0,
      bombsAvoided: 0,
      bombsEaten: 0,
      missedBananas: 0,
    };
    this.currentItem = getRandomItemType();
    this.nextItem = getRandomItemType();
    this.iceSlowUntil = 0;
    this.monkeyMood = 'idle';
    this.gameState = 'PLAYING';

    soundEngine.startBgm();

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.timeLeft <= 1) {
        clearInterval(this.timer);
        this.endGame();
        return;
      }
      this.timeLeft--;
      if (this.timeLeft <= 10) {
        soundEngine.playTick();
      }
      this.updateHUD();
    }, 1000);

    this.render();
  }

  endGame() {
    if (this.timer) clearInterval(this.timer);
    this.gameState = 'GAME_OVER';
    soundEngine.stopBgm();
    soundEngine.playGameOver();
    this.render();
  }

  onEat() {
    if (this.gameState !== 'PLAYING') return;
    this.triggerHaptic(25);
    const item = this.currentItem;

    if (item === 'bomb' || item === 'mega_bomb') {
      soundEngine.playBomb();
      this.triggerScreenShake();
      this.triggerMonkeyMood('eating_bad', 600);

      const penalty = item === 'mega_bomb' ? 300 : 150;
      this.addFloatingText(`-${penalty} 폭탄! 💥`, 'loss');

      this.stats.score = Math.max(0, this.stats.score - penalty);
      this.stats.combo = 0;
      this.stats.bombsEaten++;
    } else {
      soundEngine.playMunch();

      let points = 100;
      if (item === 'golden_banana') {
        points = 300;
        soundEngine.playGolden();
      } else if (item === 'ice_banana') {
        points = 150;
        soundEngine.playGolden();
        this.iceSlowUntil = Date.now() + 4000;
      }

      this.stats.combo++;
      this.stats.maxCombo = Math.max(this.stats.maxCombo, this.stats.combo);
      const comboBonus = Math.min(this.stats.combo * 10, 200);
      const earned = points + comboBonus;

      if (this.stats.combo > 1 && this.stats.combo % 5 === 0) {
        soundEngine.playCombo(Math.floor(this.stats.combo / 5));
        this.addFloatingText(`🔥 ${this.stats.combo} COMBO!`, 'combo');
      } else {
        this.addFloatingText(`+${earned}`, 'gain');
      }

      this.stats.score += earned;
      if (item === 'banana') this.stats.bananasEaten++;
      else this.stats.goldenBananasEaten++;

      this.triggerMonkeyMood('eating_good', 250);
    }

    // Instantly advance to next item!
    this.currentItem = this.nextItem;
    this.nextItem = getRandomItemType();
    this.updateStage();
    this.updateHUD();
  }

  onPass() {
    if (this.gameState !== 'PLAYING') return;
    this.triggerHaptic(25);
    const item = this.currentItem;

    if (item === 'bomb' || item === 'mega_bomb') {
      soundEngine.playWhoosh();
      this.triggerMonkeyMood('dodged', 350);

      const bonus = item === 'mega_bomb' ? 80 : 50;
      this.addFloatingText(`+${bonus} 회피 성공! 🛡️`, 'safe');

      this.stats.combo++;
      this.stats.maxCombo = Math.max(this.stats.maxCombo, this.stats.combo);
      this.stats.score += bonus;
      this.stats.bombsAvoided++;
    } else {
      soundEngine.playWhoosh();
      this.triggerMonkeyMood('missed', 300);
      this.addFloatingText('바나나 패스 😢', 'miss');

      this.stats.combo = 0;
      this.stats.missedBananas++;
    }

    // Instantly advance to next item!
    this.currentItem = this.nextItem;
    this.nextItem = getRandomItemType();
    this.updateStage();
    this.updateHUD();
  }

  savePlayerScore(name) {
    let tier = '아기 원숭이 🍼';
    if (this.stats.score >= 3500) tier = '전설의 바나나 킹 👑';
    else if (this.stats.score >= 2200) tier = '바나나 마스터 🍌';
    else if (this.stats.score >= 1300) tier = '정글 원숭이 대장 🐵';
    else if (this.stats.score >= 700) tier = '바나나 먹방 유망주 🌴';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const newEntry = {
      id: Math.random().toString(),
      name: name.trim() || '슈퍼멍키',
      score: this.stats.score,
      date: dateStr,
      maxCombo: this.stats.maxCombo,
      bananasEaten: this.stats.bananasEaten + this.stats.goldenBananasEaten,
      tier,
    };

    this.leaderboard.push(newEntry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    saveLeaderboard(this.leaderboard);
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (this.gameState !== 'PLAYING') return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        this.onEat();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'Space' || e.code === 'Escape') {
        e.preventDefault();
        this.onPass();
      }
    });
  }

  updateMonkey() {
    const el = document.getElementById('monkey-container');
    if (el) {
      el.innerHTML = renderMonkeySvg(this.monkeyMood, this.stats.combo);
    }
  }

  updateStage() {
    const el = document.getElementById('stage-item-wrapper');
    const nextPreviewEl = document.getElementById('next-item-preview');
    const statusPromptEl = document.getElementById('status-prompt-badge');

    if (el) {
      el.innerHTML = renderItemSvg(this.currentItem);
    }
    if (nextPreviewEl) {
      let icon = '🍌';
      if (this.nextItem === 'golden_banana') icon = '⭐';
      else if (this.nextItem === 'ice_banana') icon = '❄️';
      else if (this.nextItem === 'bomb') icon = '💣';
      else if (this.nextItem === 'mega_bomb') icon = '☠️';
      nextPreviewEl.innerHTML = `<span class="text-base">${icon}</span>`;
    }
    if (statusPromptEl) {
      const isBomb = this.currentItem === 'bomb' || this.currentItem === 'mega_bomb';
      statusPromptEl.className = `px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border shadow-sm transition-colors ${
        isBomb ? 'bg-rose-500/25 text-rose-200 border-rose-400/50 animate-pulse' : 'bg-amber-400/25 text-amber-200 border-amber-400/50'
      }`;
      statusPromptEl.innerHTML = `
        <span class="text-base">${isBomb ? '💣' : '🍌'}</span>
        <span>${isBomb ? '폭탄이다! 오른쪽 [→] 로 안먹기!' : '바나나다! 왼쪽 [←] 로 먹기!'}</span>
      `;
    }
  }

  updateHUD() {
    const scoreVal = document.getElementById('hud-score-val');
    const timerVal = document.getElementById('hud-timer-val');
    const timerBox = document.getElementById('hud-timer-box');
    const comboVal = document.getElementById('hud-combo-val');
    const speedVal = document.getElementById('hud-speed-val');
    const iceNotice = document.getElementById('ice-banana-notice');

    if (scoreVal) scoreVal.textContent = this.stats.score.toLocaleString();
    if (timerVal) timerVal.textContent = `${this.timeLeft}초`;

    if (timerBox) {
      if (this.timeLeft <= 10) {
        timerBox.className = 'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border transition-all duration-300 bg-rose-950/70 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse text-rose-300';
      } else {
        timerBox.className = 'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border transition-all duration-300 bg-emerald-950/50 border-emerald-600/40 text-white';
      }
    }

    if (comboVal) {
      if (this.stats.combo > 1) {
        comboVal.innerHTML = `
          <div class="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-sm">
            <span>🔥</span>
            <span>${this.stats.combo} COMBO!</span>
          </div>
        `;
      } else {
        comboVal.innerHTML = `<span class="text-amber-200/60 font-medium">콤보를 이어가세요!</span>`;
      }
    }

    if (speedVal) {
      const speed = this.getSpeedMultiplier();
      speedVal.textContent = `${speed.toFixed(1)}x`;
    }

    if (iceNotice) {
      if (Date.now() < this.iceSlowUntil) {
        iceNotice.classList.remove('hidden');
      } else {
        iceNotice.classList.add('hidden');
      }
    }
  }

  // ==========================================
  // 5. Main Render Loop
  // ==========================================
  render() {
    const highScore = this.getHighScore();

    let contentHtml = '';

    if (this.gameState === 'READY') {
      contentHtml = `
        <div class="w-full max-w-lg mx-auto flex flex-col items-center justify-between min-h-[580px] p-4 text-white">
          <!-- Top Bar -->
          <div class="w-full flex items-center justify-between">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <span>🏆</span>
              <span>내 최고 기록:</span>
              <span class="font-mono text-white tabular-nums">${highScore.toLocaleString()}점</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button id="btn-toggle-bgm" class="p-2 rounded-xl border transition-colors cursor-pointer ${soundEngine.bgmEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'}">
                🎵
              </button>
              <button id="btn-toggle-sfx" class="p-2 rounded-xl border transition-colors cursor-pointer ${soundEngine.sfxEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'}">
                🔊
              </button>
            </div>
          </div>

          <!-- Main Title & Mascot -->
          <div class="flex flex-col items-center my-3 text-center">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black mb-2 shadow-sm">
              <span>✨</span>
              <span>30초 스릴 만점 바나나 먹방 아케이드</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              몽키 바나나 패닉!
            </h1>
            <p class="text-xs sm:text-sm text-amber-200/90 mt-1 font-medium">
              다가오는 바나나는 냠냠 먹고, 무시무시한 폭탄은 피해라!
            </p>

            <div class="my-2">
              ${renderMonkeySvg('idle', 0)}
            </div>
          </div>

          <!-- Quick Rules Card -->
          <div class="w-full bg-stone-900/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 space-y-2 text-xs shadow-xl">
            <div class="font-black text-amber-300 flex items-center gap-1.5 pb-1 border-b border-amber-800/40">
              <span>🎮 게임 조작 가이드</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/50 flex items-start gap-2.5">
                <span class="text-3xl font-black text-amber-300">←</span>
                <div>
                  <div class="font-black text-amber-300">왼쪽 [먹기] 화살표</div>
                  <div class="text-[11px] text-stone-300 mt-0.5">
                    바나나 먹으면 <span class="text-emerald-400 font-bold">+100점</span> & 콤보!
                  </div>
                </div>
              </div>

              <div class="p-2.5 rounded-xl bg-rose-950/50 border border-rose-700/50 flex items-start gap-2.5">
                <span class="text-3xl font-black text-rose-300">→</span>
                <div>
                  <div class="font-black text-rose-300">오른쪽 [안먹기] 화살표</div>
                  <div class="text-[11px] text-stone-300 mt-0.5">
                    폭탄 넘기면 <span class="text-emerald-400 font-bold">+50점</span>!<br />
                    먹으면 <span class="text-rose-400 font-bold">-150점</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-[11px] text-amber-200/80 text-center pt-1 font-medium">
              ⚡ 30초 동안 점점 스피드업! 집중해서 최고 기록에 도전하세요!
            </div>
          </div>

          <!-- Start Actions -->
          <div class="w-full space-y-2.5 mt-4">
            <button id="btn-start-game" class="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 font-black text-xl flex items-center justify-center gap-2 shadow-[0_6px_0_#92400E] active:shadow-[0_2px_0_#92400E] active:translate-y-1 transition-all cursor-pointer">
              <span>▶</span>
              <span>게임 시작 (30초 도전!)</span>
            </button>

            <button id="btn-open-leaderboard" class="w-full py-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-800/80 border border-amber-600/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <span>🏆</span>
              <span>명예의 전당 (랭킹 보기)</span>
            </button>
          </div>
        </div>
      `;
    } else if (this.gameState === 'PLAYING') {
      const isBomb = this.currentItem === 'bomb' || this.currentItem === 'mega_bomb';
      let nextIcon = '🍌';
      if (this.nextItem === 'golden_banana') nextIcon = '⭐';
      else if (this.nextItem === 'ice_banana') nextIcon = '❄️';
      else if (this.nextItem === 'bomb') nextIcon = '💣';
      else if (this.nextItem === 'mega_bomb') nextIcon = '☠️';

      contentHtml = `
        <div id="game-arena-wrapper" class="w-full flex-1 flex flex-col justify-between max-w-xl mx-auto py-2 px-3">
          <!-- Game HUD -->
          <div class="w-full max-w-2xl mx-auto px-1 py-1 select-none">
            <div class="flex items-center justify-between gap-2 sm:gap-3">
              <div class="flex items-center gap-2 bg-amber-900/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-600/40 shadow-sm">
                <span class="text-xl">🍌</span>
                <div>
                  <div class="text-[10px] font-bold text-amber-300 uppercase tracking-wider">점수</div>
                  <div id="hud-score-val" class="text-xl sm:text-2xl font-black text-amber-100 font-mono tabular-nums leading-none">
                    ${this.stats.score.toLocaleString()}
                  </div>
                </div>
              </div>

              <div id="hud-timer-box" class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border transition-all duration-300 bg-emerald-950/50 border-emerald-600/40 text-white">
                <span class="text-base sm:text-lg">⏱️</span>
                <div class="text-center">
                  <div class="text-[9px] sm:text-[10px] font-bold text-emerald-200/80 uppercase">남은 시간</div>
                  <div id="hud-timer-val" class="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none">
                    ${this.timeLeft}초
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 sm:gap-1.5">
                <button id="btn-hud-bgm" class="p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${soundEngine.bgmEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'}">
                  🎵
                </button>
                <button id="btn-hud-sfx" class="p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${soundEngine.sfxEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'}">
                  🔊
                </button>
                <button id="btn-hud-rank" class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <span>🏆</span>
                  <span class="hidden sm:inline">랭킹</span>
                </button>
                <button id="btn-hud-end" class="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/60 text-white text-xs font-black flex items-center gap-1 cursor-pointer active:scale-95">
                  <span>⏹</span>
                  <span>종료</span>
                </button>
              </div>
            </div>

            <!-- Secondary Combo & Speed bar -->
            <div class="flex items-center justify-between mt-2 px-1 text-xs">
              <div id="hud-combo-val" class="flex items-center gap-1.5">
                ${this.stats.combo > 1 ? `
                  <div class="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-sm">
                    <span>🔥</span>
                    <span>${this.stats.combo} COMBO!</span>
                  </div>
                ` : `<span class="text-amber-200/60 font-medium">콤보를 이어가세요!</span>`}
              </div>

              <div class="flex items-center gap-1 text-amber-200/90 font-medium bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-700/30">
                <span>⚡ 속도:</span>
                <span id="hud-speed-val" class="font-mono font-bold text-amber-300">${this.getSpeedMultiplier().toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <!-- Ice Freeze slow buff notice -->
          <div id="ice-banana-notice" class="text-center text-xs font-bold text-cyan-300 flex items-center justify-center gap-1 my-0.5 ${Date.now() < this.iceSlowUntil ? '' : 'hidden'}">
            <span>❄️ 얼음 바나나 효과: 집중 시간!</span>
          </div>

          <!-- Main Stage: Monkey + Dish Plate -->
          <div class="relative w-full my-auto flex flex-col items-center">
            <div id="monkey-container" class="relative z-10 -mb-8 flex justify-center">
              ${renderMonkeySvg(this.monkeyMood, this.stats.combo)}
            </div>

            <!-- Eating Stage Table Card -->
            <div class="relative w-full max-w-lg mx-auto py-2 flex flex-col items-center justify-center select-none">
              <div class="relative w-full h-56 sm:h-60 rounded-3xl bg-gradient-to-b from-stone-900/95 via-amber-950/85 to-stone-900/95 border-2 border-amber-500/40 shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-4 overflow-hidden">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="w-full flex items-center justify-between z-10">
                  <div id="status-prompt-badge" class="px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border shadow-sm transition-colors ${isBomb ? 'bg-rose-500/25 text-rose-200 border-rose-400/50 animate-pulse' : 'bg-amber-400/25 text-amber-200 border-amber-400/50'}">
                    <span class="text-base">${isBomb ? '💣' : '🍌'}</span>
                    <span>${isBomb ? '폭탄이다! 오른쪽 [→] 로 안먹기!' : '바나나다! 왼쪽 [←] 로 먹기!'}</span>
                  </div>

                  <div class="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300 shadow-sm">
                    <span class="text-stone-400 font-semibold">다음:</span>
                    <div id="next-item-preview" class="w-5 h-5 flex items-center justify-center">
                      <span class="text-base">${nextIcon}</span>
                    </div>
                  </div>
                </div>

                <!-- 3D Dish Plate & Current Item -->
                <div class="relative flex-1 flex flex-col items-center justify-center w-full z-10 my-1">
                  <div class="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                    <svg viewBox="0 0 200 140" class="absolute bottom-1 w-52 h-36 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      <defs>
                        <linearGradient id="pRim" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stop-color="#FEF3C7" />
                          <stop offset="40%" stop-color="#FDE68A" />
                          <stop offset="100%" stop-color="#D97706" />
                        </linearGradient>
                        <radialGradient id="pInner" cx="50%" cy="40%" r="55%">
                          <stop offset="0%" stop-color="#FFFFFF" />
                          <stop offset="70%" stop-color="#FFFBEB" />
                          <stop offset="100%" stop-color="#FDE68A" />
                        </radialGradient>
                      </defs>
                      <ellipse cx="100" cy="112" rx="60" ry="14" fill="#000000" opacity="0.3" filter="blur(4px)" />
                      <ellipse cx="100" cy="106" rx="55" ry="12" fill="#451A03" />
                      <ellipse cx="100" cy="80" rx="86" ry="34" fill="url(#pRim)" />
                      <ellipse cx="100" cy="78" rx="72" ry="26" fill="url(#pInner)" />
                      <ellipse cx="100" cy="78" rx="34" ry="12" fill="#78350F" opacity="0.2" filter="blur(3px)" />
                    </svg>

                    <div id="stage-item-wrapper" class="relative z-20 -mt-6">
                      ${renderItemSvg(this.currentItem)}
                    </div>
                  </div>
                </div>

                <div class="w-full text-center z-10 text-[11px] font-medium text-amber-200/80">
                  버튼을 누르면 즉시 판정되고 다음 귀여운 물건으로 바뀝니다!
                </div>
              </div>
            </div>

            <div class="w-full flex items-center justify-between text-[11px] text-amber-200/60 px-3 mt-1.5">
              <span class="text-amber-300 font-bold">← [먹기] 바나나</span>
              <span class="hidden sm:inline font-mono">단축키: [←/A] 먹기 / [→/D/Space] 안먹기</span>
              <span class="text-rose-300 font-bold">[안먹기] 폭탄 →</span>
            </div>
          </div>

          <!-- Bottom Touch Controls (왼쪽 먹기 ← / 오른쪽 안먹기 → 화살표 버튼) -->
          <div class="w-full max-w-xl mx-auto px-4 py-3 select-none">
            <div class="grid grid-cols-2 gap-4 sm:gap-6">
              <!-- Left Arrow Button: 먹기 -->
              <button id="btn-action-eat" class="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-[0_8px_0_#92400E] active:shadow-[0_2px_0_#92400E] active:translate-y-1.5 transition-all border-2 border-amber-300/80 cursor-pointer touch-manipulation overflow-hidden">
                <div class="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/45 to-transparent pointer-events-none"></div>
                <div class="relative z-10 flex flex-col items-center justify-center">
                  <svg class="w-12 h-12 sm:w-14 sm:h-14 text-stone-950 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-active:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span class="text-xl sm:text-2xl font-black tracking-wide text-stone-950 drop-shadow mt-0.5">먹기</span>
                  <span class="text-[10px] font-mono font-bold text-amber-950/80 mt-0.5">[ ← ]</span>
                </div>
              </button>

              <!-- Right Arrow Button: 안먹기 -->
              <button id="btn-action-pass" class="relative group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-3xl bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white shadow-[0_8px_0_#881337] active:shadow-[0_2px_0_#881337] active:translate-y-1.5 transition-all border-2 border-rose-300/60 cursor-pointer touch-manipulation overflow-hidden">
                <div class="absolute inset-x-3 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none"></div>
                <div class="relative z-10 flex flex-col items-center justify-center">
                  <svg class="w-12 h-12 sm:w-14 sm:h-14 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform group-active:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                  <span class="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow mt-0.5">안먹기</span>
                  <span class="text-[10px] font-mono font-bold text-rose-100/90 mt-0.5">[ → ]</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.gameState === 'GAME_OVER') {
      let tierTitle = '아기 원숭이 🍼';
      let tierBadge = 'bg-stone-500/20 text-stone-200 border-stone-500/40';
      if (this.stats.score >= 3500) {
        tierTitle = '전설의 바나나 킹 👑';
        tierBadge = 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
      } else if (this.stats.score >= 2200) {
        tierTitle = '바나나 마스터 🍌';
        tierBadge = 'bg-amber-400/20 text-amber-300 border-amber-400/50';
      } else if (this.stats.score >= 1300) {
        tierTitle = '정글 원숭이 대장 🐵';
        tierBadge = 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50';
      } else if (this.stats.score >= 700) {
        tierTitle = '바나나 먹방 유망주 🌴';
        tierBadge = 'bg-blue-400/20 text-blue-300 border-blue-400/50';
      }

      const isNewRecord = this.stats.score > highScore && this.stats.score > 0;
      const defaultName = localStorage.getItem('monkey_player_name') || '슈퍼멍키';

      contentHtml = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="w-full max-w-md rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/80 to-stone-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl text-white relative overflow-hidden">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="text-center relative z-10 flex flex-col items-center">
              <div class="w-24 h-24 -mt-2 -mb-2 flex items-center justify-center">
                ${renderMonkeySvg(this.stats.score >= 1300 ? 'eating_good' : 'idle', this.stats.score >= 2200 ? 10 : 0)}
              </div>

              <h2 class="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight mt-1">
                시간 종료! 게임 오버
              </h2>

              ${isNewRecord ? `
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs my-1.5 shadow-lg animate-bounce">
                  <span>🏆</span>
                  <span>최고 신기록 달성!</span>
                </div>
              ` : ''}

              <div class="mt-1">
                <span class="inline-block px-4 py-1 rounded-full text-xs font-bold border ${tierBadge}">
                  ${tierTitle}
                </span>
              </div>

              <div class="w-full my-3 py-2.5 rounded-2xl bg-amber-950/50 border border-amber-700/40">
                <div class="text-xs font-medium text-amber-300">최종 점수</div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-amber-300 tabular-nums">
                  ${this.stats.score.toLocaleString()} <span class="text-base font-bold text-amber-400">점</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs my-2.5 bg-stone-950/40 p-2.5 rounded-2xl border border-stone-800">
              <div class="flex items-center justify-between p-2 rounded-xl bg-amber-900/20">
                <span class="text-stone-300 flex items-center gap-1"><span>🍌</span> 바나나:</span>
                <span class="font-bold text-amber-300 font-mono">${this.stats.bananasEaten}개</span>
              </div>
              <div class="flex items-center justify-between p-2 rounded-xl bg-amber-900/20">
                <span class="text-stone-300 flex items-center gap-1"><span>⭐</span> 황금 바나나:</span>
                <span class="font-bold text-yellow-300 font-mono">${this.stats.goldenBananasEaten}개</span>
              </div>
              <div class="flex items-center justify-between p-2 rounded-xl bg-emerald-900/20">
                <span class="text-stone-300 flex items-center gap-1"><span>🛡️</span> 폭탄 회피:</span>
                <span class="font-bold text-emerald-300 font-mono">${this.stats.bombsAvoided}회</span>
              </div>
              <div class="flex items-center justify-between p-2 rounded-xl bg-rose-900/20">
                <span class="text-stone-300 flex items-center gap-1"><span>💣</span> 폭탄 먹음:</span>
                <span class="font-bold text-rose-300 font-mono">${this.stats.bombsEaten}회</span>
              </div>
              <div class="col-span-2 flex items-center justify-between p-2 rounded-xl bg-stone-800/40">
                <span class="text-stone-300 flex items-center gap-1"><span>🔥</span> 최대 콤보:</span>
                <span class="font-bold text-orange-300 font-mono">${this.stats.maxCombo}연속</span>
              </div>
            </div>

            <!-- Nickname Save Form -->
            <div id="save-form-container" class="my-2.5">
              <form id="score-save-form" class="flex gap-2">
                <input id="input-player-name" type="text" maxlength="10" value="${defaultName}" placeholder="닉네임 입력 (최대 10자)" class="flex-1 bg-stone-900 border border-amber-600/50 rounded-xl px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400" />
                <button type="submit" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shrink-0 cursor-pointer transition-colors">기록 저장</button>
              </form>
            </div>

            <div class="flex flex-col gap-2 mt-3.5">
              <button id="btn-restart-game" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer">
                <span>🔄</span>
                <span>다시 시작</span>
              </button>

              <div class="grid grid-cols-2 gap-2">
                <button id="btn-go-home" class="py-2.5 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-100 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <span>🏠</span>
                  <span>홈으로 가기</span>
                </button>
                <button id="btn-over-leaderboard" class="py-2.5 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-200 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <span>🏆</span>
                  <span>랭킹 보기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Modal Leaderboard if active
    let leaderboardHtml = '';
    if (this.showLeaderboard) {
      const rows = this.leaderboard.map((entry, index) => {
        const rank = index + 1;
        const isTop1 = rank === 1;
        const isTop2 = rank === 2;
        const isTop3 = rank === 3;
        let rankIcon = `<span class="text-stone-400 font-mono text-sm">${rank}</span>`;
        if (isTop1) rankIcon = '<span class="text-2xl">🥇</span>';
        else if (isTop2) rankIcon = '<span class="text-2xl">🥈</span>';
        else if (isTop3) rankIcon = '<span class="text-2xl">🥉</span>';

        return `
          <div class="flex items-center justify-between p-3 rounded-2xl border transition-all ${
            isTop1 ? 'bg-amber-500/20 border-yellow-400/60' : isTop2 ? 'bg-slate-300/15 border-slate-300/50' : isTop3 ? 'bg-amber-800/30 border-amber-700/50' : 'bg-stone-900/60 border-stone-800'
          }">
            <div class="flex items-center gap-3">
              <div class="w-8 flex items-center justify-center font-black">${rankIcon}</div>
              <div>
                <div class="flex items-center gap-1.5 font-bold text-sm sm:text-base text-white">
                  <span>${entry.name}</span>
                  ${entry.tier ? `<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-500/30 font-medium">${entry.tier}</span>` : ''}
                </div>
                <div class="flex items-center gap-3 text-[11px] text-stone-400 mt-0.5">
                  <span>📅 ${entry.date}</span>
                  ${entry.maxCombo > 0 ? `<span class="text-orange-400">🔥 ${entry.maxCombo} combo</span>` : ''}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg sm:text-xl font-black font-mono tabular-nums ${isTop1 ? 'text-yellow-300' : isTop2 ? 'text-slate-100' : isTop3 ? 'text-amber-300' : 'text-amber-100'}">
                ${entry.score.toLocaleString()}
              </div>
              <div class="text-[10px] text-amber-400/80 font-medium">점수</div>
            </div>
          </div>
        `;
      }).join('');

      leaderboardHtml = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/85 to-stone-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl text-white relative flex flex-col max-h-[85vh]">
            <div class="flex items-center justify-between pb-3 border-b border-amber-800/40">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl">🏆</div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">명예의 전당 (랭킹)</h2>
                  <p class="text-xs text-amber-300/70">바나나 많이 먹기 최고 챔피언 순위</p>
                </div>
              </div>
              <button id="btn-close-leaderboard" class="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer">✕</button>
            </div>

            <div class="flex-1 overflow-y-auto my-4 pr-1 space-y-2">
              ${rows}
            </div>

            <div class="pt-3 border-t border-amber-900/30 flex items-center justify-between text-xs text-stone-400">
              <span>🏅 상위 10개 기록 보관</span>
              <button id="btn-clear-leaderboard" class="text-[11px] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer">기록 초기화</button>
            </div>
          </div>
        </div>
      `;
    }

    this.appEl.innerHTML = `
      <div class="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-emerald-950 via-stone-900 to-amber-950 text-white select-none overflow-x-hidden relative">
        <!-- Background 3D Hills & Clouds -->
        <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-400/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none" class="w-full h-full opacity-30">
            <defs>
              <linearGradient id="hillBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#047857" />
                <stop offset="100%" stop-color="#022C22" />
              </linearGradient>
              <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#059669" />
                <stop offset="100%" stop-color="#064E3B" />
              </linearGradient>
            </defs>
            <path d="M 0 450 Q 250 320 500 420 Q 750 300 1000 440 L 1000 800 L 0 800 Z" fill="url(#hillBack)" />
            <path d="M 0 540 Q 300 440 650 530 Q 850 470 1000 550 L 1000 800 L 0 800 Z" fill="url(#hillFront)" />
            <g fill="#FFFFFF" opacity="0.45">
              <path d="M 120 180 Q 150 140 190 160 Q 230 140 260 170 Q 280 190 260 210 Q 200 230 140 210 Q 110 200 120 180 Z" />
              <path d="M 720 140 Q 750 110 790 125 Q 825 105 855 130 Q 875 150 855 170 Q 800 185 745 170 Q 715 160 720 140 Z" />
            </g>
          </svg>
        </div>

        <!-- Floating Particles Layer -->
        <div id="floating-container" class="absolute inset-0 pointer-events-none overflow-hidden z-30"></div>

        <!-- Dynamic Content -->
        ${contentHtml}

        <!-- Leaderboard Modal -->
        ${leaderboardHtml}
      </div>
    `;

    this.attachDOMListeners();
  }

  attachDOMListeners() {
    // Title buttons
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) btnStart.onclick = () => this.startGame();

    const btnTitleLeaderboard = document.getElementById('btn-open-leaderboard');
    if (btnTitleLeaderboard) btnTitleLeaderboard.onclick = () => {
      this.showLeaderboard = true;
      this.render();
    };

    const btnToggleBgm = document.getElementById('btn-toggle-bgm');
    if (btnToggleBgm) btnToggleBgm.onclick = () => {
      soundEngine.toggleBgm();
      this.render();
    };

    const btnToggleSfx = document.getElementById('btn-toggle-sfx');
    if (btnToggleSfx) btnToggleSfx.onclick = () => {
      soundEngine.toggleSfx();
      this.render();
    };

    // HUD buttons
    const btnHudBgm = document.getElementById('btn-hud-bgm');
    if (btnHudBgm) btnHudBgm.onclick = () => {
      soundEngine.toggleBgm();
      this.updateHUD();
      if (btnHudBgm) {
        btnHudBgm.className = `p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${soundEngine.bgmEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'}`;
      }
    };

    const btnHudSfx = document.getElementById('btn-hud-sfx');
    if (btnHudSfx) btnHudSfx.onclick = () => {
      soundEngine.toggleSfx();
      if (btnHudSfx) {
        btnHudSfx.className = `p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${soundEngine.sfxEnabled ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'}`;
      }
    };

    const btnHudRank = document.getElementById('btn-hud-rank');
    if (btnHudRank) btnHudRank.onclick = () => {
      this.showLeaderboard = true;
      this.render();
    };

    const btnHudEnd = document.getElementById('btn-hud-end');
    if (btnHudEnd) btnHudEnd.onclick = () => {
      this.endGame();
    };

    // Action buttons
    const btnEat = document.getElementById('btn-action-eat');
    if (btnEat) {
      btnEat.onclick = (e) => { e.preventDefault(); this.onEat(); };
    }

    const btnPass = document.getElementById('btn-action-pass');
    if (btnPass) {
      btnPass.onclick = (e) => { e.preventDefault(); this.onPass(); };
    }

    // Game Over buttons
    const btnRestart = document.getElementById('btn-restart-game');
    if (btnRestart) btnRestart.onclick = () => this.startGame();

    const btnGoHome = document.getElementById('btn-go-home');
    if (btnGoHome) btnGoHome.onclick = () => {
      this.gameState = 'READY';
      this.render();
    };

    const btnOverLeaderboard = document.getElementById('btn-over-leaderboard');
    if (btnOverLeaderboard) btnOverLeaderboard.onclick = () => {
      this.showLeaderboard = true;
      this.render();
    };

    const scoreSaveForm = document.getElementById('score-save-form');
    if (scoreSaveForm) {
      scoreSaveForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('input-player-name');
        if (input && input.value.trim()) {
          const name = input.value.trim();
          localStorage.setItem('monkey_player_name', name);
          this.savePlayerScore(name);
          const formContainer = document.getElementById('save-form-container');
          if (formContainer) {
            formContainer.innerHTML = `<div class="text-center text-xs font-semibold text-emerald-400 my-2">✓ &ldquo;${name}&rdquo; 님의 점수가 랭킹에 등록되었습니다!</div>`;
          }
        }
      };
    }

    // Leaderboard modal buttons
    const btnCloseLeaderboard = document.getElementById('btn-close-leaderboard');
    if (btnCloseLeaderboard) btnCloseLeaderboard.onclick = () => {
      this.showLeaderboard = false;
      this.render();
    };

    const btnClearLeaderboard = document.getElementById('btn-clear-leaderboard');
    if (btnClearLeaderboard) btnClearLeaderboard.onclick = () => {
      if (confirm('랭킹 기록을 초기화하시겠습니까?')) {
        this.leaderboard = [];
        saveLeaderboard([]);
        this.render();
      }
    };
  }
}

// Start Game Controller once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new BananaGame();
});
