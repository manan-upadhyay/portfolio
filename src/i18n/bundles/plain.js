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
    spin: 'Spin the pointer',
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
      expedition: { chapter: 'Full Stack Role', headline: 'Six industries. Production-grade. End to end.' },
      vanguard: {
        chapter: 'Lead Role',
        headline: 'Leading frontend across the Capital Group product network.',
        org: 'Infosys · embedded with Capital Group',
        via: 'Employed by Inexture, sub-contracted through Infosys, embedded with Capital Group.',
      },
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
    nod: 'Six projects above. The seventh is this site itself.',
    nodCta: 'See how it was built',
    // (nodCta keeps its literal wording — the doorway reads the same in plain.)
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
    submitIdle: 'Send Message',
    submitLoading: 'Sending…',
    status: {
      idle: 'Ready when you are.',
      sending: 'Sending your message…',
    },
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
      voices: 'Voices',
      resume: 'Resume',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
    },
  },

  voiceHall: {
    title: 'Voices',
    subtitle: 'Pick the writing voice — or request one that isn’t here yet.',
    searchPlaceholder: 'Search voices…',
    close: 'Close',
    noResult: 'No matching voice.',
    sealedHint: 'Hidden voices unlock when you type their secret word anywhere on the page.',
    found: '{{count}}/{{total}} found',
    footerHint: 'enter to select · esc to close',
    categories: {
      core: 'Core',
      office: 'The Office',
      bestiary: 'Animals',
    },
    request: {
      section: 'Request',
      cta: 'Request a voice',
      ctaSub: 'Want a specific voice or personality? Let me know and I’ll consider adding it.',
      persona: 'Which voice / personality?',
      personaPlaceholder: 'e.g. a famous character, an accent, a tone…',
      emailPlaceholder: 'your email — so I can follow up',
      send: 'Send request',
      sending: 'Sending…',
      done: 'Request sent',
      doneSub: 'Thanks — I’ll consider “{{persona}}.”',
      error: 'Something went wrong — check the name and a valid email, then retry.',
    },
  },

  recap: {
    title: 'Your Session',
    subtitle: 'Read from your device and connection — shown here, never stored.',
    how: 'One request to an IP geolocation service resolves your city. Nothing else is sent, and nothing is saved.',
    sigilNote: 'A fingerprint generated from your device signals — unique to you, and computed entirely on this page.',
    map: {
      localNow: '{{sky}} · {{time}} local',
    },
    reading: {
      title: 'Your Device',
      machine: 'Hardware',
      system: 'Browser & OS',
      display: 'Display',
      tongue: 'Language',
    },
    signal: {
      title: 'Connection',
      lantern: 'Battery',
      road: 'Network',
      carrier: 'ISP',
      origin: 'IP address',
    },
    journey: {
      timeAfield: 'Time on page',
      trail: 'Scroll distance',
      visit: 'Visit no.',
    },
    voices: {
      title: 'Hidden Voices',
      unlocked: '{{count}} / {{total}} found',
      sealed: 'Locked',
      explore: 'Browse all',
      switchTo: 'Switch to {{voice}}',
      locked: 'Locked — not yet found',
    },
    sealed: {
      none: 'Three hidden voices are still locked — the right words unlock them.',
      some: '{{count}} of {{total}} hidden voices still locked.',
      all: 'All hidden voices unlocked. Nice.',
    },
  },

  // The Atelier — straight, factual register. Full coverage so plain never falls
  // back into the cinematic voice mid-section.
  atelier: {
    eyebrow: 'Colophon',
    title: 'How this site was built',
    confession: 'It was already done. I kept building anyway.',
    confessionSub:
      'The site was finished and presentable about twenty commits ago. I chose not to stop there — I spent roughly another hundred hours on it, because I wanted to treat my own portfolio like a real product instead of settling for "good enough".',
    timeline: {
      title: 'Commit history',
      range: 'Jun 20 – 27',
      now: 'now',
      doneFlag: 'Shippable here',
      caption:
        'Each point is a day of the rebuild; the line is cumulative commits. The marked point is where the site was already complete and presentable. Everything after it is six additional feature phases.',
    },
    stats: {
      hours: 'Hours invested',
      commits: 'Rebuild commits',
      phases: 'Feature phases',
      voices: 'Writing voices',
      lines: 'Lines of code',
      threejs: 'Three.js (removed)',
    },
    ledger: {
      intro:
        'The harder engineering decision was not what to add — it was what to remove. Here is what shipped, and what I built and then cut on purpose.',
      built: 'Shipped',
      cut: 'Cut, and why',
    },
    phases: {
      voice: { title: 'Multi-voice system', why: 'A full i18next layer; the entire site re-skins through five writing voices, architected to scale to fifteen.' },
      marginalia: { title: 'Marginalia', why: 'Hover a phrase to reveal the underlying engineering fact in a footnote.' },
      sky: { title: 'Time-aware theme', why: 'Five theme modes resolved from your local time via SunCalc — no geolocation permission required.' },
      sound: { title: 'Sound design', why: 'A Web Audio cue system (synthesized, zero asset weight); default-on, muted under reduced-motion.' },
      recap: { title: 'Session recap', why: 'A client-side panel that reads device + connection details and maps your location — nothing stored or sent.' },
      eggs: { title: 'Hidden voices', why: 'Type a trigger word to unlock additional personality voices, each fully written.' },
    },
    cuts: {
      statusLine: { title: 'Location/moon status line', why: 'Built and reviewed, then removed — it felt invasive, and the time-based theme already delivered the effect.' },
      battery: { title: 'Battery readout', why: 'Removed because the Battery Status API returns inaccurate values on some platforms; unreliable data has no place in a "reads your device" panel.' },
      drone: { title: 'Ambient drone audio', why: 'Cut for being harsh; sparse, intentional cues work better than a continuous background bed.' },
      rgbOverlay: { title: 'Full-screen glitch overlay', why: 'Replaced with a subtler per-text scramble on voice change — the original effect was too loud.' },
    },
    eggs: {
      title: 'Things you might miss',
      intro: 'A lot of the interaction here is intentionally quiet. Here’s where to find it.',
      astrolabe: {
        title: 'Cursor-tracked needle',
        how: 'Move your cursor over the hero astrolabe — the needle tracks your pointer, and a gear sound spins at the exact speed you move it.',
      },
      spin: {
        title: 'Spin the needle',
        how: 'Click the spin button on the astrolabe’s edge to flick the needle — it speeds up and slows to a stop with real momentum physics.',
      },
      sound: {
        title: 'Synthesized sound',
        how: 'All audio is generated live in the browser (Web Audio, zero bytes). Toggle it with the speaker control, bottom-right; you’ll hear it on theme changes, form sends, and more.',
      },
      sky: {
        title: 'Five themes',
        how: 'The control at top-right offers five skies, including “auto”, which picks dawn/day/dusk/night from your local time.',
      },
      voices: {
        title: 'Alternate voices',
        how: 'Every line of copy can switch personality. Open the Voice Hall with ⇧⌘V; locked voices unlock when you type their secret word on the page.',
      },
      map: {
        title: 'Command map',
        how: 'Press ⌘K (Ctrl+K) to open a searchable map of every section.',
      },
      raven: {
        title: 'Raven on send',
        how: 'Submit the contact form and a flock of birds animates across the screen with a sound cue.',
      },
      recap: {
        title: 'Visitor readout',
        how: 'At the bottom of the contact section, a panel reads your device, screen, and connection (and your city, if you allow it) and generates a unique sigil.',
      },
    },
    builtWith: 'Built with',
    manifesto: [
      'I build production web applications for a living — finance, healthcare, logistics, the systems people rely on. This site is the one place I answered only to the craft.',
      'The goal I set: a hiring manager should feel the quality within ten seconds. Every section had to be a designed moment, not a static list — and if a part was static, it was not finished.',
      'So I kept going past "done". Not because it was required, but because that is how I work, and I wanted that to be visible.',
    ],
    sign: '— Manan Upadhyay',
  },

  voice: {
    openHall: 'Browse all voices',
    hallTeaserSome: '{{count}} hidden voices to find',
    hallTeaserAll: 'All voices unlocked',
    note: 'Tip: you can change the writing voice — try Plainspoken, or find the hidden ones.',
  },

  footer: {
    quote: '“The journey is the reward.”',
    atelierLink: 'The making-of — how this site was built',
  },

  makingOf: {
    back: 'Back to the portfolio',
  },
};
