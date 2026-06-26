import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Lock, Check, Info, CornerDownLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { voicesByCategory, SEALED_VOICES } from '../i18n/voices';

// Attribution popover (mirrors VoiceSwitcher's) — who a voice is borrowed from.
const InfoTip = ({ info }) => (
  <motion.div
    role="tooltip"
    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
    transition={{ duration: 0.16 }}
    className="voice-hall__tip"
  >
    <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>{info.name}</p>
    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-ember)' }}>{info.source}</p>
    <p className="text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>{info.note}</p>
  </motion.div>
);

// One voice card. Open/unlocked → a monogram + label, selectable. Sealed → a
// lock + the iconic quote + a "Clue —" line + an ⓘ reference tooltip.
const VoiceChip = ({ v, active, locked, onSelect }) => {
  const [tip, setTip] = useState(false);
  return (
    <div className="voice-chip" data-active={active} data-locked={locked}>
      <button
        type="button"
        role="option"
        aria-selected={active}
        aria-disabled={locked || undefined}
        data-cursor="hover"
        onClick={locked ? undefined : onSelect}
        className="voice-chip__hit"
        style={{ cursor: locked ? 'default' : 'pointer' }}
      >
        <span className="voice-chip__glyph">
          {locked ? <Lock size={14} /> : active ? <Check size={15} /> : <span className="font-chronicle">{v.glyph}</span>}
        </span>
        <span className="min-w-0 flex-1">
          <span className="voice-chip__label" style={{ fontStyle: locked ? 'italic' : 'normal' }}>
            {locked ? v.sample : v.label}
          </span>
          <span className="voice-chip__sub">{locked ? `Clue — ${v.hint}` : v.sample}</span>
        </span>
      </button>

      {v.info && (
        <button type="button" data-cursor="hover" className="voice-chip__info"
          aria-label={`What is this voice? ${v.info.name}, ${v.info.source}`}
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}
          onFocus={() => setTip(true)} onBlur={() => setTip(false)}>
          <Info size={13} />
        </button>
      )}
      <AnimatePresence>{tip && v.info && <InfoTip info={v.info} />}</AnimatePresence>
    </div>
  );
};

/**
 * The Voice Hall — a ⌘-palette-style overlay for picking a voice. Built to scale
 * to many personalities: a search box + category sections + compact cards.
 * Open voices switch on click; sealed ones tease their clue + reference. Lifted
 * open-state lives in `useVoiceStore` (`hallOpen`) so the bottom-right popover,
 * the recap constellation, and the ⌘K map can all summon it. Modeled on
 * MapOverlay (backdrop, autofocus search, Escape/outside-click close).
 */
const VoiceHall = () => {
  const { t } = useTranslation();
  const { hallOpen, closeHall, voice, setVoice, isUnlocked } = useVoiceStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!hallOpen) return undefined;
    setQuery('');
    const f = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e) => { if (e.key === 'Escape') closeHall(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(f); window.removeEventListener('keydown', onKey); };
  }, [hallOpen, closeHall]);

  const q = query.trim().toLowerCase();
  const match = (v) =>
    !q || `${v.label} ${v.sample} ${v.hint || ''} ${v.info?.name || ''} ${v.info?.source || ''}`.toLowerCase().includes(q);

  const groups = voicesByCategory()
    .map((g) => ({ ...g, items: g.items.filter(match) }))
    .filter((g) => g.items.length);

  const discovered = SEALED_VOICES.filter((id) => isUnlocked(id)).length;
  const choose = (id) => { setVoice(id); closeHall(); };
  const onSubmit = (e) => {
    e.preventDefault();
    const first = groups.flatMap((g) => g.items).find((v) => isUnlocked(v.id));
    if (first) choose(first.id);
  };

  return (
    <AnimatePresence>
      {hallOpen && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog" aria-modal="true" aria-label={t('voiceHall.title')}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }} onClick={closeHall} />

          <motion.div className="voice-hall relative w-full max-w-3xl rounded-3xl overflow-hidden"
            initial={{ scale: 0.94, y: 14, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}>

            {/* search */}
            <form onSubmit={onSubmit} className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
              <Search size={18} style={{ color: 'var(--color-ember)' }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={t('voiceHall.searchPlaceholder')} data-cursor="hover"
                className="flex-1 bg-transparent outline-none text-[15px]" style={{ color: 'var(--color-text)' }} />
              <button type="button" onClick={closeHall} aria-label={t('voiceHall.close')} data-cursor="hover"
                className="grid place-items-center w-7 h-7 rounded-lg" style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text-muted)' }}>
                <X size={15} />
              </button>
            </form>

            {/* voice groups */}
            <div className="voice-hall__body">
              {groups.map((g) => (
                <section key={g.id} className="voice-hall__group">
                  <p className="voice-hall__grouplabel">{t(`voiceHall.categories.${g.id}`)}</p>
                  <div className="voice-hall__grid">
                    {g.items.map((v) => (
                      <VoiceChip key={v.id} v={v} active={voice === v.id}
                        locked={v.locked && !isUnlocked(v.id)} onSelect={() => choose(v.id)} />
                    ))}
                  </div>
                </section>
              ))}
              {groups.length === 0 && (
                <p className="px-5 py-10 text-center text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
                  {t('voiceHall.noResult')}
                </p>
              )}
            </div>

            {/* footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 border-t text-[11px]"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-muted)' }}>
              <span>{t('voiceHall.sealedHint')}</span>
              <span className="ml-auto inline-flex items-center gap-3">
                <span className="font-mono uppercase tracking-wider">{t('voiceHall.found', { count: discovered, total: SEALED_VOICES.length })}</span>
                <span className="hidden sm:inline-flex items-center gap-1.5"><CornerDownLeft size={12} /> {t('voiceHall.footerHint')}</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceHall;
