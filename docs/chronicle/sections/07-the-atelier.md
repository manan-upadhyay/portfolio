# Section 07 — The Atelier (Making-of revamp)

**Route:** `/making-of` (`pages/MakingOf.jsx` → lazy `sections/Atelier.jsx`) ·
**Status:** **built (v2)** — five-act restructure, Observatory interaction model,
the webhook/alert path, and the **Codebase Atlas** ([08](08-codebase-atlas.md), the
second Act-II instrument) all shipped. · **Canon:** unnumbered coda, not in
`chapters`/`chapterList`, reached from the foot of The Realms + the footer.

> This spec **supersedes** the v1 inline layout of `sections/Atelier.jsx`. The
> components (`BuildReel`, `Observatory`, `PersonaTriptych`) stay; the **page
> structure, ordering, rhythm, and the Observatory interaction model** change.

## Why we're revamping

v1 is nine same-density blocks stacked in source order — reel card → stats grid →
ledger → Observatory → eggs → chips → personas → manifesto. Symptoms:

- **No spine.** Unrelated blocks abut with no narrative throughline; the eye has
  nothing to follow.
- **Repetition.** `.realm-card`-style boxes stack at one rhythm; the page has
  **two near-identical metric grids** (`atelier-stats` 5-up and
  `observatory__metrics` 4-up) within one screen of each other.
- **No breath.** Dense data blocks sit back-to-back with no sparse beats between.

The fix is **act structure + rhythm variation + connective tissue**, plus a
reorder so related ideas live together, plus a **real interaction model for the
Observatory** (its hover is currently dead — see §Observatory).

## The five acts

Frame the page as the build *as a film*. Alternate **dense ↔ sparse** beats; never
place two heavy data blocks adjacent. A thin vertical **spine line** runs down the
page; each act carries a numbered eyebrow (`I · …`) so the eye always knows where
it is.

| Act | Content (from v1 unless noted) | Rationale | Rhythm |
|---|---|---|---|
| **Cold open** | Confession + sub (keep) | the human *why* | sparse, centered, quiet |
| **I · The Build** | `BuildReel` + **stats dissolved into prose** + the built/cut ledger | all *process & decisions* — one cohesive act, not three cards | one dense centerpiece, generous padding |
| **II · The Engine Room** | **Observatory (redesigned)** + **webhooks/alerting (new)** + **Codebase Atlas** (see [08](08-codebase-atlas.md)) | the senior-signals showpiece: analytics, observability, alerting, structure | richest, most interactive |
| **III · The Hidden Layer** | Field guide (eggs) + built-with chips folded in | playful palate-cleanser after the dense act | light, airy, change of pace |
| **Coda** | Personas (`PersonaTriptych`) + manifesto + signature | the person; rhymes with the cold open | sparse, centered, quiet |

### Rhythm / anti-repetition rules
- **Stop boxing everything.** Replace stacked `.realm-card` containers with
  full-width **editorial bands** — varied alignment (some left, some centered),
  large vertical breathing room.
- **Kill the duplicate metric grid.** The `atelier-stats` 5-up grid is **removed
  as a standalone block**; its figures dissolve into the Act I prose ("seven
  scenes, N commits, over D days"). The Observatory keeps the *only* metric
  readout on the page.
- **Number the acts** with a recurring eyebrow treatment; add a connective spine
  line (thin, theme-token, decorative `aria-hidden`).
- **Alternate density** across acts as the table prescribes.

## Observatory — interaction model (the core fix)

**v1 bug:** nodes live inside `.obs-orbit` (`animation: obs-spin 120s linear
infinite`); the only "interaction" is a native SVG `<title>`. A tooltip on a
continuously rotating target is unusable — rotation never pauses, there's no
overview of the 33 events, and `session_recap` on the right is a static label that
never changes.

**v2 model — decouple discovery from decoration.** The constellation becomes a
*display*; an always-visible list becomes the *index*.

- **Always-visible event index.** Render all 33 events grouped by surface (the
  existing `constellation.groups`) as a persistent, scannable, colour-coded
  column of chips/rows. A visitor sees **every** instrumented event with **no
  hover required**.
- **Bidirectional linking.** One `selectedEvent` state. Hover/focus a chip →
  its star lights + lifts; hover/focus a star → its chip highlights.
- **Rotation pauses on interaction.** `animation-play-state: paused` (via a state
  class) the instant the pointer enters the viz or a chip is focused; resumes on
  leave. The target goes still → becomes clickable.
- **Detail readout** replaces the static hub label. Selecting an event shows
  *what it is, where it fires (surface/component), and `track` vs `trackOnce`*.
  With nothing selected, the hub returns to its `session_recap` framing.
- **Touch / coarse pointer + keyboard.** The chip list is the **primary** surface
  on touch (constellation goes static-decorative). Chips are real `<button>`s →
  tab/arrow + Enter for free. Honor `prefers-reduced-motion` (no spin, no lift).

### Data shape (important — voice rule)
Event names, "fires when…", and surface are **technical proper-noun data**, not
voiced copy — they belong in `constants.atelier.observatory`, **exempt from voice
translation** like the existing capability `tags`. Extend each `names` entry:

```js
// constants.atelier.observatory.constellation.groups[].names[]
{ id: 'hero_cta', where: 'Hero — primary call-to-action' }
// (string-only entries may stay as a shorthand during migration)
```

Only the framing sentences (intro, hub note, panel bodies, footnote) stay voiced
under `t('atelier.observatory.*')` across **all** bundles.

## Webhooks / alerting (new — Act II, inside the Observatory)

A genuine senior signal (MTTD, no silent failures, shipping-cadence visibility).
**Do not add another card** — extend the Observatory's **observability** panel and
add a small **signal-flow** visual:

- Two three-stage flows: **source → webhook → Discord**
  - **PostHog** error/exception → Discord `#alerts` (mean-time-to-detect)
  - **GitHub** push → Discord `#deploys` (shipping-cadence visibility)
- One senior caption, e.g. *"Errors and deploys page me where I already am — no
  dashboard babysitting."*
- New readout(s) in the metric row (e.g. `2` webhook routes).
- **Never render webhook URLs** — they're secrets. Describe the route, not the
  endpoint. New non-copy data goes in `constants.atelier.observatory` (e.g. a
  `signals` / `webhooks` array of `{ source, channel, glyph }`); captions voiced.

## Implementation notes
- `sections/Atelier.jsx` is restructured into the five acts; extract per-act
  wrappers if a band repeats. The dissolved stats become inline figures in the
  Act I copy (still data-driven from `constants.atelier.stats`).
- `components/Observatory.jsx` gains `useState` for `selectedEvent`, the chip
  index, pause-on-hover, and the detail readout. New CSS: `.obs-orbit.is-paused`,
  the index list, the active-node + detail styles, the signal-flow visual. All
  theme-token only.
- New strings → **every** bundle (`chronicle` base, `plain`, every egg voice),
  per CLAUDE.md §4.2. Remember i18next **replaces** array keys.
- Keep `BuildReel`, `PersonaTriptych` APIs unchanged.

## Accessibility / performance
- Constellation `role="img"` + a visually-hidden equivalent of the index; chips
  are labeled `<button>`s; the spine line is `aria-hidden`.
- Reduced-motion: no spin, no lift, no scrub auto-motion; instant state changes.
- Animate only `transform`/`opacity`. The Atelier stays lazy + `ErrorBoundary`d.

## Acceptance criteria
- [x] Page reads as five acts with a visible spine + numbered eyebrows; no two
      dense data blocks are adjacent.
- [x] Only **one** metric grid remains on the page (Observatory's); old
      `atelier-stats` block (markup + CSS) is gone, its figures live in Act I as
      an inline `.atelier-tally`.
- [x] Observatory: every event is visible without hovering (the index); star↔chip
      highlight is bidirectional; rotation pauses on interaction; the readout
      updates on select; chips are real `<button>`s (keyboard) and the orbit is
      static on coarse pointers + reduced-motion.
- [x] Webhooks/alerting reads as part of observability (the observability panel +
      the `.observatory__signals` flow); no webhook URL is exposed.
- [x] All new copy ships in every voice (chronicle/plain/scott/dwight/cow);
      dark+light verified at 1280; `npm run build` clean. *(360/768/1920 spot-check
      pending if desired.)*
