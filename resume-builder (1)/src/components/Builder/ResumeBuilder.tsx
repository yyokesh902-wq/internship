import React, { useState } from 'react';
import {
  ResumeData,
  EducationItem,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  CertificationItem,
  AchievementItem,
  LanguageItem,
  HobbyItem,
  TemplateType,
} from '../../types/resume.ts';
import { api } from '../../services/api.ts';
import { getSampleResume } from '../../utils/sampleData.ts';
import { exportResumeToPDF, triggerPrintResume } from '../../utils/pdfExport.ts';
import { ResumeRenderer } from '../ResumeTemplates/ResumeRenderer.tsx';
import { TemplateBrowser } from '../Templates/TemplateBrowser.tsx';
import { getTemplateById } from '../../data/templatesData.ts';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  Plus,
  Upload,
  Sparkles,
  Download,
  Printer,
  Eye,
  Check,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  Heart,
  LayoutTemplate,
  User as UserIcon,
  Bot,
} from 'lucide-react';

interface ResumeBuilderProps {
  initialResume: ResumeData;
  onSave: (resume: ResumeData) => Promise<void>;
  onBackToDashboard: () => void;
  onOpenAiModal?: () => void;
  onOpenChatbot?: () => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialResume,
  onSave,
  onBackToDashboard,
  onOpenAiModal,
  onOpenChatbot,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResume);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatingBulletsId, setGeneratingBulletsId] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Skill input temporary state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Hobby input temporary state
  const [newHobbyName, setNewHobbyName] = useState('');

  const steps = [
    { number: 1, title: 'Personal', icon: UserIcon },
    { number: 2, title: 'Summary', icon: Briefcase },
    { number: 3, title: 'Education', icon: GraduationCap },
    { number: 4, title: 'Skills', icon: Wrench },
    { number: 5, title: 'Projects', icon: FolderGit2 },
    { number: 6, title: 'Experience', icon: Briefcase },
    { number: 7, title: 'Certifications', icon: Award },
    { number: 8, title: 'Achievements', icon: Award },
    { number: 9, title: 'Languages', icon: Globe },
    { number: 10, title: 'Hobbies', icon: Heart },
    { number: 11, title: 'Template', icon: LayoutTemplate },
    { number: 12, title: 'Preview', icon: Eye },
  ];

  // Helper updates
  const updatePersonalInfo = (field: keyof typeof resumeData.personalInfo, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setErrorMsg(null);
    try {
      const { dataUrl } = await api.uploadPhoto(file);
      updatePersonalInfo('profilePhoto', dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!resumeData.resumeName.trim()) {
      setErrorMsg('Please enter a Resume Name before saving.');
      return;
    }
    if (!resumeData.personalInfo.fullName.trim()) {
      setErrorMsg('Please enter Full Name in Personal Information.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onSave(resumeData);
      setSaveSuccessMsg('Resume saved successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSample = () => {
    const sample = getSampleResume(resumeData.personalInfo.fullName || 'Alex Morgan', resumeData.personalInfo.email || 'alex@example.com');
    setResumeData({
      ...sample,
      _id: resumeData._id,
      resumeName: resumeData.resumeName || 'Sample Developer Resume',
    });
    setSaveSuccessMsg('Loaded sample resume data!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleAIImproveSummary = async () => {
    setIsGeneratingAI(true);
    setErrorMsg(null);
    try {
      const skillsList = resumeData.skills.map((s) => s.name);
      const generated = await api.enhanceSummary({
        jobTitle: resumeData.personalInfo.jobTitle,
        skills: skillsList,
        currentDraft: resumeData.summary,
      });
      setResumeData((prev) => ({ ...prev, summary: generated }));
      setSaveSuccessMsg('Summary enhanced by Gemini AI!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('AI enhancement failed. Using fallback template.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAIGenerateBullets = async (expId: string, jobTitle: string, company: string, currentDesc: string) => {
    setGeneratingBulletsId(expId);
    setErrorMsg(null);
    try {
      const bullets = await api.generateBulletsWithAI({
        jobTitle: jobTitle || resumeData.personalInfo.jobTitle || 'Professional',
        company: company || 'Organization',
        existingDescription: currentDesc,
      });
      updateExperience(expId, 'description', bullets);
      setSaveSuccessMsg('Action bullet points generated with Gemini AI!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to generate bullets with AI.');
    } finally {
      setGeneratingBulletsId(null);
    }
  };

  // Education Helpers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: 'edu_' + Date.now(),
      degree: '',
      institution: '',
      university: '',
      location: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: '',
    };
    setResumeData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  // Skills Helpers
  const addSkill = (name?: string, level?: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const skillName = name || newSkillName;
    if (!skillName.trim()) return;

    if (resumeData.skills.some((s) => s.name.toLowerCase() === skillName.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const newItem: SkillItem = {
      id: 'sk_' + Date.now(),
      name: skillName.trim(),
      level: level || newSkillLevel,
    };
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, newItem] }));
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  // Projects Helpers
  const addProject = () => {
    const newItem: ProjectItem = {
      id: 'proj_' + Date.now(),
      title: '',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
    };
    setResumeData((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: 'exp_' + Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    setResumeData((prev) => ({ ...prev, experience: [...prev.experience, newItem] }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  // Certifications Helpers
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: 'cert_' + Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
    };
    setResumeData((prev) => ({ ...prev, certifications: [...prev.certifications, newItem] }));
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== id) }));
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  // Achievements Helpers
  const addAchievement = () => {
    const newItem: AchievementItem = {
      id: 'ach_' + Date.now(),
      title: '',
      description: '',
    };
    setResumeData((prev) => ({ ...prev, achievements: [...prev.achievements, newItem] }));
  };

  const removeAchievement = (id: string) => {
    setResumeData((prev) => ({ ...prev, achievements: prev.achievements.filter((a) => a.id !== id) }));
  };

  const updateAchievement = (id: string, field: keyof AchievementItem, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }));
  };

  // Languages Helpers
  const addLanguage = () => {
    const newItem: LanguageItem = {
      id: 'lang_' + Date.now(),
      name: '',
      proficiency: 'Fluent',
    };
    setResumeData((prev) => ({ ...prev, languages: [...prev.languages, newItem] }));
  };

  const removeLanguage = (id: string) => {
    setResumeData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }));
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  // Hobbies Helpers
  const addHobby = () => {
    if (!newHobbyName.trim()) return;
    const newItem: HobbyItem = {
      id: 'hob_' + Date.now(),
      name: newHobbyName.trim(),
    };
    setResumeData((prev) => ({ ...prev, hobbies: [...prev.hobbies, newItem] }));
    setNewHobbyName('');
  };

  const removeHobby = (id: string) => {
    setResumeData((prev) => ({ ...prev, hobbies: prev.hobbies.filter((h) => h.id !== id) }));
  };

  // PDF Export
  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    const filename = `${resumeData.personalInfo.fullName || resumeData.resumeName || 'Resume'}.pdf`
      .replace(/\s+/g, '_')
      .toLowerCase();

    await exportResumeToPDF('resume-builder-printable-area', filename);
    setIsExportingPDF(false);
  };

  const quickSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Express.js',
    'MongoDB',
    'SQL',
    'Python',
    'Java',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Git',
    'Docker',
    'REST APIs',
  ];

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Resume Name
              </div>
              <input
                type="text"
                value={resumeData.resumeName}
                onChange={(e) => setResumeData({ ...resumeData, resumeName: e.target.value })}
                placeholder="e.g. Software Developer Resume"
                className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1 py-0.5 rounded transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenChatbot && (
              <button
                type="button"
                onClick={onOpenChatbot}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-lg transition shadow-xs cursor-pointer"
                title="Chat with Gemini AI to rewrite, optimize, or improve this resume"
              >
                <Bot className="w-3.5 h-3.5 text-white" />
                <span>AI Chat Assistant</span>
              </button>
            )}
            {onOpenAiModal && (
              <button
                type="button"
                onClick={onOpenAiModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition shadow-2xs cursor-pointer"
                title="Generate or recreate resume using Gemini AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fast Generator</span>
              </button>
            )}
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Load Sample Data
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Progress Stepper */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-xs border border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isPassed = currentStep > step.number;
              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => setCurrentStep(step.number)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 shadow'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 whitespace-nowrap font-medium ${
                        isActive ? 'text-indigo-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step Form Editor (7 cols or full) */}
          <div
            className={`${
              currentStep >= 11 ? 'lg:col-span-12' : 'lg:col-span-7'
            } bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-slate-200 space-y-6`}
          >
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your contact details so employers can reach you.
                  </p>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  {resumeData.personalInfo.profilePhoto ? (
                    <img
                      src={resumeData.personalInfo.profilePhoto}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-400"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <UserIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={isUploadingPhoto}
                        />
                      </label>
                      {resumeData.personalInfo.profilePhoto && (
                        <button
                          type="button"
                          onClick={() => updatePersonalInfo('profilePhoto', '')}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Max size: 5MB (PNG, JPG, WEBP)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="e.g. Yokesh Kumar"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.jobTitle || ''}
                      onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                      placeholder="e.g. Full-Stack Developer"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="yokesh@example.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedIn || ''}
                      onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      GitHub Profile
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portfolio / Website
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.portfolio || ''}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      placeholder="yoursite.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Summary */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Professional Summary</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Write a brief 3-4 sentence overview of your key expertise and career ambitions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAIImproveSummary}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition disabled:opacity-50 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{isGeneratingAI ? 'Gemini AI Writing...' : 'Enhance with Gemini AI'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <textarea
                    rows={6}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Results-driven Software Engineer with a passion for building robust web applications..."
                    className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>
                      {resumeData.summary.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span>{resumeData.summary.length} characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Education</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add degrees, colleges, certifications or diplomas.
                    </p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>

                {resumeData.education.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No education entries added yet.</p>
                    <button
                      onClick={addEducation}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add your first degree or school
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">
                            Entry #{index + 1}
                          </span>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Degree / Course
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="e.g. B.Tech in Computer Science"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Institution / College
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="e.g. Stanford University"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Start Year
                            </label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                              placeholder="2019"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              End Year (or Expected)
                            </label>
                            <input
                              type="text"
                              value={edu.endYear}
                              onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                              placeholder="2023"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              CGPA / Percentage (Optional)
                            </label>
                            <input
                              type="text"
                              value={edu.grade || ''}
                              onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                              placeholder="e.g. 8.8 CGPA / 3.9 GPA"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Location (Optional)
                            </label>
                            <input
                              type="text"
                              value={edu.location || ''}
                              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                              placeholder="e.g. Stanford, CA"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Additional Details / Honors
                          </label>
                          <input
                            type="text"
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                            placeholder="Dean's List, Relevant Coursework, etc."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Skills</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Highlight your technical abilities, tools, and proficiencies.
                  </p>
                </div>

                {/* Add Skill Bar */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Enter skill name (e.g. TypeScript, React)"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) =>
                      setNewSkillLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')
                    }
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-700"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                  >
                    Add
                  </button>
                </div>

                {/* Quick Add Suggestions */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Suggested Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSkills.map((sk) => {
                      const alreadyAdded = resumeData.skills.some(
                        (s) => s.name.toLowerCase() === sk.toLowerCase()
                      );
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => !alreadyAdded && addSkill(sk, 'Intermediate')}
                          disabled={alreadyAdded}
                          className={`px-2.5 py-1 text-xs rounded-md border transition ${
                            alreadyAdded
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                          }`}
                        >
                          + {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Skills List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700">
                    Added Skills ({resumeData.skills.length}):
                  </div>
                  {resumeData.skills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-800"
                        >
                          <span className="font-medium">{s.name}</span>
                          <span className="text-[10px] text-slate-500">· {s.level}</span>
                          <button
                            onClick={() => removeSkill(s.id)}
                            className="ml-1 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Projects */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Projects</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showcase applications, systems, or open-source software you built.
                    </p>
                  </div>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resumeData.projects.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No projects added yet.</p>
                    <button
                      onClick={addProject}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                          <button
                            onClick={() => removeProject(proj.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Project Title
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                              placeholder="e.g. Distributed Task Queue"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Technologies Used
                            </label>
                            <input
                              type="text"
                              value={proj.technologies}
                              onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                              placeholder="e.g. React, Node.js, Redis"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Project Live URL
                            </label>
                            <input
                              type="text"
                              value={proj.projectUrl || ''}
                              onChange={(e) => updateProject(proj.id, 'projectUrl', e.target.value)}
                              placeholder="https://myproject.app"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              GitHub Repo URL
                            </label>
                            <input
                              type="text"
                              value={proj.githubUrl || ''}
                              onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                              placeholder="https://github.com/username/project"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Description & Key Achievements
                          </label>
                          <textarea
                            rows={3}
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            placeholder="Architected backend service processing 5k events/sec..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Experience */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Work Experience</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      List your roles, internships, or employment history.
                    </p>
                  </div>
                  {!resumeData.isFresher && (
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>

                {/* Fresher Option Checkbox */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">I am a Fresher</span>
                    <p className="text-[11px] text-slate-500">
                      Check this if you have no prior full-time employment experience.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(resumeData.isFresher)}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, isFresher: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {resumeData.isFresher ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Fresher mode enabled. Work experience will be omitted from the resume.
                  </div>
                ) : resumeData.experience.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No work experience added yet.</p>
                    <button
                      onClick={addExperience}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add work experience entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Role #{idx + 1}</span>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={exp.jobTitle}
                              onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                              placeholder="e.g. Frontend Engineer"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Company / Organization
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="e.g. Acme Corp"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              placeholder="e.g. New York, NY (or Remote)"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                placeholder="Jan 2022"
                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={exp.endDate}
                                disabled={exp.isCurrent}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                placeholder={exp.isCurrent ? 'Present' : 'Dec 2023'}
                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`curr_${exp.id}`}
                            checked={Boolean(exp.isCurrent)}
                            onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor={`curr_${exp.id}`} className="text-xs text-slate-700 cursor-pointer">
                            I currently work here
                          </label>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[11px] font-semibold text-slate-600">
                              Responsibilities & Achievements
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAIGenerateBullets(exp.id, exp.jobTitle, exp.company, exp.description)}
                              disabled={generatingBulletsId === exp.id}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 rounded-md transition disabled:opacity-50 cursor-pointer"
                              title="Generate 4 quantifiable bullet points using Gemini AI"
                            >
                              <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                              <span>{generatingBulletsId === exp.id ? 'Gemini Writing...' : 'AI Generate Bullets'}</span>
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="• Spearheaded development of core microservices, increasing throughput by 25%..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Certifications */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Certifications</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add relevant professional certifications and credentials.
                    </p>
                  </div>
                  <button
                    onClick={addCertification}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                {resumeData.certifications.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No certifications added yet.</p>
                    <button
                      onClick={addCertification}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add a certificate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Certificate</span>
                          <button
                            onClick={() => removeCertification(cert.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Certification Name
                            </label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                              placeholder="e.g. AWS Certified Solutions Architect"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Issuing Organization
                            </label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                              placeholder="e.g. Amazon Web Services"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Issue Date / Year
                            </label>
                            <input
                              type="text"
                              value={cert.issueDate || ''}
                              onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                              placeholder="e.g. 2023"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Credential URL (Optional)
                            </label>
                            <input
                              type="text"
                              value={cert.credentialUrl || ''}
                              onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 8: Achievements */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Achievements & Honors</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Highlight hackathons, coding contests, scholarships or awards.
                    </p>
                  </div>
                  <button
                    onClick={addAchievement}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Achievement</span>
                  </button>
                </div>

                {resumeData.achievements.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No achievements added yet.</p>
                    <button
                      onClick={addAchievement}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add an achievement
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Achievement</span>
                          <button
                            onClick={() => removeAchievement(ach.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                            placeholder="e.g. 1st Place – National Hackathon 2023"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Description (Optional)
                          </label>
                          <input
                            type="text"
                            value={ach.description || ''}
                            onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                            placeholder="e.g. Awarded for developing an AI tool among 200 participants"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 9: Languages */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Languages</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Specify spoken and written languages with proficiency.
                    </p>
                  </div>
                  <button
                    onClick={addLanguage}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Language</span>
                  </button>
                </div>

                {resumeData.languages.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No languages added yet.</p>
                    <button
                      onClick={addLanguage}
                      className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add a language
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumeData.languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          placeholder="e.g. English"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none text-slate-700"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                        <button
                          onClick={() => removeLanguage(lang.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 10: Hobbies */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hobbies & Interests</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share your personal interests and passions.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHobbyName}
                    onChange={(e) => setNewHobbyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHobby();
                      }
                    }}
                    placeholder="e.g. Competitive Chess, Open Source, Hiking"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addHobby}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Your Interests ({resumeData.hobbies.length}):
                  </div>
                  {resumeData.hobbies.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No interests added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {resumeData.hobbies.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-800"
                        >
                          <span>{h.name}</span>
                          <button
                            onClick={() => removeHobby(h.id)}
                            className="ml-1 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 11: Template Selection (All 102 Templates) */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <TemplateBrowser
                  currentResume={resumeData}
                  onSelectTemplate={(templateId) => {
                    setResumeData({ ...resumeData, selectedTemplate: templateId });
                  }}
                  isInsideBuilder={true}
                />
              </div>
            )}

            {/* Step 12: Preview & Export */}
            {currentStep === 12 && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Final Resume Preview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your A4 resume is ready. Download as PDF or print.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setCurrentStep(11)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition flex items-center gap-1.5"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5" />
                      <span>Change Template ({getTemplateById(resumeData.selectedTemplate).name})</span>
                    </button>
                    <button
                      onClick={triggerPrintResume}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isExportingPDF}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center bg-slate-200 p-4 sm:p-8 rounded-xl shadow-inner overflow-x-auto">
                  <div className="scale-95 sm:scale-100 origin-top">
                    <ResumeRenderer
                      data={resumeData}
                      containerId="resume-builder-printable-area"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                Step {currentStep} of {steps.length}
              </span>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Finish'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Live Mini Preview (5 cols, shown during steps 1 to 10) */}
          {currentStep < 11 && (
            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-24 bg-white p-4 rounded-xl shadow-xs border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Live Preview</span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(12)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Full A4 View ›
                  </button>
                </div>

                {/* Active Template Bar */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
                  <div className="truncate">
                    <span className="text-slate-500 text-[10px] block uppercase font-medium">Active Template</span>
                    <span className="font-bold text-indigo-950 truncate">
                      {getTemplateById(resumeData.selectedTemplate).name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(11)}
                    className="px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-md transition shadow-2xs shrink-0"
                  >
                    Change (102)
                  </button>
                </div>

                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 max-h-[700px] overflow-y-auto">
                  <div className="scale-65 origin-top-left w-[153%]">
                    <ResumeRenderer data={resumeData} containerId="mini-live-preview" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
