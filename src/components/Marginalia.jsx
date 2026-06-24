import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// MARGINALIA — flavor meets substance (LEGENDARY-ROADMAP §2).
//
// A flavor phrase carries a dotted underline + a superscript dagger (†, the
// classic footnote rune). Hover/focus/tap unfolds a margin note with the real
// engineering fact behind the flourish — so the fantasy earns its keep. The note
// text is PLAIN substance in every voice (authored once under `marginalia.<id>`
// in the chronicle bundle; other voices fall back to it).
//
// Authoring: copy lives in the i18n bundles as usual; wrap the phrase to annotate
// inline with the marker `[[id|the flavor phrase]]`, then render that string
// through <Annotated text={t('…')} />. Strings without a marker pass straight
// through, so it's safe everywhere / in every voice.
//
// The note renders through a PORTAL to <body> with fixed positioning so it can
// never be clipped by an `overflow:hidden` ancestor (e.g. the contact submit
// button's shine-sweep mask).

const TIP_STYLE = {
  background: 'color-mix(in srgb, var(--color-card-bg) 98%, transparent)',
  border: '1px solid var(--color-card-border)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: 'var(--shadow-card)',
};

const Marginalia = ({ id, children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const tipId = useId();
  const note = t(`marginalia.${id}`);

  // Anchor the portalled note to the trigger (centered above it). Recomputed on
  // open and kept in sync while open (scroll/resize) so it tracks the phrase.
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ left: r.left + r.width / 2, top: r.top });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  // Tap-opened notes close on an outside pointer / Escape (mouse uses hover).
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Self-contained: stop clicks/keys from reaching a parent (e.g. the contact
  // submit button) so revealing the note never also triggers the parent action.
  const toggle = (e) => { e.stopPropagation(); setOpen((o) => !o); };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }
  };

  return (
    <span
      ref={triggerRef}
      className="marginalia"
      role="button"
      tabIndex={0}
      data-cursor="hover"
      aria-describedby={open ? tipId : undefined}
      aria-expanded={open}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {children}
      <sup className="marginalia__rune" aria-hidden="true">†</sup>
      {createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.span
              role="tooltip"
              id={tipId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="marginalia__note"
              style={{ ...TIP_STYLE, left: pos.left, top: pos.top }}
            >
              {note}
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
};

// Splits a translated string on `[[id|phrase]]` markers, rendering each marked
// phrase as a <Marginalia>. No marker (or a non-string) → returns the value
// as-is, so every voice and every call site is safe to wrap.
const MARK = /\[\[([a-zA-Z0-9-]+)\|([\s\S]+?)\]\]/g;

export const Annotated = ({ text }) => {
  if (typeof text !== 'string' || !text.includes('[[')) return <>{text}</>;

  const parts = [];
  let last = 0;
  let key = 0;
  let m;
  MARK.lastIndex = 0;
  while ((m = MARK.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<Marginalia key={key++} id={m[1]}>{m[2]}</Marginalia>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
};

export default Marginalia;
