import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, Compass } from 'lucide-react';
import { personalInfo } from '../constants';
import { scrollToSection, scrollToTop } from '../lib/smoothScroll';
import DayNightToggle from './ui/DayNightToggle';

const LINKS = [
  { id: 'about', label: 'Craft' },
  { id: 'work', label: 'Journey' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'projects', label: 'Realms' },
  { id: 'contact', label: 'Summon' },
];

const Navbar = ({ onOpenMap }) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 240 && !open);
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-40 px-6 sm:px-10"
    >
      <div
        className="max-w-7xl mx-auto mt-4 flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300"
        style={{
          background: scrolled ? 'color-mix(in srgb, var(--color-primary) 72%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          border: `1px solid ${scrolled ? 'var(--color-card-border)' : 'transparent'}`,
        }}
      >
        {/* Wordmark */}
        <button onClick={scrollToTop} data-cursor="hover" className="flex items-center gap-3 group">
          <span
            className="grid place-items-center w-9 h-9 rounded-full font-chronicle text-[19px] font-semibold"
            style={{ border: '1.5px solid var(--color-ember)', color: 'var(--color-ember)' }}
          >
            M
          </span>
          <span className="hidden sm:flex flex-col leading-none text-left">
            <span className="font-chronicle text-[18px] font-semibold" style={{ color: 'var(--color-text)' }}>
              {personalInfo.name}
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Builder of Worlds
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              data-cursor="hover"
              className="group relative text-[14px] font-medium tracking-wide transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span className="mr-1.5 text-[10px] font-mono" style={{ color: 'var(--color-ember)', opacity: 0.7 }}>
                0{i + 1}
              </span>
              <span className="group-hover:text-[var(--color-text)] transition-colors">{l.label}</span>
            </button>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMap}
            data-cursor="hover"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors"
            style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text)' }}
          >
            <Compass size={15} style={{ color: 'var(--color-ember)' }} />
            Map
            <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>
          </button>
          <DayNightToggle />
          <button
            className="md:hidden grid place-items-center w-9 h-9"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} style={{ color: 'var(--color-text)' }} /> : <Menu size={22} style={{ color: 'var(--color-text)' }} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="md:hidden max-w-7xl mx-auto mt-2 rounded-2xl p-4 flex flex-col gap-1"
            style={{ background: 'color-mix(in srgb, var(--color-primary) 92%, transparent)', backdropFilter: 'blur(16px)', border: '1px solid var(--color-card-border)' }}
          >
            {LINKS.map((l, i) => (
              <button
                key={l.id}
                onClick={() => { scrollToSection(l.id); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-left text-[16px]"
                style={{ color: 'var(--color-text)' }}
              >
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-ember)' }}>0{i + 1}</span>
                {l.label}
              </button>
            ))}
            <button onClick={() => { onOpenMap?.(); setOpen(false); }} className="flex items-center gap-2 px-3 py-3 rounded-xl text-left text-[16px]" style={{ color: 'var(--color-text)' }}>
              <Compass size={16} style={{ color: 'var(--color-ember)' }} /> Open the Map
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
