import { motion } from 'framer-motion';
import { LayoutPanelTop, Server, Gauge, Layers, ScrollText } from 'lucide-react';
import { services, personalInfo, stats } from '../constants';
import { SectionWrapper } from '../hoc';
import { ScrollReveal, ChapterHeading, CountUp } from './ui';

// Discipline → line icon (replaces the old gem PNGs)
const DISCIPLINE_ICONS = {
  'Frontend Architecture': LayoutPanelTop,
  'Backend Development': Server,
  'Performance Optimization': Gauge,
  'Full Stack Delivery': Layers,
};

const PRINCIPLES = [
  ['End-to-end ownership', 'From requirement grooming and system design to release validation and production monitoring.'],
  ['Performance as a habit', 'Code-splitting, caching, CDN, and media optimization — measured, not guessed.'],
  ['Secure by default', 'JWT/OAuth, Okta, RBAC and middleware access control across enterprise apps.'],
  ['A mentor on the road', 'Code reviews, reusable patterns, and debugging support for the next builders.'],
];

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

const DisciplineCard = ({ index, title, description }) => {
  const Icon = DISCIPLINE_ICONS[title] || Layers;
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
  return (
    <>
      <ChapterHeading no="01" eyebrow="The Craft" title="Origin." />

      <div className="flex flex-col lg:flex-row gap-12 mt-10 items-start">
        {/* Left — the tale */}
        <ScrollReveal direction="up" delay={0.15} className="flex-1">
          <p className="font-chronicle italic text-[22px] leading-[32px] mb-5" style={{ color: 'var(--color-ember)' }}>
            “Every realm below began as an empty repository and a blinking cursor.”
          </p>
          <p className="text-[17px] leading-[30px]" style={{ color: 'var(--color-text-muted)' }}>
            {personalInfo.bio}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {stats.map((stat) => (
              <StatTile key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </ScrollReveal>

        {/* Right — scribe's note */}
        <ScrollReveal direction="left" delay={0.3} className="flex-1 w-full">
          <div className="realm-card p-8">
            <span className="chapter-eyebrow inline-flex items-center gap-2">
              <ScrollText size={14} style={{ color: 'var(--color-ember)' }} /> The Scribe's Note
            </span>
            <ul className="mt-6 space-y-5">
              {PRINCIPLES.map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-ember)', boxShadow: '0 0 10px var(--color-ember)' }} />
                  <span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{title}.</span>{' '}
                    <span className="text-[14px] leading-[22px]" style={{ color: 'var(--color-text-muted)' }}>{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
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
            <DisciplineCard key={service.title} index={index} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
