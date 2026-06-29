import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Check, Lock, Info, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { useCoachmark } from '../store/useCoachmark';
import { pushOverlay, popOverlay } from '../lib/uiOverlay';
import { trackOnce } from '../lib/analytics';
import { voices, SEALED_VOICES, POPOVER_SEALED_LIMIT, popoverVoices } from '../i18n/voices';
import Hovercard from './Hovercard';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };

// Attribution card body — who a voice is borrowed from (rendered in a portalled
// Hovercard so it can never be clipped by the popover's scroll container).
const infoBody = (info) => (
  <>
    <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>{info.name}</p>
    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-ember)' }}>{info.source}</p>
    <p className="text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>{info.note}</p>
  </>
);

// One row in the popover. Open/unlocked → label + selectable, ticked when active.
// Sealed (locked) → the iconic quote + a "Clue —" line + an ⓘ reference popover.
const VoiceRow = ({ v, active, locked, onSelect }) => (
  <div
    className="relative flex items-start gap-1 px-2 py-1.5 rounded-xl transition-colors"
    style={{ background: active ? 'rgba(var(--color-ember-rgb),0.12)' : 'transparent' }}
  >
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      aria-disabled={locked || undefined}
      data-cursor="hover"
      onClick={locked ? undefined : onSelect}
      className="flex items-start gap-2.5 text-left min-w-0 flex-1 px-1"
      style={{ cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.65 : 1 }}
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
          style={{ color: active ? 'var(--color-ember)' : 'var(--color-text)', fontStyle: locked ? 'italic' : 'normal' }}
        >
          {locked ? v.sample : v.label}
        </span>
        <span className="block text-[11px] leading-snug mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {locked ? `Clue — ${v.hint}` : v.sample}
        </span>
      </span>
    </button>

    {v.info && (
      <Hovercard
        className="mt-1 grid place-items-center w-5 h-5 rounded-full flex-shrink-0"
        width={210}
        ariaLabel={`What is this voice? ${v.info.name}, ${v.info.source}`}
        content={infoBody(v.info)}
      >
        <Info size={13} style={{ color: 'var(--color-text-muted)' }} />
      </Hovercard>
    )}
  </div>
);

// Sections that count as "deep enough in the journey" to surface the entice note.
const NOTE_AT = ['arsenal', 'projects', 'contact'];

// Module-scoped so it survives section changes AND route swaps (the cluster lives
// in the shared shell and never remounts between routes): the entice note gets
// exactly one turn per page load — like the Sound coachmark — rather than being
// permanently suppressed by a persisted flag (which is why it "never showed").
let enticeArmed = false;

/**
 * Voice switcher — the left half of the bottom-right control cluster. A circular
 * quill button (gently pulsing until the visitor first opens the Hall) that pops a
 * menu UPWARD. The menu is a deliberately short TEASER: a one-line "what is this"
 * subtitle, the OPEN voices, then up to POPOVER_SEALED_LIMIT sealed-voice clues
 * (with the full discovery count), and — when more voices exist than fit — a quiet
 * "+N more" line plus the primary CTA, both routing to the full Voice Hall. The
 * old "Marked Voices" group is retired to keep the menu uncluttered. Click/tap
 * driven; closes on outside-click/Escape.
 */
const VoiceSwitcher = ({ activeId }) => {
  const { t } = useTranslation();
  const { voice, setVoice, isUnlocked, openHall, markVoiceNoted } = useVoiceStore();
  const { active: activeCoach, request: requestCoach, release: releaseCoach } = useCoachmark();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const enticeTimers = useRef([]);
  // The entice note shows only while this control owns the shared coachmark stage
  // (and the menu is closed), so it never overlaps the Sound hint (see useCoachmark).
  const showNote = activeCoach === 'voice' && !open;

  useEffect(() => {
    if (!open) return undefined;
    pushOverlay(); // while the popover is open, hush the hero astrolabe behind it
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); popOverlay(); };
  }, [open]);

  // One-time entice note — once the visitor is engaged (reached the Arsenal or
  // beyond), a catchy bubble invites them to try the voices. Auto-dismisses ~11s;
  // permanently dismissed once they engage with the control.
  // Once the visitor reaches a deep section, claim the coachmark stage a beat
  // later (which preempts the Sound hint — closing it if it's still up) and yield
  // it after a spell. Timers are stored in a ref and cleared only on unmount, so
  // ongoing scrolling (which changes `activeId`) can never cancel the note's show
  // or its auto-dismiss mid-flight.
  useEffect(() => {
    if (enticeArmed || open || !NOTE_AT.includes(activeId)) return;
    enticeArmed = true;
    enticeTimers.current = [
      setTimeout(() => requestCoach('voice'), 700),
      setTimeout(() => releaseCoach('voice'), 11700),
    ];
  }, [activeId, open, requestCoach, releaseCoach]);

  useEffect(() => () => enticeTimers.current.forEach(clearTimeout), []);

  // Teaser rows, all popover-eligible + code-ordered (see voices.js `popover` /
  // `popoverOrder`). Open voices first; sealed clues capped at the limit so the
  // menu stays scannable. The discovery count and the "+N more" overflow signal
  // both read off the FULL roster, so nothing feels hidden — just deferred.
  const shown = popoverVoices();
  const openVoices = shown.filter((v) => !v.locked);
  const sealed = shown.filter((v) => v.locked).slice(0, POPOVER_SEALED_LIMIT);
  const discovered = SEALED_VOICES.filter((id) => isUnlocked(id)).length;
  // Voices not previewed here (open or sealed) — the reason to enter the Hall.
  const moreCount = voices.length - openVoices.length - sealed.length;

  const choose = (id) => { setVoice(id); setOpen(false); };
  const toggleMenu = () => { markVoiceNoted(); releaseCoach('voice'); if (!open) trackOnce('voice_switcher_open', 'voice_switcher_open'); setOpen((o) => !o); };
  const goHall = () => { setOpen(false); releaseCoach('voice'); openHall(); };
  const fromNote = () => { releaseCoach('voice'); markVoiceNoted(); trackOnce('voice_switcher_open', 'voice_switcher_open'); setOpen(true); };

  return (
    <div ref={rootRef} className="relative">
      {/* entice note */}
      <AnimatePresence>
        {showNote && !open && (
          <motion.button
            type="button"
            onClick={fromNote}
            data-cursor="hover"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={JELLY}
            className="voice-note"
          >
            <span className="voice-note__text">{t('voice.note')}</span>
            <ArrowRight size={14} className="flex-shrink-0" style={{ color: 'var(--color-ember)' }} />
            <span className="voice-note__tail" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t('voice.ariaOpen')}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={JELLY}
            data-lenis-prevent
            className="absolute bottom-full right-0 mb-3 w-[272px] origin-bottom-right rounded-2xl p-1.5 overflow-y-auto"
            style={{
              maxHeight: 'min(70vh, 540px)',
              overscrollBehavior: 'contain',
              background: 'color-mix(in srgb, var(--color-card-bg) 96%, transparent)',
              border: '1px solid var(--color-card-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="px-3 pt-2 pb-1.5">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {t('voice.menuTitle')}
              </p>
              <p className="text-[11px] leading-snug mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {t('voice.menuSub')}
              </p>
            </div>

            {openVoices.map((v) => (
              <VoiceRow key={v.id} v={v} active={voice === v.id} locked={false} onSelect={() => choose(v.id)} />
            ))}

            {/* sealed easter-egg voices — clue + reference, the discovery game.
                Capped at POPOVER_SEALED_LIMIT; the count stays the full roster. */}
            {sealed.length > 0 && (
              <>
                <div className="my-1.5 mx-3 h-px" style={{ background: 'var(--color-card-border)' }} />
                <p className="px-3 pb-1 text-[10px] tracking-[0.16em] uppercase font-medium flex items-center justify-between" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{t('voice.sealed')}</span>
                  <span className="font-mono">{discovered}/{SEALED_VOICES.length}</span>
                </p>
                <p className="px-3 pb-2 text-[11px] leading-snug" style={{ color: 'var(--color-text-muted)' }}>
                  {t('voice.sealedHint')}{' '}
                  <span style={{ color: 'var(--color-ember)' }}>{t('voice.sealedTypeHint')}</span>
                </p>
                {sealed.map((v) => (
                  <VoiceRow
                    key={v.id}
                    v={v}
                    active={voice === v.id}
                    locked={!isUnlocked(v.id)}
                    onSelect={() => choose(v.id)}
                  />
                ))}

                {/* overflow — quietly signals there are more voices than fit, and
                    routes to the Hall (the menu's "for more, open the Hall" cue) */}
                {moreCount > 0 && (
                  <button type="button" onClick={goHall} data-cursor="hover" className="voice-more">
                    <span>{t('voice.more', { count: moreCount })}</span>
                    <ArrowRight size={13} className="flex-shrink-0" />
                  </button>
                )}
              </>
            )}

            {/* CTA into the full command-palette picker */}
            <div className="my-1.5 mx-3 h-px" style={{ background: 'var(--color-card-border)' }} />
            <button type="button" onClick={goHall} data-cursor="hover" className="voice-hall-cta">
              <span className="flex-1 text-left leading-tight">
                <span className="block font-semibold">{t('voice.openHall')}</span>
                <span className="block text-[10.5px] font-normal opacity-80">
                  {discovered < SEALED_VOICES.length
                    ? t('voice.hallTeaserSome', { count: SEALED_VOICES.length - discovered })
                    : t('voice.hallTeaserAll')}
                </span>
              </span>
              <ArrowRight size={15} className="flex-shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggleMenu}
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
