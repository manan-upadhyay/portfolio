import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, Clapperboard, Mountain, Plus, Minus } from 'lucide-react';
import { track } from '../lib/analytics';

/**
 * PersonaTriptych — "Off the map." The human behind the build as three doors, not
 * a wall of prose: The Storyteller, The Filmmaker, The Wanderer. Each card shows a
 * glyph, a bold one-line hook, and keyword chips at a glance; clicking a card
 * expands the deeper story (progressive disclosure — agency pulls people in).
 * One card is open at a time, the first by default so it's never an empty grid.
 *
 * Each persona still converts a personal fact into a professional signal:
 * story-love → why this site is a Chronicle, the filmmaker's eye → the motion,
 * the wanderer → the human counterweight.
 *
 * Props:
 *  - personas: [{ id, glyph, chips:[] }] (from constants.atelier.personas)
 */
const GLYPHS = { book: BookOpen, clapper: Clapperboard, mountain: Mountain };

const PersonaCard = ({ persona, open, onToggle }) => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const Glyph = GLYPHS[persona.glyph] ?? BookOpen;
  const k = `atelier.personas.${persona.id}`;

  return (
    <div className={`persona${open ? ' is-open' : ''}`}>
      <button type="button" className="persona__face" onClick={onToggle} aria-expanded={open}>
        <Glyph className="persona__ghost" aria-hidden="true" />
        <span className="persona__glyph" aria-hidden="true"><Glyph size={22} strokeWidth={1.5} /></span>
        <span className="persona__label">{t(`${k}.label`)}</span>
        <span className="persona__hook font-chronicle">{t(`${k}.hook`)}</span>
        <span className="persona__chips">
          {persona.chips.map((c) => <span key={c} className="persona__chip exp-mono">{c}</span>)}
        </span>
        <span className="persona__more">
          {open ? <Minus size={13} /> : <Plus size={13} />}
          {t(open ? 'atelier.personas.less' : 'atelier.personas.more')}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="persona__reveal"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="persona__story">{t(`${k}.story`)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PersonaTriptych = ({ personas }) => {
  const [open, setOpen] = useState(0); // index of the open card (first by default)
  return (
    <div className="persona-triptych">
      {personas.map((p, i) => (
        <PersonaCard key={p.id} persona={p} open={open === i}
          onToggle={() => { if (open !== i) track('persona_card_expand', { persona: p.id }); setOpen(open === i ? -1 : i); }} />
      ))}
    </div>
  );
};

export default PersonaTriptych;
