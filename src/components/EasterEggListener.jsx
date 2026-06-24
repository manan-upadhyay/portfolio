import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useVoiceStore } from '../store/useVoiceStore';
import { voices, SEALED_VOICES } from '../i18n/voices';

const SEALED = voices.filter((v) => v.locked && v.trigger);
const MAX_BUFFER = 12; // longest trigger + slack
const IDLE_RESET = 1500; // clear the buffer after a pause

const typingInField = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

/**
 * The easter-egg unlock system. Listens for the secret trigger WORDS typed
 * anywhere on the page (not in form fields). Typing a sealed voice's trigger
 * (e.g. "boss", "beets", "moo") unlocks that personality, switches to it for an
 * instant payoff, and shows a toast that hints toward the next sealed voice.
 *
 * Discovery isn't a blind guess: the locked rows in the Voice menu show each
 * voice's cryptic `hint`, so "Sealed Voices · 0/3" is a solvable game.
 */
const EasterEggListener = () => {
  const { unlockVoice, setVoice, isUnlocked } = useVoiceStore();
  const bufferRef = useRef('');
  const idleRef = useRef(null);
  const [toast, setToast] = useState(null); // { label, nextHint }

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (typingInField(e.target)) return;
      if (e.key.length !== 1 || !/[a-zA-Z]/.test(e.key)) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-MAX_BUFFER);

      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => { bufferRef.current = ''; }, IDLE_RESET);

      const hit = SEALED.find((v) => bufferRef.current.endsWith(v.trigger));
      if (!hit || isUnlocked(hit.id)) return;

      bufferRef.current = '';
      unlockVoice(hit.id);
      setVoice(hit.id); // instant payoff — switch to the just-unlocked voice

      // Hint toward the next voice that's still sealed (post-unlock).
      const next = SEALED.find((v) => v.id !== hit.id && !isUnlocked(v.id));
      setToast({ label: hit.label, nextHint: next ? next.hint : null });
    };

    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(idleRef.current); };
  }, [unlockVoice, setVoice, isUnlocked]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6500);
    return () => clearTimeout(t);
  }, [toast]);

  const discovered = SEALED_VOICES.filter((id) => isUnlocked(id)).length;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,380px)] rounded-2xl p-4 flex items-start gap-3"
          style={{
            background: 'color-mix(in srgb, var(--color-card-bg) 96%, transparent)',
            border: '1px solid var(--color-card-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span
            className="grid place-items-center w-9 h-9 rounded-full flex-shrink-0"
            style={{ background: 'rgba(var(--color-ember-rgb),0.16)', color: 'var(--color-ember)' }}
          >
            <Sparkles size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
              Sealed voice unlocked — {toast.label}
            </p>
            <p className="text-[12px] mt-1 leading-snug" style={{ color: 'var(--color-text-muted)' }}>
              {toast.nextHint ? (
                <span className="inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="flex-shrink-0" style={{ color: 'var(--color-ember)' }} />
                  Next clue: {toast.nextHint}
                </span>
              ) : (
                <>All {SEALED.length} voices discovered. Masterfully done.</>
              )}
              <span className="block mt-1 font-mono text-[10px] tracking-wider uppercase opacity-70">
                {discovered}/{SEALED.length} discovered
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EasterEggListener;
