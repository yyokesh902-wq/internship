/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeEffectsProvider, useThemeEffects } from './context/ThemeEffectsContext.tsx';
import { ResumeData, TemplateType } from './types/resume.ts';
import { api } from './services/api.ts';
import { getSampleResume } from './utils/sampleData.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './components/Landing/LandingPage.tsx';
import { Dashboard } from './components/Dashboard/Dashboard.tsx';
import { ResumeBuilder } from './components/Builder/ResumeBuilder.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ResumePreviewModal } from './components/ResumePreviewModal.tsx';
import { TemplateBrowser } from './components/Templates/TemplateBrowser.tsx';
import { AiResumeModal } from './components/AiResumeModal.tsx';
import { ResumeChatbotModal } from './components/Chatbot/ResumeChatbotModal.tsx';
import { FloatingChatTrigger } from './components/Chatbot/FloatingChatTrigger.tsx';
import { BackgroundEffects } from './components/Effects/BackgroundEffects.tsx';
import { CustomCursor } from './components/Effects/CustomCursor.tsx';
import { ThemeEffectsModal } from './components/Effects/ThemeEffectsModal.tsx';
import { EffectsFloatingWidget } from './components/Effects/EffectsFloatingWidget.tsx';

function MainApp() {
  const { user, token } = useAuth();
  const { isDark } = useThemeEffects();

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'builder' | 'templates'>('landing');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Fast AI Generator modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Interactive AI Resume Chatbot modal state
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Theme, background colors & cursor effects modal state
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);

  // Fetch resumes when user logs in
  useEffect(() => {
    if (user && token) {
      loadResumes();
    } else {
      setResumes([]);
    }
  }, [user, token]);

  const loadResumes = async () => {
    setResumesLoading(true);
    try {
      const data = await api.getResumes();
      setResumes(data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setResumesLoading(false);
    }
  };

  const createBlankResume = (preferredTemplate: TemplateType = 'modern-blue'): ResumeData => {
    return {
      resumeName: 'My Resume',
      selectedTemplate: preferredTemplate,
      personalInfo: {
        fullName: user?.name || '',
        jobTitle: '',
        email: user?.email || '',
        phone: '',
        location: '',
        portfolio: '',
        linkedIn: '',
        github: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      hobbies: [],
      isFresher: false,
    };
  };

  const handleStartNewResume = (templateId?: TemplateType) => {
    const blank = createBlankResume(templateId || 'modern-blue');
    setActiveResume(blank);
    setCurrentView('builder');
  };

  const handleEditResume = (resume: ResumeData) => {
    setActiveResume(resume);
    setCurrentView('builder');
  };

  const handleSaveResume = async (resumeToSave: ResumeData) => {
    if (!user) {
      setPendingAction(() => async () => {
        await handleSaveResume(resumeToSave);
      });
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (resumeToSave._id) {
      // Update existing
      const updated = await api.updateResume(resumeToSave._id, resumeToSave);
      setResumes((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setActiveResume(updated);
    } else {
      // Create new
      const created = await api.createResume(resumeToSave);
      setResumes((prev) => [created, ...prev]);
      setActiveResume(created);
    }
  };

  const handleDeleteResume = async (id: string) => {
    await api.deleteResume(id);
    setResumes((prev) => prev.filter((r) => r._id !== id));
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleOpenAiModal = () => {
    setAiModalOpen(true);
  };

  const handleOpenChatbot = () => {
    setChatbotOpen(true);
  };

  const handleChatbotLoadIntoBuilder = (resume: ResumeData) => {
    setActiveResume(resume);
    setCurrentView('builder');
    setChatbotOpen(false);
  };

  const handleAiResumeGenerated = (generated: ResumeData) => {
    setActiveResume(generated);
    setCurrentView('builder');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 relative ${
        isDark ? 'text-slate-100 bg-transparent' : 'text-slate-900 bg-transparent'
      }`}
    >
      {/* Background Special Effects Layer (Fixed full-screen, GPU-accelerated) */}
      <BackgroundEffects />

      {/* Custom Interactive Cursor Design (Halo, Stardust Trail, Crosshair, Precision Dot) */}
      <CustomCursor />

      {/* Navbar is persistent across all views, but hidden on print */}
      <div className="print:hidden">
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenAuth={handleOpenAuth}
          onNewResume={() => handleStartNewResume()}
          onOpenAiModal={handleOpenAiModal}
          onOpenChatbot={handleOpenChatbot}
          onOpenEffects={() => setEffectsModalOpen(true)}
        />
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onCreateResume={() => handleStartNewResume()}
            onSelectTemplate={(tmpl) => handleStartNewResume(tmpl)}
            onViewTemplates={() => setCurrentView('templates')}
            onOpenAiModal={handleOpenAiModal}
            onOpenChatbot={handleOpenChatbot}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            resumes={resumes}
            loading={resumesLoading}
            onCreateNew={() => handleStartNewResume()}
            onEditResume={handleEditResume}
            onPreviewResume={(res) => setPreviewResume(res)}
            onDeleteResume={handleDeleteResume}
            onOpenAiModal={handleOpenAiModal}
            onOpenChatbot={handleOpenChatbot}
          />
        )}

        {currentView === 'templates' && (
          <TemplateBrowser
            currentResume={activeResume}
            onSelectTemplate={(templateId) => {
              if (activeResume) {
                setActiveResume({ ...activeResume, selectedTemplate: templateId });
                setCurrentView('builder');
              } else {
                handleStartNewResume(templateId);
              }
            }}
            onBack={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('landing');
              }
            }}
          />
        )}

        {currentView === 'builder' && activeResume && (
          <ResumeBuilder
            initialResume={activeResume}
            onSave={handleSaveResume}
            onBackToDashboard={() => {
              if (user) {
                loadResumes();
                setCurrentView('dashboard');
              } else {
                setCurrentView('landing');
              }
            }}
            onOpenAiModal={handleOpenAiModal}
            onOpenChatbot={handleOpenChatbot}
          />
        )}
      </main>

      {/* Footer is hidden on print */}
      <div className="print:hidden">
        <Footer />
      </div>

      {/* Interactive Gemini AI Resume Chatbot Studio */}
      <ResumeChatbotModal
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        onLoadResumeIntoBuilder={handleChatbotLoadIntoBuilder}
        onPreviewResume={(res) => setPreviewResume(res)}
        initialResume={activeResume}
      />

      {/* Floating Chat Trigger Button (Bottom-Right) */}
      <FloatingChatTrigger
        isOpen={chatbotOpen}
        onClick={handleOpenChatbot}
      />

      {/* Floating Effects & Cursor Trigger Button (Bottom-Left) */}
      <EffectsFloatingWidget onOpen={() => setEffectsModalOpen(true)} />

      {/* Theme, Background Colors & Cursor Design Customizer Modal */}
      <ThemeEffectsModal
        isOpen={effectsModalOpen}
        onClose={() => setEffectsModalOpen(false)}
      />

      {/* Fast Gemini AI Generator Modal */}
      <AiResumeModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerated={handleAiResumeGenerated}
        defaultJobTitle={activeResume?.personalInfo?.jobTitle || ''}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Full Resume Preview Modal */}
      {previewResume && (
        <ResumePreviewModal
          resume={previewResume}
          isOpen={Boolean(previewResume)}
          onClose={() => setPreviewResume(null)}
          onEdit={(res) => handleEditResume(res)}
          onUpdateTemplate={async (tmpl) => {
            const updated = { ...previewResume, selectedTemplate: tmpl };
            setPreviewResume(updated);
            if (updated._id) {
              await api.updateResume(updated._id, { selectedTemplate: tmpl });
              setResumes((prev) =>
                prev.map((r) => (r._id === updated._id ? { ...r, selectedTemplate: tmpl } : r))
              );
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeEffectsProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeEffectsProvider>
  );
}
