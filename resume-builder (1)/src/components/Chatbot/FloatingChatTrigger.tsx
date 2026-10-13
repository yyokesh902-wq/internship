import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingChatTriggerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingChatTrigger: React.FC<FloatingChatTriggerProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white rounded-full shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 border border-white/20"
        aria-label="Open AI Resume Chatbot"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>

        <div className="flex items-center gap-1.5 font-bold text-xs tracking-wide">
          <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-200" />
          <span>AI Resume Chatbot</span>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-white/20 rounded-full text-indigo-100">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          Chat to build
        </span>
      </button>
    </div>
  );
};
