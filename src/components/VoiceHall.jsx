import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Lock, Check, Info, CornerDownLeft, Feather, Sparkles, Send, Loader2, Plus, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { voicesByCategory, SEALED_VOICES } from '../i18n/voices';
import Hovercard from './Hovercard';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } };
const ITEM = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 26 } } };

// Attribution card body — who a voice is borrowed from (rendered in a portalled
// Hovercard so it can never be clipped by the scrolling Hall body).
const infoBody = (info) => (
  <>
    <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>{info.name}</p>
    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-ember)' }}>{info.source}</p>
    <p className="text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>{info.note}</p>
  </>
);

// One voice card. Open/unlocked → a monogram + label, selectable. Sealed → a
// lock + the iconic quote + a "Clue —" line + an ⓘ reference tooltip.
const VoiceChip = ({ v, active, locked, onSelect }) => (
  <motion.div variants={ITEM} className="voice-chip" data-active={active} data-locked={locked}>
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
      <Hovercard
        className="voice-chip__info"
        width={210}
        ariaLabel={`What is this voice? ${v.info.name}, ${v.info.source}`}
        content={infoBody(v.info)}
      >
        <Info size={13} />
      </Hovercard>
    )}
  </motion.div>
);

/* The gamified "Summon a Voice" tile — a collapsed call-to-action that unfolds
   into a tiny request form, submits through the same raven endpoint as Contact,
   and bursts into a celebratory confirmation. */
const VoiceRequest = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!persona.trim() || !EMAIL_RE.test(email)) { setState('error'); return; }
    setState('sending');
    try {
      const res = await fetch('/api/send-raven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Voice request — ${persona.trim()}`.slice(0, 110),
          email,
          message: `A visitor would love to hear the site in this voice:\n\n  ${persona.trim()}\n\n${note.trim() || '(no note left)'}`,
          inquiry: 'Voice request',
          company: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      setState(res.ok && data.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="voice-summon voice-summon--done">
        <span className="voice-summon__burst" aria-hidden="true">
          {[...Array(8)].map((_, i) => <i key={i} style={{ '--a': `${i * 45}deg` }} />)}
          <Sparkles size={22} />
        </span>
        <p className="voice-summon__donetitle font-chronicle">{t('voiceHall.request.done')}</p>
        <p className="voice-summon__donesub">{t('voiceHall.request.doneSub', { persona: persona.trim() })}</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="voice-summon voice-summon--cta" data-cursor="hover" onClick={() => setOpen(true)}>
        <span className="voice-summon__icon"><Plus size={18} /></span>
        <span className="min-w-0">
          <span className="voice-summon__title">{t('voiceHall.request.cta')}</span>
          <span className="voice-summon__sub">{t('voiceHall.request.ctaSub')}</span>
        </span>
        <Sparkles size={16} className="ml-auto flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
      </button>
    );
  }

  return (
    <form className="voice-summon voice-summon--form" onSubmit={submit}>
      <div className="flex items-center gap-2 mb-1">
        <button type="button" className="voice-summon__back" data-cursor="hover" onClick={() => { setOpen(false); setState('idle'); }} aria-label={t('voiceHall.request.back')}>
          <ArrowLeft size={14} />
        </button>
        <span className="voice-summon__title">{t('voiceHall.request.cta')}</span>
      </div>
      <input
        value={persona} onChange={(e) => { setPersona(e.target.value); setState('idle'); }}
        placeholder={t('voiceHall.request.personaPlaceholder')} aria-label={t('voiceHall.request.persona')}
        className="voice-summon__input font-chronicle text-[18px]" data-cursor="hover" autoFocus maxLength={80}
      />
      <div className="grid sm:grid-cols-2 gap-2">
        <input
          type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
          placeholder={t('voiceHall.request.emailPlaceholder')} aria-label={t('voiceHall.request.email')}
          className="voice-summon__input" data-cursor="hover" maxLength={200}
        />
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={t('voiceHall.request.notePlaceholder')} aria-label={t('voiceHall.request.note')}
          className="voice-summon__input" data-cursor="hover" maxLength={200}
        />
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        <button type="submit" className="voice-summon__send" data-cursor="hover" disabled={state === 'sending'}>
          {state === 'sending'
            ? <><Loader2 size={15} className="animate-spin" /> {t('voiceHall.request.sending')}</>
            : <><Send size={15} /> {t('voiceHall.request.send')}</>}
        </button>
        {state === 'error' && <span className="text-[12px]" style={{ color: 'var(--color-error)' }}>{t('voiceHall.request.error')}</span>}
      </div>
    </form>
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
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} onClick={closeHall} />

          <motion.div className="voice-hall relative w-full max-w-3xl rounded-3xl overflow-hidden"
            initial={{ scale: 0.94, y: 14, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}>

            {/* ambient backdrop — ember/gold aura + faint star dust */}
            <div className="voice-hall__aura" aria-hidden="true" />

            {/* header */}
            <div className="voice-hall__header">
              <span className="voice-hall__crest"><Feather size={18} /></span>
              <div className="min-w-0 flex-1">
                <h2 className="voice-hall__title font-chronicle">{t('voiceHall.title')}</h2>
                <p className="voice-hall__subtitle">{t('voiceHall.subtitle')}</p>
              </div>
              <button type="button" onClick={closeHall} aria-label={t('voiceHall.close')} data-cursor="hover"
                className="grid place-items-center w-8 h-8 rounded-lg flex-shrink-0" style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text-muted)' }}>
                <X size={15} />
              </button>
            </div>

            {/* search */}
            <form onSubmit={onSubmit} className="voice-hall__search">
              <Search size={17} style={{ color: 'var(--color-ember)' }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={t('voiceHall.searchPlaceholder')} data-cursor="hover"
                className="flex-1 bg-transparent outline-none text-[14.5px]" style={{ color: 'var(--color-text)' }} />
            </form>

            {/* voice groups — data-lenis-prevent so the wheel scrolls THIS panel,
                not the page behind it (Lenis hijacks wheel globally otherwise) */}
            <div className="voice-hall__body" data-lenis-prevent>
              {groups.map((g) => (
                <section key={g.id} className="voice-hall__group">
                  <p className="voice-hall__grouplabel">{t(`voiceHall.categories.${g.id}`)}</p>
                  <motion.div className="voice-hall__grid" variants={STAGGER} initial="hidden" animate="show">
                    {g.items.map((v) => (
                      <VoiceChip key={v.id} v={v} active={voice === v.id}
                        locked={v.locked && !isUnlocked(v.id)} onSelect={() => choose(v.id)} />
                    ))}
                  </motion.div>
                </section>
              ))}
              {groups.length === 0 && (
                <p className="px-5 py-10 text-center text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
                  {t('voiceHall.noResult')}
                </p>
              )}

              {/* gamified finale — request a voice */}
              {!q && (
                <section className="voice-hall__group">
                  <p className="voice-hall__grouplabel">{t('voiceHall.request.section')}</p>
                  <VoiceRequest />
                </section>
              )}
            </div>

            {/* footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3.5 border-t text-[11px]"
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
