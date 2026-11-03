// Web Audio API Synthesizer for 100% self-contained, lag-free audio and looping BGM

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private step: number = 0;
  public bgmEnabled: boolean = true;
  public sfxEnabled: boolean = true;

  constructor() {
    // Load preferences
    const savedBgm = localStorage.getItem('monkey_bgm_enabled');
    if (savedBgm !== null) {
      this.bgmEnabled = savedBgm === 'true';
    }
    const savedSfx = localStorage.getItem('monkey_sfx_enabled');
    if (savedSfx !== null) {
      this.sfxEnabled = savedSfx === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? 0.35 : 0;
      this.sfxGain.connect(this.ctx.destination);

      // BGM Bus
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmEnabled ? 0.18 : 0;
      this.bgmGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects ---
  public playMunch() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    
    // First bite crunch
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(140, t + 0.08);

    gain1.gain.setValueAtTime(0.8, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(t);
    osc1.stop(t + 0.08);

    // Second crunchy follower
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, t + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(260, t + 0.14);

    gain2.gain.setValueAtTime(0.6, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.14);
  }

  public playBomb() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.45);

    // White noise explosion burst
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

  public playWhoosh() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playCombo(comboCount: number) {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66]; // C5 pentatonic
    const note = scale[Math.min(comboCount - 1, scale.length - 1)] || 523.25;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, t);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  public playGolden() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.4, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.15);
    });
  }

  public playTick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  public playGameOver() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const start = t + i * 0.12;
      const dur = i === notes.length - 1 ? 0.6 : 0.2;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.5, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  // --- Looping Jungle BGM ---
  public startBgm() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Upbeat tropical jungle marimba sequence
    // 16-step pattern, repeats indefinitely
    const tempo = 136; // BPM
    const stepDuration = 60 / tempo / 2; // 8th notes

    // Melody: Tropical happy motif
    const melodyNotes = [
      523.25, 0, 659.25, 783.99,  // C5, -, E5, G5
      880.00, 783.99, 659.25, 0,  // A5, G5, E5, -
      587.33, 0, 659.25, 587.33,  // D5, -, E5, D5
      523.25, 659.25, 783.99, 0   // C5, E5, G5, -
    ];

    // Bassline: Bouncy marimba roots
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

      // Melody tone
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

      // Bass marimba pluck
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

      // Jungle shaker / wood tap on off-beats
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

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleBgm(): boolean {
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

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('monkey_sfx_enabled', String(this.sfxEnabled));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.35 : 0, this.ctx.currentTime);
    }
    return this.sfxEnabled;
  }
}

export const soundEngine = new SoundEngine();
