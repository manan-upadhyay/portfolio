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
    // Discipline cards (keyed by the service `iconKey` in constants).
    services: {
      frontend: { title: 'Frontend Architecture', description: 'Production-grade UIs with React.js, Next.js, TypeScript, and reusable component systems.' },
      backend: { title: 'Backend Development', description: 'Scalable APIs with Node.js, Express.js, NestJS, REST, JWT/OAuth, and RBAC.' },
      performance: { title: 'Performance Optimization', description: 'Code-splitting, caching, CDN strategies, lazy loading, and Core Web Vitals tuning.' },
      fullstack: { title: 'Full Stack Delivery', description: 'End-to-end ownership from requirement grooming to production monitoring.' },
    },
    // Stat-band labels (keyed by the stat `key` in constants; values are data).
    stats: {
      years: 'Years Experience',
      projects: 'Projects Delivered',
      domains: 'Industry Domains',
      load: 'Faster Load Times',
    },
  },

  experience: {
    intro:
      'Every expedition leaves a trail. Keep scrolling to travel mine — from the first commit to the present campaign.',
    travelTrail: 'Travel the trail',
    present: 'Present',
    // Per-waypoint copy, keyed by the journey item `id` in constants.
    journey: {
      'first-trail': {
        chapter: 'The First Trail',
        headline: 'Where the road began.',
        role: 'Frontend Developer',
        org: 'Horizon Tour & Travels',
        points: [
          'Built CRM modules & responsive React UIs for sales workflows.',
          'Shipped PDF/Excel reporting — saved 16–20 hrs/week.',
          'Cut initial load time by 38%.',
        ],
      },
      oath: {
        chapter: 'The Oath',
        headline: 'Forged the foundations · CGPA 8.36 / 10.',
        role: 'B.E. Information Technology',
        org: 'Gujarat Technological University',
        points: ['Engineering degree in Information Technology.'],
      },
      expedition: {
        chapter: 'The Long Expedition',
        headline: 'Six industries. Production-grade. End to end.',
        role: 'Full Stack Developer',
        org: 'Inexture Solutions',
        points: [
          'Delivered apps across finance, health, logistics, CRM, SaaS & media.',
          'Owned features end to end — grooming to production monitoring.',
          'Secured apps (JWT/OAuth, Okta, RBAC) and tuned performance.',
        ],
      },
      horizon: {
        chapter: 'The Horizon Ahead',
        headline: 'Seeking teams who value craft & ownership.',
        role: 'Open to the next quest',
        org: 'Available for senior roles',
        points: [],
      },
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
    // Per-project copy, keyed by the project `id` in constants. `name`,
    // `company`, `tags`, links and gallery stay data in constants.
    projects: {
      gajaakriti: {
        description: 'Dynamic media-heavy website and admin panel for a premium Ahmedabad-based wedding photography and films studio with optimized media delivery.',
        highlights: [
          'Built a modern Next.js website with dynamic landing pages, portfolio, blogs, testimonials, and admin panel',
          'Improved performance through caching, CDN strategy, Cloudflare R2, and video streaming optimization',
          'Implemented Firebase Auth and Firestore for authentication, user management, and content mapping',
          'Built Bash scripts to batch-compress images and videos, reducing hosting costs while maintaining quality',
        ],
      },
      'royal-tiles': {
        description: 'Interactive tile design and ordering tool where users select layouts, tile designs, fills, preview results live, and download order-ready PDF templates.',
        highlights: [
          'Built a custom floor visualization tool with live preview and downloadable PDF templates',
          'Programmatically rendered dynamic tile variants — corners, fills, grid patterns',
          'Built TensorFlow.js image-processing workflow to convert PNGs into region-based SVGs',
          'Developed an admin panel for managing tile designs, floor layouts, and configurations',
          'Added product tours, help drawers, and shortcut-key interactions for usability',
        ],
      },
      'advisor-portfolio': {
        description: 'Advisor-facing portfolio analysis platform built from scratch with Next.js, Okta authentication, Highcharts data visualization, and enterprise deployment tooling.',
        highlights: [
          'Built the frontend application from scratch — system design, reusable UI, route protection, API integration, sprint-wise delivery',
          'Integrated Okta OAuth with Auth.js and server-side middleware authorization logic',
          'Built portfolio analysis views with data tables and Highcharts for interactive digital reports',
          'Integrated LaunchDarkly feature flags, Harness deployments, and Splunk debugging',
          'Contributed to a Spring Boot backend for server-side PDF report generation',
        ],
      },
      'digital-investor': {
        description: 'Digital investment platform with rich user interactions, analytics tracking, and feature modules across frontend and backend.',
        highlights: [
          'Delivered React/Next.js feature modules and integrated Adobe Analytics tracking',
          'Supported Node/Express REST API integrations, error handling, and performance improvements',
          'Implemented React Query for server-state management, reducing redundant API calls',
        ],
      },
      srifin: {
        description: 'Full-stack CRM/ERP for managing financial data, workflows, and identity verification with secure RBAC.',
        highlights: [
          'Engineered RBAC and audit logs for compliance',
          'Accelerated onboarding by 20-25% with verification APIs',
          'Led image optimization improving Core Web Vitals',
        ],
      },
      xipper: {
        description: 'Multi-tenant hotel management platform with role-based operations, eKYC, booking, services, and billing.',
        highlights: [
          'Designed multi-tenant PostgreSQL models and REST APIs',
          'Cut manual billing adjustments by 30-35%',
          'Accelerated checkout speed by 15-20%',
        ],
      },
      'ai-chatbot': {
        description: 'Context-aware chatbot UI with real-time interactions using WebSocket and comprehensive end-to-end testing.',
        highlights: [
          'Led UI architecture with Next.js/Redux and WebSocket',
          'Adopted Storybook and Cypress for testing',
          'Decreased regressions by 25-30%',
        ],
      },
      'fantasy-cricket': {
        description: 'Real-money fantasy platform with live match syncing, secure payouts, and admin back-office operations.',
        highlights: [
          'Built cron pipelines for live match states',
          'Reduced admin intervention by 1.5-2 hours per match',
          'Achieved 99% transaction reliability',
        ],
      },
    },
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
