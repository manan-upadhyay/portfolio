// The living sky — derives the time-of-day "sky mode" from the visitor's clock
// and timezone. Pure math: no geolocation prompt, no sensors.
//
// Location is inferred from the browser's IANA timezone (a compact lookup for
// common zones; an offset→longitude fallback otherwise) and fed to SunCalc to
// get real sunrise/golden-hour/dusk times for *today, here*. Everything degrades
// gracefully — a bad timezone or polar edge case falls back to clock hours.

// suncalc is CommonJS — namespace import keeps Rollup (prod build) happy.
import * as SunCalc from 'suncalc';

/** The four real-sky palettes, in day order. `auto` resolves to one of these. */
export const SKY_ORDER = ['dawn', 'day', 'dusk', 'night'];
/** Which base theme (light/dark) each sky sits on. */
export const SKY_BASE = { dawn: 'light', day: 'light', dusk: 'dark', night: 'dark' };

export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

// Approx [lat, lng] for common IANA zones — just precise enough for sun timing
// (timing is driven mostly by longitude; latitude only stretches day length).
const TZ_COORDS = {
  'Asia/Kolkata': [22.57, 88.36],
  'Asia/Calcutta': [22.57, 88.36],
  'Asia/Dubai': [25.2, 55.27],
  'Asia/Karachi': [24.86, 67.0],
  'Asia/Dhaka': [23.81, 90.41],
  'Asia/Bangkok': [13.76, 100.5],
  'Asia/Singapore': [1.35, 103.82],
  'Asia/Hong_Kong': [22.32, 114.17],
  'Asia/Shanghai': [31.23, 121.47],
  'Asia/Tokyo': [35.68, 139.69],
  'Asia/Seoul': [37.57, 126.98],
  'Asia/Jerusalem': [31.78, 35.22],
  'Europe/London': [51.51, -0.13],
  'Europe/Paris': [48.86, 2.35],
  'Europe/Berlin': [52.52, 13.4],
  'Europe/Madrid': [40.42, -3.7],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Moscow': [55.76, 37.62],
  'Europe/Amsterdam': [52.37, 4.9],
  'Africa/Cairo': [30.04, 31.24],
  'Africa/Johannesburg': [-26.2, 28.05],
  'Africa/Lagos': [6.52, 3.38],
  'America/New_York': [40.71, -74.01],
  'America/Toronto': [43.65, -79.38],
  'America/Chicago': [41.88, -87.63],
  'America/Denver': [39.74, -104.99],
  'America/Los_Angeles': [34.05, -118.24],
  'America/Sao_Paulo': [-23.55, -46.63],
  'America/Mexico_City': [19.43, -99.13],
  'Australia/Sydney': [-33.87, 151.21],
  'Australia/Melbourne': [-37.81, 144.96],
  'Pacific/Auckland': [-36.85, 174.76],
};

/**
 * Best-effort coordinates from a timezone. Known zones use the table; unknown
 * ones derive longitude from the current UTC offset (15° per hour) at a generic
 * mid-latitude — enough for plausible sunrise/sunset timing anywhere.
 */
export const tzToCoords = (tz = getTimezone()) => {
  const hit = TZ_COORDS[tz];
  if (hit) return { lat: hit[0], lng: hit[1] };
  const offsetMin = -new Date().getTimezoneOffset(); // minutes east of UTC
  const lng = Math.max(-180, Math.min(180, (offsetMin / 60) * 15));
  return { lat: 40, lng };
};

// Polar nights / NaN sun times fall back to plain clock hours.
const fallbackByHour = (date) => {
  const h = date.getHours();
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
};

/**
 * Resolve the current sky from real sun times for the given location.
 *   night  : before dawn or after dusk
 *   dawn   : dawn → end of morning golden hour
 *   day    : full daylight
 *   dusk   : evening golden hour → dusk
 */
export const resolveSkyMode = (date = new Date(), coords = tzToCoords()) => {
  try {
    const t = SunCalc.getTimes(date, coords.lat, coords.lng);
    const now = date.getTime();
    const dawn = t.dawn.getTime();
    const morningGoldEnd = t.goldenHourEnd.getTime();
    const eveningGold = t.goldenHour.getTime();
    const dusk = t.dusk.getTime();
    if ([dawn, morningGoldEnd, eveningGold, dusk].some(Number.isNaN)) return fallbackByHour(date);
    if (now < dawn || now >= dusk) return 'night';
    if (now < morningGoldEnd) return 'dawn';
    if (now < eveningGold) return 'day';
    return 'dusk';
  } catch {
    return fallbackByHour(date);
  }
};
