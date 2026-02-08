import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import { Navbar, Hero, Loader } from './components';

// Lazy load heavy sections for better initial load
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Tech = lazy(() => import('./components/Tech'));
const Works = lazy(() => import('./components/Works'));
const Contact = lazy(() => import('./components/Contact'));
const StarsCanvas = lazy(() => import('./components/canvas/Stars'));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <BrowserRouter>
      <div 
        className={`relative z-0 min-h-screen transition-colors duration-500`}
        style={{ 
          background: isDark 
            ? 'var(--color-primary)' 
            : 'var(--gradient-hero)'
        }}
      >
        {/* Theme-aware background effects */}
        <div className={isDark ? 'aurora-bg' : 'sunrise-bg'} />
        
        {/* Hero Section - Critical, loaded immediately */}
        <div className="relative">
          <Navbar />
          <Hero />
        </div>
        
        {/* Lazy-loaded sections */}
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Tech />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Works />
        </Suspense>
        
        {/* Contact with Stars Background (dark mode only) */}
        <div className="relative z-0">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
          {isDark && (
            <Suspense fallback={null}>
              <StarsCanvas />
            </Suspense>
          )}
        </div>
        
        {/* Footer */}
        <footer className="py-8 text-center border-t border-[var(--color-card-border)]">
          <p className="text-[var(--color-text-muted)] text-sm">
            © {new Date().getFullYear()} Manan Upadhyay. Built with React, Three.js & Framer Motion.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
