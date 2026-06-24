// i18next initialization for the Voice switcher.
//
// Design:
//  - Each "voice" is an i18next language; `chronicle` is the complete base and
//    the fallback, so other voices only override the keys they change.
//  - Core voices (chronicle + plain) are bundled eagerly — they're part of the
//    primary experience and tiny.
//  - Easter-egg personalities (scott / dwight / cow) are CODE-SPLIT: their
//    bundles are dynamically imported only when a visitor unlocks them
//    (`loadVoice`), keeping them out of the initial JS (perf budget).
//  - One namespace (`translation`) with section-grouped nested keys — same
//    organization as "namespace per section" with less ceremony, and the
//    lazy-load unit is the voice anyway.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import chronicle from './bundles/chronicle';
import plain from './bundles/plain';
import { DEFAULT_VOICE, OPEN_VOICES } from './voices';

// Restore the persisted voice (set by the Voice store) before init so there's no
// flash of the default. Locked voices are only honored if previously unlocked.
const readInitialVoice = () => {
  try {
    const raw = localStorage.getItem('voice-storage');
    if (!raw) return DEFAULT_VOICE;
    const { state } = JSON.parse(raw);
    const v = state?.voice;
    if (!v) return DEFAULT_VOICE;
    if (OPEN_VOICES.includes(v)) return v;
    // A sealed voice is only valid if it was unlocked.
    if (Array.isArray(state?.unlocked) && state.unlocked.includes(v)) return v;
    return DEFAULT_VOICE;
  } catch {
    return DEFAULT_VOICE;
  }
};

// The saved voice may be a sealed personality (only valid if unlocked). Its
// bundle is code-split, so we can't load it synchronously — boot at an
// always-available voice, then async-load + switch to the sealed one below.
const initialVoice = readInitialVoice();
const bootVoice = OPEN_VOICES.includes(initialVoice) ? initialVoice : DEFAULT_VOICE;

i18n.use(initReactI18next).init({
  lng: bootVoice,
  fallbackLng: DEFAULT_VOICE,
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    chronicle: { translation: chronicle },
    plain: { translation: plain },
  },
  returnObjects: true, // arrays of copy (intro paragraphs, error variants)
  interpolation: { escapeValue: false }, // React already escapes
  react: { useSuspense: false },
});

// Lazy-load + register an easter-egg personality bundle, then switch to it.
// Bundles resolve to chronicle for any key they don't override.
const loaded = new Set(['chronicle', 'plain']);
export async function loadVoice(id) {
  if (loaded.has(id)) return true;
  try {
    const mod = await import(`./bundles/${id}.js`);
    i18n.addResourceBundle(id, 'translation', mod.default, true, true);
    loaded.add(id);
    return true;
  } catch {
    return false; // bundle not authored yet — caller can ignore
  }
}

// Bootstrap a persisted sealed (unlocked) voice: load its code-split bundle and
// switch so refreshed content matches the saved choice (not the chronicle
// fallback). Fixes the "menu shows X but content reverts to chronicle" gap.
if (initialVoice !== bootVoice) {
  loadVoice(initialVoice).then((ok) => { if (ok) i18n.changeLanguage(initialVoice); });
}

export default i18n;
