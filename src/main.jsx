import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Initialize theme before React renders to prevent flash
const initializeTheme = () => {
  const stored = localStorage.getItem('theme-storage');
  let theme = 'system';
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      theme = parsed.state?.theme || 'system';
    } catch (e) {
      console.warn('Failed to parse theme from storage');
    }
  }
  
  // Resolve system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolvedTheme = theme === 'system' 
    ? (prefersDark ? 'dark' : 'light')
    : theme;
  
  // Apply theme class before render
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  document.documentElement.style.colorScheme = resolvedTheme;
};

// Run before React mounts
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
