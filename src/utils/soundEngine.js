// Procedural Web Audio API sound generator + Web Speech API file screams
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.screamMuted = false;
    this.masterVolume = 0.8;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  setScreamMuted(muted) {
    this.screamMuted = muted;
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  getMasterGain() {
    if (!this.ctx || this.muted) return null;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    gain.connect(this.ctx.destination);
    return gain;
  }

  // Create White/Pink Noise Buffer
  createNoiseBuffer(duration = 1.0) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Hydraulic Press: Pneumatic hiss + crushing clank
  playHydraulicHiss() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Hiss (filtered noise)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(1.8);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.8);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    noise.start(now);
    noise.stop(now + 1.8);
  }

  playCrunch() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Heavy Sub Thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);
    oscGain.gain.setValueAtTime(1.0, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.6);

    // Crunch noise
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.5);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 0.5);
  }

  // 2. Elephant Stomp: Sub-bass shockwave + trumpeting squawk
  playElephantStomp() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Mega Thud
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(18, now + 0.9);
    subGain.gain.setValueAtTime(1.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(now);
    sub.stop(now + 0.9);

    // Trumpet squawk
    const horn = this.ctx.createOscillator();
    const hornGain = this.ctx.createGain();
    horn.type = 'sawtooth';
    horn.frequency.setValueAtTime(320, now + 0.05);
    horn.frequency.linearRampToValueAtTime(580, now + 0.25);
    horn.frequency.exponentialRampToValueAtTime(180, now + 0.6);
    hornGain.gain.setValueAtTime(0.4, now + 0.05);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    horn.connect(hornGain);
    hornGain.connect(master);
    horn.start(now + 0.05);
    horn.stop(now + 0.6);
  }

  // 3. Wrecking Ball: Whoosh + shatter impact
  playWreckingBall() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Whoosh
    const whoosh = this.ctx.createBufferSource();
    whoosh.buffer = this.createNoiseBuffer(0.8);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.5);
    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(0.6, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    whoosh.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(master);
    whoosh.start(now);

    // Impact & shatter at +0.45s
    setTimeout(() => {
      this.playCrunch();
      // Metallic resonant ring
      if (!this.ctx || this.muted) return;
      const t = this.ctx.currentTime;
      [540, 890, 1420].forEach((freq) => {
        const ring = this.ctx.createOscillator();
        const rGain = this.ctx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(freq, t);
        ring.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.7);
        rGain.gain.setValueAtTime(0.2, t);
        rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        ring.connect(rGain);
        rGain.connect(this.ctx.destination);
        ring.start(t);
        ring.stop(t + 0.7);
      });
    }, 450);
  }

  // 4. Rocket Launch: Countdown beeps + thruster blast
  playRocketLaunch() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Thruster roar
    const roar = this.ctx.createBufferSource();
    roar.buffer = this.createNoiseBuffer(3.5);
    const roarFilter = this.ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(300, now);
    roarFilter.frequency.linearRampToValueAtTime(2400, now + 2.5);

    const roarGain = this.ctx.createGain();
    roarGain.gain.setValueAtTime(0.1, now);
    roarGain.gain.linearRampToValueAtTime(0.9, now + 1.5);
    roarGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    roar.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(master);
    roar.start(now);
    roar.stop(now + 3.5);
  }

  // 5. Juicer: High RPM blender whirr & wet squishes
  playJuicer() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const motor = this.ctx.createOscillator();
    const motorGain = this.ctx.createGain();
    motor.type = 'sawtooth';
    motor.frequency.setValueAtTime(100, now);
    motor.frequency.linearRampToValueAtTime(750, now + 0.8);
    motor.frequency.linearRampToValueAtTime(650, now + 2.2);

    motorGain.gain.setValueAtTime(0.3, now);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    motor.connect(motorGain);
    motorGain.connect(master);
    motor.start(now);
    motor.stop(now + 2.5);

    // Wet liquid drops
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const dripTime = this.ctx.currentTime;
        const drip = this.ctx.createOscillator();
        const dripG = this.ctx.createGain();
        drip.type = 'sine';
        drip.frequency.setValueAtTime(900 + Math.random() * 600, dripTime);
        drip.frequency.exponentialRampToValueAtTime(300, dripTime + 0.15);
        dripG.gain.setValueAtTime(0.2, dripTime);
        dripG.gain.exponentialRampToValueAtTime(0.01, dripTime + 0.15);
        drip.connect(dripG);
        dripG.connect(this.ctx.destination);
        drip.start(dripTime);
        drip.stop(dripTime + 0.15);
      }, 500 + i * 350);
    }
  }

  // 6. Trash Compactor: Hydraulic drone + metal screech
  playTrashCompactor() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const drone = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone.type = 'sawtooth';
    drone.frequency.setValueAtTime(65, now);
    drone.frequency.linearRampToValueAtTime(95, now + 2.0);
    droneGain.gain.setValueAtTime(0.4, now);
    droneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start(now);
    drone.stop(now + 2.6);

    // Metal groan
    const screech = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    screech.type = 'triangle';
    screech.frequency.setValueAtTime(820, now + 0.6);
    screech.frequency.linearRampToValueAtTime(1150, now + 1.6);
    sGain.gain.setValueAtTime(0.25, now + 0.6);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    screech.connect(sGain);
    sGain.connect(master);
    screech.start(now + 0.6);
    screech.stop(now + 2.2);
  }

  // 7. Steamroller: Heavy engine + sad trombone "womp womp"
  playSteamroller() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Low engine rumble
    const engine = this.ctx.createOscillator();
    const engineGain = this.ctx.createGain();
    engine.type = 'square';
    engine.frequency.setValueAtTime(45, now);
    engineGain.gain.setValueAtTime(0.35, now);
    engineGain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);
    engine.connect(engineGain);
    engineGain.connect(master);
    engine.start(now);
    engine.stop(now + 1.8);

    // Sad Trombone: Womp Womp Womp Womp
    const notes = [293.66, 277.18, 261.63, 233.08]; // D4, C#4, C4, Bb3
    notes.forEach((freq, idx) => {
      const noteStart = now + 1.4 + idx * 0.35;
      const dur = idx === 3 ? 0.9 : 0.28;
      const trom = this.ctx.createOscillator();
      const tGain = this.ctx.createGain();
      trom.type = 'sawtooth';
      trom.frequency.setValueAtTime(freq, noteStart);
      if (idx === 3) {
        trom.frequency.linearRampToValueAtTime(freq - 30, noteStart + dur);
      }
      tGain.gain.setValueAtTime(0.3, noteStart);
      tGain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);
      trom.connect(tGain);
      tGain.connect(master);
      trom.start(noteStart);
      trom.stop(noteStart + dur);
    });
  }

  // 8. Bug Zapper: High voltage buzz & intense electrical snaps
  playBugZapper() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // AC Hum
    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(120, now);
    humGain.gain.setValueAtTime(0.2, now);
    humGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
    hum.connect(humGain);
    humGain.connect(master);
    hum.start(now);
    hum.stop(now + 2.0);

    // ZZZT sparks
    [0.3, 0.7, 1.1, 1.5, 1.8].forEach((offset) => {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const t = this.ctx.currentTime;
        const spark = this.ctx.createBufferSource();
        spark.buffer = this.createNoiseBuffer(0.12);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, t);
        const sG = this.ctx.createGain();
        sG.gain.setValueAtTime(0.8, t);
        sG.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        spark.connect(filter);
        filter.connect(sG);
        sG.connect(this.ctx.destination);
        spark.start(t);
      }, offset * 1000);
    });
  }

  // 9. Shredder: Motor whirr + rapid paper cutting
  playShredder() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(2.2);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    noise.start(now);
    noise.stop(now + 2.2);
  }

  // 10. Matryoshka Smash: Hammer strikes with increasing pitch
  playMatryoshkaSmash(stage = 1) {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscG = this.ctx.createGain();
    osc.type = 'triangle';
    const baseFreq = 220 + stage * 160;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.2);
    oscG.gain.setValueAtTime(0.7, now);
    oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscG);
    oscG.connect(master);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 11. Pinata: Bat hit & candy chimes
  playPinataWhack() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    // Bat crack
    const osc = this.ctx.createOscillator();
    const oscG = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
    oscG.gain.setValueAtTime(0.8, now);
    oscG.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(oscG);
    oscG.connect(master);
    osc.start(now);
    osc.stop(now + 0.25);

    // Candy chime cascade
    [880, 1046, 1318, 1567, 1760, 2093].forEach((f, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const t = this.ctx.currentTime;
        const chime = this.ctx.createOscillator();
        const cG = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, t);
        cG.gain.setValueAtTime(0.15, t);
        cG.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        chime.connect(cG);
        cG.connect(this.ctx.destination);
        chime.start(t);
        chime.stop(t + 0.3);
      }, 150 + idx * 60);
    });
  }

  // 12. Black Hole: Eerie gravitational sweep & cosmic suction
  playBlackHole() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 2.5);
    osc2.frequency.setValueAtTime(610, now);
    osc2.frequency.exponentialRampToValueAtTime(42, now + 2.5);

    g.gain.setValueAtTime(0.4, now);
    g.gain.linearRampToValueAtTime(0.7, now + 1.8);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.7);

    osc1.connect(g);
    osc2.connect(g);
    g.connect(master);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.7);
    osc2.stop(now + 2.7);
  }

  // 13. Volcano: Magma rumble & bubbling explosion
  playVolcano() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(3.0);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.linearRampToValueAtTime(800, now + 1.2);
    filter.frequency.exponentialRampToValueAtTime(80, now + 3.0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    noise.start(now);
    noise.stop(now + 3.0);
  }

  // 14. Tweezers: Delicate high-pitched ping
  playTweezers() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, now);
    osc.frequency.exponentialRampToValueAtTime(4200, now + 0.08);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Klaxon / Warning Siren
  playSiren() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.35);
    osc.frequency.linearRampToValueAtTime(700, now + 0.7);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  // Funeral March organ progression
  playFuneralMarch() {
    this.init();
    const master = this.getMasterGain();
    if (!master) return;
    const notes = [
      { f: 220, d: 0.6 },
      { f: 220, d: 0.6 },
      { f: 220, d: 0.6 },
      { f: 261.63, d: 0.4 },
      { f: 246.94, d: 0.2 },
      { f: 220, d: 0.8 }
    ];

    let t = this.ctx.currentTime;
    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + note.d);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + note.d);
      t += note.d + 0.05;
    });
  }

  // Web Speech API: File screams and funny one-liners!
  scream(text) {
    if (this.screamMuted || this.muted) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.6;
      utterance.rate = 1.35;
      utterance.volume = this.masterVolume;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis fallback
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playMachineSound(machineKey) {
    if (this.muted) return;
    switch (machineKey) {
      case 'HydraulicPress':
        this.playHydraulicHiss();
        setTimeout(() => this.playCrunch(), 1400);
        break;
      case 'ElephantStomp':
        this.playElephantStomp();
        break;
      case 'WreckingBall':
        this.playWreckingBall();
        break;
      case 'RocketLaunch':
        this.playRocketLaunch();
        break;
      case 'Juicer':
        this.playJuicer();
        break;
      case 'TrashCompactor':
        this.playTrashCompactor();
        break;
      case 'Steamroller':
        this.playSteamroller();
        break;
      case 'BugZapper':
        this.playBugZapper();
        break;
      case 'Shredder':
        this.playShredder();
        break;
      case 'Matryoshka':
        this.playMatryoshkaSmash(1);
        setTimeout(() => this.playMatryoshkaSmash(2), 1200);
        setTimeout(() => this.playMatryoshkaSmash(3), 2400);
        setTimeout(() => this.playMatryoshkaSmash(4), 3600);
        break;
      case 'BlackHole':
      default:
        this.playBlackHole();
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
