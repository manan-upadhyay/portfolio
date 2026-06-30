import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { playCue, sound } from '../lib/sound';

/**
 * FaceParticles — a cinematic "character assembly": a swarm of tiny glyphs flies
 * in from every direction (opacity 0→1, size 0→target) and settles into a portrait.
 *
 * Pure Canvas2D, zero dependencies, no WebGL (honours the no-Three.js rule).
 *
 * Performance contract (this effect must never cost while idle):
 *  - The image is sampled ONCE on a hidden canvas → target points.
 *  - Each unique glyph+colour is pre-rendered ONCE to a sprite; the animation
 *    blits sprites with drawImage (no per-frame ctx.font parsing, the classic
 *    canvas-text perf trap).
 *  - The rAF loop runs ONLY during the ~1.6s assembly and ONLY while on screen;
 *    once formed it draws a final frame and STOPS. No perpetual loop, no idle
 *    drift — zero ongoing CPU/GPU once settled.
 *
 * Swap `public/atelier/portrait.svg` (or pass `src`) for a real high-contrast
 * portrait and it re-traces automatically. Static (pre-formed) under
 * prefers-reduced-motion. Decorative only — aria-hidden.
 */
// Glyph ramp ordered light → dark by ink coverage. The brighter a sampled cell,
// the lighter (sparser) the glyph; dark features get dense glyphs. This is what
// turns a flat silhouette into a tonal portrait with real modelling.
const RAMP = ['·', '.', ':', ';', '+', '=', '*', '<', '{', '%', '#'];
const MAX_PARTICLES = 3000;  // detail budget; bounded cost (assembly-only, then stop)
const SAMPLE_W = 170;        // sampling resolution (cols); rows derive from aspect
const STEP = 2;              // sample every N px → glyph spacing (finer = more detail)
const PAD = 0.06;            // inset of the face within the canvas
const SKIP_ABOVE = 1 ;     // skip cells brighter than this (background + white shirt)
const SPRITE = 26;           // sprite raster size (px) — drawn scaled per particle

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

const FaceParticles = ({ src = '/atelier/portrait.webp' }) => {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let ro = null;
    let io = null;
    let running = false;     // is the rAF loop currently scheduled?
    let formed = false;      // has assembly finished (→ freeze, never loop again)?
    let onScreen = false;
    let t0 = 0;
    let particles = [];
    let targets = [];        // { nx, ny } normalized 0..1 in the face's own box
    let faceAspect = 1;
    let W = 0, H = 0;
    let box = null;          // the fitted face rect { ox, oy, drawW, drawH }
    let baseCanvas = null;   // snapshot of the settled particle frame (cheap hover base)
    let photoCanvas = null;  // the cinematically-graded source photo (lens content)
    let lensCanvas = null, lctx = null; // scratch buffer for the feathered reveal
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // ── sprite atlas: render each glyph+colour once, blit (cheap) thereafter ──
    const css = getComputedStyle(document.documentElement);
    const tok = (n, fb) => (css.getPropertyValue(n).trim() || fb);
    const palette = [tok('--color-ember', '#E8965A'), tok('--color-gold', '#D9A441'), tok('--color-text', '#ECE7DB')];
    const sprites = new Map(); // key `${char}|${color}` → canvas
    const sprite = (ch, color) => {
      const key = `${ch}|${color}`;
      let s = sprites.get(key);
      if (s) return s;
      s = document.createElement('canvas');
      s.width = SPRITE; s.height = SPRITE;
      const sc = s.getContext('2d');
      sc.font = `${Math.round(SPRITE * 0.7)}px ui-monospace, "SFMono-Regular", monospace`;
      sc.textAlign = 'center';
      sc.textBaseline = 'middle';
      sc.fillStyle = color;
      sc.fillText(ch, SPRITE / 2, SPRITE / 2);
      sprites.set(key, s);
      return s;
    };

    const fit = () => {
      const innerW = W * (1 - PAD * 2);
      const innerH = H * (1 - PAD * 2);
      let drawW, drawH;
      if (innerW / innerH > faceAspect) { drawH = innerH; drawW = drawH * faceAspect; }
      else { drawW = innerW; drawH = drawW / faceAspect; }
      return { drawW, drawH, ox: (W - drawW) / 2, oy: (H - drawH) / 2 };
    };

    const buildParticles = () => {
      const { drawW, drawH, ox, oy } = fit();
      box = { ox, oy, drawW, drawH };
      const maxDim = Math.max(W, H);
      // glyph footprint ≈ one sampling cell, so glyphs tile into an image instead
      // of overlapping into blobs (the old "big random size" mush).
      const cellPx = drawW / (SAMPLE_W / STEP);
      particles = targets.map((tg) => {
        const tx = ox + tg.nx * drawW;
        const ty = oy + tg.ny * drawH;
        // d = darkness within the kept range (0 = lightest skin … 1 = darkest feature)
        const d = clamp(1 - tg.lum / SKIP_ABOVE, 0, 1);
        const ch = RAMP[clamp((d * (RAMP.length - 1)) | 0, 0, RAMP.length - 1)];
        // colour by tone: skin warm-dim, mid gold, deepest features bright cream → pop
        const color = d > 0.78 ? palette[2] : d > 0.45 ? palette[1] : palette[0];
        const a = rand(0, Math.PI * 2);
        const dist = rand(0.5, 1.25) * maxDim;
        return {
          tx, ty,
          sx: tx + Math.cos(a) * dist,
          sy: ty + Math.sin(a) * dist,
          spr: sprite(ch, color),
          size: cellPx * (0.92 + 0.55 * d) * rand(0.9, 1.1),
          alpha: 0.3 + 0.7 * d,   // faint skin, bold features → tonal modelling
          delay: rand(0, 850),
          dur: rand(800, 1350),
        };
      });
    };

    const blit = (p, x, y, size, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(p.spr, x - size / 2, y - size / 2, size, size);
    };

    const drawFinal = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) blit(p, p.tx, p.ty, p.size, p.alpha);
      ctx.globalAlpha = 1;
    };

    // Snapshot the settled frame once so the hover lens can blit it in a single
    // drawImage (instead of re-drawing thousands of sprites every hover frame).
    const captureBase = () => {
      if (!baseCanvas) baseCanvas = document.createElement('canvas');
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      baseCanvas.getContext('2d').drawImage(canvas, 0, 0);
    };

    const frame = (now) => {
      ctx.clearRect(0, 0, W, H);
      let allDone = true;
      for (const p of particles) {
        const e = easeOutCubic(Math.min(1, Math.max(0, (now - t0 - p.delay) / p.dur)));
        if (e < 1) allDone = false;
        const x = p.sx + (p.tx - p.sx) * e;
        const y = p.sy + (p.ty - p.sy) * e;
        blit(p, x, y, p.size * (0.2 + 0.8 * e), p.alpha * e);
      }
      ctx.globalAlpha = 1;
      if (allDone) {            // settle → STOP, snapshot, and sound the resolve
        formed = true;
        running = false;
        captureBase();
        playCue('assembleResolve');
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (running || formed || !targets.length || !onScreen) return;
      running = true;
      t0 = performance.now();
      playCue('assembleSwell'); // the gathering rush, synced to the fly-in
      raf = requestAnimationFrame(frame);
    };

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // lens scratch buffer tracks the main canvas size
      if (!lensCanvas) { lensCanvas = document.createElement('canvas'); lctx = lensCanvas.getContext('2d'); }
      lensCanvas.width = canvas.width;
      lensCanvas.height = canvas.height;
      if (!targets.length) return;
      buildParticles();
      // re-laying out mid/after assembly: present a settled frame (no re-fly) + snapshot
      if (formed || reduce) { drawFinal(); captureBase(); }
    };

    // ── magic-lantern hover lens: the real photo, cinematically graded, revealed
    //    only within a feathered radius under the cursor (the rest stays glyphs) ──
    let hovering = false, mx = 0, my = 0, hoverRaf = 0;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const lensR = () => Math.min(W, H) * 0.4;

    // Pre-render the source once with a film grade (contrast + slight desaturation +
    // warm wash + vignette) — this is what the lens reveals.
    const buildPhoto = () => {
      const iw = img.naturalWidth, ih = img.naturalHeight;
      photoCanvas = document.createElement('canvas');
      photoCanvas.width = iw; photoCanvas.height = ih;
      const p = photoCanvas.getContext('2d');
      try { p.filter = 'contrast(1.12) saturate(0.82) brightness(0.92) sepia(0.16)'; } catch { /* unsupported → raw */ }
      p.drawImage(img, 0, 0);
      p.filter = 'none';
      p.globalCompositeOperation = 'overlay';
      const wash = p.createLinearGradient(0, 0, 0, ih);
      wash.addColorStop(0, 'rgba(232,150,90,0.12)');
      wash.addColorStop(1, 'rgba(10,12,24,0.30)');
      p.fillStyle = wash; p.fillRect(0, 0, iw, ih);
      p.globalCompositeOperation = 'multiply';
      const vig = p.createRadialGradient(iw / 2, ih * 0.45, Math.min(iw, ih) * 0.2, iw / 2, ih * 0.5, Math.max(iw, ih) * 0.62);
      vig.addColorStop(0, 'rgba(255,255,255,1)');
      vig.addColorStop(1, 'rgba(40,32,26,0.55)');
      p.fillStyle = vig; p.fillRect(0, 0, iw, ih);
      // Clip the whole grade back to the portrait's own alpha — but BLURRED — so the
      // transparent background never shows (no light box) and the face borders feather
      // softly into the glyphs instead of cutting hard.
      p.globalCompositeOperation = 'destination-in';
      try { p.filter = `blur(${Math.max(3, iw * 0.014)}px)`; } catch { /* no blur → hard edge */ }
      p.drawImage(img, 0, 0);
      p.filter = 'none';
      p.globalCompositeOperation = 'source-over';
    };

    const restoreBase = () => {
      if (!baseCanvas) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(baseCanvas, 0, 0, W, H);
    };

    const drawHoverFrame = () => {
      ctx.clearRect(0, 0, W, H);
      if (baseCanvas) ctx.drawImage(baseCanvas, 0, 0, W, H); else drawFinal();
      if (!photoCanvas || !box || !lctx) return;
      const r = lensR();
      // feathered reveal built in the scratch buffer, then composited over the glyphs
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, W, H);
      lctx.globalCompositeOperation = 'source-over';
      lctx.drawImage(photoCanvas, box.ox, box.oy, box.drawW, box.drawH);
      lctx.globalCompositeOperation = 'destination-in';
      const g = lctx.createRadialGradient(mx, my, r * 0.18, mx, my, r);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.62, 'rgba(0,0,0,0.92)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      lctx.fillStyle = g; lctx.fillRect(0, 0, W, H);
      lctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(lensCanvas, 0, 0, W, H);
      // a faint warm rim so the lantern reads as a lens, not a hole
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(mx, my, r * 0.97, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(232,150,90,0.22)';
      ctx.stroke();
      ctx.restore();
    };

    const hoverLoop = () => {
      if (!hovering || !formed) { hoverRaf = 0; return; }
      drawHoverFrame();
      hoverRaf = requestAnimationFrame(hoverLoop);
    };
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (formed && !hovering) {
        hovering = true;
        sound.lens.setLevel(1); // continuous reveal buzz (no transient ping)
        if (!hoverRaf) hoverRaf = requestAnimationFrame(hoverLoop);
      }
    };
    const onPointerLeave = () => {
      hovering = false;
      sound.lens.setLevel(0);
      if (hoverRaf) { cancelAnimationFrame(hoverRaf); hoverRaf = 0; }
      if (formed) restoreBase();
    };

    // ── sample the source image → target points, then wire sizing + triggers ──
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      faceAspect = img.naturalWidth / img.naturalHeight || 1;
      const sw = SAMPLE_W;
      const sh = Math.max(1, Math.round(sw / faceAspect));
      const off = document.createElement('canvas');
      off.width = sw; off.height = sh;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(img, 0, 0, sw, sh);
      let data;
      try { data = octx.getImageData(0, 0, sw, sh).data; } catch { return; }

      const pts = [];
      for (let y = 0; y < sh; y += STEP) {
        for (let x = 0; x < sw; x += STEP) {
          const i = (y * sw + x) * 4;
          if (data[i + 3] < 60) continue; // transparent
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          if (lum > SKIP_ABOVE) continue; // background + white shirt → leave bare
          pts.push({ nx: x / sw, ny: y / sh, lum }); // keep the full tonal range
        }
      }
      for (let i = pts.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      targets = pts.slice(0, MAX_PARTICLES);

      layout();
      if (reduce) { drawFinal(); captureBase(); return; } // static, no animation/observers

      buildPhoto();
      if (finePointer) {
        wrap.addEventListener('pointermove', onPointerMove);
        wrap.addEventListener('pointerleave', onPointerLeave);
      }

      ro = new ResizeObserver(layout);
      ro.observe(wrap);

      io = new IntersectionObserver((entries) => {
        onScreen = entries.some((en) => en.isIntersecting);
        if (onScreen && !formed) run();
        else if (!onScreen && running) { cancelAnimationFrame(raf); running = false; }
        if (formed && io) { io.disconnect(); io = null; } // settled → never observe again
      }, { threshold: 0.25 });
      io.observe(wrap);
    };
    img.onerror = () => { /* portrait absent → leave the space empty, no crash */ };
    img.src = src;

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(hoverRaf);
      sound.lens.stop();
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
      ro?.disconnect();
      io?.disconnect();
      sprites.clear();
    };
  }, [src, reduce]);

  return (
    <div ref={wrapRef} className="atelier-face" aria-hidden="true">
      <canvas ref={canvasRef} className="atelier-face__canvas" />
    </div>
  );
};

export default FaceParticles;
