import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a crisp dot that tracks 1:1, a soft trailing ring, and a
 * large blurred backlight. Grows over interactive elements. Pure DOM + rAF —
 * no React re-renders. Auto-disabled on touch / reduced-motion (via CSS + guard).
 */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const noHover = window.matchMedia('(hover: none)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noHover) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let gx = mx;
    let gy = my;
    let raf;
    let shown = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        [dot, ring, glow].forEach((el) => el && (el.style.opacity = '1'));
      }
      if (reduce) {
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        glow.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [data-cursor="hover"], input, textarea, label');
      ring.style.setProperty('--scale', interactive ? '1.8' : '1');
      ring.style.borderColor = interactive
        ? 'var(--color-ember)'
        : 'color-mix(in srgb, var(--color-text) 45%, transparent)';
    };

    const onDown = () => ring.style.setProperty('--press', '0.8');
    const onUp = () => ring.style.setProperty('--press', '1');
    const onLeave = () => [dot, ring, glow].forEach((el) => el && (el.style.opacity = '0'));

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      if (!reduce) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(calc(var(--scale,1) * var(--press,1)))`;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-backlight" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default Cursor;
