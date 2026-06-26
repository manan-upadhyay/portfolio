import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Info, ArrowUpRight } from 'lucide-react';
import { useExpeditionStore, useElapsed, useVisitStore, PX_PER_METER } from '../hooks/useExpedition';
import { useThemeStore } from '../store/useThemeStore';
import { useVoiceStore } from '../store/useVoiceStore';
import { SEALED_VOICES, voiceById } from '../i18n/voices';
import { fmtCoord, localReading } from '../lib/visitor';
import { useVisitor } from '../hooks/useVisitor';
import { deviceHash, drawSigil } from '../lib/sigil';
import ScrollReveal from './ScrollReveal';
import SunArc from './SunArc';

const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m ? `${m}m ${String(sec).padStart(2, '0')}s` : `${sec}s`;
};

/* ---------- The Traveler's Map — a polar-azimuthal radar that pins the visitor
   from their timezone-derived coordinates (north pole at the centre). The
   cartographer's signature instrument, bookending the hero astrolabe. ---------- */
const TravelerMap = ({ lat, lng }) => {
  const ref = useRef(null);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    const canvas = ref.current;
    const wrap = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cs = getComputedStyle(canvas);
    const v = (name, fb) => (cs.getPropertyValue(name) || fb).trim();
    const ember = v('--color-ember', '#d9772e');
    const emberRgb = v('--color-ember-rgb', '217,119,46');
    const goldRgb = v('--color-gold-rgb', '184,138,46');
    const lineCol = v('--color-card-border', 'rgba(255,255,255,0.1)');

    // Deterministic faint star field (seeded so resize doesn't reshuffle it).
    let seed = 9301;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const stars = Array.from({ length: 44 }, () => ({ a: rnd() * Math.PI * 2, r: 0.18 + rnd() * 0.82, s: 0.4 + rnd() * 1.1 }));

    // Visitor ping: colatitude → radius (N pole centre, S pole rim), lng → bearing.
    const pingR = Math.max(0, Math.min(180, 90 - lat)) / 180;
    const pingA = (lng * Math.PI) / 180;

    let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1, raf = 0, running = false;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth; H = wrap.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2; R = Math.min(W, H) / 2 - 8;
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H);

      // graticule — outer disc, latitude rings, longitude spokes
      ctx.lineWidth = 1;
      ctx.strokeStyle = lineCol;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(${emberRgb},0.12)`;
      for (const f of [0.33, 0.66]) { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = `rgba(${emberRgb},${i % 3 ? 0.05 : 0.11})`;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.sin(a), cy - R * Math.cos(a)); ctx.stroke();
      }

      // stars
      for (const st of stars) {
        const tw = reduce ? 0.12 : (Math.sin(now / 900 + st.a * 5) + 1) * 0.12;
        ctx.fillStyle = `rgba(${goldRgb},${0.16 + tw})`;
        ctx.beginPath(); ctx.arc(cx + R * st.r * Math.sin(st.a), cy - R * st.r * Math.cos(st.a), st.s, 0, Math.PI * 2); ctx.fill();
      }

      // radar sweep
      if (!reduce) {
        const sweep = (now / 4200) * Math.PI * 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        grad.addColorStop(0, `rgba(${emberRgb},0)`);
        grad.addColorStop(1, `rgba(${emberRgb},0.15)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, sweep - 0.6, sweep); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(${emberRgb},0.45)`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(sweep), cy + R * Math.sin(sweep)); ctx.stroke();
      }

      // the visitor ping — crosshair, expanding pulse, glowing dot
      const px = cx + R * pingR * Math.sin(pingA);
      const py = cy - R * pingR * Math.cos(pingA);
      ctx.strokeStyle = `rgba(${emberRgb},0.35)`; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(px - 7, py); ctx.lineTo(px + 7, py); ctx.moveTo(px, py - 7); ctx.lineTo(px, py + 7); ctx.stroke();
      const pulse = reduce ? 0.45 : (now / 1600) % 1;
      ctx.strokeStyle = `rgba(${emberRgb},${0.55 * (1 - pulse)})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(px, py, 3 + pulse * 13, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = ember; ctx.shadowColor = `rgba(${emberRgb},0.9)`; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    };

    const loop = (now) => { if (!running) return; draw(now); raf = requestAnimationFrame(loop); };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(wrap);
    // Only animate while the card is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) {
        if (!running) { running = true; raf = requestAnimationFrame(loop); }
      } else { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.05 });
    io.observe(wrap);

    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [lat, lng, resolvedTheme]);

  return <canvas ref={ref} className="expedition-map__canvas" aria-hidden="true" />;
};

/* The Traveler's Sigil — a unique emblem drawn from the device fingerprint. */
const Sigil = ({ seed }) => {
  const ref = useRef(null);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = 46;
    canvas.width = s * dpr; canvas.height = s * dpr;
    canvas.style.width = `${s}px`; canvas.style.height = `${s}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(canvas);
    const g = (n, fb) => (cs.getPropertyValue(n) || fb).trim();
    drawSigil(ctx, s, seed, {
      ember: g('--color-ember', '#d9772e'),
      gold: g('--color-gold', '#b88a2e'),
      emberRgb: g('--color-ember-rgb', '217,119,46'),
    });
  }, [seed, resolvedTheme]);
  return <canvas ref={ref} className="sigil__canvas" aria-hidden="true" />;
};

/* One "reading" cell — mono value over a tiny uppercase label. */
const Reading = ({ label, value, accent }) => (
  <div className={`expedition-cell${accent ? ' expedition-cell--accent' : ''}`}>
    <span className="expedition-cell__label">{label}</span>
    <span className="expedition-cell__value exp-mono">{value}</span>
  </div>
);

/* A labelled mini-grid of reading cells; renders nothing when it has no data. */
const ReadGroup = ({ label, cells, modifier = '' }) => {
  if (!cells.length) return null;
  return (
    <>
      {label && <span className="expedition-grouplabel">{label}</span>}
      <div className={`expedition-readgrid ${modifier}`}>
        {cells.map((c) => (
          <Reading key={c.key} label={c.label} value={c.value} accent={c.accent} />
        ))}
      </div>
    </>
  );
};

/* The interactive sealed-voice constellation — a star cluster of voice sigils
   that scales to any count. Found voices glow with their monogram and switch the
   site voice on click; sealed ones are faint stars. Hovering any node narrates
   it in the line below; "Explore all" opens the full Voice Hall. */
const VoiceConstellation = ({ sealedLine }) => {
  const { t } = useTranslation();
  const unlocked = useVoiceStore((s) => s.unlocked);
  const current = useVoiceStore((s) => s.voice);
  const setVoice = useVoiceStore((s) => s.setVoice);
  const openHall = useVoiceStore((s) => s.openHall);
  const [hint, setHint] = useState(null);

  const found = unlocked.filter((id) => SEALED_VOICES.includes(id)).length;

  return (
    <div className="expedition-voices">
      <div className="expedition-voices__head">
        <span className="expedition-grouplabel">{t('recap.voices.title')}</span>
        <button type="button" className="expedition-voices__explore" data-cursor="hover" onClick={openHall}>
          {t('recap.voices.explore')} <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="voice-constellation" onMouseLeave={() => setHint(null)}>
        <span className="voice-constellation__count exp-mono">{found}/{SEALED_VOICES.length}</span>
        {SEALED_VOICES.map((id) => {
          const meta = voiceById(id);
          const open = unlocked.includes(id);
          const active = current === id;
          return (
            <button
              key={id}
              type="button"
              className="vc-node"
              data-open={open}
              data-active={active}
              data-cursor="hover"
              onClick={() => open && setVoice(id)}
              onMouseEnter={() => setHint(open ? meta.label : meta.hint)}
              onFocus={() => setHint(open ? meta.label : meta.hint)}
              onBlur={() => setHint(null)}
              aria-label={open ? t('recap.voices.switchTo', { voice: meta.label }) : t('recap.voices.locked')}
              title={open ? meta.label : meta.hint}
            >
              {open ? <span className="vc-node__glyph font-chronicle">{meta.glyph}</span> : <Lock size={12} />}
            </button>
          );
        })}
      </div>

      <p className="expedition-sealed font-chronicle">{hint || sealedLine}</p>
    </div>
  );
};

/**
 * ExpeditionRecap — the Phase 5 send-off. A cinematic instrument panel near the
 * contact section: the cartographer "reads" the traveler (device + locale +
 * their live local sky, all from the browser — nothing stored or sent), pins
 * them on an animated polar map, and tallies this session. Everything is
 * computed client-side.
 */
const ExpeditionRecap = () => {
  const { t } = useTranslation();
  const scrollPx = useExpeditionStore((s) => s.scrollPx);
  const visits = useVisitStore((s) => s.visits);

  // Tick the live clock + measure refresh rate only while the card is on screen.
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const seconds = useElapsed(inView);

  const v = useVisitor(inView);
  const { seed, hex } = deviceHash(v);
  const { time, sky } = localReading(v.coords);
  const coordStr = `${fmtCoord(v.coords.lat, 'N', 'S')}  ${fmtCoord(v.coords.lng, 'E', 'W')}`;

  // The device "reading".
  const reading = [
    { key: 'machine', value: v.gpu || (v.cores ? `${v.cores} cores` : null) },
    { key: 'system', value: [v.browser, v.os].filter(Boolean).join(' · ') || null },
    { key: 'display', value: v.screen ? `${v.screen.w}×${v.screen.h}${v.screen.dpr > 1 ? ` @${v.screen.dpr}×` : ''}${v.hz ? ` · ${v.hz}Hz` : ''}` : null },
    { key: 'tongue', value: v.language },
  ].filter((r) => r.value).map((r) => ({ ...r, label: t(`recap.reading.${r.key}`) }));

  // The connection "signal" (battery + network + IP — populates as it resolves).
  const signal = [
    { key: 'lantern', value: v.battery ? `${Math.round(v.battery.level * 100)}%${v.battery.charging ? ' ⚡' : ''}` : null },
    { key: 'road', value: v.network ? [v.network.effectiveType, v.network.downlink ? `${v.network.downlink} Mbps` : null, v.network.rtt ? `${v.network.rtt}ms` : null].filter(Boolean).join(' · ') : null },
    { key: 'carrier', value: v.geo?.isp || null },
    { key: 'origin', value: v.geo?.ip ? `${v.geo.flag ? `${v.geo.flag} ` : ''}${v.geo.ip}` : null },
  ].filter((r) => r.value).map((r) => ({ ...r, label: t(`recap.signal.${r.key}`) }));

  const journey = [
    { key: 'timeAfield', value: fmtTime(seconds) },
    { key: 'trail', value: `${(scrollPx / PX_PER_METER).toFixed(1)} m` },
    { key: 'visit', value: String(visits || 1) },
  ].map((r) => ({ ...r, label: t(`recap.journey.${r.key}`), accent: true }));

  // Sealed-voice nudge (Phase 1b tie-in).
  const found = useVoiceStore((s) => s.unlocked).filter((id) => SEALED_VOICES.includes(id)).length;
  const total = SEALED_VOICES.length;
  const sealedKey = found === 0 ? 'none' : found === total ? 'all' : 'some';
  const sealedLine = t(`recap.sealed.${sealedKey}`, { count: total - found, total });

  return (
    <ScrollReveal direction="up" className="mt-14">
      <div ref={ref} className="realm-card expedition-log p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="chapter-eyebrow">{t('recap.title')}</span>
            <p className="expedition-sub mt-2.5">
              {t('recap.subtitle')}
              <span className="expedition-how" title={t('recap.how')} tabIndex={0} aria-label={t('recap.how')}>
                <Info size={13} />
              </span>
            </p>
          </div>
          <div className="expedition-sigil flex-shrink-0" title={t('recap.sigilNote')}>
            <Sigil seed={seed} />
            <span className="expedition-sigil__hash exp-mono">{hex}</span>
          </div>
        </div>

        <div className="expedition-body mt-8">
          {/* the animated map + sun path */}
          <figure className="expedition-map">
            <div className="expedition-map__disc">
              <TravelerMap lat={v.coords.lat} lng={v.coords.lng} />
            </div>
            <figcaption className="expedition-readout">
              <span className="expedition-readout__region">
                {v.region}{v.area && <em> · {v.area}</em>}
              </span>
              <span className="expedition-readout__coords exp-mono">{coordStr}</span>
              <span className="expedition-readout__now exp-mono">
                {t('recap.map.localNow', { time, sky: t(`sky.modes.${sky}`) })}
              </span>
            </figcaption>
            <SunArc lat={v.coords.lat} lng={v.coords.lng} />
          </figure>

          {/* the reading + signal + journey + voices */}
          <div className="expedition-panel">
            <ReadGroup label={t('recap.reading.title')} cells={reading} />
            <ReadGroup label={t('recap.signal.title')} cells={signal} />
            <ReadGroup cells={journey} modifier="expedition-readgrid--journey" />
            <VoiceConstellation sealedLine={sealedLine} />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ExpeditionRecap;
