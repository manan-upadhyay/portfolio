import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Search, Activity } from 'lucide-react';
import { atelier } from '../constants';
import CountUp from './CountUp';

/**
 * Observatory — "Instrumented, not surveilled." The senior-infrastructure moment
 * of the Atelier: the privacy-first product-analytics, discoverability (SEO), and
 * observability stack, rendered as one instrument.
 *
 * The centrepiece is a living SVG constellation: every real product event (the
 * names are pulled straight from constants.atelier.observatory.constellation, which
 * mirrors the actual track()/trackOnce() calls in the code) orbits the glowing
 * `session_recap` hub, colour-coded by the surface it instruments. Beneath it sit
 * four animated metric readouts and three capability panels.
 *
 * Pure SVG + CSS — crisp at any size, fully theme-token driven (dark/light), and
 * static under prefers-reduced-motion (the orbit + hub pulse are CSS animations
 * gated by the media query). Each node carries a <title> with its real event name,
 * so a curious visitor can hover any star and read the instrumentation behind it.
 */
const PANEL_ICONS = { shield: ShieldCheck, search: Search, activity: Activity };

const CX = 200;
const CY = 200;
const R = 152; // base orbit radius in the 400×400 viewBox

const Observatory = () => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { metrics, constellation, panels } = atelier.observatory;

  // Flatten the grouped event names into positioned nodes once. Each group forms
  // a contiguous coloured arc; a tiny per-node radius jitter gives the field depth.
  const nodes = useMemo(() => {
    const flat = constellation.groups.flatMap((g) => g.names.map((name) => ({ name, group: g.id })));
    const total = flat.length;
    return flat.map((node, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const r = R + (i % 2 ? -13 : 9);
      return {
        ...node,
        x: +(CX + r * Math.cos(angle)).toFixed(2),
        y: +(CY + r * Math.sin(angle)).toFixed(2),
      };
    });
  }, [constellation]);

  return (
    <div className="observatory">
      {/* The constellation — every named event orbiting the session-recap hub. */}
      <div className="observatory__viz">
        <svg
          className="observatory__sky"
          viewBox="0 0 400 400"
          role="img"
          aria-label={t('atelier.observatory.title')}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* faint guide rings */}
          <circle className="obs-ring" cx={CX} cy={CY} r={R + 9} />
          <circle className="obs-ring obs-ring--dashed" cx={CX} cy={CY} r={R - 40} />

          {/* spokes + nodes rotate together; the hub stays still */}
          <g className={`obs-orbit${reduce ? ' is-static' : ''}`}>
            {nodes.map((node) => (
              <line key={`s-${node.name}`} className="obs-spoke" x1={CX} y1={CY} x2={node.x} y2={node.y} />
            ))}
            {nodes.map((node) => (
              <g key={node.name} className={`obs-node obs-node--${node.group}`}>
                <title>{node.name}</title>
                <circle cx={node.x} cy={node.y} r={3.4} />
              </g>
            ))}
          </g>

          {/* the hub — the one per-visit summary every event folds into */}
          <g className="obs-hub" aria-hidden="true">
            <circle className="obs-hub__halo" cx={CX} cy={CY} r={30} />
            <circle className="obs-hub__core" cx={CX} cy={CY} r={13} />
          </g>
        </svg>

        <div className="observatory__hub-label">
          <span className="observatory__hub-name exp-mono">{constellation.hub}</span>
          <span className="observatory__hub-note">{t('atelier.observatory.hubNote')}</span>
        </div>
      </div>

      {/* the legend — what each colour of star instruments */}
      <ul className="observatory__legend" aria-label={t('atelier.observatory.title')}>
        {constellation.groups.map((g) => (
          <li key={g.id} className={`observatory__legend-item observatory__legend-item--${g.id}`}>
            <span className="observatory__legend-dot" aria-hidden="true" />
            <span className="observatory__legend-label">{t(`atelier.observatory.groups.${g.id}`)}</span>
            <span className="observatory__legend-count exp-mono">{g.names.length}</span>
          </li>
        ))}
      </ul>

      {/* the readouts */}
      <dl className="observatory__metrics">
        {metrics.map((m) => (
          <div key={m.key} className="observatory__metric">
            <dt className="observatory__metric-value">
              {m.count ? <CountUp value={m.value} /> : m.value}
            </dt>
            <dd className="observatory__metric-label">{t(`atelier.observatory.metrics.${m.key}`)}</dd>
          </div>
        ))}
      </dl>

      {/* the three instrument panels */}
      <div className="observatory__panels">
        {panels.map((p, i) => {
          const Icon = PANEL_ICONS[p.glyph] ?? Activity;
          return (
            <motion.div
              key={p.id}
              className="observatory__panel"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="observatory__panel-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
              <h4 className="observatory__panel-title">{t(`atelier.observatory.panels.${p.id}.title`)}</h4>
              <p className="observatory__panel-body">{t(`atelier.observatory.panels.${p.id}.body`)}</p>
              <div className="observatory__panel-tags">
                {p.tags.map((tag) => (
                  <span key={tag} className="observatory__tag exp-mono">{tag}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="observatory__footnote">{t('atelier.observatory.footnote')}</p>
    </div>
  );
};

export default Observatory;
