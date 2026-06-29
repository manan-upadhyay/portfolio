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
    spin: 'Give it a whirl',
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
    onAssignment: 'On loan (big deal)',
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
        points: [
          'Got an engineering degree in IT. Framed it. Looked at it. Still proud.',
          'Then got a LAW degree too — LL.B., three years, from HNGU — and passed the bar (AIBE). I am basically a lawyer. Don’t sue me, I’ll sue back.',
        ],
      },
      expedition: {
        chapter: 'The Big Leagues',
        headline: 'Six industries. Production-grade. End to end. Boom — roasted.',
        role: 'Full Stack Developer',
        points: [
          'Won the first-ever Employee of the Month. Month one. Out of 30 people. Undefeated.',
          'Delivered apps across finance, health, logistics, CRM, SaaS and media.',
          'Owned features end to end — meeting to monitoring, no babysitting required.',
        ],
      },
      vanguard: {
        chapter: 'The Big Account',
        headline: 'Running point on the Capital Group account. Huge client. Huge.',
        role: 'Lead Frontend Developer',
        org: 'Infosys · for Capital Group',
        via: 'Okay so technically I work for Inexture, who loaned me to Infosys, who put me on Capital Group. It’s a whole thing. I’m basically a free agent. A people person who happens to be a free agent.',
        points: [
          'Led frontend on multiple Capital Group products. They needed a leader. Hello.',
          'Shipped 4 production releases. Built features from scratch. From NOTHING.',
          'Ran sprint planning, client demos, code reviews. Meetings, basically. I love meetings.',
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
    nod: 'Six hits up there. The seventh one is the website you’re looking at. Boom.',
    nodCta: 'Take the behind-the-scenes tour',
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
    submitIdle: 'Send it! Send it! Send it!',
    submitLoading: 'Sending…',
    status: {
      idle: 'I’m right here. Waiting. Patiently. Mostly.',
      sending: 'Okay here it goes, here it goes…',
    },
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
    subtitle: 'I pulled all this off your computer and your internet. I’m basically a hacker now. Don’t tell IT.',
    how: 'Okay one website told me your city. That’s it. I didn’t save it. I would never. Probably.',
    sigilNote: 'This little doodle? That’s YOU. One of a kind. Like me. I made it right here, didn’t send it anywhere.',
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
    signal: {
      title: 'Your Internet & Stuff',
      lantern: 'Your Battery',
      road: 'Your Wi-Fi Speed',
      carrier: 'Your Internet Guy',
      origin: 'Your Secret Number',
    },
    journey: {
      timeAfield: 'Time You Hung Out',
      trail: 'Scrollage',
      visit: 'Times You Came Back',
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

  // The Atelier — Michael's voice. Narrative keys only; the per-phase/per-cut
  // details fall back to chronicle's real facts (still Manan's substance).
  atelier: {
    eyebrow: 'Behind the Magic',
    title: 'How I Made This',
    confession: 'It passed every test but mine. And mine is the hard one.',
    confessionSub:
      'The website was totally finished like twenty saves ago. It was great. It was done. I could’ve left. But “done” is what other people settle for, and I am not other people — I’m an idea man with an eye for detail, which is two things. So I stayed and poured in another hundred and fifty hours fixing stuff nobody would ever notice, because I notice. That’s my gift. And, occasionally, my curse. Mostly gift.',
    reel: {
      title: 'The Director’s Cut',
      range: 'Jun 20 – 28 · 9 scenes',
      caption:
        'Grab the slider, click a scene, hit the arrow keys. Take your time. It’s art.',
      scene: 'Scene',
      commits: 'saves',
      hint: 'drag it · click a scene · ← → to step',
      aria: 'The movie of me building this',
      prev: 'Previous scene',
      next: 'Next scene',
      scenes: {
        foundation: { title: 'The Cold Open', blurb: 'A starfield and a hand-drawn compass thing for the top of the page. No pictures. I drew it with CODE. Boom.' },
        canon: { title: 'Setting the Stage', blurb: 'The chapters, the little side menu, and all the smooth scrolling. The skeleton. Every great show has good bones.' },
        realms: { title: 'My Greatest Hits', blurb: 'The fancy project cards, plus a search map you open with ⌘K. Like Google, but it’s all me.' },
        journey: { title: 'The Origin Story', blurb: 'A sideways-scrolling timeline of my career and a spinny field of all my skills. There are a lot of skills.' },
        voice: { title: 'The Other Mes', blurb: 'The whole site can talk in five different voices. Including this one. Especially this one.' },
        sky: { title: 'Lights & Sound', blurb: 'Five skies that know what time it is, and little sounds the computer makes itself. No downloads. Magic.' },
        recap: { title: 'The Creepy Part', blurb: 'A little panel that reads your computer and your city. I’m basically the NSA. A friendly NSA.' },
        atelier: { title: 'Behind the Magic', blurb: 'This whole making-of page, the voice menu, the spinny compass, and a flock of birds when you message me.' },
        polish: { title: 'The Final Cut', blurb: 'Making it work for everybody, making it fast, and hooking up the actual email. The boring important stuff.' },
      },
    },
    stats: {
      hours: 'Hours of me',
      commits: 'Times I saved',
      phases: 'Genius phases',
      voices: 'Voices (incl. mine)',
      lines: 'Lines, baby',
    },
    ledger: {
      intro:
        'The hard part isn’t adding stuff. Anybody can add stuff. The hard part is knowing what to cut. I know what to cut. I’m basically a surgeon.',
      built: 'Stuff I shipped',
      cut: 'Stuff I cut (on purpose)',
    },
    eggs: {
      title: 'Secret Stuff I Added',
      intro: 'I put a bunch of cool things in here that nobody notices. That ends today. Boom — here they are.',
      astrolabe: {
        title: 'The Spinny Compass',
        how: 'Wave your mouse over the big compass thing up top. It follows you. Like a loyal employee. And it makes a little gear noise. I did that.',
      },
      spin: {
        title: 'Give It a Whirl',
        how: 'See the little button on the compass? Push it. The needle spins like a fidget spinner and slows down all by itself. Physics. I’m basically a scientist.',
      },
      sound: {
        title: 'The Sounds',
        how: 'Every beep and whoosh here? Made by a computer, live, zero downloads. Hit the speaker button, bottom right. Then change the theme and listen. You’re welcome.',
      },
      sky: {
        title: 'The Sky Button',
        how: 'Top right. Five skies. One of them is “auto” and it knows what time it is where you are. Creepy? A little. Cool? Extremely.',
      },
      voices: {
        title: 'The Other Mes',
        how: 'The whole site can talk in different voices. Hit ⇧⌘V. Some are locked — type the magic word to unlock them. Hint: type “boss”. Trust me on this one.',
      },
      map: {
        title: 'The Map Thing',
        how: 'Press ⌘K. A map pops up. You can search it. It’s like Google Maps, but for me.',
      },
      raven: {
        title: 'The Birds',
        how: 'Send me a message and a whole flock of birds flies across the screen. With a sound. It’s very dramatic. I love it.',
      },
      recap: {
        title: 'The Creepy Part',
        how: 'Scroll to the bottom of the contact part. It reads your computer, your screen, even your city. I’m basically the NSA. A friendly NSA.',
      },
    },
    offmap: {
      title: 'The Real Me (Get Comfortable)',
      intro: 'There are three sides to me. Minimum. Pick one and click — I’ll tell you everything.',
    },
    personas: {
      more: 'Tell me more',
      less: 'Okay, enough',
      storyteller: {
        label: 'The Storyteller',
        hook: 'I basically live inside stories.',
        story: 'Lord of the Rings. Game of Thrones. Every superhero ever. A truly upsetting amount of One Piece. I look at software and I see a saga — that’s not weird, that’s vision. It’s also why this whole site is a story and not a boring list.',
      },
      filmmaker: {
        label: 'The Filmmaker',
        hook: 'I’m also a filmmaker. A real one.',
        story: 'I’ve shot actual cinematic videos — cafés, weddings, short films. So when this site moves, that’s not luck, that’s an artist with an eye. People pay for this eye.',
      },
      wanderer: {
        label: 'The Wanderer',
        hook: 'And then I vanish into the mountains.',
        story: 'No phone, no signal, just me and the trees and my thoughts, which are excellent. It keeps me grounded. And a grounded genius is the most dangerous kind of genius.',
      },
    },
    builtWith: 'Made with',
    manifesto: [
      'Okay, real talk: this isn’t about impressing anybody. I didn’t build it for a boss. I built it because I have this thing where I cannot leave “normal” alone — I have to try the idea nobody tried, push the button nobody pushed, use the tech I haven’t used yet. The website was just my excuse.',
      'I love this stuff. The code, the puzzles, the moment a giant tangled mess finally goes “click” — I chase the problems that are way too big for me, the ones that scare me a little, because that’s where it gets fun. Fear is just fun wearing a tie.',
      'But underneath the showmanship? I’m dead serious about four things: owning my mistakes, clients who are thrilled they picked me, work that actually holds up, and details. So many details. Everything else up there is just me proving it. Boom.',
    ],
    sign: '— Michael. I mean, Manan. (It’s Manan.)',
  },

  voiceHall: {
    title: 'The Improv Stage',
    subtitle: 'Pick who narrates this whole thing. I do all the voices myself. I’m basically a chameleon, but for talking.',
    searchPlaceholder: 'Search for a voice…  try “the office”, “boss”, “moo”',
    nowNarrating: 'Currently me',
    tryHint: 'Click a voice and — BOOM — the whole site starts talking like them. Even this part right here. Especially this part.',
    close: 'Close (but don’t go)',
    noResult: 'Nobody here by that name. And I know everybody. I’m a people person.',
    sealedHint: 'Some voices are sealed, like a surprise party. Type the secret word anywhere on the page and they wake up. Surprise.',
    found: '{{count}}/{{total}} secret voices found',
    footerHint: 'enter to speak · esc to close',
    categories: {
      core: 'The Professionals',
      office: 'The Office',
      bestiary: 'The Animal Kingdom',
    },
    request: {
      section: 'Summon',
      cta: 'Summon a new voice',
      ctaSub: 'Want somebody else to narrate this? Tell me who. I will make it happen. I am a people person AND a closer.',
      back: 'Back',
      persona: 'Whose voice?',
      personaPlaceholder: 'Michael Scott (again) · a celebrity · me, but louder…',
      email: 'Your email',
      emailPlaceholder: 'your email — so I can personally reach out, like a friend',
      note: 'Why them?',
      notePlaceholder: 'make your case (I love a good pitch)',
      send: 'Send it. Boom.',
      sending: 'Summoning…',
      done: 'Boom. Sent.',
      doneSub: 'I’ll give “{{persona}}” some real thought. No promises. Okay, a small promise. Thank you, friend.',
      error: 'Okay, that did not work. Check the name and the email. It’s gonna be fine. We’re a family.',
    },
  },

  voice: {
    menuSub: 'Who tells this story? Me, ideally. I’m great at stories.',
    more: '{{count}} more voices. Like a party. In here.',
  },

  footer: {
    quote: '“That’s what she said.”',
    atelierLink: 'The making-of. Behind the scenes. Pretty much a documentary.',
  },

  makingOf: {
    back: 'Okay, back to the good stuff',
  },
};
