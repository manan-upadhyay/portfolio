# Section 04 — The Realms (Projects)

**Component:** `src/sections/Works.jsx` · **id:** `projects` · **Status:** built
(editorial cinematic **plates** with per-theme realm galleries).

## Purpose
The centerpiece proof of work. Each project is a **realm** presented as a large,
editorial **plate** (breedlove-grade) — cinematic cover art + confident
typographic detail — revealed with scroll choreography. Quality over quantity:
featured realms get full plates; the rest get a compact secondary treatment.

## The mechanic — alternating full-bleed plates
- Featured projects render as **alternating two-column plates** (image left/text
  right, then mirrored), each near-viewport height, separated by generous space.
- On scroll: cover art does a slow **parallax/scale reveal**, the text column
  **staggers in** (eyebrow → serif name → premise → meta → tags → links), and a
  thin **plate index** ("Realm I / IV") sits in a corner.
- Hover on the cover: subtle zoom + ember light sweep; links lift (`Magnet`).
- Secondary projects: a tidy responsive grid of compact `realm-card`s below a
  "Chart N more realms" reveal.

### Plate anatomy (per featured project)
```
[ PLATE ]
 ├ cover (cinematic art or serif-monogram gradient fallback)
 │   └ seals: Featured (wax-seal--featured), NDA (wax-seal--nda)
 └ detail column
     ├ eyebrow: "Realm 0X · <company/domain>"
     ├ name (font-chronicle, large)
     ├ premise: 2–3 line essence (NOT every résumé bullet)
     ├ impact row: 2–3 metric/keyword chips
     ├ tag "runes": tech stack
     └ links: live demo / source (only if present)
```

## Content (from `constants.projects`)
Each project: `name`, `company`, `description` (use as premise — keep ~2–3
lines), `tags`, `highlights` (curate the 2–3 strongest as impact chips — don't
dump all), `image`, `source_code_link`, `live_demo_link`, `live_demo_label`
(optional — overrides the default "Enter the realm" CTA, e.g. "Visit platform"
for a login-gated build), `isFeatured`, `isNDA`. Featured-array order **is** the
Realm I..N order; lead with live, clickable realms and close on NDA/enterprise.
### Cover resolution (in priority order)
1. **`gallery`** — a multi-shot carousel inside the same plate thumbnail. Shape:
   ```js
   gallery: {
     slug: 'royal-tiles',   // folder under public/realms/
     themed: true,          // optional — adds a light|dark subfolder split
     images: ['a.png', 'b.png', …],  // array order IS the display order
   }
   ```
   Resolved paths (standard flow):
   - `public/realms/<slug>/<file>` — used in **every** theme
   - `public/realms/<slug>/<light|dark>/<file>` — per-theme when `themed: true`
     (same filenames must exist in both `light/` and `dark/`)
   The carousel keeps the exact plate UI and adds subtle dot indicators + in-frame
   prev/next arrows. Single-image projects just give a 1-element `images` array.
2. **Single cover webp** — legacy convention `public/chronicle/realms/<slug>.webp`
   (probed only when no `gallery` is set; see
   [ASSETS](../ASSETS.md#2-realms-chapter-04-project-cover-art)).
3. **Fallback** — serif monogram (first letter) on a themed gradient + seals.

## Components & reuse
- `ChapterHeading no="04" eyebrow="The Realms" title="Worlds I've Shipped."`.
- `RealmPlate` (featured) and `RealmCard` (secondary) — colocated; share the
  seal + tag-rune subcomponents. NDA note line stays (trust signal).
- `RealmCarousel` (colocated in `Cover`) — drives the `gallery` thumbnail
  carousel (`.carousel-ctrl` arrows + `.carousel-dot` indicators in `index.css`).
- Reuse `realm-card`, `wax-seal--*`, `Magnet`, `ScrollReveal`/GSAP.

## States / responsive
- Mobile: plates collapse to single column (cover on top, detail below); keep
  parallax subtle or off.
- NDA realms: no links, show NDA seal + "details limited" note.
- Missing cover: monogram fallback must still look intentional.

## Accessibility / performance
- Covers lazy-loaded with width/height (no layout shift); `alt` = project name.
- Links are real `<a target=_blank rel=noopener>`; keyboard reachable.
- Reduced-motion: reveals become fades, no parallax. Animate transform/opacity only.

## Acceptance criteria
- [ ] Featured projects are large cinematic plates, not small cards.
- [ ] Premise is curated (≤3 lines); impact chips, not bullet dumps.
- [ ] Seals + NDA handling correct; links only when present.
- [ ] Cover art parallax + staggered text; graceful monogram fallback.
- [ ] Secondary grid + reveal works; responsive; dark+light correct; 60fps.
