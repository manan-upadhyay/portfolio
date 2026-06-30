import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Hammer, Scissors, Compass, RefreshCcw, AudioLines, CloudSun, Drama, Map, Send, Fingerprint, Terminal } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { atelier } from '../constants';
import { ChapterHeading, ScrollReveal, CountUp, BuildReel, Observatory, CodebaseAtlas, PersonaTriptych, FaceParticles } from '../components';

/* lucide glyph per field-guide entry (icon id → component). */
const EGG_ICONS = { compass: Compass, refresh: RefreshCcw, audio: AudioLines, sky: CloudSun, drama: Drama, map: Map, send: Send, fingerprint: Fingerprint, terminal: Terminal };

/* HeroInstrument — a faint, slowly-counter-rotating astrolabe that fills the open
   right side of the cold-open. Pure decoration (aria-hidden), masked to bleed off
   the page edge, theme-token strokes, frozen under prefers-reduced-motion (CSS). */
const TICKS = Array.from({ length: 48 }, (_, i) => i);
const SPOKES = Array.from({ length: 12 }, (_, i) => i);
const HeroInstrument = () => (
  <svg viewBox="0 0 400 400" className="atelier-instrument-svg" aria-hidden="true" focusable="false">
    {/* outer layer — graduated rim + tick ring */}
    <g className="atelier-instrument-ring atelier-instrument-ring--a">
      <circle cx="200" cy="200" r="192" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx="200" cy="200" r="172" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.5" strokeDasharray="1 5" />
      {TICKS.map((i) => {
        const a = (i / TICKS.length) * Math.PI * 2;
        const long = i % 4 === 0;
        const r1 = 172;
        const r2 = long ? 192 : 184;
        return (
          <line key={i}
            x1={200 + r1 * Math.cos(a)} y1={200 + r1 * Math.sin(a)}
            x2={200 + r2 * Math.cos(a)} y2={200 + r2 * Math.sin(a)}
            stroke="var(--color-gold)" strokeWidth={long ? 1 : 0.5} strokeOpacity="0.5" />
        );
      })}
    </g>

    {/* inner layer — astrolabe plate + spokes + compass rose (counter-rotating) */}
    <g className="atelier-instrument-ring atelier-instrument-ring--b" opacity={0.5}>
      <circle cx="200" cy="200" r="128" fill="none" stroke="var(--color-ember)" strokeWidth="0.7" strokeOpacity="0.15" />
      <circle cx="200" cy="200" r="92" fill="none" stroke="var(--color-ember)" strokeWidth="0.6" strokeOpacity="1" strokeDasharray="2 6" />
      {SPOKES.map((i) => {
        const a = (i / SPOKES.length) * Math.PI * 2;
        return (
          <line key={i}
            x1={200 + 40 * Math.cos(a)} y1={200 + 40 * Math.sin(a)}
            x2={200 + 128 * Math.cos(a)} y2={200 + 128 * Math.sin(a)}
            stroke="var(--color-ember)" strokeWidth="0.45" strokeOpacity="0.3" />
        );
      })}
      {/* compass rose */}
      <polygon points="200,108 208,200 200,196 192,200" fill="var(--color-ember)" opacity="0.5" />
      <polygon points="200,292 192,200 200,204 208,200" fill="var(--color-gold)" opacity="0.4" />
      <polygon points="108,200 200,192 196,200 200,208" fill="var(--color-gold)" opacity="0.3" />
      <polygon points="292,200 200,208 204,200 200,192" fill="var(--color-gold)" opacity="0.3" />
    </g>

    {/* still hub */}
    <circle cx="200" cy="200" r="4" fill="var(--color-gold)" opacity="0.6" />
  </svg>
);

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
   in a gutter the vertical spine runs through; the body holds the act's content.
   The act eyebrow is the prominent PARENT marker (gold, wide-tracked, longer rule). */
const Act = ({ num, eyebrow, title, intro, children }) => (
  <section className="atelier-act">
    <span className="atelier-act__num exp-mono" aria-hidden="true">{num}</span>
    <div className="atelier-act__body">
      <header className="atelier-act__head">
        <span className="chapter-eyebrow atelier-act__eyebrow">{eyebrow}</span>
        {title && <h3 className="atelier-act__title font-chronicle">{title}</h3>}
        {intro && <p className="atelier-ledger__intro mt-3">{intro}</p>}
      </header>
      {children}
    </div>
  </section>
);

/* An instrument inside an act — the subordinate CHILD tier: a small muted label
   tightly paired with a serif subhead, visually clearly below the act eyebrow so
   the title→subtitle relationship reads at a glance. */
const Instrument = ({ label, title, intro, className = '', children }) => (
  <div className={`atelier-instrument ${className}`}>
    <header className="atelier-instrument__head">
      <span className="atelier-sublabel">{label}</span>
      {title && <h4 className="atelier-subhead font-chronicle">{title}</h4>}
      {intro && <p className="atelier-instrument__intro">{intro}</p>}
    </header>
    {children}
  </div>
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
      {/* Cold open — the human core, with a faint astrolabe filling the open right. */}
      <div className="atelier-hero">
        <div className="atelier-hero__instrument" aria-hidden="true"><HeroInstrument /></div>
        <ChapterHeading eyebrow={t('atelier.eyebrow')} title={`${t('atelier.title')}.`} />
        <ScrollReveal direction="up" delay={0.1}>
          <p className="atelier-confession font-chronicle mt-7">{t('atelier.confession')}</p>
          <p className="atelier-confession__sub mt-4">{t('atelier.confessionSub')}</p>
        </ScrollReveal>
      </div>

      <div className="atelier-acts mt-16">
        {/* Act I — The Build: the reel, the tally of figures, the built/cut ledger. */}
        <Act num="I" eyebrow={t('atelier.acts.build')}>
          <ScrollReveal direction="up" delay={0.05} className="realm-card atelier-card p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <span className="atelier-sublabel">{t('atelier.reel.title')}</span>
              <span className="atelier-card__hint exp-mono">{t('atelier.reel.range')}</span>
            </div>
            <div className="mt-6">
              <BuildReel data={atelier.reel} />
            </div>
            <p className="atelier-card__caption mt-6">{t('atelier.reel.caption')}</p>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-14">
            <Tally />
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-20">
            <p className="atelier-ledger__intro">{t('atelier.ledger.intro')}</p>
            <div className="atelier-ledger mt-9">
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
            <Instrument
              label={t('atelier.observatory.eyebrow')}
              title={t('atelier.observatory.title')}
              intro={t('atelier.observatory.intro')}
            >
              <div className="mt-9"><Observatory /></div>
            </Instrument>
          </ScrollReveal>

          <ScrollReveal direction="up" className="atelier-instrument--gap">
            <Instrument
              label={t('atelier.atlas.eyebrow')}
              title={t('atelier.atlas.title')}
              intro={t('atelier.atlas.intro')}
            >
              <div className="mt-9"><CodebaseAtlas /></div>
            </Instrument>
          </ScrollReveal>
        </Act>

        {/* Act III — The Hidden Layer: the subtle interactions + the locked stack. */}
        <Act num="III" eyebrow={t('atelier.acts.hidden')}>
          <ScrollReveal direction="up">
            <span className="atelier-sublabel">{t('atelier.eggs.title')}</span>
            <p className="atelier-ledger__intro mt-4">{t('atelier.eggs.intro')}</p>
            <ul className="atelier-eggs mt-7">
              {atelier.eggs.map((e) => (
                <EggCard key={e.id} icon={e.icon}
                  title={t(`atelier.eggs.${e.id}.title`)} how={t(`atelier.eggs.${e.id}.how`)} />
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="up" className="mt-12">
            <span className="atelier-sublabel">{t('atelier.builtWith')}</span>
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

      <ScrollReveal direction="up" className="atelier-manifesto-row mt-16">
        <div className="atelier-manifesto">
          {manifesto.map((p, i) => (
            <motion.p key={i} className="atelier-manifesto__p"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
              {p}
            </motion.p>
          ))}
          <p className="atelier-sign font-chronicle mt-6">{t('atelier.sign')}</p>
        </div>
        {/* the maker, assembled from the same characters that built the site */}
        <FaceParticles />
      </ScrollReveal>
    </>
  );
};

export default SectionWrapper(Atelier, 'atelier');
