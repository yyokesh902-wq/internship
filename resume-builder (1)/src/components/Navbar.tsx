import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useThemeEffects } from '../context/ThemeEffectsContext.tsx';
import { FileText, LogOut, Plus, User, Menu, X, Sparkles, Bot, Palette } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'builder' | 'templates';
  onNavigate: (view: 'landing' | 'dashboard' | 'builder' | 'templates') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNewResume: () => void;
  onOpenAiModal?: () => void;
  onOpenChatbot?: () => void;
  onOpenEffects?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onNewResume,
  onOpenAiModal,
  onOpenChatbot,
  onOpenEffects,
}) => {
  const { user, logout, loginAsDemo } = useAuth();
  const { isDark, settings } = useThemeEffects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-white'
          : 'bg-white/85 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Resume Builder
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Features
          </a>
          <button
            onClick={() => onNavigate('templates')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'templates' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Templates <span className="text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800">102</span>
          </button>
          {user && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
                currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {onOpenEffects && (
            <button
              onClick={onOpenEffects}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs"
              title="Change background colors, special effects, and cursor design"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Effects & Cursor</span>
            </button>
          )}

          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              title="Chat interactively with Gemini AI to build or refine your resume"
            >
              <Bot className="w-3.5 h-3.5 text-white" />
              <span>Resume Chatbot</span>
            </button>
          )}

          {onOpenAiModal && (
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition cursor-pointer"
              title="Generate a complete ATS-ready resume in seconds with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Fast AI</span>
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={onNewResume}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Blank Resume</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="truncate max-w-[120px]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-md hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => loginAsDemo()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                title="Test instantly with preloaded demo profile"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Demo Try</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition shadow-sm whitespace-nowrap"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2">
            {onOpenEffects && (
              <button
                onClick={() => {
                  onOpenEffects();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>Effects & Cursor Customizer</span>
              </button>
            )}
            {onOpenChatbot && (
              <button
                onClick={() => {
                  onOpenChatbot();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-sm"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>AI Resume Chatbot (Chat & Build)</span>
              </button>
            )}
            {onOpenAiModal && (
              <button
                onClick={() => {
                  onOpenAiModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Fast AI Generator</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Features
            </button>
            <button
              onClick={() => {
                onNavigate('templates');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center justify-between"
            >
              <span>Templates</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">102</span>
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
              >
                Dashboard
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 text-xs text-slate-500">Signed in as {user.name}</div>
                <button
                  onClick={() => {
                    onNewResume();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Resume</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
