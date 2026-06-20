import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CommandPalette - Cmd+K command palette for power users
 * Shows off developer skills with advanced UX pattern
 */
const CommandPalette = ({
  commands = [],
  onCommand,
  placeholder = 'Type a command...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Default commands
  const defaultCommands = [
    { id: 'home', label: 'Go to Home', icon: '🏠', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'about', label: 'Go to About', icon: '👋', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'work', label: 'View Projects', icon: '💼', action: () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'contact', label: 'Contact Me', icon: '📧', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'theme', label: 'Toggle Theme', icon: '🌓', action: () => document.querySelector('[data-theme-toggle]')?.click() },
    { id: 'resume', label: 'Download Resume', icon: '📄', action: () => window.open('/resume.pdf', '_blank') },
    { id: 'github', label: 'View GitHub', icon: '🐙', action: () => window.open('https://github.com/mananupadhyay', '_blank') },
    { id: 'confetti', label: '🎉 Celebrate!', icon: '🎊', action: () => triggerConfetti() },
  ];

  const allCommands = [...defaultCommands, ...commands];

  // Filter commands based on search
  const filteredCommands = allCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  }, [filteredCommands, selectedIndex]);

  const executeCommand = (cmd) => {
    cmd.action?.();
    onCommand?.(cmd);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 w-full max-w-lg z-50"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="glass-card rounded-xl overflow-hidden shadow-2xl border border-[var(--color-card-border)]">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-card-border)]">
                <span className="text-[var(--color-text-muted)]">⌘</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent outline-none text-[var(--color-text)] placeholder-[var(--color-text-muted)]"
                />
                <kbd className="px-2 py-1 text-xs rounded bg-[var(--color-secondary)] text-[var(--color-text-muted)]">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                    No commands found
                  </div>
                ) : (
                  filteredCommands.map((cmd, index) => (
                    <button
                      key={cmd.id}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                      }`}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="text-xl">{cmd.icon}</span>
                      <span className="flex-1">{cmd.label}</span>
                      {index === selectedIndex && (
                        <span className="text-sm opacity-75">↵</span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-[var(--color-card-border)] text-xs text-[var(--color-text-muted)] flex justify-between">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Simple confetti effect
function triggerConfetti() {
  const colors = ['#6366F1', '#818CF8', '#A78BFA', '#F59E0B', '#22C55E'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      z-index: 9999;
      pointer-events: none;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Add confetti animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(${Math.random() * 720}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default CommandPalette;
