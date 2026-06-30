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
    spin: 'Spin the alidade',
  },

  about: {
    pullQuote: '“Every realm below began as an empty repository and a blinking cursor.”',
    intro: [
      'I build production web platforms the way a storyteller builds worlds — structure beneath the surface, and an obsessive eye on the details a user feels but never sees.',
      'Five years and twenty-plus releases across six industries. I carry features from an empty repository [[endToEnd|all the way to production monitoring]], and I do my sharpest work where the problem is tangled and the path isn’t obvious.',
    ],
    scribeNote: "The Scribe's Note",
    principles: [
      { title: 'End-to-end ownership', body: 'From requirement grooming and system design to release validation and production monitoring.' },
      { title: 'Detail as discipline', body: 'Reusable UI systems, edge cases, and accessibility — the unglamorous craft that makes products feel solid.' },
      { title: 'Performance as a habit', body: 'Code-splitting, caching, CDN, and media optimization — [[measured|measured, not guessed]].' },
      { title: 'Secure by default', body: 'JWT/OAuth, Okta, RBAC and middleware access control across enterprise apps.' },
    ],
    disciplines: 'Disciplines',
    // Discipline cards (keyed by the service `iconKey` in constants).
    services: {
      frontend: { title: 'Frontend Architecture', description: 'Production-grade UIs with React.js, Next.js, TypeScript, and reusable component systems.' },
      backend: { title: 'Backend Development', description: 'Scalable APIs with Node.js, Express.js, NestJS, REST, JWT/OAuth, and RBAC.' },
      performance: { title: 'Performance & Discoverability', description: 'Code-splitting, caching, CDN strategies, lazy loading, Core Web Vitals tuning, and structured-data SEO that machines and humans both read.' },
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
    onAssignment: 'On assignment',
    via: 'via Infosys',
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
        points: [
          'Engineering degree in Information Technology.',
          'And a three-year LL.B. from Hemchandracharya North Gujarat University — earned alongside the work, with the bar cleared (AIBE) in 2026.',
        ],
      },
      expedition: {
        chapter: 'The Long Expedition',
        headline: 'Six industries. Production-grade. End to end.',
        role: 'Full Stack Developer',
        org: 'Inexture Solutions',
        points: [
          'First-ever Employee of the Month — claimed in month one, among 30.',
          'Delivered apps across finance, health, logistics, CRM, SaaS & media.',
          'Owned features end to end — grooming to production monitoring.',
        ],
      },
      vanguard: {
        chapter: 'The Vanguard',
        headline: 'Leading the front line of the Capital Group fleet.',
        role: 'Lead Frontend Developer',
        org: 'Infosys · embedded with Capital Group',
        via: 'Flying Inexture’s colours — sub-contracted through Infosys, embedded with the Capital Group fleet.',
        points: [
          'Lead frontend across multiple products on the Capital Group network.',
          'Shipped 4 production releases — features charted from scratch.',
          'Ran sprint planning, client demos, code reviews & production monitoring.',
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
    ndaSealed: "[[nda|Sealed under NDA]] — details limited to what's permissible.",
    chartMore: 'Chart {{count}} more realms',
    furl: 'Furl the map',
    // The nod to the unnumbered seventh realm — this very site (see the Atelier).
    nod: 'Six realms charted. The seventh is the one you are standing in.',
    nodCta: 'Step into the Atelier',
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
          'Built TensorFlow.js image-processing workflow to convert PNGs into [[regionSvg|region-based SVGs]]',
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
    status: {
      idle: 'The raven waits, quill trimmed and ready.',
      sending: 'Wings unfurl — the raven takes the sky…',
    },
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
      voices: 'Change voice',
      resume: 'Read the Scroll (Resume)',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      themeLight: 'Light the dawn',
      themeDark: 'Fall to night',
    },
  },

  // The Voice Hall — the command-palette voice picker (scales past the popover).
  voiceHall: {
    title: 'The Voice Hall',
    subtitle: 'Choose who narrates the chronicle — or summon a voice not yet among us.',
    searchPlaceholder: 'Search voices…  try “office”, “boss”, “moo”',
    nowNarrating: 'Now narrating',
    tryHint: 'Tap a voice — the whole chronicle, this hall included, re-tells itself in their words.',
    close: 'Close',
    noResult: 'No voice answers to that name — yet.',
    sealedHint: 'Sealed voices wake when you type their secret word anywhere on the page.',
    found: '{{count}}/{{total}} sealed found',
    footerHint: 'enter to speak · esc to close',
    categories: {
      core: 'The Voices',
      office: 'The Office',
      bestiary: 'The Bestiary',
    },
    // The gamified "summon a new voice" tile.
    request: {
      section: 'Summon',
      cta: 'Summon a new voice',
      ctaSub: 'A character you’d love to hear narrate this? Send word to the cartographer.',
      back: 'Back',
      persona: 'Whose voice?',
      personaPlaceholder: 'Gandalf · a dread pirate · your favourite villain…',
      email: 'Your email',
      emailPlaceholder: 'your email — so I can tell you when it lands',
      note: 'Why them?',
      notePlaceholder: 'make your case (optional)',
      send: 'Send the request',
      sending: 'Summoning…',
      done: 'Your request takes flight',
      doneSub: 'The cartographer will weigh “{{persona}}.” Thank you, traveler.',
      error: 'The raven balked — check the name and a valid email, then try again.',
    },
  },

  footer: {
    quote: '“The journey is the reward.”',
    credit: '© {{year}} Manan Upadhyay · Crafted with React, GSAP & far too much chai.',
    atelierLink: 'The Atelier — how this was made',
  },

  // The Atelier's own route (/making-of) chrome — the doorway back home.
  makingOf: {
    back: 'Return to the Chronicle',
  },

  // Marginalia footnotes (LEGENDARY-ROADMAP §2). Keyed by the `[[id|…]]` marker
  // embedded in the flavor copy above. These are PLAIN substance — the real
  // engineering fact behind the flourish — and intentionally stay literal in
  // every voice (no per-voice overrides; personality bundles fall back here).
  marginalia: {
    endToEnd: 'End-to-end ownership: requirement grooming → system design → API integration → release validation → production monitoring.',
    measured: 'Profiled with Lighthouse and Chrome DevTools and tracked against Core Web Vitals — load time measured before and after, for a real 38% cut, not a guess.',
    nda: 'Real production work for an enterprise client, shipped under a non-disclosure agreement — the details stay sealed, but the engineering was the real thing.',
    regionSvg: 'No off-the-shelf library did this — I built a custom tool from scratch that uses TensorFlow.js to turn a flat PNG into an editable, region-segmented SVG.'
  },

  // Expedition recap (LEGENDARY-ROADMAP §5). A cinematic, session-only send-off
  // near contact: the cartographer "reads" the traveler from the browser alone
  // (device + locale + their live local sky) and pins them on an animated map —
  // all client-side, nothing stored or sent. `{{var}}` are interpolations.
  recap: {
    title: 'Your Expedition',
    subtitle: 'Read live from your device and your connection — shown here, kept nowhere.',
    how: 'One quiet lookup to an IP service names your city. Nothing else leaves this page, and nothing is stored.',
    sigilNote: 'Your traveler’s mark — drawn from your device alone. No two are alike, and this one was sent nowhere.',
    map: {
      // e.g. "your Dusk · 21:34"
      localNow: 'your {{sky}} · {{time}}',
    },
    reading: {
      title: 'The Reading',
      machine: 'Engine',
      system: 'Vessel',
      display: 'Viewport',
      tongue: 'Tongue',
    },
    signal: {
      title: 'The Signal',
      lantern: 'Lantern',
      road: 'Road',
      carrier: 'Carrier',
      origin: 'Origin',
    },
    journey: {
      timeAfield: 'Time afield',
      trail: 'Trail unrolled',
      visit: 'Voyage no.',
    },
    voices: {
      title: 'Sealed Voices',
      unlocked: '{{count}} / {{total}} found',
      sealed: 'Sealed',
      explore: 'Explore all',
      switchTo: 'Speak as {{voice}}',
      locked: 'A sealed voice, yet undiscovered',
    },
    sealed: {
      none: 'Three voices still lie sealed — listen for the words that wake them.',
      some: '{{count}} of {{total}} voices still lie sealed — keep listening.',
      all: 'Every voice discovered. A keen ear, traveler.',
    },
  },

  // The Atelier (LEGENDARY-ROADMAP §7) — the coda chapter: how this very site was
  // designed, developed and pushed past "done". The confession + manifesto are
  // the human core; the ledger pairs every shipped phase with what was cut. Metric
  // values + ids are data in constants.atelier; these are the voiced labels.
  atelier: {
    eyebrow: 'The Atelier',
    title: 'How the map was drawn',
    confession: 'It cleared every bar but mine.',
    confessionSub:
      'The map was a finished, presentable build some forty commits ago — it cleared every bar a portfolio is meant to clear. I hold my work to a harder one. I have never been able to leave a detail half-right, so I poured another 200-odd hours into the things only I would notice — the easing on a single curve, the way a cue lands, the telemetry that proves the moments are touched, the frame you feel but cannot name. "Good enough" has never been the brief; out-doing my last pass is.',
    acts: { build: 'The Build', engine: 'The Engine Room', hidden: 'The Hidden Layer' },
    reel: {
      title: 'The Director’s Reel',
      range: 'Jun 20 – 30 · 10 scenes',
      caption:
        'Drag the playhead, click a frame, or use the arrow keys to move through the build one scene at a time.',
      scene: 'Scene',
      commits: 'commits',
      hint: 'move across to scrub · click a frame · ← → to step',
      aria: 'The build, scene by scene',
      prev: 'Previous scene',
      next: 'Next scene',
      scenes: {
        foundation: { title: 'First Light', blurb: 'A pure-CSS starfield and a hand-drawn Canvas2D astrolabe — the hero, conjured without a single image.' },
        canon: { title: 'The Chronicle Takes Shape', blurb: 'The chapter system, the side-rail nav, and the scroll choreography that carries the whole journey.' },
        realms: { title: 'The Realms', blurb: 'Editorial, cinematic project plates — and the searchable ⌘K map that charts every chapter of the journey.' },
        journey: { title: 'The Journey & the Arsenal', blurb: 'A pinned, horizontally-scrubbed timeline of the path so far, and an interactive orbital field of skills.' },
        voice: { title: 'The Voice System', blurb: 'A full i18next layer — the entire site re-skins through five distinct writing voices, architected to scale to fifteen.' },
        sky: { title: 'Sky & Sound', blurb: 'Five time-aware themes resolved from your local time via SunCalc, and a Web Audio score of synthesized cues — zero bytes shipped.' },
        recap: { title: 'The Traveler’s Read', blurb: 'A client-side instrument that reads your device and connection and pins you on a live map — nothing stored, nothing sent.' },
        atelier: { title: 'The Atelier & the Raven', blurb: 'The making-of route, the Voice Hall, the free-spin astrolabe, and a flock of ravens that bursts across the screen on send.' },
        polish: { title: 'The Finishing Pass', blurb: 'Accessibility, reduced-motion fallbacks, a performance sweep, and the live, server-side contact backend.' },
        observatory: { title: 'The Observatory', blurb: 'After the map was drawn, I instrumented it — privacy-first product analytics, structured-data SEO, and a bespoke logger with a console banner for the curious.' },
      },
    },
    stats: {
      hours: 'Hours poured',
      commits: 'Revamp commits',
      phases: 'Wonder phases',
      voices: 'Site voices',
      lines: 'Lines of craft',
    },
    ledger: {
      intro:
        'The senior part of the work was not adding things — it was knowing what to leave out. Here is what shipped, and what I cut or refused to add on purpose.',
      built: 'What I shipped',
      cut: 'What I cut, and why',
    },
    phases: {
      voice: { title: 'The Voice switcher', why: 'A full i18next layer — the whole site re-skins through five personalities, scalable to fifteen, with easter-egg voices unlocked by discovery.' },
      marginalia: { title: 'Marginalia', why: 'Hover a flavor phrase and the real engineering fact unfolds in the margin — the fantasy made to earn its keep.' },
      sky: { title: 'Time-aware sky', why: 'Five theme modes that resolve from your real local time via SunCalc — no geolocation prompt, pure math from your timezone.' },
      sound: { title: 'Interactive sound', why: 'A Web Audio system of synthesized cues (zero bytes) that reward intent, never motion — default-on, silenced under reduced-motion.' },
      recap: { title: 'The Expedition recap', why: 'A cinematic instrument that reads your device and connection client-side and pins you on a live polar map — nothing stored, nothing sent.' },
      eggs: { title: 'Voice easter eggs', why: 'Type a secret word anywhere and a sealed personality wakes — Scott, Dwight, a cow — each authored in full character.' },
      telemetry: { title: 'Telemetry & discoverability', why: 'Thirty-three product events folding into one per-visit session recap, thirteen super-properties, and five PostHog dashboards — all cookieless, anonymous, and silenced under Do-Not-Track. Beside it, structured-data SEO and a bespoke logger. The instrument answers "are the moments touched?" without harvesting a thing about who touches them.' },
    },
    cuts: {
      assets: { title: 'A folder of images, GIFs & audio files', why: 'Almost none of this site is shipped media. The hero astrolabe is drawn in Canvas2D, the starfield is pure CSS, and every interface sound is synthesised live through the Web Audio API. The whole feedback layer ships as code, not megabytes — a smaller bundle, fewer network round-trips, and a faster first paint.' },
      threejs: { title: 'Three.js & the whole WebGL layer', why: 'An early build leaned on a 3D library for depth. I tore it out and rebuilt the same sense of space with layered CSS, parallax, and a hand-drawn Canvas2D astrolabe — dropping a heavy dependency and keeping the initial JS well under budget. Depth, without the download.' },
      tracking: { title: 'Cookie banners, cross-session tracking & surveillance analytics', why: 'The site does measure itself — but the senior call was how. PostHog runs cookieless (memory-only persistence), fully anonymous (no accounts, no identify(), no cross-session identity), and hard-disabled the instant Do-Not-Track is set. No consent banner, because there is nothing to consent to: nothing is sold, nothing follows you off the page. The analytics serve the craft — which moments get touched — not the surveillance.' },
      componentLib: { title: 'A pre-built UI kit or paid template', why: 'Every component here is bespoke — Tailwind for layout, CSS variables for theme, nothing lifted from a library. More work, but full pixel control and none of the bloat or that unmistakable look-alike-template feel.' },
      statusLine: { title: 'The “how did he know?” status line', why: 'Region + moon phase near the hero. Built, reviewed, cut — it edged from wonder toward creepy, and the time-driven palette already carried the magic.' },
      battery: { title: 'The battery readout', why: 'Removed: the Battery Status API lies on some platforms (macOS Chrome reports 100% while charging). A card that “reads you” must never show data it cannot trust.' },
    },
    eggs: {
      title: 'The Field Guide',
      intro: 'Most of the craft here is quiet on purpose — it answers only when you reach for it. Here is where to find what hides in plain sight.',
      astrolabe: {
        title: 'The living needle',
        how: 'Sweep your cursor across the hero astrolabe — the alidade follows your hand, and a gear-mechanism sound turns at exactly the speed you move it.',
      },
      spin: {
        title: 'Spin the alidade',
        how: 'Press the spin button on the instrument’s rim to flick the needle into a free spin — real flywheel physics wind it up and let it coast to rest.',
      },
      sound: {
        title: 'A synthesised score',
        how: 'Every cue on the page is generated live by Web Audio — zero bytes shipped. Toggle it from the speaker control, bottom-right, then listen on a theme change, a send, a map open.',
      },
      sky: {
        title: 'Five skies',
        how: 'The control top-right holds five skies — and “auto” reads your local time to choose dawn, day, dusk, or night for you.',
      },
      voices: {
        title: 'Hidden voices',
        how: 'The whole site can be re-voiced. Open the Voice Hall (⇧⌘V) — sealed personalities unlock when you type their secret word anywhere on the page. (Try “boss”.)',
      },
      map: {
        title: 'The chart',
        how: 'Press ⌘K (Ctrl K) to summon the realm map — a searchable chart of every chapter of the journey.',
      },
      raven: {
        title: 'The raven',
        how: 'Send word from Summon and a flock of ravens bursts across the page with a caw — the courier carrying your message.',
      },
      recap: {
        title: 'The traveller’s read',
        how: 'At the foot of Summon, an instrument panel reads your own device, screen, and connection — and, with your blessing, your city — then mints a one-of-a-kind sigil from it.',
      },
      console: {
        title: 'The cartographer’s ledger',
        how: 'Open the browser’s DevTools console — the cartographer left a gold-lettered greeting, clues to the sealed voices and the margins of the map, and a debug key for travellers who want to look under the hood in the wild.',
      },
    },
    observatory: {
      eyebrow: 'The Observatory',
      title: 'Instrumented, not surveilled',
      intro: 'A map you cannot read is just decoration. So once the realms were drawn, I built the instrument that reads them — product analytics, discoverability, and observability, engineered to respect the very traveller it watches.',
      hub: 'session recap',
      hubNote: 'Every named event folds into one tidy per-visit summary, flushed as you leave — the whole journey in a single row.',
      indexHint: 'Every star is a real event. Sweep the field — or choose one from the ledger — and the instrument names it and where it fires.',
      cadence: { once: 'Once per visit', repeat: 'Every time' },
      metrics: {
        events: 'Product events',
        superProps: 'Super-properties',
        webhooks: 'Webhook routes',
        dashboards: 'Live dashboards',
        schemas: 'Structured schemas',
      },
      groups: {
        origin: 'Origin & wayfinding',
        craft: 'The craft',
        realms: 'The realms',
        intent: 'Intent & summons',
      },
      panels: {
        privacy: {
          title: 'Privacy-first by design',
          body: 'PostHog runs cookieless and fully anonymous — no accounts, no identify(), memory-only persistence — and hard-disables the moment Do-Not-Track is set. No consent banner, because there is nothing to consent to.',
        },
        discoverability: {
          title: 'Built to be found',
          body: 'Five JSON-LD schemas (Person, WebSite, ProfilePage, Organization, address), Open Graph and Twitter cards, canonical URLs, and an application-name that claims the Google Knowledge Panel — so machines and humans read it the same way.',
        },
        observability: {
          title: 'Watched, so it never breaks quietly',
          body: 'A zero-dependency structured logger with scoped tags and a production debug key, exceptions caught from the error boundary and relayed to a Discord channel the instant they occur, and Vercel Speed Insights tracking Core Web Vitals from real visits.',
        },
      },
      webhooks: {
        title: 'The alert path',
        caption: 'Two webhooks carry word the instant it matters — a thrown exception, a fresh deploy — straight to where I already keep watch. No dashboard to babysit; the news finds me.',
        hop: 'webhook',
      },
      footnote: 'Thirty-three events, thirteen super-properties, five dashboards, five schemas — and not a single cookie. Senior work is not just shipping the moment; it is proving the moment lands.',
    },
    atlas: {
      eyebrow: 'The Codebase',
      title: 'How the map is built',
      intro: 'Open the structure itself — a hand-drawn chart of the repository. Walk it like a map; each file tells you not what it does, but why it sits where it does.',
      hotspots: 'Start here',
      prompt: 'Open a folder, or pick a landmark — every file carries the reasoning behind it.',
      why: 'Why it’s built this way',
      repoCta: 'See the originals',
    },
    offmap: {
      title: 'The cartographer, off the map',
      intro: 'Three sides of the person who could not leave it alone — open a door.',
    },
    personas: {
      more: 'Read on',
      less: 'Close',
      storyteller: {
        label: 'The Storyteller',
        hook: 'I read systems the way I read sagas.',
        story: 'Middle-earth, Westeros, the Grand Line, every Nolan cut sliced out of order — structure underneath, consequence on top. That instinct is exactly why this site is built as a Chronicle, and not a CV.',
      },
      filmmaker: {
        label: 'The Filmmaker',
        hook: 'Before the code, there was a camera.',
        story: 'Short films and cinematic edits for cafés, restaurants and weddings — and that eye for framing and pacing never switched off. The motion on this page is not decoration; it is the same instinct, pointed at an interface.',
      },
      wanderer: {
        label: 'The Wanderer',
        hook: 'I reset where there is no signal.',
        story: 'When the screens go dark I head for the mountains — trekking, raw nature, the kind of quiet that resets you. It is part of why I can sit with a hard problem for hours and still enjoy it.',
      },
    },
    builtWith: 'Built with',
    manifesto: [
      'Let me be honest about why this exists. Not to impress a hiring manager — that is a side effect. I built it because I have a restless need to go past the normal version of a thing: to test an idea I have not tried, to reach for technology I have not yet bent to my will. This site was my excuse.',
      'I love this work in a way that is hard to fake — the code, the problem, the moment a tangled system finally clicks. I chase the problems big enough to scare me, the ones that push me to the edge of what I know, because that edge is the only place the work gets genuinely interesting.',
      'And underneath the obsession sits a short, non-negotiable list: accountability, a client who is truly glad they trusted me, work that holds up under load, and an eye for the details everyone else lets slide. Everything above is just me holding myself to that — out loud, where you can see it.',
    ],
    sign: '— Manan, who could not leave it alone.',
  },

  voice: {
    menuTitle: 'Voice',
    menuSub: 'Who narrates this chronicle? Choose a teller.',
    pinned: 'Marked Voices',
    sealed: 'Sealed Voices',
    sealedHint: 'Solve a clue, then',
    sealedTypeHint: 'type the answer anywhere on the page.',
    more: '{{count}} more in the Voice Hall',
    openHall: 'Enter the Voice Hall',
    hallTeaserSome: '{{count}} sealed voices await discovery',
    hallTeaserAll: 'Every voice discovered — wander them all',
    // The one-time entice note above the quill (replaces the old static ring).
    note: 'Psst — this whole tale can be told in other voices. Care to meet them?',
    locked: 'Locked',
    ariaOpen: 'Choose a voice',
  },

  // Interactive sound design (LEGENDARY-ROADMAP §4). UI copy for the bottom-right
  // sound control; cues themselves are audio, not copy. Literal across voices.
  sound: {
    enableHint: 'This chronicle has a voice — click below to hear it.',
    on: 'Sound',
    off: 'Muted',
    ready: 'Ready',
    toggleOn: 'Turn sound on',
    toggleOff: 'Turn sound off',
    volume: 'Sound volume',
  },

  // Time-aware sky (LEGENDARY-ROADMAP §3). `auto` reads the visitor's real local
  // sky; the others are manual. Mode names feed the `SkyControl` menu + chip and
  // stay literal across voices — the personality bundles fall back here.
  sky: {
    menuTitle: 'Sky',
    ariaOpen: 'Choose the sky',
    autoFollowing: 'following {{sky}}',
    modes: {
      auto: 'Auto',
      dawn: 'Dawn',
      day: 'Day',
      dusk: 'Dusk',
      night: 'Night',
    },
  },
};
