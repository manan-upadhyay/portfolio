import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Search, Activity, AlertTriangle, GitBranch, ArrowRight } from 'lucide-react';
import { atelier } from '../constants';
import { playCue, sound } from '../lib/sound';
import CountUp from './CountUp';

/**
 * Observatory — "Instrumented, not surveilled." The senior-infrastructure moment
 * of the Atelier: privacy-first product analytics, discoverability (SEO), and
 * observability — including the Discord alert path — rendered as one instrument.
 *
 * The centrepiece is a living constellation paired with an always-visible event
 * index: every real product event (names + where-they-fire pulled straight from
 * constants.atelier.observatory, which mirrors the actual track()/trackOnce()
 * calls) orbits the glowing `session_recap` hub, colour-coded by surface. The
 * index lists all of them so a visitor never has to hover blindly; hovering or
 * focusing either a star OR its chip selects the event — the orbit pauses, the
 * star lifts, its chip lights, and the readout names what it watches and whether
 * it fires once per visit or every time. Below sit the metric readouts, the three
 * capability panels, and the webhook signal-flow.
 *
 * Pure SVG + CSS, theme-token driven (dark/light), static under
 * prefers-reduced-motion and on coarse pointers (the orbit is a CSS animation
 * gated by media queries; selection still works as a tap-to-read list).
 */
const PANEL_ICONS = { shield: ShieldCheck, search: Search, activity: Activity };
const WEBHOOK_ICONS = { alert: AlertTriangle, git: GitBranch };

const CX = 200;
const CY = 200;
const R = 152; // base orbit radius in the 400×400 viewBox

const Observatory = () => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { metrics, constellation, webhooks, panels } = atelier.observatory;
  const [selected, setSelected] = useState(null);

  // Flatten the grouped events into positioned nodes once, plus an id→node lookup
  // for the readout. Each group forms a contiguous coloured arc; a tiny per-node
  // radius jitter gives the field depth.
  const { nodes, byId, stepById } = useMemo(() => {
    const flat = constellation.groups.flatMap((g) => g.events.map((e) => ({ ...e, group: g.id })));
    const total = flat.length;
    const positioned = flat.map((node, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const r = R + (i % 2 ? -13 : 9);
      return {
        ...node,
        x: +(CX + r * Math.cos(angle)).toFixed(2),
        y: +(CY + r * Math.sin(angle)).toFixed(2),
      };
    });
    return {
      nodes: positioned,
      byId: Object.fromEntries(positioned.map((n) => [n.id, n])),
      stepById: Object.fromEntries(positioned.map((n, i) => [n.id, i])),
    };
  }, [constellation]);

  const active = selected ? byId[selected] : null;
  const paused = !reduce && !!active; // freeze the orbit the moment a star is read

  // Selecting an event (from a star OR its chip) lights it AND plays a pitched
  // hover note — sweeping the field fast resolves to a little pentatonic melody
  // rather than noise. Only fires on a genuinely new selection, so re-entering
  // the same chip is silent.
  const lastNote = useRef(null);
  const pick = (id) => {
    if (id !== lastNote.current) {
      lastNote.current = id;
      if (id != null) playCue('hoverNote', { step: stepById[id] ?? 0 });
    }
    setSelected(id);
  };

  // Continuous "orbit" buzz while the constellation field is hovered (sibling of
  // the face-particle lens buzz). Stops on leave + unmount.
  const enterField = () => sound.orbit.setLevel(1);
  const leaveField = () => { sound.orbit.setLevel(0); pick(null); };
  useEffect(() => () => sound.orbit.stop(), []);

  return (
    <div className="observatory">
      <div className="observatory__instrument">
        {/* The constellation — every named event orbiting the session-recap hub. */}
        <div className="observatory__viz" onMouseEnter={enterField} onMouseLeave={leaveField}>
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
            <g className={`obs-orbit${reduce ? ' is-static' : ''}${paused ? ' is-paused' : ''}${active ? ' has-active' : ''}`}>
              {nodes.map((node) => (
                <line
                  key={`s-${node.id}`}
                  className={`obs-spoke${selected === node.id ? ' is-active' : ''}`}
                  x1={CX} y1={CY} x2={node.x} y2={node.y}
                />
              ))}
              {nodes.map((node) => (
                <g
                  key={node.id}
                  className={`obs-node obs-node--${node.group}${selected === node.id ? ' is-active' : ''}`}
                  onMouseEnter={() => pick(node.id)}
                >
                  <circle className="obs-node__hit" cx={node.x} cy={node.y} r={11} />
                  <circle className="obs-node__dot" cx={node.x} cy={node.y} r={3.4} />
                </g>
              ))}
            </g>

            {/* the hub — the one per-visit summary every event folds into */}
            <g className="obs-hub" aria-hidden="true">
              <circle className="obs-hub__halo" cx={CX} cy={CY} r={30} />
              <circle className="obs-hub__core" cx={CX} cy={CY} r={13} />
            </g>
          </svg>

          {/* the readout — the selected event, or the hub framing at rest */}
          <div className="observatory__readout" aria-live="polite">
            {active ? (
              <>
                <span className="observatory__readout-name exp-mono">{active.id}</span>
                <span className={`observatory__readout-meta observatory__readout-meta--${active.group}`}>
                  <span className="observatory__legend-dot" aria-hidden="true" />
                  {t(`atelier.observatory.groups.${active.group}`)}
                  <span className="observatory__readout-cadence">{t(`atelier.observatory.cadence.${active.once ? 'once' : 'repeat'}`)}</span>
                </span>
                <span className="observatory__readout-where">{active.where}</span>
              </>
            ) : (
              <>
                <span className="observatory__readout-name exp-mono">{constellation.hub}</span>
                <span className="observatory__readout-note">{t('atelier.observatory.hubNote')}</span>
              </>
            )}
          </div>
        </div>

        {/* The index — every instrumented event, grouped + colour-coded, always
            visible so discovery never requires a blind hover. */}
        <div className="observatory__index" onMouseLeave={() => pick(null)}>
          <p className="observatory__index-hint">{t('atelier.observatory.indexHint')}</p>
          {constellation.groups.map((g) => (
            <div key={g.id} className={`observatory__group observatory__group--${g.id}`}>
              <div className="observatory__group-head">
                <span className="observatory__legend-dot" aria-hidden="true" />
                <span className="observatory__group-label">{t(`atelier.observatory.groups.${g.id}`)}</span>
                <span className="observatory__group-count exp-mono">{g.events.length}</span>
              </div>
              <ul className="observatory__chips">
                {g.events.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      className={`observatory__chip exp-mono${selected === e.id ? ' is-active' : ''}`}
                      aria-pressed={selected === e.id}
                      onMouseEnter={() => pick(e.id)}
                      onFocus={() => pick(e.id)}
                      onClick={() => pick(e.id)}
                    >
                      {e.id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

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

      {/* The alert path — webhook signal-flow: source → webhook → Discord. */}
      <div className="observatory__signals">
        <div className="observatory__signals-head">
          <h4 className="observatory__signals-title">{t('atelier.observatory.webhooks.title')}</h4>
          <p className="observatory__signals-caption">{t('atelier.observatory.webhooks.caption')}</p>
        </div>
        <ul className="observatory__flows">
          {webhooks.map((w) => {
            const Icon = WEBHOOK_ICONS[w.glyph] ?? AlertTriangle;
            return (
              <li key={w.id} className="observatory__flow">
                <span className="observatory__flow-stage observatory__flow-stage--source">
                  <Icon size={15} strokeWidth={1.7} aria-hidden="true" /> {w.source}
                </span>
                <ArrowRight className="observatory__flow-arrow" size={14} aria-hidden="true" />
                <span className="observatory__flow-stage observatory__flow-stage--hook exp-mono">{t('atelier.observatory.webhooks.hop')}</span>
                <ArrowRight className="observatory__flow-arrow" size={14} aria-hidden="true" />
                <span className="observatory__flow-stage observatory__flow-stage--discord exp-mono">Discord {w.channel}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="observatory__footnote">{t('atelier.observatory.footnote')}</p>
    </div>
  );
};

export default Observatory;
