import { motion } from 'framer-motion';

/**
 * MapDivider — a thin cartographer's route divider drawn between chapters.
 * A dashed ink line with a glowing waypoint diamond at its centre.
 */
const MapDivider = ({ className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-6 sm:px-16 py-6 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-4 opacity-70">
        <div className="flex-1 h-px" style={{ background: 'var(--gradient-map-line)' }} />
        <svg width="46" height="14" viewBox="0 0 46 14" fill="none">
          <motion.path
            d="M2 7 H16"
            stroke="var(--color-ember)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <path d="M23 1 L29 7 L23 13 L17 7 Z" fill="var(--color-gold)" />
          <path
            d="M44 7 H30"
            stroke="var(--color-ember)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </svg>
        <div className="flex-1 h-px" style={{ background: 'var(--gradient-map-line)' }} />
      </div>
    </div>
  );
};

export default MapDivider;
