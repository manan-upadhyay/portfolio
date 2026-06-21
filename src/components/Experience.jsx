import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Compass, ArrowRight } from 'lucide-react';
import { journey } from '../constants';
import { ChapterHeading, ScrollReveal } from './ui';
import { scrollToSection } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

const KIND_ICON = { work: Briefcase, edu: GraduationCap, cta: Compass };

/* ---- Inner card content (shared by both layouts) ---- */
const WaypointBody = ({ w }) => {
  const Icon = KIND_ICON[w.kind] || Briefcase;
  const isCta = w.kind === 'cta';
  return (
    <div className={`realm-card relative h-full p-7 flex flex-col overflow-hidden ${isCta ? 'justify-center items-start' : ''}`}>
      {/* ghost year */}
      <span
        className="pointer-events-none absolute -top-3 right-3 font-chronicle font-bold leading-none select-none"
        style={{ fontSize: 86, color: 'var(--color-text)', opacity: 0.06 }}
        aria-hidden="true"
      >
        {w.year.replace(' — Now', '').replace('Now', '∞')}
      </span>

      <div className="flex items-center gap-2 mb-3">
        <span className="grid place-items-center w-9 h-9 rounded-lg" style={{ background: 'rgba(var(--color-ember-rgb),0.12)', border: '1px solid rgba(var(--color-ember-rgb),0.3)' }}>
          <Icon size={18} style={{ color: 'var(--color-ember)' }} />
        </span>
        <span className="text-[12px] font-mono tracking-wider" style={{ color: 'var(--color-ember)' }}>{w.year}</span>
        {w.current && (
          <span className="ml-1 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <span className="status-dot" /> Present
          </span>
        )}
      </div>

      <p className="chapter-eyebrow !text-[11px] mb-1">{w.chapter}</p>
      <h3 className="font-chronicle font-semibold text-[26px] leading-tight" style={{ color: 'var(--color-text)' }}>{w.role}</h3>
      <p className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-muted)' }}>{w.org}</p>
      <p className="font-chronicle italic text-[17px] leading-snug mb-4" style={{ color: 'var(--color-ember)' }}>{w.headline}</p>

      {w.points.length > 0 && (
        <ul className="space-y-2 mb-auto">
          {w.points.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] leading-[20px]" style={{ color: 'var(--color-text-muted)' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-gold)' }} />
              {p}
            </li>
          ))}
        </ul>
      )}

      {isCta && (
        <button onClick={() => scrollToSection('contact')} data-cursor="hover"
          className="btn-primary inline-flex items-center gap-2 mt-2">
          Summon me <ArrowRight size={16} />
        </button>
      )}

      {w.tech.length > 0 && (
        <div className="mt-5 pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
          {w.tech.map((t) => (
            <span key={t} className="text-[11.5px] px-2.5 py-1 rounded-md font-medium"
              style={{ background: 'rgba(var(--color-accent-rgb),0.08)', color: 'var(--color-accent)' }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const Experience = () => {
  const [horizontal, setHorizontal] = useState(false);
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);

  // decide layout mode
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setHorizontal(mq.matches && !rm.matches);
    update();
    mq.addEventListener('change', update);
    rm.addEventListener('change', update);
    return () => { mq.removeEventListener('change', update); rm.removeEventListener('change', update); };
  }, []);

  // horizontal pin + scrub
  useEffect(() => {
    if (!horizontal) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const amount = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, { x: () => -amount(), ease: 'none' });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: () => `+=${amount()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (fillRef.current) fillRef.current.style.width = `${self.progress * 100}%`; },
      });
      ScrollTrigger.refresh();
    }, rootRef);
    return () => ctx.revert();
  }, [horizontal]);

  // active-when-centered (horizontal): glow the card in the central band
  useEffect(() => {
    if (!horizontal) return;
    const cards = rootRef.current.querySelectorAll('.wp');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('wp-active', e.isIntersecting)),
      { root: null, rootMargin: '0px -42% 0px -42%', threshold: 0.01 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [horizontal]);

  /* ---------- HORIZONTAL (desktop) ---------- */
  if (horizontal) {
    return (
      <section ref={rootRef} id="work" className="relative h-screen overflow-hidden">
        <div ref={trackRef} className="flex flex-nowrap h-screen items-center will-change-transform">
          {/* intro panel */}
          <div className="shrink-0 w-[62vw] h-full flex flex-col justify-center pl-6 sm:pl-16 pr-10">
            <ChapterHeading no="02" eyebrow="The Journey" title="The Path So Far." />
            <p className="mt-6 max-w-md text-[16px] leading-[27px]" style={{ color: 'var(--color-text-muted)' }}>
              Every expedition leaves a trail. Scroll to travel mine — from first
              commit to the present campaign.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[13px] tracking-wide uppercase" style={{ color: 'var(--color-ember)' }}>
              Travel the trail <ArrowRight size={18} className="animate-pulse" />
            </div>
          </div>

          {/* waypoints */}
          {journey.map((w) => (
            <div key={w.chapter} className="wp shrink-0 relative h-full flex flex-col justify-center"
              style={{ width: 'clamp(320px, 33vw, 430px)' }}>
              {/* route rail + node */}
              <div className="absolute top-[24%] left-0 w-full h-px" style={{ background: 'var(--gradient-map-line)', opacity: 0.6 }} />
              <div className="wp-node absolute top-[24%] left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-3.5 h-3.5 transition-all"
                style={{ background: 'var(--color-gold)' }} />
              <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-px h-[12%]" style={{ background: 'var(--color-card-border)' }} />
              {/* card */}
              <div className="px-4 mt-[14%]" style={{ height: '62%' }}>
                <WaypointBody w={w} />
              </div>
            </div>
          ))}

          {/* trailing spacer so the last card can reach center */}
          <div className="shrink-0 w-[20vw] h-full" aria-hidden="true" />
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: 'var(--color-card-border)' }}>
          <div ref={fillRef} className="h-full" style={{ width: '0%', background: 'var(--gradient-map-line)' }} />
        </div>
      </section>
    );
  }

  /* ---------- VERTICAL (mobile / reduced-motion) ---------- */
  return (
    <section id="work" className="max-w-3xl mx-auto px-6 py-24">
      <ChapterHeading no="02" eyebrow="The Journey" title="The Path So Far." />
      <div className="mt-12 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: 'var(--gradient-map-line)', opacity: 0.5 }} />
        <div className="space-y-8">
          {journey.map((w) => (
            <ScrollReveal key={w.chapter} direction="up" className="relative pl-10">
              <span className="absolute left-0 top-3 rotate-45 w-3.5 h-3.5" style={{ background: 'var(--color-gold)' }} />
              <div style={{ height: 'auto' }}>
                <WaypointBody w={w} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
