import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';

import 'react-vertical-timeline-component/style.min.css';

import { styles } from '../styles';
import { experiences } from '../constants';
import { SectionWrapper } from '../hoc';
import { textVariant } from '../utils/motion';
import { useThemeStore } from '../store/useThemeStore';

const ExperienceCard = ({ experience }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: isDark 
          ? 'rgba(21, 16, 48, 0.9)' 
          : 'rgba(255, 245, 238, 0.9)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255, 107, 53, 0.2)'}`,
        borderRadius: '16px',
        boxShadow: isDark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
          : '0 20px 40px rgba(255, 107, 53, 0.1)',
      }}
      contentArrowStyle={{ 
        borderRight: `7px solid ${isDark ? 'rgba(0, 255, 163, 0.5)' : 'rgba(255, 107, 53, 0.5)'}` 
      }}
      date={experience.date}
      dateClassName="text-[var(--color-text-muted)]"
      iconStyle={{ 
        background: isDark ? '#151030' : '#FFE5D9',
        border: `3px solid ${isDark ? 'var(--color-accent)' : 'var(--color-accent)'}`,
      }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 
          className="text-[24px] font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          {experience.title}
        </h3>
        <p
          className="text-[16px] font-semibold"
          style={{ margin: 0, color: 'var(--color-accent)' }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-[14px] pl-1 tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {point}
          </li>
        ))}
      </ul>

      {/* Technologies used */}
      {experience.technologies && (
        <div className="mt-5 flex flex-wrap gap-2">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="text-[12px] px-3 py-1 rounded-full"
              style={{
                background: isDark 
                  ? 'rgba(0, 255, 163, 0.1)' 
                  : 'rgba(255, 107, 53, 0.1)',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <motion.div variants={textVariant()}>
        <p 
          className={`${styles.sectionSubText} text-center`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          What I have done so far
        </p>
        <h2 
          className={`${styles.sectionHeadText} text-center`}
          style={{ color: 'var(--color-text)' }}
        >
          Work Experience.
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline
          lineColor={isDark ? 'var(--color-accent)' : 'var(--color-accent)'}
        >
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, 'work');
