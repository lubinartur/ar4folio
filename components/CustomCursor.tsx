import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<'default' | 'text' | 'pointer'>('default');
  
  // Use motion values for direct updates without re-renders
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const rafId = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Throttle updates via requestAnimationFrame
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          cursorX.set(mousePos.current.x - 16);
          cursorY.set(mousePos.current.y - 16);
          rafId.current = null;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer');

      const isText = !isInteractive && !!target.closest(
        'p, span, li, h1, h2, h3, h4, h5, h6, blockquote, figcaption, label, input, textarea'
      );

      setIsHovering(!!isInteractive);
      setMode(isInteractive ? 'pointer' : isText ? 'text' : 'default');
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner blur */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9997] overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: isHovering ? 1 : 0.65,
          backdropFilter: isHovering ? 'blur(0px)' : 'blur(26px)',
          WebkitBackdropFilter: isHovering ? 'blur(0px)' : 'blur(26px)',
          background: isHovering
            ? 'rgba(255,61,0,0.10)'
            : 'rgba(255,255,255,0.18)'
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.12 }}
      />

      {/* Outline ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] mix-blend-difference border-2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: 1,
          borderColor: isHovering ? '#FF3D00' : 'rgba(255,255,255,0.7)'
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.12 }}
      />
    </>
  );
};