import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceStore } from '../store/useVoiceStore';
import { playCue } from '../lib/sound';
import { track } from '../lib/analytics';

// Normalise an answer to bare lowercase letters so "Moo!", "a cow says moo",
// and "MOO" all satisfy the trigger. Triggers are already bare lowercase words.
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

/**
 * Inline "answer the clue" unlock — the touch-friendly path to open a sealed
 * voice. Rendered beneath a locked voice's clue, it offers a small text field:
 * typing the clue's answer (the voice's secret trigger word) unlocks it and
 * switches to it for the instant payoff.
 *
 * This is the ONLY unlock path on phones/tablets — the global type-anywhere
 * `EasterEggListener` needs a hardware keyboard and deliberately ignores form
 * fields, so ~95% of visitors could never reach these voices. On desktop it's a
 * second, discoverable path alongside the hidden type-anywhere trick. Reused by
 * the Voice Hall chips and the compact popover rows.
 */
const ClueUnlock = ({ voice, onUnlocked, autoFocus = true }) => {
  const { t } = useTranslation();
  const { unlockVoice, setVoice } = useVoiceStore();
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef(null);

  // Best-effort focus (desktop). On iOS a programmatic focus outside the tap
  // gesture won't raise the keyboard — the field is fully visible, so the
  // visitor taps it directly there.
  useEffect(() => {
    if (!autoFocus) return undefined;
    const f = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(f);
  }, [autoFocus]);

  const submit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!norm(answer).includes(voice.trigger)) {
      playCue('error');
      setWrong(true);
      track('voice_clue_miss', { voice: voice.id });
      inputRef.current?.focus();
      return;
    }
    track('voice_clue_solved', { voice: voice.id }); // discovered via the on-screen clue
    unlockVoice(voice.id); // record the discovery…
    setVoice(voice.id);    // …then the instant payoff: switch + decode sound
    onUnlocked?.(voice.id);
  };

  return (
    <motion.form
      onSubmit={submit}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="clue-unlock"
    >
      <div className="clue-unlock__row" data-wrong={wrong || undefined}>
        <input
          ref={inputRef}
          value={answer}
          onChange={(e) => { setAnswer(e.target.value); setWrong(false); }}
          placeholder={t('voice.cluePlaceholder')}
          aria-label={t('voice.clueAria', { hint: voice.hint })}
          data-cursor="hover"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={28}
          className="clue-unlock__input"
        />
        <button type="submit" className="clue-unlock__go" data-cursor="hover" aria-label={t('voice.clueSubmit')}>
          <CornerDownLeft size={13} />
        </button>
      </div>
      {wrong && <span className="clue-unlock__wrong" role="status">{t('voice.clueWrong')}</span>}
    </motion.form>
  );
};

export default ClueUnlock;
