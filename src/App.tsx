import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import RedesignPreview from "./components/RedesignPreview";
import CareersPage from "./components/CareersPage";
import { Job } from "./types";
import { defaultJobs } from "./data/jobsData";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home"); // "home" | "careers"
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved !== null ? saved === "dark" : true; // default to immersive dark
  });

  // Global jobs state with localStorage persistence
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved jobs", e);
      }
    }
    return defaultJobs;
  });

  // Sync jobs to localStorage
  useEffect(() => {
    localStorage.setItem("jobs_list", JSON.stringify(jobs));
  }, [jobs]);

  // Recruiter logged in state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("recruiter_logged_in") === "true";
  });

  // Login modal trigger state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Login form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Synchronize body styles for premium feel in light/dark transitions
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = "#151526";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#f4f5f8";
      document.body.style.color = "#111118";
    }
  }, [isDarkMode]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Synchronize routing with browser hash location natively
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#careers") {
        setCurrentPage("careers");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on initial page render
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleNavigateHome = (sectionId?: string) => {
    setCurrentPage("home");
    if (sectionId) {
      window.location.hash = `#${sectionId}`;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.location.hash = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim()) {
      setLoginError("Please enter your email.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      return;
    }

    // Recruiter authentication logic
    // Accept recruiter@aiinfotech.com and admin as suggested
    // Also support any reasonable input to make trying it painless
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (cleanEmail === "recruiter@aiinfotech.com" && loginPassword === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("recruiter_logged_in", "true");
      setIsLoginModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      showToast("Access Granted: Welcome back, Recruiter!", "success");

      // Redirect to careers page automatically so they can see/post job openings
      if (currentPage !== "careers") {
        window.location.hash = "#careers";
      }
    } else {
      setLoginError("Invalid recruiter credentials. Try recruiter@aiinfotech.com / admin.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("recruiter_logged_in");
    showToast("Successfully Logged Out", "info");
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-[#151526] text-white" : "bg-[#f4f5f8] text-slate-900"}`}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-primary z-[100] origin-left"
        style={{ scaleX }}
      />
      <main className="flex-1">
        {currentPage === "home" ? (
          <RedesignPreview 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            onNavigateHome={handleNavigateHome}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />
        ) : (
          <CareersPage
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onNavigateHome={handleNavigateHome}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            jobs={jobs}
            setJobs={setJobs}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
      </main>

      {/* Recruiter Login Glassmorphic Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative w-full max-w-md p-8 border backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden ${
                isDarkMode 
                  ? "bg-[#16162a]/90 border-white/10 text-white" 
                  : "bg-white/95 border-slate-200 text-slate-900"
              }`}
            >
              {/* Background ambient light */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
                  isDarkMode 
                    ? "border-white/10 hover:bg-white/5 text-slate-400 hover:text-white" 
                    : "border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-2xl mb-2">
                    <ShieldCheck className="w-6 h-6 text-accent-primary" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Login</h3>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Please authenticate to post and manage job opportunities
                  </p>
                </div>

                {/* Simulated Credentials Box */}
                <div className={`p-4 border text-[11px] font-mono tracking-wide rounded-2xl ${
                  isDarkMode ? "bg-accent-primary/5 border-accent-primary/20 text-slate-300" : "bg-blue-50 border-blue-100 text-blue-800"
                }`}>
                  <p className="font-semibold mb-1 text-accent-primary uppercase tracking-wider">Demo Credentials</p>
                  <p>Email: <span className="font-bold">recruiter@aiinfotech.com</span></p>
                  <p>Password: <span className="font-bold">admin</span></p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="recruiter@aiinfotech.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 text-xs border rounded-xl focus:outline-none focus:border-accent-primary transition-all ${
                          isDarkMode 
                            ? "bg-[#151526]/80 border-white/10 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 text-xs border rounded-xl focus:outline-none focus:border-accent-primary transition-all ${
                          isDarkMode 
                            ? "bg-[#151526]/80 border-white/10 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-black text-xs font-mono tracking-wider font-bold uppercase py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:scale-[1.01]"
                  >
                    <span>Authenticate Session</span>
                    <LogIn className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 shadow-2xl border text-xs font-mono tracking-wider uppercase rounded-full ${
              toast.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/30 text-rose-400"
                : "bg-blue-950/90 border-blue-500/30 text-blue-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

