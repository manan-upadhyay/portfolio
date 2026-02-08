import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import { Link } from 'react-router-dom';
import { logo, menu, close } from '../assets';
import { navLinks, personalInfo } from '../constants';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-primary)]/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <motion.img 
            src={logo} 
            alt="logo" 
            className="w-10 h-10 object-contain"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex flex-col">
            <p className="text-[var(--color-text)] text-[18px] font-bold cursor-pointer flex items-center gap-1">
              {personalInfo.name}
            </p>
            <span className="text-[var(--color-text-muted)] text-[11px] hidden sm:block">
              Full Stack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <ul className="list-none flex flex-row gap-8">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className={`${
                  active === link.title
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)]'
                } hover:text-[var(--color-accent)] text-[16px] font-medium cursor-pointer transition-colors duration-300 link-hover`}
                onClick={() => setActive(link.title)}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
          
          {/* Resume Button */}
          <motion.a
            href={personalInfo.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-accent)] hover:opacity-90 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Resume
          </motion.a>
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setToggle(!toggle)}
            className="w-[28px] h-[28px] flex items-center justify-center"
          >
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[24px] h-[24px] object-contain cursor-pointer"
              style={{ filter: 'var(--color-text) === "#1a1a2e" ? "invert(1)" : "none"' }}
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 glass-card absolute top-20 right-0 mx-4 my-2 min-w-[200px] z-10"
            >
              <ul className="list-none flex flex-col justify-end items-start gap-4">
                {navLinks.map((link) => (
                  <li
                    key={link.id}
                    className={`${
                      active === link.title
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text-muted)]'
                    } font-poppins font-medium text-[16px] cursor-pointer transition-colors duration-300`}
                    onClick={() => {
                      setActive(link.title);
                      setToggle(false);
                    }}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                ))}
                <li>
                  <a
                    href={personalInfo.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-accent)] inline-block mt-2"
                  >
                    Download Resume
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
