import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') return getSystemTheme();
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      setTheme: (theme: Theme) => {
        const resolvedTheme = resolveTheme(theme);
        set({ theme, resolvedTheme });
        updateDocumentTheme(resolvedTheme);
      },
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolvedTheme = resolveTheme(state.theme);
          state.resolvedTheme = resolvedTheme;
          updateDocumentTheme(resolvedTheme);
        }
      },
    }
  )
);

const updateDocumentTheme = (theme: ResolvedTheme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  // Update color-scheme for native elements
  root.style.colorScheme = theme;
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  const initTheme = () => {
    const stored = localStorage.getItem('theme-storage');
    let theme: Theme = 'system';
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        theme = parsed.state?.theme || 'system';
      } catch {
        theme = 'system';
      }
    }
    
    const resolvedTheme = resolveTheme(theme);
    updateDocumentTheme(resolvedTheme);
  };
  
  initTheme();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      const newResolved = e.matches ? 'dark' : 'light';
      useThemeStore.setState({ resolvedTheme: newResolved });
      updateDocumentTheme(newResolved);
    }
  });
}
