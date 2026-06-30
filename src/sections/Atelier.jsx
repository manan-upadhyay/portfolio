import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Hammer, Scissors, Compass, RefreshCcw, AudioLines, CloudSun, Drama, Map, Send, Fingerprint, Terminal } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { atelier } from '../constants';
import { ChapterHeading, ScrollReveal, CountUp, BuildReel, Observatory, CodebaseAtlas, PersonaTriptych } from '../components';

/* lucide glyph per field-guide entry (icon id → component). */
const EGG_ICONS = { compass: Compass, refresh: RefreshCcw, audio: AudioLines, sky: CloudSun, drama: Drama, map: Map, send: Send, fingerprint: Fingerprint, terminal: Terminal };

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

/* One ledger row — a built phase or a deliberate cut. */
const LedgerEntry = ({ title, why, kind }) => (
  <li className={`atelier-entry atelier-entry--${kind}`}>
    <span className="atelier-entry__title">{title}</span>
    <span className="atelier-entry__why">{why}</span>
  </li>
);

/* A numbered act — the connective spine of the Making-of. The roman numeral sits
   in a gutter the vertical spine runs through; the body holds the act's content. */
const Act = ({ num, eyebrow, title, intro, children }) => (
  <section className="atelier-act">
    <span className="atelier-act__num exp-mono" aria-hidden="true">{num}</span>
    <div className="atelier-act__body">
      <header className="atelier-act__head">
        <span className="chapter-eyebrow">{eyebrow}</span>
        {title && <h3 className="atelier-act__title font-chronicle">{title}</h3>}
        {intro && <p className="atelier-ledger__intro mt-3">{intro}</p>}
      </header>
      {children}
    </div>
  </section>
);

const Atelier = () => {
  const { t } = useTranslation();

  const manifesto = t('atelier.manifesto', { returnObjects: true });

  /* The headline figures, dissolved into one inline tally rather than a 5-up grid. */
  const Tally = () => (
    <p className="atelier-tally" aria-label={t('atelier.acts.build')}>
      {atelier.stats.map((s) => (
        <span key={s.key} className="atelier-tally__item">
          <span className="atelier-tally__value exp-mono">
            {s.count ? <CountUp value={s.value} /> : s.value}
          </span>
          <span className="atelier-tally__label">{t(`atelier.stats.${s.key}`)}</span>
        </span>
      ))}
    </p>
  );

  return (
    <>
      <ChapterHeading eyebrow={t('atelier.eyebrow')} title={`${t('atelier.title')}.`} />

      {/* Cold open — the human core of the section. */}
      <ScrollReveal direction="up" delay={0.1}>
        <p className="atelier-confession font-chronicle mt-7">{t('atelier.confession')}</p>
        <p className="atelier-confession__sub mt-4">{t('atelier.confessionSub')}</p>
      </ScrollReveal>

      <div className="atelier-acts mt-16">
        {/* Act I — The Build: the reel, the tally of figures, the built/cut ledger. */}
        <Act num="I" eyebrow={t('atelier.acts.build')}>
          <ScrollReveal direction="up" delay={0.05} className="realm-card atelier-card p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <span className="chapter-eyebrow">{t('atelier.reel.title')}</span>
              <span className="atelier-card__hint exp-mono">{t('atelier.reel.range')}</span>
            </div>
            <div className="mt-6">
              <BuildReel data={atelier.reel} />
            </div>
            <p className="atelier-card__caption mt-6">{t('atelier.reel.caption')}</p>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-8">
            <Tally />
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-12">
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
        </Act>

        {/* Act II — The Engine Room: the senior-signals showpiece, two parallel
            instruments — the Observatory (analytics/SEO/observability + the Discord
            alert path) and the Codebase Atlas (structure as proof of craft). */}
        <Act num="II" eyebrow={t('atelier.acts.engine')}>
          <ScrollReveal direction="up">
            <span className="chapter-eyebrow">{t('atelier.observatory.eyebrow')}</span>
            <h4 className="atelier-subhead font-chronicle mt-3">{t('atelier.observatory.title')}</h4>
            <p className="atelier-ledger__intro mt-3">{t('atelier.observatory.intro')}</p>
            <div className="mt-8"><Observatory /></div>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-16">
            <span className="chapter-eyebrow">{t('atelier.atlas.eyebrow')}</span>
            <h4 className="atelier-subhead font-chronicle mt-3">{t('atelier.atlas.title')}</h4>
            <p className="atelier-ledger__intro mt-3">{t('atelier.atlas.intro')}</p>
            <div className="mt-8"><CodebaseAtlas /></div>
          </ScrollReveal>
        </Act>

        {/* Act III — The Hidden Layer: the subtle interactions + the locked stack. */}
        <Act num="III" eyebrow={t('atelier.acts.hidden')}>
          <ScrollReveal direction="up">
            <span className="chapter-eyebrow">{t('atelier.eggs.title')}</span>
            <p className="atelier-ledger__intro mt-4">{t('atelier.eggs.intro')}</p>
            <ul className="atelier-eggs mt-7">
              {atelier.eggs.map((e) => (
                <EggCard key={e.id} icon={e.icon}
                  title={t(`atelier.eggs.${e.id}.title`)} how={t(`atelier.eggs.${e.id}.how`)} />
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-12">
            <span className="chapter-eyebrow">{t('atelier.builtWith')}</span>
            <div className="atelier-tech mt-4">
              {atelier.tech.map((name) => (
                <span key={name} className="atelier-chip exp-mono">{name}</span>
              ))}
            </div>
          </ScrollReveal>
        </Act>
      </div>

      {/* Coda — off the map: the three sides of the person behind the build, then
          the manifesto + signature. No numeral; it rhymes with the cold open. */}
      <ScrollReveal direction="up" className="atelier-coda mt-20">
        <span className="chapter-eyebrow">{t('atelier.offmap.title')}</span>
        <p className="atelier-ledger__intro mt-4">{t('atelier.offmap.intro')}</p>
        <div className="mt-7">
          <PersonaTriptych personas={atelier.personas} />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" className="atelier-manifesto mt-16">
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
