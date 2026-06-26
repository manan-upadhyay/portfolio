import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sound } from '../lib/sound';

// Phase 4 — UI-facing sound state. The audio engine (`src/lib/sound.js`) owns the
// actual Web-Audio graph; this store holds the persisted *preferences* and the
// onboarding flag, and pushes every change into the engine. Default-on, but
// auto-muted under `prefers-reduced-motion` (the engine also hard-guards cues
// against reduced-motion, so this is belt-and-suspenders).

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface SoundState {
  enabled: boolean;
  volume: number;
  /** Has the visitor interacted with audio yet? Dismisses the onboarding note. */
  engaged: boolean;
  setEnabled: (v: boolean) => void;
  toggle: () => void;
  setVolume: (v: number) => void;
  markEngaged: () => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      enabled: !prefersReduced(),
      volume: 0.7,
      engaged: false,
      setEnabled: (v) => {
        set({ enabled: v });
        sound.setEnabled(v);
        if (v) {
          sound.unlock(); // toggling on counts as a gesture
          setTimeout(() => sound.playCue('confirm'), 60); // audible confirmation
        }
      },
      toggle: () => get().setEnabled(!get().enabled),
      setVolume: (v) => {
        set({ volume: v });
        sound.setVolume(v);
      },
      markEngaged: () => { if (!get().engaged) set({ engaged: true }); },
    }),
    {
      name: 'sound-storage',
      partialize: (s) => ({ enabled: s.enabled, volume: s.volume, engaged: s.engaged }),
      // On return visits, push the persisted preferences into the engine so the
      // very first cue already respects them.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        sound.setEnabled(state.enabled);
        sound.setVolume(state.volume);
      },
    }
  )
);
