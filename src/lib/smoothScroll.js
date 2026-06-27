import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton so any component can request a smooth scroll.
let lenisInstance = null;

/**
 * Mount once (in App). Sets up Lenis smooth scrolling and drives it from
 * GSAP's ticker so ScrollTrigger and Lenis stay perfectly in sync.
 * Auto-disables smoothing for users who prefer reduced motion.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Own scroll restoration: the browser's native restore fights GSAP's pinned
    // horizontal Experience (its scroll-distance changes the page height as pins
    // resolve), so a reload mid-page would jank through it. Manual = always start
    // clean at the top (the hero), no fight with Lenis/ScrollTrigger.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      syncTouch: false,
    });
    lenisInstance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
};

/** Smooth-scroll to an element id (e.g. "about"), accounting for the navbar. */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -40, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

export const scrollToTop = () => {
  if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const getLenis = () => lenisInstance;

// Cross-route scroll memory: when the visitor leaves the Chronicle for the
// Atelier (the /making-of route), the scroll page unmounts. We stash the exact
// scrollY so that, on return, they land back at the doorway they stepped through
// (the foot of The Realms) instead of at the top.
let rememberedY = null;
export const rememberScroll = () => { rememberedY = window.scrollY; };

/**
 * Restore the scrollY remembered when the visitor stepped into the Atelier,
 * after the Chronicle remounts. The pinned horizontal Experience grows the page
 * height asynchronously (its lazy chunk mounts, then ScrollTrigger measures the
 * pin), so we can't scroll to a deep Y until the document is tall enough: poll
 * the height for a few frames, then jump there instantly (no animation — it
 * should feel like we never left). The remembered value is cleared only once the
 * scroll is actually applied, so React StrictMode's double-invoked mount effect
 * (dev) can't swallow it on the first pass.
 */
export const restoreScroll = () => {
  if (rememberedY == null) return () => {};
  const y = rememberedY;
  let raf = 0;
  let tries = 0;
  const step = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max >= y - 4 || tries > 40) {
      rememberedY = null;
      const target = Math.max(0, Math.min(y, max));
      if (lenisInstance) lenisInstance.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
      return;
    }
    tries += 1;
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
};
