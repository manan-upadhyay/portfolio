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

## Dashboard setup — end to end (do this once)

PostHog gives charts + filters with **zero dashboard code**. The walkthrough
below builds two dashboards from the events above. Allow ~30 min.

### Step 0 — Get data flowing & verify

1. Create a project at app.posthog.com → **Settings → Project → Project API key**.
2. Put it in `VITE_POSTHOG_KEY` (+ `VITE_POSTHOG_HOST` if EU) locally and in
   **Vercel → Project → Settings → Environment Variables** (Production + Preview),
   then redeploy.
3. Open the deployed site, click around (spin the astrolabe, switch a voice,
   focus the contact form). In PostHog → **Activity** (live events) you should see
   `$pageview`, `$autocapture`, `astrolabe_spin`, `voice_selected`, … arriving.
   If nothing shows: check the key and that the browser isn't sending Do-Not-Track.

> **Ad-blocker reverse proxy (already wired).** In production, ingestion is routed
> through a **same-origin proxy** so blockers don't see a tracker domain and drop
> ~20–40% of events. [`vercel.json`](../../vercel.json) rewrites `/ingest/static/*`
> → `us-assets.i.posthog.com` and `/ingest/*` → `us.i.posthog.com`; [`main.jsx`](../../src/main.jsx)
> sets `api_host` to `${origin}/ingest` in prod (+ `ui_host` so the toolbar still
> links to the real PostHog UI). Dev talks to PostHog directly (no proxy).
> **On EU cloud**, repoint both `/ingest` rewrite destinations to the `eu` hosts.
> Verify after deploy: in the Network tab, `…/ingest/e/?...` returns **200** (not
> `blocked:other`), and PostHog **Activity** still receives events.

> **Interpretation caveat (important).** We run **cookieless** (`persistence:
> 'memory'`), so each page *load* is a fresh anonymous person. "Unique users" ≈
> **unique sessions**, and `returning_visitor` (our own super-property, from a
> persisted local tally) is the reliable repeat-visit signal — prefer it over
> PostHog's person-level returning metric. Keep funnel conversion windows within
> **one session** (our journeys are single-visit anyway).

### Step 1 — Turn on the free capture layers

**Settings → Project**, enable: **Autocapture**, **Heatmaps**, **Web vitals**,
**Session replay** (keep "Mask all inputs" on), **Error tracking**. These power
heatmaps/replay/vitals/exceptions with no extra code.

Optional but tidy: **Data management → Events**, mark the marquee events as
**Verified** and add descriptions, so the team picker stays clean.

### Step 2 — Create two dashboards

**New dashboard** (left sidebar → Dashboards → New):
- **"Chronicle — Conversion & Quality"** (the hiring scoreboard)
- **"Chronicle — Adoption & Engagement"** (did the moments land?)

For every tile: **New insight → pick the type → configure → Save & add to
dashboard**. Set each dashboard's date range to **Last 30 days** (top-right).

### Step 3 — Dashboard A · "Conversion & Quality"

| # | Tile | Type | Config | Answers |
|---|---|---|---|---|
| A1 | **Conversion funnel** ⭐ | Funnel | Steps: `$pageview` → `section_view` (filter `id = contact`) → `contact_form_start` → `contact_submit` → `contact_success`. Window: 1 day. | Where leads are won/lost |
| A2 | **Soft-intent signals** | Trends | Series (Unique users): `email_copied`, `resume_open`, `channel_open`. Display: bar. | Intent beyond the form |
| A3 | **What work they want** | Trends | `inquiry_selected` **breakdown by** `inquiry` (Total count). Pie/bar. | Hire vs freelance vs collab |
| A4 | **Conversion by inquiry** | Funnel | A1 steps, but **breakdown by** `contact_success` → `inquiry`. | Which inquiry type converts |
| A5 | **Leads over time** | Trends | `contact_success` (Total), interval = day. | Lead flow trend |
| A6 | **Web Vitals** | (built-in) | Add the **Web Vitals** insight (LCP/CLS/INP), breakdown by `$pathname`. | Real-user performance |
| A7 | **Errors** | (built-in) | Pin from the **Error tracking** tab. | Broken subtrees / $exception |

Add an **Alert** on A5: open the insight → **Subscribe / Alerts** → notify your
email when `contact_success` ≥ 1 per day (instant lead notification).

### Step 4 — Dashboard B · "Adoption & Engagement"

| # | Tile | Type | Config | Answers |
|---|---|---|---|---|
| B1 | **Feature adoption** | Trends | One series **Unique users** per marquee event: `astrolabe_spin`, `voice_hall_open`, `voice_selected`, `map_open`, `arsenal_tools_hovered`, `carousel_open`, `buildreel_scrub`, `persona_card_expand`, `expedition_view`, `atelier_view`. Display: **bar**, sorted desc. | Which moments get touched |
| B2 | **Adoption rate %** | Trends | Same events as B1 but as a **formula** `A / B` where `B = $pageview` (unique). Shows % of visits using each feature. | Touched vs ignored, normalized |
| B3 | **Hot sections** | Trends | `section_view` **breakdown by** `id`. | Most-seen chapters |
| B4 | **Scroll funnel** | Funnel | `scroll_depth` steps `pct = 25 → 50 → 75 → 100`. | Where they stop scrolling |
| B5 | **Discovery funnel** | Funnel | `$pageview` → `astrolabe_spin` → `voice_hall_open` → `atelier_view`. | Do deep features get reached |
| B6 | **Voice popularity** | Trends | `voice_selected` **breakdown by** `voice`. | Favourite voice + long tail |
| B7 | **Easter-egg discovery** | Trends | `voice_unlocked` **breakdown by** `voice`. | Which secrets get found |
| B8 | **Voice wishlist** | Trends | `voice_summon_submit` **breakdown by** `persona` (table). | Voices people *want* |
| B9 | **Session quality** | Trends | `session_recap` — three series using **property value (average)**: `seconds_on_site`, `max_scroll_pct`, `voices_tried`. Display: number/bold. | Avg depth of a visit |
| B10 | **Voices-tried distribution** | Trends | `session_recap` **breakdown by** `voices_tried`. | How many voices per visit |
| B11 | **Power users** | Trends | `shortcut_used` (Unique users) **breakdown by** `combo`. | Keyboard-driven devs |
| B12 | **Heatmaps** | (toolbar) | Open the live site via **Toolbar** (Activity → Launch toolbar) → click + rage-click maps per page. | Where they actually click |

### Step 5 — Cohorts (slice everything by audience)

**People → Cohorts → New cohort**:
- **Engaged explorers** — performed `voice_selected` ≥ 2 **or** `atelier_view` in
  the last 30d.
- **Converters** — performed `contact_success`.
- **Technical audience** — performed `shortcut_used` (or `$autocapture` with a
  `device_gpu` worth bragging about).

Then on any tile, **filter by cohort** — e.g. compare B9 *Session quality* for
Converters vs everyone to validate *"engaged visitors convert."*

### Step 6 — Slice by super-properties

On any insight, **+ Filter** / **Breakdown** by our registered super-props:
`device_os`, `device_browser`, `theme`, `voice`, `returning_visitor`,
`reduced_motion`, `sound_enabled`, plus PostHog's country/device. (E.g. Conversion
funnel broken down by `device_os` → does mobile convert worse?)

### Step 7 — Qualitative & experiments

- **Session replay** (left sidebar) — watch anonymized visits; filter to sessions
  that hit `contact_form_start` but **not** `contact_success` to see *why* leads
  abandon. Masked inputs keep it private.
- **Experiments** (feature flags are enabled) — A/B test e.g. hero copy or the
  primary CTA; read the flag in code only where you branch.

Vercel Web Analytics stays mounted for raw pageviews/geo; PostHog is the
product-event + qualitative layer on top.
