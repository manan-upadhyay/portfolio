# Section 08 — The Codebase Atlas (new)

**Component:** `src/components/CodebaseAtlas.jsx` · **Home:** Act II of the
Atelier (`/making-of`, see [07](07-the-atelier.md)) · **Status:** **built**.
Data: `constants.atelier.atlas` (curated tree + `hotspots` + `repo`); framing copy
voiced under `t('atelier.atlas.*')` in all five bundles.

## Purpose
A cinematic, collapsible, **VS-Code-flavoured** tree over a **curated, annotated
subset** of the repo structure. It shows a CTO *how* this codebase is organized
and **why** — the senior-mindset decisions — **without showing code**. Clicking a
node reveals its *rationale*, not its source. A hotspots rail jumps to the
"marvels." This is one of the strongest selling points on the site: structure as
proof of craft.

> **Not the real filesystem.** A faithful tree would be noise. The Atlas renders a
> **hand-picked, narrated** subset; depth and breadth are chosen for story, not
> completeness.

## Behavior
- **Collapsed by default.** Folders expand on click with a cinematic staggered
  reveal; reduced-motion → instant.
- **Node detail (the *why*, not the code).** Selecting a file/folder shows a
  blurb + a **`signal`** note — the senior decision it embodies. Example for
  `constants/index.js`: *"Every magic value lives here — single source of truth,
  zero duplication."*
- **Hotspots rail** (curated marvels, listed subtly on the right). Selecting a
  hotspot **auto-expands + scrolls the tree** to that node and surfaces its
  `signal`. Initial curated set:
  - `constants/index.js` — no magic strings/values anywhere in components.
  - `i18n/bundles/*` — single source of truth for all copy; voice-switchable in
    one click.
  - `lib/analytics.js` — swappable analytics wrapper (vendor-agnostic).
  - `lib/sound.js` — 0-byte **synthesized** cues (no audio assets shipped).
  - `lib/smoothScroll.js` — Lenis driven by the GSAP ticker (one clock).
  - `hoc/SectionWrapper.jsx` — lazy + `Suspense` + `ErrorBoundary` per section.
- **"See the originals"** → a GitHub button linking the **public** repo (see
  CLAUDE.md / README license note — public + proprietary license).
- **Sound (optional, intent-rewarding).** Reuse `lib/sound.js` for an
  expand/select cue, consistent with the site's "sound rewards intent, never
  motion" rule. Respects the sound master + reduced-motion mute.

## Data shape (data-driven, non-copy in constants)
New `constants.atelier.atlas` — a curated tree + hotspot ids. Tree node:

```js
{ name: 'constants', type: 'dir', children: [...] }
{ name: 'index.js', type: 'file', glyph: 'braces',
  blurb: '…', signal: '…' }   // blurb/signal are technical narration (data)
```

Whether `blurb`/`signal` are voiced is a judgement call: they're closer to
technical narration than personality copy. **Default: keep them in `constants`
(English, exempt like capability `tags`)** to avoid authoring N×many voices; only
the Atlas's framing headline/intro are voiced under `t('atelier.atlas.*')`. (If a
voice should re-narrate, that's a later enhancement, not v1.)

## Layout / theme
- Two-pane: **tree** (left/main) + **hotspots rail** (right; collapses under the
  tree on mobile). VS-Code *idiom* (indent guides, chevrons, file glyphs via
  lucide) but rendered in **our starlit tokens** — monospace, theme-token color
  only, the existing cursor-backlight. No raw hex.
- Node glyphs keyed by a small `glyph` map (lucide), like `Observatory`'s
  `PANEL_ICONS` / the Atelier's `EGG_ICONS`.

## Accessibility / performance
- The tree is a real `role="tree"` with `role="treeitem"` nodes; chevrons toggle
  `aria-expanded`; full keyboard nav (arrows expand/collapse/move, Enter selects).
  Hotspots are labeled `<button>`s.
- Animate only `transform`/`opacity`; reduced-motion → no stagger, no sound.
- Lazy-mounted within the already-lazy Atelier; wrapped by `ErrorBoundary`. Ships
  no new heavy deps (lucide glyphs only). Keep initial JS within budget.

## Acceptance criteria
- [x] Collapsible tree (`role="tree"`), collapsed by default, over a curated
      annotated subset (not the real fs); per-row mount reveal, reduced-motion safe.
- [x] Selecting any node shows its *why* (`blurb` + `signal`) in the detail panel,
      never code.
- [x] Hotspots rail ("Start here") jumps to + expands ancestors + selects +
      scrolls each marvel file.
- [x] "See the originals" links the public GitHub repo
      (`constants.atelier.atlas.repo`).
- [x] Keyboard tree nav (↑/↓ move, →/← expand/collapse, Enter/Space select);
      `data-cursor` backlight; optional `blip` cue via `playCue` (respects sound
      master + reduced-motion); dark+light verified at 1280; build clean.
      *(360/768/1920 spot-check pending if desired.)*
