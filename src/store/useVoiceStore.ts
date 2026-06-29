import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { loadVoice } from '../i18n';
import { DEFAULT_VOICE, OPEN_VOICES, SEALED_VOICES } from '../i18n/voices';
import { fireVoiceChange } from '../lib/voiceChange';
import { track, registerContext } from '../lib/analytics';

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
  /** Has the visitor ever opened the Hall? Persisted. */
  hallSeen: boolean;
  /** Has the one-time "try the voices" entice note been shown/engaged? Persisted. */
  voiceNoted: boolean;
  markVoiceNoted: () => void;
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
        // Which voices visitors actually try → the dashboard derives both the
        // distinct-count per session and the "favourite" (most-selected) voice.
        track('voice_selected', { voice });
        registerContext({ voice }); // keep the live voice on every later event
        fireVoiceChange(); // decode sound + per-text scramble as the copy transforms
      },

      unlockVoice: (voice) => {
        if (!SEALED_VOICES.includes(voice)) return false;
        if (get().unlocked.includes(voice)) return true;
        set({ unlocked: [...get().unlocked, voice] });
        track('voice_unlocked', { voice }); // an easter-egg voice was discovered
        return true;
      },

      isUnlocked: (voice) => OPEN_VOICES.includes(voice) || get().unlocked.includes(voice),

      hallOpen: false,
      hallSeen: false,
      openHall: () => {
        if (!get().hallOpen) track('voice_hall_open');
        set({ hallOpen: true, hallSeen: true, voiceNoted: true });
      },
      closeHall: () => set({ hallOpen: false }),

      voiceNoted: false,
      markVoiceNoted: () => set({ voiceNoted: true }),
    }),
    {
      name: 'voice-storage',
      partialize: (s) => ({ voice: s.voice, unlocked: s.unlocked, hallSeen: s.hallSeen, voiceNoted: s.voiceNoted }),
      // The i18n layer reads the persisted voice at init and (for a sealed,
      // unlocked voice) lazy-loads its bundle + switches — see i18n/index.js.
      // The store's `voice` rehydrates from the same storage, so menu + content
      // stay in sync without a second changeLanguage here.
    }
  )
);
