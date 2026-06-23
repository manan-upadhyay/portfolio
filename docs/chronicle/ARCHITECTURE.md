# Architecture — The Chronicle

How the app is wired, the canonical patterns to copy, and how to verify work.

---

## 1. Folder map

```
src/
  App.jsx                 # Shell: theme bg + aurora, Cursor, SideRail, DayNightToggle,
                          #   MapOverlay, sections, footer, Vercel <Analytics/>
  main.jsx                # Entry
  index.css               # Theme tokens + global utilities + keyframes (SOURCE OF TRUTH for style)
  constants/index.js      # ALL content: personalInfo, summon, chapters, services,
                          #   skillCategories, experiences, projects, stats, education
  store/useThemeStore.ts  # Zustand theme (light|dark|system) → toggles <html> class
  lib/
    smoothScroll.js       # Lenis + GSAP ticker; scrollToSection/scrollToTop
    motion.js             # Framer Motion variants (staggerContainer, fadeIn, …)
  hooks/
    useActiveSection.js   # Scroll-spy → active chapter id (drives SideRail/MapOverlay)
  hoc/SectionWrapper.jsx  # Standard padded <section> + stagger container
  sections/               # Page chapters (00–05) + index.js barrel
    Hero.jsx About.jsx Experience.jsx Tech.jsx Works.jsx Contact.jsx
  components/             # Reusable widgets (flat) + index.js barrel:
                          #   SideRail, MapOverlay, Cursor, DayNightToggle, CompassRose,
                          #   ChapterHeading, MapDivider, CountUp, ScrollReveal,
                          #   ErrorBoundary, MusicPlayer (disabled), Magnet
  assets/                 # backend/creator/mobile/web pngs + tech/*.svg (import via assets/index.js)
public/                   # PRODUCTION ASSETS ONLY (everything here ships):
  favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png
  android-chrome-192x192.png android-chrome-512x512.png
  og-image.png logo-light.png logo-dark.png
  site.webmanifest robots.txt sitemap.xml resume.pdf
  realms/<slug>/…         # project gallery screenshots (per-theme subfolders when themed)
branding/                 # Brand SOURCE/ARCHIVE — NOT deployed (out of public/)
  source/  archive/v1/  hero-sky/   # master art, old icon sets, retired hero skies
tools/og-image/           # og-image template + regeneration steps (headless Chrome)
docs/chronicle/           # THIS documentation set (source of truth)
```

> No `src/utils/`, `styles.js`, `lib/utils.ts`, `components/canvas/`, `Navbar`,
> or `CommandPalette` — all removed. The `@`-path aliases in
> `vite.config.js`/`tsconfig.json` mirror this tree but code uses relative imports.

---

## 2. App composition (the shell)

`App.jsx` order matters (z-stacking + mount):

```jsx
useSmoothScroll();                       // Lenis + GSAP ticker (once)
const activeId = useActiveSection();     // scroll-spy → active chapter id
<div bg=theme>
  <div aurora-bg / sunrise-bg />         // ambient background
  <Cursor />                             // custom cursor (fixed, top z)
  <SideRail activeId visible={activeId!=='origin'} onOpenMap />  // collapsible chapter nav
  <DayNightToggle />                     // fixed top-right
  <MapOverlay open activeId />           // ⌘K interactive map
  <Hero />                               // chapter 00 (eager)
  {lazy sections each wrapped in <ErrorBoundary><Suspense>…}
  <footer/> <Analytics/>
</div>
```

- **Sections are `lazy()` + `Suspense` + `ErrorBoundary`.** An `ErrorBoundary`
  around each guarantees one section failing never white-screens the site. `Hero`
  is eager (above the fold); the rest are lazy via `import('./sections/…')`.
- `MusicPlayer` (bottom-right ambient audio) is currently **commented out** in
  `App.jsx` — re-enable the import + mount to restore it.

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
| `SideRail({ activeId, onOpenMap, visible })` | Desktop-only collapsible glass rail (left, vertically centered); hidden on the hero (`visible={activeId!=='origin'}`); springs open on hover. Sigil = themed brand crest (`/logo-{light,dark}.png`); chapter rows → `scrollToSection`; Map row uses `CompassRose`. Chapters list = `CHAPTERS` const in `SideRail.jsx` (keep matching canon). |
| `MapOverlay({ open, onClose, activeId })` | ⌘K interactive map overlay (the realized "Command Palette"). Probes `/chronicle/map/realm-map.webp`, degrades gracefully; commands map to `scrollToSection` + external links. |
| `Cursor` | Dot + trailing ring (+grows over `a,button,[data-cursor=hover]`) + backlight. Auto-off on touch/reduced-motion. Add `data-cursor="hover"` to custom interactive targets. |
| `DayNightToggle({ compact? })` | The only theme toggle (fixed top-right). Sun↔moon morph, orbit ring, spring press, radial View-Transition theme ripple. |
| `CompassRose({ className })` | Shared ember/gold compass-star SVG. Used at the astrolabe hub, the SideRail map row, and the map overlay. |
| `MusicPlayer` | Bottom-right ambient-audio toggle. **Currently disabled** (commented out in `App.jsx`). |
| `ErrorBoundary({ fallback? })` | Class boundary; wrap any risky subtree. |
| `SectionWrapper(Component, id)` | HOC (`hoc/`): padded `max-w-7xl` section, `<span id>` anchor, Framer stagger container (`lib/motion`). Use for standard sections. |
| `ChapterHeading({ no, eyebrow, title, align })` | The one section header. Use everywhere; never hand-roll headers. |
| `MapDivider` | Route-line divider between chapters (optional). |

---

## 6. Asset pipeline

- Runtime art is referenced by absolute path from `public/` (e.g.
  `/realms/<slug>/…`, `/logo-dark.png`) and is **not** imported through the
  bundler. Small bundled images/icons live in `src/assets/` (imported, hashed).
- **Probe-and-degrade pattern** for *optional* art (realm covers, map): attempt
  to load each asset; render it only if it loads, else a procedural/typographic
  fallback. Keeps the site shippable before art exists and resilient on 404.
  (The hero needs no probe — it's a fully procedural CSS starfield + Canvas2D.)
- Prefer **WebP** (q≈80); keep images lean and lazy below the fold. **`public/`
  ships as-is** — keep it to production assets only; brand source/archive go in
  `/branding/`.
- Brand/icon assets: the favicon family + `og-image.png` are generated from the
  brand crest via [`/tools/og-image/`](../../tools/og-image/). Full spec +
  filenames + prompts: [ASSETS.md](ASSETS.md).

---

## 7. Performance budget

- Initial JS < ~200KB gz (Three.js is gone — keep WebGL out). Vendor split:
  `react-vendor` + `animation-vendor` (framer/gsap/lenis) via `manualChunks`.
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

> To verify scroll-dependent chrome (the `SideRail`, which is hidden on the hero)
> you need a scrolled state — drive scroll via CDP or check the rendered DOM.
> The `ErrorBoundary` keeps the page rendering if any subtree throws.

---

## 9. Coding conventions recap

- Function components + hooks; `ErrorBoundary` is the only class.
- Default-export one component per file; colocate small sub-components, promote
  shared ones to `src/components/`. Sections live in `src/sections/`.
- Content from `constants/`; color from CSS vars; icons from lucide / `CompassRose`.
- Clean up every effect (listeners, rAF, ScrollTrigger, Lenis).
- Keep `chapters` (constants), `CHAPTERS` (`SideRail.jsx`), and `MapOverlay`
  entries in sync.
