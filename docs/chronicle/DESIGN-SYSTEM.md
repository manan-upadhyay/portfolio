# Design System — The Chronicle

The visual & motion language. **Every component must consume these tokens**, not
raw values. Tokens are defined in [`src/index.css`](../../src/index.css) and
[`tailwind.config.js`](../../tailwind.config.js).

---

## 1. Color tokens

All color is a CSS variable, re-mapped per theme by the `.dark` / `.light` class
on `<html>` (managed by `useThemeStore`). **Never hardcode hex in a component**
(only allowed inside a generated-art procedural fallback).

### Semantic tokens (use these)

| Token | Dark ("Starlit Realm") | Light ("Dawn over the Realm") | Use for |
|---|---|---|---|
| `--color-primary` | `#0B0F1A` | `#F5F0E6` | Page background |
| `--color-primary-dark` | `#060911` | `#ECE4D4` | Deeper wells, footers |
| `--color-tertiary` | `#161D2E` | `#E2D8C4` | Raised surfaces |
| `--color-text` | `#ECE7DB` | `#1F1B16` | Primary text / headings |
| `--color-text-muted` | `#9AA3B5` | `#5C5345` | Body / secondary text |
| `--color-accent` | `#818CF8` (arcane indigo) | `#4F46E5` | Links, focus, primary actions |
| `--color-ember` | `#E8965A` | `#D9772E` | **Signature warm accent** — eyebrows, highlights, route lines |
| `--color-gold` | `#D9A441` | `#B88A2E` | Secondary warm accent, waypoints, seals |
| `--color-parchment` | `#E7DECF` | `#F5F0E6` | Story/quote text on dark, card backs on light |
| `--color-card-bg` | `rgba(20,27,44,.8)` | `rgba(255,252,245,.85)` | Glass/realm card fill |
| `--color-card-border` | `rgba(129,140,248,.15)` | `rgba(120,95,60,.18)` | Hairlines, card borders |

RGB triplets for `rgba()`: `--color-accent-rgb`, `--color-ember-rgb`,
`--color-gold-rgb`.

### Gradients & shadows

- `--gradient-accent` — indigo, for primary buttons/fills.
- `--gradient-map-line` — `transparent → ember → gold → transparent`. The
  cartographer "route" motif; used in dividers, eyebrows, rails.
- `--shadow-card`, `--shadow-glow` — elevation + glow.

### Color usage law

- **Ember is the protagonist accent.** Indigo (`--color-accent`) is the
  "system/UI" accent (links, focus, primary CTA). Use ember for *story* accents
  (chapter eyebrows, italic taglines, waypoints, hovers, route lines).
- Warm (ember/gold) + cool (indigo) must stay balanced — warm leads, indigo
  supports. Never introduce a third hue family without adding a token.

---

## 2. Typography

Three families, loaded in `index.css`, mapped in Tailwind `fontFamily`:

| Family | Tailwind | Role |
|---|---|---|
| **Cormorant Garamond** (serif) | `font-chronicle` | Hero/section display titles, italic story accents, project names, pull-quotes. The literary voice. |
| **Plus Jakarta Sans** | `font-display` | Small UI headers, labels, buttons. |
| **Inter** | default `font-sans` | Body, paragraphs, meta. |
| mono (system) | `font-mono` | Chapter numbers, kbd, coordinates, technical tags. |

**Scale (use `clamp()` for fluidity):**

- Hero name: `clamp(56px,12vw,150px)`, `font-chronicle`, `leading-[0.86]`.
- Section title (`ChapterHeading`): `clamp(40px,7vw,76px)`, `font-chronicle`.
- Subsection: `text-[26px–30px] font-chronicle`.
- Body: `15–17px`, `leading-[27–30px]`, `font-sans`.
- Eyebrow/label: `12px`, `tracking-[0.3em]`, `uppercase`, `font-display`.
- Micro / numbers: `10–11px`, `font-mono`.

**Rules:** big titles are always `font-chronicle`. Italic Cormorant = the
"narration" voice (taglines, quotes), always in `--color-ember`. Body stays
Inter for legibility. Never set display type in Inter.

---

## 3. Layout & spacing

- Content width: `max-w-7xl mx-auto`. Side padding: `px-6 sm:px-12` (or
  `sm:px-16` for text-dense sections).
- Section rhythm: vertical padding `py-24 sm:py-32`; full-bleed cinematic
  sections use `h-screen`/`min-h-screen`. Use `SectionWrapper` for standard
  padded sections.
- Radius: cards `rounded-2xl` (20px) / `rounded-3xl`; pills `rounded-full`.
- Breakpoints (Tailwind + custom `xs:450px`): design & test at **360, 768,
  1280, 1920**.

---

## 4. Motion language

The site is *directed*. Motion is intentional, weighty, never decorative jitter.

### Engines (when to use which)

- **GSAP + ScrollTrigger** → anything tied to scroll position: pinning, scrub,
  parallax-out, horizontal sections, draw-on lines. Setup inside
  `gsap.context(scopeRef)` + `ctx.revert()` cleanup.
- **Framer Motion** → discrete UI: enter/exit (`AnimatePresence`), hover/tap,
  spring toggles, layout. Use `whileInView` for simple one-shot reveals.
- **Lenis** → global smooth scroll (already wired). Use `scrollToSection(id)` /
  `scrollToTop()` from `src/lib/smoothScroll.js` for programmatic scrolls.
- **rAF + DOM** → ultra-hot per-frame visuals with no React state (cursor,
  hero mouse-parallax). Always cancel on cleanup.

### Tuning constants (keep consistent)

- Easings: GSAP enters `power3.out`; scrub `ease:'none'`; nav/reveal cubic
  `(0.22, 1, 0.36, 1)`; springs (Framer) `stiffness 300–600 / damping 18–30`.
- Durations: micro-interaction `0.2–0.3s`; element enter `0.6–0.9s`; hero/intro
  layered `~1.6s`; stagger `0.06–0.12s`.
- Parallax travel is **clamped & eased** (lerp factor `0.05–0.18`) so it never
  feels twitchy or reveals layer edges.

### Principles

1. **Reveal on arrival, settle, rest.** No infinitely-looping distractions near
   text. Ambient loops (fog, embers, orbit ring) are subtle and far from copy.
2. **One hero motion per section** — a single memorable mechanic (pin-scrub,
   orbit, plate-reveal), not five competing ones.
3. **Reduced-motion** → replace scrubbed/parallax motion with a static or simple
   fade. **Touch / coarse pointer** → disable mouse-parallax & custom cursor.
4. Animate **`transform` + `opacity` only**. No animating layout/box props.

---

## 5. CSS utility classes (in `index.css`)

Reuse these; add to this list when you create a new shared visual.

| Class | Purpose |
|---|---|
| `.font-chronicle` | Cormorant serif |
| `.ember-text-gradient` / `.accent-text-gradient` | Gradient text fills |
| `.chapter-eyebrow` | Uppercase ember eyebrow with leading route-tick |
| `.map-line` | Ember→gold "route" rule (dividers/underlines) |
| `.ink-stroke` | Subtle hairline divider |
| `.wax-seal`, `.wax-seal--featured`, `.wax-seal--nda` | Seal-style badges |
| `.realm-card` | Standard glass card w/ ember hover (cards everywhere) |
| `.cinematic-vignette` | Edge/seam mask + bottom fade for full-bleed art |
| `.cursor-dot/.cursor-ring/.cursor-backlight` | Custom cursor parts |
| `.btn-primary` | Indigo gradient primary button |
| `.status-dot` | Pulsing "available" dot |
| `.glass-card`, `.link-hover` | Glass surface, underline-on-hover |

Keyframes available: `scrollcue`, `herofog`, `aurora`, `sunrise`, `float`,
`pulse-glow`, `status-pulse`.

---

## 6. Iconography

- **lucide-react** only (e.g. `Compass`, `Menu`, `X`, `ArrowUpRight`, `MapPin`).
  Sized `14–22px`, colored via `style={{ color: 'var(--color-ember)' }}` or
  `currentColor`. **No emoji in production UI.**
- Tech logos (React, Next, …) live in `src/assets/tech/` — use for the Arsenal.

---

## 7. Component inventory

### Keep / canonical (`src/components/ui/` unless noted)
`ChapterHeading` · `MapDivider` · `Cursor` · `DayNightToggle` ·
`CommandPalette` (→ to be reskinned into Map overlay) · `ErrorBoundary` ·
`ScrollReveal` · `Magnet` (`components/`) · `SectionWrapper` (`hoc/`).

### Use sparingly (react-bits; only if they elevate a moment)
`SplitText`, `BlurText`, `TiltedCard`, `SpotlightCard`. Prefer GSAP/Framer +
our utilities for consistency. `GlitchText`, `FuzzyText` — avoid (off-theme).

### Deprecated — do not use, remove when touched
`ThemeToggle.jsx` (→ `DayNightToggle`) · `CustomCursor.jsx` (→ `Cursor`) ·
`components/canvas/*` + Three deps (being deleted) · `hooks/useParallax.js`
(Framer parallax — prefer GSAP) · `Feedbacks.jsx` (unused) ·
`Loader.jsx` (Three loader, unused after canvas removal).

---

## 8. Accessibility checklist (every section)

- Semantic `button`/`a`; `aria-label` on icon-only controls; visible focus.
- AA contrast on all headings in **both** themes (light parchment is the risk —
  verify ember/muted on cream).
- `prefers-reduced-motion`: static fallback path exists and is tested.
- Keyboard: nav, map overlay, and forms fully operable; `Esc` closes overlays.
- Respect `(hover:none)`: no custom cursor, no hover-only content.
