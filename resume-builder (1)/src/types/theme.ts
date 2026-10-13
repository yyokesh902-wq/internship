export type BackgroundThemeId = 'aurora' | 'cyber' | 'sunset' | 'emerald' | 'frost' | 'classic';

export type CursorStyleId = 'halo' | 'trail' | 'crosshair' | 'minimal' | 'default';

export interface ThemeEffectsSettings {
  theme: BackgroundThemeId;
  cursor: CursorStyleId;
  ambientOrbs: boolean;
  mouseSpotlight: boolean;
  gridPattern: boolean;
  clickRipples: boolean;
}

export interface BackgroundThemeMeta {
  id: BackgroundThemeId;
  name: string;
  category: 'dark' | 'light';
  description: string;
  previewGradient: string;
  accentColor: string;
  tagline: string;
}

export const BACKGROUND_THEMES: BackgroundThemeMeta[] = [
  {
    id: 'aurora',
    name: 'Cosmic Aurora',
    category: 'dark',
    description: 'Deep obsidian space with shimmering indigo, violet, and electric cyan cosmic auroras.',
    previewGradient: 'from-slate-950 via-indigo-950 to-violet-950',
    accentColor: '#818cf8',
    tagline: 'Deep space & glowing nebulae',
  },
  {
    id: 'cyber',
    name: 'Cyber Midnight',
    category: 'dark',
    description: 'Stealth dark carbon with electric cyan and neon emerald grid matrix highlights.',
    previewGradient: 'from-slate-950 via-cyan-950 to-emerald-950',
    accentColor: '#06b6d4',
    tagline: 'Futuristic matrix & neon pulses',
  },
  {
    id: 'sunset',
    name: 'Sunset Velvet',
    category: 'dark',
    description: 'Luxurious dusk palette of royal violet, magenta glow, and warm ember accents.',
    previewGradient: 'from-slate-950 via-purple-950 to-rose-950',
    accentColor: '#f43f5e',
    tagline: 'Warm twilight & rich velvet hues',
  },
  {
    id: 'emerald',
    name: 'Emerald Noir',
    category: 'dark',
    description: 'Rich dark jade and forest noir with luminous mint and starlight reflections.',
    previewGradient: 'from-slate-950 via-emerald-950 to-teal-950',
    accentColor: '#10b981',
    tagline: 'Deep forest luxury & mint glow',
  },
  {
    id: 'frost',
    name: 'Frost Crystal',
    category: 'light',
    description: 'Pristine modern light mode with subtle iridescent pastel mesh and soft pearl lighting.',
    previewGradient: 'from-slate-50 via-indigo-50 to-purple-50',
    accentColor: '#6366f1',
    tagline: 'Crisp pearlescent crystal glass',
  },
  {
    id: 'classic',
    name: 'Slate Minimal',
    category: 'light',
    description: 'Clean, timeless slate canvas with subtle ambient depth for maximum focus.',
    previewGradient: 'from-slate-100 via-slate-50 to-slate-100',
    accentColor: '#475569',
    tagline: 'Timeless professional slate',
  },
];

export interface CursorStyleMeta {
  id: CursorStyleId;
  name: string;
  description: string;
  badge: string;
}

export const CURSOR_STYLES: CursorStyleMeta[] = [
  {
    id: 'halo',
    name: 'Glow Halo',
    description: 'Smooth magnetic halo that trails the cursor and expands over interactive buttons and links.',
    badge: 'Popular',
  },
  {
    id: 'trail',
    name: 'Stardust Trail',
    description: 'Luminous cursor that releases sparkling micro-dust particles as you glide.',
    badge: 'Special FX',
  },
  {
    id: 'crosshair',
    name: 'Cyber Crosshair',
    description: 'Precision targeting reticle with smooth orientation and lock-on effects.',
    badge: 'High-Tech',
  },
  {
    id: 'minimal',
    name: 'Precision Dot',
    description: 'Ultra-refined micro dot with crisp tactile click shockwaves.',
    badge: 'Subtle',
  },
  {
    id: 'default',
    name: 'System Default',
    description: 'Native operating system pointer with standard behavior.',
    badge: 'Native',
  },
];
