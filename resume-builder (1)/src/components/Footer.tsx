import React from 'react';
import { FileText, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Resume Builder</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <span>Fast & Free</span>
            <span aria-hidden="true">·</span>
            <span>ATS Friendly</span>
            <span aria-hidden="true">·</span>
            <span>A4 PDF Export</span>
            <span aria-hidden="true">·</span>
            <span>Custom Templates</span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with modern web standards <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
