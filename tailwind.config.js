/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      // Extra breakpoint below Tailwind's `sm`.
      screens: {
        xs: '450px',
      },
      // Real design-system tokens (defined in src/index.css). All color is
      // applied via inline `var(--color-*)`, so no color utilities live here.
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        chronicle: ['Cormorant Garamond', 'Plus Jakarta Sans', 'serif'],
      },
    },
  },
  plugins: [],
};
