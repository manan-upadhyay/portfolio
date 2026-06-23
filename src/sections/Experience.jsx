import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Compass, ArrowRight } from 'lucide-react';
import { journey, chapters } from '../constants';
import { ChapterHeading, ScrollReveal } from '../components';
import { scrollToSection } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

const KIND_ICON = { work: Briefcase, edu: GraduationCap, cta: Compass };

/* ---- Inner card content (shared by both layouts) ---- */
const WaypointBody = ({ w }) => {
  const Icon = KIND_ICON[w.kind] || Briefcase;
  const isCta = w.kind === 'cta';
  return (
    <div className="realm-card relative h-full p-7 flex flex-col overflow-hidden">
      {/* watermark era marker — fully contained, sits behind the foot as texture */}
      <span
        className="pointer-events-none absolute bottom-5 right-6 font-chronicle font-bold select-none"
        style={{ fontSize: 92, lineHeight: 0.8, color: 'var(--color-text)', opacity: 0.05 }}
        aria-hidden="true"
      >
        {w.year.replace(' — Now', '').replace('Now', '∞')}
      </span>

      {/* meta row — quiet, sets the scene */}
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="grid place-items-center w-9 h-9 rounded-lg shrink-0"
          style={{ background: 'rgba(var(--color-ember-rgb),0.12)', border: '1px solid rgba(var(--color-ember-rgb),0.28)' }}
        >
          <Icon size={17} style={{ color: 'var(--color-ember)' }} />
        </span>
        <span className="text-[12px] font-mono tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{w.year}</span>
        {w.current && (
          <span className="ml-auto flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <span className="status-dot" /> Present
          </span>
        )}
      </div>

      {/* identity block — the single focal point */}
      <p className="chapter-eyebrow !text-[10.5px] !tracking-[0.26em] !gap-2 mb-2.5">{w.chapter}</p>
      <h3 className="font-chronicle font-semibold text-[clamp(24px,2.2vw,30px)] leading-[1.05]" style={{ color: 'var(--color-text)' }}>
        {w.role}
      </h3>
      <p className="text-[13.5px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>{w.org}</p>

      {/* the beat — one emotional line, the only ember sentence */}
      <p className="font-chronicle italic text-[16.5px] leading-snug mt-4" style={{ color: 'var(--color-ember)' }}>
        {w.headline}
      </p>

      {/* proof — curated, breathable */}
      {w.points.length > 0 && (
        <ul className="mt-5 space-y-3">
          {w.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-[13px] leading-[1.55]" style={{ color: 'var(--color-text-muted)' }}>
              <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--color-ember)' }} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {isCta && (
        <button
          onClick={() => scrollToSection('contact')}
          data-cursor="hover"
          className="btn-primary inline-flex items-center gap-2 mt-7 self-start"
        >
          Summon me <ArrowRight size={16} />
        </button>
      )}

      {/* runes — on-theme, anchored to the foot */}
      {w.tech.length > 0 && (
        <div
          className="mt-auto pt-5 flex flex-wrap gap-2 border-t"
          style={{ borderColor: 'var(--color-card-border)' }}
        >
          {w.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(var(--color-ember-rgb),0.07)',
                color: 'var(--color-text-muted)',
                border: '1px solid rgba(var(--color-ember-rgb),0.2)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const Experience = () => {
  const ch = chapters.work;
  const [horizontal, setHorizontal] = useState(false);
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const routeRef = useRef(null); // the route line that "draws" as you travel

  // decide layout mode (desktop + motion-OK → horizontal scrub)
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
      // Travel = distance to move the LAST card from centered-at-start to
      // centered-at-end. Derived from layout (offsetLeft is transform-immune),
      // NOT scrollWidth — a trailing empty spacer is excluded from scrollWidth,
      // which would stop the scrub one card short of the CTA.
      const amount = () => {
        const cards = track.querySelectorAll('.wp');
        if (cards.length < 2) return 0;
        const first = cards[0];
        const last = cards[cards.length - 1];
        const firstCenter = first.offsetLeft + first.offsetWidth / 2;
        const lastCenter = last.offsetLeft + last.offsetWidth / 2;
        return lastCenter - firstCenter;
      };
      const tween = gsap.to(track, { x: () => -amount(), ease: 'none' });
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: () => `+=${amount()}`,
        pin: true,
        scrub: 0.8,
        animation: tween,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        // Scroll magnet: each card is a waypoint the trail "sticks" to. Snapping
        // to evenly-spaced progress points (one per card) with inertia OFF kills
        // trackpad momentum so a flick settles onto the nearest card instead of
        // flying past it. Releases to vertical scroll once the last card lands.
        snap: {
          snapTo: 1 / (journey.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.04,
          ease: 'power2.inOut',
          inertia: false,
          directional: false,
        },
        onUpdate: (self) => { if (routeRef.current) routeRef.current.style.width = `${self.progress * 100}%`; },
      });
    }, rootRef);

    // Sibling sections are lazy-loaded — refresh once layout settles so the
    // pin start is measured against the final page height (fixes overlap/jump).
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const t = setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [horizontal]);

  // active-when-centered: glow the waypoint sitting in the central band
  useEffect(() => {
    if (!horizontal) return;
    const cards = rootRef.current.querySelectorAll('.wp');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('wp-active', e.isIntersecting)),
      { root: null, rootMargin: '0px -47% 0px -47%', threshold: 0.01 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [horizontal]);

  const heading = <ChapterHeading no={ch.no} eyebrow={ch.label} title={`${ch.sub}.`} />;
  const intro = (
    <p className="mt-6 max-w-xl text-[17px] leading-[28px]" style={{ color: 'var(--color-text-muted)' }}>
      Every expedition leaves a trail. Keep scrolling to travel mine — from the
      first commit to the present campaign.
    </p>
  );

  /* ---------- HORIZONTAL (desktop) ---------- */
  if (horizontal) {
    return (
      <section ref={rootRef} id="work" className="relative">
        {/* intro — read normally before the trail begins */}
        <div className="max-w-7xl mx-auto px-6 sm:px-16 pt-24 pb-6">
          {heading}
          {intro}
          <div className="mt-7 flex items-center gap-3 text-[13px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-ember)' }}>
            Travel the trail <ArrowRight size={18} className="animate-pulse" />
          </div>
        </div>

        {/* pinned horizontal trail */}
        <div
          ref={pinRef}
          className="relative h-screen overflow-hidden"
          style={{ '--card-w': 'clamp(300px, 30vw, 400px)', '--card-h': 'min(70vh, 560px)' }}
        >
          {/* route line — base (faint) + drawn (charts as you travel) */}
          <div
            className="absolute left-0 w-full h-px"
            style={{ top: 'calc(50% - var(--card-h) / 2 - 46px)', background: 'var(--color-card-border)' }}
          />
          <div
            ref={routeRef}
            className="absolute left-0 h-px"
            style={{ top: 'calc(50% - var(--card-h) / 2 - 46px)', width: '0%', background: 'var(--gradient-map-line)' }}
          />

          <div ref={trackRef} className="flex flex-nowrap h-full items-center will-change-transform">
            {/* leading spacer centers the FIRST card at progress 0 */}
            <div className="shrink-0" style={{ width: 'calc((100vw - var(--card-w)) / 2)' }} aria-hidden="true" />

            {journey.map((w) => (
              <div
                key={w.chapter}
                className="wp shrink-0 relative flex items-center justify-center px-3"
                style={{ width: 'var(--card-w)' }}
              >
                {/* waypoint marker on the route + connector down to the card */}
                <span
                  className="wp-node absolute left-1/2 -translate-x-1/2 rotate-45 w-3.5 h-3.5 transition-all"
                  style={{ top: 'calc(50% - var(--card-h) / 2 - 46px)', marginTop: '-7px', background: 'var(--color-gold)' }}
                />
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-px"
                  style={{ top: 'calc(50% - var(--card-h) / 2 - 46px)', height: '46px', background: 'var(--color-card-border)' }}
                />
                <div style={{ width: '100%', height: 'var(--card-h)' }}>
                  <WaypointBody w={w} />
                </div>
              </div>
            ))}

            {/* trailing spacer centers the LAST (CTA) card at progress 1 before release */}
            <div className="shrink-0" style={{ width: 'calc((100vw - var(--card-w)) / 2)' }} aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

  /* ---------- VERTICAL (mobile / reduced-motion) ---------- */
  return (
    <section id="work" className="max-w-3xl mx-auto px-6 py-24">
      {heading}
      {intro}
      <div className="mt-12 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: 'var(--gradient-map-line)', opacity: 0.5 }} />
        <div className="space-y-8">
          {journey.map((w) => (
            <ScrollReveal key={w.chapter} direction="up" className="relative pl-10">
              <span className="absolute left-0 top-3 rotate-45 w-3.5 h-3.5" style={{ background: 'var(--color-gold)' }} />
              <WaypointBody w={w} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
