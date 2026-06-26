// The living astrolabe — the hero's Canvas2D instrument, extracted from the
// section so Hero.jsx stays presentational. Pure DOM/Canvas (no React): mount it
// onto a <canvas> inside a square wrapper and it assembles, drifts, and tracks the
// pointer; call the returned cleanup to tear it all down.
//
// All color is read live from CSS theme tokens, so re-mount on theme change to
// re-read them (see `useAstrolabe`).

// Deterministic PRNG so the constellation field is stable across renders.
const makeRng = (seed) => {
  let s = seed % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

const TWO_PI = Math.PI * 2;
const ASSEMBLE = 2.4; // seconds for the full instrument to assemble
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
export function mountAstrolabe(canvas, wrap, { bearingEl, onSpeed } = {}) {
  const c = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none)').matches;

  // Pull colors from the theme tokens so the instrument is never off-palette.
  const cs = getComputedStyle(document.documentElement);
  const tok = (n, fallback) => cs.getPropertyValue(n).trim() || fallback;
  const ember = tok('--color-ember', '#E8965A');
  const gold = tok('--color-gold', '#D9A441');
  const muted = tok('--color-text-muted', '#9AA3B5');
  const emberRgb = tok('--color-ember-rgb', '232, 150, 90');
  const goldRgb = tok('--color-gold-rgb', '217, 164, 65');

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

  // Seeded constellation field on the inner disc.
  const rng = makeRng(1337);
  const stars = Array.from({ length: 46 }, () => ({
    a: rng() * TWO_PI,
    rad: 0.16 + rng() * 0.52,
    s: 0.6 + rng() * 1.7,
    tw: rng() * TWO_PI,
  }));
  const links = [[2, 8], [8, 15], [15, 21], [3, 11], [11, 19], [19, 27], [27, 33], [5, 13], [13, 23]];

  const setSize = () => {
    size = wrap.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    rect = canvas.getBoundingClientRect();
  };
  const updateRect = () => { rect = canvas.getBoundingClientRect(); };

  const draw = (ts) => {
    const el = reduce ? 99 : (ts - start) / 1000; // elapsed seconds
    const R = (size / 2) * 0.9;
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
    c.save(); c.rotate(introDone ? ambient : -0.5 * (1 - pB));
    for (let i = 0; i < ticks; i++) {
      const ang = (i / 72) * TWO_PI - Math.PI / 2;
      const major = i % 6 === 0;
      const r2 = R - (major ? 16 : 8);
      c.beginPath();
      c.moveTo(Math.cos(ang) * R, Math.sin(ang) * R);
      c.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
      c.strokeStyle = major ? gold : muted;
      c.globalAlpha = major ? 0.85 : 0.4;
      c.lineWidth = major ? 1.4 : 1;
      c.stroke();
    }
    c.restore();

    // Constellation disc — lines fade in, stars pop with a stagger.
    c.save(); c.rotate(-ambient * 0.6);
    const pLines = easeOut(seg(el, 1.2, 0.5));
    c.strokeStyle = `rgba(${goldRgb}, ${0.25 * pLines})`; c.lineWidth = 0.8; c.globalAlpha = 1;
    links.forEach(([a, b]) => {
      const s1 = stars[a], s2 = stars[b];
      c.beginPath();
      c.moveTo(Math.cos(s1.a) * s1.rad * R, Math.sin(s1.a) * s1.rad * R);
      c.lineTo(Math.cos(s2.a) * s2.rad * R, Math.sin(s2.a) * s2.rad * R);
      c.stroke();
    });
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
      [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([l, dx, dy]) => {
        c.globalAlpha = pC * (l === 'N' ? 1 : 0.5);
        c.fillText(l, dx * (R - 30), dy * (R - 30));
      });
    }

    // Alidade (the cursor-tracking needle) — angle `cur` is set in the loop.
    const pA = easeOut(seg(el, 0.95, 0.4));
    if (pA > 0) {
      c.save(); c.rotate(cur);
      c.globalAlpha = pA;
      c.shadowColor = `rgba(${emberRgb}, 0.7)`; c.shadowBlur = 12;
      c.strokeStyle = ember; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-R * 0.8, 0); c.lineTo(R * 0.9, 0); c.stroke();
      c.shadowBlur = 0;
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

    c.restore();
  };

  const loop = (ts) => {
    const el = (ts - start) / 1000;
    const introDone = reduce || el >= ASSEMBLE;
    // Frame delta, clamped so a tab-refocus stall can't teleport the needle.
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.05) : 0;
    let frameSpeed = null; // explicit rad/s for the gear sound (free spin path)
    if (reduce) {
      cur = -Math.PI / 2;
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
    } else if (coarse || mouse.x === null) {
      cur += (-Math.PI / 2 + Math.sin(ts / 2600) * 0.5 - cur) * 0.04;
    } else {
      const target = Math.atan2(mouse.y - (rect.top + rect.height / 2), mouse.x - (rect.left + rect.width / 2));
      let d = target - cur;
      while (d > Math.PI) d -= TWO_PI;
      while (d < -Math.PI) d += TWO_PI;
      cur += d * 0.08;
    }
    draw(ts);

    // Report the needle's angular speed (rad/s, smoothed) so the gear sound can
    // turn exactly as fast as the alidade does — silent when it's at rest. During
    // a free spin we know the velocity exactly, so use it (avoids a wrap spike).
    if (onSpeed) {
      const inst = frameSpeed != null ? frameSpeed : (dt > 0 ? Math.abs(cur - prevCur) / dt : 0);
      needleSpeed += (inst - needleSpeed) * 0.2; // low-pass to tame frame jitter
      onSpeed(needleSpeed);
    }
    prevCur = cur;
    prevTs = ts;

    if (bearingEl) {
      const deg = Math.round((((cur + Math.PI / 2) * 180) / Math.PI % 360 + 360) % 360);
      if (deg !== lastDeg) {
        lastDeg = deg;
        const charting = introDone && !reduce && !coarse && mouse.x !== null;
        const state = spinning ? 'spinning' : charting ? 'charting' : 'origin';
        bearingEl.textContent = `bearing ${String(deg).padStart(3, '0')}° · ${state}`;
      }
    }
    if (!reduce) raf = requestAnimationFrame(loop);
  };

  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(wrap);
  const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('scroll', updateRect, { passive: true });
  window.addEventListener('resize', updateRect);
  raf = requestAnimationFrame(loop); // runs once under reduced-motion (no reschedule)

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

  const destroy = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', updateRect);
    window.removeEventListener('resize', updateRect);
  };

  return { destroy, spin };
}
