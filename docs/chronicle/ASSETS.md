# Assets — The Chronicle ("World Bible" + prompts)

All cinematic art lives in `public/chronicle/` and is referenced by absolute
path. Code probes each file and degrades gracefully if missing
(see [ARCHITECTURE](ARCHITECTURE.md#6-asset-pipeline)). Prefer **WebP q≈80**,
each file ideally < ~600KB. **Delete unused originals** — `public/` ships as-is.

---

## 0. The World Bible — prepend to EVERY generation/edit prompt

> **Scene:** one continuous cinematic pre-dawn fantasy frontier, viewed
> ultra-wide at eye level. **Horizon is low, ~65% down the frame. Single light
> source: a warm ember-gold dawn sun, LOW on the RIGHT, just above the
> horizon.** Everything is lit warm from the right; shadows fall left; the far
> left sinks into deep cool darkness. **Atmospheric haze increases with
> distance.** Painterly, serene, epic, film-still quality with fine grain.
> **Exact palette:** ink-navy `#0B0F1A` (left & top) → indigo `#1B2440` (mid
> sky) → warm ember `#E8965A` & old-gold `#D9A441` (glow at the right horizon
> only). Land = cool indigo-grey silhouettes `#2A3450` with a thin warm ember
> rim-light on right-facing edges only. **No bright white snow, no high-key
> areas, no text, no logos, no watermark, no people** (except the portrait).
> **Composition law:** the **LEFT third stays dark, simple, empty** (large
> headline text sits there); detail + light concentrate on the **RIGHT** (light
> source + the figure stands there).

Consistency anchors to repeat across layers: same sun position (low-right), same
horizon (~65% down), same palette hexes, haze-with-distance, dark-empty-left.

---

## 1. Hero (chapter 00) — `public/chronicle/`

Wired in `Hero.jsx` (z-order back→front: sky, mid, fog, portrait, fore).

| File | Dim | Format | Notes |
|---|---|---|---|
| `portrait.png` | ≥2000px tall | **transparent PNG** | Manan cut out; warm rim-light on his RIGHT edge, cool fill left; haze at feet. Stands in the right third. |
| `hero-sky.webp` | 2880×1620 | opaque | Sky only; dark/empty left, ember glow low-right; sparse stars upper-left. |
| `hero-mid.webp` | 3200×1600 | **transparent** | Distant mountains as indigo silhouettes, ember rim on right slopes; taller right, low left; dissolves into mist. Bottom-anchored, wider than screen. |
| `hero-fog.webp` | 2880×900 | **transparent** (or on black → `mixBlendMode:screen`) | Drifting mist band, warm underglow on right. Sits between mountains and portrait. |
| `hero-fore.webp` | 3200×1600 | **transparent** | Nearest dark ridge + ground fog, almost-black `#10162A`, slightly soft-focus, taller right. Wraps the figure's base. |

**Prompts** (prepend World Bible to each):

- **portrait.png** (edit raw photo): "Cleanly cut the person onto transparency
  (PNG). Grade to belong in this scene: warm ember-gold rim-light tracing their
  RIGHT edge (hair, shoulder, cheek), cool indigo fill on the left, deep
  shadows. Faint haze at the lower body so they melt into fog. Natural skin,
  confident cinematic film-still. Transparent background only."
- **hero-sky.webp**: "Paint only the SKY: ink-navy filling top and entire LEFT,
  to indigo `#1B2440`, to a soft warm ember-gold glow low on the RIGHT horizon.
  Sparse faint stars in the dark upper-left only; a few thin high clouds lit
  warm on their right edges. Smooth, painterly, no land, no drawn horizon line.
  2880×1620 opaque."
- **hero-mid.webp**: "Midground only, transparent: distant mountains as cool
  indigo-grey silhouettes `#2A3450` through haze, thin warm ember rim-light on
  right-facing slopes. Taller dramatic peaks RIGHT; low and simple LEFT; one
  small floating landmass upper-right. No snow. Tops/edges dissolve into
  transparent mist. Bottom-anchored, 3200×1600 transparent PNG, no sky."
- **hero-fog.webp**: "A single horizontal band of soft low fog on transparency,
  desaturated indigo-grey `#3A4660` with faint warm ember underglow on the RIGHT
  half. Semi-transparent, wispy, dissolving at all edges. 2880×900 transparent."
- **hero-fore.webp**: "Foreground framing, transparent: a dark near ridge /
  rocky outcrop as an almost-black indigo silhouette `#10162A` along the bottom,
  thick fog rolling over it, faint ember glow seeping through on the RIGHT.
  Slightly soft-focus. Lower/broken LEFT, taller RIGHT. Bottom-anchored,
  3200×1600 transparent PNG, no sky."

---

## 2. Realms (chapter 04) — project cover art

One cinematic cover per featured project, themed to its domain but obeying the
World Bible palette/light. Used as the visual half of each editorial "plate".

| File | Dim | Format |
|---|---|---|
| `realms/<slug>.webp` | 1600×1200 (4:3) | opaque, q≈80 |

Slugs (match `constants` projects): `advisor-portfolio`, `gajaakriti-studio`,
`royal-tiles`, `digital-investor` (+ others as needed).

**Prompt template** (prepend World Bible):
> "A cinematic, painterly cover illustration representing **<one-line project
> essence>** as a *realm* in the Chronicle world — e.g. <domain metaphor>.
> Indigo-and-ember palette, warm light from the right, atmospheric depth, subtle
> cartographic/parchment texture. Evocative and abstract, NOT a UI screenshot,
> no text, no logos. 1600×1200."

Examples for the metaphor slot:
- Advisor Portfolio (finance viz): "a constellation of glowing data-ridges /
  charted financial peaks under dawn light".
- Gajaakriti (wedding media): "a warm, ornate golden-hour pavilion of light and
  silk, cinematic bokeh".
- Royal Tiles (tile visualizer): "an intricate geometric mosaic floor receding
  into mist, tiles catching ember light".
- Digital Investor: "a luminous market galaxy, indigo currents threaded with
  gold".

(If covers are absent, the plate falls back to a serif monogram on a gradient —
already handled.)

---

## 3. Map overlay (⌘K) — `map/`

| File | Dim | Format | Notes |
|---|---|---|---|
| `map/realm-map.webp` | 2400×1500 | opaque | Hand-drawn fantasy/cartographer map of the "realms"; aged parchment in light, ink-blue vellum in dark; space for ~6 glowing pins. Subtle, low-contrast so pins/labels read on top. |

**Prompt** (prepend World Bible, relax the "no-land" rules — this IS a map):
> "An aged hand-drawn fantasy cartographer's map — coastlines, mountains,
> forests, a winding route line, compass rose in a corner, faint grid. Ink linework
> on parchment, muted indigo + ember + gold, weathered edges, painterly. Leave
> open regions for ~6 location pins. No real place names, no modern text. 2400×1500."

---

## 4. Brand mark — `sigil.svg`

A personal cartographer's monogram ("M") / compass-star crest. SVG preferred
(crisp, themeable via `currentColor`). Used in navbar wordmark, footer, favicon.

**Prompt:** "A minimal elegant monogram crest combining the letter 'M' with a
compass star / cartographer's mark. Single-color line art, balanced, timeless,
works at 32px. Transparent SVG, no text."

---

## 5. Day / Night variants (optional)

One art set is enough — light mode is tinted/relit in CSS. Only if a layer
looks wrong in light, add a `-day` sibling (e.g. `hero-sky-day.webp`) and the
code will prefer it in light theme.

---

## 6. Housekeeping

Keep `public/chronicle/` to only the referenced files (the 5 hero assets +
project covers + map + sigil). Remove generation leftovers (`*-Edited.png`,
oversized source `*.png`, `Gemini_Generated_*`). Every stray file ships to prod.
