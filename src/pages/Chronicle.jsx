import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Hero from '../sections/Hero';
import { ErrorBoundary, SideRail, MapOverlay } from '../components';
import { useExpedition } from '../hooks/useExpedition';
import { restoreScroll } from '../lib/smoothScroll';
import { sound } from '../lib/sound';

const About = lazy(() => import('../sections/About'));
const Experience = lazy(() => import('../sections/Experience'));
const Tech = lazy(() => import('../sections/Tech'));
const Works = lazy(() => import('../sections/Works'));
const Contact = lazy(() => import('../sections/Contact'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-2 border-[var(--color-ember)] border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Chapters 00–05 of The Chronicle — the scroll-directed journey. The Atelier
 * coda now lives on its own route (/making-of); the foot of The Realms is the
 * doorway to it (see Works.jsx). On return from the Atelier we restore the
 * scroll position the visitor stepped out from.
 */
const Chronicle = () => {
  const { t } = useTranslation();
  const { activeId } = useOutletContext();
  const [mapOpen, setMapOpen] = useState(false);
  useExpedition(); // accumulate session scroll distance → the Phase 5 recap

  // Returning from the Atelier: drop the visitor back at the doorway they left.
  useEffect(() => restoreScroll(), []);

  // Map open / close whoosh — fire on transitions only (skip the initial mount).
  const mapWasOpen = useRef(false);
  useEffect(() => {
    if (mapOpen === mapWasOpen.current) return;
    sound.playCue(mapOpen ? 'mapOpen' : 'mapClose');
    mapWasOpen.current = mapOpen;
  }, [mapOpen]);

  // ⌘K — toggle the realm map (Chronicle-only).
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setMapOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <SideRail activeId={activeId} onOpenMap={() => setMapOpen(true)} visible={activeId !== 'origin'} />
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
    </>
  );
};

export default Chronicle;
