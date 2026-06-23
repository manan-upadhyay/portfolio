# Component Documentation

This document provides detailed documentation for all React components in the portfolio.

## 📚 Table of Contents

- [Page Components](#page-components)
- [3D Canvas Components](#3d-canvas-components)
- [UI Components](#ui-components)
- [HOCs](#higher-order-components)

---

## Page Components

### Hero

**File:** `src/components/Hero.jsx`

The main landing section with animated text and 3D computer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- Typing animation for taglines
- Floating animated orbs
- Stats cards with glassmorphism
- CTA buttons
- Scroll indicator

**Usage:**

```jsx
<Hero />
```

---

### About

**File:** `src/components/About.jsx`

Overview section with bio, skills, and services.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- Animated skill bars with percentages
- Stats grid (years, projects, etc.)
- Service cards with icons
- Wrapped with SectionWrapper

**Subcomponents:**

- `ServiceCard` - Tilt card for each service
- `SkillBar` - Animated progress bar

---

### Experience

**File:** `src/components/Experience.jsx`

Work history timeline using vertical-timeline-component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- Vertical timeline layout
- Theme-aware card styling
- Technology tags per role
- Company logos

**Subcomponents:**

- `ExperienceCard` - Individual timeline entry

---

### Tech

**File:** `src/components/Tech.jsx`

Technologies showcase with 3D balls and skill categories.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- 3D tech balls (desktop only)
- Skill categories with proficiency
- Tooltips on hover
- Mobile-optimized (hides 3D)

**Subcomponents:**

- `TechIcon` - 3D ball with tooltip
- `SkillCategory` - Category card with skills

---

### Works

**File:** `src/components/Works.jsx`

Projects showcase with expandable cards.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- Tilt effect on cards
- Expandable highlights
- Company badges
- Hover overlay for links
- Placeholder initials if no image

**Subcomponents:**

- `ProjectCard` - Individual project card

---

### Contact

**File:** `src/components/Contact.jsx`

Contact form with social links and 3D Earth.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- EmailJS integration
- Social links (Email, LinkedIn, GitHub)
- Success/error message states
- Loading spinner
- 3D Earth globe

---

### Navbar

**File:** `src/components/Navbar.jsx`

Fixed navigation with theme toggle.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses constants) |

**Features:**

- Scroll-based blur effect
- Theme toggle integration
- Resume download button
- Animated mobile menu
- Glassmorphism styling

---

## 3D Canvas Components

### ComputersCanvas

**File:** `src/components/canvas/Computers.jsx`

3D desktop computer model.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isMobile | boolean | false | Adjusts scale/position |

**Features:**

- GLTF model loading
- Hemisphere and point lights
- Orbit controls (limited)
- Responsive scaling

---

### BallCanvas

**File:** `src/components/canvas/Ball.jsx`

3D sphere with technology icon texture.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | string | required | Path to icon image |

**Features:**

- Decal texture on sphere
- Float animation
- Orbit controls

---

### EarthCanvas

**File:** `src/components/canvas/Earth.jsx`

3D Earth globe for contact section.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props |

**Features:**

- GLTF Earth model
- Auto-rotation
- Orbit controls

---

### StarsCanvas

**File:** `src/components/canvas/Stars.jsx`

Animated star field background.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props |

**Features:**

- 5000 random points
- Continuous rotation
- Theme-aware colors (aurora green / golden)
- Only renders in dark mode

---

## UI Components

### ThemeToggle

**File:** `src/components/ThemeToggle.jsx`

Animated sun/moon theme switcher.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (uses store) |

**Features:**

- Sun/moon icon transformation
- Animated stars in dark mode
- Gradient backgrounds
- Smooth 500ms transitions

**Usage:**

```jsx
import { ThemeToggle } from './components';

<ThemeToggle />
```

---

### Loader

**File:** `src/components/Loader.jsx`

Loading spinner for 3D content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props |

**Features:**

- Html component from Drei
- Centered positioning
- Progress percentage display

**Usage:**

```jsx
<Suspense fallback={<CanvasLoader />}>
  <My3DComponent />
</Suspense>
```

---

## Higher-Order Components

### SectionWrapper

**File:** `src/hoc/SectionWrapper.jsx`

Wraps sections with consistent styling and animation.

| Parameter | Type | Description |
|-----------|------|-------------|
| Component | React.FC | Component to wrap |
| idName | string | Section ID for navigation |

**Features:**

- Consistent padding and max-width
- Stagger container animation
- Adds ID for hash navigation
- Initial/whileInView animations

**Usage:**

```jsx
import { SectionWrapper } from '../hoc';

const MySection = () => <div>Content</div>;

export default SectionWrapper(MySection, 'my-section');
```

---

## Animation Variants

**File:** `src/utils/motion.js`

Reusable Framer Motion variants.

### textVariant

```jsx
variants={textVariant(delay)}
```

Slides in from top with fade.

### fadeIn

```jsx
variants={fadeIn(direction, type, delay, duration)}
```

- `direction`: 'left' | 'right' | 'up' | 'down'
- `type`: 'tween' | 'spring'

### slideIn

```jsx
variants={slideIn(direction, type, delay, duration)}
```

Slides from edge of viewport.

### zoomIn

```jsx
variants={zoomIn(delay, duration)}
```

Scales up from small to full.

### staggerContainer

```jsx
variants={staggerContainer(staggerChildren, delayChildren)}
```

Parent container for staggered children.

---

## Component Dependencies

```
App
├── Navbar
│   └── ThemeToggle
├── Hero
│   └── ComputersCanvas
├── About (SectionWrapper)
├── Experience (SectionWrapper)
├── Tech (SectionWrapper)
│   └── BallCanvas[]
├── Works (SectionWrapper)
├── Contact (SectionWrapper)
│   └── EarthCanvas
└── StarsCanvas
```
