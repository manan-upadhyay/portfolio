import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github, MapPin, ArrowUpRight, Send, Loader2, Check, Download, Copy, Feather } from 'lucide-react';
import { SectionWrapper } from '../hoc';
import { personalInfo, summon, chapters } from '../constants';
import { ChapterHeading, ScrollReveal, ExpeditionRecap, RavenBurst, RavenNotice } from '../components';
import { playCue } from '../lib/sound';
import { sendRaven, EMAIL_RE } from '../lib/raven';
import { track, trackOnce } from '../lib/analytics';

// Presentational icon map — data (label/value/href) lives in constants.
const CHANNEL_ICONS = { email: Mail, linkedin: Linkedin, github: Github, location: MapPin };

// Pick a random variant, avoiding an immediate repeat of `not` for surprise.
const pick = (arr, not) => {
  const pool = arr.length > 1 && not ? arr.filter((m) => m !== not) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
};

/* Idle / sending state for the status console — a subtle pulsing pip + a line of
   serif copy. Shares the console slot with RavenNotice so states crossfade in
   place with no layout shift. */
const ConsoleLine = ({ kind, children }) => (
  <motion.div
    className={`raven-console__line raven-console__line--${kind}`}
    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <span className="raven-console__pip" aria-hidden="true" />
    {kind === 'sending'
      ? <Loader2 size={13} className="animate-spin" style={{ color: 'var(--color-ember)' }} />
      : <Feather size={13} style={{ color: 'var(--color-ember)' }} />}
    <span className="raven-console__text">{children}</span>
  </motion.div>
);

/* Copy-to-clipboard button (email row) — flips to a check for ~2s on success */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track('email_copied'); // a quiet but strong contact-intent signal
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

/* Slowly-rotating contact compass — the section's own larger instrument */
const ContactCompass = () => {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid place-items-center flex-shrink-0 overflow-hidden" style={{ width: 132, height: 132 }} aria-hidden="true">
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
  const { t } = useTranslation();
  const inquiries = t('contact.inquiries', { returnObjects: true });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [inquiry, setInquiry] = useState(inquiries[0]);
  const honeypotRef = useRef(null); // bot trap — humans never fill this
  const submitRef = useRef(null);   // raven burst erupts from the button
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Set a random on-theme error variant; interpolate {{email}} for the
  // not-configured case (i18next skips interpolation inside returnObjects arrays).
  // No sound here — the cue is owned by the caller (lib/raven for network
  // failures, `failValidation` for client-side checks).
  const failMsg = (key) => {
    const variants = t(`contact.errors.${key}`, { returnObjects: true });
    let msg = pick(variants, error);
    if (key === 'notConfigured') msg = msg.replace(/\{\{email\}\}/g, personalInfo.email);
    setError(msg);
  };
  // Client-side validation failure — message + the "raven refused" cue.
  const failValidation = (key) => { failMsg(key); playCue('error'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!form.name || !form.email || !form.message) return failValidation('required');
    if (!EMAIL_RE.test(form.email)) return failValidation('email');

    setError('');
    setLoading(true);
    track('contact_submit', { inquiry }); // the conversion attempt
    // Shared dispatch: posts, parses, and plays the flight/refused cue for us.
    const result = await sendRaven({
      name: form.name,
      email: form.email,
      message: form.message,
      inquiry,
      company: honeypotRef.current?.value || '',
    });
    if (result.ok) {
      setSuccess(true);
      track('contact_success', { inquiry }); // the conversion — the headline metric
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    } else {
      track('contact_error', { code: result.code });
      failMsg(result.code); // sendRaven already played the 'error' cue
    }
    setLoading(false); // always clears — the loader can never hang
  };

  const inputCls = 'form-field w-full py-3.5 px-4 rounded-xl outline-none border transition-colors duration-300';
  const inputStyle = { background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)', color: 'var(--color-text)' };

  return (
    <>
      <ChapterHeading no={chapters.contact.no} eyebrow={t('chapters.contact.label')} title={`${t('chapters.contact.sub')}.`} />
      <div className="mt-5 flex items-center gap-2">
        <span className="status-dot" />
        <p className="text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {t('contact.availability')}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mt-10">
        {/* ---- Message ---- */}
        <ScrollReveal direction="up" className="realm-card p-7 sm:p-9 min-w-0 flex flex-col">
          <span className="chapter-eyebrow">{t('contact.theMessage')}</span>

          {/* inquiry chips */}
          <div className="flex flex-wrap gap-2 mt-5 mb-7">
            {inquiries.map((q) => {
              const active = q === inquiry;
              return (
                <motion.button key={q} type="button" onClick={() => { if (q !== inquiry) track('inquiry_selected', { inquiry: q }); setInquiry(q); }} data-cursor="hover"
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

          {/* noValidate: we run our own (voice-aware) validation in handleSubmit,
              so suppress the browser's native bubbles — otherwise an invalid
              type="email" value is caught natively and our custom error (and
              every voice's variant of it) never gets a chance to show. */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 flex-1"
            onFocus={() => trackOnce('contact_form_start', 'contact_form_start', { inquiry })}>
            {/* Honeypot — visually hidden, off the tab order; a filled value = bot. */}
            <input
              ref={honeypotRef}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder={t('contact.placeholders.name')}
                className={inputCls} style={inputStyle} aria-label="Your name" aria-required="true" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={t('contact.placeholders.email')}
                className={inputCls} style={inputStyle} aria-label="Your email" aria-required="true" />
            </div>
            <textarea name="message" rows={4} value={form.message} onChange={handleChange}
              placeholder={t('contact.messagePlaceholders', { returnObjects: true })[inquiry] || t('contact.placeholders.message')}
              className={`${inputCls} resize-none flex-1 min-h-[140px]`} style={inputStyle} aria-label="Your message" aria-required="true" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button ref={submitRef} type="submit" disabled={loading} data-cursor="hover"
                className="btn-primary flex-1 disabled:opacity-70">
                {loading ? (<><Loader2 size={18} className="animate-spin" /> {t('contact.submitLoading')}</>) : (<>{t('contact.submitIdle')} <Send size={16} /></>)}
              </button>
              <a href={personalInfo.resumeLink} download={summon.resumeFileName} data-cursor="hover"
                onClick={() => track('resume_open', { from: 'contact' })}
                className="btn-secondary" aria-label={`${t('contact.resumeCta')} (PDF)`}>
                <Download size={16} /> {t('contact.resumeCta')}
              </a>
            </div>

            {/* Status console — a fixed-height slot below the action row. All
                feedback (idle / sending / error / success) crossfades IN PLACE
                here, so the buttons never jump and the card's lower space reads as
                an intentional "transmission" footer rather than dead air. */}
            <div className="raven-console">
              <div className="raven-console__slot">
                <AnimatePresence mode="wait">
                  {error ? (
                    <RavenNotice key={error} type="error">{error}</RavenNotice>
                  ) : success ? (
                    <RavenNotice key="success" type="success">{t('contact.success')}</RavenNotice>
                  ) : loading ? (
                    <ConsoleLine key="sending" kind="sending">{t('contact.status.sending')}</ConsoleLine>
                  ) : (
                    <ConsoleLine key="idle" kind="idle">{t('contact.status.idle')}</ConsoleLine>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
          {/* The raven flock — erupts from the button on success */}
          <RavenBurst active={success} originRef={submitRef} />
        </ScrollReveal>

        {/* ---- Correspondence ---- */}
        <ScrollReveal direction="up" delay={0.1} className="realm-card p-7 sm:p-9 flex flex-col min-w-0">
          <div className="flex items-start justify-between flex-col sm:flex-row">
            <span className="chapter-eyebrow">{t('contact.correspondence')}</span>
            <span className='mt-6 sm:mt-0 self-center sm:self-end'>
            <ContactCompass />
            </span>
          </div>

          <div className="mt-2 flex flex-col divide-y" style={{ borderColor: 'var(--color-card-border)' }}>
            {summon.channels.map(({ key, value, href }) => {
              const Icon = CHANNEL_ICONS[key];
              const label = t(`contact.channels.${key}`);
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
                    <a href={href} data-cursor="hover" className="flex items-center gap-4 flex-1 min-w-0"
                      onClick={() => track('channel_open', { channel: key })}>
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
                <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor="hover"
                  onClick={() => track('channel_open', { channel: key })}>{Row}</a>
              ) : (
                <div key={key}>{Row}</div>
              );
            })}
          </div>

          <p className="font-chronicle italic text-[17px] mt-auto pt-6" style={{ color: 'var(--color-ember)' }}>
            {t('contact.quote')}
          </p>
        </ScrollReveal>
      </div>

      {/* Phase 5 — in-session "expedition recap" send-off */}
      <ExpeditionRecap />
    </>
  );
};

export default SectionWrapper(Contact, 'contact');
