import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSoundStore } from '../store/useSoundStore';
import { sound } from '../lib/sound';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };
const COLLAPSED = 48;
const EXPANDED = 248;

/**
 * Sound control — the audio half of the bottom-right control cluster (Phase 4).
 *
 * Three states, not two:
 *  • muted        — the visitor turned it off (`!enabled`).
 *  • armed/locked — on by preference but the browser autoplay gate is still shut
 *                   (`enabled && !unlocked`); nothing can be heard yet.
 *  • live         — `enabled && unlocked`; sound actually plays.
 *
 * The armed state is the landing state for almost every visitor. To avoid the
 * classic trap — a "turn on sound" coachmark pointing at a button whose normal
 * action is *mute* — the button is context-aware: while the gate is shut, a press
 * IS the unlock gesture (it opens the gate and keeps sound on, with an audible
 * confirm), never a mute. So following the coachmark does exactly what it says.
 * Past the gate the button is an ordinary mute/unmute toggle.
 */
const SoundControl = () => {
  const { t } = useTranslation();
  const { enabled, volume, unlocked, toggle, setVolume } = useSoundStore();
  const [expanded, setExpanded] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const liveBar = useRef(null);
  // Was the autoplay gate still shut at the moment this press began? Captured on
  // the button's own pointerdown (which fires before the global window unlock
  // listener), so the click handler can't be fooled by the gate opening mid-press.
  const pressLocked = useRef(false);

  const armed = enabled && !unlocked; // on by preference, but the browser holds it
  const live = enabled && unlocked;   // actually audible

  // Coachmark: appears a beat after landing while still locked, and dismisses the
  // instant we leave the armed state (the gate opens, or the visitor mutes).
  useEffect(() => {
    if (!armed) { setShowNote(false); return undefined; }
    const inT = setTimeout(() => setShowNote(true), 1200);
    return () => clearTimeout(inT);
  }, [armed]);

  const capturePress = () => { pressLocked.current = !sound.isUnlocked(); };

  const onPress = () => {
    if (pressLocked.current) {
      // First press while the browser gate is shut: this click is the unlock
      // gesture. Open it and keep sound ON (the confirm cue is immediate proof),
      // rather than muting. `unlock()` is idempotent if the global listener beat
      // us to it; `toggle()` only runs to recover a muted-yet-locked edge case.
      sound.unlock();
      if (!enabled) toggle();
      sound.playCue('confirm');
    } else {
      toggle();
    }
  };
  const onVolume = (e) => setVolume(parseFloat(e.target.value));

  return (
    <div
      className="relative"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Armed-but-locked coachmark — a clear, action-first invitation pointing at
          the speaker, which (above) genuinely turns sound on when pressed. */}
      <AnimatePresence>
        {showNote && armed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={JELLY}
            className="absolute bottom-full right-0 mb-3 w-56 origin-bottom-right rounded-2xl px-4 py-3 pointer-events-none"
            style={{
              background: 'color-mix(in srgb, var(--color-card-bg) 96%, transparent)',
              border: '1px solid var(--color-card-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p className="text-[12px] leading-snug" style={{ color: 'var(--color-text)' }}>
              {t('sound.enableHint')}
            </p>
            <span
              className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45"
              style={{ background: 'var(--color-card-bg)', borderRight: '1px solid var(--color-card-border)', borderBottom: '1px solid var(--color-card-border)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: expanded ? EXPANDED : COLLAPSED }}
        transition={JELLY}
        className="h-12 flex flex-row-reverse items-center overflow-hidden rounded-full"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* press = activate (while locked) or mute/unmute (once live) */}
        <motion.button
          onPointerDown={capturePress}
          onClick={onPress}
          data-cursor="hover"
          whileTap={{ scale: 0.88 }}
          transition={JELLY}
          aria-label={live ? t('sound.toggleOff') : t('sound.toggleOn')}
          aria-pressed={live}
          className="relative grid place-items-center flex-shrink-0 w-12 h-12"
        >
          {/* "Primed" pulse — shown ONLY while armed (locked). A plain conditional
              (not AnimatePresence) so it vanishes the very instant audio unlocks. */}
          {armed && (
            <motion.span
              className="absolute top-2 right-2 w-2 h-2 rounded-full pointer-events-none"
              style={{ background: 'var(--color-ember)' }}
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <span
            className="grid place-items-center w-9 h-9 rounded-full transition-colors"
            style={{
              // live = ember fill; armed = dormant-but-inviting; muted = neutral.
              background: live ? 'rgba(var(--color-ember-rgb),0.16)' : 'var(--color-card-bg)',
              color: live ? 'var(--color-ember)' : armed ? 'var(--color-text)' : 'var(--color-text-muted)',
              border: live ? 'none' : `1px solid ${armed ? 'rgba(var(--color-ember-rgb),0.5)' : 'var(--color-card-border)'}`,
            }}
          >
            {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </span>
        </motion.button>

        {/* revealed controls (left of the button, clipped when collapsed) */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2, delay: expanded ? 0.06 : 0 }}
          className="flex items-center gap-3 pl-4 pr-1 flex-shrink-0"
          style={{ width: EXPANDED - COLLAPSED }}
        >
          <span
            className="text-[10px] tracking-[0.18em] uppercase font-medium whitespace-nowrap"
            style={{ color: enabled ? 'var(--color-ember)' : 'var(--color-text-muted)' }}
          >
            {live ? t('sound.on') : armed ? t('sound.ready') : t('sound.off')}
          </span>
          <input
            ref={liveBar}
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={onVolume} aria-label={t('sound.volume')}
            className="vol-slider flex-1" style={{ minWidth: 70 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SoundControl;
