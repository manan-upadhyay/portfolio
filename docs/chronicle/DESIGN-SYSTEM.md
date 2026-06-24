# Design System — The Chronicle

The visual & motion language. **Every component must consume these tokens**, not
raw values. Tokens are defined in [`src/index.css`](../../src/index.css) and
[`tailwind.config.js`](../../tailwind.config.js).

---

## 1. Color tokens

All color is a CSS variable, re-mapped per theme by the `.dark` / `.light` class
on `<html>` (managed by `useThemeStore`). **Never hardcode hex in a component**
(only allowed inside a generated-art procedural fallback).

### Sky modes (Phase 3 — time-aware) — 5 modes over 4 palettes

The theme is a **5-mode "sky"** (`useThemeStore.mode`): `auto` (default,
time-driven) plus four manual palettes — **`dawn` · `day` · `dusk` · `night`**.
Each palette sits on a **light or dark base** (`dawn`/`day` → light, `dusk`/`night`
→ dark); `<html>` carries both the base class (`light`/`dark`) **and**
`data-sky="<mode>"`. The base class still drives every existing `.light`/`.dark`
selector; `data-sky` only layers a warm time-of-day **tint** on top.

- **Day** = the bare `:root` (full warm parchment). **Night** = the bare `.dark`
  (deep ink + starfield). These are the two original themes, unchanged.
- **Dawn** (`.light[data-sky='dawn']`) = a rosy-peach tint of the light base.
  **Dusk** (`.dark[data-sky='dusk']`) = an embered-violet tint of the dark base.
  Each overrides only ground/glow tokens (`--color-primary`, `--color-tertiary`,
  `--color-ember`, gradients, hero backdrop) — **text tokens stay inherited from
  the base so AA contrast is preserved**.
- `auto` resolves to one of the four from the visitor's **real local sky** via
  `src/lib/sky.js` (SunCalc + timezone→coords; no geolocation prompt). The
  sun/moon toggle (`DayNightToggle`) flips the base while preserving the warmth
  tier (dawn↔dusk, day↔night) and commits to a manual mode. `resolvedTheme`
  (`light`/`dark`) remains a derived alias so every `isDark` consumer is unchanged.
- **Hero backdrop tokens:** `--hero-backdrop` (radial gradient) + `--hero-scrim-rgb`
  are defined per sky so the hero's procedural backdrop/scrim shift with the
  palette without any per-mode branching in the component.

The control is **`SkyControl`** (top-right): the existing sun/moon button + a
5-row mode menu (Auto/Dawn/Day/Dusk/Night) whose trigger pill doubles as a live
sky status chip. Copy lives under the i18n `sky.*` keys (mode names).

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
   text. Ambient loops (hero starfield twinkle, aurora drift, orbit ring) are
   subtle, slow, and far from copy.
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
| `.marginalia`, `.marginalia__rune`, `.marginalia__note` | Footnote trigger (dotted underline + `†` rune) and its unfolding margin note |

Keyframes available: `scrollcue`, `herofog`, `aurora`, `sunrise`, `float`,
`pulse-glow`, `status-pulse`, `star-twinkle` (hero starfield), `orbit-cw` /
`orbit-ccw`, `spin-slow`, `skill-fill`. All looping keyframes are gated by
`prefers-reduced-motion`.

---

## 6. Iconography

- **lucide-react** for UI glyphs (e.g. `X`, `ArrowUpRight`, `MapPin`,
  `FileText`). Sized `14–22px`, colored via `style={{ color: 'var(--color-ember)' }}`
  or `currentColor`. **No emoji in production UI.**
- **`CompassRose`** is the custom brand SVG (compass-star) — use it for the
  cartographer/navigation motif (astrolabe hub, SideRail map row, map overlay)
  instead of a generic compass glyph.
- Tech logos (React, Next, …) live in `src/assets/tech/` — use for the Arsenal.

---

## 7. Component inventory

### Canonical reusable widgets (`src/components/`, flat, barrel-exported)
`SideRail` (chapter nav) · `MapOverlay` (⌘K map) · `Cursor` ·
`SkyControl` (top-right 5-mode sky menu) wrapping `DayNightToggle` (the sun/moon
base toggle) · `CompassRose` (brand SVG) · `ChapterHeading` (the one section header) ·
`MapDivider` · `CountUp` · `ScrollReveal` · `ErrorBoundary` · `Magnet` ·
`Marginalia` + `Annotated` (flavor→substance footnotes; wrap copy with the
`[[id|phrase]]` marker, render via `<Annotated text={t('…')} />`, facts under
`marginalia.<id>` in `chronicle`) · `VoiceSwitcher` / `ControlCluster` /
`EasterEggListener` (the Voice system) · `MusicPlayer` *(mounted but disabled)*.
Plus `SectionWrapper` (`src/hoc/`). Page chapters live in `src/sections/`.

### Removed (do not reintroduce)
The react-bits experiments (`SplitText`, `BlurText`, `TiltedCard`,
`SpotlightCard`, `GlitchText`, `FuzzyText`), `Feedbacks.jsx`, the Three.js
`components/canvas/*` + `Loader.jsx`, `Navbar`/`CommandPalette` (→ `SideRail` +
`MapOverlay`), `ThemeToggle`/`CustomCursor` (→ `DayNightToggle`/`Cursor`),
`hooks/useParallax.js`, `styles.js`, and `lib/utils.ts` — all deleted. Prefer
GSAP/Framer + our CSS utilities for any new motion.

---

## 8. Accessibility checklist (every section)

- Semantic `button`/`a`; `aria-label` on icon-only controls; visible focus.
- AA contrast on all headings in **both** themes (light parchment is the risk —
  verify ember/muted on cream).
- `prefers-reduced-motion`: static fallback path exists and is tested.
- Keyboard: nav, map overlay, and forms fully operable; `Esc` closes overlays.
- Respect `(hover:none)`: no custom cursor, no hover-only content.
