import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { styles } from '../styles';
import { github } from '../assets';
import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { useThemeStore } from '../store/useThemeStore';
import { SplitText, BlurText, TiltCard, SpotlightCard, ScrollReveal, Magnet } from './ui';

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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <ScrollReveal direction="up" delay={index * 0.1} className="sm:w-[360px] w-full">
      <TiltCard maxTilt={8} scale={1.02}>
        <SpotlightCard 
          className="h-full"
          spotlightColor={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'}
        >
          <div className="glass-card p-5 rounded-2xl h-full border border-[var(--color-card-border)]">
            {/* Project Image */}
            <div 
              className="relative w-full h-[200px] rounded-xl overflow-hidden group"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #1d1836 0%, #302B63 100%)' 
                  : 'linear-gradient(135deg, #FFE5D9 0%, #FFCDB2 100%)',
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

              {/* Links overlay - Enhanced with better hover */}
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

              {/* Company badge */}
              {company && (
                <motion.div 
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'var(--color-card-bg)',
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
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.05)',
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
      </TiltCard>
    </ScrollReveal>
  );
};

const Works = () => {
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
            Here are some of the key projects I've delivered across various domains including 
            finance, healthcare, logistics, and more. Each project demonstrates my ability to 
            build scalable, production-ready applications with modern technologies.
          </p>
        </ScrollReveal>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, 'projects');
