import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, FileText, Github, Linkedin, Sun, Moon, X, CornerDownLeft, Star, Feather } from 'lucide-react';
import { personalInfo, chapterList } from '../constants';
import { scrollToSection } from '../lib/smoothScroll';
import { pushOverlay, popOverlay } from '../lib/uiOverlay';
import { useThemeStore } from '../store/useThemeStore';
import { useVoiceStore } from '../store/useVoiceStore';
import CompassRose from './CompassRose';

// Map waypoints = the chapters (single source of truth). Each carries its pin
// position (x,y in 0–100 across the plate) + search keywords from constants.
const PINS = chapterList;
const MAP_SRC = '/chronicle/map/realm-map.webp';

// Smooth (Catmull-Rom → bézier) path through the waypoints = a wandering trail.
const trailPath = (pts) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const MapOverlay = ({ open, onClose, activeId }) => {
  const { t } = useTranslation();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const labelOf = (p) => t(`chapters.${p.id}.label`);
  const [query, setQuery] = useState('');
  const [hasMap, setHasMap] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { const img = new Image(); img.onload = () => setHasMap(true); img.src = MAP_SRC; }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    pushOverlay(); // hush the hero astrolabe behind the blur
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); popOverlay(); };
  }, [open, onClose]);

  const actions = [
    { id: 'voices', label: t('map.actions.voices'), icon: Feather, run: () => useVoiceStore.getState().openHall() },
    { id: 'resume', label: t('map.actions.resume'), icon: FileText, run: () => window.open(personalInfo.resumeLink, '_blank', 'noopener,noreferrer') },
    { id: 'github', label: t('map.actions.github'), icon: Github, run: () => window.open(personalInfo.github, '_blank', 'noopener,noreferrer') },
    { id: 'linkedin', label: t('map.actions.linkedin'), icon: Linkedin, run: () => window.open(personalInfo.linkedin, '_blank', 'noopener,noreferrer') },
    { id: 'theme', label: isDark ? t('map.actions.themeLight') : t('map.actions.themeDark'), icon: isDark ? Sun : Moon, run: toggleTheme },
  ];

  const q = query.trim().toLowerCase();
  const match = (p) => !q || (labelOf(p) + ' ' + p.kw).toLowerCase().includes(q);
  const pins = PINS.filter(match);
  const acts = q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions;

  const travel = (id) => { onClose(); setTimeout(() => scrollToSection(id), 120); };
  const onSubmit = (e) => {
    e.preventDefault();
    if (pins[0]) travel(pins[0].id);
    else if (acts[0]) { acts[0].run(); onClose(); }
  };

  // parchment palettes
  const plateBg = isDark
    ? 'radial-gradient(130% 120% at 25% 15%, #20283f 0%, #131a2b 55%, #0c111d 100%)'
    : 'radial-gradient(130% 120% at 25% 15%, #f3ead4 0%, #e8d9bf 40%, #e2d2af 100%)';

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog" aria-modal="true" aria-label="Map — navigate chapters">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }} onClick={onClose} />

          <motion.div className="relative w-full max-w-4xl rounded-3xl overflow-hidden"
            style={{ border: '1px solid var(--color-card-border)', background: 'var(--color-card-bg)', backdropFilter: 'blur(20px)' }}
            initial={{ scale: 0.94, y: 14, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}>

            {/* search */}
            <form onSubmit={onSubmit} className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
              <Search size={18} style={{ color: 'var(--color-ember)' }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={t('map.searchPlaceholder')}
                className="flex-1 bg-transparent outline-none text-[15px]" style={{ color: 'var(--color-text)' }} data-cursor="hover" />
              <button type="button" onClick={onClose} aria-label="Close" data-cursor="hover"
                className="grid place-items-center w-7 h-7 rounded-lg" style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text-muted)' }}>
                <X size={15} />
              </button>
            </form>

            {/* treasure plate */}
            <div className="relative" style={{ aspectRatio: '16 / 9', background: plateBg }}>
              {hasMap && <img src={MAP_SRC} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />}

              {/* aged frame + vignette */}
              <div className="absolute inset-3 rounded-2xl pointer-events-none" style={{ border: '1px dashed var(--color-card-border)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 90px rgba(0,0,0,0.28)' }} />

              {/* decorative landmarks */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* faint contour swirls */}
                <path d="M5 88 q10 -6 20 0 t20 0" fill="none" stroke="var(--color-card-border)" strokeWidth="0.3" opacity="0.5" />
                <path d="M60 92 q8 -5 16 0" fill="none" stroke="var(--color-card-border)" strokeWidth="0.3" opacity="0.4" />
              </svg>
              {/* tiny mountain + wave glyphs for map flavour */}
              <span className="absolute" style={{ left: '48%', top: '78%', color: 'var(--color-text-muted)', opacity: 0.4, fontSize: 12 }} aria-hidden="true">⛰</span>
              <span className="absolute" style={{ left: '20%', top: '85%', color: 'var(--color-text-muted)', opacity: 0.35, fontSize: 11 }} aria-hidden="true">〜</span>

              {/* compass rose */}
              <div className="absolute top-4 right-5"><CompassRose /></div>

              {/* the trail */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d={trailPath(PINS)} fill="none" stroke="var(--color-ember)" strokeWidth="0.5"
                  strokeDasharray="1.4 1.8" strokeLinecap="round" opacity={q ? 0.25 : 0.75} vectorEffect="non-scaling-stroke" />
              </svg>

              {/* waypoints */}
              {PINS.map((p) => {
                const active = activeId === p.id;
                const dim = q && !pins.includes(p);
                return (
                  <button key={p.id} onClick={() => travel(p.id)} data-cursor="hover"
                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-200"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: dim ? 0.22 : 1, zIndex: active ? 3 : 2 }}
                    aria-label={`Go to ${labelOf(p)}`} aria-current={active ? 'true' : undefined}>
                    {active && <Star size={12} className="mb-0.5" style={{ color: 'var(--color-ember)' }} fill="var(--color-ember)" />}
                    {/* stamp */}
                    <span className="grid place-items-center rounded-full font-chronicle font-semibold transition-transform duration-200 group-hover:scale-110"
                      style={{
                        width: active ? 38 : 32, height: active ? 38 : 32, fontSize: active ? 14 : 12,
                        background: active ? 'var(--color-ember)' : 'var(--color-card-bg)',
                        color: active ? '#1a1208' : 'var(--color-text)',
                        border: `1.5px solid ${active ? 'var(--color-ember)' : 'var(--color-gold)'}`,
                        boxShadow: active ? '0 0 16px rgba(var(--color-ember-rgb),0.5)' : 'none',
                      }}>
                      {p.no}
                    </span>
                    {/* always-visible label */}
                    <span className="mt-1.5 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap font-medium"
                      style={{
                        background: 'color-mix(in srgb, var(--color-primary) 80%, transparent)',
                        color: active ? 'var(--color-ember)' : 'var(--color-text)',
                        border: '1px solid var(--color-card-border)',
                      }}>
                      {labelOf(p)}
                    </span>
                  </button>
                );
              })}

              {q && pins.length === 0 && (
                <div className="absolute inset-0 grid place-items-center text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
                  {t('map.noResult')}
                </div>
              )}
            </div>

            {/* quick actions */}
            <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
              {acts.map((a) => (
                <button key={a.id} onClick={() => { a.run(); if (a.id !== 'theme') onClose(); }} data-cursor="hover"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                  style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text)' }}>
                  <a.icon size={14} style={{ color: 'var(--color-ember)' }} /> {a.label}
                </button>
              ))}
              <span className="ml-auto hidden sm:flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                <CornerDownLeft size={12} /> {t('map.footerHint')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapOverlay;
