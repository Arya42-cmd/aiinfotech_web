import React, { useState, FormEvent, DragEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import RecruiterApplications from "./RecruiterApplications";
import RecruiterAnalytics from "./RecruiterAnalytics";
import { 
  Briefcase, Search, MapPin, Calendar, FileText, ChevronRight, ArrowLeft, 
  Upload, CheckCircle, Menu, X, Mail, AlertCircle, User, Phone, Terminal, ArrowRight,
  Sun, Moon, Plus, Trash2, Edit3, Save, Undo2
} from "lucide-react";
import { Job } from "../types";

interface CareersPageProps {
  onNavigateHome: (sectionId?: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  onOpenLogin: () => void;
  onLogout: () => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  onRefreshJobs: () => Promise<void>;
}

export default function CareersPage({ 
  onNavigateHome, 
  isDarkMode, 
  toggleDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  jobs,
  setJobs,
  onOpenLogin,
  onLogout,
  showToast,
  onRefreshJobs
}: CareersPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Application form states
  const [formSubmitted, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantBio, setApplicantBio] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [formError, setFormError] = useState("");

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recruiter form states
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isPublishingJob, setIsPublishingJob] = useState(false);
  const [recruiterPanelView, setRecruiterPanelView] = useState<"jobs" | "applications" | "analytics">("jobs");
  
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("Quality Assurance");
  const [jobType, setJobType] = useState("Full Time");
  const [jobLocation, setJobLocation] = useState("Chennai");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [jobResponsibilitiesStr, setJobResponsibilitiesStr] = useState("");
  const [jobQualificationsStr, setJobQualificationsStr] = useState("");

  const handlePostJob = async (e: FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      showToast("Job Title is required.", "error");
      return;
    }
    if (!jobCategory.trim()) {
      showToast("Category is required.", "error");
      return;
    }
    if (!jobType.trim()) {
      showToast("Job type is required.", "error");
      return;
    }
    if (!jobLocation.trim()) {
      showToast("Location is required.", "error");
      return;
    }
    if (!jobDescription.trim() && !jobSummary.trim()) {
      showToast("Either Description or Summary is required.", "error");
      return;
    }

    setIsPublishingJob(true);

    try {
      const responsibilities = jobResponsibilitiesStr
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const requirements = jobQualificationsStr
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        title: jobTitle.trim(),
        category: jobCategory.trim(),
        job_type: jobType.trim(),
        location: jobLocation.trim(),
        description: jobDescription.trim() || jobSummary.trim(),
        responsibilities,
        requirements,
        status: "Open",
      };

      if (editingJobId) {
        const { error } = await supabase.from("jobs").update(payload).eq("id", editingJobId);
        if (error) throw error;
        showToast("Job opening updated successfully!", "success");
        setEditingJobId(null);
      } else {
        const { error } = await supabase.from("jobs").insert(payload);
        if (error) throw error;
        showToast("Job opening posted successfully!", "success");
      }

      await onRefreshJobs();

      setJobTitle("");
      setJobCategory("Quality Assurance");
      setJobType("Full Time");
      setJobLocation("Chennai");
      setJobDescription("");
      setJobSummary("");
      setJobResponsibilitiesStr("");
      setJobQualificationsStr("");
      setIsPostFormOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to publish job right now.";
      showToast(message, "error");
    } finally {
      setIsPublishingJob(false);
    }
  };

  const handleEditClick = (job: Job) => {
    setEditingJobId(job.id);
    setJobTitle(job.title);
    setJobCategory(job.category);
    setJobType(job.type);
    setJobLocation(job.location);
    setJobDescription(job.description || "");
    setJobSummary(job.summary || "");
    setJobResponsibilitiesStr((job.responsibilities || []).join("\n"));
    setJobQualificationsStr((job.qualifications || []).join("\n"));
    setIsPostFormOpen(true);
    
    // Scroll to form cleanly
    setTimeout(() => {
      const formEl = document.getElementById("recruiter-form-anchor");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDeleteClick = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the job opening for "${title}"?`)) {
      try {
        const { error } = await supabase.from("jobs").delete().eq("id", id);
        if (error) throw error;
        await onRefreshJobs();
        showToast(`Successfully deleted job: ${title}`, "success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to delete job right now.";
        showToast(message, "error");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setJobTitle("");
    setJobCategory("Quality Assurance");
    setJobType("Full Time");
    setJobLocation("Chennai");
    setJobDescription("");
    setJobSummary("");
    setJobResponsibilitiesStr("");
    setJobQualificationsStr("");
    setIsPostFormOpen(false);
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

  // Dynamic filter criteria logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (job.summary && job.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "" || job.category === selectedCategory;
    const matchesType = selectedType === "" || job.type === selectedType;
    const matchesLocation = selectedLocation === "" || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesType && matchesLocation;
  });

  // Unique categories, types, and locations computed dynamically from state
  const categories = Array.from(new Set(jobs.map(j => j.category))).filter(Boolean);
  const types = Array.from(new Set(jobs.map(j => j.type))).filter(Boolean);
  const locations = Array.from(new Set(jobs.map(j => j.location))).filter(Boolean);

  // Drag and drop actions
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && ['pdf', 'doc', 'docx'].includes(extension)) {
      setUploadedFile(file);
      setFormError("");
    } else {
      setFormError("The selected file is not allowed. Only .pdf, .doc, and .docx are supported.");
    }
  };

  const handleApplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!applicantName.trim()) {
      setFormError("Please enter your Full Name.");
      return;
    }
    if (!applicantEmail.trim()) {
      setFormError("Please enter your Email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!applicantPhone.trim()) {
      setFormError("Please enter your Phone number.");
      return;
    }
    if (!applicantBio.trim()) {
      setFormError("Please write a short bio.");
      return;
    }
    if (!uploadedFile) {
      setFormError("Please upload your CV/Resume.");
      return;
    }
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setFormError("Resume must be 5MB or smaller.");
      return;
    }
    if (!privacyPolicyAccepted) {
      setFormError("You must accept the Privacy Policy to proceed.");
      return;
    }
    if (!selectedJob) {
      setFormError("Please select a valid job opening.");
      return;
    }

    setSubmitting(true);

    try {
      let resumeUrl: string | null = null;

      if (uploadedFile) {
        try {
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resumes")
            .upload(fileName, uploadedFile, {
              cacheControl: "3600",
              upsert: false,
              contentType: uploadedFile.type || "application/octet-stream",
            });

          if (!uploadError && uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
              .from("resumes")
              .getPublicUrl(uploadData.path);

            resumeUrl = publicUrlData?.publicUrl || null;
          }
        } catch {
          resumeUrl = null;
        }
      }

      const { error: insertError } = await supabase.from("applications").insert({
        job_id: selectedJob,
        full_name: applicantName.trim(),
        email: applicantEmail.trim(),
        phone: applicantPhone.trim(),
        cover_letter: applicantBio.trim(),
        resume_url: resumeUrl,
        status: "Applied",
      });

      if (insertError) {
        throw insertError;
      }

      showToast("Your application has been submitted successfully.", "success");
      handleResetForm();
      setFormSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit your application right now.";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPhone("");
    setApplicantBio("");
    setUploadedFile(null);
    setPrivacyPolicyAccepted(false);
    setFormSuccess(false);
    setFormError("");
  };

  const activeJobData = jobs.find(j => j.id === selectedJob);

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${themeCanvas}`}>
      
      {/* 1. FIXED GLASS NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${themeHeader}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Company logo with blue accent */}
          <button onClick={() => onNavigateHome("hero")} className="flex items-center gap-3 group text-left">
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
                      stroke="url(#blue-gradient-careers-header)" 
                      strokeWidth="14" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    {/* Inner upward swoosh/flame */}
                    <path 
                      d="M 45 68 C 45 68 32 50 48 35 C 53 30 58 20 58 20 C 58 20 62 32 58 45 C 54 58 66 65 66 65 C 66 65 55 72 45 68 Z" 
                      fill="url(#blue-gradient-careers-header)" 
                    />
                    <defs>
                      <linearGradient id="blue-gradient-careers-header" x1="0%" y1="100%" x2="100%" y2="0%">
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
          </button>

          {/* Navigation links with color transition to blue */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase">
            <button onClick={() => onNavigateHome("hero")} className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 py-1.5 font-medium cursor-pointer`}>Home</button>
            <button onClick={() => onNavigateHome("aboutUs")} className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 py-1.5 font-medium cursor-pointer`}>About Us</button>
            <button onClick={() => onNavigateHome("ourServices")} className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 py-1.5 font-medium cursor-pointer`}>Our Services</button>
            <button onClick={() => { setSelectedJob(null); window.scrollTo(0, 0); }} className="text-accent-primary font-semibold transition-colors py-1.5 cursor-pointer">Careers</button>
            <button onClick={() => onNavigateHome("contactMessage")} className={`${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"} hover:text-accent-primary transition-colors duration-300 py-1.5 font-medium cursor-pointer`}>Contact Us</button>
            
            {/* Recruiter Access Link */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-300/30 dark:border-white/10">
                <span className="text-accent-primary font-bold py-1.5 text-[10px]">
                  Recruiter Mode
                </span>
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

            <button 
              onClick={() => onNavigateHome("contactMessage")}
              className="hidden sm:inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase text-black bg-accent-primary px-5 py-2.5 font-semibold hover:bg-accent-secondary hover:shadow-[0_0_20px_rgba(255,130,0,0.3)] transition-all duration-300 rounded-full"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

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
            <button onClick={() => { setMobileMenuOpen(false); onNavigateHome("hero"); }} className={`text-left text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Home</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigateHome("aboutUs"); }} className={`text-left text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>About Us</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigateHome("ourServices"); }} className={`text-left text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Our Services</button>
            <button onClick={() => { setMobileMenuOpen(false); setSelectedJob(null); window.scrollTo(0, 0); }} className="text-left text-sm font-mono uppercase text-accent-primary font-semibold transition-colors">Careers</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigateHome("contactMessage"); }} className={`text-left text-sm font-mono uppercase transition-colors ${isDarkMode ? "text-white hover:text-accent-primary" : "text-slate-800 hover:text-accent-primary"}`}>Contact Us</button>
            
            {/* Recruiter Login in Mobile Drawer */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-300/30 dark:border-white/10">
                <span className="text-sm font-mono uppercase text-accent-primary font-bold">
                  Recruiter Mode
                </span>
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
                className="text-left text-sm font-mono uppercase text-accent-primary font-bold cursor-pointer border-t border-slate-300/30 dark:border-white/10 pt-2"
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 min-h-[90vh]">
        {/* Breadcrumbs */}
        <nav className={`max-w-7xl mx-auto px-4 sm:px-8 py-4 text-xs font-mono tracking-wider uppercase flex items-center gap-2 relative z-10 border-b transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#0a0a0a]/30" : "border-slate-200 bg-slate-100/50"}`}>
          <button onClick={() => onNavigateHome()} className={`hover:text-accent-primary ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <button onClick={() => { setSelectedJob(null); window.scrollTo(0, 0); }} className={selectedJob ? (isDarkMode ? "text-slate-400 hover:text-accent-primary" : "text-slate-600 hover:text-accent-primary") : "text-accent-primary font-semibold"}>Careers</button>
          {selectedJob && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-accent-primary font-semibold">{activeJobData?.title}</span>
            </>
          )}
        </nav>

        {/* Main Content Stage */}
        <main className="flex-1 py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
          <AnimatePresence mode="wait">
            {!selectedJob ? (
              
              // --- JOB ARCHIVE VIEW ---
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Header Title Section */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-accent-primary uppercase font-bold bg-accent-primary/10 px-3.5 py-1.5 rounded-full border border-accent-primary/20">
                    Career Gateways
                  </span>
                  <h1 className={`text-4xl sm:text-6xl lg:text-[76px] font-light tracking-tighter leading-[0.95] ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Job Openings
                  </h1>
                  <p className={themeTextMuted}>
                    Join an elite group of technicians delivering premium, Fortune 500-standard quality. Explore our vacant roles below.
                  </p>
                </div>

                {/* Recruiter Control Panel */}
                {isLoggedIn && (
                  <div id="recruiter-form-anchor" className="space-y-6">
                    <div className={`p-6 border rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? "border-accent-primary/30 bg-[#16162a]/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]" 
                        : "border-blue-200 bg-blue-50/50 shadow-sm"
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
                            Recruiter Control Panel
                          </h3>
                          <p className="text-xs text-slate-400">
                            Logged in as Administrator. Use the form below to post or update job openings.
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPostFormOpen(!isPostFormOpen)}
                            className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-black text-xs font-mono tracking-wider font-bold uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer animate-pulse"
                          >
                            {isPostFormOpen ? (
                              <>
                                <Undo2 className="w-3.5 h-3.5" />
                                <span>Collapse Form</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>{editingJobId ? "Edit Posting Form" : "Post a New Job"}</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={onLogout}
                            className="px-4 py-2.5 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-mono tracking-wider font-bold uppercase rounded-full transition-all cursor-pointer"
                          >
                            Logout
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-300/30 pt-6 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => setRecruiterPanelView("jobs")}
                          className={`rounded-full px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition ${recruiterPanelView === "jobs" ? "bg-accent-primary text-black" : "border border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          Post & Manage Jobs
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecruiterPanelView("applications")}
                          className={`rounded-full px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition ${recruiterPanelView === "applications" ? "bg-accent-primary text-black" : "border border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          Applications
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecruiterPanelView("analytics")}
                          className={`rounded-full px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition ${recruiterPanelView === "analytics" ? "bg-accent-primary text-black" : "border border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          Analytics
                        </button>
                      </div>

                      {/* Recruiter Form Content */}
                      <AnimatePresence>
                        {recruiterPanelView === "jobs" && isPostFormOpen && (
                          <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handlePostJob}
                            className="mt-6 border-t border-slate-300/30 dark:border-white/10 pt-6 space-y-4 overflow-hidden"
                          >
                            <h4 className="text-sm font-mono tracking-wider uppercase text-accent-primary font-bold">
                              {editingJobId ? "✏️ Edit Job Opening" : "💼 Post a New Job Opening"}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Job Title */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Job Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Lead QA Engineer"
                                  required
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl`}
                                />
                              </div>

                              {/* Department / Category */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Job Category</label>
                                <select
                                  value={jobCategory}
                                  onChange={(e) => setJobCategory(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl`}
                                >
                                  <option value="Quality Assurance">Quality Assurance</option>
                                  <option value="Quality Assurance / Engineering">Quality Assurance / Engineering</option>
                                  <option value="Software Engineering">Software Engineering</option>
                                  <option value="Product Management">Product Management</option>
                                  <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                                </select>
                              </div>

                              {/* Job Type */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Job Type</label>
                                <select
                                  value={jobType}
                                  onChange={(e) => setJobType(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl`}
                                >
                                  <option value="Full Time">Full Time</option>
                                  <option value="Part Time">Part Time</option>
                                  <option value="Contract">Contract</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Hybrid">Hybrid</option>
                                </select>
                              </div>

                              {/* Location */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Location</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Chennai (or Remote)"
                                  required
                                  value={jobLocation}
                                  onChange={(e) => setJobLocation(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl`}
                                />
                              </div>
                            </div>

                            {/* Job Description / Summary */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">Job Summary / Description</label>
                              <textarea
                                rows={3}
                                placeholder="Write a brief intro paragraph about the role..."
                                required
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className={`w-full ${themeInput} rounded-xl`}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Responsibilities */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                                  Key Responsibilities (one per line)
                                </label>
                                <textarea
                                  rows={4}
                                  placeholder="Design and execute test plans&#10;Identify, report, and track bugs&#10;Collaborate with global teams"
                                  value={jobResponsibilitiesStr}
                                  onChange={(e) => setJobResponsibilitiesStr(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl font-mono text-[11px]`}
                                />
                              </div>

                              {/* Qualifications */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                                  Requirements & Qualifications (one per line)
                                </label>
                                <textarea
                                  rows={4}
                                  placeholder="Bachelor's degree in CS or equivalent&#10;2+ years with Selenium and Java&#10;Excellent communication skills"
                                  value={jobQualificationsStr}
                                  onChange={(e) => setJobQualificationsStr(e.target.value)}
                                  className={`w-full ${themeInput} rounded-xl font-mono text-[11px]`}
                                />
                              </div>
                            </div>

                            {/* Submit & Cancel Buttons */}
                            <div className="flex items-center gap-3 justify-end pt-2">
                              {editingJobId && (
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-5 py-2.5 border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-mono tracking-wider font-bold uppercase rounded-full transition-all cursor-pointer text-slate-400 hover:text-white"
                                >
                                  Cancel Edit
                                </button>
                              )}
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-black text-xs font-mono tracking-wider font-bold uppercase px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-lg"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>{editingJobId ? "Save Posting" : "Publish Job Opening"}</span>
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {recruiterPanelView === "applications" && (
                        <div className="mt-6 border-t border-slate-300/30 pt-6 dark:border-white/10">
                          <RecruiterApplications isDarkMode={isDarkMode} showToast={showToast} />
                        </div>
                      )}

                      {recruiterPanelView === "analytics" && (
                        <div className="mt-6 border-t border-slate-300/30 pt-6 dark:border-white/10">
                          <RecruiterAnalytics isDarkMode={isDarkMode} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Advanced Search & Filtering Console */}
                <div className={`p-6 border backdrop-blur-md space-y-4 rounded-2xl transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#16162a]/40" : "border-slate-200 bg-white shadow-sm"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search Bar Input */}
                    <div className="md:col-span-4 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search positions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 ${themeInput}`}
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full ${themeInput}`}
                        aria-label="Filter by Job Category"
                      >
                        <option value="" className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>All Job Categories</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat} className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className={`w-full ${themeInput}`}
                        aria-label="Filter by Job Type"
                      >
                        <option value="" className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>All Job Types</option>
                        {types.map((type, idx) => (
                          <option key={idx} value={type} className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div className="md:col-span-2">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className={`w-full ${themeInput}`}
                        aria-label="Filter by Job Location"
                      >
                        <option value="" className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>All Job Locations</option>
                        {locations.map((loc, idx) => (
                          <option key={idx} value={loc} className={isDarkMode ? "bg-[#151526]" : "bg-white text-slate-800"}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Jobs List Grid */}
                <div style={{ perspective: "1000px" }} className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, idx) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 30, rotateX: 6 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ type: "spring", stiffness: 70, damping: 14, delay: Math.min(idx * 0.05, 0.3) }}
                        layout
                        className={`p-6 border backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-accent-primary/30 hover:shadow-[0_4px_25px_rgba(255,130,0,0.12)] rounded-2xl ${
                          isDarkMode 
                            ? "border-white/5 bg-[#16162a]/40" 
                            : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="space-y-3">
                          <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
                            <span className="flex items-center gap-1.5 font-mono">
                              <Briefcase className="w-3.5 h-3.5 text-accent-primary" />
                              {job.category}
                            </span>
                            <span className="flex items-center gap-1.5 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-accent-primary" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1.5 font-mono">
                              <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                              {job.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                          {isLoggedIn && (
                            <div className="flex items-center gap-2 w-full sm:w-auto sm:mr-2">
                              <button
                                onClick={() => handleEditClick(job)}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center p-3 rounded-full border border-accent-primary/20 hover:border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 transition-colors cursor-pointer"
                                title="Edit Job Opening"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(job.id, job.title)}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center p-3 rounded-full border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Delete Job Opening"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => { setSelectedJob(job.id); window.scrollTo(0,0); handleResetForm(); }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-accent-primary hover:bg-accent-secondary text-black font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 cursor-pointer group hover:shadow-[0_4px_20px_rgba(255,130,0,0.3)] hover:scale-[1.03]"
                          >
                            <span>More Details</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`p-12 text-center border border-dashed space-y-3 ${isDarkMode ? "border-white/10" : "border-slate-300 bg-white"}`}>
                      <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                      <h3 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>No Open Positions Found</h3>
                      <p className="text-xs text-slate-400">Try loosening your search query or setting the category filters to "All".</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              
              // --- DETAILED JOB DESCRIPTION VIEW ---
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Back Button Link & Recruiter Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Back to Job Openings</span>
                  </button>

                  {isLoggedIn && activeJobData && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const jobToEdit = activeJobData;
                          setSelectedJob(null);
                          setTimeout(() => {
                            handleEditClick(jobToEdit);
                          }, 300);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-accent-primary/20 hover:border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 text-xs font-mono font-bold uppercase rounded-full transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Job</span>
                      </button>
                      <button
                        onClick={() => {
                          const title = activeJobData.title;
                          const id = activeJobData.id;
                          setSelectedJob(null);
                          setTimeout(() => {
                            handleDeleteClick(id, title);
                          }, 300);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-500/10 text-xs font-mono font-bold uppercase rounded-full transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Job</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Metadata Card */}
                <div className={`p-8 border relative overflow-hidden rounded-2xl transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#16162a]/40" : "border-slate-200 bg-white shadow-xl"}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-mono tracking-widest text-accent-primary uppercase font-bold bg-accent-primary/10 px-2.5 py-1 rounded-none border border-accent-primary/20">
                        Active Vacancy
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-accent-secondary uppercase font-bold bg-accent-secondary/10 px-2.5 py-1 rounded-none border border-accent-secondary/20">
                        {activeJobData?.type}
                      </span>
                    </div>
                    
                    <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {activeJobData?.title}
                    </h1>

                    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-xs text-text-secondary border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                      <span className="flex items-center gap-1.5 font-mono">
                        <Briefcase className="w-4 h-4 text-accent-primary" />
                        <strong>Job Category:</strong> {activeJobData?.category}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-4 h-4 text-accent-primary" />
                        <strong>Job Type:</strong> {activeJobData?.type}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono">
                        <MapPin className="w-4 h-4 text-accent-primary" />
                        <strong>Job Location:</strong> {activeJobData?.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid content section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left Column: Job Description and Requirements */}
                  <div className="lg:col-span-7 space-y-8">
                    {/* Job description */}
                    {activeJobData?.description && (
                      <div className="space-y-4">
                        <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Job Description</h2>
                        <p className={themeTextMuted}>
                          {activeJobData.description}
                        </p>
                      </div>
                    )}

                    {/* Job summary */}
                    {activeJobData?.summary && (
                      <div className="space-y-4">
                        <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Job Summary</h2>
                        <p className={themeTextMuted}>
                          {activeJobData.summary}
                        </p>
                      </div>
                    )}

                    {/* Key Responsibilities */}
                    <div className="space-y-4">
                      <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Key Responsibilities</h2>
                      <ul className="space-y-2.5">
                        {activeJobData?.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm">
                            <span className="w-1.5 h-1.5 bg-accent-primary shrink-0 mt-2" />
                            <span className={themeTextMuted}>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Skills & Qualifications */}
                    {activeJobData?.qualifications && (
                      <div className="space-y-4">
                        <h2 className={`text-[24px] font-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>Required Skills &amp; Qualifications</h2>
                        <ul className="space-y-2.5">
                          {activeJobData.qualifications.map((qual, idx) => (
                            <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm">
                              <span className="w-1.5 h-1.5 bg-accent-secondary shrink-0 mt-2" />
                              <span className={themeTextMuted}>{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Application Form */}
                  <div className="lg:col-span-5">
                    <div className={`p-6 sm:p-8 border backdrop-blur-md sticky top-24 rounded-2xl transition-colors duration-300 ${isDarkMode ? "border-white/5 bg-[#16162a]/40" : "border-slate-200 bg-white shadow-xl"}`}>
                      {formSubmitted ? (
                        <div className="text-center py-8 space-y-4">
                          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Application Logged</h3>
                          <p className={themeTextMuted}>
                            Thank you! Your application has been submitted successfully. Our recruitment team (recruiting@aiinfotech.co.in) will reach out to you shortly!
                          </p>
                          <button
                            onClick={handleResetForm}
                            className={`mt-4 border font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors ${isDarkMode ? "border-white/10 text-white hover:bg-white/5" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
                          >
                            Submit Another Application
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplySubmit} className="space-y-5">
                          <div className="space-y-1">
                            <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                              Apply for this position
                            </h3>
                            <p className="text-xs text-text-secondary">
                              Provide your professional information below. Required fields are marked with <span className="text-accent-primary">*</span>.
                            </p>
                          </div>

                          {formError && (
                            <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-none flex items-start gap-2.5 text-xs text-accent-primary">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{formError}</span>
                            </div>
                          )}

                          {/* Name Input */}
                          <div className="space-y-1.5">
                            <label htmlFor="applicant-name" className="text-xs font-mono font-bold tracking-wider uppercase text-[#7b7d8c] block">
                              Full Name <span className="text-accent-primary">*</span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                id="applicant-name"
                                type="text"
                                name="awsm_applicant_name"
                                required
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                placeholder="John Doe"
                                className={`w-full pl-10 pr-4 ${themeInput}`}
                              />
                            </div>
                          </div>

                          {/* Email Input */}
                          <div className="space-y-1.5">
                            <label htmlFor="applicant-email" className="text-xs font-mono font-bold tracking-wider uppercase text-[#7b7d8c] block">
                              Email <span className="text-accent-primary">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                id="applicant-email"
                                type="email"
                                name="awsm_applicant_email"
                                required
                                value={applicantEmail}
                                onChange={(e) => setApplicantEmail(e.target.value)}
                                placeholder="john@example.com"
                                className={`w-full pl-10 pr-4 ${themeInput}`}
                              />
                            </div>
                          </div>

                          {/* Phone Input */}
                          <div className="space-y-1.5">
                            <label htmlFor="applicant-phone" className="text-xs font-mono font-bold tracking-wider uppercase text-[#7b7d8c] block">
                              Phone <span className="text-accent-primary">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                id="applicant-phone"
                                type="tel"
                                name="awsm_applicant_phone"
                                required
                                value={applicantPhone}
                                onChange={(e) => setApplicantPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className={`w-full pl-10 pr-4 ${themeInput}`}
                              />
                            </div>
                          </div>

                          {/* Bio Textarea */}
                          <div className="space-y-1.5">
                            <label htmlFor="applicant-letter" className="text-xs font-mono font-bold tracking-wider uppercase text-[#7b7d8c] block">
                              Bio <span className="text-accent-primary">*</span>
                            </label>
                            <textarea
                              id="applicant-letter"
                              name="awsm_applicant_letter"
                              required
                              rows={4}
                              value={applicantBio}
                              onChange={(e) => setApplicantBio(e.target.value)}
                              placeholder="Tell us about yourself, your qualifications and expertise..."
                              className={`w-full resize-none ${themeInput}`}
                            />
                          </div>

                          {/* Drag and Drop File Upload Area */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono font-bold tracking-wider uppercase text-[#7b7d8c] block">
                              Upload CV/Resume <span className="text-accent-primary">*</span>
                            </label>
                            
                            <div
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                                dragActive 
                                  ? "border-accent-primary bg-accent-primary/10" 
                                  : isDarkMode
                                    ? "border-white/10 hover:border-accent-primary/40 bg-[#16162a]"
                                    : "border-slate-300 hover:border-accent-primary/40 bg-slate-50"
                              }`}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                name="awsm_file"
                                accept=".pdf,.doc,.docx"
                                required
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              
                              <div className="space-y-2">
                                {uploadedFile ? (
                                  <>
                                    <FileText className="w-8 h-8 text-accent-primary mx-auto" />
                                    <p className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                      {uploadedFile.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                    <span className="inline-block text-[9px] font-mono uppercase bg-accent-primary/15 text-accent-primary px-2 py-0.5 rounded border border-accent-primary/20">
                                      File Selected
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                                    <p className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                      Drag &amp; drop your resume here, or <span className="text-accent-primary">browse</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      Allowed Type(s): .pdf, .doc, .docx
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Privacy Policy Checkbox */}
                          <div className="flex gap-2.5 items-start">
                            <input
                              id="privacy-policy"
                              type="checkbox"
                              name="awsm_form_privacy_policy"
                              required
                              checked={privacyPolicyAccepted}
                              onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded-md border-white/10 text-accent-primary focus:ring-accent-primary bg-[#16162a]"
                            />
                            <label htmlFor="privacy-policy" className="text-[11px] text-slate-400 leading-normal">
                              By using this form you agree with the storage and handling of your data by this website. <span className="text-accent-primary">*</span>
                            </label>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-[0_0_20px_rgba(255,130,0,0.3)]"
                          >
                            <span>{submitting ? "Submitting.." : "Submit Application"}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

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
                    stroke="url(#blue-gradient-careers-footer)" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                  {/* Inner upward swoosh/flame */}
                  <path 
                    d="M 45 68 C 45 68 32 50 48 35 C 53 30 58 20 58 20 C 58 20 62 32 58 45 C 54 58 66 65 66 65 C 66 65 55 72 45 68 Z" 
                    fill="url(#blue-gradient-careers-footer)" 
                  />
                  <defs>
                    <linearGradient id="blue-gradient-careers-footer" x1="0%" y1="100%" x2="100%" y2="0%">
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
              <li><button onClick={() => onNavigateHome("ourServices")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Software Consulting</button></li>
               <li><button onClick={() => onNavigateHome("ourServices")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Testing &amp; Automation</button></li>
               <li><button onClick={() => onNavigateHome("ourServices")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Staffing Solutions</button></li>
               <li><button onClick={() => onNavigateHome("ourServices")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Technical Maintenance</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className={`font-mono uppercase text-xs font-bold tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>Company</h4>
            <ul className={`space-y-2 text-[12px] font-mono ${isDarkMode ? "text-[#7b7d8c]" : "text-slate-600"}`}>
              <li><button onClick={() => onNavigateHome("aboutUs")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">About Us</button></li>
               <li><button onClick={() => { setSelectedJob(null); window.scrollTo(0, 0); }} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Careers listing</button></li>
               <li><button onClick={() => onNavigateHome("contactMessage")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Support Channels</button></li>
               <li><button onClick={() => onNavigateHome("aboutUs")} className="hover:text-accent-primary transition-colors text-left cursor-pointer">Our Standard Policies</button></li>
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

    </div>
  );
}
