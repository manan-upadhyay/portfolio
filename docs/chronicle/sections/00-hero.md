# Section 00 — Origin (Hero)

**Component:** `src/sections/Hero.jsx` · **id:** `origin` · **Status:** built
(Astrolabe Title Sequence). This doc is the source of truth for its behavior.

## Purpose
The title sequence. In one viewport it must say "this person is senior, has
taste, and tells a story." Editorial type carries the message; a living
**astrolabe** instrument carries the wonder and the dwell-time. No human
photo — the wow is the craft.

> Replaces the old layered-parallax-photo concept (sky/mid/fog/fore +
> `portrait.png`) **and** a trialed image backdrop — both removed. The hero is
> now **fully procedural** (no image assets).

## Layout
- Full-bleed `h-screen`, `overflow-hidden`.
- **Backdrop (z0):** dark theme → a **pure-CSS starfield**: radial ink gradient
  (`#1B2440 → #0E1426 → #0B0F1A`, ending at the page color) + ~70 procedurally
  placed stars that **twinkle** (`.hero-star` / `star-twinkle`, desynced, static
  under reduced motion). Light theme → warm "dawn" radial gradient.
- **Legibility scrim (z1):** left→right gradient in the page bg color — darkens
  the copy side, leaves the instrument lit. Plus `.cinematic-vignette` (z2) and a
  bottom fade pinned to `--color-primary` (z2) for a **seamless hand-off** to the
  next section.
- **Astrolabe (z3):** a Canvas2D instrument. Desktop: right side, vertically
  centered, fully on-screen (`md:right-[4%] w-[min(44vw,560px)]`). Mobile: a
  **contained top accent** (`top-[6%] w-[62vw] max-w-[280px] opacity-60`) so it
  no longer sits behind the copy.
  A shared `components/CompassRose` SVG sits at its center (DOM overlay above
  canvas), over a small ember/gold **pivot cap** so the alidade reads as anchored.
- **Mobile layout:** the copy is **bottom-anchored** (`justify-end pb-28`,
  reverting to `md:justify-center`) so the instrument owns the top and the title
  reads like a film-title card in the lower third. The supporting `heroHook` line
  is hidden below `sm` (`hidden sm:block`) to keep small screens uncluttered.
- **Bearing readout (z5):** mono `bearing NNN° · origin|charting`, bottom-right,
  desktop/pointer only. Updated imperatively from the rAF loop (no re-render).
- **Copy (z10), left:** chapter eyebrow → serif name (two masked lines; the clip
  boxes are padded `pb-[0.18em] -mb-[0.14em]` so descenders aren't shaved) →
  italic tagline = `heroLead` + a **rotating trailing phrase** (`I architect
  <phrase>`) → muted hook → CTAs ("Begin the Chronicle" / "Summon me") → mono
  meta line (`coordinates · location`).
- **Scroll cue** bottom-center.

## The astrolabe (Canvas2D)
Drawn from theme tokens read via `getComputedStyle` (re-read on theme change),
so it's never off-palette. Layers: ember aura · concentric rings · rotating
degree bezel (72 ticks, majors every 30°) · counter-rotating constellation disc
(seeded star field + link lines) · fixed cardinal letters (N = "up" = Origin) ·
the **alidade** (sighting needle) · a **pivot cap** (anchor dot) at its center ·
`CompassRose` hub.

- **Assembly intro (~2.4s):** an "Iron-Man" build — rings scale in with overshoot
  (`easeOutBack`, staggered), bezel ticks sweep on from N one arc at a time,
  constellation stars pop with a per-star stagger, cardinals fade, the alidade
  does a decelerating multi-turn spin and settles pointing up (Origin), then the
  `CompassRose` springs into the center last.
- **Interaction:** after assembly the alidade **eases to track the cursor**
  (shortest-path lerp `0.08`); the bearing readout shows the live heading. On
  touch/coarse or `mouse===null` → gentle ambient sweep. Reduced-motion → static
  fully-assembled instrument, needle at N, no rAF loop, no tracking.
- **Ambient:** very slow bezel drift + constellation counter-drift + star
  twinkle, all post-assembly and far from the copy.

## Motion (copy)
- **Intro (GSAP timeline):** eyebrow up → name lines mask up
  (`yPercent 120→0`) → tagline/hook fade → CTAs/meta → cue. Reduced-motion rests
  at natural state.
- **Rotating phrase:** `personalInfo.heroPhrases` cycles every 3.2s via Framer
  `AnimatePresence` (mode `wait`) with a **blur cross-fade**; the phrase is the
  last thing on the line (no mid-gap) and an invisible sizer reserves the widest
  phrase so the line never reflows. Paused under reduced-motion (shows phrase 0).
- **Scroll-out (ScrollTrigger scrub):** copy drifts up + fades; astrolabe drifts
  up + fades as the chapter leaves.

## Content (from `constants.personalInfo`)
`name`, `heroLead` + `heroPhrases` (rotating tagline), `heroTitle` (fallback),
`heroHook`, `coordinates`, `location`. CTAs scroll to `#about` / `#contact`.

## Assets
**None.** The hero is fully procedural — CSS starfield backdrop + Canvas2D
astrolabe, all from theme tokens. (Trialed sky images are archived in
`/branding/hero-sky/`, not deployed.) See [ASSETS](../ASSETS.md#1-hero-chapter-00).

## Accessibility / performance
- Canvas + rose are `aria-hidden`/decorative. Name is a real `<h1>`.
- Tokens drive all instrument color (AA-safe in both themes via the scrim).
- Reduced-motion: no parallax/scrub/tracking; static instrument; copy simple
  fade. Coarse pointer: no cursor tracking. Animate transform/opacity only;
  canvas is dpr-capped (≤2) and pauses scheduling under reduced-motion.

## Acceptance criteria
- [x] Astrolabe fully on-screen at all widths (no clipped edge).
- [x] Instrument assembles in sequence, then the needle tracks the cursor.
- [x] `CompassRose` shared with the Map overlay (one component).
- [x] Reads as cinematic with zero image assets (procedural starfield + twinkle).
- [x] Copy legible in both themes; `<h1>` present; cue invites scroll.
- [x] 60fps; no console errors; scroll never locks; `npm run build` clean.
