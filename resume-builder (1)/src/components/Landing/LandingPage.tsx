import React, { useState } from 'react';
import { TemplateType } from '../../types/resume.ts';
import { getSampleResume } from '../../utils/sampleData.ts';
import { ResumeRenderer } from '../ResumeTemplates/ResumeRenderer.tsx';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  Zap,
  Layout,
  CheckCircle,
  ArrowRight,
  Eye,
  Sliders,
  Bot,
  MessageSquare,
} from 'lucide-react';

interface LandingPageProps {
  onCreateResume: () => void;
  onSelectTemplate: (template: TemplateType) => void;
  onViewTemplates: () => void;
  onOpenAiModal?: () => void;
  onOpenChatbot?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCreateResume,
  onSelectTemplate,
  onViewTemplates,
  onOpenAiModal,
  onOpenChatbot,
}) => {
  const [activeHeroTemplate, setActiveHeroTemplate] = useState<TemplateType>('modern');
  const sampleData = getSampleResume();
  const heroResumeData = { ...sampleData, selectedTemplate: activeHeroTemplate };

  const templateCards: { id: TemplateType; title: string; subtitle: string; tag: string }[] = [
    {
      id: 'classic',
      title: 'Template 1 — Classic',
      subtitle: 'Traditional professional typography, balanced structure, perfect for corporate roles and executive positions.',
      tag: 'Corporate & Finance',
    },
    {
      id: 'modern',
      title: 'Template 2 — Modern',
      subtitle: 'Contemporary dual-column layout with subtle indigo accents, clean section markers, and modern sans typography.',
      tag: 'Engineering & Tech',
    },
    {
      id: 'minimal',
      title: 'Template 3 — Minimal',
      subtitle: 'Uncluttered airy layout, maximum whitespace, and refined typography for discerning professionals.',
      tag: 'Consulting & Strategy',
    },
    {
      id: 'creative',
      title: 'Template 4 — Creative',
      subtitle: 'Distinctive dark sidebar layout with highlight badges, tailored for developers, designers, and students.',
      tag: 'Design & Development',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-r from-purple-100 via-indigo-50 to-blue-50 dark:from-purple-950/60 dark:via-indigo-950/60 dark:to-blue-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span>Powered by Google Gemini 3.8 Flash AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] text-balance">
                Create High-Impact Resumes in Seconds with <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">Gemini AI</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Enter your target role and let generative AI craft ATS-optimized bullet points, quantifiable achievements, and customized layouts in seconds.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                {onOpenChatbot && (
                  <button
                    onClick={onOpenChatbot}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Bot className="w-4 h-4 text-white" />
                    <span>Chat with AI to Build Resume</span>
                  </button>
                )}

                {onOpenAiModal && (
                  <button
                    onClick={onOpenAiModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Fast AI Generator</span>
                  </button>
                )}

                <button
                  onClick={onCreateResume}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <span>Blank Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick trust bullet points */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ATS-Friendly Standard
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Instant Vector PDF Download
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Multiple Resumes Supported
                </span>
              </div>
            </div>

            {/* Right Hero Mockup with interactive template switcher */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Template pill switcher */}
                <div className="flex items-center justify-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm mb-4">
                  {(['modern', 'classic', 'minimal', 'creative'] as TemplateType[]).map((tmpl) => (
                    <button
                      key={tmpl}
                      onClick={() => setActiveHeroTemplate(tmpl)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                        activeHeroTemplate === tmpl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>

                {/* Angled A4 Document Showcase container */}
                <div className="bg-slate-900/5 p-3 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xl relative overflow-hidden">
                  <div className="h-[460px] sm:h-[520px] overflow-hidden rounded-xl border border-slate-300 shadow-inner bg-white relative">
                    <div className="scale-[0.52] sm:scale-[0.62] origin-top-left w-[190%] sm:w-[160%] pointer-events-none select-none">
                      <ResumeRenderer data={heroResumeData} containerId="hero-resume-mockup" />
                    </div>

                    {/* Gradient bottom fade scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white via-white/70 to-transparent flex items-end justify-center pb-4">
                      <button
                        onClick={onCreateResume}
                        className="px-5 py-2 text-xs font-semibold text-slate-900 bg-white/95 border border-slate-200 rounded-full shadow-md hover:bg-white transition flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Use this template for free</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workflow Section */}
      <section className="py-16 sm:py-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Simple 4-Step Workflow
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              From blank page to professional A4 resume in less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Register or Log In</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Create a secure account with your email. Your data is stored safely in MongoDB.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Enter Resume Details</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fill in education, skills, projects, certifications, and experience through our guided multi-step form.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Pick Template & Preview</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Toggle between 4 designer templates with live automatic A4 formatting and instant layout updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Download & Apply</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export pixel-perfect PDF documents without watermarks or print directly using native browser print.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gemini AI Highlight Banner */}
      <section className="py-16 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Next-Gen Fast Resume Creation</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Build ATS-Ready Resumes in Under 10 Seconds
              </h2>
              <p className="text-sm sm:text-base text-indigo-200/90 max-w-2xl leading-relaxed">
                Powered by Google Gemini 3.8 Flash. Simply enter your target job title—our generative AI formulates quantifiable achievement bullets with real action verbs, categorizes high-value technical skills, and structures a polished executive profile.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="font-bold text-white text-sm">⚡ 10-Second Output</div>
                  <div className="text-indigo-200 text-[11px] mt-0.5">Complete resume generated in seconds</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="font-bold text-white text-sm">🎯 ATS Keyword Boost</div>
                  <div className="text-indigo-200 text-[11px] mt-0.5">Role-matched skills & terminology</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="font-bold text-white text-sm">📊 Quantifiable Bullets</div>
                  <div className="text-indigo-200 text-[11px] mt-0.5">Metrics-driven career impact</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white">Interactive AI Resume Bot</h3>
                <p className="text-xs text-indigo-200">Chat conversationally to create, polish, or tailor your resume in real time.</p>
              </div>
              {onOpenChatbot && (
                <button
                  onClick={onOpenChatbot}
                  className="w-full py-3 px-5 rounded-xl bg-linear-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 text-white" />
                  <span>Chat to Build Resume</span>
                </button>
              )}
              {onOpenAiModal && (
                <button
                  onClick={onOpenAiModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Quick 10s Generator</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Designed for Job Seekers & Professionals
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need to create compelling resumes that pass recruiter screenings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">4 Hand-Crafted Templates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch between Classic, Modern, Minimal, and Creative layouts anytime. Your entered details automatically reformat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pixel-Perfect PDF & Print</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download high-resolution A4 PDFs with zero website chrome, UI buttons, or watermarks. Browser print is fully styled.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Multiple Resumes Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create dedicated resumes for different roles—e.g. Frontend Engineer, Full-Stack, or Internship resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Gallery Section */}
      <section id="templates" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Professional Resume Templates
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Each template is optimized for readability, typographical elegance, and ATS compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templateCards.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {t.tag}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{t.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.subtitle}</p>

                  {/* Thumbnail */}
                  <div className="h-44 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden shadow-2xs">
                    <div className="scale-35 origin-top-left w-[285%] pointer-events-none">
                      <ResumeRenderer
                        data={{ ...sampleData, selectedTemplate: t.id }}
                        containerId={`tmpl-card-${t.id}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      onSelectTemplate(t.id);
                      onCreateResume();
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition"
                  >
                    Select & Customize
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onViewTemplates}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition shadow-xs"
            >
              <span>Explore All 102 Resume Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Join thousands of candidates who build professional, recruiter-approved resumes with Resume Builder.
          </p>
          <div className="pt-2">
            <button
              onClick={onCreateResume}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg transition"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
