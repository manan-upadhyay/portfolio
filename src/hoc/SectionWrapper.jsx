import { motion } from 'framer-motion';
import { staggerContainer } from '../lib/motion';

// Section padding (was the only token consumed from the old template `styles`).
const SECTION_PADDING = 'sm:px-16 px-6 sm:py-16 py-10';

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`${SECTION_PADDING} max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={idName} />
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
