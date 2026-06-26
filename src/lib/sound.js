// ─────────────────────────────────────────────────────────────────────────────
// The Chronicle — interactive sound design engine (Phase 4).
//
// A small Web-Audio "sound design system": sparse, intentional cues that reward
// *intent*, never accompany motion. Abstract cues are synthesized (oscillators +
// ADSR + biquad + noise → 0 bytes shipped); a few organic samples (raven + the
// two ambient beds) are optional mp3s that degrade to synthesis if absent.
//
// Architecture: ONE shared AudioContext, created lazily and unlocked on the first
// user gesture (browser autoplay law). A single master chain
//   cue → master(gain) → compressor → destination
// gives consistent level + glue and guards against clipping when cues overlap.
//
// This module is pure audio — no React, no store imports. The UI layer
// (`useSoundStore` + `SoundControl`) drives it through `setEnabled/setVolume`;
// sections fire cues through `playCue` / `hum` / `watch`. Everything no-ops
// safely until unlocked + enabled + the page is in view, so callers never guard.
// ─────────────────────────────────────────────────────────────────────────────

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  TUNING — edit me. Friendly knobs for the whole sound design.              ║
// ║  • peak  = loudness 0..1 (higher = louder; lower a value to make it gentler)║
// ║  • dur   = length in seconds.                                              ║
// ║  • beds.*.sample / raven = optional mp3s. Drop a file at the given public/  ║
// ║    path and it plays (beds loop; volume still follows the section's scroll- ║
// ║    distance fade). If the file is absent, the synthesized fallback plays.   ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
export const CONFIG = {
  theme: { peak: 0.10, dur: 0.62 }, // theme-toggle swoosh (length-synced to the wipe)
  mapOpen: { peak: 0.09 },          // map-open swoosh
  mapClose: { peak: 0.08 },         // map-close swoosh
  error: { peak: 0.16 },            // contact-form error buzz
  glitch: { peak: 0.10 },           // voice-change decode
  blip: { peak: 0.11 },             // arsenal hover pluck
  beds: {
    hero: { peak: 0.5, sample: '/sounds/astrolabe.mp3' },   // Hero astrolabe loop
    arsenal: { peak: 0.42, sample: '/sounds/arsenal.mp3' },  // Arsenal ambience loop
  },
  raven: '/sounds/raven.mp3',       // Contact-send raven (one-shot sample)
};

let ctx = null;          // the one AudioContext
let master = null;       // master GainNode (carries volume / mute)
let comp = null;         // limiter on the master bus
let noise = null;        // cached white-noise buffer (built per-context)

let unlocked = false;    // has a user gesture resumed the context?
let enabled = true;      // user preference (mute switch)
let volume = 0.7;        // user preference 0..1
let armed = false;       // gesture listener attached once?
let pageActive = true;   // is our tab/window currently in view? (no sound if not)

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Effective master level: silent unless unlocked + enabled.
const targetMaster = () => (unlocked && enabled ? volume : 0);

const now = () => ctx.currentTime;

// Build (once) the context + master bus. Safe to call repeatedly.
function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = targetMaster();

  // A gentle limiter so overlapping cues never clip or jump in loudness.
  comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -10;
  comp.knee.value = 24;
  comp.ratio.value = 12;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;

  master.connect(comp);
  comp.connect(ctx.destination);

  // White-noise bed for whooshes / wingbeats / metallic resonators (2s, reused).
  const len = ctx.sampleRate * 2;
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

// Smoothly move the master toward its effective level.
function applyMaster() {
  if (!master) return;
  const g = master.gain;
  g.cancelScheduledValues(now());
  g.setTargetAtTime(targetMaster(), now(), 0.04);
}

// ── Synthesis helpers ────────────────────────────────────────────────────────

// One-shot oscillator voice with an attack/decay envelope, auto-disconnected.
function blip(t0, { freq = 440, type = 'sine', dur = 0.16, peak = 0.25, attack = 0.005, dest = master, detune = 0, glideTo = null } = {}) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo != null) osc.frequency.exponentialRampToValueAtTime(Math.max(glideTo, 1), t0 + dur);
  osc.detune.value = detune;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(dest);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
  osc.onended = () => { osc.disconnect(); g.disconnect(); };
}

// Filtered noise burst with a gain swell — the basis of every whoosh / wingbeat.
function swoosh(t0, { dur = 0.5, peak = 0.18, type = 'bandpass', from = 1600, to = 400, q = 0.9, dest = master } = {}) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filt = ctx.createBiquadFilter();
  filt.type = type;
  filt.Q.value = q;
  filt.frequency.setValueAtTime(from, t0);
  filt.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + dur * 0.32);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filt).connect(g).connect(dest);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
  src.onended = () => { src.disconnect(); filt.disconnect(); g.disconnect(); };
}

// ── Cue library ──────────────────────────────────────────────────────────────
// Each cue schedules its voices relative to the context clock and self-cleans.
const CUES = {
  // Theme swap — a single, gentle warm "wipe" of falling air (no chime).
  // Length-matched to the radial reveal (~480ms) + body colour transition (~500ms).
  theme(t0) {
    swoosh(t0, { dur: CONFIG.theme.dur, peak: CONFIG.theme.peak, from: 1400, to: 320, q: 0.6 });
  },

  // Voice switch — a soft "decode" that pairs with the text scramble: short
  // semi-random blips thinning out as it resolves + an airy bed + a resolve tone.
  glitch(t0) {
    const n = 10;
    for (let i = 0; i < n; i++) {
      const dt = (i / n) * 0.5 + Math.random() * 0.02;
      const f = 600 + Math.random() * 1700;
      const pk = CONFIG.glitch.peak * (1 - i / n) * 0.85 + 0.01; // thins as text resolves
      blip(t0 + dt, { freq: f, type: 'triangle', dur: 0.04, peak: pk, attack: 0.001 });
    }
    // swoosh(t0, { dur: 0.5, peak: 0.045, type: 'bandpass', from: 1200, to: 3000, q: 1.2 });
    blip(t0 + 0.5, { freq: 880, type: 'sine', dur: 0.2, peak: 0.06, attack: 0.006 }); // soft resolve
  },

  // Contact-form error — a short, low descending "denied" buzz (not harsh).
  error(t0) {
    blip(t0, { freq: 220, glideTo: 150, type: 'sawtooth', dur: 0.16, peak: CONFIG.error.peak, attack: 0.004 });
    blip(t0 + 0.13, { freq: 165, glideTo: 110, type: 'sawtooth', dur: 0.22, peak: CONFIG.error.peak * 0.9, attack: 0.004 });
    swoosh(t0, { dur: 0.18, peak: 0.05, type: 'lowpass', from: 420, to: 120, q: 0.6 });
  },

  // Map opens — a gentle upward swell (drawing the chart open).
  mapOpen(t0) {
    swoosh(t0, { dur: 0.55, peak: CONFIG.mapOpen.peak, from: 260, to: 1500, q: 0.6 });
  },

  // Map closes — a shorter, gentle downward fall (the chart rolling shut).
  mapClose(t0) {
    swoosh(t0, { dur: 0.38, peak: CONFIG.mapClose.peak, from: 1400, to: 260, q: 0.6 });
  },

  // Arsenal hover — a tiny pluck; pitch varies per node so a sweep across the
  // orbit reads as a little arpeggio rather than a repeated beep.
  blip(t0, { step = 0 } = {}) {
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C-major-ish
    const f = scale[((step % scale.length) + scale.length) % scale.length];
    blip(t0, { freq: f, type: 'sine', dur: 0.13, peak: CONFIG.blip.peak, attack: 0.003 });
    blip(t0, { freq: f * 2, type: 'sine', dur: 0.07, peak: CONFIG.blip.peak * 0.34, attack: 0.002 });
  },

  // Sound just turned on — a soft confirmation so the toggle is audible.
  confirm(t0) {
    blip(t0, { freq: 523.25, type: 'triangle', dur: 0.18, peak: 0.16, attack: 0.004 });
    blip(t0 + 0.09, { freq: 783.99, type: 'triangle', dur: 0.22, peak: 0.14, attack: 0.004 });
  },

  // Raven flight — synthesized fallback when the mp3 is absent: three lowpassed
  // wingbeats accelerating away + a short descending caw.
  ravenSynth(t0) {
    [0, 0.13, 0.27].forEach((dt, i) => {
      swoosh(t0 + dt, { dur: 0.16 - i * 0.02, peak: 0.16 - i * 0.03, type: 'lowpass', from: 900, to: 300, q: 0.6 });
    });
    blip(t0 + 0.06, { freq: 520, glideTo: 240, type: 'sawtooth', dur: 0.4, peak: 0.07, attack: 0.01 });
  },
};

// ── Optional organic sample (the raven, one-shot) ────────────────────────────
let ravenBuffer = null;
let ravenTried = false;

async function loadRaven(url = CONFIG.raven) {
  if (ravenTried) return;
  ravenTried = true;
  if (!ensureContext()) return;
  try {
    const res = await fetch(url);
    if (!res.ok) return; // 404 → fall back to ravenSynth, no noise in console
    ravenBuffer = await ctx.decodeAudioData(await res.arrayBuffer());
  } catch {
    ravenBuffer = null; // any failure → graceful synth fallback
  }
}

function playRaven(t0) {
  if (ravenBuffer) {
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = ravenBuffer;
    g.gain.value = 0.9;
    src.connect(g).connect(master);
    src.start(t0);
    src.onended = () => { src.disconnect(); g.disconnect(); };
  } else {
    CUES.ravenSynth(t0);
  }
}

// ── Continuous beds: the Arsenal ambience + the Hero astrolabe ────────────────
// Each is a managed voice that only exists while wanted AND audible. It plays an
// optional looping mp3 if one is provided + present, else a synthesized fallback.
// Built lazily and fully torn down at zero, so nothing sounds in the background
// once you've scrolled away. Section components drive `setLevel()` from scroll
// proximity for a natural distance fade in/out — that works for sample OR synth.

function makeBed({ build, peak = 1, sampleUrl = null }) {
  let nodes = null;   // { gain, stop() } once running
  let wanted = false;
  let level = 0;      // 0..1 target
  let buffer = null;  // decoded loop sample (if provided + present)
  let tried = false;

  // Looping-sample bed → gain follows the same distance fade as the synth.
  const buildSample = () => {
    const g = ctx.createGain(); g.gain.value = 0.0001;
    const src = ctx.createBufferSource(); src.buffer = buffer; src.loop = true;
    src.connect(g).connect(master); src.start();
    return {
      gain: g,
      stop() {
        const t = now();
        g.gain.setTargetAtTime(0.0001, t, 0.2);
        try { src.stop(t + 0.6); } catch { /* already stopped */ }
        setTimeout(() => { src.disconnect(); g.disconnect(); }, 800);
      },
    };
  };
  const buildNodes = () => (buffer ? buildSample() : build());
  const ensure = () => { if (nodes || !wanted || level <= 0.001 || !unlocked || !enabled || !ensureContext()) return; nodes = buildNodes(); };
  const apply = () => { if (nodes) nodes.gain.gain.setTargetAtTime(level * peak, now(), 0.3); };

  return {
    setLevel(v) {
      level = Math.max(0, Math.min(1, v));
      wanted = level > 0.001;
      if (wanted) { ensure(); apply(); }
      else if (nodes) { nodes.stop(); nodes = null; }
    },
    start() { wanted = true; ensure(); apply(); },
    stop() { wanted = false; level = 0; if (nodes) { nodes.stop(); nodes = null; } },
    refresh() { if (wanted && level > 0.001) { ensure(); apply(); } else if (nodes && !enabled) { nodes.stop(); nodes = null; } },
    // Preload the optional loop sample; if the bed is already sounding the synth
    // fallback, swap to the sample seamlessly.
    async loadSample() {
      if (tried || !sampleUrl) return;
      tried = true;
      if (!ensureContext()) return;
      try {
        const res = await fetch(sampleUrl);
        if (!res.ok) return; // absent → keep synth fallback, no console noise
        buffer = await ctx.decodeAudioData(await res.arrayBuffer());
        if (nodes) { nodes.stop(); nodes = null; ensure(); apply(); } // swap synth → sample
      } catch { buffer = null; }
    },
  };
}

// Arsenal ambience (synth fallback) — a low detuned space drone (fundamental +
// a fifth) under a lowpass with a slow LFO "breathing" the cutoff + a faint high
// shimmer. Driven by the Arsenal with distance falloff.
const hum = makeBed({
  peak: CONFIG.beds.arsenal.peak,
  sampleUrl: CONFIG.beds.arsenal.sample,
  build: () => {
    const g = ctx.createGain(); g.gain.value = 0.0001;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.Q.value = 0.6;
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 58;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 87; o2.detune.value = 4;
    const o3 = ctx.createOscillator(); o3.type = 'sine'; o3.frequency.value = 464; // faint shimmer
    const sg = ctx.createGain(); sg.gain.value = 0.12;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.18;
    const lfoG = ctx.createGain(); lfoG.gain.value = 60;
    lfo.connect(lfoG).connect(lp.frequency);
    o1.connect(lp); o2.connect(lp); o3.connect(sg).connect(lp);
    lp.connect(g).connect(master);
    [o1, o2, o3, lfo].forEach((o) => o.start());
    return {
      gain: g,
      stop() {
        const t = now();
        g.gain.setTargetAtTime(0.0001, t, 0.2);
        [o1, o2, o3, lfo].forEach((o) => { try { o.stop(t + 0.6); } catch { /* already stopped */ } });
        setTimeout(() => { [o1, o2, o3, lfo, lfoG, sg, lp, g].forEach((n) => n.disconnect()); }, 800);
      },
    };
  },
});

// Hero astrolabe (synth fallback) — a SLOW revolving gear: a continuous low
// rotational rumble (tremolo'd by a ~0.5 Hz "turn") under slow, sharp gear-tooth
// clicks (~1.6 Hz, resonant metallic noise gated by an inverted saw LFO). Reads
// as a big outer gear turning. Hero-local, scroll-faded.
const watch = makeBed({
  peak: CONFIG.beds.hero.peak,
  sampleUrl: CONFIG.beds.hero.sample,
  build: () => {
    const g = ctx.createGain(); g.gain.value = 0.0001;

    // Continuous rotational rumble (the gear turning).
    const rumble = ctx.createOscillator(); rumble.type = 'sawtooth'; rumble.frequency.value = 64;
    const rumLp = ctx.createBiquadFilter(); rumLp.type = 'lowpass'; rumLp.frequency.value = 180; rumLp.Q.value = 0.5;
    const rumG = ctx.createGain(); rumG.gain.value = 0.16;
    const turn = ctx.createOscillator(); turn.type = 'sine'; turn.frequency.value = 0.5; // ~one revolution / 2s
    const turnAmt = ctx.createGain(); turnAmt.gain.value = 0.07;
    turn.connect(turnAmt).connect(rumG.gain);
    rumble.connect(rumLp).connect(rumG).connect(g);

    // Slow gear-tooth clicks: resonant noise gated by a slow inverted saw LFO.
    const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 25;
    const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1150; bp2.Q.value = 7;
    const gate = ctx.createGain(); gate.gain.value = 0.015;
    const lfo = ctx.createOscillator(); lfo.type = 'sawtooth'; lfo.frequency.value = 18; // slow teeth
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = -0.15; // inverted → sharp tick + decay
    lfo.connect(lfoAmt).connect(gate.gain);
    src.connect(bp).connect(gate);
    src.connect(bp2).connect(gate);
    gate.connect(g);

    g.connect(master);
    [rumble, turn, lfo].forEach((o) => o.start()); src.start();
    return {
      gain: g,
      stop() {
        const t = now();
        g.gain.setTargetAtTime(0.0001, t, 0.2);
        try { src.stop(t + 0.6); } catch { /* already stopped */ }
        [rumble, turn, lfo].forEach((o) => { try { o.stop(t + 0.6); } catch { /* already stopped */ } });
        setTimeout(() => { [rumble, rumLp, rumG, turn, turnAmt, src, bp, bp2, gate, lfo, lfoAmt, g].forEach((n) => n.disconnect()); }, 800);
      },
    };
  },
});

/** Preload both ambient-bed loop samples (graceful if absent). */
function loadBeds() {
  hum.loadSample();
  watch.loadSample();
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Resume the context (must be called from inside a user gesture). */
function unlock() {
  if (!ensureContext()) return;
  if (pageActive && ctx.state === 'suspended') ctx.resume().catch(() => {});
  unlocked = true;
  applyMaster();
  hum.refresh();
  watch.refresh();
}

// Page in view → resume; tab/window switched away → suspend (truly stops the
// clock, so beds + any in-flight cue freeze until we're back). Sound only ever
// plays while the page is actually on screen.
function setPageActive(active) {
  pageActive = active;
  if (!ctx) return;
  if (active && unlocked && enabled) ctx.resume().catch(() => {});
  else ctx.suspend().catch(() => {});
}

/** Attach the one-time gesture unlock + the page-visibility gating. Idempotent. */
function arm() {
  if (armed || typeof window === 'undefined') return;
  armed = true;
  const onGesture = () => unlock();
  window.addEventListener('pointerdown', onGesture, { once: true, passive: true });
  window.addEventListener('keydown', onGesture, { once: true });
  window.addEventListener('touchstart', onGesture, { once: true, passive: true });

  pageActive = document.visibilityState !== 'hidden' && document.hasFocus();
  const sync = () => setPageActive(document.visibilityState !== 'hidden' && document.hasFocus());
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('blur', () => setPageActive(false));
  window.addEventListener('focus', sync);
}

function setEnabled(v) {
  enabled = !!v;
  if (ctx) { applyMaster(); if (v && pageActive && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  hum.refresh();
  watch.refresh();
}

function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (ctx) applyMaster();
}

/** Fire a one-shot cue by name (no-op until unlocked + enabled + page in view). */
function playCue(name, opts) {
  if (!unlocked || !enabled || !pageActive || reduceMotion()) return;
  if (!ensureContext()) return;
  const t0 = now() + 0.001;
  if (name === 'raven') return playRaven(t0);
  const fn = CUES[name];
  if (fn) fn(t0, opts || {});
}

export const sound = {
  arm,
  unlock,
  setEnabled,
  setVolume,
  playCue,
  loadRaven,
  loadBeds,
  hum,
  watch,
  reduceMotion,
};

export { playCue };
