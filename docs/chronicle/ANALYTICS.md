# Analytics — feature-adoption telemetry

**Why:** the Chronicle is a collection of hand-built "moments" (the astrolabe,
voices, the Voice Hall, the Atelier reel…). This telemetry answers one question:
**are they actually touched, or ignored?** — so UX changes are evidence-led.

## Stack

- **PostHog**. Initialized **once, eagerly** in [`src/main.jsx`](../../src/main.jsx)
  (the official `posthog-js` pattern) and shared app-wide via the official
  **`<PostHogProvider>`** (`@posthog/react`).
- A thin **facade**, [`src/lib/analytics.js`](../../src/lib/analytics.js), exposes
  `track` / `trackOnce` / `registerContext` / `captureError` over the **same
  singleton** for the many callers that are **not** React components — Zustand
  stores (`voice_selected`, `theme_changed`…), the audio engine
  (`sound_first_play`) — where the `usePostHog()` hook is illegal. One facade =
  one consistent API + a one-file backend swap. Components may use either.
- **Cookieless + anonymous** (`persistence: 'memory'`) → no cross-session id, no
  consent banner. We never call `identify()` (no accounts). Respects
  **Do-Not-Track**; a missing `VITE_POSTHOG_KEY` fully disables it.
- **`defaults: '2026-05-30'`** opts into PostHog's modern preset: **autocapture**
  (heatmaps, rage-/dead-clicks), **history-change `$pageview`**, `$pageleave`,
  **web vitals**, and **exception autocapture**. `capture_exceptions: true` and
  the `ErrorBoundary` → `captureError` wiring add JS error tracking. **Session
  replay** is enabled in the PostHog **project settings** (not disabled in code).
- `posthog-js` is isolated as its own cached chunk (`analytics-vendor`, ~73KB gz)
  via `manualChunks` so it doesn't bloat the app chunk.

## Setup

1. Create a PostHog project → copy the **Project API key**.
2. Set env (see [`.env.example`](../../.env.example)): `VITE_POSTHOG_KEY`,
   optional `VITE_POSTHOG_HOST` (US default; EU = `https://eu.i.posthog.com`).
   Add both to Vercel (Production + Preview). **Leave the key unset to disable.**
3. In **PostHog → Project settings**, turn on what you want collected:
   **Autocapture** + **Heatmaps**, **Web vitals**, **Session replay**
   (masking: inputs masked by default — keep it), and **Error tracking**.

## Event catalog (named events)

Discipline: **first-interaction + unique-count, one event per session** (via
`trackOnce`). Never per-frame. (Clicks/pageviews/vitals/exceptions come for free
via autocapture — the list below is our *intentional* product events.)

| Event | Fired from | Props | Answers |
|---|---|---|---|
| `section_view` | `useEngagementAnalytics` | `id` | **hot sections** |
| `scroll_depth` | `useEngagementAnalytics` | `pct` 25/50/75/100 | **how far they scroll** |
| `hero_cta` | `Hero` | `target` about/contact | which entry CTA starts the journey? |
| `astrolabe_drag` / `astrolabe_spin` | `Hero` | — | played with / spun the astrolabe? |
| `sound_first_play` | `Layout` (`sound.onUnlock`) | — | heard the site? |
| `sound_toggled` | `useSoundStore` | `enabled` | muted/unmuted? |
| `voice_switcher_open` | `VoiceSwitcher` | — | used the voice menu? |
| `voice_hall_open` | `useVoiceStore.openHall` | — | opened the Hall? |
| `voice_selected` | `useVoiceStore.setVoice` | `voice` | **# voices tried / favourite** |
| `voice_unlocked` | `useVoiceStore.unlockVoice` | `voice` | discovered an easter-egg voice? |
| `voice_summon_submit` / `_success` / `_error` | `VoiceHall` summon form | `persona` | requested a brand-new voice |
| `theme_changed` | `useThemeStore` | `mode`, `sky` | toggled the sky? |
| `map_open` / `map_travel` | `Chronicle` / `MapOverlay` | (`id`) | opened the map / jumped a realm? |
| `rail_nav` | `SideRail` | `id` | navigate via the rail vs free scroll? |
| `arsenal_tools_hovered` | `Tech` (on scroll-away) | `count` (unique) | explored tools? how many? |
| `project_link_open` | `Works` | `project`, `kind` | which project links opened? |
| `carousel_open` | `Works` Cover | `project` | browsed screenshots? |
| `works_show_all` | `Works` | — | wanted to see the minor realms? |
| `expedition_view` | `ExpeditionRecap` (in-view) | — | reached the recap? |
| `atelier_view` | `MakingOf` route | — | went behind the curtain? |
| `buildreel_scrub` | `BuildReel` | — | directed the reel? |
| `persona_card_expand` | `PersonaTriptych` | `persona` | expanded a persona? |
| `inquiry_selected` | `Contact` | `inquiry` | what kind of work do they come for? |
| `email_copied` | `Contact` (CopyButton) | — | quiet but strong contact intent |
| **`contact_form_start`** | `Contact` (first focus) | `inquiry` | **started the form** |
| **`contact_submit`** | `Contact` | `inquiry` | **attempted to send** |
| **`contact_success`** | `Contact` | `inquiry` | ⭐ **the conversion** |
| `contact_error` | `Contact` | `code` | send failed (which error) |
| `resume_open` | `Contact` / `MapOverlay` | `from` | **downloaded the résumé** |
| `channel_open` | `Contact` / `MapOverlay` | `channel`, `from` | clicked email/GitHub/LinkedIn |
| `shortcut_used` | `Layout` / `Chronicle` | `combo` | ⌘K / ⇧⌘V → **keyboard power-user** (likely a dev) |
| `session_recap` | `analytics.js` (on page-leave) | see below | **one summary row per visit** |

### `session_recap` — the ExpeditionRecap, as data

Fired **once on page-leave** (`pagehide` / `visibilitychange→hidden`). Because
every named event flows through `track()`, the session is accumulated in one
place ([`analytics.js`](../../src/lib/analytics.js)) and flushed as a single tidy
row per visitor — ideal for cohorts. Props: `seconds_on_site`, `max_scroll_pct`,
`voices_tried`, `sections_viewed`, `spins`, `reached_contact`, `reached_atelier`,
`contacted`. Example insight: *"visitors who tried ≥3 voices convert 2× more."*

### Super properties (on every event, incl. autocaptured clicks)

Registered via `registerContext` ([`Layout`](../../src/components/Layout.jsx) +
the stores) so **every** chart/funnel can be sliced without extra work. Uses only
the **synchronous** device snapshot (`readVisitor` — no IP/geo call; PostHog
derives country server-side):

`device_os`, `device_browser`, `device_gpu`, `device_cores`, `device_touch`,
`screen_w/h`, `language`, `returning_visitor`, `reduced_motion`, `sound_enabled`,
`theme`, `sky_mode`, `voice`.

## Viewing the data (build once in PostHog)

PostHog gives charts + filters with **zero dashboard code**. Pin these to a
"Chronicle Adoption" dashboard:

1. **Feature adoption** — *Trends*, bar chart, total of each named event.
2. **Voice popularity** — *Trends* on `voice_selected` **breakdown by** `voice`.
3. **Scroll funnel** — *Funnel*: `scroll_depth` `25 → 50 → 75 → 100`.
4. **Conversion funnel** ⭐ — *Funnel*: `$pageview` → `section_view (contact)` →
   `contact_form_start` → `contact_submit` → `contact_success`. The hiring metric.
5. **Discovery funnel** — *Funnel*: `$pageview` → `astrolabe_spin` →
   `voice_hall_open` → `atelier_view`.
6. **Heatmaps** — open any page in the PostHog toolbar (needs feature flags /
   `/decide` enabled) → click + rage-click maps.
7. **Web vitals** — the built-in Web Vitals dashboard (LCP/CLS/INP per route).
8. **Errors** — the Error tracking tab ($exception + ErrorBoundary reports).

Every insight filters natively by the super properties above + PostHog's
device/country props. Vercel Web Analytics stays mounted for raw pageviews/geo;
PostHog is the product-event + qualitative layer on top.

## Future / experiments

Feature flags are enabled, so you can run **A/B experiments** (hero copy, CTA
wording) and gradual rollouts directly from PostHog — no code change beyond
reading the flag where you want to branch.
