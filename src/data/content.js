export const profile = {
  name: 'Haider',
  fullName: 'Haider Saleem',
  title: 'Software Developer & Data Analyst',
  avatar: 'public/logos/avatar.jpg',
  tagline:
    'Computer Science student at Ontario Tech University building dashboards, data pipelines, and AI-powered apps.',
  location: 'Toronto, Ontario',
  email: 'haider.saleem@Ontariotechu.net',
  linkedin: 'https://linkedin.com/in/haider42',
  github: 'https://github.com/Haider425',
  resume: 'src/assets/Haider_Saleem_Resume_2027.pdf',
  formKey: '7217601e-4bc0-438c-8513-3a4f204a180c',
}

   export const accountLinks = [
     { label: 'LinkedIn', icon: 'linkedin', href: profile.linkedin },
     { label: 'GitHub', icon: 'github', href: profile.github },
     { label: 'Email', icon: 'mail', href: `mailto:${profile.email}` },
     { label: 'Projects', icon: 'projects', href: '#projects' },
     { label: 'Share', icon: 'share', action: 'share' },
     { label: 'Save contact', icon: 'contact', action: 'save-contact' },
    //  { label: 'Copy email', icon: 'copy', action: 'copy-email' }
   ]

  // Sticky notes in the About section.
// color: yellow | pink | green | blue | orange | purple
export const aboutNotes = [
  { title: 'Fun fact', text: 'I speak 4 languages: English, Urdu, Hindi and Punjabi.', color: 'yellow' },
  { title: 'Right now', text: 'Building apps and dashboards at OPG Darlington.', color: 'blue' },
  { title: 'Minor in Astronomy', text: 'Because space is the best dataset there is.', color: 'purple' },
  { title: 'New hobby', text: 'Just bought a tennis racket. Backhand is a work in progress.', color: 'green' },
  { title: 'Side quest', text: 'I manage my own investment portfolio.', color: 'orange' },
  { title: 'Next up', text: "Master's in Computer Science after I graduate in Dec 2027.", color: 'pink' },
]

// Kept for search: the text of every note is searchable too.
export const about = aboutNotes.map((n) => `${n.title} ${n.text}`)

// Phrases that type themselves in the hero search bar.
// Pressing Enter on an empty search runs whichever phrase is showing,
// so keep these to things that actually match something on the page.
export const searchQueries = [
  'angular and asp.net web apps',
  'power bi dashboards',
  'python qa automation',
  'llm pipeline with ollama',
  'react and flask chatbot',
  'sql data analysis',
]

export const quickFacts = [
  { label: 'Ontario Tech CS', sub: 'Class of 2027' },
  { label: "President's List", sub: '3.65 GPA' },
  { label: 'Co-op at OPG', sub: 'Sep 2026 to Apr 2027' },
]

export const knowledgePanel = {
  subtitle: 'Computer Science student',
  summary:
    "I'm a Computer Science student at Ontario Tech University, minoring in Mathematics and Astronomy. I like building things and figuring out how they work, whether that's an internal web app, a Power BI dashboard, or an AI project. I've completed three co-op terms so far, working across software, data, and AI.\n\nOutside of tech, you'll usually find me playing tennis or badminton, or keeping up with my investments. I'm always curious about something new and usually have a project or idea I'm working on.",
  facts: [
    ['Education', 'Ontario Tech University, B.Sc. Computer Science (December 2027)'],
    ['Minors', 'Mathematics, Astronomy'],
    ['Currently', 'Co-op at Ontario Power Generation'],
    ['Based in', 'Toronto, Ontario'],
    ['Interests', 'Tennis, investing, Astronomy'],
    ['Languages', 'English, Urdu, Hindi, Punjabi'],
  ],
}


// Extra search words for the About section
export const aboutKeywords = [
  'about', 'student', 'ontario tech', 'university', 'education', 'degree', 'computer science',
  'mathematics', 'math', 'astronomy', 'minor', 'gpa', 'presidents list', 'graduate', 'graduation',
  'data science', 'languages', 'urdu', 'hindi', 'punjabi', 'durham', 'oshawa',
  'database systems', 'software design', 'algorithms', 'coursework',
]

export const experience = [
  {
    id: 'opg',
    org: 'Ontario Power Generation',
    url: 'opg.com › Chief Nuclear Office › Opperations & Support',
    logo: './logos/opg_logo.png',
    role: 'Co-op Student, Software & Data Analytics',
    type: 'Co-op',
    period: 'Sep 2026 to Apr 2027',
    duration: '8 months',
    location: 'Darlington, Ontario',
    current: true,
    snippet:
      'Building internal web apps with Angular and ASP.NET Core, and Power BI dashboards used by Operations staff to track key metrics.',
    overview:
      'I build the internal tools and reporting that Operations teams at Darlington use day to day, from web apps and PowerApps to the dashboards managers use to make decisions.',
    highlights: [
      'Develop internal web applications with Angular and ASP.NET Core Web API to support Operations workflows',
      'Build and maintain Power BI dashboards used by 50 to 100 Operations staff to monitor key metrics',
      'Write SQL queries and data workflows that bring operational data into internal apps and reports',
      'Build PowerApps solutions that streamline internal workflows and make operational data easier to reach',
    ],
    tags: ['Angular', 'ASP.NET Core', 'Power BI', 'SQL', 'PowerApps'],
    keywords: [
      'opg', 'darlington', 'nuclear', 'energy', 'power', 'utility', 'utilities', 'operations',
      'web app', 'web development', 'full stack', 'frontend', 'backend', 'typescript', '.net',
      'dotnet', 'web api', 'rest api', 'dashboard', 'kpi', 'metrics', 'reporting', 'power platform',
      'low code', 'internal tools', 'data workflow', 'data integration', 'current', 'software developer',
    ],
    related: [],
  },
  {
    id: 'ops-data',
    org: 'Ontario Public Service',
    url: "ontario.ca › mpbsdp › cio's office",
    logo: './logos/new_ops_logo.jpeg',
    role: 'Data Analyst Co-op',
    type: 'Co-op',
    period: 'May 2026 to Aug 2026',
    duration: '4 months',
    location: 'Toronto, Ontario',
    team: "CIO's Office, Central Agencies I&IT Cluster",
    ministry: 'MPBSDP',
    snippet:
      "Built Power BI dashboards tracking 10+ KPIs for the CIO's Office and delivered 15+ analytical reports across teams.",
    overview:
      "In the CIO's Office I turned project and consulting data into dashboards and reports that helped teams decide where to focus their digital service work.",
    highlights: [
      "Built Power BI dashboards tracking 10+ KPIs for the CIO's Office business development and consulting work",
      'Analyzed data with SQL and Excel across 5+ projects to find trends and data quality issues',
      'Worked with stakeholders to deliver 15+ analytical reports that informed digital service delivery decisions',
    ],
    learned:
      'This placement is where I decided on data science. I saw how much a clear dashboard changes how a team makes decisions.',
    tags: ['Power BI', 'SQL', 'Excel', 'Power Automate'],
    keywords: [
      'ops', 'ontario public service', 'government', 'public sector', 'mpbsdp', 'cio', 'toronto',
      'data analyst', 'data analysis', 'analytics', 'dashboard', 'kpi', 'reporting', 'reports',
      'stakeholders', 'business intelligence', 'bi', 'data quality', 'trends', 'insights', 'dax',
    ],
    related: ['OPS BI Dashboards'],
  },
  {
    id: '2020-mission',
    org: '20/20 Mission',
    url: 'riipen › labs › june 2026 cohort',
    logo: './logos/2020_logo.webp',
    role: 'Operations & Technical Lead',
    type: 'Project',
    via: 'Riipen Labs',
    period: 'June 2026 cohort',
    snippet:
      'Led operations and technical work on a five-person team for a used eyeglasses charity, mapping the donor journey and delivering each milestone.',
    overview:
      '20/20 Mission collects used eyeglasses and gets them to people who need them. Our five-person team looked at how donors find and give to the charity and where that process could be smoother.',
    highlights: [
      'Mapped the full donor journey from first contact to donation',
      'Drafted milestone submissions and kept the team on schedule',
      'Managed worklogs, employer feedback, and peer reviews across every milestone',
    ],
    tags: ['Leadership', 'Process mapping', 'Nonprofit'],
    keywords: [
      'riipen', 'charity', 'nonprofit', 'non profit', 'team lead', 'leadership', 'project management',
      'operations', 'donor journey', 'process', 'user journey', 'teamwork', 'client',
    ],
    related: [],
  },
  {
    id: 'square-root',
    org: 'Square Root Technologies',
    url: 'squareroot › remote',
    logo: './logos/square_root_tech_logo.png',
    role: 'Software Engineer',
    type: 'Job',
    period: 'Dec 2025 to Mar 2026',
    location: 'Remote',
    snippet:
      'Built an AI pipeline with Node.js and Ollama/Mistral that turns raw deal data into product pages, processing 100+ listings per hour.',
    overview:
      'I built an AI pipeline that takes raw deal data and turns it into ready-to-publish, Amazon-style product pages for an e-commerce client.',
    highlights: [
      'Built an AI pipeline with Node.js and Ollama/Mistral that generates product pages from raw deal data, processing 100+ listings per hour',
      'Used NLP models to extract and structure data from 200+ source documents, including PDFs, Excel files, and emails',
      'Validated the pipeline across 50+ product categories, reaching 90% accuracy for production deployment',
    ],
    tags: ['Node.js', 'Ollama', 'Mistral', 'NLP'],
    keywords: [
      'ai', 'llm', 'large language model', 'generative ai', 'genai', 'machine learning', 'ml',
      'nlp', 'natural language processing', 'data extraction', 'pipeline', 'automation',
      'ecommerce', 'e-commerce', 'amazon', 'product pages', 'pdf', 'excel', 'javascript', 'remote',
      'backend', 'software engineer',
    ],
    related: ['AI Product Pipeline'],
  },
  {
    id: 'ops-dev',
    org: 'Ontario Public Service',
    url: 'ontario.ca › mpbsdp › tax remittance',
    logo: './logos/old_ops_logo_cropped.jpg',
    role: 'Software Developer Co-op',
    type: 'Co-op',
    period: 'May 2025 to Dec 2025',
    duration: '8 months',
    location: 'Oshawa, Ontario',
    ministry: 'MPBSDP',
    snippet:
      'Built an automated QA framework in Python and Azure DevOps that cut validation time by 30% for tax remittance workflows.',
    overview:
      'My first co-op. I automated the testing of tax remittance workflows so a team of 25+ could validate changes faster and catch data problems before they reached production.',
    highlights: [
      'Built an automated QA framework with Python and Azure DevOps, cutting validation time by 30% for workflows used by 25+ team members',
      'Found and tracked 50+ data integrity issues in DevOps, and the vendor resolved every one of them',
      'Documented 10+ workflow requirements with the team to support system enhancements',
    ],
    tags: ['Python', 'Azure DevOps', 'QA', 'Testing'],
    keywords: [
      'ops', 'ontario public service', 'government', 'public sector', 'mpbsdp', 'oshawa', 'tax',
      'qa', 'quality assurance', 'testing', 'test automation', 'automation', 'automated testing',
      'devops', 'azure', 'ci/cd', 'data integrity', 'bugs', 'requirements', 'documentation',
      'software developer', 'agile',
    ],
    related: ['QA Automation Framework'],
  },
  {
    id: 'trustworthy-ai',
    org: 'Trustworthy AI Lab, Ontario Tech',
    url: 'ontariotechu.ca › research',
    logo: './logos/otu_logo.jpg',
    role: 'Research Assistant',
    type: 'Research',
    location: 'Oshawa, Ontario',
    snippet:
      'Autonomous navigation research on TurtleBot 4 using ROS2 and SLAM for mapping and path planning.',
    overview:
      'At the Trustworthy AI Lab I worked on getting a TurtleBot 4 to move through a space on its own. The robot builds a map as it goes and uses it to plan safe routes.',
    highlights: [
      'Set up the TurtleBot 4 with ROS2 for autonomous navigation',
      'Used SLAM to build maps of indoor spaces in real time',
      'Tested path planning and obstacle avoidance on the physical robot',
    ],
    tags: ['ROS2', 'SLAM', 'Python', 'Linux'],
    keywords: [
      'research', 'robotics', 'robot', 'autonomous', 'navigation', 'turtlebot', 'mapping',
      'path planning', 'ai', 'lab', 'university',
    ],
    related: ['Autonomous Navigation'],
  },
  {
    id: 'style-doula',
    org: 'Your Style Doula',
    url: 'riipen › projects',
    logo: './logos/style_doula_logo.jpg',
    role: 'Communications Lead',
    type: 'Project',
    via: 'Riipen',
    snippet: 'Built and deployed the company website and led communication with the client.',
    overview:
      'I led communication between our team and Your Style Doula and built the website they now use.',
    highlights: [
      'Designed, built, and deployed the company website',
      'Main point of contact between the team and the client',
    ],
    tags: ['Web', 'Client work'],
    keywords: ['riipen', 'website', 'web design', 'client', 'communication', 'deployment'],
    related: [],
  },
  {
    id: 'rue-productions',
    org: 'Rue Productions',
    url: 'riipen › projects',
    logo: './logos/rue_productions_logo.png',
    role: 'Research Lead',
    type: 'Project',
    via: 'Riipen',
    snippet: 'Led market research for a marketing strategy for an animation company.',
    overview:
      'Rue Productions is an animation studio. I led the research our team used to build their marketing strategy.',
    highlights: [
      'Researched the audience and competitors for an animation studio',
      "Turned the findings into recommendations for the studio's marketing strategy",
    ],
    tags: ['Research', 'Marketing'],
    keywords: ['riipen', 'market research', 'marketing', 'strategy', 'animation', 'competitors'],
    related: [],
  },
  {
    id: 'test-centre',
    org: 'Ontario Tech Test Centre',
    url: 'ontariotechu.ca › test centre',
    logo: './logos/otu_logo.jpg',
    role: 'Junior Data Analyst',
    type: 'Job',
    location: 'Oshawa, Ontario',
    snippet: 'My first role in data: reporting and analysis for campus testing operations.',
    overview:
      'My first job in data. I helped the Test Centre track and report on its testing operations, and later built CampusConnect AI to answer its most common questions.',
    highlights: [
      'Put together reports on testing operations for the Test Centre team',
      'Kept operational data organized and accurate',
    ],
    tags: ['Excel', 'Reporting'],
    keywords: ['university', 'campus', 'data analyst', 'reporting', 'first job', 'student job'],
    related: ['CampusConnect AI'],
  },
]

export const projectFilters = ['All', 'Data', 'AI', 'Software', 'Research']

// color: one of blue | red | yellow | green
export const projects = [
  {
    name: 'AI Product Pipeline',
    category: ['AI', 'Software'],
    color: 'red',
    description:
      'Node.js and Express API that parses .eml files and pulls structured product data from email text and images with Gemini vision, then regenerates product photos as studio shots.',
    stack: ['Node.js', 'Express', 'Gemini 2.5', 'mailparser', 'Multer', 'Pino'],
    link: 'REPLACE_LINK',
    keywords: [
      'ai', 'llm', 'gemini', 'vision', 'computer vision', 'image generation', 'generative ai',
      'genai', 'email', 'eml', 'parsing', 'json', 'schema', 'api', 'rest api', 'backend',
      'full stack', 'javascript', 'ecommerce', 'product data', 'apparel',
    ],
  },
  {
    name: 'CampusConnect AI',
    category: ['AI', 'Software'],
    color: 'blue',
    description:
      'Hybrid AI chatbot for the University Test Centre that combines semantic search with an LLM fallback, using vector-based intent routing for better answers than keyword matching.',
    stack: ['React', 'Flask', 'Python', 'SentenceTransformers', 'Ollama'],
    link: 'REPLACE_LINK',
    keywords: [
      'chatbot', 'chat bot', 'ai', 'llm', 'nlp', 'semantic search', 'embeddings', 'vector',
      'vector search', 'intent', 'rag', 'machine learning', 'ml', 'full stack', 'frontend',
      'backend', 'rest api', 'javascript', 'university', 'test centre',
    ],
  },
  {
    name: 'OPS BI Dashboards',
    category: ['Data'],
    color: 'yellow',
    description:
      "Power BI dashboards tracking 10+ KPIs for the CIO's Office, with SQL and Excel analysis behind them.",
    stack: ['Power BI', 'SQL', 'Excel', 'Power Automate'],
    link: 'REPLACE_LINK',
    keywords: [
      'dashboard', 'dashboards', 'kpi', 'bi', 'business intelligence', 'reporting', 'analytics',
      'data visualization', 'visualisation', 'government', 'dax',
    ],
  },
  {
    name: 'QA Automation Framework',
    category: ['Software'],
    color: 'green',
    description:
      'Automated QA framework in Python and Azure DevOps that cut validation time by 30% for tax remittance workflows.',
    stack: ['Python', 'Azure DevOps'],
    link: 'REPLACE_LINK',
    keywords: [
      'qa', 'quality assurance', 'testing', 'test automation', 'automation', 'devops', 'azure',
      'ci/cd', 'pipelines', 'data integrity', 'government',
    ],
  },
  {
    name: 'Autonomous Navigation',
    category: ['Research', 'AI'],
    color: 'green',
    description: 'TurtleBot 4 that maps its surroundings and plans routes on its own using SLAM in ROS2.',
    stack: ['ROS2', 'SLAM', 'TurtleBot 4', 'Python'],
    link: 'REPLACE_LINK',
    keywords: ['robotics', 'robot', 'autonomous', 'navigation', 'mapping', 'path planning', 'research', 'lab'],
  },
  {
    name: 'The Big Three Era',
    category: ['Data'],
    color: 'blue',
    description: 'Data visualization report on Federer, Nadal, and Djokovic built in R.',
    stack: ['R', 'ggplot2', 'dplyr'],
    link: 'REPLACE_LINK',
    keywords: ['tennis', 'sports', 'data visualization', 'visualisation', 'charts', 'statistics', 'stats', 'report'],
  },
  {
    name: 'Compiler Front End',
    category: ['Software'],
    color: 'yellow',
    description: 'Language parser and interpreter built with ANTLR4 grammars and Kotlin.',
    stack: ['Kotlin', 'ANTLR4'],
    link: 'REPLACE_LINK',
    keywords: ['compiler', 'compilers', 'parser', 'parsing', 'interpreter', 'grammar', 'programming languages', 'course'],
  },
]

export const skills = [
  {
    group: 'Programming',
    color: 'blue',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'SQL', 'R'],
    keywords: ['languages', 'coding', 'programming languages'],
  },
  {
    group: 'Data & Analytics',
    color: 'red',
    items: ['Power BI', 'Excel', 'Power Automate', 'ggplot2', 'dplyr', 'scikit-learn', 'Data Visualization'],
    keywords: ['analytics', 'bi', 'machine learning', 'ml', 'sklearn', 'dashboards', 'visualisation'],
  },
  {
    group: 'Frameworks & Tools',
    color: 'yellow',
    items: ['Angular', 'React', 'Node.js', 'ASP.NET', 'Flask', 'PowerApps', 'Git', 'Docker', 'Azure DevOps', 'GCP'],
    keywords: ['frameworks', 'tools', 'google cloud', 'cloud', '.net', 'dotnet', 'frontend', 'backend'],
  },
  {
    group: 'Databases & Concepts',
    color: 'green',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'REST APIs', 'CI/CD', 'Agile'],
    keywords: ['databases', 'database', 'postgres', 'nosql', 'api', 'devops', 'scrum'],
  },
]