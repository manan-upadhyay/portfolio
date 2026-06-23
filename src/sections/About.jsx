import { motion } from 'framer-motion';
import { LayoutPanelTop, Server, Gauge, Layers, ScrollText } from 'lucide-react';
import { services, stats, craft, chapters } from '../constants';
import { SectionWrapper } from '../hoc';
import { ScrollReveal, ChapterHeading, CountUp } from '../components';

// Discipline → line icon, keyed by stable `iconKey` from constants
// (replaces the old gem PNGs; not the title, so copy can change freely).
const DISCIPLINE_ICONS = {
  frontend: LayoutPanelTop,
  backend: Server,
  performance: Gauge,
  fullstack: Layers,
};

const StatTile = ({ value, label }) => (
  <motion.div
    className="realm-card px-5 py-6 text-center"
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
  >
    <p className="text-[40px] font-chronicle font-bold ember-text-gradient leading-none">
      <CountUp value={value} />
    </p>
    <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
  </motion.div>
);

const DisciplineCard = ({ index, iconKey, title, description }) => {
  const Icon = DISCIPLINE_ICONS[iconKey] || Layers;
  return (
    <ScrollReveal direction="up" delay={index * 0.1} className="w-full">
      <motion.div
        className="realm-card h-full p-7 flex flex-col gap-4"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        data-cursor="hover"
      >
        <span
          className="grid place-items-center w-12 h-12 rounded-xl"
          style={{ background: 'rgba(var(--color-ember-rgb), 0.12)', border: '1px solid rgba(var(--color-ember-rgb), 0.3)' }}
        >
          <Icon size={24} style={{ color: 'var(--color-ember)' }} />
        </span>
        <h3 className="font-chronicle font-semibold text-[24px] leading-tight" style={{ color: 'var(--color-text)' }}>
          {title}
        </h3>
        <p className="text-[14px] leading-[23px]" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      </motion.div>
    </ScrollReveal>
  );
};

const About = () => {
  const ch = chapters.about;
  return (
    <>
      <ChapterHeading no={ch.no} eyebrow={ch.label} title={`${ch.sub}.`} />

      {/* Intro — the tale (left) + the scribe's note (right) */}
      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-12 mt-12 items-start">
        <ScrollReveal direction="up" delay={0.15}>
          <p className="font-chronicle italic text-[clamp(20px,2.4vw,26px)] leading-[1.45] mb-6" style={{ color: 'var(--color-ember)' }}>
            {craft.pullQuote}
          </p>
          {craft.intro.map((para) => (
            <p key={para.slice(0, 24)} className="text-[17px] leading-[30px] mb-4 last:mb-0" style={{ color: 'var(--color-text-muted)' }}>
              {para}
            </p>
          ))}
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.3} className="w-full">
          <div className="realm-card p-8">
            <span className="chapter-eyebrow inline-flex items-center gap-2">
              <ScrollText size={14} style={{ color: 'var(--color-ember)' }} /> The Scribe's Note
            </span>
            <ul className="mt-6 space-y-5">
              {craft.principles.map(({ title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-ember)', boxShadow: '0 0 10px var(--color-ember)' }} />
                  <span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{title}.</span>{' '}
                    <span className="text-[14px] leading-[22px]" style={{ color: 'var(--color-text-muted)' }}>{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>

      {/* Proof — full-width stat band (anchors the section, no dead space) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12">
        {stats.map((stat, index) => (
          <ScrollReveal key={stat.label} direction="up" delay={index * 0.08}>
            <StatTile value={stat.value} label={stat.label} />
          </ScrollReveal>
        ))}
      </div>

      {/* Disciplines */}
      <div className="mt-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h3 className="font-chronicle font-semibold text-[30px]" style={{ color: 'var(--color-text)' }}>
            Disciplines
          </h3>
          <div className="flex-1 ink-stroke mb-2" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <DisciplineCard key={service.title} index={index} iconKey={service.iconKey} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
