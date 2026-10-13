import React, { useEffect, useState, useRef } from 'react';
import { useThemeEffects } from '../../context/ThemeEffectsContext.tsx';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export const CustomCursor: React.FC = () => {
  const { settings } = useThemeEffects();
  const { cursor: cursorStyle, theme } = settings;

  // Do not render if system default is requested
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position refs for high-fps interpolation
  const posRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const [renderPos, setRenderPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });

  // Dust particles for 'trail' cursor style
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Detect touch device
  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Update body cursor class
  useEffect(() => {
    if (isTouchDevice || cursorStyle === 'default') {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorStyle, isTouchDevice]);

  // Main mouse tracking loop
  useEffect(() => {
    if (isTouchDevice || cursorStyle === 'default') return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        setIsTextInput(isInput);

        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'button' ||
          target.getAttribute('role') === 'tab' ||
          target.classList.contains('cursor-pointer') ||
          target.closest('button, a, [role="button"], input, textarea, select, [data-interactive="true"]') !== null;

        setIsHoveringInteractive(isInteractive);
      }

      // If trail mode, spawn stardust micro-particle
      if (cursorStyle === 'trail') {
        const now = Date.now();
        if (now - lastSpawnRef.current > 40) {
          lastSpawnRef.current = now;
          const colors: Record<string, string> = {
            aurora: '#818cf8',
            cyber: '#06b6d4',
            sunset: '#f43f5e',
            emerald: '#34d399',
            frost: '#6366f1',
            classic: '#94a3b8',
          };
          const baseColor = colors[theme] || '#818cf8';

          const newParticle: Particle = {
            id: ++particleIdRef.current,
            x: e.clientX + (Math.random() * 8 - 4),
            y: e.clientY + (Math.random() * 8 - 4),
            size: Math.random() * 4 + 2,
            opacity: 0.8,
            color: baseColor,
          };

          setParticles((prev) => [...prev.slice(-15), newParticle]);
        }
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation frame for smooth spring lerp
    let currentFollowerX = targetPosRef.current.x;
    let currentFollowerY = targetPosRef.current.y;

    const animate = () => {
      const tx = targetPosRef.current.x;
      const ty = targetPosRef.current.y;

      posRef.current = { x: tx, y: ty };
      setRenderPos({ x: tx, y: ty });

      // Follower trailing physics
      currentFollowerX += (tx - currentFollowerX) * 0.18;
      currentFollowerY += (ty - currentFollowerY) * 0.18;
      setFollowerPos({
        x: Math.round(currentFollowerX),
        y: Math.round(currentFollowerY),
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [cursorStyle, isTouchDevice, theme, isVisible]);

  // Particle decay loop for 'trail'
  useEffect(() => {
    if (cursorStyle !== 'trail' || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            size: p.size * 0.88,
            opacity: p.opacity - 0.08,
          }))
          .filter((p) => p.opacity > 0.05 && p.size > 0.5)
      );
    }, 40);

    return () => clearInterval(interval);
  }, [cursorStyle, particles.length]);

  if (isTouchDevice || cursorStyle === 'default' || !isVisible) {
    return null;
  }

  // Theme accent colors
  const accentColors: Record<string, { ring: string; dot: string; glow: string }> = {
    aurora: { ring: 'border-indigo-400', dot: 'bg-indigo-400', glow: 'rgba(129, 140, 248, 0.45)' },
    cyber: { ring: 'border-cyan-400', dot: 'bg-cyan-400', glow: 'rgba(6, 182, 212, 0.55)' },
    sunset: { ring: 'border-rose-400', dot: 'bg-rose-400', glow: 'rgba(244, 63, 94, 0.55)' },
    emerald: { ring: 'border-emerald-400', dot: 'bg-emerald-400', glow: 'rgba(52, 211, 153, 0.55)' },
    frost: { ring: 'border-indigo-500', dot: 'bg-indigo-600', glow: 'rgba(99, 102, 241, 0.4)' },
    classic: { ring: 'border-slate-500', dot: 'bg-slate-700', glow: 'rgba(100, 116, 139, 0.35)' },
  };

  const colors = accentColors[theme] || accentColors.aurora;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-9999 overflow-hidden print:hidden select-none"
    >
      {/* 1. Stardust Trail Particles */}
      {cursorStyle === 'trail' &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}

      {/* 2. Cyber Crosshair Style */}
      {cursorStyle === 'crosshair' && (
        <>
          {/* Target Reticle Follower */}
          <div
            className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
              isHoveringInteractive ? 'scale-135' : isMouseDown ? 'scale-75' : 'scale-100'
            }`}
            style={{
              left: `${followerPos.x}px`,
              top: `${followerPos.y}px`,
            }}
          >
            <div className="w-8 h-8 relative flex items-center justify-center">
              {/* Corner brackets */}
              <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 ${colors.ring}`} />
              <div className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 ${colors.ring}`} />
              <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 ${colors.ring}`} />
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 ${colors.ring}`} />
            </div>
          </div>
          {/* Center Precision Point */}
          <div
            className={`absolute pointer-events-none w-2 h-2 rounded-full ${colors.dot} transform -translate-x-1/2 -translate-y-1/2 shadow-xs`}
            style={{
              left: `${renderPos.x}px`,
              top: `${renderPos.y}px`,
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
          />
        </>
      )}

      {/* 3. Glow Halo Style (Default Featured) */}
      {cursorStyle === 'halo' && (
        <>
          {/* Magnetic Trailing Outer Ring */}
          <div
            className={`absolute pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out border-2 ${
              colors.ring
            } ${
              isTextInput
                ? 'w-4 h-7 rounded-sm border-dashed opacity-60'
                : isHoveringInteractive
                ? 'w-13 h-13 scale-110 bg-white/10 dark:bg-white/5 border-2 shadow-lg backdrop-blur-2xs'
                : isMouseDown
                ? 'w-6 h-6 scale-90 opacity-90'
                : 'w-9 h-9 opacity-75'
            }`}
            style={{
              left: `${followerPos.x}px`,
              top: `${followerPos.y}px`,
              boxShadow: isHoveringInteractive ? `0 0 20px ${colors.glow}` : `0 0 10px ${colors.glow}`,
            }}
          />
          {/* Instant Leading Center Dot */}
          <div
            className={`absolute pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
              colors.dot
            } ${
              isTextInput
                ? 'w-1 h-5 rounded-xs'
                : isMouseDown
                ? 'w-3 h-3 scale-125'
                : isHoveringInteractive
                ? 'w-2.5 h-2.5'
                : 'w-2 h-2'
            }`}
            style={{
              left: `${renderPos.x}px`,
              top: `${renderPos.y}px`,
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
          />
        </>
      )}

      {/* 4. Minimalist Precision Dot */}
      {cursorStyle === 'minimal' && (
        <div
          className={`absolute pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
            colors.dot
          } ${
            isTextInput
              ? 'w-1 h-5 rounded-xs'
              : isHoveringInteractive
              ? 'w-4 h-4 scale-125 ring-2 ring-white/50'
              : isMouseDown
              ? 'w-3 h-3 scale-90'
              : 'w-2.5 h-2.5'
          }`}
          style={{
            left: `${renderPos.x}px`,
            top: `${renderPos.y}px`,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
        />
      )}

      {/* 5. Stardust Trail Pointer Dot */}
      {cursorStyle === 'trail' && (
        <div
          className={`absolute pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
            colors.dot
          } ${
            isHoveringInteractive ? 'w-3.5 h-3.5 ring-2 ring-white/70' : isMouseDown ? 'w-2.5 h-2.5' : 'w-3 h-3'
          }`}
          style={{
            left: `${renderPos.x}px`,
            top: `${renderPos.y}px`,
            boxShadow: `0 0 12px ${colors.glow}`,
          }}
        />
      )}
    </div>
  );
};
