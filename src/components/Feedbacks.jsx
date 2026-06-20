import React from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';
import { useThemeStore } from '../store/useThemeStore';

// Placeholder testimonials data — to be filled with real ones later
const testimonials = [];

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <motion.div
      variants={fadeIn('', 'spring', index * 0.5, 0.75)}
      className="glass-card p-10 rounded-3xl xs:w-[320px] w-full border border-[var(--color-card-border)]"
    >
      <p 
        className="font-black text-[48px]"
        style={{ color: 'var(--color-accent)' }}
      >
        "
      </p>

      <div className="mt-1">
        <p 
          className="tracking-wider text-[18px]"
          style={{ color: 'var(--color-text)' }}
        >
          {testimonial}
        </p>

        <div className="mt-7 flex justify-between items-center gap-1">
          <div className="flex-1 flex flex-col">
            <p 
              className="font-medium text-[16px]"
              style={{ color: 'var(--color-text)' }}
            >
              <span className="accent-text-gradient">@</span> {name}
            </p>
            <p 
              className="mt-1 text-[12px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {designation} of {company}
            </p>
          </div>

          {image && (
            <img
              src={image}
              alt={`feedback_by-${name}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Feedbacks = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div className="mt-12 rounded-[20px]">
      <div
        className={`rounded-2xl ${styles.padding} min-h-[300px]`}
        style={{ background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(238, 242, 255, 0.5)' }}
      >
        <motion.div variants={textVariant()}>
          <p 
            className={styles.sectionSubText}
            style={{ color: 'var(--color-text-muted)' }}
          >
            What others say
          </p>
          <h2 
            className={styles.sectionHeadText}
            style={{ color: 'var(--color-text)' }}
          >
            Testimonials.
          </h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
            <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
          ))
        ) : (
          <motion.p 
            variants={fadeIn('', 'spring', 0.5, 0.75)}
            className="text-center w-full py-10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Testimonials coming soon...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, '');
