import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

import { styles } from '../styles';
import { EarthCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { slideIn, fadeIn } from '../utils/motion';
import { personalInfo } from '../constants';
import { useThemeStore } from '../store/useThemeStore';

const Contact = () => {
  const formRef = useRef();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: personalInfo.name,
          from_email: form.email,
          to_email: personalInfo.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          setForm({ name: '', email: '', message: '' });
          
          setTimeout(() => setSuccess(false), 5000);
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setError('Something went wrong. Please try again.');
        }
      );
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] glass-card p-8 rounded-2xl"
      >
        <p 
          className={styles.sectionSubText}
          style={{ color: 'var(--color-text-muted)' }}
        >
          Get in touch
        </p>
        <h3 
          className={styles.sectionHeadText}
          style={{ color: 'var(--color-text)' }}
        >
          Contact.
        </h3>

        {/* Contact Info */}
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
            style={{
              background: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.06)',
              color: 'var(--color-accent)',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {personalInfo.email}
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
            style={{
              background: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.06)',
              color: 'var(--color-accent)',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
            style={{
              background: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.06)',
              color: 'var(--color-accent)',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22C55E',
            }}
          >
            ✓ Thank you! I'll get back to you as soon as possible.
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
            }}
          >
            {error}
          </motion.div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-6"
        >
          <label className="flex flex-col">
            <span 
              className="font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="py-4 px-6 rounded-lg outline-none border font-medium transition-all duration-300 focus:border-[var(--color-accent)]"
              style={{
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(238, 242, 255, 0.8)',
                borderColor: 'var(--color-card-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>
          
          <label className="flex flex-col">
            <span 
              className="font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Your Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="py-4 px-6 rounded-lg outline-none border font-medium transition-all duration-300 focus:border-[var(--color-accent)]"
              style={{
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(238, 242, 255, 0.8)',
                borderColor: 'var(--color-card-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>
          
          <label className="flex flex-col">
            <span 
              className="font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Your Message
            </span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to discuss?"
              className="py-4 px-6 rounded-lg outline-none border font-medium transition-all duration-300 focus:border-[var(--color-accent)] resize-none"
              style={{
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(238, 242, 255, 0.8)',
                borderColor: 'var(--color-card-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>

          <motion.button
            type="submit"
            className="py-4 px-8 rounded-xl outline-none font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--gradient-accent)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
