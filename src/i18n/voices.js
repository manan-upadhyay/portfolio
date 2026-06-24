// The Voice registry — single source of truth for the Voice switcher (Phase 1)
// and the easter-egg personalities (Phase 1b).
//
// Each voice is an i18next "language". `chronicle` is the base/fallback bundle
// (complete coverage); every other voice only needs to override the keys whose
// wording actually changes — anything missing falls back to chronicle.
//
// `locked: true` marks an easter-egg personality: it renders as a sealed teaser
// in the menu and its bundle is lazy-loaded only once unlocked (see ./index.js).

export const DEFAULT_VOICE = 'chronicle';

export const voices = [
  {
    id: 'chronicle',
    label: 'Chronicle',
    sample: 'The cinematic, in-world voice.',
    locked: false,
  },
  {
    id: 'plain',
    label: 'Plainspoken',
    sample: 'A straight, professional portfolio.',
    locked: false,
  },
  {
    id: 'scott',
    label: 'World’s Best Boss',
    sample: 'That’s what she said.',
    locked: true,
  },
  {
    id: 'dwight',
    label: 'Assistant (to the) Manager',
    sample: 'Fact. Bears. Beets.',
    locked: true,
  },
  {
    id: 'cow',
    label: 'Moo',
    sample: 'Moo moo, moo moo moo.',
    locked: true,
  },
];

// Voices always available without unlocking.
export const OPEN_VOICES = voices.filter((v) => !v.locked).map((v) => v.id);

// Voices behind the easter-egg gate.
export const SEALED_VOICES = voices.filter((v) => v.locked).map((v) => v.id);

export const voiceById = (id) => voices.find((v) => v.id === id) || null;
