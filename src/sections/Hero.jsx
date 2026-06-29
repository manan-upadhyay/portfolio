import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { personalInfo, chapters } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import { scrollToSection } from '../lib/smoothScroll';
import { useAstrolabe } from '../hooks/useAstrolabe';
import { RefreshCcw } from 'lucide-react';
import { sound } from '../lib/sound';
import { track, trackOnce } from '../lib/analytics';
import CompassRose from '../components/CompassRose';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useThemeStore();
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

  // The living astrolabe (Canvas2D). Re-mounts on theme change to re-read tokens.
  // Its needle speed drives the gear sound, so the gear turns as fast as the cursor
  // sweeps the alidade (and is silent at rest). Safe regardless of sound state.
  useAstrolabe(canvasRef, canvasWrapRef, bearingRef, resolvedTheme, sound.watch.setSpeed, astrolabeRef);

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
        onUpdate: (self) => sound.watch.setLevel(1 - self.progress),
        onLeave: () => sound.watch.setLevel(0),
        onLeaveBack: () => sound.watch.setLevel(1),
      });
      sound.watch.setLevel(1 - st.progress);
    }, rootRef);
    return () => { sound.watch.stop(); ctx.revert(); };
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
        style={{
          background: isDark
            ? 'linear-gradient(90deg, rgba(var(--hero-scrim-rgb),0.93) 0%, rgba(var(--hero-scrim-rgb),0.55) 40%, rgba(var(--hero-scrim-rgb),0) 70%)'
            : 'linear-gradient(90deg, rgba(var(--hero-scrim-rgb),0.92) 0%, rgba(var(--hero-scrim-rgb),0.5) 42%, rgba(var(--hero-scrim-rgb),0) 72%)',
        }}
      />
      <div className="cinematic-vignette" style={{ zIndex: 2 }} />

      {/* Seamless hand-off — pin the lower edge to the exact page background
          (`--color-primary`) so the vignette's edge-darkening doesn't leave a
          seam against the sections below. Below the astrolabe (z-3) so the
          instrument stays crisp. */}
      {isDark && (
        <div
          className="absolute inset-x-0 bottom-0 z-[2] pointer-events-none h-1/3"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-primary) 96%)' }}
        />
      )}

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
      <div ref={copyRef} className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-28 md:justify-center md:pb-0">
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

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5">
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
