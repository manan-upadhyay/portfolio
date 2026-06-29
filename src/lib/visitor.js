// The cartographer's "reading" of the traveler — everything we can divine about
// the visitor's device & locale from the browser alone. Pure client-side, fully
// synchronous, no network, no permissions, nothing stored or sent. Powers the
// Phase 5 expedition recap (the "how did he know this?!" beat).
//
// All values degrade gracefully to `null` when a signal is unavailable, so the
// recap can hide a row rather than render a blank.

import { getTimezone, tzToCoords, resolveSkyMode } from './sky';
import { createLogger } from './log';

const log = createLogger('visitor');

const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';

const detectOS = () => {
  const p = (typeof navigator !== 'undefined' && navigator.userAgentData?.platform) || '';
  if (p) return p; // Chromium reports a clean "macOS" / "Windows" / "Android"
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return null;
};

const detectBrowser = () => {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return null;
};

// WebGL renderer string → a friendly GPU name. The raw value is verbose, e.g.
// "ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro, Unspecified Version)".
const detectGPU = () => {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    let raw = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null;
    if (!raw) return null;
    raw = String(raw)
      .replace(/^ANGLE \(/, '')
      .replace(/\)$/, '')
      .replace(/ANGLE Metal Renderer:\s*/i, '')
      .replace(/Direct3D\d+\s*(vs_\d_\d\s*ps_\d_\d)?/gi, '')
      .replace(/\b(OpenGL|Metal|Vulkan|D3D11|Unspecified Version|gl_\w+)\b/gi, '')
      .replace(/\(R\)|\(TM\)|®|™/g, '');
    // Prefer the comma-separated chunk that actually names a vendor/chip.
    const VENDOR = /(Apple|NVIDIA|GeForce|RTX|GTX|AMD|Radeon|Intel|Iris|UHD|Mali|Adreno|PowerVR|Qualcomm|M\d)/i;
    const chunk = raw.split(',').map((s) => s.trim()).find((s) => VENDOR.test(s)) || raw;
    return chunk.replace(/\s+/g, ' ').trim().slice(0, 28) || null;
  } catch {
    return null;
  }
};

/** A one-shot snapshot of the visitor. Cached after the first read. */
let cached = null;
export const readVisitor = () => {
  if (cached) return cached;
  const tz = getTimezone();
  const coords = tzToCoords(tz);
  const parts = tz.split('/');
  const region = (parts[parts.length - 1] || tz).replace(/_/g, ' ');
  const area = parts.length > 1 ? parts[0].replace(/_/g, ' ') : null;

  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const scr = typeof screen !== 'undefined' ? screen : {};

  cached = {
    timezone: tz,
    region,
    area,
    coords,
    os: detectOS(),
    browser: detectBrowser(),
    gpu: detectGPU(),
    cores: nav.hardwareConcurrency || null,
    memory: nav.deviceMemory || null, // GiB, Chromium only
    language: nav.language || null,
    connection: nav.connection?.effectiveType || null,
    screen: scr.width ? { w: scr.width, h: scr.height, dpr: Math.round((window.devicePixelRatio || 1) * 10) / 10 } : null,
    touch: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  };
  return cached;
};

// ---------------------------------------------------------------------------
// Async signals — these either touch the network (the IP lookup) or need time
// to resolve (battery, refresh rate). Each is cached and degrades to null, so
// the recap renders instantly with the synchronous reading and fills these in
// as they arrive. None of them block.
// ---------------------------------------------------------------------------

// Public IP + approximate city. This is the ONE network request the recap makes
// (the user opted in); we send nothing and store nothing server-side — the
// response is cached in sessionStorage so it's at most one lookup per visit.
// Keyless + CORS-friendly: ipwho.is, with ipapi.co as a fallback.
const GEO_KEY = 'chronicle-geo';
let geoPromise = null;
export const fetchGeo = () => {
  if (geoPromise) return geoPromise;
  try {
    const saved = sessionStorage.getItem(GEO_KEY);
    if (saved) {
      log.debug('geo served from session cache');
      geoPromise = Promise.resolve(JSON.parse(saved)); return geoPromise;
    }
  } catch { /* sessionStorage blocked — just fetch */ }

  const norm = (d) => {
    if (!d || d.success === false || (d.error && !d.ip)) return null;
    const lat = d.latitude ?? d.lat;
    const lng = d.longitude ?? d.lon ?? d.lng;
    if (d.ip == null || lat == null || lng == null) return null;
    return {
      ip: d.ip,
      city: d.city || null,
      country: d.country || d.country_name || null,
      region: d.region || d.region_name || null,
      lat, lng,
      isp: d.connection?.isp || d.connection?.org || d.org || d.isp || null,
      flag: d.flag?.emoji || null,
    };
  };

  geoPromise = fetch('https://ipwho.is/', { mode: 'cors' })
    .then((r) => r.json())
    .then((d) => norm(d))
    .catch(() => fetch('https://ipapi.co/json/').then((r) => r.json()).then(norm).catch(() => null))
    .then((geo) => {
      // No PII in the log — just whether the one opt-in lookup resolved.
      if (geo) log.debug('geo lookup resolved (city/coords available)');
      else log.warn('geo lookup unavailable — recap will hide location rows');
      if (geo) { try { sessionStorage.setItem(GEO_KEY, JSON.stringify(geo)); } catch { /* ignore */ } }
      return geo;
    });
  return geoPromise;
};

// NOTE: the Battery Status API was intentionally NOT used — it reports incorrect
// values on several platforms (notably macOS Chrome, which returns 100%/charging
// regardless of the real charge), and the recap must never show untrustworthy
// data. Network + IP are the reliable "connection" signals.

/** Connection class — effectiveType + downlink (Mbps) + rtt (ms). */
export const getNetwork = () => {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null;
  if (!c || !c.effectiveType) return null;
  return { effectiveType: c.effectiveType, downlink: c.downlink || null, rtt: c.rtt || null };
};

/** Measure the display refresh rate (Hz) by timing a short burst of frames. */
export const measureRefreshRate = () =>
  new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'undefined') return resolve(null);
    const deltas = [];
    let last = performance.now();
    let frames = 0;
    const tick = (now) => {
      deltas.push(now - last);
      last = now;
      if (++frames < 32) return requestAnimationFrame(tick);
      const sorted = deltas.slice(1).sort((a, b) => a - b); // drop first (warm-up)
      const median = sorted[Math.floor(sorted.length / 2)] || 16.7;
      return resolve(Math.round(1000 / median / 10) * 10 || null); // snap to nearest 10Hz
    };
    requestAnimationFrame(tick);
  });

/** Format a signed coordinate as "22.6°N" / "88.4°W". */
export const fmtCoord = (v, pos, neg) => `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;

/** The visitor's wall-clock "HH:MM" + the sky resolving at their location now. */
export const localReading = (coords) => {
  const now = new Date();
  let time = '';
  try {
    time = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  } catch {
    time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  return { time, sky: resolveSkyMode(now, coords) };
};
