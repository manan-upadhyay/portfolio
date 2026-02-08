import React from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { styles } from '../styles';
import { services, personalInfo, skillCategories, stats } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper } from '../hoc';
import { useThemeStore } from '../store/useThemeStore';

const ServiceCard = ({ index, title, description, icon }) => {
  return (
    <Tilt className="xs:w-[280px] w-full">
      <motion.div
        variants={fadeIn('right', 'spring', 0.5 * index, 0.75)}
        className="w-full p-[1px] rounded-[20px] shadow-card"
        style={{ background: 'var(--gradient-accent)' }}
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="glass-card rounded-[20px] py-6 px-8 min-h-[320px] flex justify-between items-center flex-col"
        >
          <img 
            src={icon} 
            alt={title} 
            className="w-20 h-20 object-contain"
            style={{ filter: 'drop-shadow(0 0 20px var(--color-accent))' }} 
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
      </motion.div>
    </Tilt>
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

const About = () => {
  const { resolvedTheme } = useThemeStore();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p 
          className={styles.sectionSubText}
          style={{ color: 'var(--color-text-muted)' }}
        >
          Introduction
        </p>
        <h2 
          className={styles.sectionHeadText}
          style={{ color: 'var(--color-text)' }}
        >
          About Me.
        </h2>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        {/* Left: Bio */}
        <motion.div
          variants={fadeIn('', '', 0.1, 1)}
          className="flex-1"
        >
          <p
            className="text-[17px] leading-[30px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {personalInfo.bio}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="glass-card p-4 rounded-xl text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p 
                  className="text-3xl font-bold accent-text-gradient"
                  style={{
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Skills */}
        <motion.div
          variants={fadeIn('left', 'spring', 0.3, 1)}
          className="flex-1"
        >
          <h3 
            className="text-[24px] font-bold mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            Core Skills
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
                  delay={catIndex * 0.2 + skillIndex * 0.1}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Services */}
      <div className="mt-20 flex flex-wrap justify-center gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
