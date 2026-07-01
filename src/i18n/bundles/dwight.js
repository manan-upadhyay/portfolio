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
    spin: 'Free-spin it',
    ringLabel: 'Rotate · change the sky',
    guide: {
      title: 'The astrolabe. Standard issue.',
      needle: 'The needle tracks you. As I track a deer.',
      spin: 'Spin the rose. Demonstrate authority.',
      ring: 'Rotate the outer ring to change the sky. Fact.',
    },
  },

  about: {
    pullQuote: '“Whenever I’m about to do something, I think ‘would an idiot do that?’ — and if they would, I do not do that thing.”',
    intro: [
      'I am Manan — a full-stack developer, a beet farmer, a black belt, and the owner of Schrute Farms (a five-star agritourism beet plantation). My code does not have bugs. Bugs have my code.',
      'Five years. Twenty-plus releases. Six industries conquered. I take a feature [[endToEnd|from requisition to production]] and I defend it like it is my own land — which, spiritually and legally, it is.',
    ],
    scribeNote: 'Schrute Principles',
    disciplines: 'Areas of Dominance',
    principles: [
      { title: 'Total ownership', body: 'From specification to production monitoring, there are no loose ends. I find them. I eliminate them. I trust no one with merge access. Loyalty is earned.' },
      { title: 'Vigilance', body: 'Reusable systems, edge cases, accessibility. An unguarded edge case is precisely how the enemy breaches the perimeter. Question everything. Raise your hand first.' },
      { title: 'Efficiency', body: 'Code-splitting, caching, CDN. Wasted milliseconds are wasted resources. I am faster than 80% of all snakes; my applications are [[measured|faster than the rest]].' },
      { title: 'Security', body: 'JWT, OAuth, Okta, RBAC. Identity theft is not a joke — millions of families suffer every year. Not on my watch. I am also a volunteer sheriff’s deputy.' },
    ],
    services: {
      frontend: { title: 'Interface Superiority', description: 'Production UIs with React, Next.js, TypeScript and reusable systems. The interface is the first line of defense. It will not fall.' },
      backend: { title: 'Core Infrastructure', description: 'Scalable APIs with Node, Express, NestJS, JWT/OAuth and RBAC. The foundation. Without it the structure collapses. Mine does not.' },
      performance: { title: 'Maximum Efficiency & Visibility', description: 'Code-splitting, caching, CDN, Core Web Vitals. Wasted time is weakness. I do not tolerate weakness. Structured-data SEO ensures the search engines file me correctly. Fast and findable.' },
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
    onAssignment: 'Deployed',
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
        points: [
          'Acquired a formal engineering degree. Credentials are non-negotiable.',
          'Then acquired a second degree — LL.B., three years, from HNGU — and passed the bar examination (AIBE). Redundant credentials are superior credentials. I am also legally formidable.',
        ],
      },
      expedition: {
        chapter: 'The Long Campaign',
        headline: 'Six industries. Production-grade. No survivors — among the bugs.',
        role: 'Full Stack Developer',
        points: [
          'Awarded the first-ever Employee of the Month. Month one. Bested 29 rivals. Dominance.',
          'Deployed applications across six sectors: finance, health, logistics, CRM, SaaS, media.',
          'Maintained total ownership — requisition through production surveillance.',
        ],
      },
      vanguard: {
        chapter: 'Special Assignment',
        headline: 'Commanding the front line of the Capital Group account.',
        role: 'Lead Frontend Developer',
        org: 'Infosys · stationed at Capital Group',
        via: 'Chain of command, stated precisely: enlisted at Inexture, sub-contracted through Infosys, stationed at Capital Group. Three flags. One soldier. Zero confusion. Question it and you question logistics itself.',
        points: [
          'Led frontend operations across multiple Capital Group products. Command established.',
          'Executed 4 production releases. Features built from nothing. Flawless.',
          'Directed sprint planning, client demos, code reviews, and production surveillance.',
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
    ndaSealed: '[[nda|Classified]]. I have said too much already. This conversation is over.',
    chartMore: 'Reveal {{count}} more conquests',
    furl: 'Seal the records',
    nod: 'Six territories above. The seventh is the ground beneath your feet — this site.',
    nodCta: 'Review the schematics',
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
          'Built a TensorFlow.js pipeline converting PNGs to [[regionSvg|region-based SVGs]].',
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
    status: {
      idle: 'The raven is on standby. Disciplined. Alert.',
      sending: 'Raven deployed. Maintain radio silence…',
    },
    resumeCta: 'Service Record',
    success: 'Transmission received. Acknowledged. Filed in triplicate. I will respond.',
    errors: {
      required: [
        'Incomplete transmission. A field is empty. Unacceptable. Complete it.',
        'You have left a field blank. This is a vulnerability. Fill every field.',
        'An empty field is a weakness. Weakness is unacceptable. Complete the form.',
        'Question: did you fill every field? Answer: no. Correct this immediately.',
      ],
      email: [
        'That address is invalid. Fact. Correct it and try again.',
        'That is not a valid email. I have verified this. I am never wrong. Fix it.',
        'False. That email does not exist. I checked. Re-enter a real one.',
        'An invalid address. The server cannot deliver it. Correct it.',
      ],
      failed: [
        'Transmission failed. Likely sabotage — possibly Jim. Attempt again.',
        'The message did not send. Sabotage is suspected. I will investigate. You: retry.',
        'Delivery failed. This will be noted in my report. Resend immediately.',
        'Failure. Unacceptable, but recoverable. Submit the form again.',
      ],
      notConfigured: [
        'The transmitter is not yet operational. Contact me directly: {{email}}.',
        'The system is not yet armed. Until then, transmit directly to {{email}}.',
        'The relay is offline — a temporary tactical disadvantage. Reach me at {{email}}.',
      ],
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

  recap: {
    title: 'Surveillance Report',
    subtitle: 'Compiled through superior observation of your machine and your uplink. You revealed all of this. Resistance is illogical.',
    how: 'A single reconnaissance ping to an IP registry confirmed your settlement. No intelligence was exfiltrated or archived. This time.',
    sigilNote: 'Your biometric crest, computed from your hardware. Unique. Unforgeable. Generated on-site and transmitted nowhere. Fact.',
    map: {
      localNow: 'Local time {{time}}. Condition: {{sky}}. Position triangulated. Logged.',
    },
    reading: {
      title: 'Subject Profile',
      machine: 'Hardware (Cataloged)',
      system: 'Operating Environment',
      display: 'Visual Apparatus',
      tongue: 'Dialect',
    },
    signal: {
      title: 'Intercepted Transmissions',
      lantern: 'Power Reserves',
      road: 'Uplink Speed',
      carrier: 'Service Provider',
      origin: 'Network Address',
    },
    journey: {
      timeAfield: 'Time Under Observation',
      trail: 'Distance Surveyed',
      visit: 'Recorded Incursions',
    },
    voices: {
      title: 'Classified Voices',
      unlocked: '{{count}}/{{total}} declassified',
      sealed: 'Classified',
      switchTo: 'Assume identity: {{voice}}',
      locked: 'Classified. Strictly need-to-know.',
    },
    sealed: {
      none: 'Three voices remain classified. I will find them. I always find them.',
      some: '{{count}} of {{total}} voices still classified. The investigation continues.',
      all: 'All voices declassified. Impressive. I trust you completely. (I do not.)',
    },
  },

  // The Atelier — Dwight's voice. Narrative keys only; per-phase/per-cut details
  // fall back to chronicle's real facts.
  atelier: {
    eyebrow: 'The Schematics',
    title: 'How This Was Constructed',
    confession: 'It met every standard. None of them were mine. Mine are higher.',
    confessionSub:
      'The site was operational and presentable approximately forty commits ago. It satisfied every external standard. External standards are for personnel who require supervision. I do not. I held it to the Schrute standard — which is absolute — and committed an additional two hundred hours to details no inspector would ever detect, because I detect them. I also installed surveillance: anonymous, cookieless telemetry that confirms which systems are in use. My eye misses nothing. A bear can smell a beehive from three miles. I can smell a misaligned pixel from my desk. Both facts are relevant.',
    acts: { build: 'The Construction', engine: 'The Engine Room', hidden: 'Concealed Systems' },
    reel: {
      title: 'The Surveillance Reel',
      range: 'Jun 20 – 30 · 10 operations',
      caption:
        'This footage does not advance on its own. Drag the marker, select a frame, or use the arrow keys. A leader controls the playback. Proceed.',
      scene: 'Operation',
      commits: 'commits',
      hint: 'glide across to scrub · select a frame · ← → to advance',
      aria: 'The build, operation by operation',
      prev: 'Previous operation',
      next: 'Next operation',
      scenes: {
        foundation: { title: 'Establish the Perimeter', blurb: 'A starfield and a hand-drawn Canvas2D astrolabe. Zero images. Constructed entirely from code. Efficient.' },
        canon: { title: 'Chain of Command', blurb: 'The chapter structure, the side-rail, and the scroll choreography. Order. Hierarchy. Without it, chaos.' },
        realms: { title: 'Territories Secured', blurb: 'The cinematic project plates and a searchable ⌘K map of all terrain. A leader knows the map.' },
        journey: { title: 'Service Record Deployed', blurb: 'A pinned horizontal career timeline and an interactive orbital skill field. Documented. Verifiable.' },
        voice: { title: 'Multiple Identities', blurb: 'A full i18next layer. The site speaks in five voices. I am fluent in all of them. Including beets.' },
        sky: { title: 'Sky & Audio Systems', blurb: 'Five time-aware skies via SunCalc, and a Web Audio cue system generated live. Zero bytes downloaded. Resourceful.' },
        recap: { title: 'Visitor Reconnaissance', blurb: 'A client-side panel that scans your device and uplink and pins your position. Nothing exfiltrated. This time.' },
        atelier: { title: 'The Schematics', blurb: 'This making-of, the Voice Hall, the free-spin alidade, and a flock of ravens dispatched on send.' },
        polish: { title: 'Final Inspection', blurb: 'Accessibility, reduced-motion protocols, a performance sweep, and the live transmission relay. No loose ends.' },
        observatory: { title: 'The Surveillance Apparatus', blurb: 'After deployment I installed the watch: anonymous, cookieless telemetry confirming which systems are used, structured-data SEO so the search engines file me correctly, and a logger that reports failures the instant they occur. A leader monitors everything.' },
      },
    },
    stats: {
      hours: 'Hours deployed',
      commits: 'Operations logged',
      phases: 'Strategic phases',
      voices: 'Voices commanded',
      lines: 'Lines fortified',
    },
    ledger: {
      intro:
        'Weakness is adding everything. Strength is the discipline to remove. I removed with precision. Observe.',
      built: 'Deployed',
      cut: 'Eliminated, with cause',
    },
    eggs: {
      title: 'Concealed Features. A Briefing.',
      intro: 'Most of these systems are hidden. A superior operative finds them. Here is your intelligence. Memorize it. Then do NOT destroy this list — we worked hard on it.',
      astrolabe: {
        title: 'The Tracking Alidade',
        how: 'Move your cursor across the astrolabe. The needle pursues it without mercy. A gear sound matches its speed exactly. Precision. Like a falcon.',
      },
      spin: {
        title: 'Free-Spin Protocol',
        how: 'Engage the button on the instrument’s rim. The needle spins, then decelerates under authentic friction physics. Fact: gears do not lie.',
      },
      sound: {
        title: 'Synthesized Audio',
        how: 'Every sound is generated by the machine in real time. Zero bytes downloaded. Control it bottom-right. Change the theme to hear it. Efficient. I approve.',
      },
      sky: {
        title: 'Five Sky States',
        how: 'Top-right control. Five skies. “Auto” reads your local time and deploys the correct one. Surveillance-grade. Excellent.',
      },
      voices: {
        title: 'Classified Voices',
        how: 'The site speaks in multiple identities. Open the Hall with ⇧⌘V. Locked identities require a password, typed anywhere on the page. The password for one of them is “beets”. You did not hear that from me.',
      },
      map: {
        title: 'Tactical Map',
        how: 'Press ⌘K to deploy the map. Fully searchable. A leader always knows the terrain.',
      },
      raven: {
        title: 'Raven Dispatch',
        how: 'Submit the form. A flock of ravens is released across the screen with an audible cry. The message is en route. Do not intercept it.',
      },
      recap: {
        title: 'Visitor Reconnaissance',
        how: 'At the base of the contact section, a panel scans your device, display, and network — and your city, with consent — then forges a unique sigil. Identity confirmed.',
      },
      console: {
        title: 'Encrypted Field Notes',
        how: 'Open the DevTools console. A classified gold-lettered briefing awaits, with intelligence on the sealed identities and a debug override for field operations. Standard protocol. Read it. Do not delete it.',
      },
    },
    observatory: {
      eyebrow: 'The Watch',
      title: 'Surveillance. Anonymous. Superior.',
      intro: 'A system you do not monitor is a system in mutiny. I monitor. Anonymously, cookielessly, and with the visitor’s full consent withdrawn the instant they request it. This is not paranoia. This is leadership.',
      hub: 'the session dossier',
      hubNote: 'Every action consolidates into a single dossier, transmitted on departure. One file. Complete. Filed.',
      indexHint: 'Each point of light is a logged event. Sweep the field or select one from the manifest; it will identify itself and disclose its trigger. Nothing here is unaccounted for.',
      cadence: { once: 'Once per visit', repeat: 'Every occurrence' },
      metrics: {
        events: 'Tracked events',
        superProps: 'Auto-tags',
        webhooks: 'Alert channels',
        dashboards: 'Command boards',
        schemas: 'SEO schemas',
      },
      groups: {
        origin: 'Movement',
        craft: 'Engagement',
        realms: 'Territories',
        intent: 'Contact attempts',
      },
      panels: {
        privacy: {
          title: 'Anonymous. By Protocol.',
          body: 'No accounts. No cookies. Nothing retained between visits. The instant a browser signals Do-Not-Track, surveillance ceases. No consent banner is deployed, because there is nothing to consent to. Discipline.',
        },
        discoverability: {
          title: 'Correctly Filed',
          body: 'Five structured schemas — Person, WebSite, ProfilePage, Organization, address — plus link previews and a designated application-name, so the search engines classify me with precision. A record must be unambiguous.',
        },
        observability: {
          title: 'No Failure Goes Unreported',
          body: 'A structured logger, exceptions captured and dispatched to a Discord channel automatically the instant they occur, and Core Web Vitals measured from genuine field traffic. When a system falters, I am notified first. Always first.',
        },
      },
      webhooks: {
        title: 'The Chain of Command',
        caption: 'Two webhooks report directly to me. PostHog transmits every exception to a Discord alerts channel; GitHub transmits every push to a deploys channel. I do not patrol a dashboard awaiting bad news. The news reports to me.',
        hop: 'webhook',
      },
      footnote: 'Thirty-three events. Thirteen tags. Five boards. Zero cookies. Building the site is competence. Building the apparatus that watches the site is command.',
    },
    atlas: {
      eyebrow: 'The Filing Protocol',
      title: 'Every File In Its Place',
      intro: 'A disorganised codebase is a disorganised mind. Mine is neither. Inspect the structure; each file is positioned by doctrine, and the doctrine is sound.',
      hotspots: 'Critical Assets',
      prompt: 'Select a directory or a critical asset. The reasoning will be disclosed.',
      why: 'The Justification',
      repoCta: 'Inspect The Source',
    },
    offmap: {
      title: 'The Man Behind the Manager',
      intro: 'A superior man has multiple dimensions. I have three. Select one. Investigate.',
    },
    personas: {
      more: 'Read the file',
      less: 'Classify it',
      storyteller: {
        label: 'The Strategist',
        hook: 'I do not watch sagas. I study them.',
        story: 'Lord of the Rings — a documentary about loyalty and walking. Game of Thrones — a cautionary tale about poor succession planning. Anime — strategically superior storytelling. This is why the site is a map of realms. Tactics, not entertainment.',
      },
      filmmaker: {
        label: 'The Filmmaker',
        hook: 'I operate a camera with precision.',
        story: 'I have produced cinematic footage for establishments and events. This is why the site moves correctly — every motion is deliberate, surveilled, and personally approved by me. An undisciplined animation is a security vulnerability.',
      },
      wanderer: {
        label: 'The Survivalist',
        hook: 'I retreat to the wilderness. No signal.',
        story: 'Trekking. Off the grid. This is not a vacation — it is a readiness exercise. A man must be able to function away from the network. I return sharper. Nature does not coddle you, and neither do I.',
      },
    },
    builtWith: 'Constructed with',
    manifesto: [
      'A clarification regarding motive. This was not constructed to impress a recruiter. That is a fortunate side effect, like the manure on a beet farm. It was constructed because I possess an unrelenting compulsion to surpass the ordinary specification — to test a concept untested, to deploy technology I have not yet subjugated. The site was merely the proving ground.',
      'I derive genuine satisfaction from this work: the logic, the problem, the precise instant a chaotic system submits to order. I pursue problems large enough to threaten me, because a threat sharpens a man. Comfort is how the body atrophies. The same is true of the mind.',
      'Beneath the discipline, four principles are non-negotiable: accountability — I answer for everything; a client who is genuinely satisfied — I accept no other outcome; work that withstands assault; and attention to detail so total it borders on surveillance. Everything above is simply proof. Fact.',
    ],
    sign: '— Dwight K. Schrute. (Manan. It is Manan.)',
  },

  voiceHall: {
    title: 'Voice Authorization',
    subtitle: 'Select the voice cleared to narrate this chronicle. Choose correctly. Identity is everything.',
    searchPlaceholder: 'Search the registry…  try “office”, “beets”, “moo”',
    nowNarrating: 'Currently in command',
    tryHint: 'Select a voice. The entire chronicle — this panel included — will immediately submit to it. There is no resistance.',
    close: 'Dismiss',
    noResult: 'No such voice exists in the registry. I have memorized the registry. There is no such voice.',
    sealedHint: 'Certain voices are sealed for security. Type the correct password anywhere on the page to breach them.',
    found: '{{count}}/{{total}} sealed voices breached',
    footerHint: 'enter to speak · esc to close',
    categories: {
      core: 'Authorized Personnel',
      office: 'The Office',
      bestiary: 'Livestock',
    },
    request: {
      section: 'Requisition',
      cta: 'Requisition a new voice',
      ctaSub: 'A voice is absent from the roster. This is a security gap. Report the candidate. I will investigate personally.',
      back: 'Back',
      persona: 'Identify the voice',
      personaPlaceholder: 'a superior officer · a fellow farmer · a worthy adversary…',
      email: 'Your email',
      emailPlaceholder: 'your email — for the official record',
      note: 'State your reasoning',
      notePlaceholder: 'justify the requisition (strongly recommended)',
      send: 'Submit requisition',
      sending: 'Transmitting…',
      done: 'Requisition logged',
      doneSub: 'The candidate “{{persona}}” will be vetted thoroughly. Background check included. You have done your duty.',
      error: 'Transmission failed. Verify the name and a valid email. Do not make me ask twice.',
    },
  },

  voice: {
    menuSub: 'Identify the narrator. Assign a voice. Proceed.',
    more: '{{count}} more concealed. Locate them. That is an order.',
  },

  footer: {
    quote: '“Fact.”',
    atelierLink: 'The schematics — how this site was engineered. Question authority.',
  },

  makingOf: {
    back: 'Return to the survey',
  },
};
