import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  ShieldCheck, ArrowRight, Check, Mail, Phone, Clock, MapPin, 
  Users, Activity, Settings, Terminal, Send, Menu, X, 
  Code, Info, ChevronDown, CheckCircle, Cpu, Layers, Globe, Smartphone, BarChart3, Database,
  Sun, Moon
} from "lucide-react";
import InteractiveMap from "./InteractiveMap";

interface RedesignPreviewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  onNavigateHome: (sectionId?: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function RedesignPreview({ 
  isDarkMode, 
  toggleDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  onNavigateHome,
  onOpenLogin,
  onLogout
}: RedesignPreviewProps) {
  // Typing animation state for Hero
  const wordsToType = ["Innovation", "Automation", "Intelligence", "Scalability"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Run typing loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = wordsToType[currentWordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
        setTypingSpeed(150);
      }, typingSpeed);
    }

    if (!isDeleting && typedText === currentWord) {
      // Pause at full word before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % wordsToType.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentWordIndex]);

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Accordion active index for "Professional Support" section
  const [activeAccordion, setActiveStage] = useState<number | null>(0);

  // Careers register state
  const [careerSuccess, setCareerSuccess] = useState(false);
  const [careerForm, setCareerForm] = useState({ name: "", email: "", resume: "" });
  
  // Contact Form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactErrors, setContactErrors] = useState<{ [key: string]: string }>({});
  const [contactSuccess, setContactSuccess] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // Section refs for target-based parallax scrolling
  const storySectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  // Scroll triggers and transforms for parallax
  const { scrollY } = useScroll();
  
  // Hero section parallax: background image shifts slightly down during scroll
  const yHero = useTransform(scrollY, [0, 1000], [0, 240]);

  // Story section image parallax
  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storySectionRef,
    offset: ["start end", "end start"]
  });
  const yStory = useTransform(storyScrollProgress, [0, 1], [-50, 50]);

  // Services section banner image parallax
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesSectionRef,
    offset: ["start end", "end start"]
  });
  const yServices = useTransform(servicesScrollProgress, [0, 1], [-80, 80]);

  // Toast notifications state
  interface Toast {
    id: string;
    message: string;
    type: "success" | "info" | "error";
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Themes / design tokens dynamically aligned with light / dark mode
  const themeCanvas = isDarkMode 
    ? "bg-[#151526] text-white selection:bg-accent-primary/30" 
    : "bg-[#f4f5f8] text-slate-900 selection:bg-accent-primary/20";

  const themeCard = isDarkMode
    ? "bg-[#16162a]/40 backdrop-blur-md border border-white/5 rounded-none p-6 transition-all duration-300 hover:border-accent-primary/30 hover:shadow-[0_0_25px_rgba(255,130,0,0.15)]"
    : "bg-white border border-slate-200 rounded-none p-6 transition-all duration-300 hover:border-accent-primary/40 hover:shadow-[0_4px_25px_rgba(255,130,0,0.1)]";

  const themeTextMuted = isDarkMode
    ? "text-slate-300 text-sm font-medium leading-relaxed"
    : "text-slate-700 text-sm font-medium leading-relaxed";

  const themeTitle = isDarkMode 
    ? "text-white font-sans tracking-tight" 
    : "text-slate-900 font-sans tracking-tight";

  const themeHeader = isDarkMode
    ? "bg-[#151526]/85 backdrop-blur-xl border-b border-white/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
    : "bg-white/85 backdrop-blur-xl border-b border-slate-200/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)]";

  const themeInput = isDarkMode
    ? "bg-[#16162a] border border-white/10 text-white text-[12px] p-3 focus:outline-none focus:border-accent-primary/60 focus:shadow-[0_0_15px_rgba(255,130,0,0.15)] transition-all"
    : "bg-white border border-slate-300 text-slate-800 text-[12px] p-3 focus:outline-none focus:border-accent-primary/60 focus:shadow-[0_0_15px_rgba(255,130,0,0.1)] transition-all";

  // Framer Motion variants for stagger container and card items
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerCardItem = {
    hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: 6 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 14,
      },
    },
  };

  // Handle Contact Submit
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!contactForm.name.trim()) errors.name = "Full Name is required";
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = "Invalid email address";
    }
    if (!contactForm.message.trim()) {
      errors.message = "Comment or Message is required";
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setSubmittingContact(true);

    setTimeout(() => {
      setSubmittingContact(false);
      setContactSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleCareerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!careerForm.name.trim() || !careerForm.email.trim()) return;
    setCareerSuccess(true);
    setTimeout(() => {
      setCareerSuccess(false);
      setCareerForm({ name: "", email: "", resume: "" });
    }, 2500);
  };

  const accordions = [
    {
      title: "Cutting-Edge Technologies",
      content: "Stay ahead of the competition by leveraging the latest advancements in software development, including AI, machine learning, and blockchain technology. Our team is proficient in utilizing these technologies to create innovative and efficient solutions."
    },
    {
      title: "Tailored Solutions",
      content: "Receive customized software solutions designed to meet the unique needs of your business. Our expert team collaborates closely with you to understand your requirements and deliver results that align with your objectives."
    },
    {
      title: "Scalable Services",
      content: "Adapt to changing business demands with our scalable software solutions. Whether you need to expand your system’s capabilities or optimize performance, our services grow with your business."
    },
    {
      title: "Dedicated Support Team",
      content: "Enjoy continuous support and maintenance from our dedicated team of professionals. We provide ongoing assistance to address any issues, implement updates, and ensure your software remains up-to-date and effective."
    },
    {
      title: "Future-Proofing Your Business",
      content: "Stay prepared for future challenges and opportunities with our forward-thinking approach. We design software solutions that are adaptable and ready to evolve with technological advancements and market changes."
    }
  ];

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${themeCanvas}`}>
      
      {/* 1. FIXED GLASS NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${themeHeader}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Company logo with blue accent */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <div className="flex items-center gap-0">
                <span className={`text-xl font-extrabold tracking-tight font-sans uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  AIINF
                </span>
                <span className="relative flex items-center justify-center w-5 h-5">
                  <svg className="w-5 h-5 shrink-0 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer circle power ring */}
                    <path 
                      d="M 50 15 C 25 15 15 35 15 55 C 15 75 35 90 55 90 C 75 90 90 75 90 55 C 90 42 82 30 72 23" 
                      stroke="url(#blue-gradient-nav)" 
                      strokeWidth="14" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    {/* Inner upward swoosh/flame */}
                    <path 
                      d="M 45 68 C 45 68 32 50 48 35 C 53 30 58 20 58 20 C 58 20 62 32 58 45 C 54 58 66 65 66 65 C 66 65 55 72 45 68 Z" 
                      fill="url(#blue-gradient-nav)" 
                    />
                    <defs>
                      <linearGradient id="blue-gradient-nav" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="40%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={`text-xl font-extrabold tracking-tight font-sans uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  TECH
                </span>
              </div>
              <span className="text-[8px] font-mono tracking-widest text-[#7b7d8c] uppercase block mt-1">
                Enterprise Solutions
              </span>
            </div>
          </a>

          {/* Navigation links with color transition to blue */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase">
            {["Home", "About Us", "Our Services", "Careers", "Contact Us"].map((link, idx) => {
              const hrefs = ["#hero", "#aboutUs", "#ourServices", "#careers", "#contactMessage"];
              return (
                <a 
                  key={idx} 
                  href={hrefs[idx]} 
                  className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 relative py-1.5 group font-medium`}
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent-primary group-hover:w-full transition-all duration-300" />
                </a>
              );
            })}
            
            {/* Recruiter Access Action */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-300/30 dark:border-white/10">
                <a
                  href="#careers"
                  className="text-accent-primary font-bold hover:text-accent-secondary transition-colors duration-300 py-1.5 relative group"
                >
                  Recruiter Panel
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-primary" />
                </a>
                <button
                  onClick={onLogout}
                  className={`${isDarkMode ? "text-rose-400/90" : "text-rose-600/90"} hover:text-rose-500 transition-colors text-[10px] font-mono font-bold uppercase cursor-pointer`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 relative py-1.5 group font-medium cursor-pointer`}
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent-primary group-hover:w-full transition-all duration-300" />
              </button>
            )}
          </nav>

          {/* Active Navigation CTA */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isDarkMode 
                  ? "bg-[#16162a]/80 border-white/10 text-white hover:text-accent-primary hover:border-accent-primary/40" 
                  : "bg-white border-slate-200 text-slate-800 hover:text-accent-primary hover:border-accent-primary/40"
              }`}
              aria-label="Toggle light/dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-accent-primary" /> : <Moon className="w-4 h-4 text-accent-primary" />}
            </button>

            <a 
              href="#contactMessage" 
              className="hidden sm:inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase text-black bg-accent-primary px-5 py-2.5 font-semibold hover:bg-accent-secondary hover:shadow-[0_0_20px_rgba(255,130,0,0.3)] transition-all duration-300 rounded-full"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full border transition-all ${
                isDarkMode 
                  ? "border-white/10 text-white hover:text-accent-primary hover:border-accent-primary/40" 
                  : "border-slate-300 text-slate-800 hover:text-accent-primary hover:border-accent-primary/40"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`lg:hidden fixed inset-x-0 top-[65px] z-40 py-8 px-6 shadow-2xl flex flex-col gap-5 border-b transition-colors duration-300 ${isDarkMode ? "bg-[#151526] border-white/5" : "bg-white border-slate-200"}`}
          >
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Home</a>
            <a href="#aboutUs" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>About Us</a>
            <a href="#ourServices" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Our Services</a>
            <a href="#careers" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Careers</a>
            <a href="#contactMessage" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Contact Us</a>
            
            {/* Recruiter Login in Mobile Drawer */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-300/30 dark:border-white/10">
                <a 
                  href="#careers" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-sm font-mono uppercase text-accent-primary font-bold"
                >
                  Recruiter Panel
                </a>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }} 
                  className="text-left text-sm font-mono uppercase text-rose-500 font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }} 
                className="text-left text-sm font-mono uppercase text-accent-primary font-bold cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between text-sm font-mono uppercase py-2 transition-colors ${
                isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"
              }`}
            >
              <span>Theme: {isDarkMode ? "Dark" : "Light"}</span>
              {isDarkMode ? <Sun className="w-4 h-4 text-accent-primary" /> : <Moon className="w-4 h-4 text-accent-primary" />}
            </button>

            <a 
              href="#contactMessage"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-accent-primary text-black font-mono uppercase text-xs font-bold py-3 hover:bg-accent-secondary rounded-full"
            >
              Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO / TOP LANDING SECTION */}
      <section id="hero" className={`relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-8 overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-[#151526]" : "bg-slate-50"}`}>
        {/* Immersive background group members project collaboration photo overlayed with dark filter */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
            alt="Enterprise project team collaboration"
            style={{ y: yHero }}
            className={`w-full h-[120%] object-cover select-none transition-opacity duration-300 absolute -top-[10%] left-0 ${isDarkMode ? "opacity-[0.35]" : "opacity-[0.5]"}`}
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? "from-[#151526]/40 via-[#151526]/80 to-[#151526]" : "from-slate-50/20 via-slate-50/50 to-slate-50"}`} />
        </div>

        {/* Subtle mesh gradient background (blue radial gradients) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.06),transparent_70%)] blur-[120px]" />
          <div 
            style={{ 
              backgroundImage: isDarkMode 
                ? `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`
                : `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`
            }}
            className="absolute inset-0 bg-[size:5rem_5rem] opacity-25" 
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-20 w-full text-center flex flex-col items-center justify-center space-y-8">
          
          {/* Animated pulsing blue badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-accent-primary uppercase font-bold">
              Enterprise AI Infrastructure &amp; Consulting
            </span>
          </div>

          <div className="space-y-6">
            <h1 className={`text-4xl sm:text-6xl lg:text-[76px] font-light tracking-tighter leading-[0.95] ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              We are <br />
              <span className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-dark to-accent-secondary uppercase">
                {typedText}
              </span>
              <span className="text-accent-primary font-light animate-pulse ml-1 text-4xl sm:text-6xl lg:text-[76px]">|</span> <br />
              <span className={`font-sans text-3xl sm:text-5xl lg:text-[60px] tracking-tight block mt-4 font-normal ${isDarkMode ? "text-white" : "text-slate-800"}`}>for Modern Enterprises</span>
            </h1>
            
            <p className={`text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
              Empowering corporate performance with high-performance business technology consulting, software automation workflows, and specialized talent staffing models designed for scale.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
            <a 
              href="#contactMessage" 
              onClick={() => addToast("Establishing connection channel. Scroll down to message our enterprise experts!", "success")}
              className="bg-accent-primary text-black font-semibold font-mono text-[13px] uppercase tracking-wider px-8 py-4 rounded-full hover:bg-accent-secondary transition-all shadow-[0_4px_25px_rgba(255,130,0,0.3)] hover:shadow-[0_4px_35px_rgba(255,130,0,0.45)] text-center hover:scale-[1.03] duration-300"
            >
              Connect With Us
            </a>
            <a 
              href="#ourServices" 
              className={`border font-semibold font-mono text-[13px] uppercase tracking-wider px-8 py-4 rounded-full transition-all text-center hover:scale-[1.03] duration-300 ${
                isDarkMode 
                  ? "border-white/15 text-white hover:border-accent-primary/50 hover:bg-white/5" 
                  : "border-slate-300 text-slate-800 hover:border-accent-primary/50 hover:bg-slate-100"
              }`}
            >
              Explore Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION SECTION */}
      <section className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#0a0a0a]/40" : "border-slate-200 bg-slate-100/30"}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* Vision card with precise hover perspective scale */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(255,130,0,0.25)" }}
            className={`p-8 sm:p-10 rounded-none flex flex-col justify-between space-y-6 ${themeCard}`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-none bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20">
                <Info className="w-6 h-6" />
              </div>
              <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Our Vision</h2>
              <p className={themeTextMuted}>
                AIINFOTECH envisions a future where technology transcends legacy operational boundaries, enriching global workflow productivity. We strive to be at the forefront of continuous digital execution, crafting code that fuels sustainable performance benchmarks.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5">
              <span className="text-[10px] font-mono tracking-wider text-accent-secondary uppercase font-semibold">Empowerment • Continuous Innovation • Scaled Systems</span>
            </div>
          </motion.div>

          {/* Mission card with precise hover perspective scale */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(255,130,0,0.25)" }}
            className={`p-8 sm:p-10 rounded-none flex flex-col justify-between space-y-6 ${themeCard}`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-none bg-accent-secondary/10 flex items-center justify-center text-accent-secondary border border-accent-secondary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Our Mission</h2>
              <p className={themeTextMuted}>
                Our mission is to craft reliable, enterprise-grade staffing architectures and software delivery frameworks that address business critical bottlenecks. We foster technical integrity, operational longevity, and client-centric compassion.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5">
              <span className="text-[10px] font-mono tracking-wider text-accent-primary uppercase font-semibold">Engineered Longevity • Compliance Standards • Client Integration</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* NEW 3D SCROLL & PHOTO GRID (THINK, TRUST, TINKER PHILOSOPHY) */}
      <section className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#0a0a0a]/20" : "border-slate-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-primary uppercase font-bold">Our Philosophy</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>How We Build Solutions</h2>
            <p className={themeTextMuted}>
              Delivering high-end, modern solutions starts with an environment that values deep contemplation, client alignment, and relentless iteration.
            </p>
          </div>

          <motion.div 
            style={{ perspective: "1200px" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                id: "think",
                title: "THINK",
                desc: "Thoughtful, creative, curious minds build the best software systems and automation frameworks.",
                img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop"
              },
              {
                id: "trust",
                title: "TRUST",
                desc: "Transparency, respect, and deep integration. Collaboration built on reliable, open partnerships.",
                img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
              },
              {
                id: "tinker",
                title: "TINKER",
                desc: "The most brilliant solutions come from endless experimentation. Tinkerers and builders, unite.",
                img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop"
              }
            ].map((card, idx) => (
              <motion.div
                key={card.id}
                variants={staggerCardItem}
                whileHover={{ y: -8, rotateX: 2, scale: 1.02 }}
                className={`border overflow-hidden flex flex-col group transition-all duration-300 hover:border-accent-primary/20 hover:shadow-[0_10px_30px_rgba(255,130,0,0.12)] rounded-2xl ${
                  isDarkMode 
                    ? "bg-[#16162a]/35 border-white/5" 
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {/* 3D tilt entry image container */}
                <div className={`relative h-64 overflow-hidden border-b ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                  <img 
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-80 ${isDarkMode ? "from-[#16162a] via-[#16162a]/20" : "from-white via-white/20"}`} />
                </div>
                
                {/* Text and visual titles */}
                <div className="p-8 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3 text-left">
                    <h3 className={`text-2xl font-bold tracking-widest group-hover:text-accent-primary transition-colors font-sans ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {card.desc}
                    </p>
                  </div>
                  <div className={`pt-4 border-t flex items-center justify-between text-[11px] font-mono tracking-wider text-accent-secondary uppercase ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                    <span>Phase 0{idx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary group-hover:scale-150 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. OUR STORY SECTION */}
      <section id="aboutUs" ref={storySectionRef} className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#151526]" : "border-slate-200 bg-slate-50"}`} style={{ perspective: "1000px" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story left column / Image with 3D entry */}
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className={`lg:col-span-5 relative overflow-hidden h-[360px] lg:h-[450px] border shadow-2xl ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
          >
            <div className="absolute inset-0 bg-accent-primary/5 blur-3xl rounded-full pointer-events-none z-10" />
            <motion.img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2074&auto=format&fit=crop"
              alt="Professional team collaborating in a modern office"
              style={{ y: yStory }}
              className="absolute -top-[20%] left-0 w-full h-[140%] object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Story right column / Content with elegant upward transition */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-[11px] font-mono tracking-widest text-accent-primary uppercase font-bold bg-accent-primary/10 px-3 py-1 rounded-full border border-accent-primary/20">
              Corporate Background
            </span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>Our Story</h2>
            
            <div className={`space-y-6 text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              <p>
                AI INFOTECH specializes in delivering top-notch software development, outsourcing solutions, and consulting services. Our mission is to be a leading provider in these fields, serving clients across diverse industries and application domains.
              </p>
              <p>
                We offer a comprehensive range of software development services, including web and mobile app development, custom software solutions, software testing, and ongoing maintenance. By leveraging cutting-edge technologies and development methodologies, we ensure the delivery of high-quality software that aligns with our clients’ requirements.
              </p>
            </div>
            
            <div className="pt-4">
              <a 
                href="#contactMessage" 
                onClick={() => addToast("Connecting with our support team! Redirecting you to the form below.", "success")}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-primary hover:text-white font-bold transition-colors"
              >
                <span>Connect with our representatives</span>
                <ArrowRight className="w-4 h-4 text-accent-primary" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. BRING INNOVATION TO YOUR COMPANY (The 6 Pillars Grid) */}
      <section className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#0a0a0a]/40" : "border-slate-200 bg-slate-100/30"}`}>
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-primary uppercase font-bold">Value Proposition</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>Bring Innovation To Your Company</h2>
            <p className={themeTextMuted}>
              How we construct long-term relationships based on open cooperation, specialized talent, and mutual business success.
            </p>
          </div>

          <motion.div 
            style={{ perspective: "1000px" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Global Reach",
                desc: "We operate on an international scale, providing services to clients across various regions and industries, ensuring a broad reach and diverse expertise."
              },
              {
                title: "Dedication To Client Contentment",
                desc: "Our primary goal is to ensure our clients are fully satisfied with our services. We strive to exceed expectations and deliver exceptional results that align with our clients’ needs and goals."
              },
              {
                title: "Expert Professionals",
                desc: "Our team consists of highly skilled and experienced professionals who bring a wealth of knowledge and expertise to every project. We are committed to continuous learning and development to stay at the forefront of industry advancements."
              },
              {
                title: "Effective Communication",
                desc: "We prioritize clear and open communication with our clients, ensuring transparency and collaboration throughout the project lifecycle. Our approach facilitates understanding and alignment with our clients’ objectives."
              },
              {
                title: "Client Focused Approach",
                desc: "Our services are designed with the client in mind, emphasizing personalized solutions and a deep understanding of each client’s unique requirements. We are committed to building long-term relationships based on trust and mutual success."
              },
              {
                title: "Innovative Solutions",
                desc: "We embrace innovation and creativity in developing our services and solutions. By leveraging the latest technologies and methodologies, we deliver cutting-edge results that drive our clients’ success and keep them ahead in their industries."
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                variants={staggerCardItem}
                whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(255,130,0,0.25)" }}
                className={`space-y-4 ${themeCard}`}
              >
                <div className="w-10 h-10 rounded-none bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20 font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{pillar.title}</h3>
                <p className={themeTextMuted}>{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 6. WHY AI INFOTECH SOLUTIONS */}
      <section className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#151526]" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-secondary uppercase font-semibold">Why Corporate Partners Align with Us</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>Why AI Infotech Solutions?</h2>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "Industry Expertise",
                desc: "We have experience working across various industries such as healthcare, finance, retail, manufacturing, and logistics. We understand the unique challenges faced by each industry and provide tailored solutions to meet their clients’ specific requirements."
              },
              {
                title: "Agile Methodologies",
                desc: "The company follows agile methodologies to deliver software solutions that are flexible, scalable, and adaptable. We work closely with their clients to ensure that the development process is transparent, collaborative, and efficient."
              },
              {
                title: "Quality Assurance",
                desc: "We have a dedicated quality assurance team that ensures that all software solutions are thoroughly tested and meet the highest standards of quality. We use automated testing tools and manual testing techniques to ensure that the software is bug-free and performs as expected."
              },
              {
                title: "Client-centric Approach",
                desc: "We are committed to delivering solutions that meet their clients’ needs and exceed their expectations. We work closely with their clients to understand their requirements and provide solutions that are tailored to their unique needs."
              }
            ].map((choose, idx) => (
              <motion.div 
                key={idx} 
                variants={staggerCardItem}
                whileHover={{ y: -4, scale: 1.015, borderColor: "rgba(255,130,0,0.25)" }}
                className={`flex flex-col justify-between space-y-4 ${themeCard}`}
              >
                <div className="space-y-3">
                  <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    {choose.title}
                  </h3>
                  <p className={themeTextMuted}>{choose.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 7. DETAILED SERVICES SECTION */}
      <section id="ourServices" ref={servicesSectionRef} className="py-24 px-4 sm:px-8 border-b border-white/5 bg-[#0a0a0a]/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="w-full h-64 overflow-hidden relative shadow-lg mb-16 border border-white/10">
            <motion.img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
              alt="Abstract technology representation"
              style={{ y: yServices }}
              className="absolute -top-[50%] left-0 w-full h-[200%] object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-primary uppercase font-bold">Our Specialized Capabilities</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>Our Services</h2>
            <p className={themeTextMuted}>
              Comprehensive Solutions for Your Business Needs
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "Software Consulting",
                desc: "Get expert advice and guidance on technology strategy, enterprise architecture, and digital transformation to optimize your business processes and achieve your goals.",
                icon: <Cpu className="w-6 h-6 text-accent-primary" />
              },
              {
                title: "Testing & Automation",
                desc: "Ensure the reliability and efficiency of your software with comprehensive testing and automation services, identifying issues early and reducing manual efforts.",
                icon: <Layers className="w-6 h-6 text-accent-primary" />
              },
              {
                title: "Staffing & Outsourcing",
                desc: "Augment your team with skilled professionals and outsource projects to enhance efficiency, reduce costs, and focus on core business activities.",
                icon: <Globe className="w-6 h-6 text-accent-primary" />
              },
              {
                title: "Technical Support",
                desc: "Receive continuous technical assistance and maintenance from our dedicated support team to keep your systems running smoothly and resolve issues promptly.",
                icon: <Activity className="w-6 h-6 text-accent-primary" />
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx} 
                variants={staggerCardItem}
                whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(255,130,0,0.25)" }}
                className={`flex flex-col justify-between space-y-6 ${themeCard}`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-none bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                    {service.icon}
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{service.title}</h3>
                  <p className={themeTextMuted}>{service.desc}</p>
                </div>
                
                <div className={`pt-4 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                  <a href="#contactMessage" className={`text-xs font-mono uppercase tracking-wider text-accent-primary font-bold inline-flex items-center gap-1.5 ${isDarkMode ? "hover:text-white" : "hover:text-slate-900"}`}>
                    <span>Inquire about this Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 8. BE IN DEMAND WITH OUR PROFESSIONAL SUPPORT (ACCORDIONS) */}
      <section className={`py-24 px-4 sm:px-8 border-b relative transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#151526]" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-4xl mx-auto space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-secondary uppercase font-semibold">Professional Support Integration</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Be in Demand with Our Support
            </h2>
            <p className={`max-w-2xl mx-auto ${themeTextMuted}`}>
              Empower your business with cutting-edge, tailored, and scalable solutions backed by expert support and robust security.
            </p>
          </div>

          {/* Interactive Accordion Stack */}
          <div className="space-y-4">
            {accordions.map((acc, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? isDarkMode
                        ? "bg-[#16162a] border-accent-primary/40 shadow-[0_0_20px_rgba(255,130,0,0.1)]"
                        : "bg-white border-accent-primary/40 shadow-[0_4px_20px_rgba(255,130,0,0.1)]"
                      : isDarkMode
                        ? "bg-[#16162a]/30 border-white/5 hover:border-accent-primary/20"
                        : "bg-slate-100/50 border-slate-200 hover:border-accent-primary/20"
                  }`}
                >
                  <button
                    onClick={() => setActiveStage(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`font-semibold text-sm sm:text-base hover:text-accent-primary transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      {acc.title}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-accent-primary transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className={`px-6 pb-6 pt-1 text-[12px] leading-relaxed border-t font-medium ${isDarkMode ? "border-white/5 text-slate-300" : "border-slate-100 text-slate-600"}`}>
                          {acc.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. WE ARE ALWAYS ON THE LOOKOUT FOR AWESOME PEOPLE (CAREERS) */}
      <section id="careers" className={`py-24 px-4 sm:px-8 border-b relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#0a0a0a]/40" : "border-slate-200 bg-slate-100/30"}`}>
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent-primary/10 blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-accent-primary uppercase font-bold">Work With Us</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter max-w-2xl mx-auto leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              We are always on the lookout for awesome people to work with us.
            </h2>
            <p className={`max-w-xl mx-auto ${themeTextMuted}`}>
              We are constantly seeking passionate, motivated professionals to augment our software testing, development, and support divisions. Submit your interest instantly or visit our dedicated careers listing above.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {careerSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Application Logged</h4>
                <p className="text-xs text-slate-400">Our recruitment team (recruiting@aiinfotech.co.in) will reach out to you shortly!</p>
              </div>
            ) : (
              <form onSubmit={handleCareerSubmit} className="space-y-3 text-left">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={careerForm.name}
                  onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                  className={`w-full ${themeInput}`}
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  required
                  value={careerForm.email}
                  onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                  className={`w-full ${themeInput}`}
                />
                <input
                  type="text"
                  placeholder="LinkedIn or Portfolio Link"
                  value={careerForm.resume}
                  onChange={(e) => setCareerForm({ ...careerForm, resume: e.target.value })}
                  className={`w-full ${themeInput}`}
                />
                <button
                  type="submit"
                  className="w-full bg-accent-primary hover:bg-accent-secondary text-black font-mono font-bold text-[12px] uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md cursor-pointer hover:shadow-[0_0_20px_rgba(255,130,0,0.3)]"
                >
                  Send Career Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. SEND US A MESSAGE SECTION (CONTACT) */}
      <section id="contactMessage" className="py-24 px-4 sm:px-8 border-b border-white/5 bg-[#151526] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-accent-secondary uppercase font-semibold">Initiate Communication</span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>Send Us a Message</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side text information */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Thank you for your interest in AIINFOTECH</h3>
              
              <div className={`space-y-4 text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                <p>
                  We’re here to help you optimize your technology investments and achieve your business goals. Whether you have a question, need a consultation, or want to learn more about our services, feel free to reach out to us. We’d love to hear from you!
                </p>
                <p>
                  Our business hours are from Monday to Friday, 9:00 AM to 5:00 PM Indian Standard Time. If you’re unable to reach us during these hours, please leave us a message, and we’ll get back to you as soon as possible.
                </p>
              </div>

               <div className={`space-y-4 pt-6 border-t ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                <div className="flex gap-3.5 items-start">
                  <div className={`p-2 rounded-full border text-accent-primary ${isDarkMode ? "bg-[#16162a] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-mono uppercase tracking-widest ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-500"}`}>Recruiting Queries</p>
                    <a href="mailto:recruiting@aiinfotech.co.in" className={`text-[12px] hover:text-accent-primary font-semibold transition-colors mt-0.5 block ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      recruiting@aiinfotech.co.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className={`p-2 rounded-full border text-accent-primary ${isDarkMode ? "bg-[#16162a] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-mono uppercase tracking-widest ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-500"}`}>Main Office Location</p>
                    <p className={`text-[12px] font-semibold leading-relaxed mt-0.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>Chennai, India</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className={`p-2 rounded-full border text-accent-primary ${isDarkMode ? "bg-[#16162a] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-mono uppercase tracking-widest ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-500"}`}>General Contact Mail</p>
                    <a href="mailto:admin@aiinfotech.co.in" className={`text-[12px] hover:text-accent-primary font-semibold transition-colors mt-0.5 block ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      admin@aiinfotech.co.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side interactive Form */}
            <div className={`lg:col-span-7 p-6 sm:p-8 backdrop-blur-md border shadow-2xl rounded-2xl transition-colors duration-300 ${isDarkMode ? "bg-[#16162a]/40 border-white/5" : "bg-white border-slate-200/85"}`}>
              {contactSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Message Logged Successfully</h3>
                  <p className="text-sm text-[#7b7d8c] max-w-md mx-auto leading-relaxed">
                    Thank you! Your message has been routed to our corporate inbox at <span className="font-mono text-accent-primary font-bold">admin@aiinfotech.co.in</span>. A representative will connect with you via email shortly.
                  </p>
                  <button 
                    onClick={() => setContactSuccess(false)}
                    className={`px-5 py-2 border text-xs font-mono mt-4 cursor-pointer transition-colors rounded-full ${isDarkMode ? "border-white/10 text-white hover:bg-white/5" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono block uppercase font-semibold ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
                        Full Name <span className="text-accent-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="E.g. Siddharth Patel"
                        className={`w-full ${themeInput} ${contactErrors.name ? "border-accent-primary" : ""}`}
                      />
                      {contactErrors.name && <p className="text-[10px] text-accent-primary font-mono">{contactErrors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono block uppercase font-semibold ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
                        Email Address <span className="text-accent-primary">*</span>
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="E.g. s.patel@corporate.com"
                        className={`w-full ${themeInput} ${contactErrors.email ? "border-accent-primary" : ""}`}
                      />
                      {contactErrors.email && <p className="text-[10px] text-accent-primary font-mono">{contactErrors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono block uppercase font-semibold ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="E.g. Partnership Opportunity / Consultation request"
                      className={`w-full ${themeInput}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono block uppercase font-semibold ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
                      Comment or Message <span className="text-accent-primary">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please enter your questions, comments, or concerns here..."
                      className={`w-full resize-none ${themeInput} ${contactErrors.message ? "border-accent-primary" : ""}`}
                    />
                    {contactErrors.message && <p className="text-[10px] text-accent-primary font-mono">{contactErrors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="w-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_20px_rgba(255,130,0,0.3)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingContact ? "Sending Message..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Interactive Global Map Component rendering offices */}
          <div className="space-y-6 pt-10">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-accent-primary uppercase font-bold block">Office Telemetry Map</span>
              <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Global Office Operations Map</h3>
            </div>
            <InteractiveMap isDark={isDarkMode} />
          </div>

        </div>
      </section>

      {/* 11. FOOTER SECTION */}
      <footer className={`border-t text-left py-16 px-4 sm:px-8 transition-colors duration-300 ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-slate-100 border-slate-200"}`}>
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b pb-12 mb-8 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
          
          {/* Logo column */}
          <div className="space-y-4">
            <div className="flex items-center gap-0">
              <span className={`text-xl font-extrabold tracking-tight font-sans uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                AIINF
              </span>
              <span className="relative flex items-center justify-center w-5 h-5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer circle power ring */}
                  <path 
                    d="M 50 15 C 25 15 15 35 15 55 C 15 75 35 90 55 90 C 75 90 90 75 90 55 C 90 42 82 30 72 23" 
                    stroke="url(#blue-gradient-footer)" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                  {/* Inner upward swoosh/flame */}
                  <path 
                    d="M 45 68 C 45 68 32 50 48 35 C 53 30 58 20 58 20 C 58 20 62 32 58 45 C 54 58 66 65 66 65 C 66 65 55 72 45 68 Z" 
                    fill="url(#blue-gradient-footer)" 
                  />
                  <defs>
                    <linearGradient id="blue-gradient-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="40%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className={`text-xl font-extrabold tracking-tight font-sans uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                TECH
              </span>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed font-medium max-w-xs">
              Providing modern enterprise-grade custom business solutions, staffing, and technology architectures to stay resilient.
            </p>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h4 className={`font-mono uppercase text-xs font-bold tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>Solutions</h4>
            <ul className={`space-y-2 text-[12px] font-mono ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
              <li><a href="#ourServices" className="hover:text-accent-primary transition-colors">Software Consulting</a></li>
              <li><a href="#ourServices" className="hover:text-accent-primary transition-colors">Testing &amp; Automation</a></li>
              <li><a href="#ourServices" className="hover:text-accent-primary transition-colors">Staffing Solutions</a></li>
              <li><a href="#ourServices" className="hover:text-accent-primary transition-colors">Technical Maintenance</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className={`font-mono uppercase text-xs font-bold tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>Company</h4>
            <ul className={`space-y-2 text-[12px] font-mono ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
              <li><a href="#aboutUs" className="hover:text-accent-primary transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-accent-primary transition-colors">Careers listing</a></li>
              <li><a href="#contactMessage" className="hover:text-accent-primary transition-colors">Support Channels</a></li>
              <li><a href="#aboutUs" className="hover:text-accent-primary transition-colors">Our Standard Policies</a></li>
            </ul>
          </div>

          {/* System status column */}
          <div className="space-y-4">
            <h4 className={`font-mono uppercase text-xs font-bold tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>Operational Status</h4>
            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-[#16162a]/60 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
              <span className={`text-[11px] font-mono ${isDarkMode ? "text-white" : "text-slate-700"}`}>Cloud Node Status</span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className={`w-8 h-8 flex items-center justify-center rounded-full border hover:bg-accent-primary hover:text-black transition-all text-xs font-mono ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 text-white" 
                      : "bg-white border-slate-300 text-slate-700 shadow-sm"
                  }`}
                  aria-label={`Visit our ${social}`}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-500"}`}>
          <p>© 2026 AIINFOTECH. All rights reserved. Registered Chennai operations.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className={`pointer-events-auto flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#16162a]/95 backdrop-blur-lg border-emerald-500/20 text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                  : "bg-white/95 backdrop-blur-lg border-emerald-500/20 text-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                <Check className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 text-[11px] font-semibold leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className={`transition-colors cursor-pointer p-1 rounded-lg shrink-0 ${
                  isDarkMode 
                    ? "text-slate-400 hover:text-white hover:bg-white/5" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
