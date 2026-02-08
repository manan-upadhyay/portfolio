import { motion } from 'framer-motion';

/**
 * GradientText - Animated gradient text with shimmer effect
 */
const GradientText = ({
  children,
  className = '',
  gradient = 'linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary), var(--color-accent))',
  animate = true,
  duration = 3,
}) => {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: animate ? '200% 100%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : undefined}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
