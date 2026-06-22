import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight, Lock, Star } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { ChapterHeading, ScrollReveal } from './ui';
import Magnet from './Magnet';

gsap.registerPlugin(ScrollTrigger);

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const SLUG = {
  'Advisor Portfolio Snapshot': 'advisor-portfolio',
  'Gajaakriti Studio': 'gajaakriti-studio',
  'Royal Tiles Playground': 'royal-tiles',
  'Digital Investor Portfolio': 'digital-investor',
};
const slugFor = (name) => SLUG[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const coverSrc = (name) => `/chronicle/realms/${slugFor(name)}.webp`;

/* ---------- Cover (art or serif-monogram fallback) ---------- */
const Cover = ({ project, parallaxRef }) => {
  const [hasArt, setHasArt] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasArt(true);
    img.onerror = () => setHasArt(false);
    img.src = coverSrc(project.name);
  }, [project.name]);

  return (
    <div className="group relative w-full h-full min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-3xl realm-card" data-cursor="hover">
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform" style={{ top: '-8%', bottom: '-8%', height: '116%' }}>
        {hasArt ? (
          <img src={coverSrc(project.name)} alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full grid place-items-center"
            style={{ background: 'radial-gradient(120% 120% at 70% 20%, rgba(var(--color-ember-rgb),0.12), transparent 55%), var(--gradient-card)' }}>
            <span className="font-chronicle font-bold select-none" style={{ fontSize: 'clamp(120px,18vw,220px)', color: 'var(--color-text)', opacity: 0.07 }}>
              {project.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      {/* ember sweep on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(var(--color-ember-rgb),0.12) 50%, transparent 60%)' }} />
      {/* seals */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {project.isFeatured && <span className="wax-seal wax-seal--featured"><Star size={11} /> Featured</span>}
        {project.isNDA && <span className="wax-seal wax-seal--nda"><Lock size={11} /> NDA</span>}
      </div>
    </div>
  );
};

/* ---------- Featured plate (alternating, parallax) ---------- */
const RealmPlate = ({ project, index }) => {
  const rootRef = useRef(null);
  const parallaxRef = useRef(null);
  const flip = index % 2 === 1;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(parallaxRef.current, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const links = [project.live_demo_link, project.source_code_link].filter(Boolean);

  return (
    <div ref={rootRef} className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-stretch min-h-[60vh] py-10">
      {/* cover */}
      <ScrollReveal direction={flip ? 'left' : 'right'} className={`h-full ${flip ? 'lg:order-2' : ''}`}>
        <Cover project={project} parallaxRef={parallaxRef} />
      </ScrollReveal>

      {/* detail */}
      <ScrollReveal direction="up" delay={0.1} className={`lg:self-center ${flip ? 'lg:order-1' : ''}`}>
        <p className="chapter-eyebrow mb-4">Realm {ROMAN[index]} · {project.company}</p>
        <h3 className="font-chronicle font-semibold leading-[0.95] text-[clamp(34px,4.5vw,56px)]" style={{ color: 'var(--color-text)' }}>
          {project.name}
        </h3>
        <p className="mt-5 max-w-xl text-[16px] leading-[28px]" style={{ color: 'var(--color-text-muted)' }}>
          {project.description}
        </p>

        {project.highlights?.length > 0 && (
          <ul className="mt-5 space-y-2.5 max-w-xl">
            {project.highlights.slice(0, 3).map((hgl, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-[21px]" style={{ color: 'var(--color-text-muted)' }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-gold)' }} />
                {hgl}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t.name} className="tag-rune">#{t.name}</span>
          ))}
        </div>

        {(links.length > 0 || project.isNDA) && (
          <div className="mt-7 flex items-center gap-5">
            {links.length > 0 ? (
              <>
                {project.live_demo_link && (
                  <Magnet strength={0.25}>
                    <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer" data-cursor="hover"
                      className="btn-primary">
                      {project.live_demo_label || 'Enter the realm'} <ArrowUpRight size={16} />
                    </a>
                  </Magnet>
                )}
                {project.source_code_link && (
                  <a href={project.source_code_link} target="_blank" rel="noopener noreferrer" data-cursor="hover"
                    className="btn-secondary">
                    <Github size={16} /> Source
                  </a>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                <Lock size={13} style={{ color: 'var(--color-ember)' }} /> Sealed under NDA — details limited to what's permissible.
              </span>
            )}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

/* ---------- Secondary compact card ---------- */
const RealmCard = ({ project }) => (
  <ScrollReveal direction="up" className="w-full">
    <div className="realm-card h-full p-6 flex flex-col" data-cursor="hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="chapter-eyebrow !text-[10px] mb-1">{project.company}</p>
          <h4 className="font-chronicle font-semibold text-[22px] leading-tight" style={{ color: 'var(--color-text)' }}>{project.name}</h4>
        </div>
        {project.isNDA && <span className="wax-seal wax-seal--nda flex-shrink-0"><Lock size={10} /> NDA</span>}
      </div>
      <p className="mt-3 text-[13.5px] leading-[21px] flex-1" style={{ color: 'var(--color-text-muted)' }}>{project.description}</p>
      <div className="mt-4 pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
        {project.tags.map((t) => (
          <span key={t.name} className="tag-rune tag-rune--sm">#{t.name}</span>
        ))}
      </div>
    </div>
  </ScrollReveal>
);

const Works = () => {
  const [showAll, setShowAll] = useState(false);
  const featured = projects.filter((p) => p.isFeatured);
  const others = projects.filter((p) => !p.isFeatured);

  return (
    <>
      <ChapterHeading no="04" eyebrow="The Realms" title="Worlds I've Shipped." />
      <ScrollReveal delay={0.15} direction="up">
        <p className="mt-5 max-w-2xl text-[16px] leading-[28px]" style={{ color: 'var(--color-text-muted)' }}>
          Each realm is a production world charted end to end — across finance, healthcare,
          logistics, media and visualization. Some lie under NDA; what's shared is what's permissible.
        </p>
      </ScrollReveal>

      <div className="mt-10 divide-y" style={{ borderColor: 'var(--color-card-border)' }}>
        {featured.map((project, i) => (
          <RealmPlate key={project.name} project={project} index={i} />
        ))}
      </div>

      {others.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-center mb-10">
            <button onClick={() => setShowAll((v) => !v)} data-cursor="hover"
              className="px-7 py-3 rounded-full font-semibold text-sm border-2 transition-all duration-300"
              style={{ borderColor: 'rgba(var(--color-ember-rgb),0.4)', color: 'var(--color-ember)', background: 'rgba(var(--color-ember-rgb),0.06)' }}>
              {showAll ? 'Furl the map' : `Chart ${others.length} more realms`}
            </button>
          </div>
          <AnimatePresence>
            {showAll && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((p) => <RealmCard key={p.name} project={p} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, 'projects');
