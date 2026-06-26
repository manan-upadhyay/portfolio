import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// A small hover/focus/tap popover that renders through a PORTAL to <body> with
// fixed positioning — so it can never be clipped (or trigger a stray scrollbar)
// inside an `overflow:auto` ancestor like a scrolling menu or the Voice Hall body.
// Anchored centered above the trigger, flipping below when near the top edge.
const Hovercard = ({ content, children, className = '', width = 220, ariaLabel }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = r.top < 180; // not enough room above → drop below
    setPos({ left: r.left + r.width / 2, y: below ? r.bottom + 8 : r.top - 8, below });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-expanded={open}
      data-cursor="hover"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen((o) => !o); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); } }}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: pos.below ? -4 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="hovercard"
              style={{ left: pos.left, top: pos.y, width, transform: `translate(-50%, ${pos.below ? '0' : '-100%'})` }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
};

export default Hovercard;
