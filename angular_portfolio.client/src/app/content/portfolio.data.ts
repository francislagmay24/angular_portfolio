/**
 * ============================================================================
 *  EDIT ME — this is the single file that holds your portfolio content.
 * ============================================================================
 *
 *  The values below are SAMPLE content so you can see the layout with real
 *  text. Replace every one of them with your own details.
 *
 *  Nothing here is hard-coded into the HTML — the components read from these
 *  objects, so you never have to touch markup to change your content.
 */

export interface SocialLink {
  label: string;
  /** Any icon key understood by styles.css: github | linkedin | mail | blog */
  icon: 'github' | 'linkedin' | 'mail' | 'blog';
  url: string;
}

export interface Project {
  title: string;
  /** One or two sentences: what it does and the problem it solves. */
  description: string;
  /** Keep this to the technologies you actually used. */
  tech: string[];
  /** Leave empty ('') to hide that particular link. */
  liveUrl: string;
  repoUrl: string;
  /** Screenshot in /public/projects/. Leave empty to show a styled placeholder. */
  imageUrl: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  location: string;
  /** Drop your CV at src/assets/ or public/ and point here. */
  resumeUrl: string;
  socials: SocialLink[];
}

export interface PortfolioContent {
  hero: {
    name: string;
    title: string;
    valueProposition: string;
  };
  projects: Project[];
  skills: SkillGroup[];
  about: {
    heading: string;
    paragraphs: string[];
  };
  contact: ContactInfo;
}

export const PORTFOLIO: PortfolioContent = {
  // ---------------------------------------------------------------------
  // HERO — the first thing a recruiter reads. Keep it short and specific.
  // ---------------------------------------------------------------------
  hero: {
    name: 'Francis Lagmay',
    title: 'Full-Stack Developer',
    valueProposition:
      'I build fast, accessible web applications with Angular and ASP.NET Core, ' +
      'and I care as much about the database underneath as the interface on top.',
  },

  // ---------------------------------------------------------------------
  // PROJECTS — 6 strong, finished projects. Depth beats breadth.
  // Delete the extra entries if you only have three.
  // ---------------------------------------------------------------------
  projects: [
     {
      title: 'Angular Portfolio',
      description:
        'A modern, responsive developer portfolio featuring a hero section with a clear call-to-action, '+
        'a showcase of 6 working projects with tech stacks, '+
        'a scannable skills grid, a personal bio, and contact details with social links and a downloadable resume.',
      tech: ['Angular', 'HTML & CSS', 'TypeScript', 'C#', 'ASP.NET Core', 'MySQL' ],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'Student Management System',
      description:
        'A comprehensive system designed to help educational institutions manage student ' +
        'enrolments, courses, assessments, financials, and compliance processes.',
      tech: ['HTML & CSS', 'jQuery','C#', 'ASP.NET Core', 'MySQL' ],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'PSEConnect',
      description:
        'An Enterprise trading platform enabling brokers to participate in Philippine Stock Exchange ' +
        'transactions and market activities. ',
      tech: ['HTML & CSS', 'jQuery', 'Blazor', 'Entity Framework Core', 'MySQL', 'GraphQL', 'RestAPI'],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'PDS Market Page',
      description:
        'An Enterprise monitoring platform providing visibility into fixed-income market infrastructure and ' +
        'trading activities. ',
      tech: ['HTML', 'VueJS', 'Tailwind CSS', 'Blazor', 'Entity Framework Core', 'MySQL', 'GraphQL', 'RestAPI'],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'PSE Billing Portal',
      description:
        'An Enterprise billing and invoice management platform supporting internal financial operations of ' +
        'the Philippine Stock Exchange. ',
      tech: ['HTML & CSS', 'jQuery', 'ASP.NET Core', 'MySQL'],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
    {
      title: 'STG (Stock Trading Game)',
      description:
        'Stock market simulation platform designed to provide users with hands-on trading ' +
        'experience in a risk-free environment. ',
      tech: ['HTML', 'VueJS', 'Tailwind CSS', 'Blazor', 'Entity Framework Core', 'MySQL', 'GraphQL', 'RestAPI'],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
    },
  ],

  // ---------------------------------------------------------------------
  // SKILLS — grouped lists. Avoid percentage bars; they invite arguments
  // and communicate less than a plain list of things you can actually use.
  // ---------------------------------------------------------------------
  skills: [
    {
      category: 'Languages',
      items: ['C#', 'SQL', 'JavaScript', 'HTML & CSS'],
    },
    {
      category: 'Frameworks & Libraries',
      items: ['ASP.NET Core', 'Blazor', 'Entity Framework Core', 'VueJS', 'Angular', 'jQuery', 'Tailwind CSS'],
    },
    {
      category: 'APIs & Integration',
      items: ['REST API design', 'GraphQL (HotChocolate)', 'SignalR / WebSockets'],
    },
    {
      category: 'Databases',
      items: ['MySQL', 'Redis', 'Query Optimization'],
    },
    {
      category: 'Tools & Practices',
      items: ['Git', 'Figma'],
    },
  ],

  // ---------------------------------------------------------------------
  // ABOUT — a short bio. Why you got into this, and what you are good at.
  // ---------------------------------------------------------------------
  about: {
    heading: 'About Me',
    paragraphs: [
      `I'm a Full Stack Developer with 5+ years of experience designing and ` +
        'delivering enterprise-grade applications in the financial and education sectors. ',
      'Experienced in leading development initiatives, mentoring junior developers ' +
        'and building scalable solutions using C#, .NET, Blazor, Vue.js, Angular, SQL Server, REST APIs, and GraphQL. ',
    ],
  },

  // ---------------------------------------------------------------------
  // CONTACT — the form below these details saves to your MySQL database.
  // ---------------------------------------------------------------------
  contact: {
    email: 'francislagmay24@gmail.com',
    location: 'General Trias, Cavite, Philippines',
    resumeUrl: 'assets/francis-lagmay-cv.pdf',
    socials: [
      { label: 'GitHub', icon: 'github', url: 'https://github.com/francislagmay24' },
      { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/francislagmay' },
      { label: 'Email', icon: 'mail', url: 'mailto:francislagmay24@gmail.com' },
    ],
  },
};

/** Sections used by the header navigation, in order. */
export const NAV_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;
