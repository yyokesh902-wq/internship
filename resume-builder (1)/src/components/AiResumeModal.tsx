import React, { useState } from 'react';
import { Sparkles, Bot, Zap, ArrowRight, CheckCircle2, Loader2, X, RefreshCw, Wand2, ShieldCheck, Briefcase, GraduationCap, Award } from 'lucide-react';
import { ResumeData, TemplateType } from '../types/resume.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface AiResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (resume: ResumeData) => void;
  defaultJobTitle?: string;
}

const POPULAR_ROLES = [
  'Full Stack Developer',
  'Frontend Engineer (React)',
  'Backend Engineer (Node/Python)',
  'Data Scientist & ML Engineer',
  'Product Manager',
  'UI/UX Product Designer',
  'Cloud & DevOps Engineer',
  'Digital Marketing Manager',
  'Financial Analyst',
  'Project Manager (Agile)',
];

const EXPERIENCE_LEVELS = [
  { id: 'fresher', label: 'Fresher / Student', desc: '0 yrs — Entry, projects & degree focus' },
  { id: 'entry', label: 'Entry-Level', desc: '1–2 yrs — Foundational industry impact' },
  { id: 'mid', label: 'Mid-Level', desc: '3–5 yrs — Proven results & autonomy' },
  { id: 'senior', label: 'Senior / Lead', desc: '6–9 yrs — Architecture & team mentoring' },
  { id: 'executive', label: 'Executive', desc: '10+ yrs — Strategic leadership & scale' },
];

const POPULAR_TEMPLATES: { id: TemplateType; name: string; color: string }[] = [
  { id: 'modern-blue', name: 'Modern Indigo', color: 'from-blue-600 to-indigo-700' },
  { id: 'classic-slate', name: 'Classic Slate', color: 'from-slate-700 to-slate-900' },
  { id: 'minimal-clean', name: 'Minimal Air', color: 'from-teal-600 to-emerald-700' },
  { id: 'creative-purple', name: 'Creative Violet', color: 'from-purple-600 to-pink-600' },
];

export const AiResumeModal: React.FC<AiResumeModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
  defaultJobTitle = '',
}) => {
  const { user } = useAuth();

  const [jobTitle, setJobTitle] = useState(defaultJobTitle || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [industry, setIndustry] = useState('Technology & Software');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Cloud Architecture, PostgreSQL');
  const [notes, setNotes] = useState('');
  const [candidateName, setCandidateName] = useState(user?.name || '');
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '');
  const [candidateLocation, setCandidateLocation] = useState('San Francisco, CA');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-blue');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      setError('Please specify a target Job Title.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep('Connecting to Google Gemini 3.8 Flash model...');

    // Animated progress simulation steps while API processes
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Analyzing ATS keywords & industry benchmark requirements...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Writing quantifiable achievement bullet points & metrics...');
    }, 2800);

    const stepTimer3 = setTimeout(() => {
      setGenerationStep('Structuring education, portfolio projects & technical competencies...');
    }, 4500);

    try {
      const result = await api.generateResumeWithAI({
        jobTitle: jobTitle.trim(),
        experienceLevel,
        industry,
        skills,
        notes,
        userFullName: candidateName.trim() || user?.name || 'Alex Morgan',
        userEmail: candidateEmail.trim() || user?.email || 'alex.morgan@example.com',
        userLocation: candidateLocation.trim() || 'San Francisco, CA',
        template: selectedTemplate,
      });

      setGeneratedResume(result.resume);
      setGenerationStep('Resume generated successfully!');
    } catch (err: any) {
      console.warn('AI generation error:', err);
      setError(err?.message || 'Failed to generate resume with AI. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
    }
  };

  const handleApplyResume = () => {
    if (generatedResume) {
      onGenerated(generatedResume);
      onClose();
    }
  };

  const handleReset = () => {
    setGeneratedResume(null);
    setError(null);
    setGenerationStep('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Header with AI Gradient */}
        <div className="relative bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Powered by Google Gemini 3.8 Flash</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Fast AI Resume Generator
              </h2>
              <p className="text-sm text-indigo-200 max-w-lg leading-relaxed">
                Generate a complete, ATS-optimized, high-impact professional resume in seconds. Customized to your target role with quantifiable metrics.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <span className="font-semibold text-rose-800">Error:</span>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {isGenerating ? (
            /* Loading State */
            <div className="py-12 px-4 text-center space-y-6 animate-in fade-in">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <Bot className="w-8 h-8 text-indigo-600 animate-bounce" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Gemini AI is Crafting Your Resume</h3>
                <p className="text-sm text-indigo-600 font-medium animate-pulse">{generationStep}</p>
                <p className="text-xs text-slate-500">
                  Creating tailored job experience bullet points, career summary, skills, education, and projects...
                </p>
              </div>

              {/* Progress chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 max-w-lg mx-auto text-xs text-slate-500 font-medium">
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ATS Optimizing</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Action Verbs</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Key Metrics</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Full Layout</span>
                </div>
              </div>
            </div>
          ) : generatedResume ? (
            /* Success / Generated Preview State */
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-emerald-950">Resume Generated Successfully!</h3>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Your complete resume for <strong>{generatedResume.personalInfo.jobTitle}</strong> is ready with formatted sections, measurable achievements, and matching skills.
                  </p>
                </div>
              </div>

              {/* Resume Highlights Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{generatedResume.personalInfo.fullName}</h4>
                    <p className="text-xs text-indigo-600 font-semibold">{generatedResume.personalInfo.jobTitle}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                    {generatedResume.experience.length} Positions &bull; {generatedResume.skills.length} Skills
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200">
                  "{generatedResume.summary}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{generatedResume.experience.length} Work Roles</div>
                      <div className="text-[11px] text-slate-500">With bullet achievements</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{generatedResume.education.length} Education Degrees</div>
                      <div className="text-[11px] text-slate-500">With coursework & honors</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{generatedResume.projects.length} Projects & Certs</div>
                      <div className="text-[11px] text-slate-500">Industry recognized</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Another</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyResume}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Open in Resume Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Target Job Title with Quick Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Job Title / Role <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer, Product Designer, Registered Nurse"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                  <Sparkles className="absolute right-3.5 top-3.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                </div>

                {/* Popular chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-600 font-medium">Quick Pick:</span>
                  {POPULAR_ROLES.slice(0, 5).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setJobTitle(role)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        jobTitle === role
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Experience Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        experienceLevel === lvl.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-1 ring-indigo-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{lvl.label}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills & Focus Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Key Skills or Tech Stack
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, SQL, AWS, Figma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <p className="text-[11px] text-slate-600">Gemini will organize & level these automatically.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Target Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech, Healthcare, SaaS, E-Commerce"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <p className="text-[11px] text-slate-600">Tailors industry terminology & jargon.</p>
                </div>
              </div>

              {/* Personal Info Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Candidate Details (Optional)
                  </span>
                  <span className="text-[11px] text-slate-600">Used on top header</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Full Name (e.g. Jordan Lee)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={candidateLocation}
                      onChange={(e) => setCandidateLocation(e.target.value)}
                      placeholder="Location (City, Country)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific accomplishments or highlights to include (e.g. 'Led migration to microservices, 5 years at fintech startups, published research')"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Template Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Visual Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        selectedTemplate === tmpl.id
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-2 rounded-full bg-linear-to-r ${tmpl.color} mb-1.5`} />
                      <div className="text-xs font-semibold text-slate-800">{tmpl.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% ATS-Compliant Structure & Formatting</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Generate Complete Resume</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
