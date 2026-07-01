export interface AuditIssue {
  id: string;
  category: "Homepage" | "About" | "Services" | "Careers" | "Contact" | "Navigation" | "Footer" | "Typography" | "Visual Identity" | "Accessibility" | "Performance";
  title: string;
  impact: "High" | "Medium" | "Low";
  currentProblem: string;
  whyBadUX: string;
  bestPractice: string;
  exactSolution: string;
}

export interface RedesignStrategy {
  page: string;
  currentState: string;
  targetVision: string;
  keyChanges: string[];
}

export interface WireframeSection {
  name: string;
  layoutType: string;
  description: string;
  keyElements: string[];
}

export const auditIssues: AuditIssue[] = [
  {
    id: "NAV-01",
    category: "Navigation",
    title: "Non-sticky, Outdated Navigation Bar",
    impact: "High",
    currentProblem: "The header is static, disappearing on scroll, with default alignment, poor contrast, and lacks clear focus indicator states.",
    whyBadUX: "Forces users to scroll all the way back to the top to navigate, creating friction and increasing bounce rates on long pages.",
    bestPractice: "Sticky navigation or smart-hide header that reappears on scroll-up. Clean glassmorphic background with 70% opacity, backdropped blur, active indicator trails, and custom interaction feedback.",
    exactSolution: "Implement a sticky `backdrop-blur-md` glass navigation with dynamic height adjustment on scroll, a subtle border-b, clearly highlighted CTA buttons, and keyboard tab focus outlines."
  },
  {
    id: "HERO-01",
    category: "Homepage",
    title: "Generic 'Hero' Banner and Weak Value Proposition",
    impact: "High",
    currentProblem: "Generic stock imagery, vague claims of 'excellence', low contrast headline text over complex background, and secondary buttons of equal visual weight.",
    whyBadUX: "Fails to capture interest in the first 3 seconds. The user cannot quickly tell what makes AI Infotech different from thousands of other IT agencies.",
    bestPractice: "A clear, bold headline explaining target business value (e.g. 'We engineer elite software architectures for global enterprises'), dual distinct CTA weights (primary fill vs secondary outline), and motion-graphics representing tech-stack telemetry.",
    exactSolution: "Design a split-column hero featuring Space Grotesk typography, an interactive canvas background with floating tech illustrations, dual CTAs ('Schedule Strategy Call' and 'Explore Solutions'), and concrete statistics (e.g. '99.2% SLA Adherence') directly under the CTAs."
  },
  {
    id: "SERV-01",
    category: "Services",
    title: "Flat, Uninspired Service Cards",
    impact: "High",
    currentProblem: "Services are listed in flat, static container grids with wall-of-text paragraphs, missing actionable 'Learn More' trails, and lacking interactive hover feedback.",
    whyBadUX: "Overwhelms users cognitively. Flat text blocks look lazy and outdated, discouraging users from exploring specific technical offerings.",
    bestPractice: "Bento-grid styled cards with custom SVG icons (rather than generic stock images), brief 2-sentence summaries, subtle gradient borders, and active hover scales with nested ArrowRight icon transitions.",
    exactSolution: "Create modular hover-responsive cards utilizing Framer Motion. Add dynamic border gradients (`hover:border-primary-500/50`), micro-interactions where icons translate or glow, and explicit modal sliders for service-specific technical blueprints."
  },
  {
    id: "TECH-01",
    category: "Homepage",
    title: "Static Text List of Technologies",
    impact: "Medium",
    currentProblem: "Technologies (Java, React, AWS) are either hidden or listed as simple bullet points or raw text, understating engineering capacity.",
    whyBadUX: "Fails to showcase modern technical capabilities to architects and engineering leaders, who scan for tech stacks visually.",
    bestPractice: "Interactive tech stack directories styled as high-contrast animated badges, categorized by domain (Frontend, Backend, Cloud, DevOps, Quality), with hover tooltips and official vector logos.",
    exactSolution: "Develop an interactive, animated horizontal ribbon or categorizable directory of tech badges. Implement tag-based filtering (e.g., 'Cloud & Infrastructure', 'Backend Core', 'Automation Testing') with micro-scaling animations."
  },
  {
    id: "CARE-01",
    category: "Careers",
    title: "Vague Hiring Process and Missing 'Life at Company' Section",
    impact: "Medium",
    currentProblem: "The current careers page features a simple generic text callout or static list of 'send resume here' email links. No culture statements, no benefits listed, no timeline of recruitment phases.",
    whyBadUX: "Deters top-tier talent. Elite candidates expect transparency in the hiring journey, clear workplace benefits, and evidence of a modern progressive culture.",
    bestPractice: "Provide a 4-step clear visual hiring timeline, explicitly enumerate key pillars of benefits (e.g., remote-first, learning budget, wellness allowances), and feature real-time searchable job boards with clear requirements.",
    exactSolution: "Integrate a recruitment center inside the SPA. Include an interactive culture slider, a modern grid detailing benefits with custom-styled icons, an animated recruitment timeline, and active role listings with instant interactive application modals."
  },
  {
    id: "CONT-01",
    category: "Contact",
    title: "Generic Contact Form and Missing Interactive Maps",
    impact: "High",
    currentProblem: "Static standard forms with no client-side verification, generic success alerts, and text-only address lines that are difficult to locate.",
    whyBadUX: "High friction in lead generation. Users are unsure if the form actually submitted or when they will receive a response, leading to low conversion rates.",
    bestPractice: "Form with inline error validation, custom success dialogs, an explicit SLA promise (e.g. 'Response within 4 Business Hours'), and an interactive custom map highlighting international office nodes.",
    exactSolution: "Design a premium dual-pane contact hub. The left pane features rich contact data, office operating hours, and an interactive vector-drawn map node. The right pane features a multi-step validated form with skeleton-loading indicators and a clear SLA promise."
  },
  {
    id: "TYPO-01",
    category: "Typography",
    title: "Poor Font Choices and Lacking Visual Hierarchy",
    impact: "High",
    currentProblem: "Standard default serif/sans fonts with generic sizes and low contrast ratios. Headings are small and indistinguishable from body text, leading to heavy visual fatigue.",
    whyBadUX: "Creates a cheap, unprofessional look. Poor typography breaks reader engagement and hides critical selling points.",
    bestPractice: "Carefully paired typography (such as Space Grotesk/Outfit for bold tech headings and Inter for optimal body legibility). Explicit mathematical line-height, kerning, and size hierarchy (e.g., h1: 4.5rem, body: 1rem).",
    exactSolution: "Apply 'Space Grotesk' for displays and 'Inter' for UI/Body. Introduce tracking-tight on headers, spacious leading on paragraph structures, and strict typographic hierarchy mapping to semantic tags."
  },
  {
    id: "COLOR-01",
    category: "Visual Identity",
    title: "Dull, Monotonous Color Palette",
    impact: "Medium",
    currentProblem: "Plain blues and grays without a consistent primary/secondary identity, making the visual look identical to generic late-90s templates.",
    whyBadUX: "Lacks brand recall. Does not convey modern tech leadership, energy, or elite engineering maturity.",
    bestPractice: "Develop a premium corporate theme: Deep Indigo primary, Electric Teal secondary, Dark Charcoal neutrals, and subtle soft-accent color tints with glowing radial highlights.",
    exactSolution: "Define a modern high-contrast color scheme (Deep Slate `#0F172A`, Electric Azure `#3B82F6`, Cyber Teal `#06B6D4`, Emerald `#10B981` success metrics). Implement custom radial light glows behind cards for a Vercel/Stripe-like depth."
  },
  {
    id: "PERF-01",
    category: "Performance",
    title: "Heavy Stock Images and Lack of Lazy Loading",
    impact: "High",
    currentProblem: "Unoptimized heavy stock images that block initial page render. No asset preloading or layout shifts protection (missing width/height specifications).",
    whyBadUX: "High load times cause drop-offs, especially on mobile networks, destroying the conversion rate before the user even views the brand.",
    bestPractice: "Utilize lightweight vector illustrations, compress all images, implement lazy loading (`loading=\"lazy\"`), and set skeleton-placeholder grids for loading states.",
    exactSolution: "Replace stock images with sleek vector SVG animations and custom CSS illustration modules. Wrap all interactive components in dynamic skeletons and ensure responsive element ratios prevent layout shifts (CLS)."
  },
  {
    id: "ACC-01",
    category: "Accessibility",
    title: "Lack of Web Accessibility (WCAG Non-Compliance)",
    impact: "High",
    currentProblem: "Missing alt text on assets, low color-contrast text, non-semantic button tags, and complete lack of keyboard-navigation supports (no focus outlines).",
    whyBadUX: "Excludes users with visual/motor disabilities, creates legal exposure, and degrades general user experience for keyboard navigators.",
    bestPractice: "Strict compliance with WCAG 2.1 AA standards. Ensure minimum text contrast ratios of 4.5:1, implement proper focus states, use ARIA labels, and ensure full keyboard trap mitigation.",
    exactSolution: "Incorporate semantic HTML structures (`<header>`, `<main>`, `<article>`, `<footer>`). Add `aria-label` tags to all icon buttons, ensure focusable rings (`focus-visible:ring-2 focus-visible:ring-primary-500`), and run regular contrast calculations."
  }
];

export const pageStrategies: RedesignStrategy[] = [
  {
    page: "Homepage Redesign",
    currentState: "Outdated template, static banners, flat feature listings, no concrete proof of engineering pedigree, basic layouts.",
    targetVision: "An interactive, visually arresting enterprise gateway styled after elite innovators like Vercel, Stripe, and Cloudflare.",
    keyChanges: [
      "Add glassmorphic floating header with active scroll triggers and full focus states.",
      "Build dynamic hero banner featuring animated tech-stack constellations and high-profile trust metrics.",
      "Integrate an interactive bento-grid showcasing multi-disciplinary services with expandable detail sheets.",
      "Deploy live client-success metrics using animated countdown tickers and responsive validation proofs."
    ]
  },
  {
    page: "About & Pedigree Redesign",
    currentState: "Hidden inside a wall of text or generic timeline, detailing high-level corporate jargon without cultural evidence.",
    targetVision: "A premium corporate blueprint detailing our global footstep, elite engineering practices, and core operational values.",
    keyChanges: [
      "Design an interactive 'Why Choose Us' grid highlighting security, agile delivery, and global scale.",
      "Build a beautifully structured animated engineering process pipeline (Discovery -> Support).",
      "Include structured data showcasing exact delivery metrics (Team Strength, SLA compliance)."
    ]
  },
  {
    page: "Services Hub Redesign",
    currentState: "Six boring bullets. No engineering depth, no mention of specific architectures, APIs, or dev methodologies.",
    targetVision: "A granular engineering services showroom. Every service is depicted as an advanced architecture component.",
    keyChanges: [
      "Implement premium cards with micro-hover translations and custom-themed illustration overlays.",
      "Incorporate 'Learn More' action items that slide details smoothly into view without page refreshes.",
      "Provide blueprint schematics for each division (e.g. QA, Frontend, Cloud migrations)."
    ]
  },
  {
    page: "Careers & Culture Redesign",
    currentState: "An static, isolated text block saying 'submit CV'. No incentive for premium tech talent.",
    targetVision: "A modern, high-energy hiring portal highlighting our culture, global freedom, learning benefits, and clear journey timeline.",
    keyChanges: [
      "Display an attractive grid of perks (e.g., remote-first flexibility, 24/7 learning accounts).",
      "Draft a 4-stage recruitment pipeline representing complete clarity of candidate evaluation.",
      "Feature open roles with detailed interactive requirements, tags, and immediate apply hooks."
    ]
  },
  {
    page: "Contact & Conversion Redesign",
    currentState: "Plain email list or an unstyled unvalidated webform with zero feedback loop.",
    targetVision: "A responsive, client-centered sales engine designed to maximize enterprise inbound leads.",
    keyChanges: [
      "Implement instant client-side field validation with visual error rings.",
      "Add a clear response SLA guarantee (e.g., 'Enterprise Response in under 4 Hours').",
      "Create an interactive global office locator with clean click-to-focus coordinates."
    ]
  }
];

export const wireframeSections: WireframeSection[] = [
  {
    name: "Hero Visual Wireframe",
    layoutType: "Asymmetric Split (60% Content, 40% Dynamic Illustration)",
    description: "A bold, expansive display layout placing maximum focus on our core value statement while using the right-side visual space to present dynamic, interactive framework configurations.",
    keyElements: [
      "Aesthetic header with global brandmark and interactive Strategy Switcher.",
      "H1 displaying primary high-impact headline in Space Grotesk.",
      "Dual CTA container aligned horizontally with distinct aesthetic weights.",
      "Underneath stats panel showing trust markers (Projects, Countries, Team Size) in JetBrains Mono."
    ]
  },
  {
    name: "Services Bento Grid Wireframe",
    layoutType: "3-Column Multi-Height Responsive Grid",
    description: "An elegant, interactive bento layout grouping our core architectural services into high-contrast glass cards. High-priority services occupy 2 columns of width for perfect visual rhythm.",
    keyElements: [
      "Category tags at card top-left highlighting specialization.",
      "Glowing animated hover gradients inside borders.",
      "Micro-icons that shift position by 4px on mouse hover.",
      "Explicit expandable sheet triggers for system architectural diagrams."
    ]
  },
  {
    name: "Careers & Open Openings Wireframe",
    layoutType: "Dual-Pane Interactive Recruitment Layout",
    description: "The left pane introduces company benefits and remote-first culture with structured modular components. The right pane maintains an active directory of jobs with rich search tags.",
    keyElements: [
      "Interactive role search bars with tag filters (React, QA, Python).",
      "Animated 'Recruitment Phase' roadmap showing evaluation criteria.",
      "Quick Application sliders allowing resume drops."
    ]
  }
];

export const brandPalette = {
  primary: { name: "Deep Slate", hex: "#0F172A", role: "Dark slate background, grounding the canvas in enterprise-grade premium density." },
  secondary: { name: "Electric Azure", hex: "#3B82F6", role: "Brilliant primary accent, used for high-importance CTAs, focus highlights, and active states." },
  accent: { name: "Cyber Teal", hex: "#06B6D4", role: "Secondary accent, used for glowing gradients, badge icons, and interactive hover outlines." },
  neutral: { name: "Pure Silver", hex: "#F8FAFC", role: "Light mode backdrop and high-contrast text contrast on dark canvases." },
  success: { name: "Emerald Mint", hex: "#10B981", role: "Positive feedback alerts, active recruitment status, and core statistic counters." }
};
