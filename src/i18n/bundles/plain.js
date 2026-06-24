// PLAINSPOKEN — a straight, professional portfolio voice.
//
// This is an OVERRIDE bundle: it only contains the keys whose wording changes
// from `chronicle`. Anything omitted (e.g. factual labels, the inquiry chips)
// falls back to the chronicle bundle automatically via i18next `fallbackLng`.
//
// Purpose: de-risk the cinematic concept for hurried/skeptical visitors —
// "Dispatch the Raven" → "Send message", "The Realms" → "Projects".

export default {
  common: {
    chapterLabel: 'Section',
  },

  chapters: {
    origin: { label: 'Home', sub: 'Home' },
    about: { label: 'About', sub: 'About Me' },
    work: { label: 'Experience', sub: 'Experience' },
    arsenal: { label: 'Skills', sub: 'Tech Stack' },
    projects: { label: 'Projects', sub: 'Selected Work' },
    contact: { label: 'Contact', sub: 'Get in Touch' },
  },

  hero: {
    lead: 'I build',
    phrases: ['production systems', 'scalable platforms', 'resilient APIs', 'reusable UI systems'],
    hook: 'Five years building production web platforms where performance, reliability, and craft drive results.',
    ctaPrimary: 'View my work',
    ctaSecondary: 'Contact me →',
  },

  about: {
    pullQuote: '“Every project below began as an empty repository and a blinking cursor.”',
    intro: [
      'I build production web platforms with a focus on solid architecture and the details users feel but never see.',
      'Five years and twenty-plus releases across six industries. I own features end to end — [[endToEnd|from an empty repository to production monitoring]] — and do my best work on hard, ambiguous problems.',
    ],
    scribeNote: 'How I Work',
    disciplines: 'What I Do',
    // Principle bodies stay factual; titles are already plain so they fall back.
    principles: [
      { title: 'End-to-end ownership', body: 'From requirements and system design to release validation and production monitoring.' },
      { title: 'Detail as discipline', body: 'Reusable UI systems, edge cases, and accessibility — the work that makes products feel solid.' },
      { title: 'Performance as a habit', body: 'Code-splitting, caching, CDN, and media optimization — [[measured|measured, not guessed]].' },
      { title: 'Secure by default', body: 'JWT/OAuth, Okta, RBAC and middleware access control across enterprise apps.' },
    ],
  },

  experience: {
    intro: "A timeline of where I've worked and what I shipped — from my first role to today.",
    travelTrail: 'Scroll the timeline',
    journey: {
      'first-trail': { chapter: 'First Role', headline: 'Where I started.' },
      oath: { chapter: 'Education', headline: 'B.E. Information Technology · CGPA 8.36 / 10.' },
      expedition: { chapter: 'Current Role', headline: 'Six industries. Production-grade. End to end.' },
      horizon: { chapter: "What's Next", headline: 'Open to teams who value craft and ownership.' },
    },
    summonCta: 'Contact me',
  },

  arsenal: {
    subtitle: 'The tools I use across the stack — hover a skill to see how it connects.',
    coreLabel: 'Skills',
  },

  works: {
    intro:
      "Selected production projects across finance, healthcare, logistics, media and visualization. Some are under NDA; shared details are limited to what's permissible.",
    realm: 'Project',
    enterRealm: 'View project',
    ndaSealed: "[[nda|Under NDA]] — details limited to what's permissible.",
    chartMore: 'Show {{count}} more projects',
    furl: 'Show less',
  },

  contact: {
    availability: 'Open to senior full-stack roles and collaborations — usually replies within a day.',
    theMessage: 'Message',
    correspondence: 'Contact',
    placeholders: {
      message: 'Tell me about the project you want to build…',
    },
    messagePlaceholders: {
      'Senior role': 'Tell me about the team, the role, and what you’re building…',
      Contract: 'Share the scope, timeline, and what you need shipped…',
      Collaboration: 'What should we build together? Pitch me the idea…',
      'Just saying hi': 'Say hello — what brought you here?',
    },
    submitIdle: 'Send [[raven|message]]',
    submitLoading: 'Sending…',
    success: "Thanks — your message is on its way. I'll reply soon.",
    errors: {
      required: ['Please fill in every field before sending.'],
      email: ['That email address looks off — mind double-checking it?'],
      failed: ['Something went wrong sending your message. Please try again.'],
      notConfigured: ['The contact form isn’t live yet. Reach me directly at {{email}}.'],
    },
    quote: '“Every great project begins with a single message.”',
    channels: {
      location: 'Location',
    },
  },

  map: {
    searchPlaceholder: 'Search…  try “skills”, “projects”, “contact”',
    noResult: 'No section found — try “skills”, “experience”, or “contact”.',
    footerHint: 'enter to go · esc to close',
    actions: {
      resume: 'Resume',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
    },
  },

  footer: {
    quote: '“The journey is the reward.”',
  },
};
