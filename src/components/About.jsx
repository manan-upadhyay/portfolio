import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { services, personalInfo, skillCategories, stats } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper } from '../hoc';
import { useThemeStore } from '../store/useThemeStore';
import { SplitText, BlurText, TiltCard, ScrollReveal, SpotlightCard } from './ui';

const ServiceCard = ({ index, title, description, icon }) => {
  return (
    <ScrollReveal direction="up" delay={index * 0.15} className="xs:w-[280px] w-full">
      <TiltCard maxTilt={10} scale={1.02} className="w-full h-full">
        <SpotlightCard 
          className="w-full p-[1px] rounded-[20px] shadow-card h-full"
          spotlightColor="rgba(var(--color-accent-rgb), 0.15)"
        >
          <div
            className="glass-card rounded-[20px] py-6 px-8 min-h-[320px] flex justify-between items-center flex-col border border-[var(--color-card-border)]"
            style={{ background: 'var(--color-card-bg)' }}
          >
            <motion.img 
              src={icon} 
              alt={title} 
              className="w-20 h-20 object-contain"
              style={{ filter: 'drop-shadow(0 0 20px var(--color-accent))' }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <h3 
              className="text-[20px] font-bold text-center mt-4"
              style={{ color: 'var(--color-text)' }}
            >
              {title}
            </h3>
            <p 
              className="text-[14px] text-center mt-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {description}
            </p>
          </div>
        </SpotlightCard>
      </TiltCard>
    </ScrollReveal>
  );
};

const SkillBar = ({ skill, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="mb-4"
    >
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {skill.name}
        </span>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {skill.level}%
        </span>
      </div>
      <div 
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--color-card-bg)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-accent)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, label, delay }) => {
  return (
    <motion.div
      className="glass-card p-4 rounded-xl text-center border border-[var(--color-card-border)]"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <motion.p 
        className="text-3xl font-bold"
        style={{
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {value}
      </motion.p>
      <p 
        className="text-sm mt-1"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
    </motion.div>
  );
};

const About = () => {
  const { resolvedTheme } = useThemeStore();

  return (
    <>
      {/* Section Header with SplitText */}
      <div>
        <p 
          className={styles.sectionSubText}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <BlurText text="Introduction" delay={0} duration={0.6} />
        </p>
        <h2 
          className={styles.sectionHeadText}
          style={{ color: 'var(--color-text)' }}
        >
          <SplitText 
            text="About Me." 
            animationType="slide"
            staggerChildren={0.05}
            delay={0.2}
          />
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        {/* Left: Bio */}
        <ScrollReveal direction="up" delay={0.3} className="flex-1">
          <p
            className="text-[17px] leading-[30px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {personalInfo.bio}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={index}
                value={stat.value}
                label={stat.label}
                delay={index * 0.1 + 0.4}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Right: Skills */}
        <ScrollReveal direction="left" delay={0.4} className="flex-1">
          <h3 
            className="text-[24px] font-bold mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            <SplitText text="Core Skills" animationType="blur" delay={0.5} />
          </h3>
          
          {skillCategories.slice(0, 2).map((category, catIndex) => (
            <div key={category.category} className="mb-6">
              <h4 
                className="text-[16px] font-semibold mb-3"
                style={{ color: 'var(--color-accent)' }}
              >
                {category.category}
              </h4>
              {category.skills.slice(0, 4).map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  delay={catIndex * 0.2 + skillIndex * 0.1 + 0.5}
                />
              ))}
            </div>
          ))}
        </ScrollReveal>
      </div>

      {/* Services with TiltCard and SpotlightCard */}
      <div className="mt-20 flex flex-wrap justify-center gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
