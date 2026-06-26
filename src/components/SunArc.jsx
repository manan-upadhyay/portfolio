import * as SunCalc from 'suncalc';

const fmt = (d) => {
  try {
    return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  } catch {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
};

// Geometry of the arc in the SVG's 200×70 viewBox.
const L = 18, Rx = 182, HORIZON = 50, AMP = 38;

/**
 * SunArc — an Apple-Weather-style sun path for the visitor's real location.
 * The sun rides a parabolic arc from sunrise (left) to sunset (right); its dot
 * sits at the fraction of daylight elapsed *right now* (below the horizon, dim,
 * at night). Pure SunCalc math; no animation (the recap re-renders each second,
 * so the sun drifts on its own). Reduced-motion safe by construction.
 */
const SunArc = ({ lat, lng }) => {
  const now = new Date();
  const t = now.getTime();
  const times = SunCalc.getTimes(now, lat, lng);
  const sr = times.sunrise?.getTime();
  const ss = times.sunset?.getTime();
  if (sr == null || ss == null || Number.isNaN(sr) || Number.isNaN(ss)) return null;

  const isDay = t >= sr && t <= ss;
  // Fraction across the *daylight* arc (clamped); at night the dot rests at the
  // nearest horizon end, faintly, below the line.
  const f = isDay ? (t - sr) / (ss - sr) : t < sr ? 0 : 1;
  const sx = L + f * (Rx - L);
  const sy = isDay ? HORIZON - Math.sin(f * Math.PI) * AMP : HORIZON + 6;

  // Parabolic arc M(L,H) Q(mid, H-2·AMP) (Rx,H) peaks at (mid, H-AMP).
  const mid = (L + Rx) / 2;
  const arc = `M ${L} ${HORIZON} Q ${mid} ${HORIZON - 2 * AMP} ${Rx} ${HORIZON}`;

  return (
    <div className="sun-arc">
      <svg viewBox="0 0 200 70" className="sun-arc__svg" aria-hidden="true">
        <defs>
          <linearGradient id="sun-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(var(--color-ember-rgb),0.16)" />
            <stop offset="100%" stopColor="rgba(var(--color-ember-rgb),0)" />
          </linearGradient>
        </defs>
        {/* daylight wash under the arc */}
        <path d={`${arc} L ${L} ${HORIZON} Z`} fill="url(#sun-sky)" opacity={isDay ? 1 : 0.4} />
        {/* the path + horizon */}
        <path d={arc} fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2 3" opacity="0.55" />
        <line x1="4" y1={HORIZON} x2="196" y2={HORIZON} stroke="var(--color-card-border)" strokeWidth="1" />
        {/* the sun */}
        <circle cx={sx} cy={sy} r="9" fill="rgba(var(--color-ember-rgb),0.18)" opacity={isDay ? 1 : 0.3} />
        <circle cx={sx} cy={sy} r="3.4" fill="var(--color-ember)" opacity={isDay ? 1 : 0.45} />
      </svg>
      <div className="sun-arc__times">
        <span><span className="sun-arc__lbl">Sunrise</span> {fmt(times.sunrise)}</span>
        <span><span className="sun-arc__lbl">Sunset</span> {fmt(times.sunset)}</span>
      </div>
    </div>
  );
};

export default SunArc;
