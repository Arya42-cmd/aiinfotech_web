import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import type { Application, Job } from "../types";
import { BarChart3, Briefcase, CheckCircle2, CircleDollarSign, FileText, Users } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isDarkMode: boolean;
}

function AnalyticsCard({ title, value, icon, isDarkMode }: AnalyticsCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{title}</p>
          <p className={`mt-2 text-3xl font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{value}</p>
        </div>
        <div className="rounded-full bg-accent-primary/15 p-3 text-accent-primary">{icon}</div>
      </div>
    </div>
  );
}

export default function RecruiterAnalytics({ isDarkMode }: { isDarkMode: boolean }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [{ data: jobsData, error: jobsError }, { data: applicationsData, error: applicationsError }] = await Promise.all([
          supabase.from("jobs").select("id,title,category,status").order("created_at", { ascending: false }),
          supabase.from("applications").select("id,job_id,full_name,email,phone,cover_letter,resume_url,status,created_at").order("created_at", { ascending: false }),
        ]);

        if (!isMounted) return;
        if (jobsError) throw jobsError;
        if (applicationsError) throw applicationsError;

        setJobs((jobsData || []) as Job[]);
        setApplications((applicationsData || []) as Application[]);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load analytics.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();

    const channel = supabase.channel("analytics-updates").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "applications" },
      () => void load()
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "jobs" },
      () => void load()
    ).subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const summary = useMemo(() => {
    const openJobs = jobs.filter((job) => job.status !== "Closed").length;
    const closedJobs = jobs.filter((job) => job.status === "Closed").length;
    const hired = applications.filter((app) => app.status === "Hired").length;
    const rejected = applications.filter((app) => app.status === "Rejected").length;
    const interviews = applications.filter((app) => ["Interview Scheduled", "Technical Round", "HR Round"].includes(app.status)).length;

    const byMonth = Array.from({ length: 6 }, (_, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - idx));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const count = applications.filter((app) => app.created_at && app.created_at.startsWith(key)).length;
      return { key, count };
    });

    const statusCounts = ["Applied", "Shortlisted", "Interview Scheduled", "Technical Round", "HR Round", "Offer Sent", "Hired", "Rejected"].map((status) => ({
      status,
      count: applications.filter((app) => app.status === status).length,
    }));

    const categoryCounts = jobs.reduce<Record<string, number>>((acc, job) => {
      const key = job.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const funnel = [
      { name: "Applied", count: applications.filter((app) => app.status === "Applied").length },
      { name: "Shortlisted", count: applications.filter((app) => app.status === "Shortlisted").length },
      { name: "Interview", count: applications.filter((app) => ["Interview Scheduled", "Technical Round", "HR Round"].includes(app.status)).length },
      { name: "Offer", count: applications.filter((app) => app.status === "Offer Sent").length },
      { name: "Hired", count: hired },
    ];

    return { openJobs, closedJobs, hired, rejected, interviews, byMonth, statusCounts, categoryCounts, funnel };
  }, [applications, jobs]);

  if (loading) {
    return <div className={`rounded-2xl border p-6 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white"}`}><p className="text-sm text-slate-400">Loading analytics…</p></div>;
  }

  if (error) {
    return <div className={`rounded-2xl border p-6 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white"}`}><p className="text-sm text-rose-500">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard title="Total Open Jobs" value={summary.openJobs} icon={<Briefcase className="h-5 w-5" />} isDarkMode={isDarkMode} />
        <AnalyticsCard title="Total Closed Jobs" value={summary.closedJobs} icon={<CheckCircle2 className="h-5 w-5" />} isDarkMode={isDarkMode} />
        <AnalyticsCard title="Total Applications" value={applications.length} icon={<FileText className="h-5 w-5" />} isDarkMode={isDarkMode} />
        <AnalyticsCard title="Total Candidates Hired" value={summary.hired} icon={<Users className="h-5 w-5" />} isDarkMode={isDarkMode} />
        <AnalyticsCard title="Total Rejected" value={summary.rejected} icon={<CircleDollarSign className="h-5 w-5" />} isDarkMode={isDarkMode} />
        <AnalyticsCard title="Total Interviews" value={summary.interviews} icon={<BarChart3 className="h-5 w-5" />} isDarkMode={isDarkMode} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Applications by Month</h3>
          <div className="mt-4 space-y-3">
            {summary.byMonth.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{item.key}</span>
                <div className="flex flex-1 items-center gap-3 px-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-accent-primary" style={{ width: `${Math.max(8, item.count * 12)}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Applications by Status</h3>
          <div className="mt-4 space-y-3">
            {summary.statusCounts.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{item.status}</span>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Jobs by Category</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(summary.categoryCounts).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{category}</span>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#16162a]/60" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Hiring Funnel</h3>
          <div className="mt-4 space-y-3">
            {summary.funnel.map((step) => (
              <div key={step.name} className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{step.name}</span>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{step.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
