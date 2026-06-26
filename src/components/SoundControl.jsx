import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSoundStore } from '../store/useSoundStore';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };
const COLLAPSED = 48;
const EXPANDED = 248;

/**
 * Sound control — the audio half of the bottom-right control cluster (Phase 4).
 * The collapsed circle toggles master sound (mute ↔ on, with an audible confirm);
 * hovering springs it open to reveal a volume slider. Because the cluster is a
 * normal flex row, this growing leftward naturally pushes the voice switcher left.
 *
 * Onboarding: while the visitor hasn't engaged with the page yet, a one-time hover
 * note invites turning sound on; it auto-dismisses after ~10s and permanently once
 * any gesture occurs (which also unlocks the AudioContext via `sound.arm()`).
 */
const SoundControl = () => {
  const { t } = useTranslation();
  const { enabled, volume, engaged, toggle, setVolume, markEngaged } = useSoundStore();
  const [expanded, setExpanded] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const liveBar = useRef(null);

  // One-time onboarding note: appears shortly after load, auto-dismisses at ~10s,
  // and is killed permanently by the first gesture (also our audio-unlock signal).
  useEffect(() => {
    if (engaged) { setShowNote(false); return undefined; }
    const inT = setTimeout(() => setShowNote(true), 1500);
    const outT = setTimeout(() => setShowNote(false), 11500);
    const onGesture = () => markEngaged();
    window.addEventListener('pointerdown', onGesture, { once: true });
    window.addEventListener('keydown', onGesture, { once: true });
    return () => {
      clearTimeout(inT); clearTimeout(outT);
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [engaged, markEngaged]);

  const onToggle = () => { markEngaged(); toggle(); };
  const onVolume = (e) => { markEngaged(); setVolume(parseFloat(e.target.value)); };

  return (
    <div
      className="relative"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* onboarding hover note */}
      <AnimatePresence>
        {showNote && !engaged && (
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
        {/* mute / unmute — always visible (anchored right) */}
        <motion.button
          onClick={onToggle}
          data-cursor="hover"
          whileTap={{ scale: 0.88 }}
          transition={JELLY}
          aria-label={enabled ? t('sound.toggleOff') : t('sound.toggleOn')}
          aria-pressed={enabled}
          className="grid place-items-center flex-shrink-0 w-12 h-12"
        >
          <span
            className="grid place-items-center w-9 h-9 rounded-full transition-colors"
            style={{
              background: enabled ? 'rgba(var(--color-ember-rgb),0.16)' : 'var(--color-card-bg)',
              color: enabled ? 'var(--color-ember)' : 'var(--color-text-muted)',
              border: enabled ? 'none' : '1px solid var(--color-card-border)',
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
            {enabled ? t('sound.on') : t('sound.off')}
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
