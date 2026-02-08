import { motion } from 'framer-motion';

/**
 * BlurText - Text that fades in with a blur effect
 * Perfect for subtitles and secondary text
 */
const BlurText = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  blur = 10,
  once = true,
}) => {
  return (
    <motion.span
      className={`inline-block will-change-transform ${className}`}
      initial={{ 
        opacity: 0, 
        filter: `blur(${blur}px)`,
        y: 10,
      }}
      whileInView={{ 
        opacity: 1, 
        filter: 'blur(0px)',
        y: 0,
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {text}
    </motion.span>
  );
};

export default BlurText;
