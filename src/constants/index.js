import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  nextjs,
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
    'Building Production-Grade Web Platforms',
    'Architecting Scalable Full Stack Solutions',
    'Frontend Architecture & Performance',
    'End-to-End Feature Ownership',
  ],
};

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'work',
    title: 'Work',
  },
  {
    id: 'projects',
    title: 'Projects',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
];

const services = [
  {
    title: 'Frontend Architecture',
    description: 'Production-grade UIs with React.js, Next.js, TypeScript, and reusable component systems',
    icon: web,
  },
  {
    title: 'Backend Development',
    description: 'Scalable APIs with Node.js, Express.js, NestJS, REST, JWT/OAuth, and RBAC',
    icon: backend,
  },
  {
    title: 'Performance Optimization',
    description: 'Code-splitting, caching, CDN strategies, lazy loading, and Core Web Vitals tuning',
    icon: mobile,
  },
  {
    title: 'Full Stack Delivery',
    description: 'End-to-end ownership from requirement grooming to production monitoring',
    icon: creator,
  },
];

const technologies = [
  { name: 'TypeScript', icon: typescript },
  { name: 'JavaScript', icon: javascript },
  { name: 'React.js', icon: reactjs },
  { name: 'Next.js', icon: nextjs },
  { name: 'Node.js', icon: nodejs },
  { name: 'Redux Toolkit', icon: redux },
  { name: 'Tailwind CSS', icon: tailwind },
  { name: 'MongoDB', icon: mongodb },
  { name: 'Git', icon: git },
  { name: 'HTML5', icon: html },
  { name: 'CSS3', icon: css },
  { name: 'Docker', icon: docker },
];

// Additional skills for the skills section
export const skillCategories = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React.js', level: 95 },
      { name: 'Next.js', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 93 },
      { name: 'Redux / RTK', level: 88 },
      { name: 'ShadCN / Material UI', level: 85 },
      { name: 'Highcharts / Recharts', level: 82 },
      { name: 'React Query', level: 88 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 90 },
      { name: 'NestJS', level: 85 },
      { name: 'REST APIs', level: 95 },
      { name: 'MongoDB', level: 88 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'Firebase', level: 85 },
      { name: 'WebSocket', level: 78 },
    ],
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'Git / GitHub', level: 95 },
      { name: 'Docker', level: 75 },
      { name: 'CI/CD (Harness)', level: 78 },
      { name: 'Jira / Confluence', level: 92 },
      { name: 'Cypress / Storybook', level: 80 },
      { name: 'Splunk', level: 72 },
      { name: 'LaunchDarkly', level: 80 },
      { name: 'Cloudflare R2 / CDN', level: 78 },
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

// Featured projects — from the strong resume
const featuredProjects = [
  {
    name: 'Advisor Portfolio Snapshot',
    company: 'Capital Group (USA)',
    isFeatured: true,
    description:
      'Advisor-facing portfolio analysis platform built from scratch with Next.js, Okta authentication, Highcharts data visualization, and enterprise deployment tooling.',
    tags: [
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'okta', color: 'green-text-gradient' },
      { name: 'highcharts', color: 'pink-text-gradient' },
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
  {
    name: 'Gajaakriti Studio',
    company: 'Luxury Wedding Photography & Films',
    isFeatured: true,
    description:
      'Dynamic media-heavy website and admin panel for a premium Ahmedabad-based wedding photography and films studio with optimized media delivery.',
    tags: [
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'firebase', color: 'green-text-gradient' },
      { name: 'cloudflare-r2', color: 'pink-text-gradient' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
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
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'tensorflow.js', color: 'green-text-gradient' },
      { name: 'svg', color: 'pink-text-gradient' },
    ],
    image: '',
    source_code_link: '',
    live_demo_link: '',
    isNDA: false,
    highlights: [
      'Built a custom floor visualization tool with live preview and downloadable PDF templates',
      'Programmatically rendered dynamic tile variants — corners, fills, grid patterns',
      'Built TensorFlow.js image-processing workflow to convert PNGs into region-based SVGs',
      'Developed an admin panel for managing tile designs, floor layouts, and configurations',
      'Added product tours, help drawers, and shortcut-key interactions for usability',
    ],
  },
  {
    name: 'Digital Investor Portfolio',
    company: 'Capital Group (USA)',
    isFeatured: true,
    description:
      'Digital investment platform with rich user interactions, analytics tracking, and feature modules across frontend and backend.',
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'next.js', color: 'green-text-gradient' },
      { name: 'node.js', color: 'pink-text-gradient' },
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
];

// Other projects — real projects from current website
const otherProjects = [
  {
    name: 'Srifin Credit',
    company: 'Microfinance CRM/ERP',
    isFeatured: false,
    description:
      'Full-stack CRM/ERP for managing financial data, workflows, and identity verification with secure RBAC.',
    tags: [
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'node.js', color: 'green-text-gradient' },
      { name: 'rbac', color: 'pink-text-gradient' },
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
      { name: 'postgresql', color: 'blue-text-gradient' },
      { name: 'next.js', color: 'green-text-gradient' },
      { name: 'multi-tenant', color: 'pink-text-gradient' },
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
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'websocket', color: 'green-text-gradient' },
      { name: 'redux', color: 'pink-text-gradient' },
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
      { name: 'mongodb', color: 'blue-text-gradient' },
      { name: 'node.js', color: 'green-text-gradient' },
      { name: 'express', color: 'pink-text-gradient' },
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

export { services, technologies, experiences, projects, featuredProjects, otherProjects };
