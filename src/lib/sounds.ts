// Sound Effects Library for Nyxia V2

export type SoundEffect = 
  | 'message-sent' 
  | 'message-received' 
  | 'notification' 
  | 'favorite' 
  | 'typing' 
  | 'open' 
  | 'close'
  | 'magic'
  | 'chime';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Generate mystical sounds using Web Audio API
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', fadeIn = 0.05, fadeOut = 0.1) {
    const ctx = this.initAudioContext();
    if (!ctx || !this.enabled) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;

    // Fade in
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + fadeIn);
    
    // Fade out
    gainNode.gain.setValueAtTime(this.volume, ctx.currentTime + duration - fadeOut);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  private playChord(frequencies: number[], duration: number) {
    frequencies.forEach(freq => {
      this.playTone(freq, duration, 'sine', 0.05, 0.15);
    });
  }

  play(sound: SoundEffect) {
    if (!this.enabled) return;

    switch (sound) {
      case 'message-sent':
        // Rising mystical tone
        this.playTone(440, 0.15, 'sine', 0.02, 0.05);
        setTimeout(() => this.playTone(550, 0.1, 'sine', 0.01, 0.03), 50);
        break;

      case 'message-received':
        // Ethereal chord
        this.playChord([523, 659, 784], 0.4);
        break;

      case 'notification':
        // Magical chime
        this.playTone(880, 0.1, 'sine', 0.01, 0.02);
        setTimeout(() => this.playTone(1100, 0.15, 'sine', 0.01, 0.05), 100);
        setTimeout(() => this.playTone(1320, 0.2, 'sine', 0.01, 0.08), 200);
        break;

      case 'favorite':
        // Sparkle sound
        this.playTone(660, 0.1, 'sine');
        setTimeout(() => this.playTone(880, 0.1, 'sine'), 50);
        setTimeout(() => this.playTone(1047, 0.15, 'sine'), 100);
        break;

      case 'typing':
        // Subtle mystical hum
        this.playTone(200, 0.1, 'sine', 0.05, 0.03);
        break;

      case 'open':
        // Mystical reveal
        this.playChord([330, 440, 550], 0.3);
        setTimeout(() => this.playChord([440, 550, 660], 0.4), 150);
        break;

      case 'close':
        // Gentle fade
        this.playChord([660, 550, 440], 0.3);
        break;

      case 'magic':
        // Magical spell sound
        this.playTone(220, 0.2, 'triangle');
        setTimeout(() => this.playTone(330, 0.2, 'triangle'), 100);
        setTimeout(() => this.playTone(440, 0.2, 'triangle'), 200);
        setTimeout(() => this.playTone(550, 0.3, 'sine'), 300);
        break;

      case 'chime':
        // Simple chime
        this.playTone(880, 0.5, 'sine', 0.01, 0.3);
        break;
    }
  }

  // Play ambient background (returns stop function)
  playAmbient(): () => void {
    const ctx = this.initAudioContext();
    if (!ctx || !this.enabled) return () => {};

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.type = 'sine';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, ctx.currentTime + 2);

    oscillator.start(ctx.currentTime);

    return () => {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => oscillator.stop(), 1000);
    };
  }
}

export const soundManager = new SoundManager();
