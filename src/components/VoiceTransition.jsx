import { useEffect } from 'react';
import { onVoiceChange } from '../lib/voiceChange';
import { runVoiceScramble } from '../lib/voiceScramble';
import { playCue } from '../lib/sound';

/**
 * Voice transition — fires on every voice switch (switcher + easter eggs). The
 * copy swaps synchronously when i18next changes language; this *decodes* the new
 * wording in: every visible text element scrambles through random glyphs and
 * resolves to the new voice (content-level, per-text — no full-screen overlay),
 * paired with the soft `glitch` decode sound. Renders nothing; mounted once in
 * `App`. Scramble is skipped under reduced-motion (the sound self-guards too).
 */
const VoiceTransition = () => {
  useEffect(() => {
    const off = onVoiceChange(() => {
      playCue('glitch');
      runVoiceScramble();
    });
    return off;
  }, []);
  return null;
};

export default VoiceTransition;
