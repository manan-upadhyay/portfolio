import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { personalInfo } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import { scrollToSection } from '../lib/smoothScroll';
import CompassRose from './ui/CompassRose';

gsap.registerPlugin(ScrollTrigger);

const SKY = '/chronicle/hero-sky.webp';

// Probe an image once; resolves true/false (never rejects).
const probe = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

// Deterministic PRNG so the constellation field is stable across renders.
const makeRng = (seed) => {
  let s = seed % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

const Hero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const prefersReduced = useReducedMotion();
  const [haveSky, setHaveSky] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const bearingRef = useRef(null);

  const phrases = personalInfo.heroPhrases?.length ? personalInfo.heroPhrases : [personalInfo.heroTitle];
  const longestPhrase = phrases.reduce((a, b) => (b.length > a.length ? b : a), phrases[0]);

  // The starfield backdrop is a dark-theme asset; light theme uses a dawn gradient.
  useEffect(() => {
    let alive = true;
    probe(SKY).then((v) => alive && setHaveSky(v));
    return () => { alive = false; };
  }, []);

  // Rotating tagline phrase (paused under reduced-motion / single phrase).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || phrases.length < 2) return;
    const id = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 3200);
    return () => clearInterval(id);
  }, [phrases.length]);

  // Intro timeline + scroll-out parallax.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return; // elements rest at their natural (visible) state
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 })
        .from('.hero-line > span', { yPercent: 120, duration: 1, stagger: 0.12 }, '-=0.3')
        .from('.hero-tagline', { opacity: 0, y: 18, duration: 0.8 }, '-=0.5')
        .from('.hero-hook', { opacity: 0, y: 18, duration: 0.8 }, '-=0.6')
        .from('.hero-cta', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
        .from('.hero-meta', { opacity: 0, duration: 0.7 }, '-=0.4')
        .from('.hero-cue', { opacity: 0, duration: 0.8 }, '-=0.3');

      gsap.to(copyRef.current, {
        yPercent: -12, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(canvasWrapRef.current, {
        yPercent: -8, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // The living astrolabe (Canvas2D). Re-reads theme tokens on theme change.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
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

    let size = 0, dpr = 1;
    let rect = { left: 0, top: 0, width: 0, height: 0 };
    const mouse = { x: null, y: null };
    let cur = -Math.PI / 2;            // current alidade angle (points "up" = N = Origin)
    let lastDeg = -1;
    let raf;
    const start = performance.now();
    const TWO_PI = Math.PI * 2;
    const ASSEMBLE = 2.4; // seconds for the full instrument to assemble
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; };
    const seg = (el, s, d) => Math.max(0, Math.min((el - s) / d, 1)); // staged sub-progress

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
      }

      c.restore();
    };

    const loop = (ts) => {
      const el = (ts - start) / 1000;
      const introDone = reduce || el >= ASSEMBLE;
      if (reduce) {
        cur = -Math.PI / 2;
      } else if (!introDone) {
        // Dramatic multi-turn spin that decelerates into "up" (Origin).
        const pA = easeOut(seg(el, 0.95, 1.45));
        cur = -Math.PI / 2 + (1 - pA) * (TWO_PI * 2 + 0.6);
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

      if (bearingRef.current) {
        const deg = Math.round((((cur + Math.PI / 2) * 180) / Math.PI % 360 + 360) % 360);
        if (deg !== lastDeg) {
          lastDeg = deg;
          const charting = introDone && !reduce && !coarse && mouse.x !== null;
          bearingRef.current.textContent = `bearing ${String(deg).padStart(3, '0')}° · ${charting ? 'charting' : 'origin'}`;
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

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [resolvedTheme]);

  const firstName = personalInfo.name.split(' ')[0];
  const lastName = personalInfo.name.split(' ').slice(1).join(' ');

  return (
    <section ref={rootRef} id="origin" className="relative w-full h-screen overflow-hidden">
      {/* ===== Backdrop ===== */}
      <div className="absolute inset-0 z-0">
        {isDark && haveSky ? (
          <img src={SKY} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: isDark
                ? 'radial-gradient(130% 100% at 75% 12%, #1B2440 0%, #0E1426 48%, #070A14 100%)'
                : 'radial-gradient(130% 110% at 72% 105%, #FAF1DC 0%, #F2E7CF 45%, #E8D9BD 100%)',
            }}
          >
            {isDark && [...Array(70)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 11 === 0 ? 2.4 : 1.3,
                  height: i % 11 === 0 ? 2.4 : 1.3,
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 90}%`,
                  opacity: 0.1 + ((i * 17) % 55) / 100,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Legibility scrim — darkens the copy side, leaves the instrument lit. */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, rgba(7,10,20,0.93) 0%, rgba(7,10,20,0.55) 40%, rgba(7,10,20,0) 70%)'
            : 'linear-gradient(90deg, rgba(245,240,230,0.92) 0%, rgba(245,240,230,0.5) 42%, rgba(245,240,230,0) 72%)',
        }}
      />
      <div className="cinematic-vignette" style={{ zIndex: 2 }} />

      {/* ===== The astrolabe ===== */}
      <div
        ref={canvasWrapRef}
        aria-hidden="true"
        className="absolute z-[3] pointer-events-none aspect-square left-1/2 -translate-x-1/2 top-[6%] w-[min(82vw,400px)] opacity-[0.45]
                   md:left-auto md:translate-x-0 md:right-[4%] md:top-1/2 md:-translate-y-1/2 md:w-[min(44vw,560px)] md:opacity-100"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        {/* Shared compass rose at the heart of the instrument (assembles in last). */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[20%] aspect-square -translate-x-1/2 -translate-y-1/2"
          initial={prefersReduced ? false : { scale: 0, rotate: -120, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: prefersReduced ? 0 : 1.7 }}
        >
          <CompassRose className="w-full h-full opacity-90" />
        </motion.div>
      </div>

      {/* Bearing readout (desktop, pointer devices). */}
      <div className="hidden md:block absolute z-[5] bottom-[12%] right-[7%] pointer-events-none">
        <span
          ref={bearingRef}
          className="font-mono text-[11px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          bearing 000° · origin
        </span>
      </div>

      {/* ===== Copy ===== */}
      <div ref={copyRef} className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center">
        <div className="max-w-xl">
          <div className="hero-eyebrow chapter-eyebrow mb-5">Chapter 00 · Origin</div>

          <h1 className="font-chronicle font-semibold leading-[0.86] tracking-tight" style={{ color: 'var(--color-text)' }}>
            <span className="hero-line block overflow-hidden pb-[0.18em] -mb-[0.14em]"><span className="block text-[clamp(56px,12vw,150px)]">{firstName}</span></span>
            <span className="hero-line block overflow-hidden pb-[0.18em] -mb-[0.14em]"><span className="block text-[clamp(56px,12vw,150px)]">{lastName}</span></span>
          </h1>

          <p className="hero-tagline font-chronicle italic mt-3 text-[clamp(20px,3vw,34px)]" style={{ color: 'var(--color-ember)' }}>
            {personalInfo.heroLead}{' '}
            <span className="relative inline-grid align-baseline">
              {/* invisible sizer reserves the widest phrase so the line never reflows */}
              <span className="invisible col-start-1 row-start-1 whitespace-nowrap">{longestPhrase}</span>
              <span className="col-start-1 row-start-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={phrases[phraseIdx]}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block whitespace-nowrap"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {phrases[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </p>

          <p className="hero-hook mt-5 max-w-md text-[15px] sm:text-[17px] leading-[27px]" style={{ color: 'var(--color-text-muted)' }}>
            {personalInfo.heroHook}
          </p>

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5">
            <button onClick={() => scrollToSection('about')} data-cursor="hover" className="btn-primary">Begin the Chronicle</button>
            <button onClick={() => scrollToSection('contact')} data-cursor="hover" className="text-[15px] font-medium link-hover" style={{ color: 'var(--color-text)' }}>
              Summon me →
            </button>
          </div>

          <div className="hero-meta mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-ember)' }}>{personalInfo.coordinates}</span>
            <span className="opacity-50">·</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'var(--color-text-muted)' }}>Scroll</span>
        <div className="w-px h-12 overflow-hidden" style={{ background: 'var(--color-card-border)' }}>
          <div className="w-px h-5 animate-[scrollcue_1.8s_ease-in-out_infinite]" style={{ background: 'var(--color-ember)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
