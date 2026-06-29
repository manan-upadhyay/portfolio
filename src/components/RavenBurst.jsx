// ─────────────────────────────────────────────────────────────────────────────
// RavenBurst — a cinematic flock of ravens that erupts from the send button and
// scatters across the page on a successful dispatch, in time with raven.mp3.
//
// Rendered on a single full-screen Canvas2D (one element for the whole flock —
// far cheaper than dozens of animated SVGs) with light flight physics: a startled
// upward-and-outward launch, flap-driven lift over gravity, drag, per-bird wander,
// banking into the velocity, and depth (bigger birds fly faster, nearer, brighter).
//
// Birds are painted in the button's own fill colour (`--btn-bg`) so they read as
// the button itself taking flight — black on the light theme, pale on the dark.
// Honors prefers-reduced-motion (no flock). Portalled to <body>; pointer-through.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const TWO_PI = Math.PI * 2;

// ── Tuning ───────────────────────────────────────────────────────────────────
const COUNT = 64;            // flock size
const LAUNCH_STAGGER = 520;  // ms — spread of the startled takeoff
const LIFE_MS = 2600;        // ms — a single bird's flight before it has faded
const GRAVITY = 360;         // px/s² downward
const DRAG = 0.4;            // velocity damping per second (fraction)
const SPEED_MIN = 240;       // px/s initial burst speed (smallest/farthest bird)
const SPEED_MAX = 620;       // px/s initial burst speed (largest/nearest bird)
const LIFT = 520;            // px/s² peak upward thrust on each downstroke
const SIZE_MIN = 7;          // px half-wingspan (far)
const SIZE_MAX = 17;         // px half-wingspan (near)

const rand = (a, b) => a + Math.random() * (b - a);

/** One raven's initial state. Launches up-and-outward (a startled fan). */
function spawn(cx, cy) {
  const size = rand(SIZE_MIN, SIZE_MAX);
  const depth = (size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN); // 0 far … 1 near
  // Fan biased upward: straight-up to the sides, a few nearly horizontal.
  const ang = -Math.PI / 2 + rand(-1.15, 1.15);
  const speed = SPEED_MIN + depth * (SPEED_MAX - SPEED_MIN) * rand(0.7, 1.1);
  return {
    x: cx + rand(-6, 6),
    y: cy + rand(-4, 4),
    vx: Math.cos(ang) * speed,
    vy: Math.sin(ang) * speed,
    size,
    depth,
    delay: rand(0, LAUNCH_STAGGER) / 1000, // s
    flap: rand(0, TWO_PI),
    flapSpeed: rand(13, 20),               // rad/s wingbeat
    wander: rand(-1, 1),
    wanderPhase: rand(0, TWO_PI),
    heading: ang,
    born: -1, // set when its stagger delay elapses
  };
}

/** Draw a flapping raven (local space, +x = forward) as a filled silhouette. */
function drawBird(ctx, b, col) {
  const s = b.size;
  // One clean wingbeat per cycle: wings sweep wide (downstroke/glide) ↔ narrow &
  // back (upstroke). `beat` 1=wide … -1=closed; `raise` 0=wide … 1=closed.
  const beat = Math.cos(b.flap);
  const raise = 0.5 - 0.5 * beat;
  const ty = s * (0.45 + 0.55 * (1 - raise)); // wingtip lateral spread
  const tx = -s * (0.12 + 0.4 * raise);       // tips sweep back as they raise

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.heading);                  // body (+x = head) points along velocity
  ctx.globalAlpha = b.alpha;
  ctx.fillStyle = col;
  ctx.strokeStyle = col;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Wings — two tapered strokes from the shoulders out to the swept tips.
  ctx.lineWidth = Math.max(s * 0.26, 0.8);
  ctx.beginPath();
  ctx.moveTo(s * 0.12, 0);
  ctx.quadraticCurveTo(-s * 0.05, -ty * 0.55, tx, -ty);
  ctx.moveTo(s * 0.12, 0);
  ctx.quadraticCurveTo(-s * 0.05, ty * 0.55, tx, ty);
  ctx.stroke();

  // Body + head + a hint of tail (a small tapered teardrop).
  ctx.beginPath();
  ctx.moveTo(s * 0.62, 0);                          // head/beak
  ctx.quadraticCurveTo(s * 0.1, s * 0.2, -s * 0.78, s * 0.06);
  ctx.quadraticCurveTo(-s * 0.98, 0, -s * 0.78, -s * 0.06); // tail point
  ctx.quadraticCurveTo(s * 0.1, -s * 0.2, s * 0.62, 0);
  ctx.fill();

  ctx.restore();
}

/**
 * RavenBurst — mount near the send button; pass its ref so the flock erupts from
 * the button. Fires once each time `active` flips true.
 * @param {boolean} active
 * @param {React.RefObject} originRef — the submit button (read live when it fires)
 * @param {{x:number,y:number}} [origin] — explicit viewport launch point; use when
 *        the button unmounts as it succeeds (e.g. a form that swaps to a "done"
 *        panel), captured just before the swap. Takes precedence over `originRef`.
 */
const RavenBurst = ({ active, originRef, origin }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active) { firedRef.current = false; return undefined; }
    if (firedRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Birds are the button taking flight — paint them in its fill colour.
    const col = getComputedStyle(document.documentElement)
      .getPropertyValue('--btn-bg').trim() || '#1F1B16';

    let cx = W / 2;
    let cy = H / 2;
    const el = originRef?.current;
    if (origin) {
      cx = origin.x;
      cy = origin.y;
    } else if (el) {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    }

    const flock = Array.from({ length: COUNT }, () => spawn(cx, cy));
    // Near birds drawn last (over far birds) for depth layering.
    flock.sort((a, b) => a.depth - b.depth);

    const start = performance.now();
    let last = start;

    const frame = (now) => {
      const t = (now - start) / 1000;          // s since burst
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);

      let anyAlive = false;
      for (const b of flock) {
        if (t < b.delay) { anyAlive = true; continue; } // still on the button
        if (b.born < 0) b.born = t;
        const age = (t - b.born) * 1000;        // ms aloft
        if (age > LIFE_MS) continue;
        anyAlive = true;

        // Flap-driven lift over gravity (thrust peaks on the downstroke).
        b.flap += b.flapSpeed * dt;
        const thrust = LIFT * Math.max(0, Math.sin(b.flap));
        b.vy += (GRAVITY - thrust) * dt;
        // Lazy wander so paths curve instead of running dead straight.
        b.wanderPhase += dt * 2.4;
        b.vx += Math.cos(b.wanderPhase) * b.wander * 26 * dt;
        b.vy += Math.sin(b.wanderPhase * 1.3) * b.wander * 16 * dt;
        // Drag.
        const d = 1 - DRAG * dt;
        b.vx *= d; b.vy *= d;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        // Bank into the direction of travel (smoothed).
        const target = Math.atan2(b.vy, b.vx);
        let da = target - b.heading;
        while (da > Math.PI) da -= TWO_PI;
        while (da < -Math.PI) da += TWO_PI;
        b.heading += da * Math.min(1, dt * 10);

        // Quick fade-in on launch, long fade-out at the end of life.
        const p = age / LIFE_MS;
        const fadeIn = Math.min(1, age / 90);
        const fadeOut = p > 0.6 ? 1 - (p - 0.6) / 0.4 : 1;
        b.alpha = (0.55 + 0.45 * b.depth) * fadeIn * fadeOut;

        drawBird(ctx, b, col);
      }

      if (anyAlive) rafRef.current = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active, originRef, origin]);

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}
    />,
    document.body
  );
};

export default RavenBurst;
