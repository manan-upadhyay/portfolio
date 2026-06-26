// The Voice registry — single source of truth for the Voice switcher (Phase 1)
// and the easter-egg personalities (Phase 1b).
//
// Each voice is an i18next "language". `chronicle` is the base/fallback bundle
// (complete coverage); every other voice only needs to override the keys whose
// wording actually changes — anything missing falls back to chronicle.
//
// `locked: true` marks an easter-egg personality: it renders as a sealed teaser
// in the menu and its bundle is lazy-loaded only once unlocked (see ./index.js).
// Sealed voices carry a `trigger` (the secret word the visitor types to unlock —
// see EasterEggListener) and a `hint` (the cryptic clue shown on the locked row,
// so discovery is a solvable game, not a guess).
//
// `pinned: true` PROMOTES a voice (open or sealed) into the compact bottom-right
// VoiceSwitcher popover so it sits alongside the open voices — a curated, code-
// configured "favourites" shortlist. A pinned-but-still-sealed voice shows its
// clue + ⓘ reference there (and is excluded from the popover's "Sealed Voices"
// group to avoid listing it twice). Set/unset it here in code; nothing else needs
// to change.

export const DEFAULT_VOICE = 'chronicle';

// Voice categories — group voices in the Voice Hall overlay + the recap
// constellation so the feature scales to many personalities. `order` sets the
// section order; the visible label is i18n (`voiceHall.categories.<id>`).
export const CATEGORIES = [
  { id: 'core', order: 0 },
  { id: 'office', order: 1 },
  { id: 'bestiary', order: 2 },
];

// `glyph` is a short serif MONOGRAM (no emoji per the design system) used as the
// voice's mark in the Hall + constellation. `category` slots it into a section.
export const voices = [
  {
    id: 'chronicle',
    label: 'Chronicle',
    sample: 'The cinematic, in-world voice.',
    locked: false,
    category: 'core',
    glyph: 'Ch',
  },
  {
    id: 'plain',
    label: 'Plainspoken',
    sample: 'A straight, professional portfolio.',
    locked: false,
    category: 'core',
    glyph: 'Pl',
  },
  {
    id: 'scott',
    label: 'World’s Best Boss',
    sample: 'That’s what she said.',
    locked: true,
    pinned: true, // curated favourite — surfaced in the compact VoiceSwitcher popover
    category: 'office',
    glyph: 'Ms',
    trigger: 'boss',
    hint: 'Type what’s printed on the world’s best mug.',
    info: {
      name: 'Michael Scott',
      source: 'The Office (US)',
      note: 'Regional Manager of Dunder Mifflin, Scranton. Self-proclaimed World’s Best Boss.',
    },
  },
  {
    id: 'dwight',
    label: 'Assistant (to the) Manager',
    sample: 'Fact. Bears. Beets.',
    locked: true,
    category: 'office',
    glyph: 'Dw',
    trigger: 'beets',
    hint: 'Type what grows in rows at Schrute Farms.',
    info: {
      name: 'Dwight Schrute',
      source: 'The Office (US)',
      note: 'Assistant (to the) Regional Manager. Beet farmer, black belt, owner of Schrute Farms.',
    },
  },
  {
    id: 'cow',
    label: 'Moo',
    sample: 'Moo moo, moo moo moo.',
    locked: true,
    category: 'bestiary',
    glyph: 'Mo',
    trigger: 'moo',
    hint: 'Type what the cow says.',
    info: {
      name: 'A cow',
      source: 'Planet Earth',
      note: 'Says moo. That’s the whole bit. Surprisingly relaxing.',
    },
  },
];

// Voices always available without unlocking.
export const OPEN_VOICES = voices.filter((v) => !v.locked).map((v) => v.id);

// Voices behind the easter-egg gate.
export const SEALED_VOICES = voices.filter((v) => v.locked).map((v) => v.id);

// Curated "favourites" surfaced in the compact VoiceSwitcher popover (code-set).
export const PINNED_VOICES = voices.filter((v) => v.pinned).map((v) => v.id);

export const voiceById = (id) => voices.find((v) => v.id === id) || null;

// Voices grouped into their categories (in `CATEGORIES` order), skipping any
// empty category. Used by the Voice Hall overlay.
export const voicesByCategory = () =>
  CATEGORIES.map((c) => ({ ...c, items: voices.filter((v) => v.category === c.id) }))
    .filter((c) => c.items.length);
