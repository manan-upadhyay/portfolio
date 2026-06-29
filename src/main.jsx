import React from 'react';
import ReactDOM from 'react-dom/client';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import App from './App.jsx';
import { resolveSkyMode, SKY_BASE } from './lib/sky';
import { markAnalyticsReady, dntEnabled } from './lib/analytics';
import log, { greet } from './lib/log';
import './i18n'; // initialize the Voice (i18next) layer before render
import './index.css';

// Analytics — initialize the PostHog singleton ONCE, before render (the official
// posthog-js pattern). Shared app-wide via <PostHogProvider>; non-component
// callers (Zustand stores, the audio engine) reach the same instance through the
// `track()` facade in lib/analytics.js. Cookieless + anonymous (no consent
// banner). Hard-disabled without a key or under Do-Not-Track.
//   `defaults: '2026-05-30'` opts into PostHog's modern preset: autocapture
//   (heatmaps / rage- + dead-clicks), history-change $pageview, $pageleave, web
//   vitals, and exception autocapture. Session replay is gated in the PostHog
//   project settings (we don't disable it here). See docs/chronicle/ANALYTICS.md.
const PH_KEY = import.meta.env.VITE_POSTHOG_KEY;
const PH_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
if (PH_KEY && !dntEnabled()) {
  posthog.init(PH_KEY, {
    api_host: PH_HOST,
    defaults: '2026-05-30',
    persistence: 'memory', // cookieless + anonymous → no consent banner
    capture_exceptions: true, // JS error tracking
  });
  markAnalyticsReady();
  log.info('analytics ready — cookieless PostHog, error capture on');
} else {
  log.info('analytics disabled', dntEnabled() ? '(Do-Not-Track honored)' : '(no key)');
}

// Resolve the visitor's "sky" (Phase 3: auto/dawn/day/dusk/night) and paint the
// base class + data-sky onto <html> before React renders, to prevent a flash.
const initializeTheme = () => {
  let mode = 'auto';
  try {
    const parsed = JSON.parse(localStorage.getItem('theme-storage'));
    // New shape persists `mode`; migrate the legacy `theme` (light|dark|system).
    const legacy = parsed?.state?.theme;
    mode = parsed?.state?.mode
      || (legacy === 'light' ? 'day' : legacy === 'dark' ? 'night' : 'auto');
  } catch {
    mode = 'auto';
    log.warn('theme: could not read persisted sky — falling back to auto');
  }

  const sky = mode === 'auto' ? resolveSkyMode() : mode;
  const base = SKY_BASE[sky] || 'dark';
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(base);
  root.dataset.sky = sky;
  root.style.colorScheme = base;
  log.info(`sky resolved → ${sky} (${base}) from mode "${mode}"`);
};

// Run before React mounts
initializeTheme();

// Greet the curious soul who opens DevTools (once, on-brand).
greet();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>,
);
