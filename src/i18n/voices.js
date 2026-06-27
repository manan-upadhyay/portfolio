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
// ── Compact-popover config (the bottom-right VoiceSwitcher) ──────────────────
// The popover is the *teaser* surface — it stays deliberately short so its job
// reads at a glance ("switch who narrates the site"), and defers the full roster
// to the Voice Hall. Two optional, code-set fields tune what it shows:
//
//   • `popover: false`   → withhold this voice from the popover entirely
//                          (Hall-only). Default (undefined/true) = shown.
//   • `popoverOrder: n`  → ordering within the popover (ascending; registry
//                          order breaks ties). Lets you curate the shortlist's
//                          sequence without reordering the registry itself.
//
// Sealed rows in the popover are additionally capped at `POPOVER_SEALED_LIMIT`
// (see below) so the menu never sprawls; the discovery COUNT still reflects the
// full sealed roster, and any overflow routes to the Hall.
//
// `pinned: true` is the dormant "marked voice" feature (a curated favourite that
// used to ride a third "Marked Voices" group in the popover). That group is
// currently hidden to keep the menu uncluttered — the flag and `PINNED_VOICES`
// export are kept for a future revival but no longer change the popover.

export const DEFAULT_VOICE = 'chronicle';

// Max sealed voices PREVIEWED in the compact popover before the rest defer to the
// Voice Hall. Caps rendered rows only — the discovery count (n/total) and the
// overflow ("+N more") signal always reflect the full sealed roster.
export const POPOVER_SEALED_LIMIT = 3;

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
    popoverOrder: 0,
  },
  {
    id: 'plain',
    label: 'Plainspoken',
    sample: 'A straight, professional portfolio.',
    locked: false,
    category: 'core',
    glyph: 'Pl',
    popoverOrder: 1,
  },
  {
    id: 'scott',
    label: 'World’s Best Boss',
    sample: 'That’s what she said.',
    locked: true,
    pinned: true, // dormant "marked voice" flag — popover surfacing is hidden for now
    category: 'office',
    glyph: 'Ms',
    popoverOrder: 2,
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
    popoverOrder: 3,
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
    popoverOrder: 4,
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

// Voices surfaced in the compact bottom-right popover (the teaser surface),
// ordered by `popoverOrder` (ascending; registry order breaks ties). Opt a voice
// out with `popover: false`. The caller splits these into open vs. sealed and
// caps the sealed preview at POPOVER_SEALED_LIMIT.
export const popoverVoices = () =>
  voices
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v.popover !== false)
    .sort((a, b) => (a.v.popoverOrder ?? 0) - (b.v.popoverOrder ?? 0) || a.i - b.i)
    .map(({ v }) => v);

// Voices grouped into their categories (in `CATEGORIES` order), skipping any
// empty category. Used by the Voice Hall overlay.
export const voicesByCategory = () =>
  CATEGORIES.map((c) => ({ ...c, items: voices.filter((v) => v.category === c.id) }))
    .filter((c) => c.items.length);
