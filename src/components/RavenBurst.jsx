// ─────────────────────────────────────────────────────────────────────────────
// RavenBurst — a flock of black ravens that erupt from the button origin and
// fly toward the upper-right, fading as they spread. Each bird has a realistic
// silhouette with articulated wings that flap between up/down positions. The
// flock uses staggered launch, varied sizes, speeds, and angles for a natural
// "startled takeoff" feel. Portalled to <body> to avoid clipping.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

// ── Realistic raven silhouettes ──────────────────────────────────────────────
// Three wing positions for the flap cycle. Each is a side-profile raven viewed
// from below/behind during flight — distinct head+beak, body, tail, and wings
// at different stroke angles. Drawn centered at origin for easy rotation.

// Wings fully raised (upstroke peak)
const WING_UP =
  'M0,0 C-1,-0.5 -2,-1 -3,-0.8 L-4,-0.5 C-4.5,-0.3 -5,0 -5.5,0.2 ' +  // tail
  'L-3,0.3 C-2,0.4 -1,0.5 0,0.3 ' +                                       // lower body
  'C0.5,0.2 1,0.1 1.5,0.3 L2.5,0.5 L3.2,0.3 ' +                          // head+beak
  'C2.8,0 2.5,-0.2 2,-0.3 C1.5,-0.4 1,-0.3 0.5,-0.2 ' +                  // neck
  'M-3.5,-0.4 C-3,-1.5 -2,-3 -0.8,-4.8 C-0.3,-5.5 0,-5.8 0.2,-5.5 ' +   // left wing up
  'C0,-4.8 -0.5,-3.5 -1,-2.2 C-1.5,-1.2 -2,-0.6 -2.5,-0.3 ' +
  'M1.5,-0.2 C1.8,-1.2 2.2,-2.8 3,-4.5 C3.5,-5.2 3.8,-5.5 4,-5.2 ' +    // right wing up
  'C3.6,-4.2 3,-3 2.5,-1.8 C2,-0.8 1.8,-0.4 1.5,-0.2';

// Wings level (mid-stroke glide)
const WING_MID =
  'M0,0 C-1,-0.5 -2,-1 -3,-0.8 L-4,-0.5 C-4.5,-0.3 -5,0 -5.5,0.2 ' +
  'L-3,0.3 C-2,0.4 -1,0.5 0,0.3 ' +
  'C0.5,0.2 1,0.1 1.5,0.3 L2.5,0.5 L3.2,0.3 ' +
  'C2.8,0 2.5,-0.2 2,-0.3 C1.5,-0.4 1,-0.3 0.5,-0.2 ' +
  'M-3.5,-0.4 C-4,-0.6 -5,-0.8 -7,-0.6 C-8,-0.5 -8.5,-0.3 -8.5,-0.1 ' + // left wing flat
  'C-7.5,-0.2 -6,-0.3 -4.5,-0.3 C-3.5,-0.3 -3,-0.3 -2.5,-0.3 ' +
  'M1.5,-0.2 C2.5,-0.4 4,-0.6 6,-0.5 C7,-0.4 7.5,-0.2 7.5,0 ' +         // right wing flat
  'C6.5,-0.1 5,-0.2 3.5,-0.2 C2.5,-0.2 2,-0.2 1.5,-0.2';

// Wings fully lowered (downstroke)
const WING_DOWN =
  'M0,0 C-1,-0.5 -2,-1 -3,-0.8 L-4,-0.5 C-4.5,-0.3 -5,0 -5.5,0.2 ' +
  'L-3,0.3 C-2,0.4 -1,0.5 0,0.3 ' +
  'C0.5,0.2 1,0.1 1.5,0.3 L2.5,0.5 L3.2,0.3 ' +
  'C2.8,0 2.5,-0.2 2,-0.3 C1.5,-0.4 1,-0.3 0.5,-0.2 ' +
  'M-3.5,-0.4 C-4,0.5 -4.5,1.5 -5.5,3 C-6,3.8 -6.2,4 -6,3.8 ' +        // left wing down
  'C-5.5,3 -4.5,1.8 -3.5,0.8 C-3,0.3 -2.8,0 -2.5,-0.3 ' +
  'M1.5,-0.2 C2,0.6 2.8,1.8 3.5,3.2 C3.8,3.8 4,4 3.8,3.8 ' +            // right wing down
  'C3.2,3 2.5,1.5 2,0.5 C1.8,0.1 1.6,-0.1 1.5,-0.2';

// Alternate body shapes for variety — slightly different proportions
const BODY_VARIANTS = [
  // Variant A: stockier body, broader wings
  {
    up: 'M0,0 C-1.2,-0.4 -2.2,-0.8 -3.2,-0.6 L-4.2,-0.3 C-4.8,0 -5.5,0.3 -6,0.5 ' +
        'L-3.2,0.4 C-2,0.5 -0.8,0.6 0,0.4 C0.6,0.3 1.2,0.1 1.8,0.3 L2.8,0.5 L3.5,0.2 ' +
        'C3,0 2.6,-0.2 2,-0.3 C1.4,-0.4 0.8,-0.3 0.4,-0.2 ' +
        'M-3.8,-0.3 C-3.2,-1.8 -2,-3.5 -0.5,-5.2 C0,-5.8 0.3,-6 0.4,-5.6 ' +
        'C0.1,-4.8 -0.6,-3.2 -1.2,-2 C-1.8,-1 -2.5,-0.5 -3,-0.2 ' +
        'M1.6,-0.2 C2,-1.5 2.8,-3.2 3.5,-5 C3.8,-5.6 4.2,-5.8 4.3,-5.4 ' +
        'C3.8,-4.2 3,-2.8 2.4,-1.5 C2,-0.6 1.8,-0.3 1.6,-0.2',
    mid: 'M0,0 C-1.2,-0.4 -2.2,-0.8 -3.2,-0.6 L-4.2,-0.3 C-4.8,0 -5.5,0.3 -6,0.5 ' +
         'L-3.2,0.4 C-2,0.5 -0.8,0.6 0,0.4 C0.6,0.3 1.2,0.1 1.8,0.3 L2.8,0.5 L3.5,0.2 ' +
         'C3,0 2.6,-0.2 2,-0.3 C1.4,-0.4 0.8,-0.3 0.4,-0.2 ' +
         'M-3.8,-0.3 C-4.8,-0.5 -6.2,-0.6 -8.2,-0.4 C-9,-0.3 -9.5,0 -9.5,0.2 ' +
         'C-8.5,0 -7,-0.2 -5.5,-0.2 C-4.2,-0.2 -3.5,-0.2 -3,-0.2 ' +
         'M1.6,-0.2 C3,-0.4 4.8,-0.5 7,-0.3 C8,-0.2 8.5,0 8.5,0.2 ' +
         'C7.5,0 6,-0.1 4.5,-0.1 C3,-0.1 2.2,-0.1 1.6,-0.2',
    down: 'M0,0 C-1.2,-0.4 -2.2,-0.8 -3.2,-0.6 L-4.2,-0.3 C-4.8,0 -5.5,0.3 -6,0.5 ' +
          'L-3.2,0.4 C-2,0.5 -0.8,0.6 0,0.4 C0.6,0.3 1.2,0.1 1.8,0.3 L2.8,0.5 L3.5,0.2 ' +
          'C3,0 2.6,-0.2 2,-0.3 C1.4,-0.4 0.8,-0.3 0.4,-0.2 ' +
          'M-3.8,-0.3 C-4.2,0.8 -4.8,2 -5.8,3.5 C-6.2,4.2 -6.5,4.3 -6.2,4 ' +
          'C-5.6,3.2 -4.6,1.8 -3.6,0.6 C-3.2,0.2 -3,0 -2.8,-0.2 ' +
          'M1.6,-0.2 C2.2,0.8 3,2 4,3.5 C4.2,4 4.5,4.2 4.3,3.8 ' +
          'C3.6,2.8 2.8,1.5 2.2,0.4 C1.9,0 1.7,-0.1 1.6,-0.2',
  },
  // Variant B: sleeker, longer tail
  {
    up: 'M0,0 C-0.8,-0.3 -1.8,-0.7 -2.8,-0.6 L-4,-0.3 C-4.8,0 -5.8,0.2 -6.5,0.4 ' +
        'L-3,0.3 C-1.8,0.4 -0.6,0.4 0,0.3 C0.4,0.2 0.8,0 1.3,0.2 L2.2,0.4 L3,0.2 ' +
        'C2.6,0 2.2,-0.2 1.8,-0.3 C1.2,-0.3 0.6,-0.2 0.3,-0.1 ' +
        'M-3.2,-0.3 C-2.8,-1.6 -1.8,-3 -0.6,-4.6 C-0.2,-5.2 0.1,-5.4 0.2,-5.1 ' +
        'C0,-4.4 -0.5,-3 -1,-1.8 C-1.5,-0.9 -2,-0.4 -2.5,-0.2 ' +
        'M1.3,-0.2 C1.6,-1.2 2.2,-2.6 2.8,-4.2 C3.2,-4.8 3.5,-5 3.6,-4.7 ' +
        'C3.2,-3.8 2.6,-2.5 2.2,-1.4 C1.8,-0.6 1.5,-0.3 1.3,-0.2',
    mid: 'M0,0 C-0.8,-0.3 -1.8,-0.7 -2.8,-0.6 L-4,-0.3 C-4.8,0 -5.8,0.2 -6.5,0.4 ' +
         'L-3,0.3 C-1.8,0.4 -0.6,0.4 0,0.3 C0.4,0.2 0.8,0 1.3,0.2 L2.2,0.4 L3,0.2 ' +
         'C2.6,0 2.2,-0.2 1.8,-0.3 C1.2,-0.3 0.6,-0.2 0.3,-0.1 ' +
         'M-3.2,-0.3 C-4,-0.5 -5.5,-0.6 -7.5,-0.4 C-8.2,-0.3 -8.8,0 -8.8,0.1 ' +
         'C-7.8,0 -6.5,-0.1 -5,-0.2 C-3.8,-0.2 -3.2,-0.2 -2.8,-0.2 ' +
         'M1.3,-0.2 C2.2,-0.3 3.8,-0.4 5.8,-0.3 C6.5,-0.2 7,0 7,0.1 ' +
         'C6,0 4.8,-0.1 3.5,-0.1 C2.5,-0.1 1.8,-0.1 1.3,-0.2',
    down: 'M0,0 C-0.8,-0.3 -1.8,-0.7 -2.8,-0.6 L-4,-0.3 C-4.8,0 -5.8,0.2 -6.5,0.4 ' +
          'L-3,0.3 C-1.8,0.4 -0.6,0.4 0,0.3 C0.4,0.2 0.8,0 1.3,0.2 L2.2,0.4 L3,0.2 ' +
          'C2.6,0 2.2,-0.2 1.8,-0.3 C1.2,-0.3 0.6,-0.2 0.3,-0.1 ' +
          'M-3.2,-0.3 C-3.6,0.6 -4.2,1.5 -5,3 C-5.4,3.6 -5.6,3.8 -5.4,3.5 ' +
          'C-4.8,2.8 -4,1.5 -3.2,0.5 C-2.8,0.1 -2.6,-0.1 -2.5,-0.2 ' +
          'M1.3,-0.2 C1.8,0.5 2.5,1.6 3.2,3 C3.5,3.5 3.6,3.7 3.5,3.5 ' +
          'C3,2.6 2.4,1.4 1.8,0.4 C1.5,0 1.4,-0.1 1.3,-0.2',
  },
];

// ── Tuning ───────────────────────────────────────────────────────────────────
const COUNT = 100;                 // flock size (~30% more than 22)
const FLIGHT_DURATION_MIN = 1080; // ms — fastest bird (20% slower)
const FLIGHT_DURATION_MAX = 2160; // ms — slowest bird (20% slower)
const FLIGHT_DISTANCE_MIN = 100;  // px — shortest flight
const FLIGHT_DISTANCE_MAX = 380;  // px — longest flight
const BIRD_SCALE_MIN = 2.0;      // 40% thicker than 2.2
const BIRD_SCALE_MAX = 4.5;      // 40% thicker than 3.8
const STAGGER_MAX = 1020;          // ms — wider stagger for more birds
const CLEANUP_DELAY = 3400;       // ms — longer to match slower flights

// Angle range: fans from upper-right. Some birds go nearly straight up, some
// veer right, a few even scatter slightly left for realism.
const ANGLE_MIN = 0;   // degrees (almost horizontal right)
const ANGLE_MAX = 360;  // degrees (nearly straight up)

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

/** Generate flight parameters for one raven. */
function birdParams(originX, originY) {
  const angle = rand(ANGLE_MIN, ANGLE_MAX);
  const rad = (angle * Math.PI) / 180;
  const dist = rand(FLIGHT_DISTANCE_MIN, FLIGHT_DISTANCE_MAX);
  const dx = Math.cos(rad) * dist;
  const dy = Math.sin(rad) * dist;
  const dur = rand(FLIGHT_DURATION_MIN, FLIGHT_DURATION_MAX);
  const delay = rand(0, STAGGER_MAX);
  const scale = rand(BIRD_SCALE_MIN, BIRD_SCALE_MAX);
  // Bird faces its flight direction (beak-forward) + slight wobble.
  const rotation = angle + rand(-15, 15);
  // Wing flap: full cycle duration (up → mid → down → mid → up).
  const flapDur = rand(180, 320);
  // Pick a random body variant for shape diversity.
  const variant = randInt(0, BODY_VARIANTS.length - 1);
  // Slight vertical wobble during flight (birds don't fly in a straight line).
  const wobbleAmp = rand(3, 10);
  const wobbleFreq = rand(2, 5); // number of wobbles during flight

  return { dx, dy, dur, delay, scale, rotation, flapDur, variant, wobbleAmp, wobbleFreq, originX, originY };
}

/** One animated raven — uses CSS animation for flight + JS-driven frame-based
 *  wing position swap for realistic flapping (CSS can't morph SVG paths). */
const Raven = ({ params }) => {
  const { dx, dy, dur, delay, scale, rotation, flapDur, variant, wobbleAmp, wobbleFreq, originX, originY } = params;

  // Choose which set of wing shapes to use (default or variant body).
  const shapes = variant === 0
    ? { up: WING_UP, mid: WING_MID, down: WING_DOWN }
    : (BODY_VARIANTS[variant - 1] || BODY_VARIANTS[0]);

  const style = {
    position: 'fixed',
    left: originX,
    top: originY,
    width: 28 * (scale / 2.5),   // normalize to a good visual size
    height: 18 * (scale / 2.5),
    pointerEvents: 'none',
    zIndex: 99999,
    opacity: 0,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    animation: `raven-flight ${dur}ms ${delay}ms ease-out forwards`,
    '--raven-dx': `${dx}px`,
    '--raven-dy': `${dy}px`,
    '--raven-wobble': `${wobbleAmp}px`,
    '--raven-wobble-freq': wobbleFreq,
  };

  // Flap cycle: up → mid → down → mid → up (4 phases)
  const phases = [shapes.up, shapes.mid, shapes.down, shapes.mid];
  const phaseDur = flapDur / 4; // duration of each wing position

  return (
    <svg viewBox="-10 -7 20 12" style={style} aria-hidden="true">
      {/* Each phase is layered; CSS animation-delay + duration staggers them
          so only one is visible at a time, creating the flap illusion. */}
      {phases.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="currentColor"
          style={{
            color: 'var(--color-text)',
            opacity: 0,
            animation: `raven-wing-phase ${flapDur}ms ${delay + i * phaseDur}ms ease-in-out infinite`,
            // Each phase is visible for 25% of the cycle, offset by its index.
            animationDelay: `${delay + i * phaseDur}ms`,
          }}
        />
      ))}
    </svg>
  );
};

/**
 * RavenBurst — mount where the send succeeds. Pass the button ref so the
 * flock erupts from the button's position.
 *
 * @param {boolean} active — true to fire the burst
 * @param {React.RefObject} originRef — ref to the submit button
 */
const RavenBurst = ({ active, originRef }) => {
  const [birds, setBirds] = useState(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    firedRef.current = true;

    const el = originRef?.current;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    if (el) {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    }

    // Generate all bird flight parameters.
    const flock = Array.from({ length: COUNT }, () => birdParams(cx, cy));

    setBirds(flock.map((p, i) => <Raven key={i} params={p} />));

    const timer = setTimeout(() => setBirds(null), CLEANUP_DELAY);
    return () => clearTimeout(timer);
  }, [active, originRef]);

  // Reset the one-shot when success clears so it can fire again.
  useEffect(() => {
    if (!active) firedRef.current = false;
  }, [active]);

  if (!birds) return null;

  return createPortal(
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {birds}
    </div>,
    document.body
  );
};

export default RavenBurst;
