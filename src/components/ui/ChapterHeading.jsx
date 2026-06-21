import { motion } from 'framer-motion';

/**
 * ChapterHeading — the shared "story chapter" section header.
 * Replaces the ad-hoc sectionSubText/sectionHeadText markup repeated across sections.
 *
 * Props:
 *  - no:      chapter number, e.g. "01"
 *  - eyebrow: small label, e.g. "The Craft"
 *  - title:   large serif title, e.g. "Origin."
 *  - align:   'left' | 'center'
 */
const ChapterHeading = ({ no, eyebrow, title, align = 'left', className = '' }) => {
  const isCenter = align === 'center';

  return (
    <div className={`${isCenter ? 'text-center flex flex-col items-center' : ''} ${className}`}>
      <motion.span
        className="chapter-eyebrow"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {no ? `Chapter ${no}` : null}
        {no && eyebrow ? <span aria-hidden="true">·</span> : null}
        {eyebrow}
      </motion.span>

      <motion.h2
        className="font-chronicle font-semibold leading-[0.95] mt-3 text-[clamp(40px,7vw,76px)]"
        style={{ color: 'var(--color-text)' }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className="map-line mt-5 rounded-full"
        style={{ transformOrigin: isCenter ? 'center' : 'left', width: isCenter ? '160px' : '104px' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ChapterHeading;
