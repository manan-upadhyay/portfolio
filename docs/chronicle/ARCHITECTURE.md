# Architecture — The Chronicle

How the app is wired, the canonical patterns to copy, and how to verify work.

---

## 1. Folder map

```
src/
  App.jsx                 # Shell: theme bg, Cursor, CommandPalette, Navbar, sections, footer
  main.jsx                # Entry
  index.css               # Theme tokens + global utilities + keyframes (SOURCE OF TRUTH for style)
  styles.js               # A few shared className strings (legacy; prefer utilities)
  constants/index.js      # ALL content: personalInfo, chapters, services, skillCategories,
                          #   technologies, experiences, projects, stats, education
  store/useThemeStore.ts  # Zustand theme (light|dark|system) → toggles <html> class
  lib/
    smoothScroll.js       # Lenis + GSAP ticker integration; scrollToSection/scrollToTop
    utils.ts              # cn() etc.
  hooks/                  # Custom hooks (add useGsap helpers here)
  hoc/SectionWrapper.jsx  # Standard padded <section> + stagger container
  components/
    Hero.jsx About.jsx Experience.jsx Tech.jsx Works.jsx Contact.jsx
    Navbar.jsx
    ui/                   # Reusable: ChapterHeading, MapDivider, Cursor, DayNightToggle,
                          #   CommandPalette, ErrorBoundary, ScrollReveal
    canvas/               # ⚠️ Three.js — DELETE during Contact rebuild
  assets/                 # tech/ company/ images (import via assets/index.js)
public/
  chronicle/              # Cinematic art (hero layers, portrait, project covers, map). See ASSETS.md
  resume.pdf
docs/chronicle/           # THIS documentation set (source of truth)
```

---

## 2. App composition (the shell)

`App.jsx` order matters (z-stacking + mount):

```jsx
useSmoothScroll();                       // Lenis + GSAP ticker (once)
<div bg=theme>
  <div aurora-bg / sunrise-bg />         // ambient background
  <Cursor />                             // custom cursor (fixed, top z)
  <CommandPalette />                     // ⌘K → becomes Map overlay
  <Navbar onOpenMap={…} />               // fixed, hides on scroll-down
  <Hero />                               // chapter 00 (eager)
  {lazy sections each wrapped in <ErrorBoundary><Suspense>…}
  <footer/>
</div>
```

- **Sections are `lazy()` + `Suspense` + `ErrorBoundary`.** An `ErrorBoundary`
  around each guarantees one section failing (e.g. WebGL) never white-screens
  the site.
- Import `Navbar`/`Hero` **directly** (not via the `components/index.js` barrel)
  so the Three-heavy barrel isn't pulled into the initial chunk.

---

## 3. Smooth scroll + GSAP (canonical pattern)

`src/lib/smoothScroll.js` already sets up Lenis and drives it from GSAP's ticker
(so ScrollTrigger and Lenis are frame-synced). **Do not create a second Lenis or
a parallel rAF scroll loop.**

- Programmatic scroll: `scrollToSection('about')`, `scrollToTop()`.
- Reduced motion: smoothing auto-disables.

**Every scroll-driven component uses this shape:**

```jsx
const rootRef = useRef(null);
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.thing', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    // pin example:
    // ScrollTrigger.create({ trigger, start:'top top', end:'+=2000', pin:true, scrub:1 })
  }, rootRef);
  return () => ctx.revert();   // ⟵ MANDATORY cleanup (kills triggers + tweens)
}, []);
```

Guard expensive motion:

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(hover: none)').matches;
if (reduce || coarse) { /* static fallback */ return; }
```

> **Pin + Lenis note:** when pinning horizontal sections, use
> `scrollTrigger.scrub` (number for smoothing) and `invalidateOnRefresh:true`;
> recalc on resize via `ScrollTrigger.refresh()`. Test that Lenis doesn't fight
> the pin (it won't, since both run off the same ticker).

---

## 4. Theming

- `useThemeStore` (`light|dark|system`) writes `.dark`/`.light` on `<html>` and
  persists to localStorage. `resolvedTheme` is `'dark'|'light'`.
- Components read `resolvedTheme` only when they need JS branching (rare —
  prefer CSS vars that already flip). Most components need **no** theme JS.
- `DayNightToggle` is the only toggle UI (carries `data-theme-toggle` so the
  command palette can trigger it). It performs a radial reveal ripple on switch.

---

## 5. Global shell components

| Component | Contract |
|---|---|
| `Navbar({ onOpenMap })` | Fixed; hides on scroll-down (Framer `useScroll`); serif wordmark; numbered chapter links → `scrollToSection`; Map button; `DayNightToggle`; mobile sheet. Links list lives in `Navbar.jsx` `LINKS` and must match canon. |
| `Cursor` | Dot + trailing ring (+grows over `a,button,[data-cursor=hover]`) + backlight. Adds `has-custom-cursor` to `<html>`. Auto-off on touch/reduced-motion. Add `data-cursor="hover"` to custom interactive targets. |
| `DayNightToggle({ compact? })` | Sun↔moon morph, orbit ring, spring press, radial theme ripple. |
| `CommandPalette` | ⌘K palette → **being upgraded to the Map overlay** (see section 06). Commands map to `scrollToSection`. |
| `ErrorBoundary({ fallback? })` | Class boundary; wrap any risky subtree. |
| `SectionWrapper(Component, id)` | HOC: padded `max-w-7xl` section, `<span id>` anchor, Framer stagger container. Use for standard sections. |
| `ChapterHeading({ no, eyebrow, title, align })` | The one section header. Use everywhere; never hand-roll headers. |
| `MapDivider` | Route-line divider between chapters (optional). |

---

## 6. Asset pipeline

- Cinematic art lives in `public/chronicle/` and is referenced by absolute path
  (`/chronicle/x.webp`). It is **not** imported through the bundler.
- **Probe-and-degrade pattern** (Hero is the reference impl): attempt to load
  each optional asset; render it only if it loads, else a procedural/typographic
  fallback. This keeps the site shippable before art exists and resilient if a
  file 404s.
- Prefer **WebP** (q≈80), keep each layer < ~600KB. Lazy-load below-the-fold
  art. **Delete unused originals from `public/`** — everything there ships.
- Full spec + filenames + prompts: [ASSETS.md](ASSETS.md).

---

## 7. Performance budget

- Initial JS < ~200KB gz (Three removal is the big win — keep it out).
- Lighthouse perf ≥ 90; 60fps scroll.
- `transform`/`opacity` only; `will-change` on animated layers; `content-visibility`/lazy for heavy sections.
- One `IntersectionObserver`/ScrollTrigger per concern; clean them up.
- Audit `dist/` after build; no asset > 1MB ships unless deliberate.

---

## 8. Verification (do this for every section)

```bash
npm run dev    # serves on 5173+ (note the printed port)
npm run build  # MUST stay clean (no new errors)
```

Drive headless Chrome for screenshots (no Playwright needed):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 --virtual-time-budget=9000 \
  --screenshot=/tmp/shot.png "http://localhost:<port>/"
```

- Check **dark + light**, and **360 / 768 / 1280 / 1920** widths.
- Confirm no console errors: add `--enable-logging=stderr --v=0 --dump-dom`.
- Verify reduced-motion (emulate) and that scroll never locks.

> Headless Chrome has no GPU; any remaining WebGL will throw — another reason
> Three is being removed. The `ErrorBoundary` keeps the page rendering meanwhile.

---

## 9. Coding conventions recap

- Function components + hooks; `ErrorBoundary` is the only class.
- Default-export one component per file; colocate small sub-components, promote
  shared ones to `ui/`.
- Content from `constants/`; color from CSS vars; icons from lucide.
- Clean up every effect (listeners, rAF, ScrollTrigger, Lenis).
- Keep `chapters` (constants), `LINKS` (Navbar), palette commands in sync.
