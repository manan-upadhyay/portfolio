import { useRef } from 'react';
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
    // Radial reveal: a circle wipes from the button outward as the theme flips.
    const btn = btnRef.current;
    const next = isDark ? '#F5F0E6' : '#0B0F1A';
    if (btn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:8px;height:8px;border-radius:50%;background:${next};transform:translate(-50%,-50%) scale(0);z-index:9000;pointer-events:none;`;
      document.body.appendChild(ripple);
      const anim = ripple.animate(
        [{ transform: 'translate(-50%,-50%) scale(0)' }, { transform: `translate(-50%,-50%) scale(${(r / 4) + 2})` }],
        { duration: 620, easing: 'cubic-bezier(0.7,0,0.3,1)' }
      );
      // flip the theme partway through so the new colour is revealed under the wipe
      setTimeout(toggleTheme, 210);
      anim.onfinish = () => { ripple.style.opacity = '0'; setTimeout(() => ripple.remove(), 120); };
    } else {
      toggleTheme();
    }
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
