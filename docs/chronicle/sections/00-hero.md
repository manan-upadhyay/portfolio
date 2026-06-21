# Section 00 — Origin (Hero)

**Component:** `src/components/Hero.jsx` · **id:** `origin` · **Status:** built,
polishing. This doc is the source of truth for its behavior.

## Purpose
The title sequence. In one viewport it must say "this person is senior, has
taste, and tells a story." Minimal copy, maximal atmosphere. The visitor's photo
stands inside a living, layered landscape.

## Layout
- Full-bleed `h-screen`, `overflow-hidden`.
- **Layered parallax stage** (back→front, z 1→5):
  0 `sky` · 1 `mid` (mountains) · 2 `fog` · 3 `portrait` · 4 `fore`.
  Each layer wrapper is **oversized `inset:-8%`** so parallax never reveals an
  edge; a `.cinematic-vignette` (z6) masks seams + fades the bottom into page bg.
- **Copy block** (z10), left/center: chapter eyebrow → serif name (two masked
  lines) → italic ember tagline (`heroTitle`) → muted hook (`heroHook`) →
  primary CTA "Begin the Chronicle" + text link "Summon me".
- **Scroll cue** bottom-center.
- When `portrait.png` is absent → type-led layout (copy uses wider max-width).

## Motion
- **Intro (GSAP timeline):** layers fade+scale-in (stagger), eyebrow up, name
  lines mask up (`yPercent 120 → 0`), sub/hook fade, cue fades. ~1.6s total.
- **Mouse parallax (rAF):** layers translate by `mouse * depth`, lerp `0.05`,
  depths `0.12 / 0.4 / 0.6 / 0.7 / 0.95`. Clamped so edges never show. Disabled
  on touch/reduced-motion.
- **Scroll-out (ScrollTrigger scrub):** copy drifts up + fades; layers drift up
  at staggered rates as the chapter leaves.
- Ambient: drifting `fog` (`herofog`), optional embers, twinkle stars (fallback only).

## Content (from `constants.personalInfo`)
`name`, `heroTitle` ("Builder of Worlds in Code"), `heroHook` (one line),
`taglines` (only if a typing line is reintroduced — currently omitted to reduce
clutter). CTAs scroll to `#about` / `#contact`.

## Assets
`portrait.png`, `hero-sky/mid/fog/fore.webp` — see [ASSETS](../ASSETS.md#1-hero-chapter-00).
Each is probed; missing → procedural fallback.

## States / responsive
- Mobile: portrait scales/ô-positions (center-bottom), parallax off, copy
  centered; name clamps down. Keep the figure from covering the headline.
- Light theme: warm dawn palette; verify text contrast over art (vignette helps).

## Accessibility / performance
- Decorative layers `alt=""` / `aria-hidden`. Name is a real `<h1>`.
- Reduced-motion: no parallax/scrub; static composition; intro becomes a simple fade.
- Lazy/`fetchpriority` the largest art; everything animates on transform/opacity.

## Acceptance criteria
- [ ] No visible layer edge at any mouse position or width.
- [ ] Portrait composites with believable light wrap (warm right rim).
- [ ] Reads as cinematic with AND without art (fallback is still elegant).
- [ ] Copy legible in both themes; `<h1>` present; cue invites scroll.
- [ ] 60fps; no console errors; scroll never locks.
