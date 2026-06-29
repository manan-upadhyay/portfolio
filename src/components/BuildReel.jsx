import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Map, LayoutGrid, Route, Drama, CloudSun, Fingerprint, Feather, Gem, ChevronLeft, ChevronRight } from 'lucide-react';
import { playCue } from '../lib/sound';

/**
 * BuildReel — "The Director's Reel." The build, told as a film in nine scenes
 * (one per day). The visitor is the editor: there is NO auto-play. A draggable
 * playhead scrubs a film strip, frames are clickable, and ← → keys step through.
 * Whatever scene the playhead lands on snaps into the "monitor" above, large and
 * readable, one at a time. A single soft cue fires per scene change (time-gated
 * so a fast drag ratchets gently instead of bursting).
 *
 * Leans into the filmmaker identity (sprocketed strip, scene slate, frame
 * counter). Pure DOM/CSS + Framer Motion — crisp text, fully keyboard-operable,
 * touch-friendly (horizontal scrub, vertical page-scroll preserved), and static
 * under prefers-reduced-motion.
 *
 * Props:
 *  - data: [{ id, day, commits, glyph }] (from constants.atelier.reel)
 */
const GLYPHS = { sparkles: Sparkles, map: Map, grid: LayoutGrid, route: Route, drama: Drama, sky: CloudSun, fingerprint: Fingerprint, feather: Feather, gem: Gem };
const pad2 = (x) => String(x).padStart(2, '0');

const BuildReel = ({ data }) => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const n = data.length;
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const activeRef = useRef(0);   // mirror of `active` (avoids stale closures)
  const lastCue = useRef(0);     // timestamp gate so scrubbing never bursts sound

  const select = (idx, cue = true) => {
    const i = Math.max(0, Math.min(n - 1, idx));
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
    if (cue) {
      const now = performance.now();
      if (now - lastCue.current > 110) { playCue('blip'); lastCue.current = now; }
    }
  };

  const idxFromEvent = (e) => {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.floor(((e.clientX - r.left) / r.width) * n);
  };

  const onDown = (e) => { setDragging(true); trackRef.current?.setPointerCapture?.(e.pointerId); select(idxFromEvent(e)); };
  const onMove = (e) => { if (dragging) select(idxFromEvent(e)); };
  const onUp = (e) => { setDragging(false); trackRef.current?.releasePointerCapture?.(e.pointerId); };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); select(0); }
    else if (e.key === 'End') { e.preventDefault(); select(n - 1); }
  };

  const scene = data[active];
  const Glyph = GLYPHS[scene.glyph] ?? Sparkles;
  const sceneTitle = t(`atelier.reel.scenes.${scene.id}.title`);
  const playheadPct = ((active + 0.5) / n) * 100;

  return (
    <div className="reel">
      {/* the monitor — the scene currently under the playhead */}
      <div className="reel__monitor">
        <Glyph className="reel__monitor-ghost" aria-hidden="true" />
        <div className="reel__monitor-head">
          <span className="reel__scene-no exp-mono">{t('atelier.reel.scene')} {pad2(active + 1)} / {pad2(n)}</span>
          <span className="reel__scene-meta exp-mono">{scene.day} · {scene.commits} {t('atelier.reel.commits')}</span>
        </div>
        <motion.div
          key={scene.id}
          className="reel__monitor-body"
          initial={reduce ? false : { opacity: 0.4, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26 }}
        >
          <span className="reel__monitor-icon" aria-hidden="true"><Glyph size={20} strokeWidth={1.5} /></span>
          <h3 className="reel__scene-title">{sceneTitle}</h3>
          <p className="reel__scene-blurb">{t(`atelier.reel.scenes.${scene.id}.blurb`)}</p>
        </motion.div>
      </div>

      {/* the film strip — the scrubber */}
      <div className="reel__strip">
        <div
          ref={trackRef}
          className={`reel__track${dragging ? ' is-dragging' : ''}`}
          role="slider"
          tabIndex={0}
          aria-label={t('atelier.reel.aria')}
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={active + 1}
          aria-valuetext={`${sceneTitle} — ${scene.day}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          {data.map((s, i) => {
            const FG = GLYPHS[s.glyph] ?? Sparkles;
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={`reel__frame${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                onClick={() => select(i)}
              >
                <span className="reel__frame-no exp-mono">{pad2(i + 1)}</span>
                <span className="reel__frame-glyph"><FG size={15} strokeWidth={1.5} /></span>
                <span className="reel__frame-day exp-mono">{s.day}</span>
              </button>
            );
          })}
          <motion.span
            className="reel__playhead"
            aria-hidden="true"
            animate={{ left: `${playheadPct}%` }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
          />
        </div>
      </div>

      <div className="reel__hint">
        <button type="button" className="reel__nav" onClick={() => select(active - 1)} disabled={active === 0} aria-label={t('atelier.reel.prev')}>
          <ChevronLeft size={16} />
        </button>
        <span className="reel__hint-text exp-mono">{t('atelier.reel.hint')}</span>
        <button type="button" className="reel__nav" onClick={() => select(active + 1)} disabled={active === n - 1} aria-label={t('atelier.reel.next')}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BuildReel;
