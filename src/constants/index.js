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
  title: 'Full Stack Developer | AI-Augmented Engineer',
  email: 'upadhyaymanan01@gmail.com',
  phone: '+91 9173949408',
  location: 'Ahmedabad, India',
  linkedin: 'https://www.linkedin.com/in/manan-upadhyay',
  github: 'https://github.com/manan-upadhyay',
  resumeLink: '/resume.pdf',
  bio: `Full Stack Developer with 4+ years of experience delivering scalable, production-grade web platforms across finance, healthcare, and logistics. Strong expertise in frontend and backend architecture, performance optimization, and AI-augmented development.`,
  taglines: [
    'Building Production-Grade Web Platforms',
    'Architecting Scalable Full Stack Solutions',
    'AI-Augmented Development Expert',
    'Performance Optimization Specialist',
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
    title: 'Full Stack Architecture',
    description: 'End-to-end web applications with React/Next.js and Node.js/Express/NestJS',
    icon: web,
  },
  {
    title: 'Backend Development',
    description: 'Scalable APIs with REST, JWT/OAuth, MongoDB, PostgreSQL',
    icon: backend,
  },
  {
    title: 'AI-Augmented Development',
    description: 'Leveraging GPT-5.2, Claude, Gemini for accelerated delivery',
    icon: creator,
  },
  {
    title: 'Performance Optimization',
    description: 'Code-splitting, caching strategies, Core Web Vitals optimization',
    icon: mobile,
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
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Redux Toolkit', level: 85 },
      { name: 'Framer Motion', level: 80 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 90 },
      { name: 'NestJS', level: 85 },
      { name: 'REST APIs', level: 95 },
      { name: 'MongoDB', level: 85 },
      { name: 'PostgreSQL', level: 80 },
    ],
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'Git/GitHub', level: 95 },
      { name: 'CI/CD', level: 80 },
      { name: 'AWS (Basics)', level: 70 },
      { name: 'Docker', level: 75 },
      { name: 'Jira', level: 90 },
      { name: 'Figma', level: 75 },
    ],
  },
];

const experiences = [
  {
    title: 'Full Stack Developer',
    company_name: 'Inexture Solutions (via Uplers)',
    icon: backend, // Replace with actual company logo
    iconBg: '#1d1836',
    date: 'January 2022 - Present',
    points: [
      'Led end-to-end delivery of modern web applications using React/Next.js and Node/Express/NestJS across finance, healthcare, and logistics domains.',
      'Designed secure RESTful APIs with JWT/OAuth and integrated third-party services and payment gateways.',
      'Leveraged AI agents and prompt engineering to accelerate development workflows, reducing feature delivery time by 30-40%.',
      'Optimized data models in MongoDB and PostgreSQL, improving query performance by 20-25%.',
      'Mentored junior developers via code reviews and pairing, lowering production defects by 15-20%.',
    ],
    technologies: ['React.js', 'Next.js', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'JWT', 'AI Agents'],
  },
  {
    title: 'Frontend Developer',
    company_name: 'Horizon Tour and Travels',
    icon: web, // Replace with actual company logo
    iconBg: '#383E56',
    date: 'May 2021 - December 2021',
    points: [
      'Developed custom CRM modules and responsive UI components using React for customer, lead, and sales workflows.',
      'Implemented PDF and Excel exports for reporting, cutting manual data work by 16-20 hours per week.',
      'Optimized client-side rendering to cut initial load time by 38%, delivering 1.2x faster first meaningful paint.',
      'Translated client requirements into functional UI features, improving stakeholder satisfaction.',
    ],
    technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  },
];

const projects = [
  {
    name: 'Digital Investor Portfolio',
    company: 'Capital Group (USA)',
    description:
      'Digital investment platform with rich user interactions and analytics across frontend and backend modules. Improved page performance by 18-20% and lowered defects by 15-20%.',
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'next.js', color: 'green-text-gradient' },
      { name: 'node.js', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Implemented React Query for server-state management',
      'Used AI agents for feature development and refactoring',
      'Generated and maintained technical documentation',
    ],
  },
  {
    name: 'Klick Health Platform',
    company: 'Klick Health (USA)',
    description:
      'Healthcare platform with performance-optimized, scalable frontend built using Gatsby and React. Cut development time by 25-30% through reusable components.',
    tags: [
      { name: 'gatsby', color: 'blue-text-gradient' },
      { name: 'react', color: 'green-text-gradient' },
      { name: 'performance', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Built reusable components enhancing SEO via static-site optimization',
      'Automated screenshot tooling cutting manual QA by 5-7 hours/week',
      'Applied memoization, lazy loading, code splitting',
    ],
  },
  {
    name: 'Srifin Credit - Microfinance CRM/ERP',
    company: 'Srifin Credit',
    description:
      'Full-stack CRM/ERP for managing financial data, workflows, and identity verification with secure RBAC. Decreased unauthorized access incidents by 100%.',
    tags: [
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'node.js', color: 'green-text-gradient' },
      { name: 'rbac', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Engineered RBAC and audit logs for compliance',
      'Accelerated onboarding by 20-25% with verification APIs',
      'Led image optimization improving Core Web Vitals',
    ],
  },
  {
    name: 'Fantasy Cricket Platform',
    company: 'Personal Project',
    description:
      'Real-money fantasy platform with live match syncing, secure payouts, and admin back-office operations. Achieved 99% transaction reliability.',
    tags: [
      { name: 'mongodb', color: 'blue-text-gradient' },
      { name: 'node.js', color: 'green-text-gradient' },
      { name: 'express', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Built cron pipelines for live match states',
      'Reduced admin intervention by 1.5-2 hours per match',
      'Used AI-assisted analysis for payout edge cases',
    ],
  },
  {
    name: 'Xipper - Hotel Management Platform',
    company: 'Xipper',
    description:
      'Multi-tenant hotel management platform with role-based operations, eKYC, booking, services, and billing. Scaled to 40-60 tenants with consistent data integrity.',
    tags: [
      { name: 'postgresql', color: 'blue-text-gradient' },
      { name: 'next.js', color: 'green-text-gradient' },
      { name: 'multi-tenant', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Designed multi-tenant PostgreSQL models and REST APIs',
      'Cut manual billing adjustments by 30-35%',
      'Accelerated checkout speed by 15-20%',
    ],
  },
  {
    name: 'AI Chatbot Platform',
    company: 'Client Project',
    description:
      'Context-aware chatbot UI with real-time interactions using WebSocket and comprehensive end-to-end testing with 65-70% coverage.',
    tags: [
      { name: 'next.js', color: 'blue-text-gradient' },
      { name: 'websocket', color: 'green-text-gradient' },
      { name: 'redux', color: 'pink-text-gradient' },
    ],
    image: '', // Add project image
    source_code_link: '',
    live_demo_link: '',
    highlights: [
      'Led UI architecture with Next.js/Redux and WebSocket',
      'Adopted Storybook and Cypress for testing',
      'Decreased regressions by 25-30%',
    ],
  },
];

// Stats to showcase achievements
export const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '15+', label: 'Projects Delivered' },
  { value: '30-40%', label: 'Faster Delivery with AI' },
  { value: '99%', label: 'Transaction Reliability' },
];

export { services, technologies, experiences, projects };
