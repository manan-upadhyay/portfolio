import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/useThemeStore';

/**
 * BuildTimeline — the Atelier's signature instrument. A Canvas2D area chart of
 * the "Cartographer revamp" commit burst: cumulative commits climb across the
 * days, the line draws itself on first view, and a gold marker flags the day the
 * site was already "done" — everything past it is the obsession arc, drawn in a
 * brighter ember.
 *
 * Mirrors the project's instrument conventions (TravelerMap): DPR-aware, theme
 * tokens re-read on `resolvedTheme`, paused off-screen via IntersectionObserver,
 * and a single static frame under prefers-reduced-motion.
 *
 * Props:
 *  - data:      [{ day, commits, done? }]  (from constants.atelier.timeline)
 *  - doneFrac?: 0..1 fraction passed up so the DOM "done" flag can align.
 */
const BuildTimeline = ({ data }) => {
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
    const gold = v('--color-gold', '#b88a2e');
    const lineCol = v('--color-card-border', 'rgba(255,255,255,0.1)');

    // Cumulative commit curve + the index where the site was already "done".
    let cum = 0;
    const pts = data.map((d) => ({ ...d, cum: (cum += d.commits) }));
    const total = cum || 1;
    const doneIdx = Math.max(0, pts.findIndex((d) => d.done));
    const n = pts.length;

    // start far in the past so any draw before the in-view animation shows the
    // FULL chart (prog → 1) — the draw-on only plays once IO fires and resets it.
    let W = 0, H = 0, dpr = 1, raf = 0, running = false, start = -1e6;
    const PAD = { l: 10, r: 10, t: 18, b: 22 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth; H = wrap.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Map a point index → pixel coords within the plotting area.
    const X = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
    const Y = (cumv) => H - PAD.b - (cumv / total) * (H - PAD.t - PAD.b);

    const draw = (now) => {
      const prog = reduce ? 1 : Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      ctx.clearRect(0, 0, W, H);

      // baseline + faint horizontal guides
      ctx.strokeStyle = lineCol; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD.l, H - PAD.b); ctx.lineTo(W - PAD.r, H - PAD.b); ctx.stroke();
      ctx.strokeStyle = `rgba(${emberRgb},0.07)`;
      for (const f of [0.5, 1]) {
        const y = (H - PAD.b) - f * (H - PAD.t - PAD.b);
        ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
      }

      // how far along the curve the draw-on has reached (in index space)
      const reveal = eased * (n - 1);

      // build the visible polyline up to `reveal`
      const poly = [];
      for (let i = 0; i < n; i++) {
        if (i <= reveal) poly.push([X(i), Y(pts[i].cum)]);
        else {
          // partial segment to the reveal frontier
          const i0 = Math.floor(reveal);
          if (i0 + 1 < n) {
            const f = reveal - i0;
            const x = X(i0) + (X(i0 + 1) - X(i0)) * f;
            const y = Y(pts[i0].cum) + (Y(pts[i0 + 1].cum) - Y(pts[i0].cum)) * f;
            poly.push([x, y]);
          }
          break;
        }
      }
      if (poly.length < 2) { if (running) raf = requestAnimationFrame(loop); return; }

      // area fill under the curve
      const fill = ctx.createLinearGradient(0, PAD.t, 0, H - PAD.b);
      fill.addColorStop(0, `rgba(${emberRgb},0.28)`);
      fill.addColorStop(1, `rgba(${emberRgb},0)`);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(poly[0][0], H - PAD.b);
      poly.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(poly[poly.length - 1][0], H - PAD.b);
      ctx.closePath(); ctx.fill();

      // the "done" marker — a dashed gold uprail at the presentable milestone
      const dx = X(doneIdx);
      if (reveal >= doneIdx) {
        ctx.save();
        ctx.strokeStyle = `rgba(${goldRgb},0.55)`; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(dx, PAD.t - 6); ctx.lineTo(dx, H - PAD.b); ctx.stroke();
        ctx.restore();
      }

      // the curve — muted up to "done", brighter ember after it (the push)
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(${emberRgb},0.5)`;
      ctx.beginPath();
      poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      // overdraw the post-"done" stretch in full ember
      ctx.strokeStyle = ember; ctx.shadowColor = `rgba(${emberRgb},0.6)`; ctx.shadowBlur = 8;
      ctx.beginPath();
      let started = false;
      poly.forEach(([x, y]) => {
        if (x >= dx) { started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true; }
      });
      ctx.stroke(); ctx.shadowBlur = 0;

      // day dots
      for (let i = 0; i < n; i++) {
        if (i > reveal) break;
        const x = X(i), y = Y(pts[i].cum);
        const isDone = i === doneIdx;
        ctx.fillStyle = i >= doneIdx ? ember : `rgba(${emberRgb},0.6)`;
        ctx.beginPath(); ctx.arc(x, y, isDone ? 3.4 : 2.2, 0, Math.PI * 2); ctx.fill();
        if (isDone) {
          ctx.strokeStyle = gold; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // the live head dot while drawing
      if (prog < 1) {
        const [hx, hy] = poly[poly.length - 1];
        ctx.fillStyle = ember; ctx.shadowColor = `rgba(${emberRgb},0.9)`; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }

      if (running && prog < 1) raf = requestAnimationFrame(loop);
    };

    const loop = (now) => { if (!running) return; draw(now); };

    resize();
    draw(performance.now());

    // Redraw on resize. Keep `start` (mid-animation it continues; once settled it
    // stays in the past → a full static frame). Never reset to "now" — that would
    // flash an empty chart on every resize.
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(wrap);

    // Kick the draw-on once, when the chart first scrolls into view.
    let played = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce && !played) {
        played = true; running = true; start = performance.now(); raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.3 });
    io.observe(wrap);

    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [data, resolvedTheme]);

  return <canvas ref={ref} className="atelier-chart__canvas" aria-hidden="true" />;
};

export default BuildTimeline;
