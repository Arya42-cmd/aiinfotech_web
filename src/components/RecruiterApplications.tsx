import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import type { Application, Job } from "../types";
import ResumeViewerModal from "./ResumeViewerModal";
import { Download, Eye, Search, Filter, Loader2, AlertCircle, PlusCircle } from "lucide-react";

interface RecruiterApplicationsProps {
  isDarkMode: boolean;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

const statusOptions = ["Applied", "Shortlisted", "Interview Scheduled", "Technical Round", "HR Round", "Offer Sent", "Hired", "Rejected"] as const;
const statusStyles: Record<string, string> = {
  Applied: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Shortlisted: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Interview Scheduled": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Technical Round": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "HR Round": "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  "Offer Sent": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Hired: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function RecruiterApplications({ isDarkMode, showToast }: RecruiterApplicationsProps) {
  const [applications, setApplications] = useState<(Application & { job_title?: string; job_category?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState<(Application & { job_title?: string; job_category?: string }) | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("id,job_id,full_name,email,phone,cover_letter,resume_url,status,created_at")
        .order("created_at", { ascending: false });

      if (applicationsError) throw applicationsError;

      const { data: jobsData, error: jobsError } = await supabase.from("jobs").select("id,title,category");
      if (jobsError) throw jobsError;

      const mapped = (applicationsData || []).map((application) => {
        const job = (jobsData || []).find((entry) => entry.id === application.job_id);
        return {
          ...application,
          job_title: job?.title || "Unknown Role",
          job_category: job?.category || "Unknown",
        };
      });

      setApplications(mapped as (Application & { job_title?: string; job_category?: string })[]);
      setJobs((jobsData || []) as Job[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchApplications();
    const channel = supabase.channel("applications-updates").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "applications" },
      () => void fetchApplications()
    ).subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const term = search.toLowerCase();
    return applications.filter((app) => {
      const matchesFilter = filter === "All" || filter === "Interview"
        ? filter === "All" || (filter === "Interview" ? ["Interview Scheduled", "Technical Round", "HR Round"].includes(app.status) : app.status === filter)
        : app.status === filter;
      const matchesSearch = !term || [app.full_name, app.email, app.job_title].some((value) => (value || "").toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, search]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    if (!window.confirm(`Change this application status to ${newStatus}?`)) return;
    try {
      setUpdatingId(applicationId);
      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId);
      if (error) throw error;
      showToast("Status updated successfully", "success");
      await fetchApplications();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResumeDownload = (application: Application & { job_title?: string; job_category?: string }) => {
    if (!application.resume_url) {
      showToast("No resume is attached to this application.", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = application.resume_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `${application.full_name.replace(/\s+/g, "_") || "resume"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Resume download started", "info");
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Applications Management</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Review candidates, manage status, and access uploaded resumes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className={`flex items-center rounded-full border px-3 py-2 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-slate-50"}`}>
              <Search className="mr-2 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate / email / job" className={`bg-transparent text-sm outline-none ${isDarkMode ? "text-white" : "text-slate-900"}`} />
            </div>
            <div className={`flex items-center rounded-full border px-3 py-2 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-slate-50"}`}>
              <Filter className="mr-2 h-4 w-4 text-slate-400" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`bg-transparent text-sm outline-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                <option value="All">All</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={`rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-500`}>
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>
        </div>
      )}

      {loading ? (
        <div className={`rounded-2xl border p-8 text-center ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white"}`}>
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent-primary" />
          <p className={`mt-3 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Loading applications…</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className={`rounded-2xl border p-8 text-center ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white"}`}>
          <PlusCircle className="mx-auto h-8 w-8 text-slate-400" />
          <p className={`mt-3 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>No applications match your current search.</p>
        </div>
      ) : (
        <div className={`overflow-hidden rounded-2xl border ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={`${isDarkMode ? "bg-[#0f172a] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Applied On</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className={`border-t ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{application.full_name}</p>
                        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{application.phone || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{application.email}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>{application.job_title}</p>
                        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{application.job_category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{application.created_at ? new Date(application.created_at).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[application.status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {application.resume_url ? (
                        <button onClick={() => setSelectedApplication(application)} className="text-sm font-medium text-accent-primary">View Resume</button>
                      ) : (
                        <span className="text-sm text-slate-400">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setSelectedApplication(application)} className="rounded-full border border-accent-primary/30 px-3 py-1 text-xs font-semibold text-accent-primary">View Details</button>
                        <button onClick={() => handleResumeDownload(application)} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold">Download</button>
                        <select value={application.status} onChange={(e) => void handleStatusChange(application.id, e.target.value)} disabled={updatingId === application.id} className={`rounded-full border px-3 py-1 text-xs font-semibold ${isDarkMode ? "border-white/10 bg-[#0f172a] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
                          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ResumeViewerModal isOpen={Boolean(selectedApplication)} onClose={() => setSelectedApplication(null)} application={selectedApplication} isDarkMode={isDarkMode} />
    </div>
  );
}
