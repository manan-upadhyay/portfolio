// The Traveler's Sigil — a unique emblem derived from the visitor's device
// signature. We hash a handful of stable signals into a seed, then draw a
// rotationally-symmetric rune from it (echoing the hero astrolabe's seeded art).
// The point: prove the visitor is *identifiable* — no two devices draw the same
// mark — while sending absolutely nothing. The hash never leaves the page.

/** FNV-1a 32-bit string hash → unsigned int. */
const fnv1a = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

/** Stable device fingerprint → { hex (display), seed (uint for the PRNG) }. */
export const deviceHash = (v) => {
  const parts = [
    v.gpu, v.os, v.browser, v.cores, v.memory, v.language, v.timezone,
    v.screen && `${v.screen.w}x${v.screen.h}@${v.screen.dpr}`,
  ];
  const seed = fnv1a(parts.filter(Boolean).join('|'));
  return { hex: seed.toString(16).padStart(8, '0').slice(0, 6), seed };
};

/** Seeded PRNG (mulberry32) — deterministic stream from a uint seed. */
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Draw the sigil into a 2D context (square, side `s`). Pure procedural: a
 * k-fold rotationally-symmetric rune of rings, spokes and nodes. `colors` are
 * the resolved theme tokens so it matches dark/light/dawn/dusk.
 */
export const drawSigil = (ctx, s, seed, colors) => {
  const { ember, gold, emberRgb } = colors;
  const rnd = mulberry32(seed);
  const cx = s / 2;
  const cy = s / 2;
  const R = s / 2 - 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const k = 5 + Math.floor(rnd() * 4); // 5–8 fold symmetry
  const rings = 1 + Math.floor(rnd() * 2);

  // concentric rings
  ctx.strokeStyle = `rgba(${emberRgb},0.28)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < rings; i++) {
    const rr = R * (0.42 + i * 0.32);
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    ctx.stroke();
  }

  // a seeded motif, repeated around k rotations
  const armR = R * (0.5 + rnd() * 0.45);
  const nodeR = R * (0.25 + rnd() * 0.4);
  const tilt = rnd() * Math.PI;
  for (let i = 0; i < k; i++) {
    const a = tilt + (i / k) * Math.PI * 2;
    const ax = cx + Math.cos(a) * armR;
    const ay = cy + Math.sin(a) * armR;
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    // node on the spoke
    const nx = cx + Math.cos(a) * nodeR;
    const ny = cy + Math.sin(a) * nodeR;
    ctx.fillStyle = ember;
    ctx.beginPath();
    ctx.arc(nx, ny, 1.6, 0, Math.PI * 2);
    ctx.fill();
    // tip cap
    ctx.beginPath();
    ctx.arc(ax, ay, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // center glyph
  ctx.fillStyle = ember;
  ctx.beginPath();
  ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
  ctx.fill();
};
