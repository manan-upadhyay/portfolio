import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Webhook } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { skillCategories, chapters } from '../constants';
import { ChapterHeading, CompassRose } from '../components';
import { useThemeStore } from '../store/useThemeStore';

// Each category owns one concentric ring (inner → outer), each revolving at its
// own pace and direction — a solar system of skills. Inner rings move faster.
const CAT_RING = { Frontend: 130, Backend: 230, 'DevOps & Craft': 330 };
const RING_CFG = {
  Frontend: { dur: 250, dir: 'cw' },
  Backend: { dur: 400, dir: 'cw' },
  'DevOps & Craft': { dur: 800, dir: 'cw' },
};
// Canvas sized to the outermost ring (r 340) + its curved title above (r+25)
// and the node labels below, with ~30px breathing room on every edge.
const CX = 410;
const CY = 390;
const W = 820;
const H = 790;
const shortName = (n) => n.split(/[/·]/)[0].trim();

/* ---------------- Orbital field (desktop) ---------------- */
const OrbitalField = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const [activeCat, setActiveCat] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [inView, setInView] = useState(true);
  const [links, setLinks] = useState([]);
  const fieldRef = useRef(null);
  const nodeRefs = useRef(new Map());

  // Precompute each ring + its nodes' polar offsets (relative to centre).
  const rings = useMemo(() => skillCategories.map((cat, ci) => {
    const r = CAT_RING[cat.category] ?? 200;
    const n = cat.skills.length;
    const nodes = cat.skills.map((s, i) => {
      // half-step offset keeps the 12-o'clock gap clear for the curved label
      const a = (-90 + 180 / n + (i * 360) / n + ci * 10) * (Math.PI / 180);
      return {
        key: `${cat.category}-${s.name}`,
        name: s.name,
        short: shortName(s.name),
        primary: s.tier === 'primary',
        logo: s.icon || null,
        logoDark: s.iconDark || null, // theme variant for monochrome wordmarks
        cat: cat.category,
        size: s.tier === 'primary' ? 58 : 42,
        rx: Math.cos(a) * r,
        ry: Math.sin(a) * r,
      };
    });
    return { cat: cat.category, r, ci, nodes, ...RING_CFG[cat.category] };
  }), []);

  const activeNode = useMemo(
    () => rings.flatMap((r) => r.nodes).find((n) => n.key === activeKey) || null,
    [rings, activeKey]
  );

  // Pause the whole field when it scrolls off-screen (perf).
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.04 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Constellation links are MEASURED from the live (paused) node positions, so
  // they stay correct even though the ring revolves. Trimmed to disc edges.
  useEffect(() => {
    if (!activeNode) { setLinks([]); return; }
    const raf = requestAnimationFrame(() => {
      const field = fieldRef.current;
      const aEl = nodeRefs.current.get(activeNode.key);
      if (!field || !aEl) return;
      const fr = field.getBoundingClientRect();
      const ab = aEl.getBoundingClientRect();
      const ax = ab.left + ab.width / 2 - fr.left;
      const ay = ab.top + ab.height / 2 - fr.top;
      const siblings = rings.find((r) => r.cat === activeNode.cat).nodes;
      const out = [];
      siblings.forEach((t) => {
        if (t.key === activeNode.key) return;
        const bEl = nodeRefs.current.get(t.key);
        if (!bEl) return;
        const bb = bEl.getBoundingClientRect();
        const bx = bb.left + bb.width / 2 - fr.left;
        const by = bb.top + bb.height / 2 - fr.top;
        const dx = bx - ax, dy = by - ay;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const t1 = activeNode.size / 2 + 3, t2 = t.size / 2 + 3;
        out.push({ key: t.key, x1: ax + ux * t1, y1: ay + uy * t1, x2: bx - ux * t2, y2: by - uy * t2 });
      });
      setLinks(out);
    });
    return () => cancelAnimationFrame(raf);
  }, [activeKey, rings, activeNode]);

  const enter = (cat, key) => { setActiveCat(cat); setActiveKey(key); };
  const leave = () => { setActiveCat(null); setActiveKey(null); };

  return (
    <div ref={fieldRef} className="relative mx-auto max-w-full" style={{ width: W, height: H }}
      onMouseLeave={() => { setActiveCat(null); setActiveKey(null); }}>

      {/* static layer — orbit rings + curved titles (these never rotate) */}
      <svg className="absolute inset-0 pointer-events-none" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {rings.map(({ cat, r }) => {
          const on = activeCat === cat;
          const tr = r + 25; // push the curved title well clear of the ring & its nodes
          return (
            <g key={cat}>
              <circle cx={CX} cy={CY} r={r} fill="none" stroke="var(--color-ember)"
                strokeWidth={on ? 1.4 : 1.2} strokeDasharray="2 7"
                style={{ opacity: on ? 0.72 : 0.5, transition: 'opacity 0.4s ease' }} />
              <path id={`ring-${r}`} fill="none" d={`M ${CX - tr},${CY} A ${tr},${tr} 0 0,1 ${CX + tr},${CY}`} />
              <text dy="-2" textAnchor="middle"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.34em', fill: 'var(--color-ember)', opacity: on ? 0.92 : 0.5, transition: 'opacity 0.4s ease' }}>
                <textPath href={`#ring-${r}`} startOffset="50%">{cat.toUpperCase()}</textPath>
              </text>
            </g>
          );
        })}
      </svg>

      {/* constellation links — measured, drawn UNDER the nodes */}
      <svg className="absolute inset-0 pointer-events-none" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {links.map((l) => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="var(--color-ember)" strokeWidth="1.1" opacity="0.4" strokeLinecap="round" />
        ))}
      </svg>

      {/* core — celestial compass sigil ("you are here"), slow rotation */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
        style={{ left: CX, top: CY, width: 180, height: 180,
          background: 'radial-gradient(circle, rgba(var(--color-ember-rgb),0.16) 0%, transparent 65%)' }}>
        <div className="relative grid place-items-center rounded-full"
          style={{ width: 104, height: 104, background: 'var(--gradient-card)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(var(--color-ember-rgb),0.4)', boxShadow: '0 0 30px rgba(var(--color-ember-rgb),0.18) inset, 0 0 24px rgba(var(--color-ember-rgb),0.12)' }}>
          <span className="absolute rounded-full" style={{ inset: 9, border: '1px solid rgba(var(--color-ember-rgb),0.18)' }} />
          {/* <Compass size={40} strokeWidth={1.25} style={{ color: 'var(--color-ember)' }} /> */}
          <CompassRose />
        </div>
        <span className="absolute whitespace-nowrap" style={{ top: '100%', marginTop: 2, fontSize: 9.5, fontWeight: 600,
          letterSpacing: '0.36em', textTransform: 'uppercase', color: 'var(--color-text-muted)', opacity: 0.7 }}>
          The Arsenal
        </span>
      </div>

      {/* revolving rings of nodes — the ring rotates, each node counter-rotates upright */}
      {rings.map((ring) => {
        const paused = !inView || activeCat === ring.cat;
        const ringAnim = ring.dir === 'cw' ? 'orbit-cw' : 'orbit-ccw';
        const nodeAnim = ring.dir === 'cw' ? 'orbit-ccw' : 'orbit-cw';
        return (
          <div key={ring.cat} className="absolute"
            style={{ left: CX, top: CY, width: 0, height: 0, zIndex: activeCat === ring.cat ? 5 : 2,
              animation: `${ringAnim} ${ring.dur}s linear infinite`, animationPlayState: paused ? 'paused' : 'running', willChange: 'transform' }}>
            {ring.nodes.map((node) => {
              const dim = activeCat && node.cat !== activeCat;
              const active = activeKey === node.key;
              const inActiveCat = node.cat === activeCat;
              const glyph = node.primary ? 30 : 22;
              const logo = isDark && node.logoDark ? node.logoDark : node.logo;
              return (
                <div key={node.key} className="absolute" style={{ left: 0, top: 0, transform: `translate(${node.rx}px, ${node.ry}px)` }}>
                  <button
                    ref={(el) => { if (el) nodeRefs.current.set(node.key, el); else nodeRefs.current.delete(node.key); }}
                    data-cursor="hover" aria-label={node.name}
                    onMouseEnter={() => enter(node.cat, node.key)} onMouseLeave={leave}
                    onFocus={() => enter(node.cat, node.key)} onBlur={leave}
                    className="group grid place-items-center rounded-full transition-opacity duration-300"
                    style={{ width: node.size, height: node.size, marginLeft: -node.size / 2, marginTop: -node.size / 2,
                      opacity: dim ? 0.22 : 1,
                      animation: `${nodeAnim} ${ring.dur}s linear infinite`, animationPlayState: paused ? 'paused' : 'running' }}
                  >
                    <span className="absolute inset-0 rounded-full realm-card group-hover:scale-[1.18]"
                      style={{ transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, background 0.3s ease',
                        ...(node.primary ? { borderColor: 'rgba(var(--color-ember-rgb),0.5)' } : {}),
                        ...(inActiveCat ? { background: 'var(--color-card-bg)' } : {}) }} />
                    {logo ? (
                      <img src={logo} alt="" className="relative object-contain" style={{ width: glyph, height: glyph }} />
                    ) : (
                      <Webhook size={glyph - 2} strokeWidth={1.6} className="relative" style={{ color: 'var(--color-ember)' }} />
                    )}
                    <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-medium pointer-events-none transition-all duration-300"
                      style={{ top: '100%', marginTop: 5,
                        color: active ? 'var(--color-ember)' : 'var(--color-text-muted)',
                        opacity: dim ? 0.3 : active ? 1 : 0.74,
                        ...(inActiveCat ? { background: 'var(--color-primary)', padding: '1px 7px', borderRadius: 6 } : {}) }}>
                      {node.short}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- Cluster fallback (tablet / mobile / reduced-motion) ---------------- */
const Clusters = () => (
  <div className="grid md:grid-cols-3 gap-6 mt-12">
    {skillCategories.map((cat, i) => (
      <motion.div key={cat.category} className="realm-card p-7"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: i * 0.1, duration: 0.5 }}>
        <h3 className="font-chronicle font-semibold text-[24px]" style={{ color: 'var(--color-text)' }}>{cat.category}</h3>
        <p className="text-[13px] mb-5" style={{ color: 'var(--color-text-muted)' }}>{cat.blurb}</p>
        <div className="flex flex-wrap gap-2.5">
          {cat.skills.map((s) => {
            const primary = s.tier === 'primary';
            return (
              <span key={s.name} className="inline-flex items-center gap-1.5 rounded-full font-medium"
                style={{
                  padding: primary ? '7px 14px' : '5px 12px',
                  fontSize: primary ? 14 : 13,
                  color: primary ? 'var(--color-ember)' : 'var(--color-text)',
                  background: primary ? 'rgba(var(--color-ember-rgb),0.1)' : 'rgba(var(--color-accent-rgb),0.06)',
                  border: `1px solid ${primary ? 'rgba(var(--color-ember-rgb),0.4)' : 'var(--color-card-border)'}`,
                }}>
                {primary && <span aria-hidden="true">✦</span>}
                {s.name}
              </span>
            );
          })}
        </div>
      </motion.div>
    ))}
  </div>
);

const Tech = () => {
  const [orbital, setOrbital] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setOrbital(mq.matches && !rm.matches);
    update();
    mq.addEventListener('change', update);
    rm.addEventListener('change', update);
    return () => { mq.removeEventListener('change', update); rm.removeEventListener('change', update); };
  }, []);

  return (
    <>
      <ChapterHeading no={chapters.arsenal.no} eyebrow={chapters.arsenal.label} title={`${chapters.arsenal.sub}.`} align="center" />
      <p className="text-center max-w-xl mx-auto mt-5 text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
        The kit I carry into every campaign — hover a star to trace its constellation.
      </p>

      {orbital ? (
        <div className="mt-6"><OrbitalField /></div>
      ) : (
        <Clusters />
      )}
    </>
  );
};

export default SectionWrapper(Tech, 'arsenal');
