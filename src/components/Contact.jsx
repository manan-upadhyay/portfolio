import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Linkedin, Github, MapPin, ArrowUpRight, Send, Loader2, Check, Download, Copy } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { personalInfo, summon } from '../constants';
import { ChapterHeading, ScrollReveal } from './ui';

// Presentational icon map — data (label/value/href) lives in constants.
const CHANNEL_ICONS = { email: Mail, linkedin: Linkedin, github: Github, location: MapPin };

/* Copy-to-clipboard button (email row) — flips to a check for ~2s on success */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — the mailto link still works */ }
  };
  return (
    <button type="button" onClick={copy} data-cursor="hover"
      aria-label={copied ? 'Email copied' : 'Copy email address'}
      className="grid place-items-center w-9 h-9 rounded-lg flex-shrink-0 transition-colors"
      style={{ color: copied ? 'var(--color-success)' : 'var(--color-ember)', background: 'rgba(var(--color-ember-rgb),0.08)' }}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
};

/* Slowly-rotating compass rose — replaces the old 3D globe (no WebGL) */
const CompassRose = () => {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid place-items-center" style={{ width: 132, height: 132 }} aria-hidden="true">
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(var(--color-ember-rgb),0.14), transparent 70%)' }} />
      <motion.svg width="132" height="132" viewBox="0 0 120 120"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 60, repeat: Infinity, ease: 'linear' }}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-card-border)" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="var(--color-card-border)" strokeDasharray="2 6" />
        {[...Array(8)].map((_, i) => (
          <line key={i} x1="60" y1="60" x2="60" y2="10" stroke="var(--color-card-border)"
            transform={`rotate(${i * 45} 60 60)`} opacity={i % 2 ? 0.3 : 0.6} />
        ))}
        {/* N–S needle */}
        <polygon points="60,14 66,60 60,66 54,60" fill="var(--color-ember)" />
        <polygon points="60,106 54,60 60,54 66,60" fill="var(--color-gold)" opacity="0.7" />
        <circle cx="60" cy="60" r="4" fill="var(--color-ember)" />
      </motion.svg>
    </div>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [inquiry, setInquiry] = useState(summon.inquiries[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return setError(summon.errors.required);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError(summon.errors.email);

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
          message: `[${inquiry}]\n\n${form.message}`,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          setForm({ name: '', email: '', message: '' });
          setTimeout(() => setSuccess(false), 6000);
        },
        (err) => { setLoading(false); console.error(err); setError(summon.errors.failed); }
      );
  };

  const inputCls = 'w-full py-3.5 px-4 rounded-xl outline-none border transition-colors duration-300';
  const inputStyle = { background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)', color: 'var(--color-text)' };

  return (
    <>
      <ChapterHeading no="05" eyebrow="Summon" title="Send a Raven." />
      <div className="mt-5 flex items-center gap-2">
        <span className="status-dot" />
        <p className="text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {summon.availability}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mt-10">
        {/* ---- Message ---- */}
        <ScrollReveal direction="up" className="realm-card p-7 sm:p-9 min-w-0">
          <span className="chapter-eyebrow">The Message</span>

          {/* inquiry chips */}
          <div className="flex flex-wrap gap-2 mt-5 mb-7">
            {summon.inquiries.map((q) => {
              const active = q === inquiry;
              return (
                <motion.button key={q} type="button" onClick={() => setInquiry(q)} data-cursor="hover"
                  whileTap={{ scale: 0.94 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors"
                  style={{
                    background: active ? 'rgba(var(--color-ember-rgb),0.14)' : 'transparent',
                    borderColor: active ? 'rgba(var(--color-ember-rgb),0.5)' : 'var(--color-card-border)',
                    color: active ? 'var(--color-ember)' : 'var(--color-text-muted)',
                  }}>
                  {q}
                </motion.button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder={summon.placeholders.name}
                className={inputCls} style={inputStyle} aria-label="Your name" aria-required="true" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={summon.placeholders.email}
                className={inputCls} style={inputStyle} aria-label="Your email" aria-required="true" />
            </div>
            <textarea name="message" rows={5} value={form.message} onChange={handleChange}
              placeholder={summon.messagePlaceholders[inquiry] || summon.placeholders.message}
              className={`${inputCls} resize-none`} style={inputStyle} aria-label="Your message" aria-required="true" />

            {error && <p role="alert" className="text-[13px]" style={{ color: 'var(--color-error)' }}>{error}</p>}
            {success && (
              <motion.p role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="text-[14px] flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                <Check size={16} className="flex-shrink-0" /> {summon.success}
              </motion.p>
            )}

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={loading} data-cursor="hover"
                className="btn-primary flex-1 disabled:opacity-70">
                {loading ? (<><Loader2 size={18} className="animate-spin" /> {summon.submitLoading}</>) : (<>{summon.submitIdle} <Send size={16} /></>)}
              </button>
              <a href={personalInfo.resumeLink} download={summon.resumeFileName} data-cursor="hover"
                className="btn-secondary" aria-label={`${summon.resumeCta} (PDF)`}>
                <Download size={16} /> {summon.resumeCta}
              </a>
            </div>
          </form>
        </ScrollReveal>

        {/* ---- Correspondence ---- */}
        <ScrollReveal direction="up" delay={0.1} className="realm-card p-7 sm:p-9 flex flex-col min-w-0">
          <div className="flex items-start justify-between">
            <span className="chapter-eyebrow">Correspondence</span>
            <CompassRose />
          </div>

          <div className="mt-2 flex flex-col divide-y" style={{ borderColor: 'var(--color-card-border)' }}>
            {summon.channels.map(({ key, label, value, href }) => {
              const Icon = CHANNEL_ICONS[key];
              const IconBox = (
                <span className="grid place-items-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(var(--color-ember-rgb),0.1)', border: '1px solid rgba(var(--color-ember-rgb),0.25)' }}>
                  <Icon size={17} style={{ color: 'var(--color-ember)' }} />
                </span>
              );
              const Labels = (
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                  <span className="block text-[14px] truncate" style={{ color: 'var(--color-text)' }}>{value}</span>
                </span>
              );
              const Arrow = (
                <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: 'var(--color-ember)' }} />
              );

              // Email: the row still links (mailto), plus a copy button to the
              // right of the redirect arrow. (A <button> can't nest in an <a>,
              // so the link and the copy button are siblings.)
              if (key === 'email') {
                return (
                  <div key={key} className="flex items-center gap-2 py-4 group">
                    <a href={href} data-cursor="hover" className="flex items-center gap-4 flex-1 min-w-0">
                      {IconBox}{Labels}{Arrow}
                    </a>
                    <CopyButton text={personalInfo.email} />
                  </div>
                );
              }

              const Row = (
                <div className="flex items-center gap-4 py-4 group">
                  {IconBox}{Labels}{href && Arrow}
                </div>
              );
              return href ? (
                <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor="hover">{Row}</a>
              ) : (
                <div key={key}>{Row}</div>
              );
            })}
          </div>

          <p className="font-chronicle italic text-[17px] mt-auto pt-6" style={{ color: 'var(--color-ember)' }}>
            {summon.quote}
          </p>
        </ScrollReveal>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, 'contact');
