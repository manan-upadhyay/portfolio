// Tiny pub/sub so a voice change (from the switcher OR an easter-egg unlock —
// both go through `useVoiceStore.setVoice`) can fan out to `VoiceTransition`
// (the scramble + sound) without coupling the store to React. The boot-time
// restore of a persisted voice bypasses the store (it calls `i18n.changeLanguage`
// directly), so it never fires this — no scramble flashes on load.

const subs = new Set();

/** Subscribe to voice-change pulses. Returns an unsubscribe fn. */
export const onVoiceChange = (fn) => {
  subs.add(fn);
  return () => subs.delete(fn);
};

/** Fire a pulse (called from the voice store after a successful switch). */
export const fireVoiceChange = () => subs.forEach((fn) => fn());
