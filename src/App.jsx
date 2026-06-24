import { lazy, Suspense, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/useThemeStore';
import Hero from './sections/Hero';
import { Cursor, ErrorBoundary, SideRail, MapOverlay, SkyControl, ControlCluster, EasterEggListener } from './components';
// import { MusicPlayer } from './components'; // ambient audio — folds into ControlCluster in Phase 4
import { useSmoothScroll } from './lib/smoothScroll';
import { useActiveSection } from './hooks/useActiveSection';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

const About = lazy(() => import('./sections/About'));
const Experience = lazy(() => import('./sections/Experience'));
const Tech = lazy(() => import('./sections/Tech'));
const Works = lazy(() => import('./sections/Works'));
const Contact = lazy(() => import('./sections/Contact'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-2 border-[var(--color-ember)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const { t } = useTranslation();
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
      <div className="fixed top-5 right-5 z-40"><SkyControl /></div>
      {/* bottom-right control cluster — voice switcher (+ audio control in Phase 4) */}
      <ControlCluster />
      {/* listens for secret trigger words → unlocks the sealed voices */}
      <EasterEggListener />
      {/* mobile map button (side-rail is desktop-only) */}
      <button onClick={() => setMapOpen(true)} aria-label={t('nav.openMap')}
        className="md:hidden fixed top-5 left-5 z-40 grid place-items-center w-11 h-11 rounded-full"
        style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', backdropFilter: 'blur(20px)' }}>
        <Map size={18} style={{ color: 'var(--color-ember)' }} />
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
          {t('footer.quote')}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('footer.credit', { year: new Date().getFullYear() })}
        </p>
      </footer>
      <Analytics/>
      <SpeedInsights />
    </div>
  );
};

export default App;
