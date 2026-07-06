import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { LogIn, AlertCircle, X, Mail, Lock } from "lucide-react";
import RedesignPreview from "./components/RedesignPreview";
import CareersPage from "./components/CareersPage";
import { Job } from "./types";
import { supabase } from "./lib/supabase";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home"); // "home" | "careers"
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved !== null ? saved === "dark" : true; // default to immersive dark
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  const mapSupabaseJobToJob = (job: Record<string, any>): Job => ({
    id: job.id,
    title: job.title || "",
    category: job.category || "",
    type: job.job_type || "",
    location: job.location || "",
    experience: job.experience || undefined,
    salaryRange: job.salary || undefined,
    description: job.description || undefined,
    summary: job.description || undefined,
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    qualifications: Array.isArray(job.requirements) ? job.requirements : [],
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
  });

  const refreshJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("id,title,category,job_type,location,experience,salary,description,responsibilities,requirements")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load jobs from Supabase", error);
      setJobs([]);
      return;
    }

    setJobs((data || []).map(mapSupabaseJobToJob));
  };

  useEffect(() => {
    void refreshJobs();
  }, []);

  // Recruiter logged in state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("recruiter_logged_in") === "true";
  });

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (error) {
          setLoginError(error.message);
        }

        const authenticated = Boolean(session?.user);
        setIsLoggedIn(authenticated);
        if (authenticated) {
          localStorage.setItem("recruiter_logged_in", "true");
          setCurrentPage("careers");
          if (window.location.hash !== "#careers") {
            window.location.hash = "#careers";
          }
        } else {
          localStorage.removeItem("recruiter_logged_in");
          setCurrentPage("home");
          if (window.location.hash) {
            window.location.hash = "";
          }
        }
      } finally {
        if (isMounted) {
          setAuthChecking(false);
        }
      }
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const authenticated = Boolean(session?.user);
      setIsLoggedIn(authenticated);

      if (authenticated) {
        localStorage.setItem("recruiter_logged_in", "true");
        setCurrentPage("careers");
        window.location.hash = "#careers";
      } else {
        localStorage.removeItem("recruiter_logged_in");
        setCurrentPage("home");
        window.location.hash = "";
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Login form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

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
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

    setIsSubmittingLogin(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message || "Unable to sign in. Please try again.");
        return;
      }

      if (data.session?.user) {
        setIsLoggedIn(true);
        localStorage.setItem("recruiter_logged_in", "true");
        setLoginEmail("");
        setLoginPassword("");
        setIsLoginModalOpen(false);
        setCurrentPage("careers");
        window.location.hash = "#careers";
        showToast("Access Granted: Welcome back, Recruiter!", "success");
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    localStorage.removeItem("recruiter_logged_in");
    setIsLoginModalOpen(false);
    setCurrentPage("home");
    window.location.hash = "";
    showToast("Successfully Logged Out", "info");
  };

  if (authChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? "bg-[#151526] text-white" : "bg-[#f4f5f8] text-slate-900"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-accent-primary/30 border-t-accent-primary animate-spin" />
          <p className="text-sm font-mono uppercase tracking-[0.3em]">Checking session</p>
        </div>
      </div>
    );
  }

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
            onOpenLogin={handleOpenLogin}
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
            onOpenLogin={handleOpenLogin}
            onLogout={handleLogout}
            showToast={showToast}
            onRefreshJobs={refreshJobs}
          />
        )}
      </main>

      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md p-6 border backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden ${
                isDarkMode
                  ? "bg-[#16162a]/90 border-white/10 text-white"
                  : "bg-white/95 border-slate-200 text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
                  isDarkMode
                    ? "border-white/10 hover:bg-white/5 text-slate-400 hover:text-white"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
                {loginError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
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
                  disabled={isSubmittingLogin}
                  className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-black text-xs font-mono tracking-wider font-bold uppercase py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingLogin ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      <span>Signing In</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <LogIn className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
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

