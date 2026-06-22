import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useThemeStore';

/**
 * Premium day/night control — orbit ring, sun↔moon morph, spring physics,
 * and a radial theme-reveal ripple that expands from the button on click.
 */
const DayNightToggle = ({ compact = false }) => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const btnRef = useRef(null);

  const handleClick = () => {
    const btn = btnRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fallback for reduced-motion or browsers without the View Transitions API:
    // a plain swap (the body's CSS colour transition gives a gentle cross-fade).
    if (reduce || !btn || typeof document.startViewTransition !== 'function') {
      toggleTheme();
      return;
    }

    // breedlove-style radial reveal: the View Transitions API snapshots the old
    // and new themes; we grow a circular clip-path on the *new* snapshot from the
    // button outward. The new theme is revealed over the old along the arc — at no
    // point is content hidden by a solid colour, so it reads as the page changing
    // theme along with the wipe.
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const endR = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));

    // Suppress per-element colour transitions during the swap so the captured
    // "new" snapshot shows the final colours immediately (no mid-transition tint).
    const root = document.documentElement;
    root.classList.add('vt-theme-swap');

    const transition = document.startViewTransition(() => {
      // flushSync so React commits the new theme (aurora, icon, tokens) before
      // the API captures the new snapshot.
      flushSync(() => toggleTheme());
    });

    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${endR}px at ${cx}px ${cy}px)`] },
        { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });

    transition.finished.finally(() => root.classList.remove('vt-theme-swap'));
  };

  const size = compact ? 30 : 46;

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      data-theme-toggle
      data-cursor="hover"
      aria-label={`Switch to ${isDark ? 'day' : 'night'}`}
      className="relative grid place-items-center rounded-full"
      style={{ width: size + 14, height: size + 14 }}
    >
      {/* orbit ring */}
      <motion.svg
        width={size + 14}
        height={size + 14}
        viewBox="0 0 60 60"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="30" cy="30" r="27" fill="none" stroke="var(--color-card-border)" strokeWidth="1" strokeDasharray="2 5" />
        <circle cx="30" cy="3" r="1.6" fill="var(--color-ember)" />
      </motion.svg>

      {/* celestial body */}
      <motion.span
        className="relative grid place-items-center rounded-full overflow-hidden"
        style={{ width: size, height: size }}
        animate={{
          background: isDark
            ? 'radial-gradient(circle at 35% 30%, #E8EDF7 0%, #C7D0E0 60%, #AEB8CC 100%)'
            : 'radial-gradient(circle at 35% 30%, #FFE08A 0%, #F6A93B 55%, #E8771E 100%)',
          boxShadow: isDark
            ? '0 0 18px rgba(199,208,224,0.45), inset -4px -4px 8px rgba(0,0,0,0.25)'
            : '0 0 22px rgba(232,150,90,0.6), inset -3px -3px 6px rgba(180,80,10,0.3)',
        }}
        whileTap={{ scale: 0.82 }}
        transition={{ type: 'spring', stiffness: 600, damping: 18 }}
      >
        {/* moon craters — fade in for dark */}
        <motion.span className="absolute inset-0" animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <span className="absolute rounded-full" style={{ width: size * 0.2, height: size * 0.2, top: '22%', left: '52%', background: 'rgba(120,130,150,0.5)' }} />
          <span className="absolute rounded-full" style={{ width: size * 0.13, height: size * 0.13, top: '55%', left: '28%', background: 'rgba(120,130,150,0.4)' }} />
          <span className="absolute rounded-full" style={{ width: size * 0.1, height: size * 0.1, top: '64%', left: '60%', background: 'rgba(120,130,150,0.35)' }} />
        </motion.span>
        {/* sun rays — rotate in for light */}
        <motion.span className="absolute inset-0" animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -40 : 0 }} transition={{ duration: 0.4 }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="absolute rounded-full" style={{ width: 2, height: size * 0.16, left: '50%', top: '50%', background: '#FFD27A', transformOrigin: '0 0', transform: `rotate(${i * 45}deg) translateY(-${size * 0.62}px) translateX(-1px)` }} />
          ))}
        </motion.span>
      </motion.span>
    </button>
  );
};

export default DayNightToggle;
