// CHRONICLE — the base voice (the cinematic, in-world register).
//
// This bundle is COMPLETE: it holds every voice-bearing string in the site and
// is the i18next `fallbackLng`. Other voices (plain, and the easter-egg
// personalities) override only the keys whose wording changes — missing keys
// resolve here automatically.
//
// Grouped by section. Non-copy data (links, icons, map coords, project facts,
// skill names, stat values) intentionally stays in `src/constants` — only
// display copy lives here. `{{var}}` are i18next interpolations.

export default {
  common: {
    // Rendered as "Chapter 01" in section eyebrows.
    chapterLabel: 'Chapter',
  },

  nav: {
    toTop: 'To top',
    map: 'Map',
    openMap: 'Open the map',
  },

  // Chapter label (nav/eyebrow) + sub (the large serif section title). Keyed by
  // section id; `no`/`x`/`y`/`kw` stay in constants.
  chapters: {
    origin: { label: 'Origin', sub: 'Origin' },
    about: { label: 'The Craft', sub: 'Origin' },
    work: { label: 'The Journey', sub: 'The Path So Far' },
    arsenal: { label: 'The Arsenal', sub: 'Tools of the Trade' },
    projects: { label: 'The Realms', sub: "Worlds I've Shipped" },
    contact: { label: 'Summon', sub: 'Send a Raven' },
  },

  hero: {
    lead: 'I architect',
    phrases: ['production systems', 'scalable platforms', 'resilient APIs', 'reusable UI systems'],
    hook: 'Five years charting production systems where performance, trust, and craft decide the path.',
    ctaPrimary: 'Begin the Chronicle',
    ctaSecondary: 'Summon me →',
    scroll: 'Scroll',
  },

  about: {
    pullQuote: '“Every realm below began as an empty repository and a blinking cursor.”',
    intro: [
      'I build production web platforms the way a storyteller builds worlds — structure beneath the surface, and an obsessive eye on the details a user feels but never sees.',
      'Five years and twenty-plus releases across six industries. I carry features from an empty repository all the way to production monitoring, and I do my sharpest work where the problem is tangled and the path isn’t obvious.',
    ],
    scribeNote: "The Scribe's Note",
    principles: [
      { title: 'End-to-end ownership', body: 'From requirement grooming and system design to release validation and production monitoring.' },
      { title: 'Detail as discipline', body: 'Reusable UI systems, edge cases, and accessibility — the unglamorous craft that makes products feel solid.' },
      { title: 'Performance as a habit', body: 'Code-splitting, caching, CDN, and media optimization — measured, not guessed.' },
      { title: 'Secure by default', body: 'JWT/OAuth, Okta, RBAC and middleware access control across enterprise apps.' },
    ],
    disciplines: 'Disciplines',
  },

  experience: {
    intro:
      'Every expedition leaves a trail. Keep scrolling to travel mine — from the first commit to the present campaign.',
    travelTrail: 'Travel the trail',
    present: 'Present',
    // Flavor copy per waypoint, keyed by the journey item `id` in constants.
    journey: {
      'first-trail': { chapter: 'The First Trail', headline: 'Where the road began.' },
      oath: { chapter: 'The Oath', headline: 'Forged the foundations · CGPA 8.36 / 10.' },
      expedition: { chapter: 'The Long Expedition', headline: 'Six industries. Production-grade. End to end.' },
      horizon: { chapter: 'The Horizon Ahead', headline: 'Seeking teams who value craft & ownership.' },
    },
    summonCta: 'Summon me',
  },

  arsenal: {
    subtitle: 'The kit I carry into every campaign — hover a star to trace its constellation.',
    coreLabel: 'The Arsenal',
  },

  works: {
    intro:
      "Each realm is a production world charted end to end — across finance, healthcare, logistics, media and visualization. Some lie under NDA; what's shared is what's permissible.",
    realm: 'Realm',
    featured: 'Featured',
    nda: 'NDA',
    enterRealm: 'Enter the realm',
    source: 'Source',
    ndaSealed: "Sealed under NDA — details limited to what's permissible.",
    chartMore: 'Chart {{count}} more realms',
    furl: 'Furl the map',
  },

  contact: {
    availability:
      'Open to senior full-stack roles & collaborations — usually replies within a day.',
    theMessage: 'The Message',
    correspondence: 'Correspondence',
    inquiries: ['Senior role', 'Contract', 'Collaboration', 'Just saying hi'],
    placeholders: {
      name: 'Your name',
      email: 'Your email',
      message: 'Tell me about the realm you want to build…',
    },
    messagePlaceholders: {
      'Senior role': 'Tell me about the team, the role, and the realms you’re building…',
      Contract: 'Share the scope, timeline, and what you need shipped…',
      Collaboration: 'What should we build together? Pitch me the idea…',
      'Just saying hi': 'Say hello — what brought you to this corner of the map?',
    },
    submitIdle: 'Dispatch the Raven',
    submitLoading: 'Sending the raven…',
    resumeCta: 'Download CV',
    success: 'Your raven has taken flight — I’ll reply as soon as it lands.',
    errors: {
      required: [
        'The raven refuses to fly with an empty scroll — fill in every field.',
        'No words, no flight. This raven has standards; fill it all in.',
        'A blank parchment? The raven just blinked at me. Every field, please.',
        'Even the swiftest raven needs something to carry. Mind the blanks.',
      ],
      email: [
        'That email reads like Elvish — and not the legible kind. Mind checking it?',
        'The raven scoured every map and found no such address. Recheck the email?',
        'Hmm, that email looks a touch cursed. Give it another glance.',
        'No realm answers to that address. Double-check the email?',
      ],
      failed: [
        'The raven hit a storm mid-flight and limped back. Try again?',
        'A mischievous goblin snatched the raven. Send another?',
        'The raven vanished into the mist. One more attempt?',
        'Something spooked the poor bird. Give it another go.',
      ],
      notConfigured: [
        'The rookery isn’t built yet — no ravens to dispatch. Reach me directly at {{email}}.',
        'These ravens are still in training. For now, send word to {{email}}.',
        'This aviary is under construction. Best write to me at {{email}}.',
      ],
    },
    quote: '“Every great quest begins with a single message.”',
    channels: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      location: 'Based in',
    },
  },

  map: {
    searchPlaceholder: 'Search the map…  try “skills”, “projects”, “contact”',
    noResult: 'No chapter found — try “skills”, “experience”, or “contact”.',
    footerHint: 'travel · esc to close',
    actions: {
      resume: 'Read the Scroll (Resume)',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      themeLight: 'Light the dawn',
      themeDark: 'Fall to night',
    },
  },

  footer: {
    quote: '“The journey is the reward.”',
    credit: '© {{year}} Manan Upadhyay · Crafted with React, GSAP & far too much chai.',
  },

  voice: {
    menuTitle: 'Voice',
    sealed: 'Sealed Voices',
    sealedHint: 'Hidden voices await discovery.',
    locked: 'Locked',
    ariaOpen: 'Choose a voice',
  },
};
