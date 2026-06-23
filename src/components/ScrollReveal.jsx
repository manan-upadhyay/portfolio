import { motion, useReducedMotion } from 'framer-motion';

/**
 * ScrollReveal - Wrapper for scroll-triggered reveal animations
 * Optimized for performance with Intersection Observer
 */
const ScrollReveal = ({
  children,
  className = '',
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'fade'
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  threshold = 0.1,
}) => {
  // Honor prefers-reduced-motion: reveals collapse to a simple opacity fade
  // (no transform), per the design system's motion-accessibility rule.
  const shouldReduce = useReducedMotion();

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'fade':
        return { opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'fade':
        return { opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      initial={shouldReduce ? { opacity: 0 } : getInitialPosition()}
      whileInView={shouldReduce ? { opacity: 1 } : getFinalPosition()}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: shouldReduce ? 0.3 : duration,
        delay: shouldReduce ? 0 : delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
