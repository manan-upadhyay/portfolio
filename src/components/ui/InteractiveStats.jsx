import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * AnimatedCounter - Counts up to a target number on scroll into view
 */
const AnimatedCounter = ({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const startValue = 0;
    const endValue = parseFloat(target);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * eased;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  // Format number based on target type
  const formatNumber = (num) => {
    if (target.toString().includes('+')) {
      return Math.floor(num) + '+';
    }
    if (target.toString().includes('%')) {
      return Math.floor(num) + '%';
    }
    return Math.floor(num);
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

/**
 * InteractiveStats - Stats grid with counters and easter eggs
 */
const InteractiveStats = ({ stats, className = '' }) => {
  const [clickedStats, setClickedStats] = useState({});
  const [achievements, setAchievements] = useState([]);

  const handleStatClick = useCallback((index, stat) => {
    setClickedStats(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));

    // Easter egg: Show fun fact after 3 clicks
    if ((clickedStats[index] || 0) + 1 === 3 && stat.funFact) {
      setAchievements(prev => [...prev, {
        id: Date.now(),
        message: stat.funFact,
      }]);

      // Remove achievement after 3 seconds
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => a.id !== Date.now()));
      }, 3000);
    }
  }, [clickedStats]);

  return (
    <div className={`relative ${className}`}>
      {/* Stats Grid */}
      <div className="flex flex-wrap gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="glass-card px-4 py-3 rounded-xl cursor-pointer select-none"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatClick(index, stat)}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p className="text-2xl font-bold accent-text-gradient">
              <AnimatedCounter 
                target={stat.value.replace(/[^0-9.]/g, '')} 
                suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
              />
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            
            {/* Click indicator */}
            {clickedStats[index] > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-xs text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {clickedStats[index]}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Achievement Popups */}
      <div className="fixed top-24 right-4 z-50 space-y-2">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className="glass-card px-4 py-3 rounded-xl max-w-xs"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <p className="text-sm text-[var(--color-text)]">🎉 {achievement.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveStats;
