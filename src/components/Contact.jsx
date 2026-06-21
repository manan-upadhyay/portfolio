import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Linkedin, Github, MapPin, ArrowUpRight, Send, Loader2 } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { personalInfo } from '../constants';
import { ChapterHeading, ScrollReveal } from './ui';

const INQUIRIES = ['Senior role', 'Contract', 'Collaboration', 'Just saying hi'];

const CHANNELS = [
  { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { icon: Linkedin, label: 'LinkedIn', value: 'in/manan-upadhyay', href: personalInfo.linkedin },
  { icon: Github, label: 'GitHub', value: 'manan-upadhyay', href: personalInfo.github },
  { icon: MapPin, label: 'Based in', value: `${personalInfo.location} · 23.02°N 72.57°E`, href: null },
];

/* Slowly-rotating compass rose — replaces the old 3D globe (no WebGL) */
const CompassRose = () => (
  <div className="relative grid place-items-center" style={{ width: 132, height: 132 }} aria-hidden="true">
    <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(var(--color-ember-rgb),0.14), transparent 70%)' }} />
    <motion.svg width="132" height="132" viewBox="0 0 120 120"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
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

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [inquiry, setInquiry] = useState(INQUIRIES[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return setError('Please fill in every field.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('That email looks off — mind checking it?');

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
        (err) => { setLoading(false); console.error(err); setError('Something went wrong. Please try again.'); }
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
          Open to senior full-stack roles & collaborations — usually replies within a day.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mt-10">
        {/* ---- Message ---- */}
        <ScrollReveal direction="up" className="realm-card p-7 sm:p-9">
          <span className="chapter-eyebrow">The Message</span>

          {/* inquiry chips */}
          <div className="flex flex-wrap gap-2 mt-5 mb-7">
            {INQUIRIES.map((q) => {
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

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                className={inputCls} style={inputStyle} aria-label="Your name" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email"
                className={inputCls} style={inputStyle} aria-label="Your email" />
            </div>
            <textarea name="message" rows={5} value={form.message} onChange={handleChange}
              placeholder="Tell me about the realm you want to build…"
              className={`${inputCls} resize-none`} style={inputStyle} aria-label="Your message" />

            {error && <p className="text-[13px]" style={{ color: '#EF4444' }}>{error}</p>}
            {success && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="text-[14px] flex items-center gap-2" style={{ color: '#22C55E' }}>
                ✓ Your raven has taken flight — I'll reply as soon as it lands.
              </motion.p>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
              className="btn-primary mt-2 inline-flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (<><Loader2 size={18} className="animate-spin" /> Sending the raven…</>) : (<>Dispatch the Raven <Send size={16} /></>)}
            </motion.button>
          </form>
        </ScrollReveal>

        {/* ---- Correspondence ---- */}
        <ScrollReveal direction="up" delay={0.1} className="realm-card p-7 sm:p-9 flex flex-col">
          <div className="flex items-start justify-between">
            <span className="chapter-eyebrow">Correspondence</span>
            <CompassRose />
          </div>

          <div className="mt-2 flex flex-col divide-y" style={{ borderColor: 'var(--color-card-border)' }}>
            {CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const Row = (
                <div className="flex items-center gap-4 py-4 group">
                  <span className="grid place-items-center w-10 h-10 rounded-xl flex-shrink-0"
                    style={{ background: 'rgba(var(--color-ember-rgb),0.1)', border: '1px solid rgba(var(--color-ember-rgb),0.25)' }}>
                    <Icon size={17} style={{ color: 'var(--color-ember)' }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    <span className="block text-[14px] truncate" style={{ color: 'var(--color-text)' }}>{value}</span>
                  </span>
                  {href && <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-ember)' }} />}
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor="hover">{Row}</a>
              ) : (
                <div key={label}>{Row}</div>
              );
            })}
          </div>

          <p className="font-chronicle italic text-[17px] mt-auto pt-6" style={{ color: 'var(--color-ember)' }}>
            “Every great quest begins with a single message.”
          </p>
        </ScrollReveal>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, 'contact');
