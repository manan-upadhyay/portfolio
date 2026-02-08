import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EasterEggs - Hidden interactive features that showcase creativity
 */
const EasterEggs = () => {
  const [achievements, setAchievements] = useState([]);
  const [konamiActive, setKonamiActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [keySequence, setKeySequence] = useState([]);

  // Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  const showAchievement = useCallback((title, description, icon = '🏆') => {
    const id = Date.now();
    setAchievements(prev => [...prev, { id, title, description, icon }]);
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }, 4000);
  }, []);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newSequence = [...keySequence, e.code].slice(-10);
      setKeySequence(newSequence);

      if (newSequence.join(',') === konamiCode.join(',')) {
        setKonamiActive(true);
        showAchievement('🎮 Konami Code!', 'You found the secret code! You are a true gamer.');
        
        // Add rainbow effect
        document.body.classList.add('konami-mode');
        setTimeout(() => {
          document.body.classList.remove('konami-mode');
          setKonamiActive(false);
        }, 10000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, showAchievement]);

  // Click achievements
  useEffect(() => {
    const handleClick = () => {
      setClickCount(prev => {
        const newCount = prev + 1;
        
        if (newCount === 10) {
          showAchievement('👆 First Steps', 'You clicked 10 times!');
        } else if (newCount === 50) {
          showAchievement('🖱️ Click Master', 'You clicked 50 times! Impressive dedication.');
        } else if (newCount === 100) {
          showAchievement('🏅 Click Legend', 'You clicked 100 times! Are you okay?');
        }
        
        return newCount;
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showAchievement]);

  // Time on page achievement
  useEffect(() => {
    const timeouts = [
      setTimeout(() => showAchievement('⏰ Getting Started', 'You\'ve been here for 30 seconds!'), 30000),
      setTimeout(() => showAchievement('📚 Deep Reader', 'You\'ve been exploring for 2 minutes!'), 120000),
      setTimeout(() => showAchievement('🌟 True Fan', 'You\'ve been here for 5 minutes! Thank you!'), 300000),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [showAchievement]);

  return (
    <>
      {/* Achievement notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="glass-card px-4 py-3 rounded-xl shadow-lg pointer-events-auto"
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="font-bold text-[var(--color-text)]">{achievement.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Konami mode visual effect */}
      {konamiActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,127,0,0.1), rgba(255,255,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1), rgba(139,0,255,0.1))',
            backgroundSize: '400% 400%',
            animation: 'gradient-rainbow 3s ease infinite',
          }}
        />
      )}

      {/* Global styles for easter eggs */}
      <style>{`
        @keyframes gradient-rainbow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .konami-mode * {
          animation: konami-shake 0.1s infinite !important;
        }
        
        @keyframes konami-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </>
  );
};

export default EasterEggs;
