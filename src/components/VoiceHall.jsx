import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Lock, Check, Info, CornerDownLeft, Feather, Sparkles, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { voicesByCategory, voiceById, SEALED_VOICES } from '../i18n/voices';
import { playCue } from '../lib/sound';
import { sendRaven, EMAIL_RE } from '../lib/raven';
import { track } from '../lib/analytics';
import { getLenis } from '../lib/smoothScroll';
import { pushOverlay, popOverlay } from '../lib/uiOverlay';
import Hovercard from './Hovercard';
import RavenNotice from './RavenNotice';
import RavenBurst from './RavenBurst';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } };
const ITEM = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 330, damping: 26 } } };

// Attribution card body — who a voice is borrowed from (rendered in a portalled
// Hovercard so it can never be clipped by the scrolling Hall body).
const infoBody = (info) => (
  <>
    <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>{info.name}</p>
    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-ember)' }}>{info.source}</p>
    <p className="text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>{info.note}</p>
  </>
);

// One voice card — a collectible-style plate. Open/unlocked → a monogram medallion
// + label, selectable. The active narrator is marked with the ember border/wash
// plus a small corner tick (the prominent "Now narrating" read lives in the fixed
// spotlight above the list). Sealed → a wax-seal lock + the iconic quote + a
// "Clue —" line + an ⓘ reference tooltip.
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
        {locked ? <Lock size={14} /> : <span className="font-chronicle">{v.glyph}</span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className="voice-chip__label" style={{ fontStyle: locked ? 'italic' : 'normal' }}>
          {locked ? v.sample : v.label}
        </span>
        <span className="voice-chip__sub">{locked ? `Clue — ${v.hint}` : v.sample}</span>
      </span>
      {active && <span className="voice-chip__tick" aria-hidden="true"><Check size={12} /></span>}
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

/* The "Summon a Voice" panel — lives in the Hall's persistent right rail (always
   visible, no scrolling to reach it). A premium, framed invitation with the form
   fields inline; submits through the same raven endpoint as Contact and bursts
   into a celebratory confirmation. */
const VoiceRequest = () => {
  const { t } = useTranslation();
  const [persona, setPersona] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const sendRef = useRef(null);     // the raven flock erupts from the Send button…
  const originRef = useRef(null);   // …whose centre we capture before it swaps out

  const submit = async (e) => {
    e.preventDefault();
    if (!persona.trim() || !EMAIL_RE.test(email)) { playCue('error'); setState('error'); return; }
    // Capture the button's centre now — the form swaps to the done panel on
    // success, unmounting the button before the burst can read its position.
    const r = sendRef.current?.getBoundingClientRect();
    if (r) originRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    setState('sending');
    track('voice_summon_submit', { persona: persona.trim().slice(0, 60) }); // a visitor asked for a new voice
    // Shared dispatch — same endpoint + flight/refused sound as the Contact form.
    const result = await sendRaven({
      name: `Voice request — ${persona.trim()}`.slice(0, 110),
      email,
      message: `A visitor would love to hear the site in this voice:\n\n  ${persona.trim()}\n\n${note.trim() || '(no note left)'}`,
      inquiry: 'Voice request',
      company: '',
    });
    track(result.ok ? 'voice_summon_success' : 'voice_summon_error');
    setState(result.ok ? 'done' : 'error');
  };

  return (
    <aside className="voice-summon" aria-label={t('voiceHall.request.cta')}>
      <div className="voice-summon__aura" aria-hidden="true" />
      {/* The raven flock — erupts from the Send button on a successful summon,
          in time with the same raven cue the Contact form plays. */}
      <RavenBurst active={state === 'done'} origin={originRef.current} />
      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div key="done" className="voice-summon__done"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <span className="voice-summon__burst" aria-hidden="true">
              {[...Array(8)].map((_, i) => <i key={i} style={{ '--a': `${i * 45}deg` }} />)}
              <Sparkles size={22} />
            </span>
            <p className="voice-summon__donetitle font-chronicle">{t('voiceHall.request.done')}</p>
            <p className="voice-summon__donesub">{t('voiceHall.request.doneSub', { persona: persona.trim() })}</p>
          </motion.div>
        ) : (
          <motion.form key="form" className="voice-summon__form" onSubmit={submit}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate>
            <span className="voice-summon__crest"><Feather size={17} /></span>
            <h3 className="voice-summon__title font-chronicle">{t('voiceHall.request.cta')}</h3>
            {/* Intro line ↔ error share one slot at the top, so an error is seen
                instantly (no scrolling) and never grows the form past the modal. */}
            {state === 'error'
              ? <RavenNotice type="error">{t('voiceHall.request.error')}</RavenNotice>
              : <p className="voice-summon__lede">{t('voiceHall.request.ctaSub')}</p>}

            <label className="voice-summon__field">
              <span className="voice-summon__fieldlabel">{t('voiceHall.request.persona')}</span>
              <input
                value={persona} onChange={(e) => { setPersona(e.target.value); setState('idle'); }}
                placeholder={t('voiceHall.request.personaPlaceholder')} aria-label={t('voiceHall.request.persona')}
                className="voice-summon__input" data-cursor="hover" maxLength={80}
              />
            </label>
            <label className="voice-summon__field">
              <span className="voice-summon__fieldlabel">{t('voiceHall.request.email')}</span>
              <input
                type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
                placeholder={t('voiceHall.request.emailPlaceholder')} aria-label={t('voiceHall.request.email')}
                className="voice-summon__input" data-cursor="hover" maxLength={200}
              />
            </label>
            <label className="voice-summon__field">
              <span className="voice-summon__fieldlabel">{t('voiceHall.request.note')}</span>
              <input
                value={note} onChange={(e) => setNote(e.target.value)}
                placeholder={t('voiceHall.request.notePlaceholder')} aria-label={t('voiceHall.request.note')}
                className="voice-summon__input" data-cursor="hover" maxLength={200}
              />
            </label>

            <button ref={sendRef} type="submit" className="voice-summon__send" data-cursor="hover" disabled={state === 'sending'}>
              {state === 'sending'
                ? <><Loader2 size={15} className="animate-spin" /> {t('voiceHall.request.sending')}</>
                : <><Send size={15} /> {t('voiceHall.request.send')}</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </aside>
  );
};

/**
 * The Voice Hall — a cinematic overlay for picking who narrates the site. A wide
 * two-pane stage: a self-scrolling column of collectible voice plates (led by a
 * live "Now narrating" spotlight) beside a persistent "Summon a voice" rail, so
 * the request form is always in view — never buried beneath the roster. Picking a
 * voice keeps the Hall open and re-skins everything (this Hall included) in their
 * words, so visitors can try several in a row. Lifted open-state lives in
 * `useVoiceStore` (`hallOpen`) so the popover, recap constellation, and ⌘K map can
 * all summon it. Modeled on MapOverlay (backdrop, autofocus search, Escape close).
 */
const VoiceHall = () => {
  const { t } = useTranslation();
  const { hallOpen, closeHall, voice, setVoice, isUnlocked } = useVoiceStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!hallOpen) return undefined;
    setQuery('');
    // Hard-lock the page while the Hall is open. Lenis drives the whole-page
    // scroll, so we stop it AND set the document to overflow:hidden — the latter
    // is the backstop that keeps native wheel from chaining up to the document
    // when it bubbles out of (or past the end of) an inner scroll area. Inner
    // scrollers carry `data-lenis-prevent` + `overscroll-behavior:contain` so they
    // still scroll natively without leaking to the background.
    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    pushOverlay(); // hush the hero astrolabe behind the blur
    const f = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e) => { if (e.key === 'Escape') closeHall(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(f);
      window.removeEventListener('keydown', onKey);
      root.style.overflow = prevOverflow;
      lenis?.start();
      popOverlay();
    };
  }, [hallOpen, closeHall]);

  const q = query.trim().toLowerCase();
  const match = (v) =>
    !q || `${v.label} ${v.sample} ${v.hint || ''} ${v.info?.name || ''} ${v.info?.source || ''}`.toLowerCase().includes(q);

  const groups = voicesByCategory()
    .map((g) => ({ ...g, items: g.items.filter(match) }))
    .filter((g) => g.items.length);

  const discovered = SEALED_VOICES.filter((id) => isUnlocked(id)).length;
  const activeVoice = voiceById(voice);
  // Picking a voice keeps the Hall open — the copy (this Hall too) re-skins live,
  // inviting the visitor to try several before they close.
  const choose = (id) => { if (id !== voice) setVoice(id); };
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

          <motion.div className="voice-hall relative w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(88vh, 760px)' }}
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

            {/* two-pane stage: scrolling voices + persistent summon rail.
                data-lenis-prevent here lets the inner scroll areas (the roster, the
                rail/form on desktop, the whole stage on mobile) scroll natively
                instead of driving Lenis; the page itself is hard-locked above. */}
            <div className="voice-hall__stage" data-lenis-prevent>
              <div className="voice-hall__left">
                {/* fixed head — the live "Now narrating" spotlight + intro stay put
                    while the roster scrolls beneath, so the current voice is always
                    in view as the visitor tries others */}
                {!q && activeVoice && (
                  <div className="voice-hall__nowfixed">
                    <motion.div key={activeVoice.id} className="voice-spotlight"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
                      <span className="voice-spotlight__glyph font-chronicle">{activeVoice.glyph}</span>
                      <div className="min-w-0">
                        <p className="voice-spotlight__eyebrow">{t('voiceHall.nowNarrating')}</p>
                        <p className="voice-spotlight__name font-chronicle">{activeVoice.label}</p>
                        <p className="voice-spotlight__sample">{activeVoice.sample}</p>
                      </div>
                    </motion.div>
                    <p className="voice-hall__tryhint">{t('voiceHall.tryHint')}</p>
                  </div>
                )}

                {/* voices — data-lenis-prevent so the wheel scrolls THIS pane, not
                    the page behind it (Lenis hijacks wheel globally otherwise) */}
                <div className="voice-hall__voices" data-lenis-prevent>
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
                    <p className="px-2 py-10 text-center text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
                      {t('voiceHall.noResult')}
                    </p>
                  )}
                </div>
              </div>

              {/* persistent summon rail — always visible, no scroll to reach */}
              <VoiceRequest />
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
