import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Phase 5 — the "Expedition recap". A session-only log of *this* visit, computed
// entirely client-side (no analytics infra) and deliberately NOT persisted — it
// resets every load, because the recap is about this journey. Read by
// `ExpeditionRecap` near the contact section.
//
// We track only what genuinely varies per visitor: time afield (session clock)
// and scroll distance. (Chapters/realms were dropped — anyone who reaches the
// recap has scrolled the whole page, so those were a constant 6/6 · N/N.)

// CSS reference pixels per metre (96 px/inch · 39.37 in/m). Turns raw scroll
// distance into a real, legible "trail unrolled" figure.
export const PX_PER_METER = 3779.5;

const useExpeditionStore = create((set) => ({
  startedAt: Date.now(), // session clock — set once, when the store is created
  scrollPx: 0, // total vertical distance traveled
  addScroll: (px) => set((s) => ({ scrollPx: s.scrollPx + px })),
}));

export { useExpeditionStore };

// Visit counter — the one thing the recap *does* remember across visits (just a
// local tally, never sent). `bumped` is session-only (excluded from persistence)
// so each page load increments exactly once. Call `bump()` from App on mount.
export const useVisitStore = create(
  persist(
    (set, get) => ({
      visits: 0,
      bumped: false,
      bump: () => {
        if (get().bumped) return;
        set({ visits: get().visits + 1, bumped: true });
      },
    }),
    { name: 'chronicle-visits', partialize: (s) => ({ visits: s.visits }) }
  )
);

/**
 * Mount-once tracker (lives in `App`). Accumulates total vertical scroll travel
 * (rAF-throttled, passive) for the recap's "trail unrolled" stat.
 */
export const useExpedition = () => {
  const addScroll = useExpeditionStore((s) => s.addScroll);
  useEffect(() => {
    let raf = 0;
    let last = window.scrollY;
    const measure = () => {
      const y = window.scrollY;
      addScroll(Math.abs(y - last));
      last = y;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [addScroll]);
};

/** Live session-elapsed in whole seconds. Ticks only while `active` (in view). */
export const useElapsed = (active = true) => {
  const startedAt = useExpeditionStore((s) => s.startedAt);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return Math.max(0, Math.floor((now - startedAt) / 1000));
};
