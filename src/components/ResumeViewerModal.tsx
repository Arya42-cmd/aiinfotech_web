import React from "react";
import { X, Download, FileText, File } from "lucide-react";
import type { Application } from "../types";

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: (Application & { job_title?: string; job_category?: string }) | null;
  isDarkMode: boolean;
}

const getResumeExtension = (resumeUrl?: string | null) => {
  if (!resumeUrl) return "";
  const lower = resumeUrl.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".doc")) return "doc";
  if (lower.endsWith(".docx")) return "docx";
  return "";
};

export default function ResumeViewerModal({ isOpen, onClose, application, isDarkMode }: ResumeViewerModalProps) {
  if (!isOpen || !application) return null;

  const extension = getResumeExtension(application.resume_url);
  const canPreview = extension === "pdf";

  const handleDownload = () => {
    if (!application.resume_url) return;
    const link = document.createElement("a");
    link.href = application.resume_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `${application.full_name.replace(/\s+/g, "_") || "resume"}.${extension || "pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className={`w-full max-w-5xl rounded-2xl border shadow-2xl ${isDarkMode ? "border-white/10 bg-[#16162a] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
        <div className={`flex items-center justify-between border-b px-5 py-4 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
          <div>
            <h3 className="text-lg font-semibold">{application.full_name}</h3>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              {application.job_title || "Application"} • {application.email}
            </p>
          </div>
          <button onClick={onClose} className={`rounded-full p-2 transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-slate-50"}`}>
              <p className="text-xs font-mono uppercase tracking-wider text-accent-primary">Application Details</p>
              <div className="mt-3 space-y-2 text-sm">
                <p><span className="font-semibold">Phone:</span> {application.phone || "—"}</p>
                <p><span className="font-semibold">Status:</span> {application.status}</p>
                <p><span className="font-semibold">Applied:</span> {application.created_at ? new Date(application.created_at).toLocaleDateString() : "—"}</p>
                <p><span className="font-semibold">Job:</span> {application.job_title || "—"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-slate-50"}`}>
              <p className="text-xs font-mono uppercase tracking-wider text-accent-primary">Candidate Bio</p>
              <p className={`mt-3 text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {application.bio || "No bio provided."}
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={!application.resume_url}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black transition hover:bg-accent-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </button>
          </div>

          <div className={`min-h-[60vh] rounded-xl border ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-slate-200 bg-slate-50"}`}>
            {application.resume_url ? (
              canPreview ? (
                <iframe src={application.resume_url} title={`${application.full_name} resume`} className="h-full min-h-[60vh] w-full rounded-xl" />
              ) : (
                <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
                  <FileText className="h-12 w-12 text-accent-primary" />
                  <div>
                    <h4 className="text-lg font-semibold">Resume available for download</h4>
                    <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      This file type is not previewable in-browser. Download it to view the document.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="rounded-full border border-accent-primary/30 px-4 py-2 text-sm font-semibold text-accent-primary"
                  >
                    Download File
                  </button>
                </div>
              )
            ) : (
              <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
                <File className="h-12 w-12 text-slate-400" />
                <div>
                  <h4 className="text-lg font-semibold">No resume attached</h4>
                  <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    This application does not currently have a resume file available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
