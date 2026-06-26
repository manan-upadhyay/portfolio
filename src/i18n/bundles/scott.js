// WORLD'S BEST BOSS — easter-egg personality (Michael Scott voice).
//
// Override bundle (like plain): only the keys that change; the rest falls back
// to chronicle. Lazy-loaded by `loadVoice('scott')` once unlocked. Pure flavor —
// the site stays fully navigable and every section still conveys the real
// portfolio substance (5 yrs, full-stack, ownership, performance, security,
// projects, contact) — just in Michael's voice. The visitor is still Manan;
// he's only *channeling* the World's Best Boss.

export default {
  common: { chapterLabel: 'Lesson' },

  chapters: {
    origin: { label: 'The Cold Open', sub: 'The Cold Open' },
    about: { label: 'About Your Boss', sub: 'Who Is This Guy' },
    work: { label: 'The Résumé', sub: 'My Glorious Career' },
    arsenal: { label: 'My Skillset', sub: 'Things I Am Great At' },
    projects: { label: 'My Greatest Hits', sub: 'Look What I Made' },
    contact: { label: "Let's Talk", sub: "Let's Have a Meeting" },
  },

  hero: {
    lead: 'I am basically',
    phrases: ['the world’s best boss', 'a friend, first', 'an entrepreneur', 'an idea man'],
    hook: 'Sometimes I’ll start a sentence and I don’t even know where it’s going — I just hope I find it along the way. The web apps, though? Those I finish. Every time.',
    ctaPrimary: 'Let’s be friends',
    ctaSecondary: 'Call me →',
    scroll: 'Scroll, please',
  },

  about: {
    pullQuote: '“Would I rather be feared or loved? Easy — both. I want people to be afraid of how much they love me.”',
    intro: [
      'I’m Manan — a friend first, a developer second, and an entertainer third. Five years in, twenty-plus projects deep, somehow also one of the best full-stack engineers you will meet. Don’t make it weird.',
      'I take an idea from a blank page [[endToEnd|all the way to production]], across six industries, and I make it look easy. It is not easy. I just make it look that way. That’s the whole job.',
    ],
    scribeNote: 'Things I Believe',
    disciplines: 'My Many Talents',
    principles: [
      { title: 'People person', body: 'I own every feature end to end — like family. From the first meeting to the last deploy, nobody gets left behind. That is a guarantee.' },
      { title: 'A little stitious', body: 'I’m not superstitious about edge cases. I’m a little stitious. Reusable components, accessibility, the unglamorous stuff that quietly saves the day.' },
      { title: 'Fast', body: 'Code-splitting, caching, CDNs. [[measured|Speed]]. Like a gazelle. A coding gazelle wearing a Bluetooth headset.' },
      { title: 'Locked down', body: 'JWT, OAuth, Okta, RBAC. Nobody gets in unless I say so. I’m basically a bouncer, but for your data.' },
    ],
    services: {
      frontend: { title: 'Making Things Look Great', description: 'Production UIs with React, Next.js and TypeScript. If it’s not pretty, it’s not done. I have an eye for these things.' },
      backend: { title: 'The Behind-the-Scenes Stuff', description: 'Scalable APIs with Node, Express, NestJS, JWT/OAuth and RBAC — the plumbing nobody sees but everybody needs.' },
      performance: { title: 'Making It Fast', description: 'Code-splitting, caching, CDNs, Core Web Vitals. Nobody likes waiting. I hate waiting. So I make it fast.' },
      fullstack: { title: 'Doing It All', description: 'End to end, soup to nuts, grooming to production. I wear all the hats. I love hats.' },
    },
    stats: {
      years: 'Years In The Game',
      projects: 'Hits Delivered',
      domains: 'Industries Conquered',
      load: 'Faster Than Before',
    },
  },

  experience: {
    intro: 'Okay, everybody — conference room, five minutes. This is the story of my career, and it is a journey. There will be snacks. (There are no snacks.)',
    travelTrail: 'Take the tour',
    present: 'Currently',
    journey: {
      'first-trail': {
        chapter: 'The Cold Open',
        headline: 'Where the legend modestly began.',
        role: 'Frontend Developer (and morale officer)',
        points: [
          'Built CRM modules and React UIs for sales. Real ones. That people used.',
          'Shipped PDF/Excel reporting and saved everybody 16–20 hours a week. Hero stuff.',
          'Cut load time by 38%. People noticed. I made sure of it.',
        ],
      },
      oath: {
        chapter: 'School',
        headline: 'I have a degree. A real one. CGPA 8.36 / 10. Boom.',
        role: 'Student (a good one)',
        points: ['Got an engineering degree in IT. Framed it. Looked at it. Still proud.'],
      },
      expedition: {
        chapter: 'The Big Leagues',
        headline: 'Six industries. Production-grade. End to end. Boom — roasted.',
        role: 'Full Stack Developer',
        points: [
          'Delivered apps across finance, health, logistics, CRM, SaaS and media.',
          'Owned features end to end — meeting to monitoring, no babysitting required.',
          'Locked everything down (JWT/OAuth, Okta, RBAC) and made it fast.',
        ],
      },
      horizon: {
        chapter: 'What’s Next',
        headline: 'Looking for a team to lead. Or join. Friend first, employee second.',
        role: 'Looking For My Next Team',
        points: [],
      },
    },
    summonCta: 'Let’s be friends',
  },

  arsenal: {
    subtitle: 'These are my many talents. Hover one — go ahead, I’ll wait. I’m great at waiting, too. That’s another one.',
    coreLabel: 'My Skillset',
  },

  works: {
    intro: 'These are my greatest hits — real projects, real clients, real results. I’m kind of a hit machine. Don’t tell the others I said that. Actually, do.',
    realm: 'Hit',
    featured: 'Best One',
    nda: 'Top Secret',
    enterRealm: 'Check it out',
    source: 'The Code',
    ndaSealed: 'I’d tell you, but then I’d have to… you know. It’s [[nda|an NDA thing]]. Very official.',
    chartMore: 'Show {{count}} more hits',
    furl: 'Okay, that’s enough greatness',
    projects: {
      gajaakriti: {
        description: 'A gorgeous media-heavy website and admin panel for a fancy wedding studio. Weddings! I love weddings. And the media loads fast.',
        highlights: [
          'Built a slick Next.js site — landing pages, portfolio, blogs, the works — plus an admin panel.',
          'Made it fast with caching, a CDN, Cloudflare R2 and video streaming. Zoom.',
          'Wired up Firebase Auth and Firestore for logins and content. Locked.',
          'Wrote scripts to squish images and videos and save them money. You’re welcome.',
        ],
      },
      'royal-tiles': {
        description: 'An interactive tile-design tool — pick layouts, preview live, download order-ready PDFs. Tiles! Surprisingly fun.',
        highlights: [
          'Built a floor visualizer with live preview and downloadable PDF templates.',
          'Rendered tile variants on the fly — corners, fills, the whole grid.',
          'Used TensorFlow.js to turn PNGs into [[regionSvg|region-based SVGs]]. Very fancy.',
          'Built an admin panel for designs and layouts. Organized.',
          'Added tours and shortcuts so people actually get it.',
        ],
      },
      'advisor-portfolio': {
        description: 'A finance dashboard for advisors, built from scratch — Next.js, Okta login, big interactive charts. Very Wall Street.',
        highlights: [
          'Built the whole frontend from scratch — design, reusable UI, protected routes, the lot.',
          'Hooked up Okta OAuth with proper server-side authorization. Nobody sneaks in.',
          'Made portfolio views with tables and Highcharts — pretty AND useful.',
          'Wired in feature flags, deployments and debugging tools.',
          'Pitched in on a Spring Boot backend for PDF reports.',
        ],
      },
      'digital-investor': { description: 'An investment platform with rich interactions and analytics. Money stuff. I’m good with money. Mostly.' },
      srifin: { description: 'A full-stack CRM/ERP for a microfinance company — data, workflows, ID checks, locked down tight.' },
      xipper: { description: 'A multi-tenant hotel platform — bookings, billing, eKYC, the whole front desk. Concierge not included.' },
      'ai-chatbot': { description: 'A context-aware chatbot UI with real-time chat and serious testing. It talks back. Politely.' },
      'fantasy-cricket': { description: 'A real-money fantasy cricket platform — live scores, secure payouts, admin tools. Sports! I’m great at sports.' },
    },
  },

  contact: {
    availability: 'I’m always available. Always. Possibly too available. Let’s set up a meeting — I love meetings.',
    theMessage: 'Your Message',
    correspondence: 'How to Reach Me',
    placeholders: {
      name: 'Your name (or a nickname — I love nicknames)',
      email: 'Your email',
      message: 'Tell me everything. I’m a great listener. World’s best, probably.',
    },
    messagePlaceholders: {
      'Senior role': 'Tell me about the team and the role — is it fun? Are they fun? Be honest.',
      Contract: 'What do you need built, and by when? I deliver. Under-promise, over-deliver. Boom.',
      Collaboration: 'Pitch me. I love a good pitch. Let’s make something great together.',
      'Just saying hi': 'Hi! Hello! What’s up! This is already going great.',
    },
    submitIdle: 'Send [[raven|it]]',
    submitLoading: 'Sending…',
    resumeCta: 'My Résumé',
    success: 'Boom. Roasted. (I mean — message sent! I’ll reply soon, friend.)',
    errors: {
      required: [
        'You left a field empty. That’s a no from me. Fill it all in and we’re golden.',
        'An empty field? No, no, no. I need the whole thing. I’m a giver, but I’m also a taker.',
        'You skipped one. I don’t skip people, and I don’t skip fields. Fill them all in.',
        'Blank space — and not the fun Taylor Swift kind. Every field, please.',
      ],
      email: [
        'That email is not an email. I’m not even mad — honestly, I’m impressed. Fix it?',
        'That is not a real email. I would know. I have an email. Mine works. Try again?',
        'I typed that into my brain and got an error. Give the email another shot.',
        'That email and I are not friends yet. Double-check it for me?',
      ],
      failed: [
        'It didn’t send. Not great, Bob. Let’s try that again.',
        'Something broke. Probably Toby. It’s always Toby. Hit send again.',
        'That did not go through. Awkward. Let’s pretend it didn’t happen and retry.',
        'It failed. I’m gonna need you to do the thing again. The send thing.',
      ],
      notConfigured: [
        'The form isn’t hooked up yet — that one’s on me. Just email me directly at {{email}}.',
        'Okay, full transparency: the form isn’t wired up. Email me straight at {{email}}.',
        'The form is taking a personal day. Reach me directly at {{email}}.',
      ],
    },
    quote: '“Sometimes I’ll start an email and I don’t know where it’s going. Send it anyway.”',
    channels: { location: 'My Office' },
  },

  map: {
    searchPlaceholder: 'Search… try “skills”, “projects”, “contact”',
    noResult: 'Nothing here. Weird. Try “skills”, “experience”, or “contact”.',
    footerHint: 'enter to go · esc to bail',
    actions: {
      resume: 'My Résumé',
      themeLight: 'Lights on',
      themeDark: 'Mood lighting',
    },
  },

  recap: {
    title: 'Your Performance Review',
    subtitle: 'I tracked all of this myself. I’m basically a hacker now. Don’t tell IT.',
    map: {
      localNow: 'it’s {{time}} where you are. {{sky}}. how did I— okay it’s a little creepy.',
    },
    reading: {
      title: 'Your Setup (Nice)',
      machine: 'Your Sweet Rig',
      system: 'Your Browser Situation',
      display: 'That Big Screen',
      tongue: 'How You Talk',
    },
    journey: {
      timeAfield: 'Time You Hung Out',
      trail: 'Scrollage',
    },
    voices: {
      title: 'Secret Voices',
      unlocked: '{{count}} of {{total}}. boom.',
      sealed: 'Locked',
      switchTo: 'Be {{voice}}',
      locked: 'Locked. Mysterious. Like me.',
    },
    sealed: {
      none: 'Three secret voices left to find. The hunt is on. That’s what she said.',
      some: '{{count}} of {{total}} voices still hiding. Keep going, you’re crushing it.',
      all: 'You found all of them. World’s Best Visitor. I’m not crying, you’re crying.',
    },
  },

  footer: {
    quote: '“That’s what she said.”',
  },
};
