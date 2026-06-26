import {
  backend,
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

// Disciplines (chapter 01). `iconKey` maps to a line icon in the component and
// also keys the copy: t(`about.services.<iconKey>.title` / `.description`).
const services = [
  { iconKey: 'frontend' },
  { iconKey: 'backend' },
  { iconKey: 'performance' },
  { iconKey: 'fullstack' },
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
    title: 'Lead Frontend Developer',
    company_name: 'Infosys (sub-contract) · Capital Group',
    icon: web,
    iconBg: '#1E293B',
    date: 'January 2025 – Present',
    points: [
      'Led frontend development across multiple products within the Capital Group network as a sub-contractor with Infosys.',
      'Shipped 4 production releases, including features architected and built from scratch.',
      'Gained hands-on exposure to Helm charts, Harness pipelines, and AWS.',
      'Drove sprint planning, client demos, backlog grooming, code reviews, and production monitoring.',
    ],
    technologies: ['React.js', 'Next.js', 'Okta', 'Highcharts', 'AWS', 'Helm', 'Harness'],
  },
  {
    title: 'Full Stack Developer',
    company_name: 'Inexture Solutions',
    icon: backend,
    iconBg: '#1E293B',
    date: 'January 2022 – Present',
    points: [
      'Won the first-ever Employee of the Month award — earned in the program’s opening month, among a 30-member team.',
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
// Data only (`id`, `year`, `tech`, `kind`, `current`). The voice-bearing copy —
// `chapter`, `headline`, `role`, `org`, `points` — lives in the Voice bundles,
// keyed by `id`: t(`experience.journey.<id>.<field>`).
export const journey = [
  { id: 'first-trail', year: '2021', tech: ['React', 'Redux', 'Strapi', 'Prisma', 'PostgreSQL'], kind: 'work' },
  { id: 'oath', year: '2022', tech: [], kind: 'edu' },
  { id: 'expedition', year: '2022 — Now', tech: ['Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'MongoDB', 'Auth'], kind: 'work', current: true },
  // `secondment` (not `current`) flags an assignment that branches off the
  // previous waypoint's employer — rendered with a "via" route link + ribbon so
  // it never reads as a second, simultaneous job. See Experience.jsx.
  { id: 'vanguard', year: 'Jan 2025 — Now', tech: ['Next.js', 'Okta', 'AWS', 'Helm', 'Harness'], kind: 'work', secondment: true, secondedTo: 'Infosys' },
  { id: 'horizon', year: 'Now', tech: [], kind: 'cta' },
];

// Featured realms — ordered to lead with live, clickable proof, then close on
// enterprise credibility (Capital Group, NDA). Order here IS the Realm I..IV
// order rendered in The Realms section.
const featuredProjects = [
  {
    id: 'gajaakriti',
    name: 'Gajaakriti Studio',
    company: 'Luxury Wedding Photography & Films',
    isFeatured: true,
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
  },
  {
    id: 'royal-tiles',
    name: 'Royal Tiles Playground',
    company: 'Custom Tile Visualization Tool',
    isFeatured: true,
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
  },
  {
    id: 'advisor-portfolio',
    name: 'Advisor Portfolio Snapshot',
    company: 'Capital Group (USA)',
    isFeatured: true,
    tags: [
      { name: 'next.js' },
      { name: 'okta' },
      { name: 'highcharts' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
  },
];

// Other projects — real projects from current website
const otherProjects = [
  {
    id: 'digital-investor',
    name: 'Digital Investor Portfolio',
    company: 'Capital Group (USA)',
    isFeatured: false,
    tags: [
      { name: 'react' },
      { name: 'next.js' },
      { name: 'node.js' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
  },
  {
    id: 'srifin',
    name: 'Srifin Credit',
    company: 'Microfinance CRM/ERP',
    isFeatured: false,
    tags: [
      { name: 'next.js' },
      { name: 'node.js' },
      { name: 'rbac' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
  },
  {
    id: 'xipper',
    name: 'Xipper',
    company: 'Hotel Management Platform',
    isFeatured: false,
    tags: [
      { name: 'postgresql' },
      { name: 'next.js' },
      { name: 'multi-tenant' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot Platform',
    company: 'Client Project',
    isFeatured: false,
    tags: [
      { name: 'next.js' },
      { name: 'websocket' },
      { name: 'redux' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: true,
  },
  {
    id: 'fantasy-cricket',
    name: 'Fantasy Cricket Platform',
    company: 'Personal Project',
    isFeatured: false,
    tags: [
      { name: 'mongodb' },
      { name: 'node.js' },
      { name: 'express' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
  },
];

// Combine all projects — featured first
const projects = [...featuredProjects, ...otherProjects];

// Stats to showcase achievements. `value` is data; the label is voice-bearing —
// t(`about.stats.<key>`).
export const stats = [
  { value: '5+', key: 'years' },
  { value: '20+', key: 'projects' },
  { value: '6+', key: 'domains' },
  { value: '38%', key: 'load' },
];

// Education
export const education = {
  degree: 'Bachelor of Engineering in Information Technology',
  university: 'Gujarat Technological University',
  year: '2022',
  cgpa: '8.36/10',
  // Secondary credential, kept low-key (not career-related). Surfaced as a quiet
  // second line on the Education ("Oath") waypoint — see experience.journey.oath.
  additional: {
    degree: 'Bachelor of Laws (LL.B.)',
    university: 'Hemchandracharya North Gujarat University (HNGU)',
    year: '2026',
    note: 'Cleared the All India Bar Examination (AIBE), June 2026.',
  },
};

export { services, experiences, projects, featuredProjects, otherProjects };
