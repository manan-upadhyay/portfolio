# AI Development Guide

This guide helps AI agents (Claude, GPT, Gemini, Cursor, Antigravity) understand and work with this codebase effectively.

## 🤖 Quick Context

**Project:** Senior Full Stack Developer Portfolio
**Stack:** React 18 + Vite + Three.js + Framer Motion + Tailwind + Zustand
**Purpose:** Interactive 3D portfolio showcasing 4+ years of experience

## 📍 Key Entry Points

| When you need to... | Look here |
|---------------------|-----------|
| Add/edit personal info | `src/constants/index.js` → `personalInfo` |
| Modify work experience | `src/constants/index.js` → `experiences` |
| Update projects | `src/constants/index.js` → `projects` |
| Change skills | `src/constants/index.js` → `skillCategories` |
| Modify theme colors | `src/index.css` → `:root` and `.dark` |
| Add new sections | `src/components/` + update `App.jsx` |
| Modify 3D elements | `src/components/canvas/` |

## 🎨 Theme System

### How it works

1. **Store:** `src/store/useThemeStore.ts` (Zustand)
2. **CSS Variables:** `src/index.css` (`:root` and `.dark`)
3. **Toggle:** `src/components/ThemeToggle.jsx`

### Key variables

```css
--color-primary      /* Background */
--color-text         /* Main text */
--color-accent       /* Highlights (aurora green / sunrise orange) */
--gradient-accent    /* Gradient for buttons/badges */
```

### Adding theme-aware styles

```jsx
// Use CSS variables
style={{ color: 'var(--color-text)' }}

// Or use Zustand hook
const { resolvedTheme } = useThemeStore();
const isDark = resolvedTheme === 'dark';
```

## 🧩 Component Patterns

### Section Component Template

```jsx
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { textVariant, fadeIn } from '../utils/motion';
import { useThemeStore } from '../store/useThemeStore';

const MySection = () => {
  const { resolvedTheme } = useThemeStore();
  
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText} style={{ color: 'var(--color-text-muted)' }}>
          Subtitle
        </p>
        <h2 className={styles.sectionHeadText} style={{ color: 'var(--color-text)' }}>
          Title.
        </h2>
      </motion.div>
      
      <motion.div variants={fadeIn('up', 'spring', 0.5, 0.75)}>
        {/* Content */}
      </motion.div>
    </>
  );
};

export default SectionWrapper(MySection, 'section-id');
```

### Animation Variants

```javascript
// Available in utils/motion.js
textVariant(delay)           // Header animations
fadeIn(dir, type, delay, duration)  // Fade from direction
slideIn(dir, type, delay, duration) // Slide from edge
zoomIn(delay, duration)      // Scale in
staggerContainer()           // Parent for staggered children
```

## 📦 Data Structures

### Experience Entry

```javascript
{
  title: 'Job Title',
  company_name: 'Company',
  icon: importedIcon,
  iconBg: '#hexcolor',
  date: 'Month Year - Present',
  points: ['Achievement 1', 'Achievement 2'],
  technologies: ['React', 'Node.js'],
}
```

### Project Entry

```javascript
{
  name: 'Project Name',
  company: 'Client/Company',
  description: 'Brief description...',
  tags: [{ name: 'react', color: 'blue-text-gradient' }],
  image: importedImage, // or empty string for placeholder
  source_code_link: 'https://github.com/...',
  live_demo_link: 'https://...',
  highlights: ['Key achievement 1', 'Key achievement 2'],
}
```

### Skill Category

```javascript
{
  category: 'Frontend',
  skills: [
    { name: 'React.js', level: 95 },
    { name: 'TypeScript', level: 90 },
  ],
}
```

## 🔧 Common Tasks

### Adding a new section

1. Create `src/components/NewSection.jsx`
2. Use `SectionWrapper` HOC
3. Export from `src/components/index.js`
4. Import and add to `App.jsx`

### Adding a new 3D element

1. Create component in `src/components/canvas/`
2. Use `Canvas` from `@react-three/fiber`
3. Wrap content in `Suspense` with `CanvasLoader`
4. Export from `src/components/canvas/index.js`

### Modifying theme

1. Update CSS variables in `src/index.css`
2. Light theme: `:root { ... }`
3. Dark theme: `.dark { ... }`

### Adding new animation

1. Add variant to `src/utils/motion.js`
2. Apply with `variants={yourVariant()}`

## ⚠️ Important Considerations

### Performance

- Hide heavy 3D on mobile: `window.innerWidth < 768`
- Use `React.memo` for pure components
- Lazy load large sections (future)

### Theme Safety

- Always use CSS variables for colors
- Test both light AND dark modes
- Check `useThemeStore` for conditional styling

### Mobile

- Test all breakpoints: 375px, 768px, 1024px, 1440px
- Disable complex 3D on mobile
- Use responsive Tailwind classes

## 🧪 Testing Checklist

Before committing changes:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Theme toggle works (both directions)
- [ ] Mobile menu opens/closes
- [ ] All sections render correctly
- [ ] Contact form shows success/error states

## 📁 File Locations Reference

```
Constants & Data    → src/constants/index.js
Theme Store         → src/store/useThemeStore.ts
Global CSS          → src/index.css
Style Utilities     → src/styles.js
Animation Variants  → src/utils/motion.js
Section Wrapper     → src/hoc/SectionWrapper.jsx
3D Components       → src/components/canvas/
UI Components       → src/components/
Assets              → src/assets/
```

## 🚨 Known Issues / Gotchas

1. **CRLF line endings** - Some files may have Windows line endings
2. **Large bundle** - Three.js adds significant weight (~1.2MB)
3. **GLTF models** - Must be in `public/` folder, not `src/`
4. **EmailJS** - Requires environment variables to be set

## 💡 Enhancement Ideas

See `docs/ROADMAP.md` for planned features and improvements.
