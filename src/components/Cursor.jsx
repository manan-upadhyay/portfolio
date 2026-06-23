import { useEffect, useRef } from 'react';

/**
 * Custom cursor: crisp dot (1:1), trailing ring (grows over interactive
 * elements), and a soft backlight. Pure DOM + rAF. Auto-disabled on touch /
 * reduced-motion. Robust show/hide: any pointer movement re-reveals it, so it
 * can never get "stuck" hidden (e.g. after a pointer-capture from a tap).
 */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    const els = [dot, ring, glow];

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my, gx = mx, gy = my;
    let visible = false;
    let raf;

    const show = () => { if (!visible) { visible = true; els.forEach((e) => e && (e.style.opacity = '1')); } };
    const hide = () => { visible = false; els.forEach((e) => e && (e.style.opacity = '0')); };

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      show();
      if (reduce) {
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        glow.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      }
    };

    const onOver = (e) => {
      const interactive = e.target.closest?.('a, button, [data-cursor="hover"], input, textarea, label, kbd');
      ring.style.setProperty('--scale', interactive ? '1.7' : '1');
      ring.style.borderColor = interactive ? 'var(--color-ember)' : 'color-mix(in srgb, var(--color-text) 45%, transparent)';
    };
    const onDown = () => ring.style.setProperty('--press', '0.82');
    const onUp = () => ring.style.setProperty('--press', '1');
    // Only hide when the pointer truly leaves the window (not on capture quirks).
    const onOut = (e) => { if (!e.relatedTarget && !e.toElement) hide(); };
    const onBlur = () => hide();

    const loop = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
      if (!reduce) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(calc(var(--scale,1) * var(--press,1)))`;
      glow.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', onBlur);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', onBlur);
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
