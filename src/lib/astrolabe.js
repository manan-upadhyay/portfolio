// The living astrolabe — the hero's Canvas2D instrument, extracted from the
// section so Hero.jsx stays presentational. Pure DOM/Canvas (no React): mount it
// onto a <canvas> inside a square wrapper and it assembles, drifts, and tracks the
// pointer; call the returned cleanup to tear it all down.
//
// All color is read live from CSS theme tokens; call `refresh()` on theme change
// to re-read them WITHOUT a remount (so an in-progress bezel sky-scrub survives a
// live theme change — see `useAstrolabe` + TM-1).

import { isOverlayOpen } from './uiOverlay';

// Deterministic PRNG so the constellation field is stable across renders.
const makeRng = (seed) => {
  let s = seed % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

const TWO_PI = Math.PI * 2;
const ASSEMBLE = 2.4; // seconds for the full instrument to assemble

// Bezel sky-scrub (TM-1): the degree ring is a 4-stop dial; turning it a quarter
// turn advances one stop (dawn→day→dusk→night). Hit band is the annulus around
// the outer ring (× R) — generous enough to grab, clear of the pivot/needle.
const STOPS = 4;
const STOP_ANGLE = TWO_PI / STOPS; // a quarter turn per sky
const BEZEL_IN = 0.78;  // inner hit radius (× R)
const BEZEL_OUT = 1.12; // outer hit radius (× R)
// Instrument radius as a fraction of the canvas half-extent. Leaves a margin
// OUTSIDE the ring for the curved label + the hover glow so neither clips at the
// canvas edge. Used everywhere R is derived (draw, label, hit-test) so they agree.
const RADIUS = 0.8;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
const seg = (el, s, d) => Math.max(0, Math.min((el - s) / d, 1)); // staged sub-progress

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} wrap  square wrapper that sizes the canvas
 * @param {{ bearingEl?: HTMLElement|null, onSpeed?: (radPerSec: number) => void }} [opts]
 *        optional live bearing readout + a per-frame needle angular-speed report
 *        (rad/s, smoothed) — used to drive the gear sound in sync with the needle.
 * @returns {() => void} cleanup
 */
export function mountAstrolabe(canvas, wrap, { bearingEl, onSpeed, onDetent, onSkyCommit, onScrub, ringLabel = '' } = {}) {
  const c = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none)').matches;
  // Fine pointers only — coarse/touch keep tap-to-aim + native scroll (a rotate-
  // drag can't be told apart from a scroll-drag). Declared early: the curved label
  // builder + hover affordance gate on it.
  const bezelEnabled = !reduce && !coarse;

  // Pull colors from the theme tokens so the instrument is never off-palette.
  // Re-read on demand (refresh()) so a live theme change re-tints in place.
  let ember, gold, muted, text, emberRgb, goldRgb;
  const readTokens = () => {
    const s = getComputedStyle(document.documentElement);
    const tok = (n, fb) => s.getPropertyValue(n).trim() || fb;
    ember = tok('--color-ember', '#E8965A');
    gold = tok('--color-gold', '#D9A441');
    muted = tok('--color-text-muted', '#9AA3B5');
    text = tok('--color-text', '#ECE7DB');       // theme-adaptive ink for the label (legible on both bases)
    emberRgb = tok('--color-ember-rgb', '232, 150, 90');
    goldRgb = tok('--color-gold-rgb', '217, 164, 65');
  };
  readTokens();

  let size = 0;
  let dpr = 1;
  let rect = { left: 0, top: 0, width: 0, height: 0 };
  const mouse = { x: null, y: null };
  let cur = -Math.PI / 2; // current alidade angle (points "up" = N = Origin)
  let prevCur = cur;      // alidade angle last frame (for angular-speed reporting)
  let prevTs = 0;         // ts last frame
  let needleSpeed = 0;    // smoothed |dθ/dt| in rad/s (drives the gear sound)
  let lastDeg = -1;
  let raf;
  let onScreen = true; // rAF is paused while the instrument is scrolled out of view (perf)

  // Free-spin physics (the "spin the wheel" flick): a flick winds the alidade up
  // to a peak velocity, then friction bleeds it off so it coasts to a natural stop.
  let spinning = false;
  let spinVel = 0;        // current angular velocity, rad/s (signed)
  let spinDir = 1;        // ±1 spin direction
  let spinPeak = 0;       // velocity the wind-up is climbing toward, rad/s
  let spinUp = 0;         // 0..1 wind-up progress
  const SPIN_UP = 0.32;       // seconds to reach peak velocity
  const SPIN_FRICTION = 0.16; // fraction of velocity retained per second (decay)
  const SPIN_STOP = 0.6;      // rad/s below which the coast settles to rest
  const start = performance.now();

  // Bezel sky-scrub (TM-1) state. `bezelRot` is the live rotation of the degree
  // ring (radians); it eases toward `bezelTarget` (a snapped stop) when idle and
  // is driven directly by the pointer while dragging. `stopIndex` is the absolute
  // stop the ring rests on (mod STOPS → sky); Hero aligns it via setStop().
  let bezelRot = 0;
  let bezelTarget = 0;
  let prevBezelRot = 0;
  let stopIndex = 0;
  let dragging = false;
  let previewing = false;  // a continuous sky preview is live (drag + post-release settle)
  let dragAngle = 0;       // pointer angle around centre, last move (for delta)
  let dragCx = 0, dragCy = 0; // centre cached at grab (no per-move layout reads)
  let lastCursor = '';     // only write canvas.style.cursor when it actually changes
  let introComplete = reduce; // gate: no scrub until the instrument has assembled

  // Discoverability affordance: a feathered ring glow + a persistent curved label
  // ("turn to change the sky") that brightens on hover. (No arrows — they read as
  // needle controls.)
  let bezelHover = false;
  let affordA = 0;         // 0..1 smoothed affordance opacity
  let labelCanvas = null;  // pre-rendered curved label sprite (blitted, not re-laid each frame)
  let label = ringLabel;   // current label text
  let labelAlpha = 0;      // 0..1 blit opacity (base + hover boost)

  // Sparks thrown off the ring as it grinds round (velocity-driven, real-ish
  // physics: tangential launch + gravity + air drag + fade). Pooled + capped.
  const SPARK_MAX = 80;
  const sparks = [];
  const emitSparks = (px, py, dir, mag) => {
    const ang = Math.atan2(py, px);
    const tx = -Math.sin(ang) * dir, ty = Math.cos(ang) * dir; // tangential (spin dir)
    const ox = Math.cos(ang), oy = Math.sin(ang);              // outward (off the rim)
    const n = Math.min(3, 1 + ((mag * 8) | 0));
    for (let k = 0; k < n && sparks.length < SPARK_MAX; k++) {
      const sp = 60 + mag * 620 + Math.random() * 90; // px/s
      const j = (Math.random() - 0.5) * 0.7;          // angular jitter
      const vx = (tx * Math.cos(j) - ty * Math.sin(j)) * sp + ox * 36;
      const vy = (tx * Math.sin(j) + ty * Math.cos(j)) * sp + oy * 36;
      sparks.push({ x: px, y: py, vx, vy, life: 0, max: 0.42 + Math.random() * 0.42, sz: 0.8 + Math.random() * 1.7 });
    }
  };

  // Seeded constellation field on the inner disc.
  const rng = makeRng(1337);
  const stars = Array.from({ length: 46 }, () => ({
    a: rng() * TWO_PI,
    rad: 0.16 + rng() * 0.52,
    s: 0.6 + rng() * 1.7,
    tw: rng() * TWO_PI,
  }));
  const links = [[2, 8], [8, 15], [15, 21], [3, 11], [11, 19], [19, 27], [27, 33], [5, 13], [13, 23]];

  // Pre-render the curved guidance label ("turn to change the sky") + a sci-fi
  // rotation cue (a thin arc with arrowheads) to an offscreen sprite ONCE, so the
  // frame loop just blits it (curved per-char fillText every frame is a perf trap).
  // Rebuilt on size/theme/label change.
  const buildLabel = () => {
    if (!bezelEnabled || !label || !size) { labelCanvas = null; return; }
    const lc = labelCanvas || document.createElement('canvas');
    labelCanvas = lc;
    lc.width = Math.round(size * dpr);
    lc.height = Math.round(size * dpr);
    const lx = lc.getContext('2d');
    lx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lx.clearRect(0, 0, size, size);
    lx.translate(size / 2, size / 2);
    const R = (size / 2) * RADIUS;
    const tr = R * 1.15;                      // text baseline radius (outside the ring + cardinals, within the canvas)
    const txt = label.toUpperCase();
    lx.font = `600 ${Math.max(9, Math.round(R * 0.05))}px "Plus Jakarta Sans", sans-serif`;
    lx.textAlign = 'center'; lx.textBaseline = 'middle';
    lx.fillStyle = text; // theme-adaptive ink → legible on light AND dark skies
    const chars = [...txt];
    const tracking = R * 0.02;
    const widths = chars.map((ch) => lx.measureText(ch).width + tracking);
    const totalAng = widths.reduce((a, b) => a + b, 0) / tr;
    let ang = -totalAng / 2;                  // centre the text on top (−90°)
    for (let i = 0; i < chars.length; i++) {
      ang += (widths[i] / tr) / 2;
      lx.save(); lx.rotate(ang); lx.translate(0, -tr); lx.fillText(chars[i], 0, 0); lx.restore();
      ang += (widths[i] / tr) / 2;
    }
    // sci-fi rotation cue — a compact chevron flanking each end of the text at the
    // SAME radius (no extra radial reach → can't clip), pointing round the dial.
    const endHalf = totalAng / 2 + 0.1;
    lx.strokeStyle = ember; lx.globalAlpha = 0.65; lx.lineWidth = Math.max(1, R * 0.007); lx.lineCap = 'round';
    const chevron = (a, dir) => {
      const px = Math.cos(a) * tr, py = Math.sin(a) * tr;
      const tang = a + dir * Math.PI / 2;    // point along the rotation direction
      const hl = R * 0.03;
      lx.beginPath();
      lx.moveTo(px - Math.cos(tang - 0.5) * hl, py - Math.sin(tang - 0.5) * hl);
      lx.lineTo(px, py);
      lx.lineTo(px - Math.cos(tang + 0.5) * hl, py - Math.sin(tang + 0.5) * hl);
      lx.stroke();
    };
    chevron(-Math.PI / 2 - endHalf, -1);
    chevron(-Math.PI / 2 + endHalf, 1);
    lx.globalAlpha = 1;
  };

  const setSize = () => {
    size = wrap.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    rect = canvas.getBoundingClientRect();
    buildLabel();
  };
  const updateRect = () => { rect = canvas.getBoundingClientRect(); };

  const draw = (ts) => {
    const el = reduce ? 99 : (ts - start) / 1000; // elapsed seconds
    const R = (size / 2) * RADIUS;
    const introDone = el >= ASSEMBLE;
    const ambient = introDone ? (el - ASSEMBLE) * 0.05 : 0; // slow drift, post-assembly

    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, size, size);
    c.save();
    c.translate(size / 2, size / 2);

    // Soft ember aura — arrives with the outer ring.
    const pAura = easeOut(seg(el, 0, 0.6));
    const aura = c.createRadialGradient(0, 0, R * 0.1, 0, 0, R * 1.15);
    aura.addColorStop(0, `rgba(${emberRgb}, ${0.12 * pAura})`);
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = aura;
    c.beginPath(); c.arc(0, 0, R * 1.15, 0, TWO_PI); c.fill();

    // Concentric rings — each scales in with a subtle overshoot, staggered.
    const ring = (rad, col, a, w, s, d) => {
      const p = seg(el, s, d);
      if (p <= 0) return;
      c.beginPath(); c.arc(0, 0, rad * (0.72 + 0.28 * easeOutBack(p)), 0, TWO_PI);
      c.strokeStyle = col; c.globalAlpha = a * easeOut(p); c.lineWidth = w; c.stroke();
    };
    ring(R, ember, 0.55, 1.4, 0.0, 0.55);
    ring(R - 22, muted, 0.3, 1, 0.45, 0.45);
    ring(R * 0.68, ember, 0.4, 1.2, 0.6, 0.45);
    ring(R * 0.4, gold, 0.5, 1, 1.0, 0.4);

    // Degree bezel — ticks sweep on from N, one arc at a time.
    const pB = easeOut(seg(el, 0.3, 0.85));
    const ticks = Math.floor(72 * pB);
    c.save(); c.rotate((introDone ? ambient : -0.5 * (1 - pB)) + bezelRot);
    // Two batched strokes (minor + major) instead of 72 individual stroke() calls.
    c.lineWidth = 1; c.strokeStyle = muted; c.globalAlpha = Math.min(0.4 + affordA * 0.3, 1);
    c.beginPath();
    for (let i = 0; i < ticks; i++) {
      if (i % 6 === 0) continue;
      const ang = (i / 72) * TWO_PI - Math.PI / 2, r2 = R - 8;
      c.moveTo(Math.cos(ang) * R, Math.sin(ang) * R); c.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
    }
    c.stroke();
    c.lineWidth = 1.4; c.strokeStyle = gold; c.globalAlpha = Math.min(0.85 + affordA * 0.3, 1);
    c.beginPath();
    for (let i = 0; i < ticks; i += 6) {
      const ang = (i / 72) * TWO_PI - Math.PI / 2, r2 = R - 16;
      c.moveTo(Math.cos(ang) * R, Math.sin(ang) * R); c.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
    }
    c.stroke();
    c.restore();

    // Constellation disc — lines fade in, stars pop with a stagger.
    c.save(); c.rotate(-ambient * 0.6);
    const pLines = easeOut(seg(el, 1.2, 0.5));
    c.strokeStyle = `rgba(${goldRgb}, ${0.25 * pLines})`; c.lineWidth = 0.8; c.globalAlpha = 1;
    c.beginPath(); // one batched path for all constellation links
    links.forEach(([a, b]) => {
      const s1 = stars[a], s2 = stars[b];
      c.moveTo(Math.cos(s1.a) * s1.rad * R, Math.sin(s1.a) * s1.rad * R);
      c.lineTo(Math.cos(s2.a) * s2.rad * R, Math.sin(s2.a) * s2.rad * R);
    });
    c.stroke();
    stars.forEach((st, i) => {
      const sp = seg(el, 0.8 + (i / stars.length) * 0.5, 0.45);
      if (sp <= 0) return;
      const tw = introDone ? 0.6 + 0.4 * Math.sin(ts / 700 + st.tw) : 1;
      c.beginPath();
      c.arc(Math.cos(st.a) * st.rad * R, Math.sin(st.a) * st.rad * R, Math.max(st.s * (0.3 + 0.7 * easeOutBack(sp)), 0.2), 0, TWO_PI);
      c.fillStyle = gold; c.globalAlpha = 0.7 * easeOut(sp) * tw; c.fill();
    });
    c.restore();

    // Cardinal letters (N stays "up" = Origin).
    const pC = easeOut(seg(el, 1.15, 0.45));
    if (pC > 0) {
      c.fillStyle = ember;
      c.font = `600 ${Math.round(R * 0.07)}px "Plus Jakarta Sans", sans-serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      // Letter radius sits just outside the outer ring (R). Proportional to R — and
      // safely within the canvas half-extent (R / 0.9 ≈ 1.111·R) once the glyph's
      // half-height is added — so the cardinals read identically at every size.
      const lr = R * 1.06;
      [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([l, dx, dy]) => {
        c.globalAlpha = pC * (l === 'N' ? 1 : 0.5);
        c.fillText(l, dx * lr, dy * lr);
      });
    }

    // Alidade (the cursor-tracking needle) — angle `cur` is set in the loop.
    const pA = easeOut(seg(el, 0.95, 0.4));
    if (pA > 0) {
      c.save(); c.rotate(cur);
      c.globalAlpha = pA;
      // Soft glow via a wider translucent underlay — a per-frame canvas shadowBlur
      // is one of the most expensive 2D ops, so we fake the glow with a cheap stroke.
      c.strokeStyle = `rgba(${emberRgb}, 0.3)`; c.lineWidth = 5;
      c.beginPath(); c.moveTo(-R * 0.8, 0); c.lineTo(R * 0.9, 0); c.stroke();
      c.strokeStyle = ember; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-R * 0.8, 0); c.lineTo(R * 0.9, 0); c.stroke();
      c.fillStyle = ember;
      c.beginPath(); c.moveTo(R * 0.9, 0); c.lineTo(R * 0.83, -7); c.lineTo(R * 0.83, 7); c.closePath(); c.fill();
      c.fillStyle = gold;
      c.beginPath(); c.arc(-R * 0.8, 0, 4, 0, TWO_PI); c.fill();
      c.restore();

      // Pivot cap — anchors the alidade to the rose's heart so it reads as
      // pinned and rotating, not floating. Drawn unrotated, on top of the needle.
      c.globalAlpha = pA;
      c.fillStyle = `rgba(${emberRgb}, 0.16)`;
      c.beginPath(); c.arc(0, 0, 9, 0, TWO_PI); c.fill();
      c.fillStyle = ember;
      c.beginPath(); c.arc(0, 0, 5, 0, TWO_PI); c.fill();
      c.fillStyle = gold;
      c.beginPath(); c.arc(0, 0, 2, 0, TWO_PI); c.fill();
      c.globalAlpha = 1;
    }

    // Affordance — the OUTER RING blooms with a FEATHERED ember glow on hover (a
    // soft radial band centred on the rim, not a hard stroke), plus a crisp ring
    // line for definition. Glowing the ring itself = unambiguous "this is what turns".
    if (affordA > 0.01 && introDone) {
      c.save();
      // Subtle feathered band hugging the rim — stays well inside the canvas so it
      // never clips at the edge; peaks gently right on the ring.
      const glow = c.createRadialGradient(0, 0, R * 0.94, 0, 0, R * 1.08);
      glow.addColorStop(0, `rgba(${emberRgb}, 0)`);
      glow.addColorStop(0.5, `rgba(${emberRgb}, ${0.13 * affordA})`);
      glow.addColorStop(1, `rgba(${emberRgb}, 0)`);
      c.fillStyle = glow;
      c.beginPath(); c.arc(0, 0, R * 1.08, 0, TWO_PI); c.fill();
      c.beginPath(); c.arc(0, 0, R, 0, TWO_PI);
      c.strokeStyle = `rgba(${emberRgb}, ${0.42 * affordA})`; c.lineWidth = 1.4; c.stroke();
      c.restore();
    }

    // Sparks — ground out off the rim while the ring grinds round. Additive so
    // they read as embers, not dots. Drawn last so they sit over the instrument.
    if (sparks.length) {
      c.save();
      c.globalCompositeOperation = 'lighter';
      for (const s of sparks) {
        const p = 1 - s.life / s.max; // 1→0 over life
        c.globalAlpha = p * p;
        c.fillStyle = p > 0.5 ? `rgba(${emberRgb}, 1)` : `rgba(${goldRgb}, 1)`;
        c.beginPath(); c.arc(s.x, s.y, s.sz * (0.55 + 0.45 * p), 0, TWO_PI); c.fill();
      }
      c.restore();
    }

    c.restore();

    // Curved guidance label (pre-rendered sprite) — subtle + persistent, brighter
    // on hover. Blitted in untranslated space (the sprite already has absolute
    // positions). Drawn over everything so it always reads.
    if (labelCanvas && labelAlpha > 0.01) {
      c.globalAlpha = labelAlpha;
      c.drawImage(labelCanvas, 0, 0, size, size);
      c.globalAlpha = 1;
    }
  };

  const loop = (ts) => {
    const el = (ts - start) / 1000;
    const introDone = reduce || el >= ASSEMBLE;
    // Frame delta, clamped so a tab-refocus stall can't teleport the needle.
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.05) : 0;
    let frameSpeed = null; // explicit rad/s for the gear sound (free spin path)
    try {
    if (reduce) {
      cur = -Math.PI / 2;
    } else if (introDone && isOverlayOpen()) {
      // A menu/modal is in front (the instrument is blurred behind and no longer
      // the focus). Go dormant: hold the needle still and report zero motion so
      // the gear sound falls silent — cursor moves inside the overlay must not
      // swing the alidade or make a sound.
      frameSpeed = 0;
    } else if (dragging) {
      // Bezel sky-scrub in progress: hold the needle still. The gear sound is
      // driven by the ring's angular speed instead (computed after draw).
    } else if (!introDone) {
      // Dramatic multi-turn spin that decelerates into "up" (Origin).
      const pA = easeOut(seg(el, 0.95, 1.45));
      cur = -Math.PI / 2 + (1 - pA) * (TWO_PI * 2 + 0.6);
    } else if (spinning) {
      // Wind up to peak, then let friction bleed the velocity off (a flywheel).
      if (spinUp < 1) {
        spinUp = Math.min(1, spinUp + (dt > 0 ? dt : 0.016) / SPIN_UP);
        spinVel = spinDir * spinPeak * easeOut(spinUp);
      } else {
        spinVel *= Math.pow(SPIN_FRICTION, dt);
      }
      cur += spinVel * dt;
      frameSpeed = Math.abs(spinVel);
      if (spinUp >= 1 && Math.abs(spinVel) < SPIN_STOP) {
        spinning = false;
        spinVel = 0;
        cur = Math.atan2(Math.sin(cur), Math.cos(cur)); // settle to a clean angle
      }
    } else if (mouse.x === null) {
      // No pointer yet — gentle idle drift. On a pointer device this lasts until
      // the first cursor move; on touch, until the first tap (see `onTap`).
      cur += (-Math.PI / 2 + Math.sin(ts / 2600) * 0.5 - cur) * 0.04;
    } else {
      // Track the pointer/last tap: ease the needle toward it (and report the
      // motion, so the gear sound winds with the swing and falls silent at rest).
      // On desktop this follows the live cursor; on mobile it swings to each tap.
      const target = Math.atan2(mouse.y - (rect.top + rect.height / 2), mouse.x - (rect.left + rect.width / 2));
      let d = target - cur;
      while (d > Math.PI) d -= TWO_PI;
      while (d < -Math.PI) d += TWO_PI;
      cur += d * (coarse ? 0.12 : 0.08); // a touch snappier on tap-driven devices
    }
    draw(ts);

    // Bezel sky-scrub: once assembled, ease the ring toward its snapped stop when
    // the visitor isn't turning it; while dragging, its angular speed feeds the
    // gear sound so the ring turn is audible exactly like the needle's swing.
    introComplete = introComplete || introDone;
    if (!dragging && !reduce) bezelRot += (bezelTarget - bezelRot) * 0.18;
    if (dragging && dt > 0) frameSpeed = Math.abs(bezelRot - prevBezelRot) / dt;

    // Continuous sky preview — the theme cross-dissolves in lock-step with the ring
    // (so transition speed = rotation speed), through the drag AND the post-release
    // settle. The actual sky commits only when the ring comes to rest on a stop, so
    // there's no hard mid-rotation swap/flash.
    if (previewing) {
      if (onScrub) onScrub(bezelRot / STOP_ANGLE);
      if (!dragging && Math.abs(bezelRot - bezelTarget) < 0.0016) {
        bezelRot = bezelTarget;
        previewing = false;
        const raw = Math.round(bezelRot / STOP_ANGLE);
        stopIndex = raw;
        if (onScrub) onScrub(bezelRot / STOP_ANGLE);
        if (onSkyCommit) onSkyCommit(((raw % STOPS) + STOPS) % STOPS);
      }
    }

    if (bezelEnabled && introDone) {
      // Hover state from the cached rect (no per-frame layout read).
      if (!dragging) {
        if (mouse.x !== null) {
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          const Rpx = (rect.width / 2) * RADIUS;
          const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
          bezelHover = dist >= Rpx * BEZEL_IN && dist <= Rpx * BEZEL_OUT;
        } else bezelHover = false;
        const want = bezelHover ? 'grab' : '';
        if (want !== lastCursor) { canvas.style.cursor = want; lastCursor = want; }
      }
      const affTarget = dragging || bezelHover ? 1 : 0;
      affordA += (affTarget - affordA) * 0.12;
      // Label: present-but-quiet once assembled, brighter on hover/turn.
      labelAlpha = Math.min(0.44 + affordA * 0.5, 0.95);
    }

    // Spark physics — integrate + cull. Only runs while embers are alive.
    if (sparks.length) {
      const grav = 540; // px/s²
      const drag = Math.pow(0.1, dt); // air resistance
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) { sparks.splice(i, 1); continue; }
        s.vy += grav * dt; s.vx *= drag; s.vy *= drag;
        s.x += s.vx * dt; s.y += s.vy * dt;
      }
    }

    // Report the needle's angular speed (rad/s, smoothed) so the gear sound can
    // turn exactly as fast as the alidade does — silent when it's at rest. During
    // a free spin we know the velocity exactly, so use it (avoids a wrap spike).
    if (onSpeed) {
      const inst = frameSpeed != null ? frameSpeed : (dt > 0 ? Math.abs(cur - prevCur) / dt : 0);
      needleSpeed += (inst - needleSpeed) * 0.2; // low-pass to tame frame jitter
      // Tag the source so the needle gear + the ring grind stay distinct sounds.
      onSpeed(needleSpeed, dragging ? 'bezel' : 'needle');
    }
    prevCur = cur;
    prevBezelRot = bezelRot;

    if (bearingEl) {
      const deg = Math.round((((cur + Math.PI / 2) * 180) / Math.PI % 360 + 360) % 360);
      if (deg !== lastDeg) {
        lastDeg = deg;
        const charting = introDone && !reduce && !coarse && mouse.x !== null;
        const state = spinning ? 'spinning' : charting ? 'charting' : 'origin';
        bearingEl.textContent = `bearing ${String(deg).padStart(3, '0')}° · ${state}`;
      }
    }
    } catch { /* never let one bad frame kill the loop → no frozen needle / stuck sound */ }
    prevTs = ts; // always advance (even after a caught error) so dt can't explode
    if (!reduce && onScreen) raf = requestAnimationFrame(loop);
  };

  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(wrap);

  // Pause the whole rAF loop while the instrument is scrolled off-screen — no point
  // redrawing an invisible canvas (and it frees the frame budget for the page).
  let io = null;
  if (typeof IntersectionObserver !== 'undefined' && !reduce) {
    io = new IntersectionObserver((entries) => {
      const vis = entries.some((e) => e.isIntersecting);
      if (vis && !onScreen) { onScreen = true; prevTs = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
      onScreen = vis;
    }, { threshold: 0 });
    io.observe(wrap);
  }
  const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  // A tap aims the needle too — the key path on touch, where `pointermove` may
  // never fire. The needle swings to wherever the visitor tapped (and the swing
  // sounds the gear), giving mobile its own version of the cursor-tracking feel.
  const onTap = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; updateRect(); };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerdown', onTap, { passive: true });
  window.addEventListener('scroll', updateRect, { passive: true });
  window.addEventListener('resize', updateRect);
  raf = requestAnimationFrame(loop); // runs once under reduced-motion (no reschedule)

  // ── Bezel sky-scrub (TM-1): grab the degree ring and turn it to set the sky.
  //    The canvas is pointer-events:none via the wrap, so we opt it back in here.
  //    (`bezelEnabled` is declared up top — the label builder needs it early.)
  const bezelGeom = () => {
    const r = canvas.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: (r.width / 2) * RADIUS };
  };
  // Move/up live on WINDOW for the duration of a drag (not the canvas) so the grab
  // survives the pointer leaving the small canvas box — the cause of the "only the
  // right edge worked / needle stayed locked after release" bugs (a pointerup that
  // landed off-canvas was never heard, so `dragging` never cleared).
  const onBezelMove = (e) => {
    if (!dragging) return;
    // Use the geometry cached at grab — no getBoundingClientRect per move (that
    // forced-layout-per-pointermove was the drag-time jank).
    const a = Math.atan2(e.clientY - dragCy, e.clientX - dragCx);
    let d = a - dragAngle;        // shortest signed angular step since last move
    while (d > Math.PI) d -= TWO_PI;
    while (d < -Math.PI) d += TWO_PI;
    dragAngle = a;
    bezelRot += d;
    if (Math.abs(d) > 0.002) emitSparks(e.clientX - dragCx, e.clientY - dragCy, Math.sign(d), Math.min(Math.abs(d), 0.26));
    const idx = Math.round(bezelRot / STOP_ANGLE);
    if (idx !== stopIndex) {       // crossed a detent → tick + live theme step
      stopIndex = idx;
      onDetent && onDetent(((idx % STOPS) + STOPS) % STOPS);
    }
  };
  const onBezelUp = (e) => {
    if (!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture?.(e.pointerId); } catch { /* noop */ }
    canvas.style.cursor = ''; lastCursor = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    window.removeEventListener('pointermove', onBezelMove);
    window.removeEventListener('pointerup', onBezelUp);
    window.removeEventListener('pointercancel', onBezelUp);
    // Ease to the NEAREST stop; the loop's preview keeps cross-dissolving during
    // the settle and commits the sky only once the ring comes to rest (no flash).
    bezelTarget = Math.round(bezelRot / STOP_ANGLE) * STOP_ANGLE;
  };
  const onBezelDown = (e) => {
    if (!introComplete || isOverlayOpen()) return;
    const { cx, cy, R } = bezelGeom();
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < R * BEZEL_IN || dist > R * BEZEL_OUT) return; // off the ring → ignore
    dragging = true;
    previewing = true; // begin the continuous cross-dissolve
    dragCx = cx; dragCy = cy; // freeze centre for the drag (no per-move layout)
    dragAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    prevBezelRot = bezelRot;
    canvas.style.cursor = 'grabbing'; lastCursor = 'grabbing';
    document.body.style.userSelect = 'none';        // kill text selection while turning
    document.body.style.webkitUserSelect = 'none';
    try { canvas.setPointerCapture?.(e.pointerId); } catch { /* unsupported */ }
    window.addEventListener('pointermove', onBezelMove);
    window.addEventListener('pointerup', onBezelUp);
    window.addEventListener('pointercancel', onBezelUp);
    e.preventDefault();
  };
  if (bezelEnabled) {
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('pointerdown', onBezelDown);
  }

  // Flick the alidade into a free spin. Each call winds it up (adding momentum if
  // it's already turning) and friction coasts it to a natural stop. No-op under
  // reduced motion, where the loop doesn't run.
  const spin = () => {
    if (reduce) return;
    spinDir = spinning ? spinDir : Math.random() < 0.5 ? -1 : 1;
    // A fresh, satisfying flick (~3–4 turns/sec peak); a re-flick adds momentum.
    spinPeak = Math.min((spinning ? Math.abs(spinVel) : 0) + 18 + Math.random() * 6, 40);
    spinUp = 0;
    spinning = true;
  };

  // Align the resting bezel to a sky stop (called by Hero on mount + sky change so
  // the ring always reflects the live sky). No-op mid-drag — the drag owns the
  // ring + the detent baseline then, so a live commit must not reset it.
  const setStop = (i) => {
    if (dragging) return;
    stopIndex = i;
    bezelTarget = i * STOP_ANGLE;
    bezelRot = bezelTarget;
  };

  // Re-read theme tokens in place (no remount) — keeps an in-progress scrub alive.
  // Rebuild the label sprite too (its ink is the ember token).
  const refresh = () => { readTokens(); buildLabel(); };

  // Update the curved guidance label (voice-aware copy comes from Hero/i18n).
  const setLabel = (str) => { label = str || ''; buildLabel(); };

  const destroy = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io?.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onTap);
    window.removeEventListener('scroll', updateRect);
    window.removeEventListener('resize', updateRect);
    window.removeEventListener('pointermove', onBezelMove);
    window.removeEventListener('pointerup', onBezelUp);
    window.removeEventListener('pointercancel', onBezelUp);
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    if (bezelEnabled) {
      canvas.removeEventListener('pointerdown', onBezelDown);
      canvas.style.pointerEvents = '';
      canvas.style.cursor = '';
    }
  };

  return { destroy, spin, setStop, refresh, setLabel };
}
