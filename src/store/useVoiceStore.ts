import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { loadVoice } from '../i18n';
import { DEFAULT_VOICE, OPEN_VOICES, SEALED_VOICES } from '../i18n/voices';
import { fireVoiceChange } from '../lib/voiceChange';

interface VoiceState {
  /** Active voice = i18next language id. */
  voice: string;
  /** Sealed (easter-egg) voices the visitor has discovered. */
  unlocked: string[];
  /** Switch voice. Lazily loads + registers sealed bundles before switching. */
  setVoice: (voice: string) => Promise<void>;
  /** Unlock a sealed voice (does not switch to it). Returns false if unknown. */
  unlockVoice: (voice: string) => boolean;
  /** Has this voice been unlocked (or is it always open)? */
  isUnlocked: (voice: string) => boolean;
  /** Voice Hall overlay (the command-palette voice picker) — not persisted. */
  hallOpen: boolean;
  openHall: () => void;
  closeHall: () => void;
  /** Has the visitor ever opened the Hall? Persisted — drives the one-time
   *  "come discover voices" pulse on the quill button. */
  hallSeen: boolean;
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set, get) => ({
      voice: DEFAULT_VOICE,
      unlocked: [],

      setVoice: async (voice) => {
        const open = OPEN_VOICES.includes(voice);
        const unlocked = get().unlocked.includes(voice);
        if (!open && !unlocked) return; // can't switch to a sealed, undiscovered voice

        if (!open) {
          const ok = await loadVoice(voice); // code-split personality bundle
          if (!ok) return;
        }
        await i18n.changeLanguage(voice);
        set({ voice });
        fireVoiceChange(); // decode sound + per-text scramble as the copy transforms
      },

      unlockVoice: (voice) => {
        if (!SEALED_VOICES.includes(voice)) return false;
        if (get().unlocked.includes(voice)) return true;
        set({ unlocked: [...get().unlocked, voice] });
        return true;
      },

      isUnlocked: (voice) => OPEN_VOICES.includes(voice) || get().unlocked.includes(voice),

      hallOpen: false,
      hallSeen: false,
      openHall: () => set({ hallOpen: true, hallSeen: true }),
      closeHall: () => set({ hallOpen: false }),
    }),
    {
      name: 'voice-storage',
      partialize: (s) => ({ voice: s.voice, unlocked: s.unlocked, hallSeen: s.hallSeen }),
      // The i18n layer reads the persisted voice at init and (for a sealed,
      // unlocked voice) lazy-loads its bundle + switches — see i18n/index.js.
      // The store's `voice` rehydrates from the same storage, so menu + content
      // stay in sync without a second changeLanguage here.
    }
  )
);
