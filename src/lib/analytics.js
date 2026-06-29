// ─────────────────────────────────────────────────────────────────────────────
// Analytics — one swappable facade over the PostHog singleton.
//
// Goal: learn whether the "moments" we built (the astrolabe, voices, the Hall,
// the Atelier reel…) are actually *touched*, so UX decisions are evidence-led.
//
// Backend: PostHog. The SDK is initialized ONCE, eagerly, in `src/main.jsx`
// (the official posthog-js pattern) and shared via the `<PostHogProvider>`. This
// module is the singleton facade used by the many callers that are NOT React
// components — Zustand stores (`voice_selected`, `voice_hall_open`), the audio
// engine (`sound_first_play`), plain libs — where the `usePostHog()` hook is
// illegal. Components may use either this facade or the hook; we use the facade
// everywhere for one consistent API.
//
// Privacy: cookieless + anonymous (`persistence:'memory'`, configured at init).
// Do-Not-Track and a missing key both hard-disable everything (every call
// no-ops). We never call `identify()` — there are no accounts.
//
// Discipline: most signals are "did they ever…?" — so prefer `trackOnce()` so a
// feature counts at most once per session and the dashboards stay readable. Never
// fire per-frame (drag/hover/scroll) — debounce to a first-interaction or a
// unique-count-on-leave.
// ─────────────────────────────────────────────────────────────────────────────
import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY;

let on = false; // becomes true once main.jsx successfully inits the SDK
/** Session-scoped dedup keys for "first interaction" events (memory only). */
const fired = new Set();

// ── Session recap ────────────────────────────────────────────────────────────
// "The ExpeditionRecap, as data." Because EVERY named event flows through
// `track()`, we accumulate the visit here (one place, no double-instrumentation)
// and flush ONE summary event on page-leave — a single tidy row per visitor with
// the whole journey, ideal for cohorts ("tried ≥3 voices → 2× conversion").
const sessionStart = Date.now();
const session = {
  spins: 0,
  voices: new Set(),
  sections: new Set(),
  maxScroll: 0,
  reachedContact: false,
  reachedAtelier: false,
  contacted: false,
};
let recapSent = false;

/** Fold a named event into the running session aggregate. */
function accrue(event, props) {
  switch (event) {
    case 'astrolabe_spin': session.spins += 1; break;
    case 'voice_selected': if (props?.voice) session.voices.add(props.voice); break;
    case 'scroll_depth': if (props?.pct > session.maxScroll) session.maxScroll = props.pct; break;
    case 'atelier_view': session.reachedAtelier = true; break;
    case 'contact_success': session.contacted = true; break;
    case 'section_view':
      if (props?.id) session.sections.add(props.id);
      if (props?.id === 'contact') session.reachedContact = true;
      break;
    default: break;
  }
}

/** Flush the one-per-visit summary. Fires at most once (on the first page-leave). */
export function flushSessionRecap() {
  if (recapSent || !on) return;
  recapSent = true;
  try {
    posthog.capture('session_recap', {
      seconds_on_site: Math.round((Date.now() - sessionStart) / 1000),
      max_scroll_pct: session.maxScroll,
      voices_tried: session.voices.size,
      sections_viewed: session.sections.size,
      spins: session.spins,
      reached_contact: session.reachedContact,
      reached_atelier: session.reachedAtelier,
      contacted: session.contacted,
    });
  } catch { /* ignore */ }
}

export const dntEnabled = () =>
  typeof navigator !== 'undefined' &&
  (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' ||
    window.doNotTrack === '1');

/** True once the SDK is live (key present, not DNT, init ran). */
export const analyticsEnabled = () => on;

/** Called by main.jsx after a successful `posthog.init`. */
export function markAnalyticsReady() {
  on = !!KEY && !dntEnabled();
  if (!on || typeof window === 'undefined') return;
  // Flush the session recap as the visitor leaves. `pagehide` is the reliable
  // signal (bfcache-safe; PostHog sends it via beacon); `visibilitychange` →
  // hidden is the belt-and-suspenders fallback for tab-close on mobile.
  window.addEventListener('pagehide', flushSessionRecap);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSessionRecap();
  });
}

/** Emit a product event. No-ops when analytics is disabled. */
export function track(event, props) {
  if (!on) return;
  accrue(event, props); // fold into the running session recap
  try { posthog.capture(event, props); } catch { /* never let telemetry break the page */ }
}

/**
 * Emit `event` at most once per session, keyed by `key` (so e.g. each distinct
 * voice, or each section, counts once). Returns true the first time only.
 */
export function trackOnce(key, event, props) {
  if (fired.has(key)) return false;
  fired.add(key);
  track(event, props || {});
  return true;
}

/**
 * Register **super properties** — attached to EVERY event (including autocaptured
 * clicks), so every chart/funnel can be sliced by them (device, theme, voice…).
 * Pass only what changed; call again to update (e.g. on a voice/theme switch).
 */
export function registerContext(props) {
  if (!on) return;
  try { posthog.register(props); } catch { /* ignore */ }
}

/** Report a caught exception (wired from ErrorBoundary). */
export function captureError(error, extra) {
  if (!on) return;
  try { posthog.captureException?.(error, extra); } catch { /* ignore */ }
}
