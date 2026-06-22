import { lazy, Suspense, useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { useThemeStore } from './store/useThemeStore';
import Hero from './components/Hero';
import { Cursor, ErrorBoundary, SideRail, MapOverlay, MusicPlayer, DayNightToggle } from './components/ui';
import { useSmoothScroll } from './lib/smoothScroll';
import { useActiveSection } from './hooks/useActiveSection';
import { Analytics } from "@vercel/analytics/next"

const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Tech = lazy(() => import('./components/Tech'));
const Works = lazy(() => import('./components/Works'));
const Contact = lazy(() => import('./components/Contact'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-2 border-[var(--color-ember)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  useSmoothScroll();
  const activeId = useActiveSection();
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setMapOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative z-0 min-h-screen transition-colors duration-500"
      style={{ background: isDark ? 'var(--color-primary)' : 'var(--gradient-hero)' }}>
      <div className={isDark ? 'aurora-bg' : 'sunrise-bg'} />

      {/* persistent chrome */}
      <Cursor />
      <SideRail activeId={activeId} onOpenMap={() => setMapOpen(true)} visible={activeId !== 'origin'} />
      <div className="fixed top-5 right-5 z-40"><DayNightToggle /></div>
      <MusicPlayer />
      {/* mobile map button (side-rail is desktop-only) */}
      <button onClick={() => setMapOpen(true)} aria-label="Open the map"
        className="md:hidden fixed top-5 left-5 z-40 grid place-items-center w-11 h-11 rounded-full"
        style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', backdropFilter: 'blur(20px)' }}>
        <Compass size={18} style={{ color: 'var(--color-ember)' }} />
      </button>
      <MapOverlay open={mapOpen} onClose={() => setMapOpen(false)} activeId={activeId} />

      <Hero />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}><About /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}><Experience /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}><Tech /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}><Works /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}><Contact /></Suspense>
      </ErrorBoundary>

      <footer className="py-10 text-center border-t" style={{ borderColor: 'var(--color-card-border)' }}>
        <p className="font-chronicle italic text-[17px]" style={{ color: 'var(--color-text-muted)' }}>
          “The journey is the reward.”
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Manan Upadhyay · Crafted with React, GSAP & far too much chai.
        </p>
      </footer>
      <Analytics/>
    </div>
  );
};

export default App;
