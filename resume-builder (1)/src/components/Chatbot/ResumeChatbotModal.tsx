import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RefreshCw,
  Edit,
  Eye,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Layers,
  Wand2,
  Trash2,
  Maximize2,
  Minimize2,
  FileText,
  User,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { ResumeData, TemplateType } from '../../types/resume.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  resumeSnapshot?: ResumeData | null;
}

interface ResumeChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadResumeIntoBuilder: (resume: ResumeData) => void;
  onPreviewResume: (resume: ResumeData) => void;
  initialResume?: ResumeData | null;
}

const QUICK_PROMPTS = [
  { label: '🚀 Build Full Stack Dev', prompt: 'Build a complete ATS-optimized resume for a Full Stack Software Engineer with 4 years experience in React, Node, and Cloud.' },
  { label: '💼 Product Manager', prompt: 'Create a resume for a Senior Product Manager with experience in B2B SaaS, sprint leadership, and agile roadmaps.' },
  { label: '🎓 Fresher / Recent Grad', prompt: 'Create a fresher resume for a recent Computer Science graduate with strong academic projects and hackathon awards.' },
  { label: '📊 Data Scientist', prompt: 'Build a Data Scientist resume focusing on machine learning, predictive modeling, Python, and business analytics.' },
  { label: '📈 Add Quantified Metrics', prompt: 'Rewrite my experience bullet points so each one includes quantifiable metrics, cost savings, or percentage growth.' },
  { label: '✨ Punchy Executive Summary', prompt: 'Write an executive-level, punchy 3-sentence summary highlighting leadership and technical vision.' },
  { label: '☁️ Senior Cloud / DevOps', prompt: 'Generate an ATS resume for a Senior DevOps & Cloud Architect with AWS, Kubernetes, Terraform, and CI/CD.' },
  { label: '🎨 UI/UX Product Designer', prompt: 'Build a resume for a Product Designer focusing on Figma design systems, user research, and mobile apps.' },
];

export const ResumeChatbotModal: React.FC<ResumeChatbotModalProps> = ({
  isOpen,
  onClose,
  onLoadResumeIntoBuilder,
  onPreviewResume,
  initialResume,
}) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(initialResume || null);
  const [viewMode, setViewMode] = useState<'split' | 'chat-only' | 'resume-only'>('split');
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or reset chat conversation on open
  useEffect(() => {
    if (isOpen) {
      if (initialResume && !currentResume) {
        setCurrentResume(initialResume);
      }

      if (messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: `msg_welcome_${Date.now()}`,
          role: 'model',
          content: initialResume
            ? `👋 Hello! I'm your **Gemini AI Resume Architect**.\n\nI see you have a resume for **"${initialResume.personalInfo.jobTitle || initialResume.resumeName}"**. You can chat with me to:\n• Rewrite or polish any section\n• Add quantified metrics and strong action verbs\n• Tailor it for specific companies or job descriptions\n• Add technical skills, certifications, or projects\n\nWhat would you like to improve?`
            : `👋 Hi! I'm your **Gemini AI Resume Architect**.\n\nTell me about the role you want to apply for, or paste your rough background/LinkedIn notes, and I'll build a complete, ATS-tailored resume for you in real time!\n\nYou can click any prompt below or type your career goals to get started immediately.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          resumeSnapshot: initialResume || null,
        };
        setMessages([welcomeMessage]);
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, initialResume]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      // Build conversation payload for backend
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.chatWithResumeBot({
        messages: apiMessages,
        currentResume: currentResume || undefined,
        userProfile: {
          name: user?.name,
          email: user?.email,
        },
      });

      const updatedResume = res.resume || currentResume;
      if (res.updatedResume && res.resume) {
        setCurrentResume(res.resume);
      }

      const botMessage: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resumeSnapshot: res.updatedResume ? updatedResume : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'model',
        content: `I'm having trouble connecting right now, but I've updated your resume workspace. Let's try sending that again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    const welcomeMessage: ChatMessage = {
      id: `msg_welcome_${Date.now()}`,
      role: 'model',
      content: `👋 Ready for a fresh start! Tell me what role you're targeting or what resume you'd like to build.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMessage]);
  };

  const handleCopyResumeText = () => {
    if (!currentResume) return;
    const text = [
      `${currentResume.personalInfo.fullName} - ${currentResume.personalInfo.jobTitle}`,
      `Email: ${currentResume.personalInfo.email} | Phone: ${currentResume.personalInfo.phone} | Location: ${currentResume.personalInfo.location}`,
      `\n--- PROFESSIONAL SUMMARY ---\n${currentResume.summary}`,
      `\n--- WORK EXPERIENCE ---`,
      ...currentResume.experience.map((e) => `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.description}`),
      `\n--- EDUCATION ---`,
      ...currentResume.education.map((ed) => `${ed.degree} - ${ed.institution} (${ed.startYear} - ${ed.endYear})`),
      `\n--- SKILLS ---`,
      currentResume.skills.map((s) => s.name).join(', '),
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[94vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white/10">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Gemini AI Resume Architect
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Chat interactively to build, polish, and optimize your resume in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher (split / chat / resume) */}
            <div className="hidden md:flex items-center bg-white/10 rounded-xl p-1 text-xs border border-white/10">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('chat-only')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  viewMode === 'chat-only' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Chat Only
              </button>
              <button
                onClick={() => setViewMode('resume-only')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  viewMode === 'resume-only' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Resume Preview
              </button>
            </div>

            {/* Clear conversation */}
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Body: Split or Single View */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Chat Conversation Pane */}
          {(viewMode === 'split' || viewMode === 'chat-only') && (
            <div
              className={`flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all ${
                viewMode === 'chat-only' ? 'w-full' : 'w-full md:w-[50%] lg:w-[48%]'
              }`}
            >
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {messages.map((msg) => {
                  const isBot = msg.role === 'model';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-[88%] sm:max-w-[82%] space-y-2`}>
                        {/* Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isBot
                              ? 'bg-white text-slate-800 shadow-xs border border-slate-200/80 rounded-tl-sm'
                              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md shadow-indigo-600/10'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-sans prose prose-sm max-w-none prose-slate">
                            {msg.content}
                          </div>

                          <div
                            className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                              isBot ? 'text-slate-400' : 'text-indigo-200'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                          </div>
                        </div>

                        {/* If this message came with an updated resume snapshot */}
                        {msg.resumeSnapshot && (
                          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3 shadow-xs space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-xs text-indigo-950">
                                    {msg.resumeSnapshot.personalInfo.jobTitle || msg.resumeSnapshot.resumeName}
                                  </div>
                                  <div className="text-[11px] text-indigo-700">
                                    {msg.resumeSnapshot.experience.length} experiences • {msg.resumeSnapshot.skills.length} skills
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                Updated
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-indigo-200/60">
                              <button
                                onClick={() => {
                                  onLoadResumeIntoBuilder(msg.resumeSnapshot!);
                                  onClose();
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                              >
                                <Edit className="w-3 h-3" />
                                Load in Builder
                              </button>
                              <button
                                onClick={() => onPreviewResume(msg.resumeSnapshot!)}
                                className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition"
                              >
                                <Eye className="w-3 h-3" />
                                Full View
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isBot && (
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                          {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs border border-slate-200 text-sm text-slate-600 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">Gemini is writing your resume...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Carousel */}
              <div className="px-4 py-2 bg-white border-t border-slate-200/80 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Wand2 className="w-3 h-3 text-indigo-500" /> Prompts:
                  </span>
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.prompt)}
                      disabled={loading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg border border-slate-200 hover:border-indigo-200 transition shrink-0 disabled:opacity-50"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
                <div className="relative flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 p-2 transition">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tell Gemini what role or background to add, or paste your raw notes... (Enter to send)"
                    rows={2}
                    className="flex-1 bg-transparent border-0 resize-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden px-2 py-1 leading-relaxed max-h-32"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || loading}
                    className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
                  <span>Shift + Enter for new line • Instant resume syncing</span>
                  {currentResume && (
                    <span className="text-indigo-600 font-medium">
                      Active: {currentResume.personalInfo.jobTitle || 'Resume'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Live Resume Preview Pane */}
          {(viewMode === 'split' || viewMode === 'resume-only') && (
            <div
              className={`flex flex-col h-full bg-slate-100/70 overflow-hidden transition-all ${
                viewMode === 'resume-only' ? 'w-full' : 'hidden md:flex flex-1'
              }`}
            >
              {/* Preview Action Header */}
              <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Resume Canvas
                  </h3>
                  {currentResume && (
                    <span className="text-xs text-slate-400 font-medium">
                      • {currentResume.resumeName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentResume && (
                    <>
                      <button
                        onClick={handleCopyResumeText}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => onPreviewResume(currentResume)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview & PDF
                      </button>

                      <button
                        onClick={() => {
                          onLoadResumeIntoBuilder(currentResume);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Open in Builder
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Scrollable Live Resume Sheet */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex justify-center">
                {currentResume ? (
                  <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-slate-200/90 p-7 space-y-6 text-slate-800 animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-5">
                      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {currentResume.personalInfo.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-indigo-600 font-semibold text-base mt-0.5">
                        {currentResume.personalInfo.jobTitle || 'Target Role'}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                        {currentResume.personalInfo.email && (
                          <span>📧 {currentResume.personalInfo.email}</span>
                        )}
                        {currentResume.personalInfo.phone && (
                          <span>📞 {currentResume.personalInfo.phone}</span>
                        )}
                        {currentResume.personalInfo.location && (
                          <span>📍 {currentResume.personalInfo.location}</span>
                        )}
                        {currentResume.personalInfo.linkedIn && (
                          <span>🔗 {currentResume.personalInfo.linkedIn}</span>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {currentResume.summary && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-600" /> Professional Summary
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-700 font-normal">
                          {currentResume.summary}
                        </p>
                      </div>
                    )}

                    {/* Work Experience */}
                    {currentResume.experience && currentResume.experience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Work Experience
                        </h4>
                        <div className="space-y-3.5">
                          {currentResume.experience.map((exp) => (
                            <div key={exp.id} className="border-l-2 border-indigo-200 pl-3.5 space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-sm text-slate-900">{exp.jobTitle}</span>
                                <span className="text-[11px] font-medium text-slate-500">
                                  {exp.startDate} – {exp.endDate}
                                </span>
                              </div>
                              <div className="text-xs text-indigo-700 font-semibold">
                                {exp.company} {exp.location ? `• ${exp.location}` : ''}
                              </div>
                              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-1">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {currentResume.skills && currentResume.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Core Competencies & Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {currentResume.skills.map((skill) => (
                            <span
                              key={skill.id}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                            >
                              {skill.name}
                              <span className="ml-1 text-[10px] text-slate-400">({skill.level})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {currentResume.education && currentResume.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Education
                        </h4>
                        <div className="space-y-2">
                          {currentResume.education.map((edu) => (
                            <div key={edu.id} className="border-l-2 border-slate-200 pl-3 space-y-0.5">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-xs text-slate-900">{edu.degree}</span>
                                <span className="text-[11px] text-slate-500">
                                  {edu.startYear} – {edu.endYear}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600">{edu.institution} {edu.grade ? `• ${edu.grade}` : ''}</div>
                              {edu.description && (
                                <p className="text-[11px] text-slate-500">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {currentResume.projects && currentResume.projects.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" /> Featured Projects
                        </h4>
                        <div className="space-y-2">
                          {currentResume.projects.map((proj) => (
                            <div key={proj.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                              <div className="font-semibold text-xs text-slate-900">{proj.title}</div>
                              <div className="text-[11px] text-indigo-600 font-medium">{proj.technologies}</div>
                              <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty state for preview */
                  <div className="m-auto text-center max-w-sm p-6 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                      <Bot className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Your Resume will build here</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Send a message to Gemini in the chat on the left. Tell it your target role or paste your background, and watch your resume assemble in real time!
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleSendMessage('Build a complete resume for a Full Stack Software Engineer with React, Node, and AWS.')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition flex items-center justify-between"
                      >
                        <span>🚀 Start with Full Stack Engineer</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleSendMessage('Build a Product Manager resume with 5 years experience in SaaS.')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition flex items-center justify-between"
                      >
                        <span>💼 Start with Product Manager</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
