import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './store/useThemeStore';
import Hero from './sections/Hero';
import { Cursor, ErrorBoundary, SideRail, MapOverlay, SkyControl, ControlCluster, EasterEggListener, VoiceTransition, VoiceHall } from './components';
import { useVoiceStore } from './store/useVoiceStore';
import { useSmoothScroll } from './lib/smoothScroll';
import { useActiveSection } from './hooks/useActiveSection';
import { useExpedition, useVisitStore } from './hooks/useExpedition';
import { sound } from './lib/sound';
import './store/useSoundStore'; // rehydrate sound prefs into the engine at boot
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
  useExpedition(); // accumulate session scroll distance → the Phase 5 recap
  const [mapOpen, setMapOpen] = useState(false);

  // Sound engine boot: arm the first-gesture unlock + preload the optional raven
  // sample (degrades to a synthesized flight if the file is absent).
  useEffect(() => {
    sound.arm();
    sound.loadRaven();
    sound.loadBeds(); // preload the optional astrolabe + arsenal loop samples
    useVisitStore.getState().bump(); // count this visit (local tally for the recap)
  }, []);

  // Map open / close whoosh — fire on transitions only (skip the initial mount).
  const mapWasOpen = useRef(false);
  useEffect(() => {
    if (mapOpen === mapWasOpen.current) return;
    sound.playCue(mapOpen ? 'mapOpen' : 'mapClose');
    mapWasOpen.current = mapOpen;
  }, [mapOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setMapOpen((o) => !o); }
      // ⇧⌘V (⇧⌃V) — summon the Voice Hall.
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        const { hallOpen, openHall, closeHall } = useVoiceStore.getState();
        (hallOpen ? closeHall : openHall)();
      }
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
      <ControlCluster activeId={activeId} />
      {/* listens for secret trigger words → unlocks the sealed voices */}
      <EasterEggListener />
      {/* per-text decode scramble + sound when the voice/copy changes */}
      <VoiceTransition />
      {/* mobile map button (side-rail is desktop-only) */}
      <button onClick={() => setMapOpen(true)} aria-label={t('nav.openMap')}
        className="md:hidden fixed top-5 left-5 z-40 grid place-items-center w-11 h-11 rounded-full"
        style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', backdropFilter: 'blur(20px)' }}>
        <Map size={18} style={{ color: 'var(--color-ember)' }} />
      </button>
      <MapOverlay open={mapOpen} onClose={() => setMapOpen(false)} activeId={activeId} />
      {/* the command-palette voice picker (⇧⌘V / from the popover / from ⌘K) */}
      <VoiceHall />

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
