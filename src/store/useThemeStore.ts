import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resolveSkyMode, SKY_BASE } from '../lib/sky';
import { track, registerContext } from '../lib/analytics';

// Phase 3 — the theme is now a 5-mode "sky": `auto` (time-driven) resolves to one
// of four palettes (dawn/day/dusk/night), each sitting on a light or dark base.
// `resolvedTheme` (light|dark) is kept as a derived alias so every existing
// `isDark` consumer keeps working unchanged.
export type SkyMode = 'auto' | 'dawn' | 'day' | 'dusk' | 'night';
export type ResolvedSky = 'dawn' | 'day' | 'dusk' | 'night';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  mode: SkyMode;
  resolvedSky: ResolvedSky;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: SkyMode) => void;
  toggleTheme: () => void;
  refreshAuto: () => void;
}

const baseOf = (sky: ResolvedSky): ResolvedTheme => SKY_BASE[sky] as ResolvedTheme;

// `auto` → resolve from the visitor's real local sky; a fixed mode is itself.
const resolveSky = (mode: SkyMode): ResolvedSky =>
  mode === 'auto' ? (resolveSkyMode() as ResolvedSky) : mode;

// The sun/moon toggle flips the base while preserving the "warmth tier" the
// visitor is in — dawn↔dusk (golden), day↔night (plain). It always commits to a
// manual mode (leaves `auto`).
const FLIP: Record<ResolvedSky, ResolvedSky> = {
  dawn: 'dusk',
  dusk: 'dawn',
  day: 'night',
  night: 'day',
};

const updateDocumentTheme = (sky: ResolvedSky) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const base = baseOf(sky);
  root.classList.remove('light', 'dark');
  root.classList.add(base);
  root.dataset.sky = sky;
  root.style.colorScheme = base;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      resolvedSky: 'night',
      resolvedTheme: 'dark',
      setMode: (mode: SkyMode) => {
        const resolvedSky = resolveSky(mode);
        set({ mode, resolvedSky, resolvedTheme: baseOf(resolvedSky) });
        updateDocumentTheme(resolvedSky);
        track('theme_changed', { mode, sky: resolvedSky });
        registerContext({ sky_mode: mode });
      },
      toggleTheme: () => {
        get().setMode(FLIP[get().resolvedSky]);
      },
      refreshAuto: () => {
        if (get().mode !== 'auto') return;
        const resolvedSky = resolveSky('auto');
        if (resolvedSky === get().resolvedSky) return;
        set({ resolvedSky, resolvedTheme: baseOf(resolvedSky) });
        updateDocumentTheme(resolvedSky);
      },
    }),
    {
      name: 'theme-storage',
      version: 2,
      // Only the user's choice is persisted; the resolved sky is recomputed.
      partialize: (state) => ({ mode: state.mode }),
      // v1 stored `theme: light|dark|system`; map it onto the new modes.
      migrate: (persisted: any, version: number) => {
        if (version >= 2 || !persisted) return persisted;
        const legacy = persisted.theme;
        const mode: SkyMode =
          legacy === 'light' ? 'day' : legacy === 'dark' ? 'night' : 'auto';
        return { mode };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const resolvedSky = resolveSky(state.mode);
        state.resolvedSky = resolvedSky;
        state.resolvedTheme = baseOf(resolvedSky);
        updateDocumentTheme(resolvedSky);
      },
    }
  )
);

// Initialize on load + keep `auto` honest: re-resolve when the tab returns to
// the foreground (so leaving the page open across dawn/dusk catches up).
if (typeof window !== 'undefined') {
  const apply = () => {
    const { mode } = useThemeStore.getState();
    const resolvedSky = resolveSky(mode);
    useThemeStore.setState({ resolvedSky, resolvedTheme: baseOf(resolvedSky) });
    updateDocumentTheme(resolvedSky);
  };
  apply();
  const onWake = () => {
    if (document.visibilityState === 'visible') useThemeStore.getState().refreshAuto();
  };
  document.addEventListener('visibilitychange', onWake);
  window.addEventListener('focus', () => useThemeStore.getState().refreshAuto());
}
