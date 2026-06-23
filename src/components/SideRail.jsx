import { useState } from 'react';
import { motion } from 'framer-motion';
import { scrollToSection, scrollToTop } from '../lib/smoothScroll';
import { useThemeStore } from '../store/useThemeStore';
import CompassRose from './CompassRose';

export const CHAPTERS = [
  { id: 'origin', no: '00', label: 'Origin' },
  { id: 'about', no: '01', label: 'The Craft' },
  { id: 'work', no: '02', label: 'The Journey' },
  { id: 'arsenal', no: '03', label: 'The Arsenal' },
  { id: 'projects', no: '04', label: 'The Realms' },
  { id: 'contact', no: '05', label: 'Summon' },
];

// Springy "jelly" physics — a touch of overshoot, settles naturally.
const JELLY = { type: 'spring', stiffness: 320, damping: 22, mass: 0.7 };
const COLLAPSED = 56;
const EXPANDED = 232;

// One rail row — number cell stays put (centred when collapsed); label slides
// in on expand. Shared by the sigil, chapters and the map button.
const Row = ({ no, glyph, label, kbd, active, expanded, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    data-cursor="hover"
    aria-label={ariaLabel}
    aria-current={active ? 'true' : undefined}
    className="relative flex items-center w-full h-9 rounded-xl"
  >
    <span
      className="absolute inset-0 rounded-xl transition-opacity duration-300"
      style={{ background: 'rgba(var(--color-ember-rgb),0.1)', opacity: active ? 1 : 0 }}
    />
    {active && (
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full"
        style={{ background: 'var(--color-ember)' }}
      />
    )}
    <span
      className="relative grid place-items-center flex-shrink-0"
      style={{ width: COLLAPSED - 12 }}
    >
      {glyph || (
        <span
          className="text-[11px] font-mono"
          style={{ color: active ? 'var(--color-ember)' : 'var(--color-text-muted)' }}
        >
          {no}
        </span>
      )}
    </span>
    <motion.span
      animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative whitespace-nowrap text-[13.5px] font-medium flex items-center gap-2"
      style={{ color: active ? 'var(--color-text)' : 'var(--color-text-muted)' }}
    >
      {label}
      {kbd && <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>}
    </motion.span>
  </button>
);

/**
 * Collapsible glass side-rail (breedlove-style). Collapsed it's a slim pill of
 * chapter numbers, vertically centred; on hover it springs open to reveal the
 * chapter labels. Persistent across the whole page.
 */
const SideRail = ({ activeId, onOpenMap, visible }) => {
  const [expanded, setExpanded] = useState(false);
  const { resolvedTheme } = useThemeStore();
  const crest = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <motion.nav
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="hidden md:block fixed left-4 top-1/2 z-40"
      style={{ translateY: '-50%', pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
      aria-label="Chapters"
    >
      <motion.div
        animate={{ width: expanded ? EXPANDED : COLLAPSED }}
        transition={JELLY}
        className="overflow-hidden rounded-[20px] p-1.5 flex flex-col gap-0.5"
        style={{
          background: 'color-mix(in srgb, var(--color-card-bg) 94%, transparent)',
          border: '1px solid var(--color-card-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Row
          ariaLabel="To top"
          onClick={scrollToTop}
          expanded={expanded}
          label="Manan Upadhyay"
          glyph={
            <img
              src={crest}
              alt="Manan Upadhyay"
              width={28}
              height={28}
              className="w-7 h-7 rounded-lg object-contain"
              style={{ boxShadow: '0 0 0 1px var(--color-card-border)' }}
            />
          }
        />

        <span className="my-1 h-px mx-2" style={{ background: 'var(--color-card-border)' }} />

        {CHAPTERS.map((c) => (
          <Row
            key={c.id}
            no={c.no}
            label={c.label}
            active={activeId === c.id}
            expanded={expanded}
            ariaLabel={c.label}
            onClick={() => scrollToSection(c.id)}
          />
        ))}

        <span className="my-1 h-px mx-2" style={{ background: 'var(--color-card-border)' }} />

        <Row
          ariaLabel="Open the map"
          onClick={onOpenMap}
          expanded={expanded}
          label="Map"
          kbd
          glyph={<CompassRose className="w-[18px] h-[18px] opacity-100" />}
        />
      </motion.div>
    </motion.nav>
  );
};

export default SideRail;
