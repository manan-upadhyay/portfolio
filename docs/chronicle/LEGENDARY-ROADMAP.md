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
| 4 | **Interactive sound design** (Web Audio synth + raven sample) | ✅ | 7 | 6 | med |
| 5 | **Expedition recap** (client-side session send-off) | ✅ | 6 | 4 | low |
| 1b | **Voice easter eggs** (scott / dwight / cow + unlock system) | ✅ | 6 | 4 | low |
| 7 | **The Atelier** (making-of coda: build timeline + built/cut ledger + manifesto) | ✅ | 8 | 5 | low |
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
>
> **Scalability pass (so the voice roster can grow to 10–15+).** The content
> architecture was already scalable (a voice = one `voices.js` registry entry +
> one lazy `bundles/<id>.js`); the two UIs that broke past ~3 were rebuilt. The
> registry now carries **`category`** + **`glyph`** (serif monogram — no emoji)
> per voice + a `voicesByCategory()` helper. New **`VoiceHall`** (`src/components/
> VoiceHall.jsx`) — a ⌘-palette-style overlay (modeled on `MapOverlay`) with
> search + category sections + voice cards (open → switch; sealed → clue + ⓘ
> reference); open-state lives in `useVoiceStore.hallOpen` so it can be summoned
> from **⇧⌘V**, the cluster popover's **"Open the Voice Hall"** CTA, or a
> **"Change voice"** action added to the ⌘K `MapOverlay`. The bottom-right
> `VoiceSwitcher` popover was rebuilt and then **decluttered** to its essentials
> (open voices + a CTA into the Hall — the sealed-discovery game lives in the Hall
> now). The disliked static quill ring/pulse was **removed** in favour of a
> one-time, scroll-triggered **entice note** above the quill (catchy marketing
> copy; appears once the visitor reaches the Arsenal; `voiceNoted` persisted).
> Verified via CDP incl. a 12-voice scale test (Hall scrolls/groups, recap
> constellation wraps), build + lint clean.
>
> **Wow + gamification pass.** The Hall got an ambient ember/gold **aura + star
> dust** backdrop, a proper **header** (feather crest + serif title + subtitle),
> **medallion** monograms, and staggered card entrance. Added a gamified
> **"Summon a Voice"** tile (`VoiceRequest` in `VoiceHall.jsx`): a collapsed CTA
> that unfolds into a tiny form (persona + email + why) and posts through the
> existing **`/api/send-raven`** endpoint (`inquiry: 'Voice request'`), then bursts
> into a celebratory confirmation. All info popovers were moved to a portalled
> **`Hovercard`** (fixes the regression where tooltips inside the new scrolling
> menus were clipped and spawned a stray scrollbar). Authored across `chronicle`
> + `plain` (other voices fall back).

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

## 4. Interactive sound design system  · Phase 4 · ✅ SHIPPED

> **Shipped.** A three-layer Web-Audio system: **engine** `src/lib/sound.js`
> (one shared `AudioContext`, gesture-unlocked via `sound.arm()`, master
> `gain → compressor → destination`; synth helpers `blip`/`swoosh`; cues +
> two managed beds), **store** `src/store/useSoundStore.ts` (persisted
> `enabled`/`volume`/`engaged`, default-on, auto-muted under reduced-motion),
> and **UI** `src/components/SoundControl.jsx` (the cluster's audio half:
> master mute/volume + the one-time "turn on sound" onboarding note, ~10s
> auto-dismiss, killed by the first gesture). Cues wired: `theme`
> (DayNightToggle), `voice` (VoiceSwitcher), `mapOpen`/`mapClose` (App), `raven`
> (Contact send; mp3 → synth fallback), `blip` (Tech hover arpeggio), `confirm`
> (sound on). Beds: hero **hum** (scroll-faded via a Hero ScrollTrigger) +
> arsenal **drone** (in-view gated). The old `MusicPlayer` was **removed**
> (superseded). Verified via CDP: AudioContext unlocks on gesture + schedules
> nodes (hum + cues), **reduced-motion stays fully silent** (0 oscillators), no
> console errors, the control + onboarding note + hover-expand render correctly;
> `npm run build` + lint clean.
>
> **Needs from Manan:** drop the organic **`public/sounds/raven.mp3`** when ready
> — until then the raven cue uses its synthesized fallback (no action required to
> ship).
>
> **Iteration (post-review re-tune):** beds reassigned + cues reworked per
> feedback — the spacey **`hum` moved to the Arsenal** (with scroll-proximity
> distance falloff), the Hero got a new metallic **`watch`-mechanism** bed (also
> scroll-faded), the old harsh Arsenal `drone` was **removed**, the `theme`/`map`
> cues dropped their chime (swoosh only; theme swoosh **lengthened to ~0.62s to
> sync with the wipe**), and the voice chime became a **`glitch`** cue paired with
> a new **`VoiceGlitch` visual** (chromatic tear bands + full-frame hue warp as
> the copy re-forms). Added **page-visibility gating** — the AudioContext suspends
> on tab/window switch and resumes on return. Re-verified via CDP: voice change
> schedules the glitch cue + mounts the overlay + switches copy; context suspends
> when hidden, resumes when visible; build + lint clean.
>
> **Iteration 2 (sound polish + content-level voice transition):** (1) added an
> **`error`** cue on the Contact form's instant/validation errors; (2) both beds
> now play an **optional looping mp3** with a synth fallback + the same distance
> fade — **Hero `watch` → `public/sounds/astrolabe.mp3`** (synth fallback redesigned
> to a *slow revolving gear*), **Arsenal `hum` → `public/sounds/arsenal.mp3`**
> (synth fallback kept); (3) **`theme`/`map` swooshes made gentler** and all knobs
> moved into a **`CONFIG`** block at the top of `lib/sound.js` for easy human
> tuning; (4) the voice `glitch` sound softened into a "decode", and the
> **full-screen RGB overlay was removed** in favour of a **per-text scramble** —
> every visible text element decodes into the new voice (`lib/voiceScramble.js`,
> `VoiceTransition`), the requested content-level "Scrambled Text" effect.
> Re-verified via CDP: voice change scrambles every visible text node then resolves
> to the new copy (no overlay), 0 console errors; build + lint clean.
>
> **Needs from Manan:** optional loop mp3s — `public/sounds/astrolabe.mp3` (Hero)
> + `public/sounds/arsenal.mp3` (Arsenal); synth fallbacks ship meanwhile.

**What:** A *sound design system* of sparse, intentional cues. **Sound rewards
intent, never accompanies motion.** Upgrades the audio slot created in the
Phase 1 control cluster.

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
- [x] `src/lib/sound.js` — shared context, gesture-unlock, ADSR helper.
- [x] Synthesize each abstract cue; tune to taste.
- [x] Raven mp3 loader (graceful if absent) → `public/sounds/raven.mp3`.
- [x] Wire cues: Hero (hum+fade) / Tech (drone+blip) / Contact / theme toggle /
      voice toggle / MapOverlay (open+close).
- [x] Upgrade the cluster's audio control → master sound + hover-note (10s auto).
- [x] Respect `prefers-reduced-motion` (default mute) + persist.
- [x] **Canon update:** ARCHITECTURE §4b (sound layer), DESIGN-SYSTEM §4c (sound
      language), CLAUDE.md §3.

---

## 5. Expedition recap — personalized send-off  · Phase 5 · ✅ SHIPPED

> **Shipped (redesigned).** A cinematic **instrument panel** auto-presents at the
> foot of the contact section — the cartographer's bookend to the hero astrolabe
> and the arsenal orbit. The conceit: the cartographer *reads the traveler* from
> the browser alone (device + locale + their live local sky) and **pins them on an
> animated map** — all client-side, nothing stored or sent.
>
> **The signature element** is **`TravelerMap`** (Canvas2D, inside `ExpeditionRecap`):
> a real **polar-azimuthal projection** (north pole at centre, latitude→radius,
> longitude→bearing) drawing a graticule, a seeded star field, a rotating **radar
> sweep**, and a pulsing **ember ping at the visitor's coordinates** (derived from
> their IANA timezone via `tzToCoords` in `lib/sky.js` — no geolocation prompt).
> rAF-driven, DPR-aware, **paused off-screen** via IntersectionObserver, re-reads
> theme tokens on `resolvedTheme` change, and renders a single static frame under
> reduced-motion.
>
> **The "Reading"** comes from **`src/lib/visitor.js`** — a cached, synchronous,
> permissionless snapshot of `navigator`/`screen`/WebGL: GPU (cleaned
> `WEBGL_debug_renderer_info`), OS+browser, viewport+DPR, language, cores/memory,
> region+coords from the timezone, plus `localReading()` (their live wall-clock +
> the sky resolving at *their* location now). Shown in a mono "terminal" grid
> (`.exp-mono`) so the numbers read clearly — fixing the old serif old-style
> figures.
>
> **The voices** are promoted to a primary **interactive constellation**: three
> nodes (`SEALED_VOICES`), `n / 3` found; an unlocked node glows gold and **switches
> the site voice on click** (`setVoice`), the active one burns ember, locked nodes
> whisper their cryptic `hint` on hover/focus (revealed in place of the closing
> nudge line). The nudge reads `recap.sealed.{none|some|all}` against
> `useVoiceStore.unlocked`.
>
> **Dropped** the old constant stats (chapters `n/6`, realms) — anyone who reaches
> the recap has scrolled the whole page, so those were always `6/6 · N/N`. The
> session store (`src/hooks/useExpedition.js`, non-persisted) now tracks only what
> varies: **time afield** (`useElapsed`, live, in-view-gated) and **trail unrolled**
> (`scrollPx → metres` via `PX_PER_METER`). `CompassRose` (slow-spin) sits in the
> corner. Copy under `recap.*` is authored for **all five voices** —
> `chronicle` (cartographer divination), `plain` (factual), and strong personality
> passes for `scott` (*"Your Performance Review… I'm basically a hacker"*), `dwight`
> (*"Surveillance Report… I will find them"*) and `cow` (*"Moo"*). CSS: `.expedition-*`
> / `.voice-node` / `.exp-mono` in `index.css` (token-driven, AA in all skies).
> Verified via CDP: map pins the real timezone, readings populate, the constellation
> lights + counts on unlock, night/day/dawn correct, `npm run build` + lint clean.
>
> **Iteration 2 (the "engineering marvel" pass).** New signals in `visitor.js`
> (+ a `useVisitor` hook that layers async results over the sync snapshot):
> **one opt-in IP-geolocation lookup** (`ipwho.is`, `ipapi.co` fallback, cached in
> `sessionStorage`) → city/country/coords (now driving the map ping) + ISP + IP;
> **battery** (`getBattery`), **network** (`navigator.connection`), measured
> **refresh-rate** (`measureRefreshRate`, in-view-gated rAF burst). The card now
> reads in two groups — **The Reading** (device) + **The Signal** (battery /
> network / carrier / IP) — each row hiding when its signal is absent (so blocked
> IP just drops to the timezone city). Added an Apple-Weather **`SunArc`**
> (`SunCalc` sunrise/sunset with a live sun dot), a device-fingerprint
> **Traveler's Sigil** (`src/lib/sigil.js` — FNV hash → seeded canvas emblem +
> hex, replacing the corner `CompassRose`), and a **persisted visit counter**
> (`useVisitStore`). **Privacy honesty:** because we now make that one request,
> the copy moved off "from your device alone" to "from your device and your
> connection — kept nowhere", with an ⓘ **"how?"** note; reworded in all 5 voices.
> The recap **constellation was rebuilt to scale** — a wrap-flow star cluster of
> voice monograms (found = lit `glyph`, sealed = faint lock), hover narrates in
> the nudge line, and an **"Explore all →"** opens the Voice Hall. Verified via
> CDP (IP path **and** blocked-IP fallback, dark/light, build + lint clean). See
> §1 for the Voice Hall + scalable switcher.
>
> **Credibility fixes.** **Battery was dropped** — the Battery Status API reports
> wrong values on some platforms (notably macOS Chrome: 100%/charging regardless
> of real charge), and a "reads you from your device" card must never show data it
> can't trust. The Connection grid now lets a lone trailing cell (e.g. the long
> IP) **span the row** (`:last-child:nth-child(odd)`), so there's never an empty
> slot. Unrelated but shipped here: `history.scrollRestoration = 'manual'` in
> `smoothScroll.js` — the browser's native scroll-restore fought GSAP's pinned
> Experience on reload; manual restore loads clean at the hero instead.

**What:** A small "Your expedition" card near contact: chapters charted, scroll
distance, time spent, theme(s) used, realms opened. Computed **client-side,
in-session** (no analytics infra needed; Vercel Analytics is aggregate/server
only).

### Decisions (locked)
- **Presentation:** subtle, **auto-present near contact**.
- **Voice-egg tie-in:** **explore** — the recap can hint at undiscovered voices
  (e.g. "1 of 3 sealed voices remain…"), reinforcing Phase 1b discovery.
  *(Shipped: the closing gold line.)*

**Tasks**
- [x] `useExpedition` hook — track chapters/scroll/time/theme/realms in session.
- [x] Recap card UI in Contact section.
- [x] (explore) sealed-voice hint integrated into the recap.

---

## 7. The Atelier — the making-of coda  · Phase 7 · ✅ SHIPPED

> **Shipped.** A new **coda chapter** (`sections/Atelier.jsx`, id `atelier`) after
> Contact, before the footer — "how the map was drawn." Answers the brief: a
> human, behind-the-scenes look at how the site was designed, iterated, and pushed
> past "done," grounded in real repo data. **Not a numbered chapter** — kept out of
> `chapters`/`chapterList` so the SideRail + ⌘K map stay the six-realm journey.
>
> **Movements:** (1) a **confession** (the human core — "It was already done. Then
> I kept going."); (2) the signature **`BuildTimeline`** instrument
> (`components/BuildTimeline.jsx`) — a Canvas2D cumulative-commit area chart of the
> Jun 20–27 revamp burst that draws itself on first view, with a gold "it was done
> here" milestone marker after which the line brightens (the obsession arc); follows
> the project's instrument conventions (DPR-aware, theme-token re-read on
> `resolvedTheme`, IO-paused, reduced-motion → single static frame); (3) a `CountUp`
> **metrics** strip (hours / commits / phases / voices / lines / 0 KB Three.js);
> (4) the **ledger** — every shipped phase paired with **what was built then cut**
> (status line, battery, drone bed, RGB overlay) as the senior-judgment column;
> (5) a **built-with** chip rail; (6) the **manifesto** + signature.
>
> **Data vs. copy:** metric values, the timeline shape, and ledger/cut/tech ids are
> data in **`constants.atelier`**; all labels are voiced under **`atelier.*`** — full
> passes in `chronicle` (cartographer) + `plain` (colophon), character passes in
> `scott` / `dwight` / `cow` for the narrative-prominent keys (per-phase/per-cut
> facts deep-merge-fall back to chronicle's real substance). **The Realms nod**
> (`works.nod` / `works.nodCta`, authored in all five voices) closes The Realms with
> "the seventh realm is the one you're standing in →" linking into the Atelier — the
> deliberate alternative to a self-referential project card. CSS: `.atelier-*` +
> `.works-nod*` in `index.css` (token-driven, AA both skies). Verified: `npm run
> build` + lint clean; ships as its own lazy chunk (~3 KB gz).

**Decision (locked): no project card for the portfolio itself.** A card inside The
Realms breaks the gallery frame, competes with real client proof, and under-sells
the meta-story. The portfolio-as-masterwork lives in the Atelier coda instead; the
Realms get one subtle closing nod into it.

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

### Phase 4 — Sound design ✅
1. ~~`src/lib/sound.js` (shared context, gesture unlock, ADSR).~~ ✅
2. ~~Synthesize cues; wire raven mp3 loader.~~ ✅
3. ~~Wire cues into sections + theme/voice toggles; hero hum with scroll-fade.~~ ✅
4. ~~Upgrade the cluster's audio control (master sound + hover-note + reduced-
   motion default-mute).~~ ✅
- **Needs from Manan:** drop `public/sounds/raven.mp3` when ready (optional; synth
  fallback ships meanwhile).

### Phase 5 — Expedition recap ✅
1. ~~`useExpedition` session hook (non-persisted store + chapter/scroll/sky/realm
   trackers).~~ ✅
2. ~~Recap card (`ExpeditionRecap`) near contact; sealed-voice hint line.~~ ✅

### Phase 1b — Voice easter eggs
1. Pluggable trigger system → unlock.
2. Author `scott` / `dwight` / `cow` bundles; unlock animation + next-hint.

### Phase 6 — Lantern (explore)
Revisit as a voice-unlock carrier once the above lands.
