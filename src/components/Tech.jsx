import React from 'react';
import { motion } from 'framer-motion';
import { BallCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { technologies, skillCategories } from '../constants';
import { textVariant, fadeIn } from '../utils/motion';
import { styles } from '../styles';
import { useThemeStore } from '../store/useThemeStore';

const TechIcon = ({ technology, index }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.1, 0.5)}
      className="relative group"
    >
      <div className="w-28 h-28 relative">
        <BallCanvas icon={technology.icon} />
      </div>
      
      {/* Tooltip */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          style={{
            background: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.1)',
            color: 'var(--color-accent)',
          }}
        >
          {technology.name}
        </span>
      </div>
    </motion.div>
  );
};

const SkillCategory = ({ category, skills, index }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.2, 0.75)}
      className="glass-card p-6 rounded-2xl"
    >
      <h4 
        className="text-lg font-bold mb-4"
        style={{ color: 'var(--color-accent)' }}
      >
        {category}
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={skill.name}
            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
            style={{
              background: isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(79, 70, 229, 0.05)',
              color: 'var(--color-text)',
              border: `1px solid ${isDark ? 'rgba(129, 140, 248, 0.2)' : 'rgba(79, 70, 229, 0.12)'}`,
            }}
            whileHover={{ 
              scale: 1.05,
              background: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.1)',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            {skill.name}
            <span 
              className="text-xs px-1.5 py-0.5 rounded-md"
              style={{ 
                background: 'var(--gradient-accent)',
                color: '#ffffff',
              }}
            >
              {skill.level}%
            </span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const Tech = () => {
  const { resolvedTheme } = useThemeStore();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <motion.div variants={textVariant()} className="mb-10">
        <p 
          className={`${styles.sectionSubText} text-center`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          What I work with
        </p>
        <h2 
          className={`${styles.sectionHeadText} text-center`}
          style={{ color: 'var(--color-text)' }}
        >
          Technologies.
        </h2>
      </motion.div>

      {/* 3D Tech Balls - Hidden on mobile for performance */}
      {!isMobile && (
        <div className="flex flex-row flex-wrap justify-center gap-10 mb-16">
          {technologies.map((technology, index) => (
            <TechIcon key={technology.name} technology={technology} index={index} />
          ))}
        </div>
      )}

      {/* Skill Categories with proficiency - Always visible */}
      <div className="grid md:grid-cols-3 gap-6">
        {skillCategories.map((cat, index) => (
          <SkillCategory
            key={cat.category}
            category={cat.category}
            skills={cat.skills}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, '');
