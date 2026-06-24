import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Check, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { voices, SEALED_VOICES } from '../i18n/voices';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };

// One selectable / locked row in the voice menu.
const VoiceRow = ({ v, active, locked, onSelect }) => (
  <button
    type="button"
    role="menuitemradio"
    aria-checked={active}
    aria-disabled={locked || undefined}
    data-cursor="hover"
    onClick={locked ? undefined : onSelect}
    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-colors"
    style={{
      cursor: locked ? 'default' : 'pointer',
      background: active ? 'rgba(var(--color-ember-rgb),0.12)' : 'transparent',
      opacity: locked ? 0.55 : 1,
    }}
  >
    <span className="mt-0.5 grid place-items-center w-4 flex-shrink-0">
      {locked ? (
        <Lock size={12} style={{ color: 'var(--color-text-muted)' }} />
      ) : active ? (
        <Check size={13} style={{ color: 'var(--color-ember)' }} />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-card-border)' }} />
      )}
    </span>
    <span className="min-w-0">
      <span
        className="block text-[13px] font-medium leading-tight truncate"
        style={{ color: active ? 'var(--color-ember)' : 'var(--color-text)' }}
      >
        {locked ? '???' : v.label}
      </span>
      <span className="block text-[11px] leading-snug mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
        {v.sample}
      </span>
    </span>
  </button>
);

/**
 * Voice switcher — the left half of the bottom-right control cluster. A circular
 * quill button that opens a menu UPWARD (so it never collides with the audio
 * control to its right). Open voices are selectable; sealed easter-egg voices
 * show as `???` teasers ("Sealed Voices · n/total") so visitors KNOW there's
 * more to discover, without revealing the trigger. Click/tap driven (works on
 * touch); closes on outside-click or Escape.
 */
const VoiceSwitcher = () => {
  const { t } = useTranslation();
  const { voice, setVoice, isUnlocked } = useVoiceStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const openVoices = voices.filter((v) => !v.locked);
  const sealed = voices.filter((v) => v.locked);
  const discovered = SEALED_VOICES.filter((id) => isUnlocked(id)).length;

  const choose = (id) => { setVoice(id); setOpen(false); };

  return (
    <div ref={rootRef} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t('voice.ariaOpen')}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={JELLY}
            className="absolute bottom-full right-0 mb-3 w-64 origin-bottom-right rounded-2xl p-1.5"
            style={{
              background: 'color-mix(in srgb, var(--color-card-bg) 96%, transparent)',
              border: '1px solid var(--color-card-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p className="px-3 pt-2 pb-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              {t('voice.menuTitle')}
            </p>

            {openVoices.map((v) => (
              <VoiceRow key={v.id} v={v} active={voice === v.id} locked={false} onSelect={() => choose(v.id)} />
            ))}

            <div className="my-1.5 mx-3 h-px" style={{ background: 'var(--color-card-border)' }} />

            <p className="px-3 pb-1 text-[10px] tracking-[0.16em] uppercase font-medium flex items-center justify-between" style={{ color: 'var(--color-text-muted)' }}>
              <span>{t('voice.sealed')}</span>
              <span className="font-mono">{discovered}/{sealed.length}</span>
            </p>
            {sealed.map((v) => {
              const unlocked = isUnlocked(v.id);
              return (
                <VoiceRow
                  key={v.id}
                  v={v}
                  active={voice === v.id}
                  locked={!unlocked}
                  onSelect={() => choose(v.id)}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        whileTap={{ scale: 0.88 }}
        transition={JELLY}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('voice.ariaOpen')}
        className="grid place-items-center w-12 h-12 rounded-full"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <span
          className="grid place-items-center w-9 h-9 rounded-full"
          style={{ background: 'rgba(var(--color-ember-rgb),0.16)', color: 'var(--color-ember)' }}
        >
          <Feather size={15} />
        </span>
      </motion.button>
    </div>
  );
};

export default VoiceSwitcher;
