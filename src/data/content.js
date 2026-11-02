export const profile = {
  name: 'Haider',
  fullName: 'Haider Saleem',
  title: 'Software Developer',
  avatar: './logos/avatar.jpg',
  tagline:
    'Computer Science student at Ontario Tech University building full-stack apps, data pipelines and AI tools. Founder of Ghostless.',
  location: 'Toronto, Ontario',
  email: 'haider.saleem@ontariotechu.net',
  linkedin: 'https://linkedin.com/in/haider42',
  github: 'https://github.com/Haider425',
  resume: './assets/Haider_Saleem_Resume_2027.pdf',
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
    logo: './logos/opg_logo.png',
    role: 'Software Developer Co-op',
    type: 'Co-op',
    period: 'Sep 2026 to Apr 2027',
    duration: '8 months',
    location: 'Darlington, Ontario',
    current: true,
    snippet:
      'Built a full-stack Angular and ASP.NET Core tablet app that digitizes nuclear operators\' paper logs, cutting data entry time by 42%.',
    overview:
      'I build software for the people who run Darlington. My main project replaced paper shift logs with a tablet app, so operators record data faster and supervisors can search every shift record instantly.',
    highlights: [
      'Built a full-stack Angular and ASP.NET Core tablet app for nuclear operators, digitizing paper logs into SQL Server and cutting data entry time by 42% while making shift records instantly searchable for supervisors',
      'Automated vendor procurement workflows by connecting real-time SQL dashboard metrics that trigger inventory restocking when supplies fall below thresholds',
      'Cut query times across 4 SQL Server databases from 21s to under 4s on 1M+ records by rewriting queries',
      'Shipped a bookmarking feature for the issue tracker, used by 20+ engineers, with SQL Server persistence',
    ],
    tags: ['Angular', 'ASP.NET Core', 'C#', 'SQL Server', 'TypeScript'],
    keywords: [
      'opg', 'darlington', 'nuclear', 'energy', 'power', 'utility', 'operators', 'tablet', 'shift logs',
      'web app', 'full stack', 'frontend', 'backend', 'typescript', '.net', 'dotnet', 'c#', 'csharp',
      'web api', 'rest api', 'dashboard', 'sql', 'query optimization', 'performance', 'procurement',
      'inventory', 'internal tools', 'current', 'software developer',
    ],
    related: [],
  },
  {
    id: 'ghostless',
    org: 'Ghostless',
    logo: './logos/ghostless.svg',
    role: 'Founder & Software Engineer',
    type: 'Job',
    period: 'Sep 2026 to Present',
    location: 'Toronto, Ontario',
    current: true,
    link: 'https://ghostless.ca',
    snippet:
      'Founded an automated job discovery platform serving 100,000+ active job postings, built on a Python crawling pipeline and Next.js/FastAPI.',
    overview:
      'Ghostless finds tech jobs across Canada automatically and flags the ones that are likely ghost jobs. I built everything from the crawler that discovers job boards to the app people use to track applications.',
    highlights: [
      'Designed an automated Python pipeline that discovers 17,000+ job boards through parallel crawling and 4-shard GitHub Actions workflows',
      'Optimized PostgreSQL ingestion with fingerprint-based change detection, cutting nightly read volume by 92%',
      'Developed a Next.js and FastAPI platform with OAuth and application tracking, serving 100,000+ active job postings',
      'Raised resume-matching precision from 45% to 93% on a blind-labeled dataset with a deterministic scoring engine',
    ],
    tags: ['Python', 'Next.js', 'FastAPI', 'PostgreSQL', 'GitHub Actions'],
    keywords: [
      'ghostless', 'founder', 'startup', 'job board', 'jobs', 'crawler', 'crawling', 'scraping', 'pipeline',
      'postgres', 'postgresql', 'fastapi', 'nextjs', 'next.js', 'oauth', 'resume matching', 'scoring',
      'canada', 'ghost jobs', 'github actions', 'current',
    ],
    related: [],
  },
  {
    id: 'ops-data',
    org: 'Ontario Public Service',
    logo: './logos/new_ops_logo.jpeg',
    role: 'Software Developer Co-op',
    type: 'Co-op',
    period: 'May 2026 to Aug 2026',
    duration: '4 months',
    location: 'Toronto, Ontario',
    team: 'GovTechON',
    snippet:
      'Automated SharePoint REST API integrations in Python across 5 teams, and turned raw JSON into finished slide decks, saving 7 hours a week.',
    overview:
      'At GovTechON I automated the repetitive work between teams: pulling data out of SharePoint, checking it, and turning it into the reports people actually read.',
    highlights: [
      'Automated SharePoint REST API integrations in Python across 5 teams, with scripts that retrieve JSON payloads and validate them against expected schemas',
      'Automated reporting pipelines that turn raw JSON into formatted slide decks with Python, saving 7 hours every week',
    ],
    tags: ['Python', 'SharePoint REST API', 'JSON', 'Automation'],
    keywords: [
      'ops', 'ontario public service', 'government', 'public sector', 'govtechon', 'toronto',
      'sharepoint', 'rest api', 'api', 'json', 'schema validation', 'automation', 'reporting',
      'slides', 'powerpoint', 'scripts', 'python',
    ],
    related: [],
  },
  {
    id: '2020-mission',
    org: '20/20 Mission',
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
    logo: './logos/square_root_tech_logo.png',
    role: 'Software Engineer',
    type: 'Job',
    period: 'Dec 2025 to Mar 2026',
    duration: '4 months',
    location: 'Remote',
    snippet:
      'Designed a Node.js pipeline using Gemini 2.5 Flash that processes 100+ product listings an hour with 94% extraction accuracy.',
    overview:
      'Square Root needed product pages built from messy source documents. I built the pipeline that reads them, pulls out structured data with Gemini, and checks the results before anything is published.',
    highlights: [
      'Designed a Node.js pipeline using Gemini 2.5 Flash that processes 100+ product listings per hour and extracts structured data from 200+ source documents',
      'Engineered an automated validation pipeline across 50+ product categories, reaching 94% data extraction accuracy',
    ],
    tags: ['Node.js', 'Gemini 2.5 Flash', 'LLM pipelines', 'Validation'],
    keywords: [
      'square root', 'remote', 'ai', 'llm', 'gemini', 'google', 'node', 'nodejs', 'javascript',
      'pipeline', 'data extraction', 'structured data', 'validation', 'ecommerce', 'product listings',
    ],
    related: [],
  },
  {
    id: 'ops-dev',
    org: 'Ontario Public Service',
    logo: './logos/old_ops_logo_cropped.jpg',
    role: 'Software Developer Co-op',
    type: 'Co-op',
    period: 'May 2025 to Dec 2025',
    duration: '8 months',
    location: 'Oshawa, Ontario',
    team: 'MPBSDP',
    snippet:
      'Implemented a Python and Azure DevOps automation framework that cut validation time by 30%, and resolved 50+ data integrity issues.',
    overview:
      'My first co-op. I automated the checks the team ran by hand and tracked down data problems with the vendors who could fix them.',
    highlights: [
      'Implemented a Python and DevOps automation framework, reducing validation time by 30% across workflows',
      'Diagnosed and resolved 50+ data integrity issues through Azure DevOps, working with vendors to eliminate the bugs',
    ],
    tags: ['Python', 'Azure DevOps', 'QA automation'],
    keywords: [
      'ops', 'ontario public service', 'government', 'mpbsdp', 'oshawa', 'qa', 'quality assurance',
      'testing', 'test automation', 'automation', 'azure', 'devops', 'ci', 'data integrity', 'bugs', 'vendors',
    ],
    related: [],
  },
  {
    id: 'trustworthy-ai',
    org: 'Trustworthy AI Lab, Ontario Tech',
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

export const projectFilters = ['All', 'Software', 'Data', 'AI']

// color: one of blue | red | yellow | green
// Replace your `projects` array in content.js with this one,
// and set: export const projectFilters = ['All', 'Software', 'Data', 'AI']

// Replace your whole `projects` array in content.js with this one.
// New: each project has a `details` block for the side panel,
// and The Big Three Era now links to its live report and repo.

export const projects = [
  {
    name: 'CodeImpact',
    thumb: './thumbs/codeimpact.svg',
    category: ['AI', 'Software'],
    color: 'violet',
    period: 'Oct 2026 to Present',
    description:
      'An AI-powered code impact analysis platform that reads a pull request, maps cross-file dependencies, and recommends the tests that matter.',
    stack: ['Next.js', 'FastAPI', 'Python', 'TypeScript', 'Tree-sitter', 'PostgreSQL'],
    code: 'https://github.com/Haider425/CodeImpact',
    details: {
      overview:
        'Running a full test suite on every pull request is slow. CodeImpact parses the code with Tree-sitter, works out which files a change really touches, and ranks the tests worth running, without ever executing untrusted repository code.',
      features: [
        'Tree-sitter static analysis that resolves cross-file dependencies and deterministically ranks code impact',
        'Benchmarked on 100+ pull requests: 91% test recall, 60% smaller test suites, 2.1s latency',
        '97% of AI explanations grounded in real evidence from the dependency graph',
        'Explanation engine that shows dependency provenance and confidence scores, so developers can check its reasoning',
      ],
      facts: [['Type', 'Code analysis platform'], ['Benchmark', '100+ PRs'], ['Test recall', '91%'], ['Latency', '2.1 s']],
    },
    keywords: [
      'codeimpact', 'code impact', 'static analysis', 'tree-sitter', 'ast', 'pull request', 'pr', 'testing',
      'test selection', 'dependency graph', 'ai', 'llm', 'nextjs', 'fastapi', 'typescript', 'postgresql', 'devtools',
    ],
  },
  {
    name: 'CampusConnect AI',
    demo: 'campusconnect',
    thumb: './thumbs/campusconnect-ai.svg',
    category: ['AI', 'Software'],
    color: 'blue',
    description:
      "AI chatbot for Ontario Tech's Test Centre that answers questions about bookings, accommodations and locations. It matches questions to FAQs with semantic search and falls back to a local LLM when there's no good match.",
    stack: ['React', 'Flask', 'Python', 'SentenceTransformers', 'Ollama'],
    link: 'https://github.com/Haider425/CampusConnect-AI',
    details: {
      overview:
        "Students kept asking the Test Centre the same questions about bookings, accommodations and locations. CampusConnect answers them instantly: it first detects what kind of question it is, looks for the closest match in the FAQ using semantic search, and only falls back to a local LLM when no FAQ answer is close enough.",
      features: [
        'Detects the question type (location, booking, contact or accommodations) before answering',
        'Semantic FAQ matching with SentenceTransformers (MiniLM) and cosine similarity',
        'Falls back to a local Qwen model through Ollama when there is no good FAQ match',
        'React chat interface with typing indicators and session-based chat history',
        'Flask REST API that handles requests in parallel with ThreadPoolExecutor',
      ],
      facts: [['Type', 'AI chatbot'], ['Frontend', 'React'], ['Backend', 'Flask (Python)'], ['License', 'MIT']],
    },
    keywords: [
      'chatbot', 'chat bot', 'ai', 'llm', 'nlp', 'semantic search', 'embeddings', 'vector', 'minilm',
      'qwen', 'intent', 'machine learning', 'ml', 'full stack', 'frontend', 'backend', 'rest api',
      'javascript', 'university', 'test centre',
    ],
  },
  {
    name: 'ChessHub',
    thumb: './thumbs/chesshub.svg',
    category: ['Software'],
    color: 'green',
    description:
      'Full-stack chess web app with online multiplayer over WebSockets, a computer opponent, and daily puzzles. Team of four; I built the board, pieces, themes, move highlighting, rules, popups and sidebar.',
    stack: ['JavaScript', 'HTML/CSS', 'Java', 'Jakarta EE', 'WebSockets'],
    link: 'https://chess-hub.netlify.app/title',
    code: 'https://github.com/Haider425/chess-hub',
    details: {
      overview:
        'A full-stack chess web app built as the final project for CSCI 2020U. Players can play each other online in real time, take on a computer opponent, or solve a daily puzzle.',
      features: [
        'Real-time online multiplayer over WebSockets on a Java (Jakarta EE) server',
        'Computer opponent powered by WukongJS',
        'Daily chess puzzle mode',
        'ELO leaderboard',
        'Board themes, legal move highlighting, popups and a game sidebar',
      ],
      role: 'I built the chess board, pieces, themes, rules, highlighted moves, popups and sidebar.',
      facts: [['Type', 'Web app'], ['Team', '4 people'], ['Course', 'CSCI 2020U'], ['Hosted on', 'Netlify']],
    },
    keywords: [
      'chess', 'game', 'multiplayer', 'websocket', 'real time', 'realtime', 'puzzles', 'cpu',
      'frontend', 'full stack', 'web app', 'team', 'netlify',
    ],
  },
  {
    name: 'ChatterBox',
    thumb: './thumbs/chatterbox.svg',
    category: ['Software'],
    color: 'green',
    description:
      'Cross-platform messaging app with real-time chat, file and photo sharing, live location sharing, and push notifications.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Google Maps API'],
    link: 'https://haider425.github.io/ChatterBox/',
    code: 'https://github.com/Haider425/ChatterBox',
    details: {
      overview:
        'A cross-platform messaging app built with Flutter and Firebase, covering the core features people expect from a modern chat app.',
      features: [
        'Email and password sign-in with Firebase Auth, including password reset',
        'Real-time messaging with Cloud Firestore',
        'Share files, photos from the in-app camera, and live location through Google Maps',
        'Push notifications with Firebase Cloud Messaging',
        'Friend search, draft auto-save, and chat archiving',
      ],
      facts: [['Type', 'Mobile app'], ['Platforms', 'Android and iOS'], ['Backend', 'Firebase'], ['License', 'MIT']],
    },
    keywords: [
      'mobile', 'app', 'android', 'ios', 'messaging', 'chat', 'realtime', 'real time',
      'notifications', 'fcm', 'authentication', 'cloud',
    ],
  },
  {
    name: 'CineSeek',
    thumb: './thumbs/cineseek.svg',
    category: ['Software'],
    color: 'yellow',
    description:
      'Movie search website that shows posters, IMDb ratings, plot, cast, awards and genres for any film.',
    stack: ['JavaScript', 'HTML', 'CSS', 'REST API'],
    link: 'https://cineseek.netlify.app/',
    code: 'https://github.com/Haider425/CineSeek',
    details: {
      overview:
        'A movie search website. Type a title and get everything you need to decide what to watch in one place.',
      features: [
        'Search any movie by title',
        'Poster, release date, IMDb rating and plot description',
        'Cast and crew, awards, genres and languages',
        'Deployed live on Netlify',
      ],
      facts: [['Type', 'Website'], ['Built with', 'HTML, CSS, JavaScript'], ['Hosted on', 'Netlify']],
    },
    keywords: ['movies', 'films', 'search', 'web', 'website', 'frontend', 'api', 'netlify'],
  },
  {
    name: 'World Happiness Analysis',
    thumb: './thumbs/world-happiness.svg',
    category: ['Data'],
    color: 'yellow',
    description:
      'Exploratory analysis of the 2019 World Happiness Report across 156 countries, comparing happiness scores with GDP per capita and other indicators.',
    stack: ['Python', 'pandas', 'seaborn', 'Matplotlib', 'NumPy', 'Jupyter'],
    link: 'https://haider425.github.io/HappinessEDA/',
    code: 'https://github.com/Haider425/HappinessEDA',
    details: {
      overview:
        'An exploratory analysis of the 2019 World Happiness Report, which scores 156 countries on happiness alongside economic and social indicators. The goal was to find where people are happiest and whether money is linked to happiness.',
      features: [
        'Cleaned the Kaggle dataset: dropped unused columns and duplicates, renamed fields',
        'Summary statistics to understand how scores are spread',
        'Compared the top 10 and bottom 10 countries on happiness and GDP per capita',
        'Combined bar and line charts of happiness against GDP for the top 25 countries',
        'Found a clear positive link between GDP per capita and happiness',
      ],
      facts: [['Type', 'Data analysis'], ['Countries', '156'], ['Data', 'Kaggle, 2019'], ['Tools', 'pandas, seaborn']],
    },
    keywords: [
      'eda', 'exploratory data analysis', 'data analysis', 'analytics', 'data visualization',
      'visualisation', 'charts', 'statistics', 'kaggle', 'gdp', 'happiness', 'notebook',
    ],
  },
  {
    name: 'The Big Three Era',
    thumb: './thumbs/big-three-era.svg',
    category: ['Data'],
    color: 'blue',
    description: 'Data visualization report on Federer, Nadal, and Djokovic built in R.',
    stack: ['R', 'ggplot2', 'dplyr'],
    link: 'https://haider425.github.io/Big-3/',
    code: 'https://github.com/Haider425/Big-3',
    details: {
      overview:
        'A data visualization report on how Federer, Nadal and Djokovic dominated men\'s tennis from 2004 to 2023, built from over 39,000 ATP match records. It looks at how dominant they were, how court surface shaped results, and how their Grand Slam runs unfolded.',
      features: [
        'Choropleth map of ATP wins by player nationality',
        'Lollipop chart of the top 20 players by total wins',
        'Season win totals over time, and a heatmap of win share by surface',
        'Scatter plot of season wins against average opponent ranking',
        'Ridgeline plot of wins across years, and Grand Slam wins by round',
      ],
      facts: [['Type', 'Data visualization'], ['Matches', '39,000+'], ['Years', '2004 to 2023'], ['Tools', 'R, ggplot2, sf']],
    },
    keywords: ['tennis', 'sports', 'data visualization', 'visualisation', 'charts', 'statistics', 'stats', 'report'],
  },
]

export const coreSkills = ['Python', 'SQL', 'Power BI', 'Angular', 'ASP.NET', 'React', 'Node.js', 'Azure DevOps']


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