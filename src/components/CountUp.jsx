import { useEffect, useRef, useState } from 'react';

/**
 * CountUp — animates a numeric value from 0 → target when scrolled into view.
 * Accepts display strings like "5+", "20+", "38%", "6". Preserves the suffix.
 * Respects prefers-reduced-motion (renders the final value immediately).
 */
const CountUp = ({ value, duration = 1.6, className = '' }) => {
  const target = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const suffix = String(value).replace(/[0-9.,\s]/g, '');
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(target); return; }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min((t - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(target * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setN(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {Math.round(n)}{suffix}
    </span>
  );
};

export default CountUp;
