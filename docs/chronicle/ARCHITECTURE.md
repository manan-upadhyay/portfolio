# Architecture — The Chronicle

How the app is wired, the canonical patterns to copy, and how to verify work.

---

## 1. Folder map

```
src/
  App.jsx                 # Router: BrowserRouter → Layout wrapping the two routes
                          #   (/ = Chronicle, /making-of = the Atelier)
  main.jsx                # Entry
  index.css               # Theme tokens + global utilities + keyframes (SOURCE OF TRUTH for style)
  constants/index.js      # ALL content: personalInfo, summon, chapters, services,
                          #   skillCategories, experiences, projects, stats, education
  store/useThemeStore.ts  # Zustand "sky" theme (auto+dawn/day/dusk/night) → <html> class + data-sky
  store/useVoiceStore.ts  # Zustand voice (i18next language) + unlocked sealed voices
  store/useSoundStore.ts  # Zustand sound prefs (enabled/volume/engaged) → drives lib/sound.js
  lib/
    smoothScroll.js       # Lenis + GSAP ticker; scrollToSection/scrollToTop
    motion.js             # Framer Motion variants (staggerContainer, fadeIn, …)
    sky.js                # SunCalc time→sky resolver + timezone→coords (theme auto mode)
    sound.js              # Web-Audio engine: CONFIG, cues, hum/watch beds (mp3 loop or synth), samples
    voiceChange.js        # tiny emitter: voice store → VoiceTransition
    voiceScramble.js      # per-text "decode" scramble on voice change (DOM TreeWalker)
  hooks/
    useActiveSection.js   # Scroll-spy → active chapter id (drives SideRail/MapOverlay)
  hoc/SectionWrapper.jsx  # Standard padded <section> + stagger container
  pages/                  # Route-level views (rendered through Layout's <Outlet/>)
    Chronicle.jsx         #   / — the scroll spine (Hero + chapters 00–05) + its chrome
    MakingOf.jsx          #   /making-of — return doorway + the lazy Atelier
  sections/               # Page chapters (00–05) + the Atelier coda + index.js barrel
    Hero.jsx About.jsx Experience.jsx Tech.jsx Works.jsx Contact.jsx Atelier.jsx
  components/             # Reusable widgets (flat) + index.js barrel:
                          #   Layout (shared shell), SideRail, MapOverlay, Cursor,
                          #   SkyControl(+DayNightToggle), CompassRose, ChapterHeading,
                          #   MapDivider, CountUp, ScrollReveal, ErrorBoundary,
                          #   ControlCluster(=VoiceSwitcher + SoundControl), Magnet
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

## 2. App composition (router + shell)

`App.jsx` is just the router; the persistent shell is `components/Layout.jsx`,
shared by both routes (z-stacking + mount order matters):

```jsx
// App.jsx
<BrowserRouter><Routes>
  <Route element={<Layout/>}>
    <Route index element={<Chronicle/>} />          // /
    <Route path="making-of" element={<MakingOf/>} />// /making-of
  </Route>
</Routes></BrowserRouter>

// components/Layout.jsx — present on EVERY route
useSmoothScroll();                       // Lenis + GSAP ticker (once, persists across routes)
const activeId = useActiveSection();     // scroll-spy → active chapter id (→ Outlet context)
<div bg=theme>
  <div aurora-bg / sunrise-bg />         // ambient background
  <Cursor />                             // custom cursor (fixed, top z)
  <SkyControl />                         // fixed top-right (sky menu)
  <ControlCluster activeId />            // fixed bottom-right (voice + sound)
  <EasterEggListener/> <VoiceTransition/> <VoiceHall/>  // global ⇧⌘V + decode FX
  <ScrollManager/>                       // resets scroll on entering /making-of
  <Outlet context={{ activeId }} />      // ← the active route renders here
  <footer/* + the quiet /making-of link */> <Analytics/> <SpeedInsights/>
</div>

// pages/Chronicle.jsx — / only
const { activeId } = useOutletContext();
useEffect(() => restoreScroll(), []);    // land back at the doorway on return from the Atelier
<SideRail activeId visible={activeId!=='origin'} onOpenMap />  // collapsible chapter nav
<button mobile-map/> <MapOverlay open activeId />             // ⌘K interactive map (Chronicle-only)
<Hero /> {lazy sections each <ErrorBoundary><Suspense>…}      // chapters 00–05 (no Atelier)

// pages/MakingOf.jsx — /making-of only
<Link to="/" className="atelier-return">{t('makingOf.back')}</Link>  // the return doorway
<ErrorBoundary><Suspense><Atelier/></Suspense></ErrorBoundary>       // lazy Atelier
```

- **Sections are `lazy()` + `Suspense` + `ErrorBoundary`.** An `ErrorBoundary`
  around each guarantees one section failing never white-screens the site. `Hero`
  is eager (above the fold); the rest (incl. the Atelier) are lazy.
- **One Lenis, across routes.** `useSmoothScroll` lives in `Layout`, so the smooth
  scroll persists through navigation (no re-init jank). The Chronicle unmounts
  when you visit `/making-of`; on return it restores the remembered scroll
  position (`rememberScroll`/`restoreScroll` in `smoothScroll.js`) once the pinned
  Experience has grown the page height. `ScrollManager` sends any other
  destination to the top.
- **Sound boot (Phase 4):** `Layout` calls `sound.arm()` (one-time gesture →
  unlock the AudioContext) + `sound.loadRaven()`/`loadBeds()` on mount; the
  Chronicle fires the map open/close whoosh from its `mapOpen` state. The old
  `MusicPlayer` (ambient track) is **removed** — superseded by the cue system.

---

## 3. Smooth scroll + GSAP (canonical pattern)

`src/lib/smoothScroll.js` already sets up Lenis and drives it from GSAP's ticker
(so ScrollTrigger and Lenis are frame-synced). **Do not create a second Lenis or
a parallel rAF scroll loop.**

- Programmatic scroll: `scrollToSection('about')`, `scrollToTop()`.
- Cross-route memory: `rememberScroll()` (called by the Realms doorway before it
  navigates to `/making-of`) + `restoreScroll()` (called on the Chronicle's mount)
  return the visitor to the exact spot they left.
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

- `useThemeStore` is a **5-mode "sky"** (`auto` default + `dawn`/`day`/`dusk`/
  `night`); it writes the base `.dark`/`.light` class **and** `data-sky="<mode>"`
  on `<html>` and persists the chosen mode. `auto` resolves from the visitor's
  real local time (`lib/sky.js`, SunCalc + timezone). `resolvedTheme`
  (`'dark'|'light'`) is kept as a derived alias so existing `isDark` branches work.
- `dawn`/`dusk` are warm token tints layered on the base via `[data-sky]` (text
  tokens inherited → AA preserved). Components read `resolvedTheme` only when they
  need JS branching (rare — prefer CSS vars). See DESIGN-SYSTEM §1.
- `SkyControl` (top-right) is the theme UI; the inner `DayNightToggle` carries
  `data-theme-toggle` (so the map command can flip it) and does the radial ripple.

## 4b. Sound (Phase 4)

A small Web-Audio "sound design system": sparse cues that reward *intent*, never
accompany motion. Three layers:

- **Engine** (`lib/sound.js`) — pure audio, no React. ONE shared `AudioContext`,
  unlocked on the first gesture (`sound.arm()`), feeding a master `gain → compressor
  → destination` bus. All **tunables live in the `CONFIG` block** at the top (cue
  loudness/length, bed loudness, sample paths). Abstract cues are synthesized (osc
  + ADSR + biquad + noise → 0 bytes); the **raven** is an optional one-shot mp3.
  Two continuous *beds* (Arsenal **hum**, Hero **watch**) each play an **optional
  looping mp3** (`CONFIG.beds.*.sample`) or a synth fallback, built lazily and torn
  down at zero. **Page-visibility gated:** the context suspends on tab/window switch
  and resumes on return. Everything no-ops until unlocked + enabled + in view.
- **Store** (`useSoundStore`) — persisted prefs (`enabled`/`volume`/`engaged`);
  **default-on but auto-muted under `prefers-reduced-motion`**; pushes changes
  into the engine.
- **Cues** — fired with `playCue(name)`: `theme` (DayNightToggle, swoosh synced to
  the wipe), `glitch` (voice change), `error` (Contact validation), `mapOpen`/
  `mapClose` (App), `raven` (Contact send), `blip` (Tech hover), `confirm` (sound
  on). Beds: `sound.hum` (Arsenal, proximity-faded via a Tech ScrollTrigger),
  `sound.watch` (Hero, scroll-faded). `sound.loadRaven()` + `sound.loadBeds()`
  preload the optional samples at boot.
- **Voice transition** — `lib/voiceChange.js` is a tiny emitter; the voice store
  calls `fireVoiceChange()` after a switch, and `VoiceTransition` (App) plays the
  `glitch` cue + runs `lib/voiceScramble.js`, which walks visible text nodes and
  **decodes the new copy in** (per-text scramble; restores exact targets so React
  stays consistent). No overlay. Skipped under reduced-motion.

---

## 5. Global shell components

| Component | Contract |
|---|---|
| `Layout` | The shell shared by both routes: mounts smooth scroll + the boot side-effects, the always-present controls (`SkyControl`, `ControlCluster`, `VoiceHall`, ⇧⌘V), the footer (with the quiet `/making-of` link), analytics, and a `ScrollManager`. Renders the active route through `<Outlet context={{ activeId }} />`. Imported directly by `App.jsx` (not barrel-exported). |
| `SideRail({ activeId, onOpenMap, visible })` | **Chronicle-only** (rendered by `pages/Chronicle.jsx`). Desktop-only collapsible glass rail (left, vertically centered); hidden on the hero (`visible={activeId!=='origin'}`); springs open on hover. Sigil = themed brand crest (`/logo-{light,dark}.png`); chapter rows → `scrollToSection`; Map row uses `CompassRose`. Chapters come from `constants.chapterList` (single source). |
| `MapOverlay({ open, onClose, activeId })` | **Chronicle-only** ⌘K interactive map overlay (the realized "Command Palette"). Pins are `constants.chapterList` (each chapter's `x`/`y`/`kw`); probes `/chronicle/map/realm-map.webp`, degrades gracefully; commands map to `scrollToSection` + external links. |
| `Cursor` | Dot + trailing ring (+grows over `a,button,[data-cursor=hover]`) + backlight. Auto-off on touch/reduced-motion. Add `data-cursor="hover"` to custom interactive targets. |
| `SkyControl` | Top-right theme control: the 5-mode sky menu (Auto/Dawn/Day/Dusk/Night) wrapping `DayNightToggle`. The trigger pill is a live sky status chip. |
| `DayNightToggle({ compact? })` | The base light↔dark toggle (inside `SkyControl`). Sun↔moon morph, orbit ring, spring press, radial View-Transition ripple; fires the `theme` sound cue. |
| `CompassRose({ className })` | Shared ember/gold compass-star SVG. Used at the astrolabe hub, the SideRail map row, and the map overlay. |
| `ControlCluster` | Bottom-right fixed flex row: `[VoiceSwitcher] · [SoundControl]`. Sound expands on hover and pushes voice left. |
| `SoundControl` | Audio half of the cluster: master mute/volume + the one-time "turn on sound" onboarding note. Drives `useSoundStore` → `lib/sound.js`. |
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
- **Sound (Phase 4):** optional mp3s in `public/sounds/` — `raven.mp3` (one-shot),
  `astrolabe.mp3` (Hero bed loop), `arsenal.mp3` (Arsenal bed loop). Each degrades
  to a synthesized fallback if absent — never block on them. Paths are configurable
  in `lib/sound.js` → `CONFIG`. All other cues are synthesized (0 bytes).

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
- **Verify both routes:** `/` (no Atelier inline, doorway + footer link present)
  and `/making-of` (return doorway + Atelier body, no chapter chrome). Deep-link
  `/making-of` works because of the `vercel.json` SPA rewrite (dev: Vite serves
  `index.html` for any path).

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
- Chapters live **once** in `constants.chapters` / `chapterList`; SideRail, the
  Map overlay, the Hero eyebrow, and section headings all derive from it.
