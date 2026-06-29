import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Sun, Sunset, Moon, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/useThemeStore';
import { pushOverlay, popOverlay } from '../lib/uiOverlay';
import DayNightToggle from './DayNightToggle';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };

// Lucide glyph per sky / mode. `auto` borrows the icon of the sky it currently
// resolves to (handled below); the menu row for `auto` uses the clock.
const SKY_ICON = { dawn: Sunrise, day: Sun, dusk: Sunset, night: Moon };
const MODES = ['auto', 'dawn', 'day', 'dusk', 'night'];

/**
 * Sky control — wraps the existing sun/moon toggle (kept exactly as the primary
 * light↔dark flip) with a 5-mode menu: Auto (time-driven, default) / Dawn / Day /
 * Dusk / Night. The trigger pill doubles as a status chip — it shows the *current
 * sky* and, in auto, that the site is "following" it. Click/tap driven; closes on
 * outside-click / Escape. Opens DOWNWARD (the cluster hugs the top-right corner).
 */
const SkyControl = () => {
  const { t } = useTranslation();
  const { mode, resolvedSky, setMode } = useThemeStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    pushOverlay(); // while the sky menu is open, hush the hero astrolabe behind it
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); popOverlay(); };
  }, [open]);

  // The trigger always reflects the *resolved* sky so it reads as a live status.
  const TriggerIcon = SKY_ICON[resolvedSky] || Moon;
  const choose = (id) => { setMode(id); setOpen(false); };

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t('sky.ariaOpen')}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={JELLY}
            className="absolute top-full right-0 mt-3 w-52 origin-top-right rounded-2xl p-1.5"
            style={{
              background: 'color-mix(in srgb, var(--color-card-bg) 96%, transparent)',
              border: '1px solid var(--color-card-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p className="px-3 pt-2 pb-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              {t('sky.menuTitle')}
            </p>
            {MODES.map((id) => {
              const active = mode === id;
              const Icon = id === 'auto' ? Clock : SKY_ICON[id];
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  data-cursor="hover"
                  onClick={() => choose(id)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-left transition-colors"
                  style={{ background: active ? 'rgba(var(--color-ember-rgb),0.12)' : 'transparent' }}
                >
                  <span className="grid place-items-center w-4 flex-shrink-0">
                    <Icon size={14} style={{ color: active ? 'var(--color-ember)' : 'var(--color-text-muted)' }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium leading-tight" style={{ color: active ? 'var(--color-ember)' : 'var(--color-text)' }}>
                      {t(`sky.modes.${id}`)}
                    </span>
                    {id === 'auto' && (
                      <span className="block text-[11px] leading-snug mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        {t('sky.autoFollowing', { sky: t(`sky.modes.${resolvedSky}`).toLowerCase() })}
                      </span>
                    )}
                  </span>
                  {active && <Check size={13} className="flex-shrink-0" style={{ color: 'var(--color-ember)' }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status / mode-menu trigger — the live sky chip. */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        whileTap={{ scale: 0.92 }}
        transition={JELLY}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('sky.ariaOpen')}
        className="flex items-center gap-1.5 h-9 pl-2.5 pr-3 rounded-full"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <TriggerIcon size={14} style={{ color: 'var(--color-ember)' }} />
        <span className="text-[12px] font-medium tracking-wide" style={{ color: 'var(--color-text)' }}>
          {t(`sky.modes.${mode}`)}
        </span>
      </motion.button>

      {/* The primary toggle — unchanged. */}
      <DayNightToggle />
    </div>
  );
};

export default SkyControl;
