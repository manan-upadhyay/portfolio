# Architecture Overview

This document provides a comprehensive overview of the portfolio's architecture, design decisions, and patterns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Vite      │  │   React     │  │   Three.js/R3F      │  │
│  │   (Build)   │  │   (UI)      │  │   (3D Graphics)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   State Management                       ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  ││
│  │  │   Zustand   │  │ localStorage│  │  React State    │  ││
│  │  │  (Theme)    │  │ (Persist)   │  │  (Component)    │  ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Styling Layer                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  ││
│  │  │  Tailwind   │  │ CSS Vars    │  │ Framer Motion   │  ││
│  │  │  (Utility)  │  │ (Theming)   │  │  (Animation)    │  ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── assets/              # Static assets
│   ├── company/         # Company logos
│   ├── tech/            # Technology icons
│   └── *.png/svg        # Other images
│
├── components/          # React components
│   ├── canvas/          # 3D canvas components
│   │   ├── Ball.jsx     # Technology ball
│   │   ├── Computers.jsx# Desktop computer model
│   │   ├── Earth.jsx    # Earth globe
│   │   └── Stars.jsx    # Star field background
│   ├── Hero.jsx         # Landing section
│   ├── About.jsx        # About with skills
│   ├── Experience.jsx   # Work timeline
│   ├── Tech.jsx         # Technologies grid
│   ├── Works.jsx        # Projects showcase
│   ├── Contact.jsx      # Contact form
│   ├── Navbar.jsx       # Navigation
│   ├── ThemeToggle.jsx  # Theme switcher
│   └── Loader.jsx       # Loading spinner
│
├── constants/           # Static data
│   └── index.js         # All portfolio data
│
├── hoc/                 # Higher-Order Components
│   └── SectionWrapper.jsx # Section animation wrapper
│
├── store/               # State management
│   └── useThemeStore.ts # Theme state (Zustand)
│
├── utils/               # Utilities
│   └── motion.js        # Animation variants
│
├── App.jsx              # Root component
├── main.jsx             # Entry point
├── index.css            # Global styles + theme
└── styles.js            # Reusable style classes
```

## Core Patterns

### 1. Theme System

The theme system uses CSS custom properties for runtime theming:

```css
:root {
  --color-primary: #FFF8F0;     /* Light mode */
  --color-accent: #FF6B35;
}

.dark {
  --color-primary: #050816;     /* Dark mode */
  --color-accent: #00FFA3;
}
```

**Flow:**

1. `useThemeStore` manages theme state (Zustand + persist)
2. System preference detected via `matchMedia`
3. Theme class applied to `<html>` element
4. CSS variables automatically update all styled elements

### 2. 3D Rendering Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  useGLTF    │───▶│   Canvas    │───▶│   WebGL     │
│  (loader)   │    │  (R3F)      │    │  (render)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Suspense   │    │   Drei      │
│  (fallback) │    │  (helpers)  │
└─────────────┘    └─────────────┘
```

### 3. Animation System

Uses Framer Motion with reusable variants:

```javascript
// utils/motion.js
export const fadeIn = (direction, type, delay, duration) => ({
  hidden: { x, y, opacity: 0 },
  show: { x: 0, y: 0, opacity: 1, transition: {...} }
});
```

Applied via HOC:

```javascript
// hoc/SectionWrapper.jsx
<motion.section
  variants={staggerContainer()}
  initial="hidden"
  whileInView="show"
>
  <Component />
</motion.section>
```

### 4. Component Composition

```
App
├── Navbar (fixed)
│   └── ThemeToggle
├── Hero
│   ├── TypingText
│   ├── Stats Cards
│   ├── CTA Buttons
│   └── ComputersCanvas
├── About (SectionWrapper)
│   ├── SkillBars
│   ├── Stats Grid
│   └── ServiceCards
├── Experience (SectionWrapper)
│   └── VerticalTimeline
├── Tech (SectionWrapper)
│   ├── BallCanvas[] (desktop)
│   └── SkillCategories
├── Works (SectionWrapper)
│   └── ProjectCards[]
├── Contact (SectionWrapper)
│   ├── ContactForm
│   ├── SocialLinks
│   └── EarthCanvas
└── Footer
```

## Performance Considerations

### Mobile Optimizations

- 3D tech balls hidden on mobile (`Tech.jsx`)
- Stars canvas only renders in dark mode
- Reduced particle count on mobile

### Loading Strategy

- `Suspense` with `CanvasLoader` for 3D models
- `Preload` component for GLTF assets
- Lazy loading for heavy components (future)

### Bundle Optimization

- Vite code splitting (future)
- Tree shaking for Three.js
- CSS purging via Tailwind

## State Flow

```
User Action
     │
     ▼
┌─────────────┐
│  Component  │
│   State     │◄───┐
└─────────────┘    │
     │             │
     ▼             │
┌─────────────┐    │
│   Zustand   │    │
│   Store     │────┘
└─────────────┘
     │
     ▼
┌─────────────┐
│ localStorage│
│  (persist)  │
└─────────────┘
```

## Security Considerations

- EmailJS credentials in environment variables
- No sensitive data in client bundle
- External links use `rel="noopener noreferrer"`
- Form validation before submission

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL required for 3D features.
