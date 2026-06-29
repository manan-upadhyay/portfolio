import { motion, useReducedMotion } from 'framer-motion';
import { Check, Feather } from 'lucide-react';

/**
 * Cinematic form feedback — a shaking "returned raven" notice (error) or a
 * settling success note. Shared by every raven form (Contact + the Voice Hall
 * "summon a voice" request). Shake/entrance run via Framer so they compose
 * cleanly; the `.raven-notice` styling lives in index.css. Pair it with the
 * `error`/`raven` cues (see lib/raven.js) for the matching sound.
 */
const RavenNotice = ({ type, children }) => {
  const isError = type === 'error';
  const reduce = useReducedMotion();
  return (
    <motion.div
      role={isError ? 'alert' : 'status'}
      className={`raven-notice ${isError ? 'raven-notice--error' : 'raven-notice--success'}`}
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: isError && !reduce ? [0, -6, 6, -4, 4, -2, 0] : 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 460, damping: 26, x: { duration: 0.5, ease: 'easeInOut' } }}
    >
      <span className="raven-notice__icon">{isError ? <Feather size={15} /> : <Check size={15} />}</span>
      <p className="raven-notice__text">{children}</p>
    </motion.div>
  );
};

export default RavenNotice;
