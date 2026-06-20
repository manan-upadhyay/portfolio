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
// Official React Bits components
import SplitText from './SplitText';
import BlurText from './BlurText';

const ExperienceCard = ({ experience }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: isDark 
          ? 'rgba(30, 41, 59, 0.85)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.1)'}`,
        borderRadius: '16px',
        boxShadow: isDark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(129, 140, 248, 0.05)' 
          : '0 20px 40px rgba(79, 70, 229, 0.08)',
      }}
      contentArrowStyle={{ 
        borderRight: `7px solid ${isDark ? 'rgba(129, 140, 248, 0.4)' : 'rgba(79, 70, 229, 0.3)'}` 
      }}
      date={experience.date}
      dateClassName="text-[var(--color-text-muted)]"
      iconStyle={{ 
        background: isDark ? '#1E293B' : '#EEF2FF',
        border: `3px solid var(--color-accent)`,
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
                  ? 'rgba(129, 140, 248, 0.1)' 
                  : 'rgba(79, 70, 229, 0.08)',
                color: 'var(--color-accent)',
                border: `1px solid ${isDark ? 'rgba(129, 140, 248, 0.25)' : 'rgba(79, 70, 229, 0.15)'}`,
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
      <div className="text-center">
        <p 
          className={`${styles.sectionSubText}`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <BlurText text="What I have done so far" delay={0} />
        </p>
        <h2 
          className={`${styles.sectionHeadText}`}
          style={{ color: 'var(--color-text)' }}
        >
          <SplitText 
            text="Work Experience." 
            animationType="slide"
            staggerChildren={0.08}
            delay={0.2}
          />
        </h2>
      </div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline
          lineColor={isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(79, 70, 229, 0.2)'}
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
