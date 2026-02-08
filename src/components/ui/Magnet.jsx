import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnet - Creates a magnetic hover effect on children
 * Element follows cursor when hovering
 */
const Magnet = ({
  children,
  className = '',
  strength = 0.3, // 0-1, how strong the pull is
  radius = 200, // How far the magnet effect reaches
  disabled = false,
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (disabled || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < radius) {
      const pull = (1 - distance / radius) * strength;
      setPosition({
        x: distanceX * pull,
        y: distanceY * pull,
      });
    }
  }, [disabled, strength, radius]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
