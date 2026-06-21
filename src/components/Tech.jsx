import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../hoc';
import { technologies, skillCategories } from '../constants';
import { ChapterHeading } from './ui';

/* name → logo (with a couple of aliases) */
const techIcon = Object.fromEntries(technologies.map((t) => [t.name, t.icon]));
const ALIAS = { 'Redux / RTK': 'Redux Toolkit', 'Git / GitHub': 'Git' };
const iconFor = (name) => techIcon[name] || techIcon[ALIAS[name]] || null;

// Shorter names sit inner; longer names get the roomier outer ring.
const CAT_RING = { Frontend: 135, Backend: 220, 'DevOps & Craft': 300 };
const CX = 360;
const CY = 300;
const shortName = (n) => n.split(/[/·]/)[0].trim();

/* ---------------- Orbital field (desktop) ---------------- */
const OrbitalField = () => {
  const [activeCat, setActiveCat] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  const nodes = useMemo(() => {
    const out = [];
    skillCategories.forEach((cat, ci) => {
      const r = CAT_RING[cat.category] ?? 200;
      const n = cat.skills.length;
      cat.skills.forEach((s, i) => {
        const angle = (-90 + (i * 360) / n + ci * 14) * (Math.PI / 180);
        out.push({
          key: `${cat.category}-${s.name}`,
          name: s.name,
          short: shortName(s.name),
          primary: s.tier === 'primary',
          icon: iconFor(s.name),
          cat: cat.category,
          x: CX + Math.cos(angle) * r,
          y: CY + Math.sin(angle) * r,
          i,
        });
      });
    });
    return out;
  }, []);

  const activeNode = nodes.find((n) => n.key === activeKey);
  const linkTargets = activeNode ? nodes.filter((n) => n.cat === activeNode.cat && n.key !== activeNode.key) : [];

  return (
    <div className="relative mx-auto" style={{ width: 720, height: 600 }}
      onMouseLeave={() => { setActiveCat(null); setActiveKey(null); }}>
      {/* faint ring guides */}
      <svg className="absolute inset-0 pointer-events-none" width="720" height="600">
        {Object.values(CAT_RING).map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--color-card-border)" strokeDasharray="2 7" />
        ))}
        {/* constellation links for the active node's group */}
        {activeNode && linkTargets.map((t) => (
          <line key={t.key} x1={activeNode.x} y1={activeNode.y} x2={t.x} y2={t.y}
            stroke="var(--color-ember)" strokeWidth="1" opacity="0.4" />
        ))}
      </svg>

      {/* core */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full text-center"
        style={{ left: CX, top: CY, width: 128, height: 128,
          background: 'radial-gradient(circle, rgba(var(--color-ember-rgb),0.18), transparent 70%)' }}>
        <div className="grid place-items-center w-20 h-20 rounded-full realm-card">
          <span className="font-chronicle text-[15px] leading-none text-center" style={{ color: 'var(--color-ember)' }}>
            The<br />Arsenal
          </span>
        </div>
      </div>

      {/* nodes — outer div centers (static), inner floats. Logos = discs, others = labeled pills */}
      {nodes.map((node) => {
        const dim = activeCat && node.cat !== activeCat;
        const float = { animation: `nodefloat ${6 + (node.i % 4)}s ease-in-out ${node.i * 0.3}s infinite alternate` };
        const common = {
          'data-cursor': 'hover', 'aria-label': node.name,
          onMouseEnter: () => { setActiveCat(node.cat); setActiveKey(node.key); },
          onFocus: () => { setActiveCat(node.cat); setActiveKey(node.key); },
        };
        return (
          <div key={node.key} className="absolute" style={{ left: node.x, top: node.y, transform: 'translate(-50%,-50%)' }}>
            {node.icon ? (
              <button {...common} className="group relative grid place-items-center rounded-full transition-opacity duration-300"
                style={{ width: node.primary ? 60 : 48, height: node.primary ? 60 : 48, opacity: dim ? 0.26 : 1, ...float }}>
                <span className="absolute inset-0 rounded-full realm-card transition-transform duration-300 group-hover:scale-110"
                  style={node.primary ? { borderColor: 'rgba(var(--color-ember-rgb),0.5)' } : undefined} />
                <img src={node.icon} alt="" className="relative object-contain" style={{ width: node.primary ? 30 : 24, height: node.primary ? 30 : 24 }} />
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ top: '100%', marginTop: 4, color: 'var(--color-ember)' }}>{node.name}</span>
              </button>
            ) : (
              <button {...common} className="group relative whitespace-nowrap rounded-full realm-card transition-all duration-300 hover:scale-105"
                style={{
                  padding: node.primary ? '7px 14px' : '5px 12px',
                  fontSize: node.primary ? 13 : 12,
                  color: node.primary ? 'var(--color-ember)' : 'var(--color-text)',
                  opacity: dim ? 0.26 : 1, ...float,
                }}
                title={node.name}>
                {node.short}
              </button>
            )}
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
      <ChapterHeading no="03" eyebrow="The Arsenal" title="Tools of the Trade." align="center" />
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
