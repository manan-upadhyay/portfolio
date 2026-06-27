import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Hammer, Scissors, Compass, RefreshCcw, AudioLines, CloudSun, Drama, Map, Send, Fingerprint } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { atelier } from '../constants';
import { ChapterHeading, ScrollReveal, CountUp, BuildTimeline } from '../components';

/* lucide glyph per field-guide entry (icon id → component). */
const EGG_ICONS = { compass: Compass, refresh: RefreshCcw, audio: AudioLines, sky: CloudSun, drama: Drama, map: Map, send: Send, fingerprint: Fingerprint };

/* One field-guide entry — a subtle interaction + how/where to trigger it. */
const EggCard = ({ icon, title, how }) => {
  const Icon = EGG_ICONS[icon] ?? Compass;
  return (
    <motion.li
      className="atelier-egg"
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}
    >
      <span className="atelier-egg__icon" aria-hidden="true"><Icon size={17} strokeWidth={1.5} /></span>
      <span className="atelier-egg__title">{title}</span>
      <span className="atelier-egg__how">{how}</span>
    </motion.li>
  );
};

/* One headline metric — animated number (or literal) over an uppercase label. */
const Stat = ({ stat, label }) => (
  <div className="atelier-stat">
    <span className="atelier-stat__value exp-mono">
      {stat.count ? <CountUp value={stat.value} /> : stat.value}
    </span>
    <span className="atelier-stat__label">{label}</span>
  </div>
);

/* One ledger row — a built phase or a deliberate cut. */
const LedgerEntry = ({ title, why, kind }) => (
  <li className={`atelier-entry atelier-entry--${kind}`}>
    <span className="atelier-entry__title">{title}</span>
    <span className="atelier-entry__why">{why}</span>
  </li>
);

const Atelier = () => {
  const { t } = useTranslation();

  // The "done" milestone fraction → align the DOM flag with the canvas marker
  // (canvas pads 10px each side; mirror that with a calc()).
  const n = atelier.timeline.length;
  const doneIdx = Math.max(0, atelier.timeline.findIndex((d) => d.done));
  const doneFrac = n > 1 ? doneIdx / (n - 1) : 0;
  const flagLeft = `calc(10px + ${doneFrac} * (100% - 20px))`;

  const manifesto = t('atelier.manifesto', { returnObjects: true });

  return (
    <>
      <ChapterHeading eyebrow={t('atelier.eyebrow')} title={`${t('atelier.title')}.`} />

      {/* The confession — the human core of the section. */}
      <ScrollReveal direction="up" delay={0.1}>
        <p className="atelier-confession font-chronicle mt-7">{t('atelier.confession')}</p>
        <p className="atelier-confession__sub mt-4">{t('atelier.confessionSub')}</p>
      </ScrollReveal>

      {/* The build timeline instrument. */}
      <ScrollReveal direction="up" delay={0.05} className="realm-card atelier-card mt-12 p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <span className="chapter-eyebrow">{t('atelier.timeline.title')}</span>
          <span className="atelier-card__hint exp-mono">{t('atelier.timeline.range')}</span>
        </div>
        <div className="atelier-chart mt-5">
          <BuildTimeline data={atelier.timeline} />
          {/* the DOM "done" flag, aligned to the canvas marker */}
          <div className="atelier-flag" style={{ left: flagLeft }}>
            <span className="atelier-flag__dot" />
            <span className="atelier-flag__label">{t('atelier.timeline.doneFlag')}</span>
          </div>
          <span className="atelier-chart__axis atelier-chart__axis--start">{atelier.timeline[0].day}</span>
          <span className="atelier-chart__axis atelier-chart__axis--end">{t('atelier.timeline.now')}</span>
        </div>
        <p className="atelier-card__caption mt-5">{t('atelier.timeline.caption')}</p>
      </ScrollReveal>

      {/* Headline metrics. */}
      <div className="atelier-stats mt-10">
        {atelier.stats.map((s) => (
          <Stat key={s.key} stat={s} label={t(`atelier.stats.${s.key}`)} />
        ))}
      </div>

      {/* The ledger — what shipped, and what was cut. */}
      <ScrollReveal direction="up" className="mt-14">
        <p className="atelier-ledger__intro">{t('atelier.ledger.intro')}</p>
        <div className="atelier-ledger mt-7">
          <div className="atelier-col">
            <span className="atelier-col__head atelier-col__head--built">
              <Hammer size={14} /> {t('atelier.ledger.built')}
            </span>
            <ul className="atelier-col__list">
              {atelier.built.map((id) => (
                <LedgerEntry key={id} kind="built"
                  title={t(`atelier.phases.${id}.title`)} why={t(`atelier.phases.${id}.why`)} />
              ))}
            </ul>
          </div>
          <div className="atelier-col">
            <span className="atelier-col__head atelier-col__head--cut">
              <Scissors size={14} /> {t('atelier.ledger.cut')}
            </span>
            <ul className="atelier-col__list">
              {atelier.cut.map((id) => (
                <LedgerEntry key={id} kind="cut"
                  title={t(`atelier.cuts.${id}.title`)} why={t(`atelier.cuts.${id}.why`)} />
              ))}
            </ul>
          </div>
        </div>
      </ScrollReveal>

      {/* The field guide — the subtle interactions most visitors never find. */}
      <ScrollReveal direction="up" className="mt-14">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <span className="chapter-eyebrow">{t('atelier.eggs.title')}</span>
        </div>
        <p className="atelier-ledger__intro mt-4">{t('atelier.eggs.intro')}</p>
        <ul className="atelier-eggs mt-7">
          {atelier.eggs.map((e) => (
            <EggCard key={e.id} icon={e.icon}
              title={t(`atelier.eggs.${e.id}.title`)} how={t(`atelier.eggs.${e.id}.how`)} />
          ))}
        </ul>
      </ScrollReveal>

      {/* Built with — the locked stack, as data-driven chips. */}
      <ScrollReveal direction="up" className="mt-12">
        <span className="chapter-eyebrow">{t('atelier.builtWith')}</span>
        <div className="atelier-tech mt-4">
          {atelier.tech.map((name) => (
            <span key={name} className="atelier-chip exp-mono">{name}</span>
          ))}
        </div>
      </ScrollReveal>

      {/* The manifesto — closing note + signature. */}
      <ScrollReveal direction="up" className="atelier-manifesto mt-14">
        {manifesto.map((p, i) => (
          <motion.p key={i} className="atelier-manifesto__p"
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
            {p}
          </motion.p>
        ))}
        <p className="atelier-sign font-chronicle mt-6">{t('atelier.sign')}</p>
      </ScrollReveal>
    </>
  );
};

export default SectionWrapper(Atelier, 'atelier');
