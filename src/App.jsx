import { lazy, Suspense } from 'react';
import { useThemeStore } from './store/useThemeStore';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { CommandPalette, Cursor, ErrorBoundary } from './components/ui';
import { useSmoothScroll } from './lib/smoothScroll';

// Lazy load heavy sections for better initial load
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

  const openMap = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

  return (
    <div
      className="relative z-0 min-h-screen transition-colors duration-500"
      style={{ background: isDark ? 'var(--color-primary)' : 'var(--gradient-hero)' }}
    >
      <div className={isDark ? 'aurora-bg' : 'sunrise-bg'} />

      <Cursor />
      <CommandPalette />
      <Navbar onOpenMap={openMap} />

      <Hero />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Tech />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Works />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </ErrorBoundary>

      <footer className="py-10 text-center border-t" style={{ borderColor: 'var(--color-card-border)' }}>
        <p className="font-chronicle italic text-[17px]" style={{ color: 'var(--color-text-muted)' }}>
          “The journey is the reward.”
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Manan Upadhyay · Crafted with React, GSAP & far too much chai.
        </p>
      </footer>
    </div>
  );
};

export default App;
