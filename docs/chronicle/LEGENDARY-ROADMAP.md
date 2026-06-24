# LEGENDARY-ROADMAP — From great to legendary

> Tracking doc for the next wave of "wonder" features. Captures the **decision,
> rationale, and task checklist** for each so we don't lose context between
> sessions. Open questions are now **resolved** (see "Decisions (locked)").
> This is a *planning* doc — when a feature is built, its canon (tokens,
> constants shape, component APIs) must also land in the relevant
> `docs/chronicle/` doc per CLAUDE.md §5.
>
> Status legend: 🟢 building · 🟡 specced, not started · 🔵 explore (uncertain) ·
> ✅ done · ⏸️ parked

---

## At a glance

| Phase | Feature | Status | Impact | Effort | Risk |
|---|---|---|---|---|---|
| 1 | **Voice switcher** (i18next: chronicle + plain, visible menu, sealed-voice teasers) | ✅ | 9 | 6 | low |
| 2 | **Marginalia** (flavor ↔ substance footnotes) | ✅ | 8 | 4 | low |
| 3 | **Time-aware real sky** (5 theme modes: auto + 4 palettes) | ✅ | 8 | 5 | low |
| 4 | **Interactive sound design** (Web Audio synth + raven sample) | 🟡 | 7 | 6 | med |
| 5 | **Expedition recap** (client-side session send-off) | 🟡 | 6 | 4 | low |
| 1b | **Voice easter eggs** (scott / dwight / cow + unlock system) | ✅ | 6 | 4 | low |
| 6 | **Lantern cursor** (invisible-ink reveal; can host a voice-unlock) | 🔵 | 8 | 6 | med |

**Guiding principle:** every feature must either *serve a skeptical/impatient
visitor* or be a *tasteful signature moment*. Never decoration for its own sake.
Content stays the focus. Ship one phase at a time, verify all themes,
reduced-motion + touch, `npm run build` clean, then move on.

---

## 1. Voice switcher — multi-personality content  · Phase 1 · ✅ SHIPPED

> **Shipped.** i18next layer (`src/i18n/*`), `useVoiceStore`, the bottom-right
> `ControlCluster` + `VoiceSwitcher` (vertical-up menu, `Sealed Voices · 0/3`
> teasers), and full `chronicle` + `plain` bundles. All sections/components read
> copy via `t()`; constants hold non-copy data only. Verified: build + lint
> clean, chronicle↔plain flips the whole site, dark + light correct, choice
> persists. Remaining: **Phase 1b** (author the sealed personality bundles +
> wire the unlock triggers).

**What:** A visible "Voice" control that re-skins all site copy through a chosen
register. Two serious voices ship first; playful personalities unlock as easter
eggs (Phase 1b).

**Voices**
- `chronicle` *(default)* — current cinematic in-world voice.
- `plain` — straight professional portfolio ("Dispatch the Raven" → "Send
  message"). **De-risks the whole fantasy concept for hurried recruiters.**
- `scott` / `dwight` / `cow` — **easter-egg personalities** (Phase 1b),
  lazy-loaded, unlocked by discovery.
- **Adding a personality = adding one resource bundle.** No component changes.

**Tech: `i18next` + `react-i18next`.** Each voice = a "language" code; each
section = a namespace; interpolation for `{{email}}`; `returnObjects` for the
raven-error arrays; **lazy-loaded bundles** so easter-egg voices don't touch
initial JS.

### Decisions (locked)
- **Placement & layout:** a new **bottom-right control cluster** = a fixed flex
  row holding **[Voice switcher] [Audio control]** (voice left, audio right).
  Theme toggle stays **top-right** untouched. Audio expands on hover (width
  animation) and pushes the voice button left smoothly within the flex flow.
- **Voice menu shape:** voice button is **click/tap-to-toggle** (not hover — menus
  must work on touch); its panel **expands vertically upward** so it never
  collides with the audio control to its right. Rows = voice name + a one-line
  sample of that voice; active row carries the ember accent. Below a divider:
  `Sealed Voices · n/3` with locked rows (lock glyph + cryptic hint on
  hover/focus). Glyph for the collapsed button: a quill/`Feather`.
- **Copy split:** copy → i18n bundles; **non-copy data stays in constants**
  (links, map `x/y`, icon keys, chapter `no`/`id`).
- **Default voice:** always `chronicle` for first-time visitors; persisted choice
  restored on return.

**Tasks**
- [x] Add `i18next`, `react-i18next` (+ code-split via dynamic import).
- [x] Define resource-bundle schema (section-grouped nested keys) + migrate copy.
- [x] `useVoice` store (current voice + persisted unlocked set).
- [x] Author `chronicle` + `plain` bundles (full coverage, every section).
- [x] Bottom-right **control cluster** scaffold (voice + reserved audio slot).
- [x] Voice menu UI: vertical-up panel, active accent, `Sealed Voices` teasers.
- [x] **Canon update:** CLAUDE.md §2/§3/§4.2 (copy now lives in i18n).

---

## 1b. Voice easter eggs — personalities + unlock system  · Phase 1b · ✅ SHIPPED

> **Shipped.** Three lazy-loaded personality bundles — `scott` (World's Best
> Boss), `dwight` (Assistant (to the) Manager), `cow` (Moo) — plus the
> `EasterEggListener`: type a secret word anywhere (not in form fields) to
> unlock + auto-switch to that voice, with a toast that hints toward the next
> sealed voice. Locked menu rows show each voice's cryptic `hint`; unlocks
> persist. Triggers: `boss` → Scott, `beets` → Dwight, `moo` → Cow. Verified via
> CDP: each trigger unlocks + switches + persists; chaining ends at `3/3
> discovered`; bundles ship as separate chunks (out of initial JS).

**Discoverability — *signal existence, hide the trigger*** (solves "99% skip it"):
the `Sealed Voices · n/3` teaser advertises the game; each locked row shows a
solvable cryptic clue; unlocking one toasts the next clue; unlocks persist.

### Decisions (locked)
- Triggers = **typed secret words** (simple, reliable, touch-agnostic via the
  cryptic hints). The Lantern (#6), if built, can become an *additional* trigger
  carrier — never a hard dependency.

**Tasks**
- [x] Pluggable easter-egg trigger system → unlocks a voice (`EasterEggListener`).
- [x] Author `scott` / `dwight` / `cow` bundles (lazy-loaded / code-split).
- [x] Unlock toast + hint-toward-next-voice on discovery; locked rows show hints.

---

## 2. Marginalia — flavor meets substance  · Phase 2 · ✅ SHIPPED

> **Shipped.** `Marginalia` + `Annotated` (`src/components/Marginalia.jsx`,
> barrel-exported) render a flavor phrase with a dotted underline + a superscript
> dagger (†); hover/focus/tap unfolds a margin note with the real engineering
> fact. **Authoring convention:** wrap the phrase inline in any voice string with
> the marker `[[id|phrase]]`, then render that string through `<Annotated
> text={t('…')} />`; strings without a marker pass through untouched (safe
> everywhere / every voice). The facts are **plain substance**, authored once
> under `marginalia.<id>` in the `chronicle` bundle (no per-voice overrides — the
> personality bundles fall back to them). After a review pass the set was trimmed
> to **5 high-value notes**: About (`endToEnd`, `measured`), Works (`nda`,
> `regionSvg`), and the Contact submit button (`raven`). (Dropped as low-signal /
> redundant: `greenfield`, `sixDomains`, `secure`, `stack`.) **The `[[id|…]]`
> markers are authored into every voice whose copy has the equivalent flavor
> phrase** — `plain`, `scott`, `dwight` (each wrapping its own wording; the note
> text stays the shared chronicle fact). `cow` is all "moo" so it carries none;
> `dwight`'s one-word "Transmit" submit label is skipped for `raven` (the trigger
> swallows the click, so a button label needs a second word left to submit).
> Note: the id pattern is `[a-zA-Z0-9-]+` — camelCase ids like `endToEnd` must
> not be lowercased away. CSS: `.marginalia*`
> in `index.css`. The note renders through a **portal to `<body>`** (fixed
> position from the trigger's rect) so an `overflow:hidden` ancestor — e.g. the
> submit button's shine mask — can't clip it. The inline trigger stops
> click/Enter propagation so revealing the raven note never also submits the
> form. Verified: lint + build clean.

**What:** Hover/tap a flavor phrase → a handwritten footnote unfolds with the
real engineering fact behind it. Makes the fantasy **earn its keep**. Reuses the
Phase 1 i18n layer.

### Decisions (locked)
- **Phrase selection:** kickoff task is to **scan the constants/i18n copy and
  produce a candidate phrase list**; Manan filters it down to ~6–10 high-signal
  ones (don't over-annotate). *(Resolved: trimmed to 5 after a review pass —
  endToEnd, measured, nda, regionSvg, raven.)*
- **Visual:** subtle **dotted underline + small rune** trigger. *(rune = `†`.)*
- Touch = tap popover (not hover); a11y: focusable, `aria-describedby`.
- **Footnote voice:** plain facts in **every** voice — the note IS the substance
  layer, so it deliberately drops the persona (authored once in `chronicle`).

**Tasks**
- [x] Generate candidate phrase list from copy → Manan filters.
- [x] `Marginalia` component (hover popover + tap, focusable, `aria-describedby`).
- [x] Author footnote content (real facts) in i18n (`marginalia.<id>`, chronicle).
- [x] Place across About / Tech / Works (+ Contact submit, the bonus 9th).

---

## 3. Time-aware real sky — 5 theme modes (auto + 4 palettes)  · Phase 3 · ✅ SHIPPED

> **Shipped.** `src/lib/sky.js` (SunCalc + timezone→coords, no geolocation
> prompt) resolves the visitor's real local sky; `useThemeStore` is now a **5-mode
> sky** (`auto` default + `dawn`/`day`/`dusk`/`night`), `resolvedTheme`
> (light/dark) kept as a derived alias so every `isDark` consumer is untouched.
> `dawn`/`dusk` are warm token tints layered on the light/dark base via
> `[data-sky]` (text tokens inherited → AA preserved); the hero backdrop/scrim are
> now token-driven (`--hero-backdrop` / `--hero-scrim-rgb`). New **`SkyControl`**
> (top-right) wraps the unchanged sun/moon `DayNightToggle` with a 5-row mode menu
> whose trigger pill doubles as a live sky chip. Copy under the i18n `sky.*` keys.
> Verified via CDP screenshots: all 5 modes correct in light/dark, `auto` resolves
> from real local time, menu correct, `npm run build` + lint clean.
>
> **Scope trim (locked):** the **"how did he know this?!" status line** (region +
> moon phase) was built, reviewed, then **cut** — Manan kept only the time-driven
> 5-mode theme + `SkyControl` + dawn/dusk palettes. So `sky.js` is just the
> time→sky resolver (no moon-phase / status helpers).
>
> **Astrolabe decision (locked): keep the abstract instrument.** The visual spike
> (current vs. moon-phase+luminary vs. real-constellations — prototyped and
> screenshotted) was reviewed; Manan chose to **leave the astrolabe as the abstract
> seeded field**. The time-aware *palette* carries the wonder; the instrument stays
> intentionally non-literal. (So: no astrolabe code change.)

**What:** On load, pick the theme from the **visitor's local time** (5 modes:
`auto` + dawn/day/dusk/night). Manual choice overrides; missing time/location →
fallback to clock hours.

**Themes: expand 2 → 4 palettes** (`dawn`, `day`, `dusk`, `night`) + an `auto`
mode = **5 selectable modes**. New `dawn`/`dusk` tokens in `index.css` (AA).
Theme store becomes mode-driven (was binary).

**Real sky without sensors (pure math):** `SunCalc` (~1.5KB) from date/time +
rough lat/long; location derived from **browser timezone** (no permission
prompt). Moon phase needs date only.

### Decisions (locked)
- **Theme UI:** **keep the existing top-right sun/moon button exactly as-is** as
  the primary toggle. Add a better UI around it that accommodates all **5 modes**
  (Auto / Dawn / Day / Dusk / Night). `auto` is the default, time-driven.
- **"How did he know this?!" status line:** ~~surface a subtle timezone + date +
  moon-phase detail near the bearing readout~~ — **built then cut.** Manan kept
  only the time-driven 5-mode theme; the hero bearing area is unchanged.
- **Persistence:** `auto` by default (time-based); once the user picks a mode it
  sticks, with a clear way back to `auto`.
- **Astrolabe literalness — RESOLVED.** The spike shipped: (a) current hero, (b) a
  moon-phase + luminary prototype, (c) a real-constellations prototype, all
  screenshotted for comparison. **Manan picked (a) — keep the abstract
  instrument.** The astrolabe is left unchanged; the time-aware palette + status
  line carry the wonder.

**Tasks**
- [x] **Spike:** screenshot current hero + prototype moon & constellation
      variants → Manan decided: **keep the abstract astrolabe** (no change).
- [x] Add `dawn` + `dusk` token sets to `index.css` (AA-checked, `[data-sky]`).
- [x] Refactor theme store → 5 modes (`auto`+4) + persistence + fallback.
- [x] Add `suncalc`; time→sky resolver + timezone→lat/long (`src/lib/sky.js`).
- [x] ~~Astrolabe: render real-sky variant~~ → **rejected by the spike; instrument
      stays abstract.**
- [x] Theme UI around the existing sun/moon button (5 modes, `SkyControl`).
- [x] ~~Hero "how did he know this?!" status line~~ → **built then cut** (Manan
      kept only the theme feature).
- [x] **Canon update:** DESIGN-SYSTEM (4 palettes + sky modes), 00-hero (token
      backdrop, locked astrolabe decision).

---

## 4. Interactive sound design system  · Phase 4 · 🟡

**What:** Evolve the existing `MusicPlayer` into a *sound design system* of
sparse, intentional cues. **Sound rewards intent, never accompanies motion.**
Upgrades the audio slot created in the Phase 1 control cluster.

**Cue list (approved)**
- Astrolabe **mechanical hum** — plays in the hero, **fades out as you scroll
  past** (natural distance falloff).
- **Raven flight** on contact send.
- **Theme toggle** — swoosh / wipe.
- **Voice toggle** — a distinct chime (different from theme; should *feel* like a
  voice switching).
- **Arsenal** orbit space-drone + hover blips.
- **Map** open / close whoosh.
- ❌ **No scroll/page-flip sound.**

**Tech: Web Audio synthesis (hybrid).** Abstract cues synthesized (Oscillator +
Gain/ADSR + Biquad + noise), 0 bytes; **one mp3 sample for the organic raven**.
One shared `AudioContext`, unlocked on first gesture.

### Decisions (locked)
- **No ambient background-music bed for now** (would fight the cue system); the
  astrolabe hum is the only "bed", and it's hero-local + scroll-fading.
- **Default on**, but silent until first gesture (browser law); **auto-mute under
  `prefers-reduced-motion`**; preference persisted.
- **Hover note** on the audio control: *"Turn on sound for a more immersive
  experience"* — shown only while inactive, **auto-dismiss ~10s**, dismissed
  permanently once the user engages.
- **Raven sample:** wire an mp3 path now; **Manan will generate + drop the file**.
  Degrade gracefully if absent.
- One sound control (volume + mute) — the audio half of the cluster.

**Tasks**
- [ ] `src/lib/sound.js` — shared context, gesture-unlock, ADSR helper.
- [ ] Synthesize each abstract cue; tune to taste.
- [ ] Raven mp3 loader (graceful if absent).
- [ ] Wire cues: Hero (hum+fade) / Tech / Contact / theme toggle / voice toggle /
      MapOverlay.
- [ ] Upgrade the cluster's audio control → master sound + hover-note (10s auto).
- [ ] Respect `prefers-reduced-motion` (default mute) + persist.

---

## 5. Expedition recap — personalized send-off  · Phase 5 · 🟡

**What:** A small "Your expedition" card near contact: chapters charted, scroll
distance, time spent, theme(s) used, realms opened. Computed **client-side,
in-session** (no analytics infra needed; Vercel Analytics is aggregate/server
only).

### Decisions (locked)
- **Presentation:** subtle, **auto-present near contact**.
- **Voice-egg tie-in:** **explore** — the recap can hint at undiscovered voices
  (e.g. "1 of 3 sealed voices remain…"), reinforcing Phase 1b discovery.

**Tasks**
- [ ] `useExpedition` hook — track chapters/scroll/time/theme/realms in session.
- [ ] Recap card UI in Contact section.
- [ ] (explore) sealed-voice hint integrated into the recap.

---

## 6. Lantern cursor — invisible-ink reveal  · explore · 🔵

In night mode the cursor becomes a lantern; *bonus* marginalia / a hidden map
route / an easter-egg rune is invisible ink revealed only within the glow.

**Concerns (both solved by design):** overlay is `pointer-events: none` (never
blocks clicks; only *bonus* content gated); driven by CSS custom props
(`--lx/--ly`) via rAF-throttled mousemove → radial mask (GPU-cheap, no
re-renders). Disabled on touch/coarse-pointer/reduced-motion. **Scoped to one
zone**, not global.

**Decision:** parked until Phases 1–5 land; revisit as a carrier for a Voice
easter-egg trigger.

---

## Execution plan

Build order (dependency-aware): **1 → 2 → 3 → 4 → 5 → 1b → (6 explore)**.
Voice (1) ships the i18n layer (2 reuses it) and the bottom-right control cluster
(4 upgrades it). Each phase ends with: all theme modes correct, reduced-motion +
touch correct, no console errors, `npm run build` clean, screenshots reviewed.

### Phase 1 — Voice switcher (core)
1. Install `i18next` + `react-i18next` + lazy backend.
2. Design bundle schema (namespace per section); migrate all copy from
   `src/constants/index.js` into `chronicle` + `plain` bundles; keep non-copy
   data in constants.
3. `useVoice` store (+ persisted unlocked set, scaffolded for 1b).
4. Build the bottom-right **control cluster** (voice button + placeholder audio
   slot) and the vertical-up voice menu with `Sealed Voices` teasers.
5. Swap every section/component to read copy via `useTranslation`.
6. Update CLAUDE.md + DESIGN-SYSTEM canon.
- **Acceptance:** flipping chronicle↔plain re-skins the entire site; refresh
  remembers choice; no hardcoded strings remain; build clean.
- **Needs from Manan:** sign-off on the `plain` voice wording pass.

### Phase 2 — Marginalia
1. Scan copy → **deliver candidate phrase list**; Manan filters to ~6–10.
2. Author real-fact footnotes in i18n.
3. Build `Marginalia` component (dotted underline + rune; hover popover + tap;
   a11y).
4. Place across About / Tech / Works.
- **Needs from Manan:** filtered phrase list + the real facts behind them.

### Phase 3 — Time-aware sky ✅
1. ~~Spike~~ done → **Manan kept the abstract astrolabe** (no instrument change).
2. ~~Add `dawn`/`dusk` tokens; refactor theme store → 5 modes + persistence.~~ ✅
3. ~~Add `suncalc`; time→sky + timezone→lat/long; the "how did he know this?!"
   status line.~~ ✅
4. ~~Build the 5-mode theme UI (`SkyControl`) around the existing sun/moon
   button.~~ ✅ (astrolabe variant dropped per the spike)
5. ~~Update DESIGN-SYSTEM + 00-hero canon.~~ ✅

### Phase 4 — Sound design
1. `src/lib/sound.js` (shared context, gesture unlock, ADSR).
2. Synthesize cues; wire raven mp3 loader.
3. Wire cues into sections + theme/voice toggles; hero hum with scroll-fade.
4. Upgrade the cluster's audio control (master sound + hover-note + reduced-
   motion default-mute).
- **Needs from Manan:** the raven `.mp3` file dropped into the assets folder.

### Phase 5 — Expedition recap
1. `useExpedition` session hook.
2. Recap card near contact; (explore) sealed-voice hint.

### Phase 1b — Voice easter eggs
1. Pluggable trigger system → unlock.
2. Author `scott` / `dwight` / `cow` bundles; unlock animation + next-hint.

### Phase 6 — Lantern (explore)
Revisit as a voice-unlock carrier once the above lands.
