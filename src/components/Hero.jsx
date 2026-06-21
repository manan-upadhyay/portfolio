import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import { scrollToSection } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

const BASE = '/chronicle/';
const ASSETS = { sky: 'hero-sky.webp', mid: 'hero-mid.webp', fog: 'hero-fog.webp', fore: 'hero-fore.webp', portrait: 'portrait.png' };

// Probe an image once; resolves true/false (never rejects).
const probe = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

const Hero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const [have, setHave] = useState(null); // null = probing; object once resolved

  const rootRef = useRef(null);
  const layerRefs = useRef([]);
  const setLayer = (el) => { if (el) layerRefs.current[+el.dataset.idx] = el; };

  // Probe all optional assets in one pass → single state update.
  useEffect(() => {
    let alive = true;
    Promise.all(Object.entries(ASSETS).map(async ([k, f]) => [k, await probe(BASE + f)]))
      .then((pairs) => alive && setHave(Object.fromEntries(pairs)));
    return () => { alive = false; };
  }, []);

  // Intro timeline + scroll parallax-out (after assets resolve so layers exist).
  useEffect(() => {
    if (!have) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return; // elements rest at their natural (visible) state
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-layer', { opacity: 0, scale: 1.12, duration: 1.6, stagger: 0.08 })
        .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 }, '-=1')
        .from('.hero-line > span', { yPercent: 120, duration: 1, stagger: 0.12 }, '-=0.6')
        .from('.hero-sub', { opacity: 0, y: 18, duration: 0.8, stagger: 0.1 }, '-=0.5')
        .from('.hero-cue', { opacity: 0, duration: 0.8 }, '-=0.3');

      gsap.to('.hero-copy', {
        yPercent: -16, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: -6 - i * 5, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [have]);

  // Edge-safe mouse parallax (oversized layers + clamped, eased travel).
  useEffect(() => {
    if (!have) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(hover: none)').matches;
    if (reduce || coarse) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      layerRefs.current.forEach((el) => {
        if (!el) return;
        const d = +el.dataset.depth || 0;
        el.style.transform = `translate3d(${cx * d * 26}px, ${cy * d * 16}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, [have]);

  const firstName = personalInfo.name.split(' ')[0];
  const lastName = personalInfo.name.split(' ').slice(1).join(' ');
  const h = have || {};

  const layerBase = 'hero-layer absolute';
  const layerStyle = (z) => ({ inset: '-8%', zIndex: z });

  return (
    <section ref={rootRef} className="relative w-full h-screen overflow-hidden" id="origin">
      <div className="absolute inset-0">
        {/* 0 — SKY */}
        <div ref={setLayer} data-idx="0" data-depth="0.12" className={layerBase} style={layerStyle(1)}>
          {h.sky ? (
            <img src={BASE + ASSETS.sky} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: isDark
              ? 'radial-gradient(120% 100% at 70% 16%, #1B2440 0%, #0E1426 45%, #070A14 100%)'
              : 'radial-gradient(120% 100% at 70% 16%, #FBEFD8 0%, #F0E2C6 45%, #E4D2B0 100%)' }}>
              {isDark && [...Array(80)].map((_, i) => (
                <span key={i} className="absolute rounded-full bg-white"
                  style={{ width: i % 11 === 0 ? 2.5 : 1.4, height: i % 11 === 0 ? 2.5 : 1.4, left: `${(i * 37) % 100}%`, top: `${(i * 53) % 80}%`, opacity: 0.12 + ((i * 17) % 60) / 100 }} />
              ))}
            </div>
          )}
        </div>

        {/* 1 — MID (mountains) */}
        <div ref={setLayer} data-idx="1" data-depth="0.4" className={layerBase} style={layerStyle(2)}>
          {h.mid ? (
            <img src={BASE + ASSETS.mid} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center bottom' }} />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%]" style={{ width: '150%', height: '52%', background: isDark
              ? 'radial-gradient(50% 100% at 50% 100%, #141C30 0%, rgba(20,28,48,0.85) 55%, transparent 80%)'
              : 'radial-gradient(50% 100% at 50% 100%, rgba(150,128,92,0.7) 0%, rgba(150,128,92,0.4) 55%, transparent 80%)', filter: 'blur(8px)' }} />
          )}
        </div>

        {/* 2 — FOG (generated on black → screen blend drops the black) */}
        <div ref={setLayer} data-idx="2" data-depth="0.6" className={layerBase} style={layerStyle(3)}>
          {h.fog && (
            <img src={BASE + ASSETS.fog} alt="" className="absolute bottom-[8%] left-0 w-full object-cover"
              style={{ height: '40%', mixBlendMode: 'screen', opacity: isDark ? 0.9 : 0.55, animation: 'herofog 26s ease-in-out infinite alternate' }} />
          )}
        </div>

        {/* 3 — PORTRAIT */}
        {h.portrait && (
          <div ref={setLayer} data-idx="3" data-depth="0.7" className={layerBase} style={layerStyle(4)}>
            <div className="absolute inset-0 flex items-end justify-center md:justify-end md:pr-[7%]">
              <div className="relative">
                <div className="absolute inset-0 -z-10" style={{ filter: 'blur(46px)', background: isDark
                  ? 'radial-gradient(circle at 50% 42%, rgba(232,150,90,0.28), transparent 60%)'
                  : 'radial-gradient(circle at 50% 42%, rgba(217,119,46,0.3), transparent 60%)' }} />
                <img src={BASE + ASSETS.portrait} alt={personalInfo.name}
                  className="h-[90vh] w-auto object-contain object-bottom select-none" draggable="false" />
              </div>
            </div>
          </div>
        )}

        {/* 4 — FORE (nearest, darkest) */}
        <div ref={setLayer} data-idx="4" data-depth="0.95" className={layerBase} style={layerStyle(5)}>
          {h.fore ? (
            <img src={BASE + ASSETS.fore} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center bottom' }} />
          ) : (
            <div className="absolute bottom-0 left-0 w-full" style={{ height: '34%', background: isDark
              ? 'radial-gradient(60% 120% at 50% 100%, #070A14, transparent 75%)'
              : 'radial-gradient(60% 120% at 50% 100%, #E4D2B0, transparent 75%)', filter: 'blur(10px)' }} />
          )}
        </div>
      </div>

      {/* cinematic vignette unifies layers + masks every edge */}
      <div className="cinematic-vignette" style={{ zIndex: 6 }} />

      {/* ===== Copy ===== */}
      <div className="hero-copy relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center">
        <div className={`max-w-2xl ${h.portrait ? '' : 'md:max-w-3xl'}`}>
          <div className="hero-eyebrow chapter-eyebrow mb-5">Chapter 00 · Origin</div>

          <h1 className="font-chronicle font-semibold leading-[0.86] tracking-tight" style={{ color: 'var(--color-text)' }}>
            <span className="hero-line block overflow-hidden"><span className="block text-[clamp(56px,12vw,150px)]">{firstName}</span></span>
            <span className="hero-line block overflow-hidden"><span className="block text-[clamp(56px,12vw,150px)]">{lastName}</span></span>
          </h1>

          <p className="hero-sub font-chronicle italic mt-3 text-[clamp(20px,3vw,34px)]" style={{ color: 'var(--color-ember)' }}>
            {personalInfo.heroTitle}
          </p>
          <p className="hero-sub mt-5 max-w-md text-[15px] sm:text-[17px] leading-[27px]" style={{ color: 'var(--color-text-muted)' }}>
            {personalInfo.heroHook}
          </p>

          <div className="hero-sub mt-9 flex flex-wrap items-center gap-5">
            <button onClick={() => scrollToSection('about')} data-cursor="hover" className="btn-primary">Begin the Chronicle</button>
            <button onClick={() => scrollToSection('contact')} data-cursor="hover" className="text-[15px] font-medium link-hover" style={{ color: 'var(--color-text)' }}>
              Summon me →
            </button>
          </div>
        </div>
      </div>

      {/* scroll cue */}
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
