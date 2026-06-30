import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Map, LayoutGrid, Route, Drama, CloudSun, Fingerprint, Feather, Gem, Activity, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { playCue, sound } from '../lib/sound';
import { trackOnce } from '../lib/analytics';

/**
 * BuildReel — "The Director's Reel." The build, told as a film, one scene per day.
 *
 * Interaction (revamped): a continuous, physics-eased playhead. On desktop the
 * playhead simply FOLLOWS the cursor across the strip — no click or drag required
 * (the whole point is instant discoverability); on touch you slide a finger across
 * it. The playhead springs toward the pointer with weight, and its live velocity
 * drives a film-transport whir (sound.reel) while crossing frames ticks a sprocket
 * detent and coming to rest thunks a settle. On first scroll-into-view it does a
 * one-time auto-sweep so the motion itself advertises "you can move this."
 *
 * Pure DOM/CSS + a single rAF that runs ONLY while moving (then stops): the
 * playhead position is written straight to the DOM (no per-frame React render);
 * only the active scene index is state. Keyboard (slider role, ← → / Home / End),
 * frame clicks, reduced-motion (instant, silent) and touch are all handled.
 *
 * Props:
 *  - data: [{ id, day, commits, glyph }] (from constants.atelier.reel)
 */
const GLYPHS = { sparkles: Sparkles, map: Map, grid: LayoutGrid, route: Route, drama: Drama, sky: CloudSun, fingerprint: Fingerprint, feather: Feather, gem: Gem, activity: Activity };
const pad2 = (x) => String(x).padStart(2, '0');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

const BuildReel = ({ data }) => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const n = data.length;
  const [active, setActive] = useState(0);

  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const playheadRef = useRef(null);
  const fillRef = useRef(null);

  const pos = useRef(0.5 / n);       // smoothed playhead position 0..1
  const target = useRef(0.5 / n);    // where the pointer wants it
  const prevPos = useRef(pos.current);
  const raf = useRef(0);
  const running = useRef(false);
  const activeRef = useRef(0);
  const lastCue = useRef(0);
  const restFrames = useRef(0);
  const moved = useRef(false);       // moved since last rest → play a settle
  const bedUp = useRef(false);
  const rect = useRef(null);
  const introDone = useRef(false);
  const introTimer = useRef(0);

  const ease = reduce ? 1 : 0.2;

  const ensureBed = () => { if (!bedUp.current) { bedUp.current = true; sound.reel.setLevel(1); } };

  const writeDOM = () => {
    if (playheadRef.current) playheadRef.current.style.left = `${pos.current * 100}%`;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${pos.current})`;
  };

  const syncActive = () => {
    const i = clamp(Math.floor(pos.current * n), 0, n - 1);
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
      trackOnce('buildreel_scrub', 'buildreel_scrub'); // did they direct the reel?
      const now = performance.now();
      if (now - lastCue.current > 55) { playCue('detent'); lastCue.current = now; } // sprocket tick
    }
  };

  const loop = () => {
    const tgt = target.current;
    const next = pos.current + (tgt - pos.current) * ease;
    pos.current = next;
    const vel = next - prevPos.current;   // pos-units per frame
    prevPos.current = next;
    writeDOM();
    syncActive();
    if (!reduce) sound.reel.setSpeed(vel * 60); // → pos-units/sec drives the whir
    if (Math.abs(vel) > 0.0008) moved.current = true;

    const atRest = Math.abs(tgt - next) < 0.0006 && Math.abs(vel) < 0.0004;
    if (atRest) {
      restFrames.current += 1;
      if (restFrames.current > 3) {            // settle → snap, hush the whir, STOP
        pos.current = tgt; writeDOM(); syncActive();
        sound.reel.setSpeed(0);
        if (moved.current) { playCue('settle'); moved.current = false; }
        running.current = false;
        return;
      }
    } else restFrames.current = 0;
    raf.current = requestAnimationFrame(loop);
  };

  const ensureLoop = () => {
    if (running.current) return;
    running.current = true;
    restFrames.current = 0;
    raf.current = requestAnimationFrame(loop);
  };

  const updateRect = () => { rect.current = trackRef.current?.getBoundingClientRect() || null; };
  const aimAtX = (clientX) => {
    const r = rect.current || trackRef.current?.getBoundingClientRect();
    if (!r) return;
    target.current = clamp((clientX - r.left) / r.width, 0, 1);
    ensureBed();
    ensureLoop();
  };
  const aimAtFrame = (i) => {
    target.current = (clamp(i, 0, n - 1) + 0.5) / n;
    ensureBed();
    ensureLoop();
  };

  const onEnter = () => updateRect();                 // cache geometry, don't grab yet
  const onMove = (e) => aimAtX(e.clientX);            // hover (desktop) / drag (touch)
  const onDown = (e) => { updateRect(); trackRef.current?.setPointerCapture?.(e.pointerId); aimAtX(e.clientX); };
  const onUp = (e) => trackRef.current?.releasePointerCapture?.(e.pointerId);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); aimAtFrame(activeRef.current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); aimAtFrame(activeRef.current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); aimAtFrame(0); }
    else if (e.key === 'End') { e.preventDefault(); aimAtFrame(n - 1); }
  };

  // First reveal: a one-time auto-sweep to the end and back — the motion teaches
  // the interaction. Skipped (static) under reduced-motion. Cleans up everything.
  useEffect(() => {
    writeDOM();
    const root = rootRef.current;
    if (!root) return undefined;
    const onResize = () => updateRect();
    window.addEventListener('resize', onResize);

    let io = null;
    if (!reduce) {
      io = new IntersectionObserver((ents) => {
        if (ents.some((e) => e.isIntersecting) && !introDone.current) {
          introDone.current = true;
          ensureBed();
          target.current = (n - 0.5) / n;           // sweep to the last scene…
          ensureLoop();
          introTimer.current = window.setTimeout(() => { target.current = 0.5 / n; ensureLoop(); }, 950); // …then back to scene 1
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(root);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      io?.disconnect();
      clearTimeout(introTimer.current);
      cancelAnimationFrame(raf.current);
      running.current = false;
      sound.reel.stop();
      bedUp.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, n]);

  const scene = data[active];
  const Glyph = GLYPHS[scene.glyph] ?? Sparkles;
  const sceneTitle = t(`atelier.reel.scenes.${scene.id}.title`);

  return (
    <div className="reel" ref={rootRef}>
      {/* the monitor — a viewfinder framing the scene under the playhead */}
      <div className="reel__monitor">
        <span className="reel__corner reel__corner--tl" aria-hidden="true" />
        <span className="reel__corner reel__corner--tr" aria-hidden="true" />
        <span className="reel__corner reel__corner--bl" aria-hidden="true" />
        <span className="reel__corner reel__corner--br" aria-hidden="true" />
        <span className="reel__scanlines" aria-hidden="true" />
        <Glyph className="reel__monitor-ghost" aria-hidden="true" />

        <div className="reel__monitor-head">
          <span className="reel__scene-no exp-mono">{t('atelier.reel.scene')} {pad2(active + 1)} / {pad2(n)}</span>
          <span className="reel__scene-meta exp-mono">{scene.day} · {scene.commits} {t('atelier.reel.commits')}</span>
        </div>

        {/* Scenes are grid-stacked in one cell → the monitor reserves the tallest
            scene's height, so scrubbing never reflows the page (no layout shift). */}
        <div className="reel__monitor-body">
          {data.map((s, i) => {
            const SG = GLYPHS[s.glyph] ?? Sparkles;
            const isActive = i === active;
            return (
              <motion.div
                key={s.id}
                className={`reel__scene${isActive ? ' is-active' : ''}`}
                aria-hidden={!isActive}
                initial={false}
                animate={reduce ? { opacity: isActive ? 1 : 0 } : { opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                transition={{ duration: 0.26 }}
              >
                <span className="reel__monitor-icon" aria-hidden="true"><SG size={20} strokeWidth={1.5} /></span>
                <h3 className="reel__scene-title">{t(`atelier.reel.scenes.${s.id}.title`)}</h3>
                <p className="reel__scene-blurb">{t(`atelier.reel.scenes.${s.id}.blurb`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* the film transport — move across it to scrub */}
      <div className="reel__strip">
        <div
          ref={trackRef}
          className="reel__track"
          role="slider"
          tabIndex={0}
          aria-label={t('atelier.reel.aria')}
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={active + 1}
          aria-valuetext={`${sceneTitle} — ${scene.day}`}
          onPointerEnter={onEnter}
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <span className="reel__fill" ref={fillRef} aria-hidden="true" />
          {data.map((s, i) => {
            const FG = GLYPHS[s.glyph] ?? Sparkles;
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={`reel__frame${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                onClick={() => aimAtFrame(i)}
              >
                <span className="reel__frame-no exp-mono">{pad2(i + 1)}</span>
                <span className="reel__frame-glyph"><FG size={15} strokeWidth={1.5} /></span>
                <span className="reel__frame-day exp-mono">{s.day}</span>
              </button>
            );
          })}
          <span className="reel__playhead" ref={playheadRef} aria-hidden="true">
            <span className="reel__playhead-knob" />
          </span>
        </div>
      </div>

      <div className="reel__hint">
        <button type="button" className="reel__nav" onClick={() => aimAtFrame(activeRef.current - 1)} disabled={active === 0} aria-label={t('atelier.reel.prev')}>
          <ChevronLeft size={16} />
        </button>
        <span className="reel__hint-text exp-mono">
          <MoveHorizontal className="reel__hint-ptr" size={14} aria-hidden="true" />
          {t('atelier.reel.hint')}
        </span>
        <button type="button" className="reel__nav" onClick={() => aimAtFrame(activeRef.current + 1)} disabled={active === n - 1} aria-label={t('atelier.reel.next')}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BuildReel;
