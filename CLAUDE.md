# CLAUDE.md — The Chronicle (Manan Upadhyay Portfolio)

> **This file is the canonical entry point for any AI/dev work on this repo.**
> Read it first, then the relevant doc in [`docs/chronicle/`](docs/chronicle/).
> The `docs/chronicle/` set is the **single source of truth**. The older
> `docs/*.md` (ARCHITECTURE, COMPONENTS, ROADMAP…) describe the *pre-revamp*
> template and are **superseded** — do not follow them.

---

## 1. What we are building

A **cinematic, scroll-directed senior-developer portfolio** for Manan Upadhyay
(Full-Stack Developer, 5+ yrs). Not a template, not a résumé dump — an
**interactive story** that makes hiring managers, CTOs, and clients feel his
craft within ten seconds.

**Narrative spine — "The Chronicle":** a cartographer's epic journey. The
visitor travels through *chapters*; projects are *realms* charted on a map;
copy carries subtle nods to LOTR / GoT / RDR / Witcher / One Piece — **flavor,
never cosplay.** Tone: confident, literary, modern. Think a film title sequence
crossed with a premium editorial site.

**Reference north-stars:** breedlove.xyz (editorial project plates, day/night
toggle, contact), unabyss.com (cursor backlight, smooth scroll choreography),
2019.makemepulse.com (multi-layer parallax depth).

**Quality bar:** every section is its own *moment* with intentional motion.
"Would this survive on awwwards?" If a section is a static list, it's not done.

---

## 2. The canon (do not drift)

**Chapters & section ids** (the `id` is what anchors/nav/map use):

Section components live in `src/sections/`; reusable widgets in `src/components/`.

| # | Chapter label | Component | `id` | Concept |
|---|---|---|---|---|
| 00 | Origin | `sections/Hero.jsx` | `origin` | Pure-CSS starfield + **Canvas2D astrolabe** (no bg image) |
| 01 | The Craft | `sections/About.jsx` | `about` | Who he is + disciplines |
| 02 | The Journey | `sections/Experience.jsx` | `work` | **Pinned horizontal** scrubbed path |
| 03 | The Arsenal | `sections/Tech.jsx` | `arsenal` | **Interactive orbital** skill field |
| 04 | The Realms | `sections/Works.jsx` | `projects` | **Editorial cinematic** project plates |
| 05 | Summon | `sections/Contact.jsx` | `contact` | Statement + form + channels |
| —  | The Atelier *(coda)* | `sections/Atelier.jsx` | `atelier` | **Making-of** on its own route `/making-of` (not in the scroll spine): the scrubbable `BuildReel` (the build as a film in nine scenes) + built/cut ledger + the `PersonaTriptych` ("off the map") + manifesto |

**The Atelier is an unnumbered coda on its own route** (`/making-of`), not part
of the six-chapter spine and no longer inline in the scroll page. The scroll
page (`/`, `pages/Chronicle.jsx`) **ends at Contact**; the Atelier renders
standalone at `/making-of` (`pages/MakingOf.jsx`, lazy-loading `sections/Atelier.jsx`)
as a shareable "behind the curtain" page. It stays *deliberately absent* from
`chapters`/`chapterList` — so it never appears in the `SideRail` nav or the ⌘K
map (those stay the six-realm journey). It's reached from the doorway at the foot
of The Realms (`works.nod`/`works.nodCta` → navigates to `/making-of`, remembering
the scroll position so the return lands you back there) or the quiet footer link
(`footer.atelierLink`); a fixed return doorway (`makingOf.back`) leads home. Its
non-copy data (headline metrics, the build-timeline shape, ledger/cut/tech ids)
lives in `constants.atelier`; all labels are voiced under the bundles' `atelier.*`
(+ `makingOf.*`) keys. See [LEGENDARY-ROADMAP](docs/chronicle/LEGENDARY-ROADMAP.md) §7.

**Routing.** The app is a two-route SPA (`react-router-dom`): `/` (the Chronicle)
and `/making-of` (the Atelier) share one shell — `components/Layout.jsx` (smooth
scroll, the global controls, footer, analytics; renders route content through
`<Outlet/>`). `App.jsx` is just the router. Route-scoped chrome (`SideRail`,
`MapOverlay`, the mobile map button, the ⌘K handler) lives in `pages/Chronicle.jsx`;
the Atelier's only chrome is its return doorway. `vercel.json` rewrites client
routes to `index.html` (excluding `/api`) so `/making-of` is directly shareable.

Chapters are defined **once** in `src/constants/index.js` — `chapters` (keyed by
section `id`: structural **data** only now — `no`, map `x`/`y`, search `kw`) plus
the derived ordered `chapterList`. The voice-bearing `label` + `sub` live in the
**Voice bundles** (see below), keyed by id: `t('chapters.<id>.label')` /
`t('chapters.<id>.sub')`. Add/rename a chapter in `constants` (data) + the
bundles (labels). The `SideRail.jsx` nav, Hero eyebrow, section headings
(`ChapterHeading`), and ⌘K `MapOverlay.jsx` pins all read from this pair.

**Copy lives in i18n, not constants.** As of Phase 1 (the Voice switcher), all
visible copy lives in **`src/i18n/bundles/*`** and is read via `useTranslation`'s
`t()`. `src/constants/index.js` holds **non-copy data only** — links, icons,
map coords, chapter `no`/`kw`, project facts, skill names, stat values. Never
hardcode display strings in components; add the key to the bundles instead.
(There is no `Navbar`/`CommandPalette` — superseded by `SideRail` + `MapOverlay`.
The visitor-facing controls are the top-right `SkyControl` (the 5-mode sky menu
wrapping `DayNightToggle`) and the bottom-right `ControlCluster` = `VoiceSwitcher`
+ `SoundControl` (the Phase 4 interactive-sound master control). The
`VoiceSwitcher` popover is intentionally minimal (open voices + a one-time
scroll-triggered entice note + a CTA into the Hall); the searchable, category-
grouped **`VoiceHall`** overlay (⇧⌘V) is the rich picker, with a gamified
**"Summon a voice"** request form that posts through the same raven endpoint as
Contact. Info popovers use the portalled **`Hovercard`** so they're never clipped.)

**Palette / theme:** dark-first "starlit realm" + light "dawn over the realm".
All color via CSS variables in `src/index.css`. See
[DESIGN-SYSTEM](docs/chronicle/DESIGN-SYSTEM.md).

---

## 3. Tech stack (locked)

- **React 18 + Vite 4**, JSX function components + hooks only (one exception:
  `ErrorBoundary` class). **Node 24** (pinned via `engines` + `.nvmrc`).
- **react-router-dom** → the two-route SPA: `/` (Chronicle) + `/making-of`
  (Atelier), sharing `components/Layout.jsx` (see §2 "Routing"). `vercel.json`
  provides the SPA rewrite (excluding `/api`).
- **Tailwind** for layout/spacing + **CSS variables** for all theme color.
- **Framer Motion** → component enter/hover/exit + small interactions.
- **GSAP + ScrollTrigger** → scroll choreography (pin, scrub, parallax-out).
- **Lenis** → smooth scroll, driven by GSAP ticker (`src/lib/smoothScroll.js`).
  Framer motion variants live in `src/lib/motion.js`.
- **Zustand** → theme/sky store (`src/store/useThemeStore.ts`) + voice store
  (`src/store/useVoiceStore.ts`) + sound store (`src/store/useSoundStore.ts`) +
  the **session-only** expedition store (`src/hooks/useExpedition.js`, *not*
  persisted — powers the Phase 5 recap). See [LEGENDARY-ROADMAP](docs/chronicle/LEGENDARY-ROADMAP.md) §5.
- **Phase 5 recap** → `ExpeditionRecap` (a cinematic instrument panel at the foot
  of Contact) "reads" the visitor from the browser via `src/lib/visitor.js` +
  `useVisitor` — a cached `navigator`/`screen`/WebGL snapshot (GPU, OS/browser,
  display+Hz, battery, network) **plus one opt-in IP-geolocation lookup**
  (`ipwho.is`) for city/coords. That is the recap's *only* network call; nothing
  is stored or sent beyond it, and the copy says so (with an ⓘ "how?" note). It
  pins the visitor on a Canvas2D polar-azimuthal **`TravelerMap`**, shows an
  Apple-Weather **`SunArc`** (`SunCalc`), a device-hash **Traveler's Sigil**
  (`src/lib/sigil.js`), a persisted visit counter (`useVisitStore`), and a
  scalable sealed-voice **constellation** that opens the Voice Hall.
- **SunCalc** → time-aware **sky** (`src/lib/sky.js`): `auto` mode resolves the
  theme from the visitor's local time; 5 modes (auto + dawn/day/dusk/night). See
  [LEGENDARY-ROADMAP](docs/chronicle/LEGENDARY-ROADMAP.md) §3.
- **Web Audio** → the **interactive sound design system** (`src/lib/sound.js`):
  synthesized cues (0 bytes) + one optional `public/sounds/raven.mp3`, gesture-
  unlocked, default-on / reduced-motion-muted. Sound rewards *intent*, never
  motion. See ARCHITECTURE §4b + DESIGN-SYSTEM §4c.
- **i18next + react-i18next** → the **Voice switcher** (multi-personality copy).
  Each voice = an i18next language; `chronicle` is the complete base/fallback,
  other voices override only changed keys. Core voices (`chronicle`, `plain`)
  bundle eagerly; easter-egg personalities are code-split via `loadVoice`
  (`src/i18n/index.js`). The `voices.js` registry carries `category` + `glyph`
  (serif monogram) per voice so the feature scales: a **Voice Hall** overlay
  (`VoiceHall`, ⇧⌘V / the cluster popover's CTA / the ⌘K palette) is the
  searchable, grouped picker, while the bottom-right popover keeps the open
  voices + a collapsible sealed group. Bundles: `src/i18n/bundles/*`. See
  [LEGENDARY-ROADMAP](docs/chronicle/LEGENDARY-ROADMAP.md) §1.
- **lucide-react** → icons (+ custom `CompassRose` SVG). **No emoji in UI.**
- **Contact** → server-side **Resend** via a Vite dev middleware (`ravenApiDev`
  in `vite.config.js`) locally / a serverless function in prod; the API key never
  reaches the client. **Vercel Analytics** (`@vercel/analytics/react`) is mounted
  in the shared shell (`components/Layout.jsx`).
- **❌ Three.js / @react-three/* has been fully removed.** Do not add WebGL/3D.
  Depth comes from layered CSS + parallax + Canvas2D (the hero astrolabe).

---

## 4. Engineering standards (senior-level, non-negotiable)

1. **Reusable & DRY.** Shared visuals = a component in `src/components/` or a CSS
   utility class — never copy-paste. New repeated pattern → extract it.
2. **Data-driven.** Display **copy** comes from the i18n bundles
   (`src/i18n/bundles/*`) via `t()`; structural **data** comes from
   `src/constants/`. Components are pure presenters — no inline prose, no magic
   numbers for content, no hardcoded strings. A new string → add a bundle key
   (and its `plain` override when the wording changes by voice).
   - **Every new piece of content ships in EVERY voice.** When you add or change
     any visible copy, write it for **all** bundles — the `chronicle` base
     (canonical/fallback), `plain`, **and** every easter-egg voice
     (`scott`, `dwight`, `cow`, …), each in that personality's character. Don't
     rely on fallback for voiced copy: i18next **replaces** (not deep-merges)
     array keys like `points`, so a voice that overrides an array misses
     newly-added entries entirely unless you add them there too. New voice → it
     must cover the new keys before it ships.
3. **Theme-token only.** Use `var(--color-*)` / Tailwind tokens. **No raw hex in
   components** except inside generated-art fallbacks. If you need a new color,
   add a token to `index.css` (both themes).
4. **Motion is cleaned up.** Every GSAP setup uses `gsap.context()` scoped to a
   ref and `ctx.revert()` on unmount. Every listener/`requestAnimationFrame`/
   `ScrollTrigger` is removed in the effect's cleanup. No leaks.
5. **Accessibility & input.** Always honor `prefers-reduced-motion` (static
   fallback) and `(hover: none)` / coarse pointers (no mouse-parallax, no custom
   cursor). Real semantic elements (`button`/`a`), `aria-label`s, keyboard
   focus, AA contrast on every heading.
6. **Performance budget.** Sections are `lazy()` + `Suspense` + `ErrorBoundary`.
   Lazy-load below-the-fold art. Animate only `transform`/`opacity`. Target:
   initial JS < ~200KB gz, Lighthouse perf ≥ 90, 60fps scroll. Don't ship dead
   deps/assets.
7. **Resilient.** Optional assets are probed and degrade gracefully (e.g. realm
   covers / map). A failing subtree must never white-screen — wrap risky trees in
   `ErrorBoundary`. (The hero is now fully procedural — no image to probe.)
8. **Consistent structure.** One section = one file in `src/sections/`,
   default-exported, wrapped by `SectionWrapper` (or its own `<section id=…>`).
   Reusable sub-pieces live in `src/components/` (flat, barrel-exported via
   `src/components/index.js`); sections barrel is `src/sections/index.js`.

**Definition of done** for any section: matches its spec in
`docs/chronicle/sections/`, responsive at 360 / 768 / 1280 / 1920, dark + light
correct, reduced-motion + touch correct, no console errors, `npm run build`
clean, and it looks like a *moment* — not a list.

---

## 5. Workflow rules

- **Before building a section,** read its spec in `docs/chronicle/sections/` AND
  [DESIGN-SYSTEM](docs/chronicle/DESIGN-SYSTEM.md) +
  [ARCHITECTURE](docs/chronicle/ARCHITECTURE.md).
- **Cadence:** build/iterate **one section at a time**, verify visually (run dev
  server, screenshot dark+light), then move on.
- **Assets:** if a section needs art, it must work with a graceful fallback
  first; real art is specced in [ASSETS](docs/chronicle/ASSETS.md). Shipped art
  lives at the `public/` root (favicons, `og-image.png`, `logo-{light,dark}.png`,
  `realms/…`); only production-bound files belong there. Brand **source/archive**
  art lives in `/branding/` (out of `public/`, not deployed); the favicon/og
  pipeline is in `/tools/og-image/`. Never block a build on missing art.
- **When you change canon** (a chapter id, a token, a shared component API),
  update the relevant doc in the same change. Docs and code never diverge.
- **Verify:** `npm run dev` then drive headless Chrome for screenshots; check
  `npm run build`. See ARCHITECTURE → "Verification".

---

## 6. Doc index

| Doc | What it governs |
|---|---|
| [LEGENDARY-ROADMAP.md](docs/chronicle/LEGENDARY-ROADMAP.md) | Planned "wonder" features — decisions, rationale, open questions, task tracking |
| [TACTILE-MOMENTS.md](docs/chronicle/TACTILE-MOMENTS.md) | Phase 8 — deliberate intent-gated interactions (TM-1…TM-9): astrolabe sky-scrub, kinetic headings, contextual cursor, voice-aware portrait, etc. Source of truth for that set |
| [DESIGN-SYSTEM.md](docs/chronicle/DESIGN-SYSTEM.md) | Color tokens, type scale, spacing, motion language, CSS utilities, component inventory, a11y |
| [ARCHITECTURE.md](docs/chronicle/ARCHITECTURE.md) | Folder map, libraries, smooth-scroll/GSAP patterns, global shell, perf, verification |
| [ASSETS.md](docs/chronicle/ASSETS.md) | "World Bible", filenames, dimensions, generation prompts |
| [ANALYTICS.md](docs/chronicle/ANALYTICS.md) | Feature-adoption telemetry — the `analytics.js` wrapper, event catalog, PostHog dashboard setup |
| [sections/00-hero.md](docs/chronicle/sections/00-hero.md) | Origin hero |
| [sections/01-the-craft.md](docs/chronicle/sections/01-the-craft.md) | About |
| [sections/02-the-journey.md](docs/chronicle/sections/02-the-journey.md) | Pinned horizontal experience |
| [sections/03-the-arsenal.md](docs/chronicle/sections/03-the-arsenal.md) | Orbital skill field |
| [sections/04-the-realms.md](docs/chronicle/sections/04-the-realms.md) | Editorial project plates |
| [sections/05-summon.md](docs/chronicle/sections/05-summon.md) | Contact |
| [sections/06-map-overlay.md](docs/chronicle/sections/06-map-overlay.md) | Interactive map (⌘K) |
| [sections/07-the-atelier.md](docs/chronicle/sections/07-the-atelier.md) | Making-of revamp (acts, Observatory interaction model, webhooks/alerting) |
| [sections/08-codebase-atlas.md](docs/chronicle/sections/08-codebase-atlas.md) | Cinematic codebase explorer (new) |

---

## 7. Commands

```bash
npm run dev      # vite dev server
npm run build    # production build (must stay clean)
npm run preview  # preview the build
```
