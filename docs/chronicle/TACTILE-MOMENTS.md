# TACTILE-MOMENTS — Phase 8: deliberate interactions & the living portrait

> **Status:** specification / not yet built. This doc is the **single source of
> truth** for the Phase 8 feature set. It is written to be self-contained: a cold
> AI session (or a new contributor) should be able to build any one feature from
> this doc alone, without re-deriving the codebase.
>
> Read [CLAUDE.md](../../CLAUDE.md) §2–§4 first (canon + engineering standards),
> then [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) (tokens/motion) and the relevant
> section spec under [sections/](sections/). For the sound engine internals see
> [web_audio_deep_dive.md](web_audio_deep_dive.md) and `src/lib/sound.js`.

---

## 0. The governing principle (read before touching anything)

The Hero astrolabe needle is the site's most memorable interaction. It works
because it satisfies **all four** of these at once, and **every** feature in this
doc must pass the same test before it ships:

1. **Tactile** — the visitor *grabs / presses / drags* something physical.
2. **It resists** — mass, inertia, friction, a press-duration. Never instant,
   never linear.
3. **It rewards intent, not motion** — it fires because the visitor *chose* to
   act, never merely because they scrolled or a viewport entered.
4. **Sound and motion are one gesture** — audio *is* the moving thing (the gear
   *is* the needle), never a layer bolted on top.

> **The dilution rule.** The site already has a dense interactive texture (detent
> ticks, hover notes, the magic-lantern lens, film-transport whir, voice-decode
> glitch). The needle is memorable *because it is rare and deliberate*. Adding
> motion-triggered ambience **subtracts** from the needle. When in doubt, do less.
> Every feature here is opt-in/intent-gated by construction — keep it that way.

### Non-goals (explicitly rejected — do not build these)

- ❌ Cursor-following particle trails / ambient cursor confetti.
- ❌ Scroll-triggered sound on every section (sound rewards intent, not scroll).
- ❌ A full-screen page-load preloader animation.
- ❌ Replacing the personal Atelier portrait with a third-party character photo
  (copyright + likeness risk, and it cheapens the one personal frame). See
  **TM-7** for the on-brand alternative.
- ❌ Any Three.js / WebGL (hard canon rule — CLAUDE.md §3).

---

## 1. Feature roster & priority

Each feature has a stable ID (`TM-n`) — **reference these IDs across chats/sessions.**

| ID | Feature | Tier | Net-new sound? | New deps |
|----|---------|------|----------------|----------|
| **TM-1** | Astrolabe bezel — scrub time-of-day / sky ✅ **implemented** | 1 (ship) | reuse `detent` + `watch` | none |
| **TM-2** | Velocity-reactive chapter headings | 1 (ship) | none (silent) | none |
| **TM-3** | Contextual character cursor | 1 (ship) | none (silent) | none |
| **TM-7** | Voice-aware glyph ramp on `FaceParticles` | 1 (ship) | none | none |
| **TM-4** | Arsenal — "pluck the orbit" node | 2 (pick one) | reuse `blip`/`hoverNote` pitch | none |
| **TM-5** | Mobile device-tilt parallax | 2 (pick one) | none (silent) | none |
| **TM-6** | Contact — "seal & release the raven" hold | 2 (pick one) | reuse `detent` + `raven` | none |
| **TM-8** | `FaceParticles` engine reuse (realm covers / 404 / sigil) | 3 (later) | reuse `lens` | none |
| **TM-9** | Per-voice monogram mark in Voice Hall | 3 (later) | none | none |

**Recommended first cut (highest memorability / effort, lowest dilution risk):**
**TM-1, TM-3, TM-7.** They reuse systems already owned, each rewards intent, and
they are invisible-until-noticed.

**Global Definition of Done** (applies to every TM, in addition to per-feature
acceptance criteria) — from CLAUDE.md §4:

- Responsive at 360 / 768 / 1280 / 1920; correct in **dark + light** (all four
  skies: dawn/day/dusk/night).
- `prefers-reduced-motion: reduce` → static, no rAF, no audio.
- `(hover: none)` / coarse pointer → no mouse-parallax, no custom cursor; touch
  path provided where the feature is touch-relevant.
- Animate **only** `transform` / `opacity`. All GSAP in `gsap.context()` scoped
  to a ref with `ctx.revert()` on unmount; every listener / rAF / `ScrollTrigger`
  removed in cleanup. No leaks.
- All visible copy added to **every** voice bundle (`chronicle`, `plain`,
  `scott`, `dwight`, `cow`) — see §6. No raw hex in components (theme tokens
  only). No console errors. `npm run build` clean.
- New analytics via `track()` / `trackOnce()` (`src/lib/analytics.js`), event
  added to [ANALYTICS.md](ANALYTICS.md) catalog.

---

## 2. Shared infrastructure reference (verified APIs)

These are the **real** signatures the features below call. Verified against the
current source — do not re-invent.

### Sound engine — `src/lib/sound.js` (exported `sound` object)

```js
import { sound, playCue } from '../lib/sound';

playCue(name, opts)        // one-shot cue. NO-OP unless unlocked+enabled+pageActive+!reduceMotion.
                           // Registered names live in the CUES map: 'theme','glitch','error',
                           // 'mapOpen','mapClose','blip','detent','settle','hoverNote',
                           // 'assembleSwell','assembleResolve','raven', …
                           // blip/hoverNote accept { step } (pitch index). detent is time-gated by caller.

sound.watch.setSpeed(radPerSec)  // drives the hero gear bed by needle angular speed
sound.watch.setLevel(0..1)       // scroll-distance fade
sound.watch.stop()
sound.lens.setLevel(0..1)        // continuous reveal buzz (FaceParticles hover)
sound.lens.stop()
sound.orbit.setLevel(0..1)       // observatory constellation hover bed
sound.reel.setSpeed(v)           // build-reel film-transport whir
sound.onUnlock(cb)               // fire-once when audio context unlocks (first gesture)
sound.isUnlocked()               // boolean
sound.reduceMotion()             // boolean (matchMedia reduced-motion)
```

**To add a NEW cue:** add a tuning block to `CONFIG` (top of `sound.js`, with the
`peak`/`dur`/freq knobs documented inline) and a method to the `CUES` map keyed by
the cue name; then call `playCue('yourCue', opts)`. Synthesized cues ship **0
bytes** (oscillator + ADSR + biquad). Prefer reusing an existing cue over adding
one — every new timbre is a dilution-rule cost.

**To add a NEW continuous bed:** use `makeBed({ build, peak, sampleUrl })`
(returns `setLevel`/`setSpeed`/`start`/`stop`); the bed tears down fully at level
0 (no idle drone). Mirror `watch`/`lens`/`orbit`/`reel`.

### Astrolabe — `src/lib/astrolabe.js` + `src/hooks/useAstrolabe.js`

```js
// mountAstrolabe(canvas, wrap, { bearingEl, onSpeed }) → { destroy, spin }
useAstrolabe(canvasRef, wrapRef, bearingRef, themeKey, onSpeed, controlsRef);
// controlsRef.current is populated with the live instrument controls ({ spin, … }) while mounted.
// Re-mounts whenever themeKey changes (re-reads CSS theme tokens).
// Internals of note: `cur` = alidade angle; reduced-motion holds at -PI/2 and runs
// the loop ONCE (no reschedule); `isOverlayOpen()` (src/lib/uiOverlay.js) makes the
// instrument dormant when a modal is in front; free-spin physics = spinUp→friction.
```

### Theme / sky — `src/store/useThemeStore.ts` + `src/lib/sky.js`

```js
const { mode, resolvedSky, resolvedTheme, setMode, toggleTheme } = useThemeStore();
// mode: 'auto'|'dawn'|'day'|'dusk'|'night'   resolvedSky: dawn|day|dusk|night
// resolvedTheme: 'light'|'dark'  (derived alias; baseOf via SKY_BASE)
// setMode(mode) commits a manual mode, updates <html> class/dataset.sky, tracks analytics.
import { SKY_ORDER, SKY_BASE } from '../lib/sky'; // ['dawn','day','dusk','night']; base per sky
```

### Cursor — `src/components/Cursor.jsx`

DOM + rAF, three layers (`.cursor-backlight`, `.cursor-ring`, `.cursor-dot`).
Disabled on `(hover: none)`. Adds `.has-custom-cursor` to `<html>`. Interactive
detection today: `e.target.closest('a, button, [data-cursor="hover"], input,
textarea, label, kbd')` → ring `--scale` + ember border. **Opt an element into
the “interactive” cursor with `data-cursor="hover"`** (already used on Hero CTAs).

### FaceParticles — `src/components/FaceParticles.jsx`

```jsx
<FaceParticles src="/atelier/portrait.png" />   // default src; used once in sections/Atelier.jsx:265
// RAMP (light→dark glyph ladder), MAX_PARTICLES=3000, assembly-only rAF then STOP,
// magic-lantern hover lens (fine-pointer only), drives playCue('assembleSwell'/'assembleResolve')
// + sound.lens.setLevel. Static (pre-formed) under reduced motion. aria-hidden.
```

---

## TM-1 — Astrolabe bezel: scrub time-of-day / sky · Tier 1

> **Status: IMPLEMENTED + iteration 2** (pending manual drag-verification on a
> real pointer device — build + lint + headless render are clean; the rotate-drag,
> sparks, crossfade and hover-affordance can't be click-tested here, no automation
> driver). Touches `astrolabe.js`, `useAstrolabe.js`, `Hero.jsx`.
>
> **Locked decisions:**
> - **D1 → options object.** `useAstrolabe(canvasRef, wrapRef, bearingRef,
>   skyKey, { onSpeed, onDetent, onSkyCommit, controlsRef })`.
> - **D2 → commit to manual.** A scrub leaves `auto` (calls `setMode(sky)`).
> - **Deviation (scroll-safety):** rotate-drag is **fine-pointer only**
>   (`!reduce && !coarse`). Coarse/touch keeps tap-to-aim + native scroll + the
>   `SkyControl` menu — a rotate-drag can't be disambiguated from a scroll-drag.
>
> **Iteration 6 — performance audit + the "frozen needle" crash fix:**
> - **CRITICAL — rAF loop could die:** the loop had no error guard, so a single
>   throw in any frame (`draw`/`onScrub`/`onSpeed`) killed the whole loop — the
>   needle froze while the last sound level stayed on ("needle stuck + sound keeps
>   coming"). Now the loop body is wrapped in try/catch, `prevTs` always advances
>   (dt can't explode), and it always reschedules. The loop can no longer die.
> - **Per-frame cost cuts:** removed the needle's `shadowBlur` (a per-frame canvas
>   shadow is one of the most expensive 2D ops) → cheap translucent-underlay glow;
>   batched the **72 tick strokes → 2**, and the 9 constellation lines → 1.
> - **Pause when off-screen:** an IntersectionObserver stops the rAF loop while the
>   instrument is scrolled out of view (no wasted redraws; frees the page's frame
>   budget), and resumes it on return.
> - No `console.*` anywhere in the feature. NB: dev (`localhost:5173`) is always
>   far laggier than prod (StrictMode double-invoke, no minify, HMR) — judge perf
>   on `npm run preview`.
>
> **Iteration 5 — day sky was missing from the cycle:** day/night live on `:root`/
> `.dark` (not a `.light` class), so the detached probe `<div>` couldn't match day
> and it inherited the current theme. Probe now reads off `<html>` (which IS
> `:root`) synchronously (mutate → read → restore, no flash). All four skies resolve
> distinctly; the light phase is back to 50%.
>
> **Iteration 4 — continuous crossfade + curved label + sound (from third test):**
> - **Theme change is now a CONTINUOUS cross-dissolve tied to the rotation** (no
>   more per-detent snap + flash). The engine fires `onScrub(scrubPos)` every frame
>   of a scrub (drag **and** the post-release settle); Hero drives an imperative
>   4-layer preview stack (2 backdrop + 2 scrim, opacity-only, **no React re-render
>   per frame**) whose crossfade `t` = the fractional stop position. So transition
>   speed = rotation speed. The **real theme commits only when the ring comes to
>   rest** (`onSkyCommit` on settle), under the preview, which then fades out (0.45s)
>   to reveal the identical committed sky — seamless. Released mid-turn → the ring
>   eases to the nearest stop and the crossfade completes to it.
>   - Per-sky gradients are **probed once from CSS** (a hidden element matching the
>     `.light/.dark[data-sky]` selectors) — never duplicated in JS.
>   - This also fixes the white flash (the old per-detent `setMode` + ghost is gone)
>     AND is cheaper (no per-detent `getComputedStyle`/React state churn).
> - **Curved guidance label** replaces the overlapping guide card: `mountAstrolabe`
>   pre-renders `ringLabel` ("turn to change the sky") as curved text on the top arc
>   + a sci-fi arc-with-arrowheads cue, blitted as a sprite (no per-frame curved
>   fillText). Theme-adaptive `--color-text` ink (legible on light AND dark),
>   present-but-quiet, brightens on hover. Voice-aware via `setLabel` + `hero.ringLabel`
>   (all five voices). No DOM overlay.
> - **Ring glow feathered:** the hover glow is now a soft radial band centred on the
>   rim (feathered both sides) + a crisp definition line — not a hard double stroke.
> - **Grind sound:** teeth raised 9 → 26 (same as the needle) so it reads as a gear,
>   not a slow cog; the heavier rumble + low-mid grind timbre is what stays distinct.
>
> **Iteration 3 — performance + UX from second real-device test (perf is the
> hard line: smoothness wins over any feature):**
> - **Root-cause of "only grabs near E" + lag:** the hero **copy column** (`z-10`,
>   `max-w-7xl mx-auto`, full-width) sat ON TOP of the canvas (`z-3`), so pointer
>   events only reached the ring where it poked past the column (near E), and the
>   stacked-layer overlap thrashed on hover. Fix: copy column is now
>   `pointer-events-none` with interactive children (`.hero-cta`) opted back in —
>   the whole ring is grabbable and the overlap stops thrashing.
> - **Drag-time jank:** `onBezelMove` was calling `getBoundingClientRect()` every
>   pointermove (forced layout per move). Geometry (`dragCx/dragCy`) is now cached
>   once at grab. Also: cursor is written only on change (`lastCursor`), and the
>   per-frame hover read uses the cached `rect`.
> - **White-flash on day↔night:** the scrim RGB flips light↔dark on an inline
>   gradient (can't CSS-transition), snapping a near-white wash in. Now Hero also
>   captures the **outgoing scrim** and cross-dissolves it (a second ghost layer)
>   — but only on a base flip. The `scrimGradient()` helper builds both the live
>   layer and the ghost from the same recipe (DRY).
> - **Discoverability redo:** the two rotation arrows were removed (they read as
>   *needle* controls). Hover now glows the **ring itself** (double-stroke ember +
>   brighter ticks) — unambiguously "this ring turns". Plus a one-time, session-
>   gated **guide caption** (desktop) naming all three interactions (needle / spin
>   / ring), copy in all five voices under `hero.guide.*`. *(Tunable: it can
>   overlap the voice entice-note in the lower-right; reposition if needed.)*
> - **Distinct ring sound:** the ring no longer shares the needle's gear. New
>   `sound.grind` bed (`sound.js`) — a heavier, coarser sibling (lower rumble +
>   slow low-mid "stone cog", 9 teeth vs the gear's 26). The engine tags
>   `onSpeed(speed, source)`; Hero routes `'bezel' → grind`, `'needle' → watch`,
>   each silencing the other. `grind` level follows the same hero scroll fade.
>
> **Iteration 2 — fixes + polish from first real-device test:**
> - **Bug (drag dropped / needle stayed locked / only worked at the right edge):**
>   move/up listeners were on the *canvas*, so a pointer that left the small box
>   lost events and the `pointerup` (→ `dragging=false`) was missed. Now the down
>   handler attaches **window-level** `pointermove`/`pointerup`/`pointercancel`
>   for the drag's duration and removes them on release.
> - **Bug (text selection while turning):** drag sets `document.body.style.user
>   Select='none'` (+ webkit) and `preventDefault()`s the pointerdown; restored on
>   release + in `destroy()`.
> - **Live "time-travel" crossfade (was: nothing visible until release, then a
>   hard swap):** the sky now commits **live per detent** during the drag, not on
>   release. This required the instrument to **stop remounting on theme change** —
>   `mountAstrolabe` now exposes `refresh()` (re-reads CSS tokens in place) and
>   `useAstrolabe` mounts once + calls `refresh()` on `skyKey` change, so a base
>   flip mid-drag no longer tears down the drag. The page cross-dissolves via the
>   existing token transitions; Hero additionally captures the **outgoing
>   `--hero-backdrop` gradient** and fades it out over the new one (an
>   `AnimatePresence` ghost layer) so the hero sky itself cross-dissolves
>   (gradients can't CSS-transition).
> - **Discoverability:** on hover over the bezel annulus the engine draws two
>   clockwise rotation arrows + a faint rim glow (`affordA`, eased) and sets a
>   `grab` cursor; a one-time **first-visit invite pulse** (sessionStorage-gated,
>   ~3.4s after assembly) plays the same affordance so the ring reads as a dial.
> - **Sparks:** velocity-driven embers thrown off the rim while turning — pooled
>   (≤80), additive, real-ish physics (tangential launch + gravity + air drag +
>   fade). Emitted in the move handler, integrated/culled in the loop.
> - **Grind sound:** reuses the existing `watch` gear bed — the bezel's angular
>   speed feeds `onSpeed → sound.watch.setSpeed`, so the gear/grind winds with the
>   turn and is silent at rest (no net-new timbre; dilution rule). Detent ticks
>   per stop via `sound.playCue('detent')`.
> - **Note:** the bezel tick pattern has a 30°/5° period, so the *resting* ring
>   looks identical at every stop; the live turn + sparks + crossfade + detent are
>   the feedback, so no separate "you-are-here" marker is needed.

**Concept.** Tie the site's best interaction to its best system. Today the needle
*follows* the cursor and can be flicked into a free spin. Add a second affordance:
**grabbing the outer degree bezel and rotating it scrubs the sky** through
`dawn → day → dusk → night`, with a soft **detent at each of the four stops** and
the existing `watch` gear bed winding with the drag. Releasing commits that sky
via `useThemeStore.setMode`. The instrument becomes a real instrument: you *set
the sky* by turning the dial.

**Why it passes the four-part test:** tactile (drag the ring), resists (angular
drag distance per stop + detent snap), intent (you grabbed the bezel), one gesture
(gear sound = the turn; detent = the stop).

### Files

- `src/lib/astrolabe.js` — add a drag handler on the bezel annulus; expose a new
  control `setSkyCommit(cb)` / report hovered-stop in the returned object; emit
  `onDetent(skyIndex)` callbacks. **No React in this file** — keep it a callback
  surface, mirror the existing `onSpeed` pattern.
- `src/hooks/useAstrolabe.js` — thread the new callbacks through (extend the
  signature; keep existing args positional-compatible or move to an opts object —
  see Decision D1).
- `src/sections/Hero.jsx` — wire the bezel-commit callback to `setMode`, fire
  `playCue('detent')` per stop crossed, `track('astrolabe_sky_set', { sky })`.
- (No new CSS tokens; bezel hit area is inside the existing canvas box.)

### Interaction model

- **Hit test:** the bezel is the annulus between `R*0.92` and `R*1.06` (the degree
  ticks live at `R`). A `pointerdown` whose radius from centre falls in that band
  starts a *bezel drag* (distinct from the needle-follow, which is driven by
  `mouse` tracking and the free-spin flick). While bezel-dragging, suppress
  needle-follow.
- **Mapping:** accumulate angular delta; every `90°` of rotation advances one stop
  in `SKY_ORDER` (4 stops around the dial). At each stop boundary fire
  `playCue('detent')` and a faint magnetic snap (ease the bezel toward the stop
  angle). The `watch` bed already follows `onSpeed`, so the turn is audible.
- **Commit:** on `pointerup`, snap to the nearest stop and call back with that
  sky; Hero calls `setMode(sky)`. Because `setMode` re-resolves theme and the
  hook re-mounts the astrolabe on `themeKey` change, the instrument re-reads
  tokens automatically (existing behaviour) — **guard against a re-mount mid-drag**
  by committing only on pointer-up.
- **Touch:** a horizontal drag across the instrument box maps to the same stop
  advance (coarse pointers already aim the needle by tap; bezel-scrub is a
  secondary, drag-distance gesture). Keep it forgiving (larger per-stop delta).

### Accessibility / guards

- Reduced motion: feature **off** (the loop runs once, holds the needle; no drag).
  Sky still settable via the existing `SkyControl` menu — do not regress that.
- `isOverlayOpen()` already makes the instrument dormant; bezel-drag must also
  no-op while an overlay is open.
- Do not hijack page scroll: only capture pointer when the down-event lands in the
  bezel annulus; otherwise let it pass (the box is `pointer-events-none` today on
  the wrap — you will need a `pointer-events-auto` hit layer **only** over the
  annulus, not the whole box, so it never blocks the hero copy/CTAs).

### Acceptance criteria

- Dragging the bezel ~90° advances exactly one sky stop with one `detent` tick;
  release commits it and the whole site re-themes (all four skies reachable).
- Gear (`watch`) bed winds with the drag and is silent at rest.
- Needle-follow and free-spin still work unchanged; `SkyControl` still works.
- No scroll capture; hero CTAs remain clickable. Reduced-motion + overlay-open
  both no-op. Build clean.

### Open decisions

- **D1:** refactor `useAstrolabe` to an options object vs. append positional args.
  *Recommendation:* options object `{ onSpeed, onDetent, onSkyCommit, controlsRef }`
  — the positional list is already at its limit.
- **D2:** should bezel-scrub leave `auto` mode permanently (like `toggleTheme`
  does) or offer a "back to auto" affordance? *Recommendation:* commit to manual
  (consistent with `setMode`), since the visitor just expressed an explicit choice.

---

## TM-2 — Velocity-reactive chapter headings · Tier 1 (silent)

**Concept.** Steal Unseen-Studio kinetic type: in `ChapterHeading`, on fast scroll
the title letters skew/disperse slightly along the scroll axis and settle when the
scroll velocity drops. One subtle rule on the header that appears on every section
→ site-wide cohesion, **no new sound**, no per-section work.

**Why it passes:** it's the one motion-reactive effect we allow because it is
*reactive to the visitor's own scroll velocity* (their gesture), tiny, and silent
— it reads as physical inertia of the type, not decoration.

### Files

- `src/components/ChapterHeading.jsx` — the only file. It is used by every section
  via `<ChapterHeading no eyebrow title />`.

### Implementation

- Read scroll velocity from GSAP `ScrollTrigger.getVelocity()` (already a project
  dependency; ScrollTrigger is registered in sections) **or** a lightweight
  `wheel`/scroll-delta sampler. Map `|velocity|` → a clamped `skewY` (≤ ~6°) and a
  small per-letter `y` offset that eases back to 0 with a spring when velocity → 0.
- Split the title into letters (wrap each in a span) **once**; animate only
  `transform`. Respect the existing entrance animation (the `whileInView` y/opacity
  reveal must still play first; velocity-skew is a steady-state behaviour after
  reveal).
- Keep it cheap: a single rAF gated to when the heading is in the viewport
  (`IntersectionObserver`), parked when off-screen.

### Accessibility / guards

- Reduced motion → no split, no rAF; render the plain heading exactly as today.
- Cap the skew so AA legibility/contrast is never harmed mid-motion; letters must
  remain readable at peak velocity.

### Acceptance criteria

- Fast flick-scroll visibly skews/disperses the active heading; it settles crisp
  within ~300ms of scroll stop. Slow scroll = imperceptible. Reduced motion =
  identical to current. No layout shift (the heading box must not reflow — skew
  via transform only). Works on all six section headings + Atelier.

---

## TM-3 — Contextual character cursor · Tier 1 (silent)

**Concept.** `Cursor.jsx` already has dot + ring + backlight and grows over
interactives. Make it a *character* with **contextual states** keyed by what it is
over: a **grab ring** over the astrolabe bezel/needle, a **crosshair** over the
map (⌘K `MapOverlay`), a **quill-dot** in the Contact form, the existing
hover-grow over generic interactives. Pure reuse of owned infrastructure; reads as
craft instantly. **No new sound.**

### Files

- `src/components/Cursor.jsx` — extend `onOver` to branch on a
  `data-cursor="<state>"` attribute (today only `"hover"` exists). Add states:
  `grab`, `crosshair`, `quill` (+ keep default + `hover`).
- `src/index.css` — add the variant visuals as CSS driven by a class/variable the
  cursor sets (e.g. `--cursor-state`); **theme-token colors only**.
- Consumers add `data-cursor="grab"` etc.: the astrolabe hit layer (TM-1),
  `MapOverlay.jsx`, the Contact form fields in `sections/Contact.jsx`.

### Implementation

- In `onOver`, resolve the nearest `[data-cursor]` ancestor and read its value;
  set a single source-of-truth attribute/var on the cursor root (e.g.
  `ring.dataset.state = state`). Drive all visual differences from CSS so the rAF
  loop stays a transform-only writer (no per-state branching in JS hot path).
- Keep the existing robustness (any move re-reveals; never stuck hidden) and the
  press scale (`--press`).

### Accessibility / guards

- Entire feature already gated behind `(hover: none)` early-return — untouched.
- Reduced motion path (no ring lerp) must still get the contextual *color/shape*,
  just without the smoothing.
- Cursor is decorative; never the only affordance — all targets keep their real
  hover/focus styles. Keyboard focus is unaffected.

### Acceptance criteria

- Cursor visibly changes state over: an interactive (grow, today), the astrolabe
  (grab), the map overlay (crosshair), a Contact field (quill). States revert on
  leave; never stuck. Touch unaffected (no cursor). Build clean.

---

## TM-7 — Voice-aware glyph ramp on FaceParticles · Tier 1

> This is the recommended answer to the original "PNG-per-voice portrait" idea.
> **Keep the portrait fixed (it's Manan); make the *medium* voice-aware, not the
> *subject*.** No PNGs, no copyright/likeness risk, on-brand, and a genuine
> "wait—is it made of…?" easter egg.

**Concept.** `FaceParticles` builds the portrait from the `RAMP` glyph ladder.
Make that ladder **voice-thematic**: Chronicle uses runic/astral marks, `dwight`
assembles the face from `beets`/`bears`/`facts` micro-glyphs, `cow` from `m·o·o`,
`plain` stays clean ASCII. Same portrait, same tonal modelling — *what it's made
of* shifts with who narrates.

### Files

- `src/components/FaceParticles.jsx` — make `RAMP` (and the sprite atlas) a
  function of the active voice. The component already reads CSS tokens for color;
  add the active i18n language (`useTranslation().i18n.language` or the voice
  store) and pick a ramp from a small registry.
- `src/i18n/voices.js` — add an optional `ramp` field per voice (array of glyphs
  light→dark, or a short token the component maps to a ramp). Default → current
  `RAMP`. This keeps glyph data **with the voice registry** (the existing
  `glyph` monogram lives here too).

### Implementation

- The tonal mapping is **by darkness index into the ramp** (existing code:
  `RAMP[clamp((d*(RAMP.length-1))|0, …)]`). Any replacement ramp must stay ordered
  **light→dark by ink coverage** so modelling survives. Validate each voice ramp
  has ≥ 6 steps; fall back to the default ramp if malformed (resilience rule).
- The sprite atlas is keyed `${char}|${color}` and built lazily — switching voices
  rebuilds only the glyphs actually used; the assembly is assembly-only then stops,
  so cost is bounded. **Re-trace on voice change** only if the portrait is on
  screen (reuse the existing IntersectionObserver gate); otherwise let it pick up
  the new ramp on next assembly.
- Do **not** add per-voice sound here (assembly already has `assembleSwell` /
  `assembleResolve`). Dilution rule.

### Accessibility / guards

- `aria-hidden` already set — decorative. Reduced motion → static pre-formed
  portrait, still uses the active voice's ramp (no animation).
- Multi-character glyphs (`beets`) must render within the `SPRITE` raster — use
  single grapheme marks, or shrink font for short words; verify no clipping.

### Acceptance criteria

- Switching voice (UI or easter-egg unlock) visibly changes the glyph *material*
  of the Atelier portrait; the face stays recognizable and tonally modelled. Each
  of `chronicle`/`plain`/`scott`/`dwight`/`cow` has a defined ramp (or explicit
  fallback). No perf regression (still assembly-only → stop). Build clean.

### Open decision

- **D3:** retrace-on-switch vs. only-on-next-view. *Recommendation:* retrace only
  if currently on screen + not reduced motion; it's a delightful live moment when
  the Atelier is open, and free otherwise.

---

## TM-4 — Arsenal "pluck the orbit" · Tier 2 (pick one of TM-4/5/6)

**Concept.** The orbital skill field (`sections/Tech.jsx`, `arsenal`) already has
the `blip` hover pluck. Go one step: **click/drag a skill node to swing it on its
orbit** with spring-back, pitched by orbital radius (reuse the `hoverNote`/`blip`
pitch-by-index mapping). A hover becomes a *played string*.

### Files

- `src/sections/Tech.jsx` — node pointer handlers (down → capture, move → swing
  angle with damping, up → Framer spring back). Pitch the release via
  `playCue('blip', { step })` keyed to the node's ring/index (existing API).

### Guards / acceptance

- Reduced motion → nodes static, hover pluck only (today's behaviour). Coarse
  pointer → tap-to-pluck (no drag-swing). Spring uses transform only.
- AC: dragging a node displaces it along its orbit and it springs back with one
  pitched pluck on release; no two adjacent plucks collide into noise (reuse the
  pentatonic spacing). No layout thrash.

---

## TM-5 — Mobile device-tilt parallax · Tier 2 (pick one)

**Concept.** The site correctly kills *mouse*-parallax on touch — but most traffic
is mobile, where `deviceorientation` is the equivalent. Give the Hero starfield +
realm plates gentle gyro depth: a "whoa" desktop visitors never see.

### Files

- New `src/hooks/useDeviceTilt.js` — subscribe to `deviceorientation`
  (`beta`/`gamma`), low-pass, output normalized `[-1,1]` tilt; clean up listener.
  iOS 13+ requires `DeviceOrientationEvent.requestPermission()` on a user gesture —
  gate behind a one-time tap (reuse the audio-unlock gesture or a subtle prompt).
- Consume in `sections/Hero.jsx` (starfield layers) and `sections/Works.jsx`
  (plate parallax) — transform/opacity only.

### Guards / acceptance

- Only active on coarse pointers with the sensor present + permission granted;
  desktop unaffected. Reduced motion → off. Magnitude tiny (≤ a few px / deg).
- AC: tilting the phone shifts depth layers smoothly; no permission = graceful
  no-op (no error, no broken layout). Listener removed on unmount.

---

## TM-6 — Contact "seal & release the raven" · Tier 2 (pick one)

**Concept.** You already have `raven.mp3` + `RavenBurst` + the raven send metaphor.
Make *sending* physical: **press-and-hold the submit button to "seal the letter"**
— a wax-seal fill animates under the press, a `detent` ticks at the seal, and
release launches the raven (existing `RavenBurst` + `playCue('raven')`). Rewards a
deliberate gesture; literalizes the metaphor.

### Files

- `src/sections/Contact.jsx` — replace the plain submit with a hold-to-seal
  control (pointerdown starts a ~600–800ms fill; pointerup before complete cancels;
  complete → submit). Drive the wax fill with transform/opacity. Keep a fully
  keyboard-accessible fallback: **Enter/Space submits immediately** (no hold
  required) — the hold is a pointer enhancement, never the only path.

### Guards / acceptance

- Reduced motion → ordinary instant submit button (no hold, no fill). The form's
  existing validation + `error` cue path unchanged. Hold must not block form
  validation errors.
- AC: holding fills the seal and (on complete) sends with the raven; keyboard
  submit still works instantly; canceling the hold sends nothing. A11y: button has
  `aria-label`, focus ring, and announces nothing misleading.

---

## TM-8 — FaceParticles engine reuse · Tier 3 (later)

**Concept.** The real value of `FaceParticles` is a general primitive: *assemble an
image from intent-revealed glyphs, with a magic-lantern hover lens*. Reuse the
**engine** (not the face) in:

- **Realm covers (`sections/Works.jsx`)** — project plates assemble from glyphs on
  enter; the existing lens reveals the real screenshot on hover. (Best home for the
  lens — it's already written.)
- **A 404 / "lost realm" route** — a map/face that never fully forms.
- **Expedition recap sigil** (`ExpeditionRecap` + `src/lib/sigil.js`) — the
  device-hash sigil assembling via the same engine ties the page's open and close.

### Work required

- Generalize `FaceParticles` into a reusable `GlyphAssembly` (props: `src`,
  `ramp`, `lens?`, `onResolve?`), keep `FaceParticles` as a thin wrapper for the
  portrait. Preserve the performance contract (single sample, sprite atlas,
  assembly-only rAF then STOP, lens only on fine pointers, reduced-motion static).
- AC: each new mount is bounded-cost (no perpetual loop), degrades to empty space
  on a missing/erroring source (existing `img.onerror` behaviour), reduced-motion
  static.

---

## TM-9 — Per-voice monogram mark in Voice Hall · Tier 3 (later)

**Concept.** If you want per-voice *character presence*, do it as a small
serif **monogram/silhouette** — **not** a photoreal face. The registry already
carries `glyph` per voice (`voices.js`). Surface it larger on the Voice Hall card
(`VoiceHall.jsx`) and recap constellation. Safe, scalable, copyright-free, and it
lives on the surface that is actually *about* the voices.

### Work required

- `VoiceHall.jsx` — render `voice.glyph` as a prominent monogram on each card;
  optional subtle hover lift. No new assets. AC: every voice shows its monogram;
  no emoji (design-system rule); theme-token colors only.

---

## 6. i18n requirement (applies to TM-1, TM-6, and any visible copy)

Per CLAUDE.md §4.2, **every new visible string ships in EVERY voice** —
`src/i18n/bundles/{chronicle,plain,scott,dwight,cow}.*`. i18next **replaces**
(not deep-merges) array keys, so any voice overriding an array (e.g. `points`)
must include new entries explicitly. New copy candidates in this phase:

- **TM-1:** an optional ⓘ hint / aria-label for the bezel ("turn to set the sky").
  `chronicle` voiced, `plain` literal, easter-egg voices in character.
- **TM-6:** the hold-to-send button label + the "hold to seal" hint + completion
  microcopy, in all five voices.
- **TM-7 / TM-9:** no user-facing copy (glyph data is non-copy, lives in
  `voices.js`).

Structural (non-copy) data — ramps, hit-test radii, stop counts, tilt magnitudes —
lives in `src/constants/` or the relevant lib/registry, **never** as display
strings.

---

## 7. Cross-session working agreement

- **Reference features by ID** (`TM-1` … `TM-9`) in every chat so context survives
  summarization.
- **Build one TM at a time**, verify visually (dev server, dark+light screenshots
  at 360/768/1280/1920), `npm run build` clean, *then* move on (CLAUDE.md §5
  cadence).
- **When a TM ships, update this doc** (flip its status, record locked decisions
  in the feature's "Open decisions" block) and add a pointer row in CLAUDE.md §6
  and [LEGENDARY-ROADMAP.md](LEGENDARY-ROADMAP.md) "At a glance". Docs and code
  never diverge.
- **Respect the dilution rule.** If a TM starts feeling like ambient decoration
  rather than a rewarded intent, stop and re-read §0.
```
