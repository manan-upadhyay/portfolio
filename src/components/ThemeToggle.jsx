import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';

const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #FFE5D9 0%, #FFCDB2 50%, #FFB4A2 100%)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Stars for dark mode */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 15}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Toggle circle */}
      <motion.div
        className="relative w-5 h-5 rounded-full flex items-center justify-center"
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
          backgroundColor: isDark ? '#f4f4f5' : '#FFD93D',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Sun rays */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            rotate: isDark ? 0 : 360,
          }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-1 bg-amber-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 45}deg) translateY(-8px) translateX(-1px)`,
              }}
            />
          ))}
        </motion.div>

        {/* Moon craters */}
        <motion.div
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute w-1 h-1 rounded-full bg-gray-300 top-1 right-1" />
          <div className="absolute w-0.5 h-0.5 rounded-full bg-gray-300 bottom-1 left-1" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
