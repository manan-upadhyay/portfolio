import { useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * Custom hook for parallax scrolling effects
 * @param {Object} options
 * @param {number} options.offset - Parallax offset multiplier (negative = slower, positive = faster)
 * @param {Array} options.inputRange - Scroll progress input range [start, end]
 * @param {Array} options.outputRange - Transform output range
 * @returns {{ ref: RefObject, y: MotionValue, opacity: MotionValue }}
 */
export const useParallax = (options = {}) => {
  const {
    offset = 0.5,
    inputRange = [0, 1],
    outputRange,
  } = options;
  
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  // Calculate Y transform
  const yRange = outputRange || [0, offset * 100];
  const y = useTransform(scrollYProgress, inputRange, yRange);
  
  // Smooth spring physics
  const ySpring = useSpring(y, { stiffness: 100, damping: 30 });
  
  // Opacity fade based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  return { ref, y: ySpring, opacity, scrollYProgress };
};

/**
 * Hook for layered parallax (background, content, foreground)
 * @returns {Object} Multiple parallax values for different layers
 */
export const useLayeredParallax = () => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  // Background moves slower
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Content moves at normal speed (no transform needed)
  
  // Foreground moves faster
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  
  // Smooth springs
  const bgYSpring = useSpring(bgY, { stiffness: 50, damping: 20 });
  const fgYSpring = useSpring(fgY, { stiffness: 80, damping: 25 });
  
  return {
    ref,
    background: { y: bgYSpring },
    foreground: { y: fgYSpring },
    scrollYProgress,
  };
};

/**
 * Hook for horizontal parallax (useful for cards/galleries)
 */
export const useHorizontalParallax = (offset = 50) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const x = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const xSpring = useSpring(x, { stiffness: 100, damping: 30 });
  
  return { ref, x: xSpring, scrollYProgress };
};

/**
 * Hook for scale parallax (zoom in/out on scroll)
 */
export const useScaleParallax = (minScale = 0.8, maxScale = 1) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale]);
  const scaleSpring = useSpring(scale, { stiffness: 100, damping: 30 });
  
  return { ref, scale: scaleSpring, scrollYProgress };
};

/**
 * Hook for rotation parallax
 */
export const useRotateParallax = (maxRotation = 15) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-maxRotation, 0, maxRotation]);
  const rotateSpring = useSpring(rotate, { stiffness: 100, damping: 30 });
  
  return { ref, rotate: rotateSpring, scrollYProgress };
};

export default useParallax;
