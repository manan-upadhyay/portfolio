// ─────────────────────────────────────────────────────────────────────────────
// log — the cartographer's ledger. A tiny, zero-dependency console logger.
//
// Why hand-rolled (no `loglevel` / `consola` / `pino`): the perf budget forbids
// dead deps, and a bespoke logger lets the console carry the Chronicle's own
// voice (the `greet` banner) for free. Remote error aggregation is NOT here —
// that's PostHog (`analytics.captureError`, `capture_exceptions`), already
// wired. This module owns only what reaches the browser console.
//
// Levels & discipline:
//  - error / warn → ALWAYS print. Real problems a console should surface
//    (failed dispatch, degraded subtree, asset that wouldn't load).
//  - info / debug → DEV only, unless `localStorage['chronicle:debug'] === '1'`
//    (so a prod field-repro can be opened up without a redeploy).
//  - Never log per-frame (scroll / drag / hover). Log lifecycle + graceful
//    degradation, not motion. Never log PII (no IPs, emails, message bodies).
// ─────────────────────────────────────────────────────────────────────────────

const DEV = import.meta.env.DEV;
const HAS_CONSOLE = typeof console !== 'undefined';

/** Are verbose levels (info/debug) enabled? DEV always; prod via opt-in flag. */
const verbose = () => {
  if (DEV) return true;
  try { return localStorage.getItem('chronicle:debug') === '1'; } catch { return false; }
};

// On-brand console styling (raw hex is fine here — this is generated art, not a
// component). Gold = the Chronicle's accent; the rest read on dark & light DevTools.
const STYLE = {
  error: 'color:#e5484d;font-weight:600',
  warn: 'color:#d9a441;font-weight:600',
  info: 'color:#7aa2c4',
  debug: 'color:#8a8f98',
};

/**
 * Print one record: a gold `⟡ scope` tag (in the level's accent), then the
 * caller's args verbatim. `console.error/warn` keep their native red/amber
 * gutter icon in DevTools; `accent` only tints the tag for quick scanning.
 */
function emit(method, accent, scope, args) {
  if (!HAS_CONSOLE) return;
  const fn = console[method] || console.log;
  // eslint-disable-next-line no-console
  fn(`%c⟡ ${scope}`, accent, ...args);
}

/** Build a logger bound to `scope`. `.scope(child)` nests (e.g. `sound:bed`). */
function make(scope) {
  return {
    /** Always prints. For genuine failures (a console-worthy problem). */
    error: (...a) => emit('error', STYLE.error, scope, a),
    /** Always prints. For recoverable / degraded paths the dev should notice. */
    warn: (...a) => emit('warn', STYLE.warn, scope, a),
    /** DEV (or opt-in) only. Lifecycle milestones — init, mode changes, loads. */
    info: (...a) => { if (verbose()) emit('log', STYLE.info, scope, a); },
    /** DEV (or opt-in) only. Fine-grained detail for active debugging. */
    debug: (...a) => { if (verbose()) emit('debug', STYLE.debug, scope, a); },
    /** A child logger: `log.scope('bed')` → tags as `sound:bed`. */
    scope: (child) => make(scope ? `${scope}:${child}` : child),
  };
}

/** A module-scoped logger, e.g. `const log = createLogger('astrolabe')`. */
export const createLogger = (scope) => make(scope);

/** The default, app-wide logger (`chronicle` scope). */
const log = make('chronicle');
export default log;

// ── The fun bit ──────────────────────────────────────────────────────────────
// A one-time, on-brand banner for the curious soul who opens DevTools. Awwwards
// sites do this; ours speaks in the Chronicle's voice and points the way to the
// margins of the map (the Atelier) and the sealed voices.
let greeted = false;
export function greet() {
  if (greeted || !HAS_CONSOLE || typeof window === 'undefined') return;
  greeted = true;

  const title = [
    'color:#B88A2E',
    'font-size:20px',
    'font-weight:700',
    'letter-spacing:0.18em',
    'text-shadow:0 1px 0 rgba(0,0,0,0.25)',
  ].join(';');
  const sub = 'color:#9aa0a6;font-style:italic;font-size:12px';
  const body = 'color:#c9c4ba;font-size:12px;line-height:1.6';
  const key = 'color:#B88A2E;font-weight:600';

  // eslint-disable-next-line no-console
  console.log('%c✦ THE CHRONICLE ✦', title);
  // eslint-disable-next-line no-console
  console.log('%cYou found the margins of the map.', sub);
  // eslint-disable-next-line no-console
  console.log(
    '%cA cartographer left notes here, traveller:\n' +
      '%c  ▸ the making-of waits at /making-of — the build, as a film.\n' +
      '  ▸ some voices are sealed. Speak the right words to unseal them.\n' +
      '  ▸ to debug in the wild: %clocalStorage.setItem("chronicle:debug","1")%c then reload.',
    body, body, key, body,
  );
  // eslint-disable-next-line no-console
  console.log(
    '%cCharting your own realm? The cartographer answers ravens — manantheassassin@gmail.com',
    sub,
  );
}
