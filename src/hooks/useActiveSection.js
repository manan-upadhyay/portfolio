import { useState, useEffect } from 'react';

export const SECTION_IDS = ['origin', 'about', 'work', 'arsenal', 'projects', 'contact'];

/** Tracks which chapter is currently centered in the viewport (scroll-driven). */
export const useActiveSection = () => {
  const [active, setActive] = useState('origin');

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const line = window.scrollY + window.innerHeight * 0.4;
      let cur = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return active;
};
