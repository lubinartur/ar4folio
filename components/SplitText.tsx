import React, { useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number; // kept for compatibility, not used
  rootMargin?: string; // kept for compatibility, not used
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold,
  rootMargin,
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<HTMLSpanElement[]>([]);

  // Сбрасываем ссылки перед каждым новым рендером
  itemsRef.current = [];

  useEffect(() => {
    const targets = itemsRef.current.filter(Boolean);
    if (!targets.length) return;

    gsap.killTweensOf(targets);

    // Более мягкая и растянутая волна, чтобы движение было заметно от первых букв до последних
    const baseStagger = (delay / 1000) * 2.4;

    const tl = gsap.timeline({
      delay: 0.32,
      onComplete: onLetterAnimationComplete,
    });

    targets.forEach((el, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const offsetFromCenter = index - targets.length / 2;

      const fromVars: gsap.TweenVars = {
        ...(from || {}),
        opacity: 0,
        y: 26 * direction,
        x: offsetFromCenter * 4,
        rotateZ: 2 * direction,
      };

      const toVars: gsap.TweenVars = {
        ...(to || {}),
        opacity: 1,
        y: 0,
        x: 0,
        rotateZ: 0,
        duration: duration * 1.45,
        ease,
      };

      tl.fromTo(el, fromVars, toVars, index * baseStagger);
    });
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    JSON.stringify(from),
    JSON.stringify(to),
    onLetterAnimationComplete,
  ]);

  const style: CSSProperties = {
    textAlign,
    wordWrap: 'break-word',
    willChange: 'transform, opacity',
  };

  const classes = `split-parent inline-block whitespace-normal ${className}`;

  const renderSpans = () => {
    if (splitType === 'words') {
      const words = text.split(' ');
      return words.map((word, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) itemsRef.current[index] = el;
          }}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </span>
      ));
    }

    // 'chars' и 'lines' обрабатываем как посимвольную анимацию
    return Array.from(text).map((char, index) => (
      <span
        key={index}
        ref={(el) => {
          if (el) itemsRef.current[index] = el;
        }}
        className="inline-block"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const Tag: any = tag || 'p';

  return (
    <Tag ref={containerRef as any} style={style} className={classes}>
      {renderSpans()}
    </Tag>
  );
};

export default SplitText;