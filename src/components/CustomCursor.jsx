import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // Main cursor position - using motion values for performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth trailing cursor with spring physics
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Update cursor position
  const moveCursor = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);
  
  // Handle pointer detection and mouse events
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e) => {
      moveCursor(e);
      
      // Check if hovering over interactive element
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]');
      setIsPointer(!!isInteractive);
    };
    
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile, moveCursor]);
  
  // Don't render on mobile
  if (isMobile) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Main cursor ring */}
      <motion.div
        className="fixed rounded-full border-2 border-[var(--color-accent)]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: isPointer ? 50 : 30,
          height: isPointer ? 50 : 30,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
        }}
        animate={{
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      
      {/* Inner dot */}
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-[var(--color-accent)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
        }}
        animate={{
          scale: isPointer ? 0.5 : 1,
        }}
      />
      
      {/* Glow effect when hovering */}
      {isPointer && (
        <motion.div
          className="fixed rounded-full"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            width: 60,
            height: 60,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
            opacity: isHidden ? 0 : 0.3,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </div>
  );
};

export default CustomCursor;
