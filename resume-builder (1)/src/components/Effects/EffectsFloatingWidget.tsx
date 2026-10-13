import React from 'react';
import { Palette, Sparkles, MousePointer } from 'lucide-react';
import { useThemeEffects } from '../../context/ThemeEffectsContext.tsx';
import { BACKGROUND_THEMES, CURSOR_STYLES } from '../../types/theme.ts';

interface EffectsFloatingWidgetProps {
  onOpen: () => void;
}

export const EffectsFloatingWidget: React.FC<EffectsFloatingWidgetProps> = ({ onOpen }) => {
  const { settings, isDark } = useThemeEffects();

  const currentTheme = BACKGROUND_THEMES.find((t) => t.id === settings.theme) || BACKGROUND_THEMES[0];
  const currentCursor = CURSOR_STYLES.find((c) => c.id === settings.cursor) || CURSOR_STYLES[0];

  return (
    <div className="fixed bottom-6 left-6 z-40 print:hidden select-none">
      <button
        onClick={onOpen}
        className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-700/80 text-white shadow-indigo-950/40'
            : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800 shadow-slate-300/40'
        }`}
        title="Customize background colors, special effects, and cursor design"
        aria-label="Theme, background effects, and cursor customizer"
      >
        {/* Swatch color pill */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-4 h-4 rounded-full ring-2 ring-white/50 shadow-xs"
            style={{ backgroundColor: currentTheme.accentColor }}
          />
          <Sparkles className="w-2.5 h-2.5 text-white absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold tracking-tight leading-none flex items-center gap-1">
            <span>Effects & Cursor</span>
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-400 font-medium leading-tight">
            {currentTheme.name} · {currentCursor.name}
          </span>
        </div>

        <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
          <Palette className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
