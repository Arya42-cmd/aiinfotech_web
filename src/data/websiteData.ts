export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: "Software" | "Cloud" | "QA" | "Consulting";
  features: string[];
  architectureBlueprint: string[];
}

export interface IndustryItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string; // Lucide icon lookup name
  highlightMetric: string;
}

export interface TechBadge {
  name: string;
  category: "Languages & Frameworks" | "Cloud & Infrastructure" | "Data & Analytics" | "Automation & QA";
  rating: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  metric: string;
}

export interface ProcessStage {
  id: number;
  name: string;
  tagline: string;
  description: string;
  deliverable: string;
}

export interface SuccessMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  logoText: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  salaryRange: string;
  type: string;
  tags: string[];
  requirements: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "S-01",
    title: "Enterprise Software Engineering",
    shortDesc: "Architecting resilient, distributed systems designed for high availability and hyper-scale business transaction volumes.",
    fullDesc: "We engineer fault-tolerant microservices, robust API systems, and secure application fabrics. From transactional banking cores to heavy manufacturing control panels, our systems are built using proven enterprise patterns to handle billions of operations securely.",
    category: "Software",
    features: [
      "Custom Microservices & API gateways",
      "Legacy modernization & cloud migration",
      "Distributed transactions & event sourcing",
      "High-performance memory caches & DB optimization"
    ],
    architectureBlueprint: ["Spring Boot Core", "Node.js cluster", "Apache Kafka routing", "PostgreSQL partitioning"]
  },
  {
    id: "S-02",
    title: "Full-Stack Web & Mobile Platforms",
    shortDesc: "Developing pixel-perfect, highly responsive customer-facing web and native mobile application ecosystems.",
    fullDesc: "We create secure, engaging multi-platform solutions with lightning-fast initial load times, seamless global content distribution, and rich interactive layouts. Powered by React, Angular, and native frameworks, our apps achieve 99%+ user retention ratings.",
    category: "Software",
    features: [
      "Responsive web apps & Next.js architectures",
      "Cross-platform iOS and Android apps",
      "Modern design tokens & component design systems",
      "Offline-first sync engines & state persistence"
    ],
    architectureBlueprint: ["React 19 / Angular v18", "Native Swift / Kotlin", "Tailwind styling token engine", "Redux Toolkit state management"]
  },
  {
    id: "S-03",
    title: "Cloud & Intelligent DevOps Solutions",
    shortDesc: "Automating zero-downtime integration, continuous deployment pipelines, and global cloud infrastructure grids.",
    fullDesc: "Modernize your infrastructure using cloud-native designs. We build secure container systems, automated CI/CD pathways, and auto-scaling environments across AWS and Azure, reducing deployment cycle times from weeks to minutes while enforcing maximum security policies.",
    category: "Cloud",
    features: [
      "Kubernetes & Docker orchestration grids",
      "Infrastructure-as-Code (IaC) via Terraform",
      "Automated zero-downtime CI/CD workflows",
      "24/7 telemetry dashboards & cloud cost pruning"
    ],
    architectureBlueprint: ["AWS CloudFormation", "Docker containers", "Kubernetes cluster", "GitHub Actions", "Datadog / Prometheus"]
  },
  {
    id: "S-04",
    title: "Automated Quality Assurance & Testing",
    shortDesc: "Implementing continuous verification engines to catch defects before they ever touch production branches.",
    fullDesc: "Ensure pristine software execution with our automated test suites. We design modern QA environments that run mock data, integration checks, and end-to-end user tests across diverse browsers, ensuring your code remains production-ready 100% of the time.",
    category: "QA",
    features: [
      "Continuous regression checks in pipeline",
      "Multi-browser automated playbooks",
      "Performance, API, and load stress execution",
      "Mock services, sandbox testing setups"
    ],
    architectureBlueprint: ["Playwright frameworks", "Selenium grid integrations", "Karate DSL integrations", "Postman scripting runtimes"]
  },
  {
    id: "S-05",
    title: "AI & Big Data Analytics Engineering",
    shortDesc: "Harnessing enterprise machine learning pipelines and real-time streaming data warehouse architectures.",
    fullDesc: "Convert raw system transactions into actionable analytics. We build intelligent models, automate machine learning pipelines, and deploy secure Snowflake data warehouses that power multi-dimensional business reports at millisecond response speeds.",
    category: "Consulting",
    features: [
      "Predictive analytics & regression engines",
      "Real-time ETL/ELT pipelines & stream analytics",
      "Secure Snowflake & BigQuery setups",
      "Automated feature engineering systems"
    ],
    architectureBlueprint: ["Python analytics", "Apache Spark pipelines", "Snowflake data lakes", "TensorFlow & PyTorch services"]
  },
  {
    id: "S-06",
    title: "Dedicated Technical Team Augmentation",
    shortDesc: "Scaling your inner engineering capacity with vetted senior tech leads, developers, and QA architects.",
    fullDesc: "Skip hiring delays and instantly inject elite engineering talent into your sprint boards. Our senior developers are trained in agile methodologies, security compliance, and enterprise architectures, ready to deliver on day one.",
    category: "Consulting",
    features: [
      "Senior Full-Stack & Backend engineers",
      "Vetted Cloud Architects & Devops leads",
      "Professional agile project coordinators",
      "Flexible scaling with zero overhead risk"
    ],
    architectureBlueprint: ["Agile sprint alignments", "Slack & Jira communication", "Continuous pull-request checks", "Daily standup syncing"]
  }
];

export const industriesData: IndustryItem[] = [
  {
    id: "I-01",
    name: "Healthcare",
    tagline: "HIPAA-Compliant Medical Architectures",
    description: "Developing safe EHR systems, secure clinical portals, and remote health telemetry pipelines with pristine data privacy.",
    iconName: "HeartPulse",
    highlightMetric: "100% HIPAA Compliance"
  },
  {
    id: "I-02",
    name: "Finance",
    tagline: "High-Frequency Transaction Grids",
    description: "Architecting PCI-DSS certified payment pathways, digital investment portals, and ultra-secure transactional registries.",
    iconName: "ShieldCheck",
    highlightMetric: "99.999% Service Uptime"
  },
  {
    id: "I-03",
    name: "Retail & E-Commerce",
    tagline: "Hyper-Scale Dynamic Sales Hubs",
    description: "Powering real-time global stock engines, dynamic pricing layers, and automated high-throughput customer checkouts.",
    iconName: "ShoppingBag",
    highlightMetric: "4.2M Peak Daily Orders"
  },
  {
    id: "I-04",
    name: "Manufacturing",
    tagline: "Smart Factory IoT Telemetry",
    description: "Connecting factory machines with edge telemetry pipelines, automated assembly line analytics, and predictive breakdown boards.",
    iconName: "Cpu",
    highlightMetric: "34% Maintenance Savings"
  },
  {
    id: "I-05",
    name: "Logistics & Supply Chain",
    tagline: "Real-Time Fleet Routing",
    description: "Optimizing warehouse stocks, building precise delivery schedules, and tracking cargo containers live across global routes.",
    iconName: "Truck",
    highlightMetric: "18% Fuel Optimization"
  },
  {
    id: "I-06",
    name: "Government",
    tagline: "Secure Citizen Operations",
    description: "Building responsive public sector interfaces, digital documentation centers, and high-security state data systems.",
    iconName: "Landmark",
    highlightMetric: "FIPS 140-2 Encrypted"
  },
  {
    id: "I-07",
    name: "Education & EdTech",
    tagline: "Interactive Knowledge Platforms",
    description: "Developing scalable digital lecture platforms, adaptive student progress grids, and robust virtual testing systems.",
    iconName: "GraduationCap",
    highlightMetric: "1.2M Concurrent Users"
  },
  {
    id: "I-08",
    name: "Automotive & Smart Mobility",
    tagline: "Next-Gen Connected Vehicle APIs",
    description: "Powering telematics pipelines, vehicle diagnostics networks, and custom EV fleet charging optimization dashboards.",
    iconName: "CarFront",
    highlightMetric: "8ms Edge Response"
  }
];

export const techBadges: TechBadge[] = [
  { name: "Java", category: "Languages & Frameworks", rating: "Enterprise Core" },
  { name: "Spring Boot", category: "Languages & Frameworks", rating: "Microservices Master" },
  { name: "React", category: "Languages & Frameworks", rating: "Next-Gen Web" },
  { name: "Angular", category: "Languages & Frameworks", rating: "Corporate Standard" },
  { name: "Node.js", category: "Languages & Frameworks", rating: "Event-driven Core" },
  { name: "Python", category: "Languages & Frameworks", rating: "AI & Pipeline Core" },
  { name: "AWS", category: "Cloud & Infrastructure", rating: "Premier Partner" },
  { name: "Azure", category: "Cloud & Infrastructure", rating: "Gold Standard" },
  { name: "Docker", category: "Cloud & Infrastructure", rating: "Container Base" },
  { name: "Kubernetes", category: "Cloud & Infrastructure", rating: "Orchestration Standard" },
  { name: "Snowflake", category: "Data & Analytics", rating: "Data Warehouse" },
  { name: "DevOps Integration", category: "Cloud & Infrastructure", rating: "GitOps Standard" },
  { name: "Playwright", category: "Automation & QA", rating: "E2E Speed Champion" },
  { name: "Selenium", category: "Automation & QA", rating: "Global Standard" },
  { name: "Karate DSL", category: "Automation & QA", rating: "API Testing Star" },
  { name: "Postman Automation", category: "Automation & QA", rating: "Seamless Mocking" }
];

export const whyChooseData: WhyChooseItem[] = [
  {
    id: "W-01",
    title: "Experienced Senior Engineers",
    description: "Our teams consist exclusively of senior-tier engineers with a minimum of 7 years of production-level experience in global enterprise systems.",
    metric: "100% Senior"
  },
  {
    id: "W-02",
    title: "Agile Development Culture",
    description: "We deploy standard Scrum/Kanban disciplines with weekly feature drop cycles, providing 100% visibility to your product coordinators.",
    metric: "2-Week Sprints"
  },
  {
    id: "W-03",
    title: "Global Client Base",
    description: "Proudly supporting enterprises and fast-growing technology scaleups across North America, Europe, Asia, and the Middle East.",
    metric: "14+ Countries"
  },
  {
    id: "W-04",
    title: "Secure Delivery Pipeline",
    description: "We perform automated static analysis on every pull request, enforcing SOC2, ISO27001, and HIPAA compliance policies from the start.",
    metric: "SOC2 Aligned"
  },
  {
    id: "W-05",
    title: "24×7 Premium SLA Support",
    description: "Rest easy with dedicated emergency response teams standing by, maintaining an average system outage resolution time of under 18 minutes.",
    metric: "99.99% SLA"
  },
  {
    id: "W-06",
    title: "Rigorous Quality Assurance",
    description: "Every deployment undergoes multi-tier automated regression checks, UI verification scripts, and security penetration test loops.",
    metric: "0% Leakage Goal"
  },
  {
    id: "W-07",
    title: "Technical Innovation Labs",
    description: "We continuously research modern paradigms (e.g. LLM integration, edge execution) to keep your architectures highly performant.",
    metric: "R&D Focused"
  },
  {
    id: "W-08",
    title: "Scalable Architectural Design",
    description: "Our application layers utilize scale-to-zero strategies and event-driven databases, drastically reducing resource expenditures.",
    metric: "40% Cost Save"
  }
];

export const processStages: ProcessStage[] = [
  {
    id: 1,
    name: "Discovery & Analysis",
    tagline: "Synthesizing Requirements",
    description: "Our team collaborates with your stakeholders to examine legacy architectures, security constraints, and detailed product targets.",
    deliverable: "Architecture Blueprint & High-Level Scope Estimate"
  },
  {
    id: 2,
    name: "Detailed Planning",
    tagline: "Agile Milestone Mapping",
    description: "We create explicit sprint schedules, select optimal tech stacks, design API guidelines, and set up continuous testing rules.",
    deliverable: "Product Backlog & Development Schedule"
  },
  {
    id: 3,
    name: "Interactive UI/UX Design",
    tagline: "Designing Visual Interfaces",
    description: "Crafting beautiful interactive designs, customized typography components, and high-fidelity clickable wireframes.",
    deliverable: "Figma Prototypes & Design Token System"
  },
  {
    id: 4,
    name: "Elite Development",
    tagline: "Pristine Code Architecture",
    description: "Senior developers write clean, structured code, perform peer reviews, and deploy continuous code quality controls.",
    deliverable: "Production-grade Code Base in Private Repository"
  },
  {
    id: 5,
    name: "Advanced Automated Testing",
    tagline: "Continuous Assurance Loops",
    description: "Executing E2E UI scripts, API transaction checks, performance load spikes, and critical visual regressions.",
    deliverable: "Pristine QA Test Reports & Pipeline Badges"
  },
  {
    id: 6,
    name: "Zero-Downtime Deployment",
    tagline: "Deploying Code Securely",
    description: "Rolling out applications smoothly using container architectures and zero-downtime blue-green release profiles.",
    deliverable: "Live Cloud Production Systems"
  },
  {
    id: 7,
    name: "24/7 SLA Support",
    tagline: "Continuous Optimization",
    description: "Ongoing platform monitoring, cloud resource pruning, regular framework patches, and emergency support channels.",
    deliverable: "Active Monitoring Reports & SLA Guarantees"
  }
];

export const clientSuccessMetrics: SuccessMetric[] = [
  { id: "M-01", label: "Projects Delivered", value: "350+", subtext: "Highly complex enterprise systems and customer products launched globally." },
  { id: "M-02", label: "Client Satisfaction", value: "98.7%", subtext: "Net Promoter Score representing deep trust and multi-year collaboration." },
  { id: "M-03", label: "Countries Served", value: "14+", subtext: "Serving enterprise customers across APAC, Americas, and European theaters." },
  { id: "M-04", label: "Years of Experience", value: "12+", subtext: "Over a decade of solving hard software engineering and testing challenges." },
  { id: "M-05", label: "Team Strength", value: "180+", subtext: "Elite senior software architects, DevOps specialists, and QA developers." },
  { id: "M-06", label: "SLA Success Rate", value: "99.98%", subtext: "Consistent delivery of system uptime, response times, and sprint targets." }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "T-01",
    quote: "AI Infotech redesigned our core transactional ledger system. Their senior engineering team deployed clean Java and Spring Boot structures that effortlessly handle 10,000 requests/sec while maintaining SOC2 levels of data integrity.",
    author: "Elena Rostov",
    role: "VP of Enterprise Engineering",
    company: "Apex Global FinTech",
    logoText: "APEX // FINTECH"
  },
  {
    id: "T-02",
    quote: "By integrating AI Infotech's automated testing pipelines using Playwright, we slashed our regression cycle times from 14 hours down to 8 minutes. Their QA engineers are incredibly sharp, proactive, and truly understand agile delivery.",
    author: "Marc Henderson",
    role: "Director of Product Quality",
    company: "Scribe SaaS Platforms",
    logoText: "SCRIBE // SAAS"
  },
  {
    id: "T-03",
    quote: "Migrating our legacy retail system to a scalable AWS Kubernetes cluster was a daunting task. AI Infotech planned the transition with surgical precision, resulting in zero customer-facing downtime and a 42% reduction in monthly cloud spend.",
    author: "Siddharth Mehta",
    role: "Chief Technology Officer",
    company: "MetroCart Retailers",
    logoText: "METROCART // GROUP"
  }
];

export const benefitsData = [
  { title: "Remote-First Flexibility", desc: "Work from anywhere with core hour syncs, home-office equipment allowances, and internet coverage budgets." },
  { title: "Continuous Learning Fund", desc: "USD 1,500 annual allowance for technical certifications (AWS, Java, React), books, conferences, and courses." },
  { title: "Comprehensive Family Healthcare", desc: "Premium medical, dental, and vision insurance policies covering you, your partner, and your children." },
  { title: "Global Team Retreats", desc: "Annual all-expenses-paid corporate gatherings at premium destinations to celebrate milestone achievements together." },
  { title: "Sabbatical Policy", desc: "Take a fully paid 4-week sabbatical after every 3 years of tenure to relax, travel, and recharge." },
  { title: "Elite Hardware Stack", desc: "Equip your workspace with the latest 16\" Apple MacBook Pro, noise-canceling headsets, and 4K displays." }
];

export const hiringProcessData = [
  { step: "01", title: "Technical Application Screen", desc: "Our recruitment coordinators review your Github and technical expertise profiles to gauge general engineering alignment." },
  { step: "02", title: "Live System Design Pair-Up", desc: "An interactive 60-minute session with a Senior Principal Engineer discussing enterprise architecture layouts." },
  { step: "03", title: "Coding & Test Case Session", desc: "Write clean, test-driven logic in your language of choice (Java, Python, TS), emphasizing clean modular structure." },
  { step: "04", title: "Values & Offer Review", desc: "Understand our team culture, discuss salary models, benefits packages, and finalize onboarding dates." }
];

export const jobOpeningsData: JobOpening[] = [
  {
    id: "J-01",
    title: "Senior Lead Java / Spring Boot Architect",
    department: "Enterprise Software Division",
    location: "Bengaluru, India (Hybrid) / Remote Options",
    experience: "8+ Years",
    salaryRange: "₹24L - ₹32L per annum",
    type: "Full-Time",
    tags: ["Java", "Spring Boot", "Kafka", "SQL", "Microservices"],
    requirements: [
      "Extensive experience architecting secure, scalable microservices architectures.",
      "Expert knowledge of Spring Boot, JPA/Hibernate, SQL, and database caching patterns.",
      "Hands-on production expertise with event streams (Kafka, RabbitMQ) and distributed state.",
      "Strong dedication to clean code, solid principles, and writing comprehensive test suites."
    ]
  },
  {
    id: "J-02",
    title: "Senior Lead QA Automation Developer (Playwright)",
    department: "Quality Assurance Division",
    location: "Remote (India)",
    experience: "6+ Years",
    salaryRange: "₹18L - ₹25L per annum",
    type: "Full-Time",
    tags: ["Playwright", "Typescript", "Selenium", "API Testing", "CI/CD"],
    requirements: [
      "Proven track record creating robust, reusable end-to-end testing frameworks in Playwright.",
      "Exceptional command of TypeScript or JavaScript scripting languages.",
      "Direct experience integrating automated checkbooks within Jenkins, GitLab, or GitHub Actions pipelines.",
      "Capable of testing REST APIs, web performance, and writing comprehensive security regression suites."
    ]
  },
  {
    id: "J-03",
    title: "Lead Cloud Infrastructure Engineer (DevOps & K8s)",
    department: "Cloud & Devops Division",
    location: "Remote (India) / Mumbai Hub",
    experience: "7+ Years",
    salaryRange: "₹22L - ₹28L per annum",
    type: "Full-Time",
    tags: ["Kubernetes", "AWS", "Terraform", "Docker", "CI/CD"],
    requirements: [
      "Highly proficient with AWS or Azure cloud offerings, holds active certifications.",
      "Production-level mastery of Kubernetes orchestration grids and containerization best practices.",
      "Deep expertise in writing clean Infrastructure-as-Code setups via Terraform.",
      "Familiar with application telemetry platforms like Datadog, Grafana, and Prometheus."
    ]
  },
  {
    id: "J-04",
    title: "Senior React / Frontend Engineer",
    department: "Digital Web Platforms",
    location: "Bengaluru, India (Hybrid)",
    experience: "5+ Years",
    salaryRange: "₹16L - ₹22L per annum",
    type: "Full-Time",
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"],
    requirements: [
      "Excellent mastery of React, including modern hooks, state management, and component architectures.",
      "Deep understanding of web performance, Core Web Vitals, and SEO requirements.",
      "Expert skills styling pixel-perfect responsive layouts using Tailwind CSS.",
      "Strong appreciation for user experience, accessibility (WCAG), and responsive layout transitions."
    ]
  }
];

export interface CourseItem {
  id: string;
  title: string;
  duration: string;
  level: string;
  shortDesc: string;
  longDesc: string;
  topics: string[];
  toolsCovered: string[];
  marketDemand: string;
}

export interface AlumniPlacement {
  id: string;
  name: string;
  oldRole: string;
  newRole: string;
  company: string;
  packageMultiplier: string;
  story: string;
}

export const coursesData: CourseItem[] = [
  {
    id: "AC-01",
    title: "Software Testing Foundation & SQL Core",
    duration: "6 Weeks",
    level: "Beginner to Intermediate",
    shortDesc: "Master manual testing methodologies, bug life cycles, test case design, and structural relational SQL query structures.",
    longDesc: "The core starting point for elite QA. Learn manual validation, sanity, regression, sanity testing methodologies under Agile Scrum systems, paired with rich SQL database validation queries and schema joins.",
    topics: [
      "Software Test Life Cycle (STLC) & Bug Reporting",
      "Writing Test Cases & Traceability Matrices",
      "Agile & Scrum Sprints in Jira Boards",
      "SQL Selects, Group By, Complex Joins & DDL/DML"
    ],
    toolsCovered: ["Jira", "Mantis Bug Tracker", "PostgreSQL", "MySQL Workbench"],
    marketDemand: "92% YoY Hiring Volume Increase"
  },
  {
    id: "AC-02",
    title: "Enterprise Test Automation with Selenium & Java",
    duration: "8 Weeks",
    level: "Intermediate to Advanced",
    shortDesc: "Deep-dive into Java programming, object-oriented principles, and Selenium WebDriver automation framework orchestration.",
    longDesc: "Our flagship program. We transition you from manual testing to writing professional automation code in Java. You will build comprehensive Hybrid, Data-Driven, and BDD Cucumber frameworks from absolute scratch.",
    topics: [
      "Core Java Basics & Advanced OOPs (Inheritance, Polymorphism)",
      "Selenium WebDriver Commands & Element Locators",
      "TestNG, Maven, Page Object Model (POM) Design Patterns",
      "BDD Cucumber Framework & Gherkin Language Integration"
    ],
    toolsCovered: ["Java 21", "Selenium WebDriver", "TestNG", "Maven", "Cucumber", "Eclipse / IntelliJ"],
    marketDemand: "Highest Enterprise Contract Count"
  },
  {
    id: "AC-03",
    title: "Next-Gen Web Automation with Playwright & TypeScript",
    duration: "6 Weeks",
    level: "Intermediate to Advanced",
    shortDesc: "Engineer modern, hyper-fast end-to-end tests for SPAs and microservices using Microsoft Playwright and TypeScript.",
    longDesc: "The choice of high-tech SaaS groups. Master auto-waiting, network intercepting, cross-browser compatibility, tracing, and parallel execution pipelines that run ten times faster than legacy systems.",
    topics: [
      "TypeScript Syntax & Async-Await Scripting Patterns",
      "Playwright Locators, Assertions, and Auto-Waiting",
      "Page Object Models, Custom Hooks & Global State Setup",
      "Visual Regression, Network Mocking & Authentication Storage"
    ],
    toolsCovered: ["Playwright", "TypeScript", "Node.js", "VS Code", "GitHub Actions"],
    marketDemand: "Fastest Growing Modern QA Standard"
  },
  {
    id: "AC-04",
    title: "Advanced REST API Automation & Microservices Testing",
    duration: "4 Weeks",
    level: "Intermediate to Advanced",
    shortDesc: "Orchestrate automated test suites for RESTful APIs and microservices using Postman, SoapUI, and RestAssured frameworks.",
    longDesc: "Gain the specialized skill of headless validation. Learn to construct requests, parse JSON/XML payloads, write response validation scripts, assert status codes, and schedule continuous API checks in Git pipelines.",
    topics: [
      "HTTP Protocols, Methods (GET, POST, PUT, DELETE) & Headers",
      "Postman Collections, Variables, and Environments Setup",
      "RestAssured Framework scripting with Java and Hamcrest",
      "JSON Schema validation & Token-Based JWT Authorization"
    ],
    toolsCovered: ["Postman API", "RestAssured", "Hamcrest", "SoapUI", "Jackson Core"],
    marketDemand: "Mandatory for Microservices Architectures"
  },
  {
    id: "AC-05",
    title: "Cloud Infrastructure, DevOps & CI/CD Pipelines",
    duration: "6 Weeks",
    level: "Advanced",
    shortDesc: "Configure automated code pipelines, container architectures, and scalable cloud environments on AWS.",
    longDesc: "Learn to orchestrate GitOps pipelines that deploy and test software automatically on every commit. Learn Docker container systems, Kubernetes clusters, and AWS server nodes under industry best practices.",
    topics: [
      "Git, Github Branching, Pull-Requests, and Actions Setup",
      "Docker Image Creation, Dockerfiles, and Container Running",
      "AWS Cloud Infrastructure Core (EC2, S3, IAM, VPC Mesh)",
      "Jenkins CI/CD Server pipelines & Slack notifications"
    ],
    toolsCovered: ["Docker", "Kubernetes", "AWS Console", "Jenkins", "Git", "Terraform Core"],
    marketDemand: "Core of Modern Engineering Operations"
  }
];

export const alumniPlacements: AlumniPlacement[] = [
  {
    id: "AL-01",
    name: "Rohan Deshmukh",
    oldRole: "Manual QA Tester (2.4L per annum)",
    newRole: "Senior QA Automation Engineer",
    company: "Cognizant Technology Solutions",
    packageMultiplier: "3.2x Salary Boost",
    story: "Rohan worked for two years doing purely manual sheet-based sanity testing. He took our 8-week Selenium + Java academy, mastered POM and framework building, and transitioned directly into an automation lead role at Cognizant."
  },
  {
    id: "AL-02",
    name: "Priya Sharma",
    oldRole: "Non-IT Graduate (Career Gap)",
    newRole: "QA Automation Developer",
    company: "TCS Digital",
    packageMultiplier: "Placement Achieved",
    story: "After a 3-year gap following her graduation, Priya struggled to find engineering entry points. She enrolled in our manual testing and Playwright programs, finished 12 mock projects, and secured a direct position via our partner network."
  },
  {
    id: "AL-03",
    name: "Amit Patel",
    oldRole: "Junior Developer (3.6L per annum)",
    newRole: "Cloud Devops & Pipeline Engineer",
    company: "Capgemini India",
    packageMultiplier: "2.8x Salary Boost",
    story: "Amit was stuck in simple bug-fixing and SQL scripts. Through our Cloud DevOps academy, he learned Docker, AWS, and GitLab Actions, establishing himself as a key operational specialist before getting placed at Capgemini."
  }
];

