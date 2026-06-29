import { create } from 'zustand';

/**
 * Coachmark coordinator — guarantees only ONE bottom-right coachmark bubble is
 * visible at a time, so the Sound hint and the Voice entice note never overlap.
 *
 * Both controls sit in the same corner and pop UPWARD; if both showed at once
 * they'd stack into an unreadable pile. Each control `request`s the stage when
 * its own conditions are met and renders its bubble only while it `owns` it.
 * Requesting preempts whoever currently holds the stage (the later, more
 * intentional invitation wins — typically the Voice note once the visitor is
 * deep enough in the journey), and `release` clears it only if still the owner.
 */
type CoachmarkId = 'sound' | 'voice';

interface CoachmarkState {
  active: CoachmarkId | null;
  /** Claim the stage (preempts any current holder). */
  request: (id: CoachmarkId) => void;
  /** Give up the stage — only clears if `id` is the current holder. */
  release: (id: CoachmarkId) => void;
  /** Convenience: does `id` currently own the stage? */
  owns: (id: CoachmarkId) => boolean;
}

export const useCoachmark = create<CoachmarkState>((set, get) => ({
  active: null,
  request: (id) => set({ active: id }),
  release: (id) => set((s) => (s.active === id ? { active: null } : s)),
  owns: (id) => get().active === id,
}));
