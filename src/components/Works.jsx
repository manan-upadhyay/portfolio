import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { styles } from '../styles';
import { github } from '../assets';
import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { useThemeStore } from '../store/useThemeStore';
// Official React Bits components
import SplitText from './SplitText';
import BlurText from './BlurText';
import TiltedCard from './TiltedCard';
import SpotlightCard from './SpotlightCard';
import Magnet from './Magnet';
import './TiltedCard.css';
import './SpotlightCard.css';
// Custom UI components
import { ScrollReveal } from './ui';

const ProjectCard = ({
  index,
  name,
  company,
  description,
  tags,
  image,
  source_code_link,
  live_demo_link,
  highlights,
  isFeatured,
  isNDA,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <ScrollReveal direction="up" delay={index * 0.1} className={isFeatured ? 'sm:w-[380px] w-full' : 'sm:w-[340px] w-full'}>
      <TiltedCard maxTilt={8} scale={1.02}>
        <SpotlightCard 
          className="h-full"
          spotlightColor={isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(79, 70, 229, 0.06)'}
        >
          <div className="glass-card p-5 rounded-2xl h-full border border-[var(--color-card-border)]">
            {/* Project Image */}
            <div 
              className="relative w-full h-[200px] rounded-xl overflow-hidden group"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' 
                  : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.span 
                    className="text-6xl font-bold opacity-20"
                    style={{ color: 'var(--color-accent)' }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {name.charAt(0)}
                  </motion.span>
                </div>
              )}

              {/* Links overlay - only show if links are available */}
              {(source_code_link || live_demo_link) && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center items-end pb-4 gap-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {source_code_link && (
                    <Magnet strength={0.3}>
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(source_code_link, '_blank')}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex justify-center items-center cursor-pointer border border-white/20"
                      >
                        <img
                          src={github}
                          alt="source code"
                          className="w-6 h-6 object-contain invert"
                        />
                      </motion.div>
                    </Magnet>
                  )}
                  {live_demo_link && (
                    <Magnet strength={0.3}>
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(live_demo_link, '_blank')}
                        className="w-12 h-12 rounded-full flex justify-center items-center cursor-pointer"
                        style={{ background: 'var(--gradient-accent)' }}
                      >
                        <svg 
                          className="w-5 h-5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </motion.div>
                    </Magnet>
                  )}
                </motion.div>
              )}

              {/* Badges row */}
              <div className="absolute top-3 left-3 flex gap-2">
                {/* Featured badge */}
                {isFeatured && (
                  <motion.div 
                    className="featured-badge"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </motion.div>
                )}
                
                {/* NDA badge */}
                {isNDA && (
                  <motion.div 
                    className="nda-badge"
                    style={{
                      background: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                      color: '#F59E0B',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    NDA
                  </motion.div>
                )}
              </div>

              {/* Company badge */}
              {company && (
                <motion.div 
                  className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-card-border)',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {company}
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="mt-5">
              <h3 
                className="font-bold text-[22px]"
                style={{ color: 'var(--color-text)' }}
              >
                {name}
              </h3>
              <p 
                className="mt-2 text-[14px] line-clamp-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {description}
              </p>
            </div>

            {/* Highlights (expandable) */}
            {highlights && highlights.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[13px] font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {isExpanded ? 'Hide' : 'Show'} highlights
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 list-disc list-inside space-y-1 overflow-hidden"
                    >
                      {highlights.map((highlight, i) => (
                        <li 
                          key={i}
                          className="text-[12px]"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {highlight}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, tagIndex) => (
                <motion.span
                  key={`${name}-${tag.name}`}
                  className={`text-[12px] px-2 py-1 rounded-md ${tag.color}`}
                  style={{
                    background: isDark 
                      ? 'rgba(129, 140, 248, 0.08)' 
                      : 'rgba(79, 70, 229, 0.06)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tagIndex * 0.05 + 0.3 }}
                >
                  #{tag.name}
                </motion.span>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </TiltedCard>
    </ScrollReveal>
  );
};

const Works = () => {
  const [showAll, setShowAll] = useState(false);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  const featuredProjects = projects.filter(p => p.isFeatured);
  const otherProjects = projects.filter(p => !p.isFeatured);
  const displayedOtherProjects = showAll ? otherProjects : [];

  return (
    <>
      {/* Section Header with SplitText */}
      <div>
        <p 
          className={`${styles.sectionSubText}`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <BlurText text="My work" delay={0} />
        </p>
        <h2 
          className={`${styles.sectionHeadText}`}
          style={{ color: 'var(--color-text)' }}
        >
          <SplitText 
            text="Projects." 
            animationType="slide"
            staggerChildren={0.1}
            delay={0.2}
          />
        </h2>
      </div>

      <div className="w-full flex">
        <ScrollReveal delay={0.3} direction="up">
          <p
            className="mt-3 text-[17px] max-w-3xl leading-[30px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Here are some of the key projects I've delivered across finance, healthcare, 
            logistics, media, and visualization domains. Each project demonstrates end-to-end 
            ownership from architecture to production deployment.
          </p>
          
          {/* NDA trust note */}
          <p
            className="mt-3 text-[14px] max-w-3xl leading-[24px] flex items-center gap-2"
            style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#F59E0B' }}>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Some projects are under NDA — details shared are limited to what's publicly permissible.
          </p>
        </ScrollReveal>
      </div>

      {/* Featured Projects */}
      <div className="mt-16 flex flex-wrap justify-center gap-8">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      {/* Other Projects - Toggle */}
      {otherProjects.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-center mb-10">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-300 flex items-center gap-2"
              style={{
                borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(79, 70, 229, 0.2)',
                color: 'var(--color-accent)',
                background: isDark ? 'rgba(129, 140, 248, 0.05)' : 'rgba(79, 70, 229, 0.03)',
              }}
              whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)' }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? 'Show Less' : `View ${otherProjects.length} More Projects`}
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-wrap justify-center gap-8 overflow-hidden"
              >
                {displayedOtherProjects.map((project, index) => (
                  <ProjectCard key={`other-project-${index}`} index={index} {...project} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, 'projects');
