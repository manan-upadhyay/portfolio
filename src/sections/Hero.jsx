import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { personalInfo, chapters } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import { SKY_ORDER, SKY_BASE } from '../lib/sky';
import { scrollToSection } from '../lib/smoothScroll';
import { useAstrolabe } from '../hooks/useAstrolabe';
import { RefreshCcw } from 'lucide-react';
import { sound } from '../lib/sound';
import { track, trackOnce } from '../lib/analytics';
import CompassRose from '../components/CompassRose';

gsap.registerPlugin(ScrollTrigger);

// Hero legibility scrim, as a function of the resolved RGB + base, so the live
// layer and the TM-1 continuous-crossfade preview layers build the EXACT same
// gradient (gradients can't CSS-transition, so the scrub crossfades two layers).
const scrimGradient = (rgb, dark) =>
  dark
    ? `linear-gradient(90deg, rgba(${rgb},0.93) 0%, rgba(${rgb},0.55) 40%, rgba(${rgb},0) 70%)`
    : `linear-gradient(90deg, rgba(${rgb},0.92) 0%, rgba(${rgb},0.5) 42%, rgba(${rgb},0) 72%)`;

// Continuous theme-token interpolation for the sky scrub — lets the CONTENT (text,
// vignette, scrim) cross-fade in lock-step with the wheel, not just on release.
// Theme color tokens that are worth interpolating live (everything the hero shows).
const LERP_TOKENS = ['--color-primary', '--color-text', '--color-text-muted', '--color-ember', '--color-gold', '--color-card-border'];
const _lerp = (a, b, t) => a + (b - a) * t;
const parseColor = (s = '') => {
  s = s.trim();
  if (s[0] === '#') {
    const h = s.length === 4 ? s.slice(1).split('').map((c) => c + c).join('') : s.slice(1);
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = s.match(/[\d.]+/g) || [0, 0, 0];
  return [+m[0], +m[1], +m[2], m[3] !== undefined ? +m[3] : 1];
};
const mixColor = (from, to, t) => {
  const a = parseColor(from), b = parseColor(to);
  const r = Math.round(_lerp(a[0], b[0], t)), g = Math.round(_lerp(a[1], b[1], t)), bl = Math.round(_lerp(a[2], b[2], t));
  const al = _lerp(a[3], b[3], t);
  return al < 1 ? `rgba(${r}, ${g}, ${bl}, ${al.toFixed(3)})` : `rgb(${r}, ${g}, ${bl})`;
};
const mixTriple = (from, to, t) => {
  const a = (from || '0,0,0').split(','), b = (to || '0,0,0').split(',');
  return `${Math.round(_lerp(+a[0], +b[0], t))}, ${Math.round(_lerp(+a[1], +b[1], t))}, ${Math.round(_lerp(+a[2], +b[2], t))}`;
};

const Hero = () => {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, resolvedSky, setMode } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const prefersReduced = useReducedMotion();
  const [phraseIdx, setPhraseIdx] = useState(0);

  const rootRef = useRef(null);
  const langRef = useRef(i18n.language);
  const copyRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const bearingRef = useRef(null);
  const astrolabeRef = useRef(null);

  // TM-1 continuous sky cross-dissolve — a stack of preview layers above the real
  // backdrop + scrim that crossfade in lock-step with the ring's rotation, driven
  // imperatively (no per-frame React re-render). `skyArt` holds each sky's gradient
  // + scrim, probed once from CSS (never duplicated in JS). The real theme commits
  // only when the ring settles, so there's no hard mid-rotation swap/flash.
  const skyArt = useRef(null);
  const previewRef = useRef(null); // container — opacity is the backdrop preview's on/off
  const bpARef = useRef(null);     // backdrop "from" layer
  const bpBRef = useRef(null);     // backdrop "to" layer (opacity = crossfade t)
  const previewOn = useRef(false);
  const lastSeg = useRef(null);

  // `t(returnObjects)` hands back a fresh array every render — memoize per voice
  // so it's a stable reference (otherwise the rotation effect churns). `t`'s
  // identity changes on every voice switch, so it alone scopes the memo per voice.
  const phrases = useMemo(() => {
    const p = t('hero.phrases', { returnObjects: true });
    return Array.isArray(p) && p.length ? p : [t('hero.lead')];
  }, [t]);
  const longestPhrase = phrases.reduce((a, b) => (b.length > a.length ? b : a), phrases[0]);
  // Clamp so the index can never point past the current voice's phrase list.
  const safeIdx = phraseIdx % phrases.length;
  const current = phrases[safeIdx];

  // Reset to the first phrase the instant the voice (i18n language) changes —
  // DURING render, not in an effect. This collapses the language flip and the
  // index reset into one committed render (key `lang:0`). Resetting in an effect
  // produced two rapid commits (`lang:oldIdx` then `lang:0`) that interrupted
  // AnimatePresence's `mode="wait"` exit and left it permanently desynced after a
  // UI voice switch — the phrase froze, blanked, then repeated.
  if (langRef.current !== i18n.language) {
    langRef.current = i18n.language;
    setPhraseIdx(0);
  }

  // (Re)start the rotation whenever the voice's phrase list changes.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || phrases.length < 2) return;
    const id = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 3200);
    return () => clearInterval(id);
  }, [phrases]);

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

  // Probe each sky's gradients + tokens from CSS once. Day/night live on `:root`/
  // `.dark` (not a `.light` class), so a detached probe div can't match them — we
  // must read off `<html>` itself (which IS `:root`). Do it synchronously (mutate →
  // read → restore, no paint in between) so there's no flash.
  useEffect(() => {
    const html = document.documentElement;
    const savedClass = html.getAttribute('class') || '';
    const savedSky = html.dataset.sky;
    const art = {};
    for (const sky of SKY_ORDER) {
      const base = SKY_BASE[sky];
      html.classList.remove('light', 'dark');
      html.classList.add(base);
      html.dataset.sky = sky;
      const cs = getComputedStyle(html);
      art[sky] = {
        backdrop: cs.getPropertyValue('--hero-backdrop').trim(),
        scrimRgb: cs.getPropertyValue('--hero-scrim-rgb').trim(),
        dark: base === 'dark',
        tok: LERP_TOKENS.reduce((o, k) => { o[k] = cs.getPropertyValue(k).trim(); return o; }, {}),
      };
    }
    html.setAttribute('class', savedClass);   // restore the committed theme atomically
    if (savedSky) html.dataset.sky = savedSky;
    skyArt.current = art;
  }, []);

  // Imperative continuous crossfade — called every frame of a scrub (no React
  // re-render). `pos` is the float stop position; integer part = "from" sky,
  // fractional part = crossfade amount toward the next sky.
  const applyScrub = (pos) => {
    const art = skyArt.current;
    const cont = previewRef.current;
    const host = rootRef.current;
    if (!art || !cont || !host) return;
    if (!previewOn.current) {       // first frame of a scrub → reveal the backdrop preview
      previewOn.current = true;
      cont.style.transition = 'none';
      cont.style.opacity = '1';
    }
    const f = Math.floor(pos);
    const tt = pos - f;
    const from = art[SKY_ORDER[((f % 4) + 4) % 4]];
    const to = art[SKY_ORDER[(((f + 1) % 4) + 4) % 4]];
    // Backdrop is a gradient (can't be a var) → cross-fade two layers.
    if (lastSeg.current !== f) {
      lastSeg.current = f;
      if (bpARef.current) bpARef.current.style.background = from.backdrop;
      if (bpBRef.current) bpBRef.current.style.background = to.backdrop;
    }
    if (bpBRef.current) bpBRef.current.style.opacity = String(tt);
    // Everything else is token-based → interpolate the tokens on the hero section
    // (scoped, so only the hero subtree recalcs) → CONTENT + scrim + vignette bottom
    // all cross-dissolve in lock-step with the wheel.
    for (let i = 0; i < LERP_TOKENS.length; i++) {
      const k = LERP_TOKENS[i];
      host.style.setProperty(k, mixColor(from.tok[k], to.tok[k], tt));
    }
    host.style.setProperty('--hero-scrim-rgb', mixTriple(from.scrimRgb, to.scrimRgb, tt));
  };

  // The ring has come to rest on a stop → commit the real theme, then clear the
  // scoped token overrides (committed theme's vars take over — identical to the last
  // interpolated frame, so seamless) and fade the backdrop preview out.
  const commitSky = (idx) => {
    const sky = SKY_ORDER[idx];
    if (sky) { setMode(sky); track('astrolabe_sky_set', { sky }); }
    const host = rootRef.current;
    if (host) {
      LERP_TOKENS.forEach((k) => host.style.removeProperty(k));
      host.style.removeProperty('--hero-scrim-rgb');
    }
    const cont = previewRef.current;
    if (cont) { cont.style.transition = 'opacity 0.45s ease'; cont.style.opacity = '0'; }
    previewOn.current = false;
    lastSeg.current = null;
  };

  // The living astrolabe (Canvas2D). Mounts once and re-tints in place on theme
  // change (no remount). The needle gear + the ring grind are distinct sounds.
  useAstrolabe(canvasRef, canvasWrapRef, bearingRef, resolvedSky, {
    onSpeed: (speed, source) => {
      if (source === 'bezel') { sound.grind.setSpeed(speed); sound.watch.setSpeed(0); }
      else { sound.watch.setSpeed(speed); sound.grind.setSpeed(0); }
    },
    onScrub: applyScrub,                          // continuous cross-dissolve
    onDetent: () => sound.playCue('detent'),      // tactile tick per stop crossed
    onSkyCommit: commitSky,                        // commit on settle
    ringLabel: t('hero.ringLabel'),
    controlsRef: astrolabeRef,
  });

  // Voice-aware curved label — update the on-ring guidance when the voice changes.
  useEffect(() => { astrolabeRef.current?.setLabel(t('hero.ringLabel')); }, [t]);

  // Keep the resting bezel aligned to the live sky (on mount + whenever the sky
  // changes — via the scrub itself, the SkyControl menu, or `auto` re-resolving).
  useEffect(() => {
    const i = SKY_ORDER.indexOf(resolvedSky);
    if (i >= 0) astrolabeRef.current?.setStop(i);
  }, [resolvedSky]);

  // Analytics — did they deliberately *play* with the needle? A pointerdown that
  // lands inside the instrument's box (the needle follows/aims there) is the
  // genuine signal; the passive cursor-follow is not. Once per session.
  useEffect(() => {
    const onDown = (e) => {
      const r = canvasWrapRef.current?.getBoundingClientRect();
      if (!r) return;
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        trackOnce('astrolabe_drag', 'astrolabe_drag');
      }
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  // Reveal the masterpiece on first contact. Browser autoplay policy mutes the
  // intro-spin sound for everyone until a gesture unlocks audio — so the moment it
  // DOES unlock (the visitor's first click/scroll/keypress, wherever it happens),
  // if they're still up at the hero, flick the alidade. They hear the synced gear
  // wind up and coast down without having to discover the button first. The button
  // (below) remains the explicit, repeatable invitation.
  useEffect(() => {
    if (prefersReduced) return undefined;
    let cancelled = false;
    sound.onUnlock(() => {
      if (cancelled) return;
      const r = rootRef.current?.getBoundingClientRect();
      const visible = r && r.bottom > window.innerHeight * 0.5; // hero still on screen
      if (visible) astrolabeRef.current?.spin();
    });
    return () => { cancelled = true; };
  }, [prefersReduced]);

  // Astrolabe watch-mechanism sound — hero-local; its level tracks how much of the
  // hero is on screen, so it fades to silence as you scroll past (natural distance
  // falloff) and rises again on the way back. The engine no-ops until sound is
  // unlocked + enabled + the page is in view, so this is safe regardless of state.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => { const l = 1 - self.progress; sound.watch.setLevel(l); sound.grind.setLevel(l); },
        onLeave: () => { sound.watch.setLevel(0); sound.grind.setLevel(0); },
        onLeaveBack: () => { sound.watch.setLevel(1); sound.grind.setLevel(1); },
      });
      const l0 = 1 - st.progress; sound.watch.setLevel(l0); sound.grind.setLevel(l0);
    }, rootRef);
    return () => { sound.watch.stop(); sound.grind.stop(); ctx.revert(); };
  }, []);

  const firstName = personalInfo.name.split(' ')[0];
  const lastName = personalInfo.name.split(' ').slice(1).join(' ');

  return (
    <section ref={rootRef} id="origin" className="relative w-full h-screen overflow-hidden">
      {/* ===== Backdrop — pure CSS starfield (no image); dark = ink gradient + stars,
          light = dawn gradient. Bottoms out near the page color for a seamless hand-off. */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{ background: 'var(--hero-backdrop)' }}
        >
          {isDark && [...Array(70)].map((_, i) => (
            <span
              key={i}
              className="hero-star absolute rounded-full bg-white"
              style={{
                width: i % 11 === 0 ? 2.4 : 1.3,
                height: i % 11 === 0 ? 2.4 : 1.3,
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 90}%`,
                // Per-star twinkle: stable, desynced timing (see .hero-star in index.css).
                '--star-o': 0.1 + ((i * 17) % 55) / 100,
                '--star-dur': `${4.5 + ((i * 13) % 45) / 10}s`,
                '--star-delay': `${((i * 29) % 80) / 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Legibility scrim — darkens the copy side, leaves the instrument lit. */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: scrimGradient('var(--hero-scrim-rgb)', isDark) }}
      />

      {/* TM-1 continuous sky preview — the BACKDROP gradient can't be a CSS var, so
          it cross-fades via two layers above the real backdrop (opacity-driven by
          applyScrub). The scrim + all content track the wheel via interpolated
          tokens on the hero section, so they need no preview layer. Hidden until a
          scrub begins; fades out on commit. */}
      <div ref={previewRef} className="absolute inset-0 z-[1] pointer-events-none" style={{ opacity: 0 }}>
        <div ref={bpARef} className="absolute inset-0" style={{ opacity: 1 }} />
        <div ref={bpBRef} className="absolute inset-0" style={{ opacity: 0 }} />
      </div>

      <div className="cinematic-vignette" style={{ zIndex: 2 }} />

      {/* ===== The astrolabe ===== */}
      <div
        ref={canvasWrapRef}
        aria-hidden="true"
        className="absolute z-[3] pointer-events-none aspect-square left-1/2 -translate-x-1/2 top-[6%] w-[62vw] max-w-[280px] opacity-60
                   md:left-auto md:translate-x-0 md:right-[4%] md:top-1/2 md:-translate-y-1/2 md:w-[min(44vw,560px)] md:max-w-none md:opacity-100"
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

      {/* Spin control — a subtle button that flicks the alidade into a free spin
          (winds up, coasts to a natural stop on real flywheel friction).
          Hidden under reduced motion, where the needle doesn't animate. Mirrors
          the astrolabe's responsive box, then sits at the box's PIVOT (needle
          centre) on mobile — where the instrument floats above the copy, so it
          never lands on the title — and drops to the lower rim on desktop, where
          the instrument lives off to the right in clear space. */}
      {!prefersReduced && (
        <div
          className="absolute z-20 pointer-events-none aspect-square left-1/2 -translate-x-1/2 top-[6%] w-[62vw] max-w-[280px]
                     md:left-auto md:translate-x-0 md:right-[4%] md:top-1/2 md:-translate-y-1/2 md:w-[min(44vw,560px)] md:max-w-none"
        >

          <div className="absolute left-1/2 -translate-x-1/2 w-11 h-11
                          top-1/2 -translate-y-1/2
                          md:top-auto md:bottom-0 md:translate-y-1/2">
            {/* Breathing attention halo (behind the button). */}
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid var(--color-ember)' }}
              initial={{ opacity: 0 }}
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ delay: 2.4, duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.button
              type="button"
              onClick={() => { track('astrolabe_spin'); astrolabeRef.current?.spin(); }}
              data-cursor="hover"
              aria-label={t('hero.spin')}
              className="pointer-events-auto relative grid place-items-center w-11 h-11 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(var(--hero-scrim-rgb), 0.5)',
                border: '1px solid var(--color-card-border)',
                color: 'var(--color-ember)',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.1, type: 'spring', stiffness: 220, damping: 18 }}
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9, rotate: 220 }}
            >
              <RefreshCcw size={17} strokeWidth={1.75} />
            </motion.button>
          </div>
        </div>
      )}

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
      {/* pointer-events-none so the full-width copy column doesn't sit on top of
          the astrolabe (z-3) and steal its pointer events — that overlap was why
          the bezel only grabbed near "E" (where the ring pokes past this column)
          and why hovering there thrashed. Interactive children opt back in. */}
      <div ref={copyRef} className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-28 md:justify-center md:pb-0 pointer-events-none">
        <div className="max-w-xl">
          <div className="hero-eyebrow chapter-eyebrow mb-5">{t('common.chapterLabel')} {chapters.origin.no} · {t('chapters.origin.label')}</div>

          <h1 className="font-chronicle font-semibold leading-[0.86] tracking-tight" style={{ color: 'var(--color-text)' }}>
            <span className="hero-line block overflow-hidden pb-[0.18em] -mb-[0.14em]"><span className="block text-[clamp(56px,12vw,150px)]">{firstName}</span></span>
            <span className="hero-line block overflow-hidden pb-[0.18em] -mb-[0.14em]"><span className="block text-[clamp(56px,12vw,150px)]">{lastName}</span></span>
          </h1>

          <p className="hero-tagline font-chronicle italic mt-3 text-[clamp(20px,3vw,34px)]" style={{ color: 'var(--color-ember)' }}>
            {t('hero.lead')}{' '}
            <span className="relative inline-grid align-baseline">
              {/* invisible sizer reserves the widest phrase so the line never reflows */}
              <span className="invisible col-start-1 row-start-1 whitespace-nowrap">{longestPhrase}</span>
              <span className="col-start-1 row-start-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${i18n.language}:${safeIdx}`}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block whitespace-nowrap"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {current}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </p>

          <p className="hero-hook mt-5 max-w-md text-[15px] sm:text-[17px] leading-[27px]" style={{ color: 'var(--color-text-muted)' }}>
            {t('hero.hook')}
          </p>

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5 pointer-events-auto">
            <button onClick={() => { track('hero_cta', { target: 'about' }); scrollToSection('about'); }} data-cursor="hover" className="btn-primary">{t('hero.ctaPrimary')}</button>
            <button onClick={() => { track('hero_cta', { target: 'contact' }); scrollToSection('contact'); }} data-cursor="hover" className="text-[15px] font-medium link-hover" style={{ color: 'var(--color-text)' }}>
              {t('hero.ctaSecondary')}
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
        <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('hero.scroll')}</span>
        <div className="w-px h-12 overflow-hidden" style={{ background: 'var(--color-card-border)' }}>
          <div className="w-px h-5 animate-[scrollcue_1.8s_ease-in-out_infinite]" style={{ background: 'var(--color-ember)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
