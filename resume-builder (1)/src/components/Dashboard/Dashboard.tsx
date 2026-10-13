import React, { useState } from 'react';
import { ResumeData } from '../../types/resume.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { exportResumeToPDF } from '../../utils/pdfExport.ts';
import { getTemplateById } from '../../data/templatesData.ts';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  Download,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  resumes: ResumeData[];
  loading: boolean;
  onCreateNew: () => void;
  onEditResume: (resume: ResumeData) => void;
  onPreviewResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => Promise<void>;
  onOpenAiModal?: () => void;
  onOpenChatbot?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  resumes,
  loading,
  onCreateNew,
  onEditResume,
  onPreviewResume,
  onDeleteResume,
  onOpenAiModal,
  onOpenChatbot,
}) => {
  const { user } = useAuth();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Compute profile completion percentage based on current user / last resume
  const lastResume = resumes[0];
  let profileCompletion = 20; // default for having account
  if (lastResume) {
    if (lastResume.personalInfo.fullName) profileCompletion += 15;
    if (lastResume.personalInfo.email && lastResume.personalInfo.phone) profileCompletion += 15;
    if (lastResume.summary) profileCompletion += 15;
    if (lastResume.education.length > 0) profileCompletion += 15;
    if (lastResume.skills.length > 0) profileCompletion += 10;
    if (lastResume.experience.length > 0 || lastResume.isFresher) profileCompletion += 10;
  }
  profileCompletion = Math.min(100, profileCompletion);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await onDeleteResume(deleteTargetId);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (resume: ResumeData) => {
    setDownloadingId(resume._id || 'temp');
    try {
      // Open preview modal or export directly
      onPreviewResume(resume);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome, {user?.name || 'Professional'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your resumes, customize layouts, and export ATS-friendly documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenChatbot && (
              <button
                onClick={onOpenChatbot}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Chat with AI Bot</span>
              </button>
            )}

            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl shadow-2xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Fast Generator</span>
              </button>
            )}

            <button
              onClick={onCreateNew}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Blank Resume</span>
            </button>
          </div>
        </div>

        {/* Gemini AI Quick Creation Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-lg border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
              <Bot className="w-3.5 h-3.5 text-pink-300" />
              <span>Gemini 3.8 Flash AI Assistant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Build or polish a resume conversationally with AI
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              Chat with our AI Resume Architect to generate new resumes, rewrite experience bullets with quantified metrics, or tailor your CV for any company in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 shrink-0">
            {onOpenChatbot && (
              <button
                onClick={onOpenChatbot}
                className="w-full sm:w-auto px-5 py-3 bg-linear-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Chat & Build Resume</span>
              </button>
            )}
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-indigo-100 text-xs sm:text-sm font-semibold rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>10s Fast Form</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Resumes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Resumes
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">
                {resumes.length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Active documents</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Last Edited Resume */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="max-w-[190px]">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Last Edited Resume
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                {lastResume ? lastResume.resumeName : 'None yet'}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 inline" />
                <span>{lastResume ? formatDate(lastResume.updatedAt) : '—'}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Profile Completion
                </p>
                <span className="text-xs font-bold text-slate-700 tabular-nums">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {profileCompletion === 100
                  ? 'Ready for job applications'
                  : 'Add more details to boost ATS match'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* My Resumes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Resumes</h2>
            <span className="text-xs text-slate-400">{resumes.length} saved</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-6 border border-slate-200 h-64 animate-pulse space-y-4"
                >
                  <div className="w-1/2 h-5 bg-slate-200 rounded"></div>
                  <div className="w-full h-32 bg-slate-100 rounded-xl"></div>
                  <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No resumes created yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Start building your first resume with our guided multi-step builder and professional designer templates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
                {onOpenChatbot && (
                  <button
                    onClick={onOpenChatbot}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-white" />
                    <span>Chat with AI to Build Resume</span>
                  </button>
                )}
                {onOpenAiModal && (
                  <button
                    onClick={onOpenAiModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Fast AI Generator</span>
                  </button>
                )}
                <button
                  onClick={onCreateNew}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Blank Template</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header & Preview Visual */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                          {resume.resumeName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {resume.personalInfo.fullName || 'Untitled Profile'}
                        </p>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        {getTemplateById(resume.selectedTemplate).name}
                      </span>
                    </div>

                    {/* Resume mini mockup thumbnail */}
                    <div
                      onClick={() => onPreviewResume(resume)}
                      className="mt-4 h-32 bg-slate-50 rounded-xl border border-slate-100 p-3 cursor-pointer hover:bg-slate-100/70 transition flex flex-col justify-between overflow-hidden relative"
                    >
                      <div className="space-y-1.5">
                        <div className="w-24 h-2 bg-slate-400 rounded"></div>
                        <div className="w-36 h-1 bg-slate-300 rounded"></div>
                        <div className="w-full h-px bg-slate-200 my-2"></div>
                        <div className="w-16 h-1.5 bg-slate-400 rounded"></div>
                        <div className="w-4/5 h-1 bg-slate-200 rounded"></div>
                        <div className="w-3/5 h-1 bg-slate-200 rounded"></div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-mono">
                          {resume.skills.length} skills · {resume.experience.length} roles
                        </span>
                        <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Actions */}
                  <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(resume.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditResume(resume)}
                        title="Edit Resume"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onPreviewResume(resume)}
                        title="Preview & Export"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownload(resume)}
                        title="Download PDF"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetId(resume._id || null)}
                        title="Delete Resume"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Resume?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this resume? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                {isDeleting ? 'Deleting...' : 'Delete Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
