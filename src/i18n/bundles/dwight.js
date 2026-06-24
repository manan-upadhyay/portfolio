// ASSISTANT (TO THE) MANAGER — easter-egg personality (Dwight Schrute voice).
//
// Override bundle (like plain): only the keys that change; the rest falls back
// to chronicle. Lazy-loaded by `loadVoice('dwight')` once unlocked. Pure flavor —
// every section still conveys the real portfolio substance, in Dwight's voice.
// The visitor is still Manan, channeling the Assistant (to the) Regional Manager.

export default {
  common: { chapterLabel: 'Fact' },

  chapters: {
    origin: { label: 'Identification', sub: 'Identification' },
    about: { label: 'Know Your Subject', sub: 'A Superior Specimen' },
    work: { label: 'Service Record', sub: 'Years of Service' },
    arsenal: { label: 'The Arsenal', sub: 'Weapons & Capabilities' },
    projects: { label: 'Conquests', sub: 'Territories Claimed' },
    contact: { label: 'Establish Contact', sub: 'Transmit a Message' },
  },

  hero: {
    lead: 'I am',
    phrases: ['Assistant to the Regional Manager', 'a beet farmer', 'a sheriff’s deputy', 'the best'],
    hook: 'Bears. Beets. Battlestar Galactica. Also: production-grade web applications, delivered with zero tolerance for failure and faster than 80% of all snakes.',
    ctaPrimary: 'Begin',
    ctaSecondary: 'Contact HQ →',
    scroll: 'Descend',
  },

  about: {
    pullQuote: '“Whenever I’m about to do something, I think ‘would an idiot do that?’ — and if they would, I do not do that thing.”',
    intro: [
      'I am Manan — a full-stack developer, a beet farmer, a black belt, and the owner of Schrute Farms (a five-star agritourism beet plantation). My code does not have bugs. Bugs have my code.',
      'Five years. Twenty-plus releases. Six industries conquered. I take a feature from requisition to production and I defend it like it is my own land — which, spiritually and legally, it is.',
    ],
    scribeNote: 'Schrute Principles',
    disciplines: 'Areas of Dominance',
    principles: [
      { title: 'Total ownership', body: 'From specification to production monitoring, there are no loose ends. I find them. I eliminate them. I trust no one with merge access. Loyalty is earned.' },
      { title: 'Vigilance', body: 'Reusable systems, edge cases, accessibility. An unguarded edge case is precisely how the enemy breaches the perimeter. Question everything. Raise your hand first.' },
      { title: 'Efficiency', body: 'Code-splitting, caching, CDN. Wasted milliseconds are wasted resources. I am faster than 80% of all snakes; my applications are faster than the rest.' },
      { title: 'Security', body: 'JWT, OAuth, Okta, RBAC. Identity theft is not a joke — millions of families suffer every year. Not on my watch. I am also a volunteer sheriff’s deputy.' },
    ],
    services: {
      frontend: { title: 'Interface Superiority', description: 'Production UIs with React, Next.js, TypeScript and reusable systems. The interface is the first line of defense. It will not fall.' },
      backend: { title: 'Core Infrastructure', description: 'Scalable APIs with Node, Express, NestJS, JWT/OAuth and RBAC. The foundation. Without it the structure collapses. Mine does not.' },
      performance: { title: 'Maximum Efficiency', description: 'Code-splitting, caching, CDN, Core Web Vitals. Wasted time is weakness. I do not tolerate weakness.' },
      fullstack: { title: 'Total Command', description: 'End-to-end ownership, requisition to production monitoring. I control the entire chain. There are no gaps in my perimeter.' },
    },
    stats: {
      years: 'Years of Service',
      projects: 'Missions Completed',
      domains: 'Sectors Dominated',
      load: 'Speed Increase',
    },
  },

  experience: {
    intro: 'This is my service record. It is accurate, verifiable, and impressive. Question it and you question the sun. Proceed.',
    travelTrail: 'Advance',
    present: 'Active Duty',
    journey: {
      'first-trail': {
        chapter: 'Recruitment',
        headline: 'The campaign began here.',
        role: 'Frontend Developer',
        points: [
          'Constructed CRM modules and React interfaces for sales operations.',
          'Deployed PDF/Excel reporting — reclaimed 16–20 hours per week. Efficiency.',
          'Reduced load time by 38%. Measured. Verified. Documented.',
        ],
      },
      oath: {
        chapter: 'Training',
        headline: 'Formal credentials acquired. CGPA 8.36 / 10. Fact.',
        role: 'Cadet, Information Technology',
        points: ['Acquired a formal engineering degree. Credentials are non-negotiable.'],
      },
      expedition: {
        chapter: 'The Long Campaign',
        headline: 'Six industries. Production-grade. No survivors — among the bugs.',
        role: 'Full Stack Developer',
        points: [
          'Deployed applications across six sectors: finance, health, logistics, CRM, SaaS, media.',
          'Maintained total ownership — requisition through production surveillance.',
          'Fortified every application (JWT/OAuth, Okta, RBAC) and maximized speed.',
        ],
      },
      horizon: {
        chapter: 'Next Deployment',
        headline: 'Seeking a worthy team. Beet-farming experience a plus, not required.',
        role: 'Awaiting Next Assignment',
        points: [],
      },
    },
    summonCta: 'Contact HQ',
  },

  arsenal: {
    subtitle: 'My weapons. Each one field-tested in combat. Hover one to identify its known associates.',
    coreLabel: 'The Arsenal',
  },

  works: {
    intro: 'Territories I have claimed and held — across finance, healthcare, logistics, media. Some are classified. I will disclose only what regulation permits. Do not push me.',
    realm: 'Conquest',
    featured: 'Decorated',
    nda: 'Classified',
    enterRealm: 'Enter the territory',
    source: 'Schematics',
    ndaSealed: 'Classified. I have said too much already. This conversation is over.',
    chartMore: 'Reveal {{count}} more conquests',
    furl: 'Seal the records',
    projects: {
      gajaakriti: {
        description: 'A media-heavy website and command center for a premium wedding studio. Media delivery: optimized. Performance: superior.',
        highlights: [
          'Constructed a Next.js site — landing pages, portfolio, blogs, admin command center.',
          'Optimized performance with caching, CDN, Cloudflare R2 and video streaming. No wasted bytes.',
          'Implemented Firebase Auth and Firestore. Access is controlled.',
          'Authored Bash scripts to compress media and reduce costs. Resourceful.',
        ],
      },
      'royal-tiles': {
        description: 'A tactical tile-design system — select layouts, preview live, generate order-ready PDFs. Precision tooling.',
        highlights: [
          'Engineered a floor visualizer with live preview and downloadable PDF templates.',
          'Rendered tile variants programmatically — corners, fills, grids. Exact.',
          'Built a TensorFlow.js pipeline converting PNGs to region-based SVGs.',
          'Constructed an admin panel for designs and layouts.',
          'Deployed product tours and shortcuts. Usability is a weapon.',
        ],
      },
      'advisor-portfolio': {
        description: 'An advisor-facing finance platform, built from the ground up — Next.js, Okta authentication, Highcharts. Enterprise-grade.',
        highlights: [
          'Built the entire frontend from scratch — architecture, reusable UI, route protection, delivery.',
          'Integrated Okta OAuth with server-side authorization. The perimeter holds.',
          'Constructed analysis views with tables and Highcharts. Data, weaponized.',
          'Integrated feature flags, deployments and debugging instrumentation.',
          'Contributed to a Spring Boot backend for PDF generation.',
        ],
      },
      'digital-investor': { description: 'An investment platform with rich interactions and analytics tracking. Capital demands precision. I delivered.' },
      srifin: { description: 'A full-stack microfinance CRM/ERP — financial data, workflows, identity verification, RBAC. Compliance is law.' },
      xipper: { description: 'A multi-tenant hotel management platform — operations, eKYC, booking, billing. Total operational control.' },
      'ai-chatbot': { description: 'A context-aware chatbot interface with real-time messaging and comprehensive testing. It does not malfunction.' },
      'fantasy-cricket': { description: 'A real-money fantasy sports platform — live syncing, secure payouts, back-office command. Zero tolerance for error.' },
    },
  },

  contact: {
    availability: 'I respond to all transmissions, typically within one day. Efficiency is the highest form of respect.',
    theMessage: 'The Transmission',
    correspondence: 'Channels',
    placeholders: {
      name: 'State your name',
      email: 'State your email',
      message: 'State your business. Be specific. Be honest. I will know.',
    },
    messagePlaceholders: {
      'Senior role': 'Describe the team, the rank, and the mission. I will assess your worthiness.',
      Contract: 'Specify scope, timeline, and deliverables. Ambiguity is the enemy.',
      Collaboration: 'Propose the alliance. State the terms. No surprises.',
      'Just saying hi': 'Identify yourself and state your intent.',
    },
    submitIdle: 'Transmit',
    submitLoading: 'Transmitting…',
    resumeCta: 'Service Record',
    success: 'Transmission received. Acknowledged. Filed in triplicate. I will respond.',
    errors: {
      required: ['Incomplete transmission. A field is empty. Unacceptable. Complete it.'],
      email: ['That address is invalid. Fact. Correct it and try again.'],
      failed: ['Transmission failed. Likely sabotage — possibly Jim. Attempt again.'],
      notConfigured: ['The transmitter is not yet operational. Contact me directly: {{email}}.'],
    },
    quote: '“Not everything is a lesson. Sometimes it is just an enjoyable experience. This contact form is both.”',
    channels: { location: 'Headquarters' },
  },

  map: {
    searchPlaceholder: 'Search the territory… try “skills”, “projects”, “contact”',
    noResult: 'No such territory. Recalibrate. Try “skills”, “experience”, or “contact”.',
    footerHint: 'enter to deploy · esc to retreat',
    actions: {
      resume: 'Service Record',
      themeLight: 'Daylight ops',
      themeDark: 'Night ops',
    },
  },

  footer: {
    quote: '“Fact.”',
  },
};
