import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BackgroundThemeId,
  CursorStyleId,
  ThemeEffectsSettings,
  BACKGROUND_THEMES,
} from '../types/theme.ts';

interface ThemeEffectsContextType {
  settings: ThemeEffectsSettings;
  isDark: boolean;
  setTheme: (theme: BackgroundThemeId) => void;
  setCursor: (cursor: CursorStyleId) => void;
  toggleEffect: (key: keyof Omit<ThemeEffectsSettings, 'theme' | 'cursor'>) => void;
  updateSettings: (newSettings: Partial<ThemeEffectsSettings>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: ThemeEffectsSettings = {
  theme: 'aurora',
  cursor: 'halo',
  ambientOrbs: true,
  mouseSpotlight: true,
  gridPattern: true,
  clickRipples: true,
};

const STORAGE_KEY = 'resume_builder_theme_effects_v1';

const ThemeEffectsContext = createContext<ThemeEffectsContextType | undefined>(undefined);

export const ThemeEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeEffectsSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse theme settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const activeThemeMeta = BACKGROUND_THEMES.find((t) => t.id === settings.theme) || BACKGROUND_THEMES[0];
  const isDark = activeThemeMeta.category === 'dark';

  // Synchronize document attributes and classnames
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save theme settings to localStorage:', e);
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-cursor', settings.cursor);

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [settings, isDark]);

  const setTheme = (theme: BackgroundThemeId) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setCursor = (cursor: CursorStyleId) => {
    setSettings((prev) => ({ ...prev, cursor }));
  };

  const toggleEffect = (key: keyof Omit<ThemeEffectsSettings, 'theme' | 'cursor'>) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSettings = (partial: Partial<ThemeEffectsSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ThemeEffectsContext.Provider
      value={{
        settings,
        isDark,
        setTheme,
        setCursor,
        toggleEffect,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeEffectsContext.Provider>
  );
};

export const useThemeEffects = (): ThemeEffectsContextType => {
  const context = useContext(ThemeEffectsContext);
  if (!context) {
    throw new Error('useThemeEffects must be used within a ThemeEffectsProvider');
  }
  return context;
};
