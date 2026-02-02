export type Experience = {
  id: string;
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: {
    category: string;
    items: string[];
  }[];
  printOnly?: boolean;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
};

export const experience: Experience[] = [
  {
    id: 'forcebuilders-cto',
    company: 'ForceBuilders',
    companyUrl: 'https://www.forcebuilders.io',
    role: 'Co-Founder & CTO',
    period: 'April 2023 – Present',
    location: 'Remote',
    summary:
      'We help organizations build and scale highly functioning software teams — with a focus on People, Process, and Product. We ignite potential, empower teams, and step back when they can run without us.',
    highlights: [
      {
        category: 'Fractional CTO Engagements',
        items: [
          'Healthcare IoT Startup: Established the software organization from zero for a connected medical device company. Hired architect and developers. Helped lay the architecture track (Node, React, React Native, BLE integration) and took stories alongside the team. Shipped V1 then executed a structured phase-out.',
          'Merchant Services Company: Partnered with leadership to build a 10+ person cross functional team. Established architecture (Node, React, TypeScript), SDLC, and tooling in a PCI-compliant environment. Team shipped V1 with new market capabilities including API integration and AI-enabled intake.',
          'Software Consultancy Transition: Designed a timed transition plan to exit the organization I helped build over 20 years. Trained successor and established a cross-practice leadership structure.',
        ],
      },
      {
        category: 'Technical Due Diligence',
        items: [
          'Fintech VC Portfolio Evaluation: Engaged by a VC firm to assess a portfolio company. Conducted thorough code review, team evaluation, and infrastructure audit. Delivered candid findings that gave the board clarity.',
        ],
      },
    ],
  },
  {
    id: 'truefit-cto',
    company: 'Truefit',
    companyUrl: 'https://www.truefit.io',
    role: 'CTO',
    period: 'June 2015 – November 2024',
    location: 'Pittsburgh, PA',
    summary:
      'Led the technical vision, engineering organization, and solutions engineering efforts for a boutique software consultancy. Served as the technical face of the company for sales support and industry engagement.',
    highlights: [
      {
        category: 'Engineering & Team Building',
        items: [
          'Designed and scaled cross-functional teams that could take on any project and deliver on time, on budget, with high quality',
          'Grew the overall organization by more than 2x',
          'Created the engineering career ladder, interview process, and performance management approach',
          'Directly mentored ~50 developers over the course of my tenure',
        ],
      },
      {
        category: 'Technical Leadership',
        items: [
          'Led R&D and established technical standards across all teams',
          'Drove major technology transitions while staying hands-on — architecture, code review, and jumping into the codebase alongside teams when projects called for it',
          'Led engagements ranging from greenfield builds to rescues where our team was brought in after others had failed',
          'Created and maintained open source frameworks; founded the Pittsburgh React meetup',
          'Represented the company as a speaker at CodeMash, ThatConference, StirTrek, and other regional tech events',
        ],
      },
      {
        category: 'Results',
        items: [
          'Company recognized as Greater Pittsburgh Top Workplace (2017, 2019)',
          'Guided teams to deliver 150+ projects across regulated and unregulated industries — healthcare, finance, sports, fitness, gaming, and connected hardware',
          'Built a team culture that alumni consistently describe as the best place they ever worked',
        ],
      },
    ],
  },
  {
    id: 'truefit-director',
    company: 'Truefit',
    companyUrl: 'https://www.truefit.io',
    role: 'Director of Engineering',
    period: 'August 2013 – June 2015',
    location: 'Pittsburgh, PA',
    summary:
      'Saw an organizational need and stepped up to fill it. Created the Director of Engineering role to bridge technical leadership with business operations — then built the systems to make it work.',
    highlights: [
      {
        category: 'Operational Foundation',
        items: [
          'Established the structure for projecting capacity, forecasting revenue, and measuring value delivered. This foundation drove the business for the next decade.',
          'Standardized estimation and transitioned from hourly billing to value-based pricing',
          'Established job roles and performance management structure',
        ],
      },
      {
        category: 'Team Building & Transition',
        items: [
          'Took over hiring and management of engineering and QA',
          'Helped legacy developers transition to modern tech stacks',
          'Partnered on transition from "bench" model to dedicated cross-functional teams',
        ],
      },
    ],
  },
  {
    id: 'truefit-architect',
    company: 'Truefit',
    companyUrl: 'https://www.truefit.io',
    role: 'Software Architect',
    period: 'May 2008 – August 2013',
    location: 'Pittsburgh, PA',
    summary:
      'Designed and led technical architecture for client projects. Mentored developers and established patterns that scaled across multiple teams.',
    highlights: [
      {
        category: 'Architecture & Delivery',
        items: [
          'Built restaurant POS system from scratch; shipped in 6 months, expanded nationwide',
          'Founded mobile development practice; grew from sole developer to agile team',
          'Delivered quality projects across web, mobile, desktop; established frameworks and patterns',
        ],
      },
    ],
    printOnly: true,
  },
  {
    id: 'truefit-senior',
    company: 'Truefit',
    companyUrl: 'https://www.truefit.io',
    role: 'Senior Software Engineer / Software Engineer',
    period: 'May 2003 – May 2008',
    location: 'Pittsburgh, PA',
    summary:
      'Full-stack development across diverse client projects. Grew from engineer to senior engineer to technical lead.',
    highlights: [
      {
        category: 'Engineering',
        items: [
          'Led development on proprietary SOA bus for multi-product ERP system',
          'Re-architected syncing system from single-process to distributed, multi-worker architecture',
          'Designed archive-and-purge utility for large databases',
        ],
      },
    ],
    printOnly: true,
  },
  {
    id: 'gcc-adjunct',
    company: 'Grove City College',
    companyUrl: 'https://www.gcc.edu',
    role: 'Adjunct Professor',
    period: 'May 2009 – May 2013',
    location: 'Grove City, PA',
    summary:
      'Taught upper-level computer science courses while maintaining my industry role. Brought real-world software development practices into the classroom.',
    highlights: [
      {
        category: 'Teaching',
        items: [
          'Developed and taught senior-level mobile development course (iOS/Objective-C)',
          'Mentored students on software engineering and career development',
        ],
      },
    ],
  },
];

export const education: Education[] = [
  {
    id: 'gcc',
    institution: 'Grove City College',
    degree: 'B.S.',
    field: 'Computer Information Systems',
    period: '2000 – 2004',
    location: 'Grove City, PA',
  },
];

export const skills = {
  Engineering: [
    'TypeScript',
    'JavaScript',
    'Node.js',
    'React',
    'React Native',
    'C# / .NET',
    'Python',
    'Swift',
    'Objective-C',
    'Go',
    'Kotlin',
    'PostgreSQL',
    'AWS',
    'Azure',
  ],
  Architecture: [
    'System Design',
    'API Design',
    'Cloud Architecture',
    'Microservices',
    'Event-Driven Systems',
  ],
  Leadership: [
    'Team Building',
    'Technical Strategy',
    'Mentorship',
    'Organizational Design',
    'Stakeholder Communication',
  ],
  Communication: ['Public Speaking', 'Technical Writing', 'Sales Support', 'Client Relations'],
  Practices: ['Agile/Scrum', 'CI/CD', 'Code Review', 'TDD', 'DevOps'],
};

export const contactLinks = [
  {label: 'Email', href: 'mailto:josh@forcebuilders.com'},
  {label: 'LinkedIn', href: 'https://linkedin.com/in/joshgretz'},
  {label: 'GitHub', href: 'https://github.com/jgretz'},
  {label: 'ForceBuilders', href: 'https://forcebuilders.com'},
];
