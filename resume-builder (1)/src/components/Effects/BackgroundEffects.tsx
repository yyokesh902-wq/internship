import React, { useEffect, useState, useRef } from 'react';
import { useThemeEffects } from '../../context/ThemeEffectsContext.tsx';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const BackgroundEffects: React.FC = () => {
  const { settings } = useThemeEffects();
  const { theme, ambientOrbs, mouseSpotlight, gridPattern, clickRipples } = settings;

  // Track mouse position for spotlight
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    if (!mouseSpotlight) return;

    let rafId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (currentX === -1000) {
        currentX = targetX;
        currentY = targetY;
        setMousePos({ x: currentX, y: currentY });
      }
    };

    const animate = () => {
      if (targetX !== -1000) {
        // Easing interpolation for silky smooth flashlight movement
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mouseSpotlight]);

  // Click shockwaves handler
  useEffect(() => {
    if (!clickRipples) return;

    const handleClick = (e: MouseEvent) => {
      // Don't spawn ripples inside the printed resume preview if printable
      const rippleColors: Record<string, string> = {
        aurora: 'rgba(129, 140, 248, 0.45)',
        cyber: 'rgba(6, 182, 212, 0.5)',
        sunset: 'rgba(244, 63, 94, 0.45)',
        emerald: 'rgba(16, 185, 129, 0.45)',
        frost: 'rgba(99, 102, 241, 0.35)',
        classic: 'rgba(148, 163, 184, 0.35)',
      };

      const newRipple: Ripple = {
        id: ++rippleIdRef.current,
        x: e.clientX,
        y: e.clientY,
        color: rippleColors[theme] || rippleColors.aurora,
      };

      setRipples((prev) => [...prev.slice(-6), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 750);
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [clickRipples, theme]);

  // Theme-specific styles and gradients
  const getThemeBackgroundStyles = () => {
    switch (theme) {
      case 'cyber':
        return {
          base: 'bg-[#06090e]',
          orb1: 'from-cyan-500/20 via-teal-600/15 to-transparent',
          orb2: 'from-emerald-500/18 via-teal-600/10 to-transparent',
          orb3: 'from-sky-500/15 via-blue-600/10 to-transparent',
          spotlightColor: 'rgba(6, 182, 212, 0.18)',
          gridColor: 'rgba(6, 182, 212, 0.08)',
          gridDotColor: 'rgba(16, 185, 129, 0.18)',
        };
      case 'sunset':
        return {
          base: 'bg-[#0b0314]',
          orb1: 'from-rose-500/22 via-pink-600/15 to-transparent',
          orb2: 'from-purple-600/22 via-indigo-700/15 to-transparent',
          orb3: 'from-amber-500/18 via-rose-500/10 to-transparent',
          spotlightColor: 'rgba(244, 63, 94, 0.18)',
          gridColor: 'rgba(244, 63, 94, 0.07)',
          gridDotColor: 'rgba(234, 179, 8, 0.18)',
        };
      case 'emerald':
        return {
          base: 'bg-[#030e09]',
          orb1: 'from-emerald-500/22 via-teal-700/15 to-transparent',
          orb2: 'from-teal-500/18 via-green-800/15 to-transparent',
          orb3: 'from-mint-400/15 via-emerald-600/10 to-transparent',
          spotlightColor: 'rgba(16, 185, 129, 0.18)',
          gridColor: 'rgba(16, 185, 129, 0.07)',
          gridDotColor: 'rgba(52, 211, 153, 0.2)',
        };
      case 'frost':
        return {
          base: 'bg-[#f8fafc]',
          orb1: 'from-indigo-300/35 via-purple-200/25 to-transparent',
          orb2: 'from-sky-300/35 via-teal-200/20 to-transparent',
          orb3: 'from-rose-200/30 via-orange-200/20 to-transparent',
          spotlightColor: 'rgba(99, 102, 241, 0.12)',
          gridColor: 'rgba(99, 102, 241, 0.06)',
          gridDotColor: 'rgba(99, 102, 241, 0.15)',
        };
      case 'classic':
        return {
          base: 'bg-[#f1f5f9]',
          orb1: 'from-slate-300/30 via-slate-200/20 to-transparent',
          orb2: 'from-gray-300/25 via-slate-200/15 to-transparent',
          orb3: 'from-indigo-200/20 via-slate-100/10 to-transparent',
          spotlightColor: 'rgba(100, 116, 139, 0.08)',
          gridColor: 'rgba(100, 116, 139, 0.05)',
          gridDotColor: 'rgba(100, 116, 139, 0.12)',
        };
      case 'aurora':
      default:
        return {
          base: 'bg-[#080c16]',
          orb1: 'from-indigo-600/25 via-violet-600/18 to-transparent',
          orb2: 'from-purple-600/22 via-fuchsia-600/15 to-transparent',
          orb3: 'from-cyan-500/20 via-blue-600/15 to-transparent',
          spotlightColor: 'rgba(129, 140, 248, 0.18)',
          gridColor: 'rgba(129, 140, 248, 0.07)',
          gridDotColor: 'rgba(56, 189, 248, 0.2)',
        };
    }
  };

  const themeStyles = getThemeBackgroundStyles();

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden transition-colors duration-700 print:hidden ${themeStyles.base}`}
    >
      {/* Animated Floating Ambient Orbs */}
      {ambientOrbs && (
        <div className="absolute inset-0 overflow-hidden opacity-90 transition-opacity duration-500">
          {/* Orb 1: Top Left / Center */}
          <div
            className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-radial ${themeStyles.orb1} blur-3xl animate-float-slow`}
          />
          {/* Orb 2: Top Right */}
          <div
            className={`absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full bg-radial ${themeStyles.orb2} blur-3xl animate-float-delayed`}
          />
          {/* Orb 3: Bottom Left / Center */}
          <div
            className={`absolute -bottom-40 left-1/3 w-[650px] h-[650px] rounded-full bg-radial ${themeStyles.orb3} blur-3xl animate-float-reverse`}
          />
        </div>
      )}

      {/* Interactive Mouse Spotlight Radial Glow */}
      {mouseSpotlight && mousePos.x !== -1000 && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, ${themeStyles.spotlightColor}, transparent 65%)`,
          }}
        />
      )}

      {/* Subtle Matrix / Geometric Grid Overlay */}
      {gridPattern && (
        <div className="absolute inset-0 opacity-100 transition-opacity duration-500">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="theme-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke={themeStyles.gridColor}
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="1.5" fill={themeStyles.gridDotColor} />
              </pattern>
              {/* Radial vignette mask so grid is prominent in center and soft at edges */}
              <radialGradient id="grid-mask-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.85" />
                <stop offset="70%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0.05" />
              </radialGradient>
              <mask id="grid-mask">
                <rect width="100%" height="100%" fill="url(#grid-mask-gradient)" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#theme-grid-pattern)"
              mask="url(#grid-mask)"
            />
          </svg>
        </div>
      )}

      {/* Interactive Click Shockwave Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ripple-expand"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            borderColor: ripple.color,
            boxShadow: `0 0 24px ${ripple.color}`,
          }}
        />
      ))}
    </div>
  );
};
