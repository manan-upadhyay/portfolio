# Section 03 — The Arsenal (Tech / Skills)

**Component:** `src/sections/Tech.jsx` · **id:** `arsenal` · **Status:** built
(interactive orbital skill field).

## Purpose
Show the toolkit as a living **constellation/orbital field**, not a list and not
two redundant blocks. This is the *single* home of skills (About has none).
**No percentages, no progress bars, ever** (senior signal).

## The mechanic — interactive orbital skill field (signature motion)
A central focal mark (sigil/compass or the word "Arsenal") with **tech nodes
orbiting** in concentric rings grouped by craft:

- **Ring 1 (inner): Primary armaments** — the core stack (React, Next, Node, TS):
  larger nodes with real logos (`assets/tech/`), ember halo.
- **Ring 2/3:** Frontend / Backend / DevOps & Craft skills as smaller nodes.
- Nodes **drift/orbit slowly** (rAF or GSAP, transform-only). **On hover**, a
  node scales, brightens, shows its label, and faint **constellation lines**
  connect it to siblings in its group. The custom cursor backlight enhances it.
- Optional: hovering a **group legend** highlights/pulls that group's nodes.

### Layout & responsiveness
- Desktop: true radial orbital field (absolute-positioned nodes via polar coords
  computed from indices; animate angle over time).
- Tablet/mobile/reduced-motion: collapse to **grouped "rune" clusters** —
  three labeled groups, each a wrap of skill chips (primary chips larger with an
  ✦), no orbit. Same data, simpler presentation. Never show a percentage.

```js
// polar placement helper
const angle = (i / count) * Math.PI * 2 + ringPhase;
const x = cx + Math.cos(angle) * radius;
const y = cy + Math.sin(angle) * radius;
```

## Visual language
- Nodes: circular `realm-card`-like tiles; primary = larger + ember ring; logo
  centered; label appears on hover (ember). Lines: faint `--color-ember` at low
  opacity. Background: subtle starfield/grid to read as a sky-chart.
- Header via `ChapterHeading no="03" eyebrow="The Arsenal" title="Tools of the Trade." align="center"`.

## Content (from `constants.skillCategories` + `technologies`)
- `skillCategories`: `{ category, blurb, skills:[{ name, tier? }] }` —
  `tier:'primary'` marks core. **No `level`.** This is the single source.
- `technologies`: `{ name, icon }` for nodes that have real logos.
- Keep the two in sync (a primary skill should have a logo where possible).

## Accessibility / performance
- Provide a non-orbital, fully readable grouped list as the baseline DOM (orbit
  is a progressive enhancement layered on top) → screen-reader & keyboard safe.
- Orbit math is transform-only; cap node count; pause off-screen
  (IntersectionObserver). Reduced-motion → static clusters.

## Acceptance criteria
- [ ] Zero duplication: skills appear once, in one cohesive field.
- [ ] No percentages/bars; primary stack visually emphasized.
- [ ] Hover reveals label + constellation links; feels alive, not busy.
- [ ] Mobile/reduced-motion grouped-cluster fallback is clean and readable.
- [ ] 60fps; pauses when off-screen; dark+light correct.
