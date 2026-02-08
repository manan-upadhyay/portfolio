import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * SplitText - Animates text by splitting into words/characters
 * Based on React Bits pattern, optimized for performance
 */
const SplitText = ({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.03,
  splitBy = 'word', // 'word' | 'char'
  animationType = 'slide', // 'slide' | 'fade' | 'scale' | 'blur'
  once = true,
}) => {
  // Split text into parts
  const parts = useMemo(() => {
    if (splitBy === 'char') {
      return text.split('').map((char, i) => ({
        char: char === ' ' ? '\u00A0' : char,
        key: `${char}-${i}`,
      }));
    }
    return text.split(' ').map((word, i) => ({
      char: word,
      key: `${word}-${i}`,
    }));
  }, [text, splitBy]);

  // Animation variants based on type
  const variants = useMemo(() => {
    const baseHidden = { opacity: 0 };
    const baseVisible = { opacity: 1 };

    switch (animationType) {
      case 'slide':
        return {
          hidden: { ...baseHidden, y: 20 },
          visible: { ...baseVisible, y: 0 },
        };
      case 'fade':
        return {
          hidden: baseHidden,
          visible: baseVisible,
        };
      case 'scale':
        return {
          hidden: { ...baseHidden, scale: 0.8 },
          visible: { ...baseVisible, scale: 1 },
        };
      case 'blur':
        return {
          hidden: { ...baseHidden, filter: 'blur(10px)' },
          visible: { ...baseVisible, filter: 'blur(0px)' },
        };
      default:
        return {
          hidden: { ...baseHidden, y: 20 },
          visible: { ...baseVisible, y: 0 },
        };
    }
  }, [animationType]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {parts.map(({ char, key }) => (
        <motion.span
          key={key}
          variants={childVariants}
          className="inline-block will-change-transform"
          style={{ marginRight: splitBy === 'word' ? '0.25em' : 0 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default SplitText;
