import { useEffect } from 'react';
import { trackOnce } from '../lib/analytics';

/**
 * Page-level engagement telemetry, driven off the already-computed `activeId`
 * (which chapter is centered) + the window scroll position:
 *
 *  • `section_view` — once per chapter per session → the "hot sections" heatmap.
 *  • `scroll_depth` — once per 25/50/75/100% milestone → how far visitors get.
 *
 * Only the Chronicle ('/') has the chapter spine, so section views are gated to
 * it; scroll depth is meaningful on any route. Everything is deduped per session
 * via `trackOnce`, so this never spams the pipeline on every scroll frame.
 */
const MILESTONES = [25, 50, 75, 100];

export const useEngagementAnalytics = (activeId, pathname) => {
  // Hot sections — fire the first time each chapter becomes the active one.
  useEffect(() => {
    if (pathname !== '/' || !activeId) return;
    trackOnce(`section:${activeId}`, 'section_view', { id: activeId });
  }, [activeId, pathname]);

  // Scroll depth — milestone buckets, deduped per session.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.min(100, Math.round(((window.scrollY) / max) * 100));
      for (const m of MILESTONES) {
        if (pct >= m) trackOnce(`scroll:${m}`, 'scroll_depth', { pct: m });
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
};
