import React, { useState } from 'react';
import {
  X,
  Palette,
  MousePointer,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Compass,
  Sliders,
  Layers,
  Eye,
  Radio,
} from 'lucide-react';
import { useThemeEffects } from '../../context/ThemeEffectsContext.tsx';
import {
  BACKGROUND_THEMES,
  CURSOR_STYLES,
  BackgroundThemeId,
  CursorStyleId,
} from '../../types/theme.ts';

interface ThemeEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeEffectsModal: React.FC<ThemeEffectsModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    setTheme,
    setCursor,
    toggleEffect,
    updateSettings,
    resetToDefaults,
  } = useThemeEffects();

  const [activeTab, setActiveTab] = useState<'background' | 'cursor' | 'effects'>('background');
  const [testClickCount, setTestClickCount] = useState(0);

  if (!isOpen) return null;

  const handleShuffle = () => {
    const randomTheme = BACKGROUND_THEMES[Math.floor(Math.random() * BACKGROUND_THEMES.length)].id;
    const cursorOptions: CursorStyleId[] = ['halo', 'trail', 'crosshair', 'minimal'];
    const randomCursor = cursorOptions[Math.floor(Math.random() * cursorOptions.length)];
    updateSettings({
      theme: randomTheme,
      cursor: randomCursor,
      ambientOrbs: true,
      mouseSpotlight: true,
      gridPattern: true,
      clickRipples: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-slate-900 dark:text-white transition-all">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Theme & Special Effects Studio</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personalize background color palettes, interactive ambient effects, and custom cursor designs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Surprise me with a random combination"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Surprise Me</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'background'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Background Colors ({BACKGROUND_THEMES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cursor')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'cursor'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>Cursor Design ({CURSOR_STYLES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'effects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Special Effects</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto space-y-6">
          {/* TAB 1: BACKGROUND THEMES */}
          {activeTab === 'background' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Select Background Color Palette
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any theme to apply it immediately to the site. Resumes remain cleanly formatted on crisp white A4 paper.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {BACKGROUND_THEMES.map((themeItem) => {
                  const isSelected = settings.theme === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      onClick={() => setTheme(themeItem.id)}
                      className={`group relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* Color Preview Swatch */}
                      <div
                        className={`w-full h-18 rounded-xl bg-linear-to-br ${themeItem.previewGradient} border border-white/10 relative overflow-hidden mb-3 shadow-inner flex items-center justify-center`}
                      >
                        {/* Swatch decorative glow */}
                        <div
                          className="w-12 h-12 rounded-full blur-md opacity-60"
                          style={{ backgroundColor: themeItem.accentColor }}
                        />
                        <span className="text-[10px] font-bold text-white/90 drop-shadow-sm px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs">
                          {themeItem.category === 'dark' ? 'Dark Atmosphere' : 'Light Ambient'}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {themeItem.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {themeItem.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: themeItem.accentColor }}
                          />
                          {themeItem.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CURSOR DESIGN */}
          {activeTab === 'cursor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Select Custom Cursor Design
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Interactive pointers with real-time hover physics, dynamic magnetic halos, and stardust particle trails.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CURSOR_STYLES.map((cursorItem) => {
                  const isSelected = settings.cursor === cursorItem.id;
                  return (
                    <button
                      key={cursorItem.id}
                      onClick={() => setCursor(cursorItem.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            {cursorItem.id === 'crosshair' ? (
                              <Compass className="w-4 h-4" />
                            ) : cursorItem.id === 'trail' ? (
                              <Sparkles className="w-4 h-4" />
                            ) : cursorItem.id === 'minimal' ? (
                              <Radio className="w-4 h-4" />
                            ) : (
                              <MousePointer className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {cursorItem.name}
                            </span>
                            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {cursorItem.badge}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                        {cursorItem.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Test Sandbox */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    Cursor Interactive Test Playground
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Clicks: <strong className="text-indigo-600 dark:text-indigo-400">{testClickCount}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hover over these controls to see magnetic halo expansion, target acquisition, or trail particle emissions!
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => setTestClickCount((c) => c + 1)}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                  >
                    Hover & Click Me
                  </button>
                  <button
                    onClick={() => setTestClickCount((c) => c + 1)}
                    className="px-4 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    Pulse Magnetic Ring
                  </button>
                  <input
                    type="text"
                    placeholder="Type here to test text cursor..."
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-indigo-500 w-48"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIAL EFFECTS */}
          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Interactive Background & Motion Effects
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggle fine-tuned atmospheric layers, dynamic mouse spotlights, and click physics.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Ambient Glowing Orbs */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Floating Ambient Orbs
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Slowly drifting, breathing luminous gradient blooms that create atmospheric depth.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ambientOrbs}
                      onChange={() => toggleEffect('ambientOrbs')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* 2. Mouse Spotlight / Flashlight */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Interactive Mouse Spotlight
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dynamic radial illumination that follows your mouse and illuminates background textures.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.mouseSpotlight}
                      onChange={() => toggleEffect('mouseSpotlight')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* 3. Cyber Matrix / Dot Grid */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Geometric Matrix & Dot Grid
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        High-tech architectural grid pattern with radial vignette edge softening.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.gridPattern}
                      onChange={() => toggleEffect('gridPattern')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* 4. Click Shockwave Ripples */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Click Shockwave Ripples
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Radial shockwave pulse that erupts when clicking anywhere on the screen.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.clickRipples}
                      onChange={() => toggleEffect('clickRipples')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-xl shadow-md transition cursor-pointer"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
