import {
  mobile,
  backend,
  creator,
  web,
  typescript,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  nextjs,
  reactQuery,
  highcharts,
  expressjs,
  expressjsDark,
  nestjs,
  nestjsDark,
  postgresql,
  firebase,
  jwt,
  pipeline,
  launchdarkly,
  cloudflare,
  cypress,
  splunk,
  jira,
} from '../assets';

// Personal Information
export const personalInfo = {
  name: 'Manan Upadhyay',
  title: 'Full Stack Developer | React.js, Next.js, Node.js, TypeScript',
  email: 'upadhyaymanan01@gmail.com',
  phone: '+91 9173949408',
  location: 'Ahmedabad, India',
  linkedin: 'https://www.linkedin.com/in/manan-upadhyay',
  github: 'https://github.com/manan-upadhyay',
  resumeLink: '/resume.pdf',
  bio: `Full Stack Developer with 5+ years of experience building production web applications using React.js, Next.js, Node.js, TypeScript, Express.js, MongoDB, and PostgreSQL. Experienced across finance, healthcare, logistics, CRM/ERP, SaaS, media-heavy, and visualization-driven platforms. Strong in frontend architecture, performance optimization, API integration, authentication/RBAC, reusable UI systems, and end-to-end feature ownership.`,
  taglines: [
    'Production-Grade Web Platforms',
    'Scalable Full Stack Architecture',
    'Frontend Performance & Craft',
    'End-to-End Feature Ownership',
  ],
  // Hero narrative copy (heroLead / heroPhrases / heroHook) now lives in the
  // Voice bundles — src/i18n/bundles/* (key group `hero`).
  coordinates: '23.02°N 72.57°E',
};

// The Summon (chapter 05) — contact COPY now lives in the Voice bundles
// (src/i18n/bundles/*, key group `contact`). This holds only the non-copy data:
// the download filename and the contact channels (icons are mapped by `key` in
// the component; channel labels are translated via `contact.channels.<key>`).
export const summon = {
  resumeFileName: 'Manan_Upadhyay_Resume.pdf',
  channels: [
    { key: 'email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { key: 'linkedin', value: 'in/manan-upadhyay', href: personalInfo.linkedin },
    { key: 'github', value: 'manan-upadhyay', href: personalInfo.github },
    { key: 'location', value: `${personalInfo.location} · 23.02°N 72.57°E`, href: null },
  ],
};

// Chronicle chapters — THE single source of truth for section navigation DATA.
// Consumed by: the SideRail nav, the Hero eyebrow, and the Map overlay
// (`x`/`y` = pin position on the 0–100 map plate, `kw` = search keywords).
// Keyed by section `id`; order = story order. The voice-bearing `label` and
// `sub` (section titles) now live in the Voice bundles — translate them with
// `t('chapters.<id>.label')` / `t('chapters.<id>.sub')`.
export const chapters = {
  origin:   { no: '00', x: 12, y: 70, kw: 'home top start intro beginning hero' },
  about:    { no: '01', x: 26, y: 30, kw: 'about bio craft who disciplines story' },
  work:     { no: '02', x: 41, y: 58, kw: 'experience journey career timeline history work roles' },
  arsenal:  { no: '03', x: 57, y: 24, kw: 'skills tech stack tools technologies frameworks react node' },
  projects: { no: '04', x: 73, y: 52, kw: 'projects realms portfolio work case studies builds' },
  contact:  { no: '05', x: 89, y: 28, kw: 'contact email hire summon reach available raven' },
};

// Ordered array with `id` injected — for iteration (SideRail rows, Map pins).
export const chapterList = Object.entries(chapters).map(([id, c]) => ({ id, ...c }));

const services = [
  {
    title: 'Frontend Architecture',
    description: 'Production-grade UIs with React.js, Next.js, TypeScript, and reusable component systems',
    icon: web,
    iconKey: 'frontend',
  },
  {
    title: 'Backend Development',
    description: 'Scalable APIs with Node.js, Express.js, NestJS, REST, JWT/OAuth, and RBAC',
    icon: backend,
    iconKey: 'backend',
  },
  {
    title: 'Performance Optimization',
    description: 'Code-splitting, caching, CDN strategies, lazy loading, and Core Web Vitals tuning',
    icon: mobile,
    iconKey: 'performance',
  },
  {
    title: 'Full Stack Delivery',
    description: 'End-to-end ownership from requirement grooming to production monitoring',
    icon: creator,
    iconKey: 'fullstack',
  },
];

// The Craft (chapter 01) — narrative copy (pullQuote, intro, principles, the
// "Scribe's Note" / "Disciplines" headings) now lives in the Voice bundles
// (src/i18n/bundles/*, key group `about`).

// The Arsenal — single source of truth for skills.
// No proficiency percentages (intentionally — senior signal). `tier: 'primary'`
// marks the core stack rendered larger as "primary armaments".
export const skillCategories = [
  {
    category: 'Frontend',
    blurb: 'Production UIs & frontend architecture',
    skills: [
      { name: 'React.js', tier: 'primary', icon: reactjs },
      { name: 'Next.js', tier: 'primary', icon: nextjs },
      { name: 'TypeScript', tier: 'primary', icon: typescript },
      { name: 'Tailwind CSS', icon: tailwind },
      { name: 'Redux / RTK', icon: redux },
      { name: 'React Query', icon: reactQuery },
      { name: 'Highcharts / Recharts', icon: highcharts },
    ],
  },
  {
    category: 'Backend',
    blurb: 'APIs, auth & data',
    skills: [
      { name: 'Node.js', tier: 'primary', icon: nodejs },
      { name: 'Express.js', tier: 'primary', icon: expressjs, iconDark: expressjsDark },
      { name: 'NestJS', icon: nestjs, iconDark: nestjsDark },
      { name: 'MongoDB', icon: mongodb },
      { name: 'PostgreSQL', icon: postgresql },
      { name: 'Firebase', icon: firebase },
      { name: 'JWT / OAuth / RBAC', icon: jwt },
    ],
  },
  {
    category: 'DevOps & Craft',
    blurb: 'Ship, observe & optimize',
    skills: [
      { name: 'Git / GitHub', icon: git },
      { name: 'Docker', icon: docker },
      { name: 'CI/CD · Harness', icon: pipeline },
      { name: 'LaunchDarkly', icon: launchdarkly },
      { name: 'Cloudflare R2 / CDN', icon: cloudflare },
      { name: 'Cypress / Storybook', icon: cypress },
      { name: 'Splunk', icon: splunk },
      { name: 'Jira / Confluence', icon: jira },
    ],
  },
];

const experiences = [
  {
    title: 'Full Stack Developer',
    company_name: 'Inexture Solutions',
    icon: backend,
    iconBg: '#1E293B',
    date: 'January 2022 – Present',
    points: [
      'Delivered production-grade web applications across finance, healthcare, logistics, CRM/ERP, SaaS, media-heavy, and visualization-driven platforms using React.js, Next.js, Node.js, Express.js, NestJS, MongoDB, and PostgreSQL.',
      'Built end-to-end frontend features from requirement grooming and task breakdown to implementation, API integration, QA support, release validation, and production monitoring.',
      'Developed secure authentication and authorization flows using JWT/OAuth, Okta, Auth.js, RBAC, middleware-based access control, and dynamic user access conditions.',
      'Improved frontend performance through code splitting, lazy loading, caching, image/video optimization, CDN usage, React Query caching, and reusable component architecture.',
      'Worked with feature flags, CI/CD, observability, and deployment-support tooling including LaunchDarkly, Harness, Docker, Helm, AWS Parameter Store, and Splunk.',
      'Mentored junior developers through code reviews, reusable patterns, debugging support, and implementation guidance.',
    ],
    technologies: ['React.js', 'Next.js', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'Okta', 'LaunchDarkly'],
  },
  {
    title: 'Frontend Developer',
    company_name: 'Horizon Tour and Travels',
    icon: web,
    iconBg: '#334155',
    date: 'May 2021 – December 2021',
    points: [
      'Developed CRM modules and responsive React UI components for customer, lead, and sales workflows.',
      'Implemented PDF and Excel exports for reporting, reducing manual data work by 16–20 hours per week.',
      'Optimized client-side rendering and UI performance, reducing initial load time by 38%.',
      'Participated in client demos, requirement discussions, and feedback cycles to improve feature acceptance and delivery speed.',
    ],
    technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  },
];

// The Journey — curated waypoints for the pinned horizontal path (chapter 02).
// Résumé-accurate but trimmed for impact. `kind`: work | edu | cta.
// The voice-bearing `chapter` title + `headline` live in the Voice bundles,
// keyed by `id`: t(`experience.journey.<id>.chapter` / `.headline`).
export const journey = [
  {
    id: 'first-trail',
    year: '2021',
    role: 'Frontend Developer',
    org: 'Horizon Tour & Travels',
    points: [
      'Built CRM modules & responsive React UIs for sales workflows.',
      'Shipped PDF/Excel reporting — saved 16–20 hrs/week.',
      'Cut initial load time by 38%.',
    ],
    tech: ['React', 'Redux', 'Strapi', 'Prisma', 'PostgreSQL'],
    kind: 'work',
  },
  {
    id: 'oath',
    year: '2022',
    role: 'B.E. Information Technology',
    org: 'Gujarat Technological University',
    points: ['Engineering degree in Information Technology.'],
    tech: [],
    kind: 'edu',
  },
  {
    id: 'expedition',
    year: '2022 — Now',
    role: 'Full Stack Developer',
    org: 'Inexture Solutions',
    points: [
      'Delivered apps across finance, health, logistics, CRM, SaaS & media.',
      'Owned features end to end — grooming to production monitoring.',
      'Secured apps (JWT/OAuth, Okta, RBAC) and tuned performance.',
    ],
    tech: ['Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'MongoDB', 'Auth'],
    kind: 'work',
    current: true,
  },
  {
    id: 'horizon',
    year: 'Now',
    role: 'Open to the next quest',
    org: 'Available for senior roles',
    points: [],
    tech: [],
    kind: 'cta',
  },
];

// Featured realms — ordered to lead with live, clickable proof, then close on
// enterprise credibility (Capital Group, NDA). Order here IS the Realm I..IV
// order rendered in The Realms section.
const featuredProjects = [
  {
    name: 'Gajaakriti Studio',
    company: 'Luxury Wedding Photography & Films',
    isFeatured: true,
    description:
      'Dynamic media-heavy website and admin panel for a premium Ahmedabad-based wedding photography and films studio with optimized media delivery.',
    tags: [
      { name: 'next.js' },
      { name: 'firebase' },
      { name: 'cloudflare-r2' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: 'https://gajaakriti.com/',
    isNDA: false,
    // Realm screenshots in display order. Lives under public/realms/<slug>/.
    // `themed: true` swaps to public/realms/<slug>/<light|dark>/ per theme.
    gallery: {
      slug: 'gajaakriti',
      images: [
        'gajaakriti-hero.png',
        'gajaakriti-landing-1.png',
        'gajaakriti-landing-2.png',
        'gajaakriti-landing-3.png',
        'gajaakriti-menu.png',
        'gajaakriti-portfolios.png',
        'gajaakriti-blogs.png',
        'gajaakriti-inquire.png',
      ],
    },
    highlights: [
      'Built a modern Next.js website with dynamic landing pages, portfolio, blogs, testimonials, and admin panel',
      'Improved performance through caching, CDN strategy, Cloudflare R2, and video streaming optimization',
      'Implemented Firebase Auth and Firestore for authentication, user management, and content mapping',
      'Built Bash scripts to batch-compress images and videos, reducing hosting costs while maintaining quality',
    ],
  },
  {
    name: 'Royal Tiles Playground',
    company: 'Custom Tile Visualization Tool',
    isFeatured: true,
    description:
      'Interactive tile design and ordering tool where users select layouts, tile designs, fills, preview results live, and download order-ready PDF templates.',
    tags: [
      { name: 'react' },
      { name: 'tensorflow.js' },
      { name: 'svg' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: 'https://florra.tatkrit.com/login',
    live_demo_label: 'Visit platform',
    isNDA: false,
    gallery: {
      slug: 'royal-tiles',
      themed: true,
      images: [
        'royal-tiles-dashboard.png',
        'royal-tiles-fill-patterns.png',
        'royal-tiles-floor-grid-list.png',
        'royal-tiles-floor-grid-tool.png',
        'royal-tiles-tile-design-list.png',
        'royal-tiles-regionizer.png',
        'royal-tiles-user-panel-editor.png',
        'royal-tiles-user-panel-projects.png',
      ],
    },
    highlights: [
      'Built a custom floor visualization tool with live preview and downloadable PDF templates',
      'Programmatically rendered dynamic tile variants — corners, fills, grid patterns',
      'Built TensorFlow.js image-processing workflow to convert PNGs into region-based SVGs',
      'Developed an admin panel for managing tile designs, floor layouts, and configurations',
      'Added product tours, help drawers, and shortcut-key interactions for usability',
    ],
  },
  {
    name: 'Advisor Portfolio Snapshot',
    company: 'Capital Group (USA)',
    isFeatured: true,
    description:
      'Advisor-facing portfolio analysis platform built from scratch with Next.js, Okta authentication, Highcharts data visualization, and enterprise deployment tooling.',
    tags: [
      { name: 'next.js' },
      { name: 'okta' },
      { name: 'highcharts' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
    highlights: [
      'Built the frontend application from scratch — system design, reusable UI, route protection, API integration, sprint-wise delivery',
      'Integrated Okta OAuth with Auth.js and server-side middleware authorization logic',
      'Built portfolio analysis views with data tables and Highcharts for interactive digital reports',
      'Integrated LaunchDarkly feature flags, Harness deployments, and Splunk debugging',
      'Contributed to a Spring Boot backend for server-side PDF report generation',
    ],
  },
];

// Other projects — real projects from current website
const otherProjects = [
  {
    name: 'Digital Investor Portfolio',
    company: 'Capital Group (USA)',
    isFeatured: false,
    description:
      'Digital investment platform with rich user interactions, analytics tracking, and feature modules across frontend and backend.',
    tags: [
      { name: 'react' },
      { name: 'next.js' },
      { name: 'node.js' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
    highlights: [
      'Delivered React/Next.js feature modules and integrated Adobe Analytics tracking',
      'Supported Node/Express REST API integrations, error handling, and performance improvements',
      'Implemented React Query for server-state management, reducing redundant API calls',
    ],
  },
  {
    name: 'Srifin Credit',
    company: 'Microfinance CRM/ERP',
    isFeatured: false,
    description:
      'Full-stack CRM/ERP for managing financial data, workflows, and identity verification with secure RBAC.',
    tags: [
      { name: 'next.js' },
      { name: 'node.js' },
      { name: 'rbac' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
    highlights: [
      'Engineered RBAC and audit logs for compliance',
      'Accelerated onboarding by 20-25% with verification APIs',
      'Led image optimization improving Core Web Vitals',
    ],
  },
  {
    name: 'Xipper',
    company: 'Hotel Management Platform',
    isFeatured: false,
    description:
      'Multi-tenant hotel management platform with role-based operations, eKYC, booking, services, and billing.',
    tags: [
      { name: 'postgresql' },
      { name: 'next.js' },
      { name: 'multi-tenant' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
    highlights: [
      'Designed multi-tenant PostgreSQL models and REST APIs',
      'Cut manual billing adjustments by 30-35%',
      'Accelerated checkout speed by 15-20%',
    ],
  },
  {
    name: 'AI Chatbot Platform',
    company: 'Client Project',
    isFeatured: false,
    description:
      'Context-aware chatbot UI with real-time interactions using WebSocket and comprehensive end-to-end testing.',
    tags: [
      { name: 'next.js' },
      { name: 'websocket' },
      { name: 'redux' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
    highlights: [
      'Led UI architecture with Next.js/Redux and WebSocket',
      'Adopted Storybook and Cypress for testing',
      'Decreased regressions by 25-30%',
    ],
  },
  {
    name: 'Fantasy Cricket Platform',
    company: 'Personal Project',
    isFeatured: false,
    description:
      'Real-money fantasy platform with live match syncing, secure payouts, and admin back-office operations.',
    tags: [
      { name: 'mongodb' },
      { name: 'node.js' },
      { name: 'express' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
    highlights: [
      'Built cron pipelines for live match states',
      'Reduced admin intervention by 1.5-2 hours per match',
      'Achieved 99% transaction reliability',
    ],
  },
];

// Combine all projects — featured first
const projects = [...featuredProjects, ...otherProjects];

// Stats to showcase achievements
export const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '20+', label: 'Projects Delivered' },
  { value: '6+', label: 'Industry Domains' },
  { value: '38%', label: 'Faster Load Times' },
];

// Education
export const education = {
  degree: 'Bachelor of Engineering in Information Technology',
  university: 'Gujarat Technological University',
  year: '2022',
  cgpa: '8.36/10',
};

export { services, experiences, projects, featuredProjects, otherProjects };
