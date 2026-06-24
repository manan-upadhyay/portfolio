import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { resolveSkyMode, SKY_BASE } from './lib/sky';
import './i18n'; // initialize the Voice (i18next) layer before render
import './index.css';

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
  }

  const sky = mode === 'auto' ? resolveSkyMode() : mode;
  const base = SKY_BASE[sky] || 'dark';
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(base);
  root.dataset.sky = sky;
  root.style.colorScheme = base;
};

// Run before React mounts
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
