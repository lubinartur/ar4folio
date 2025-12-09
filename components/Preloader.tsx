import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds total
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration + 800); // Wait a bit after 100%

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col justify-between p-6 md:p-12 text-white overflow-hidden"
    >
      {/* Top Text */}
      <div className="flex justify-between items-start">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
             <span className="font-display font-bold text-lg md:text-xl tracking-tight">Artur Lubin</span>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-right"
        >
             <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block">Portfolio</span>
             <span className="font-mono text-xs text-white uppercase tracking-widest block">©2025</span>
        </motion.div>
      </div>

      {/* Center Word Cycle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
         <div className="h-12 md:h-16 overflow-hidden relative">
            <motion.div 
               animate={{ y: ["0%", "-33%", "-66%"] }}
               transition={{ duration: 1.8, times: [0, 0.6, 1], ease: "easeInOut" }}
               className="flex flex-col items-center"
            >
                <span className="text-4xl md:text-6xl font-display font-bold text-neutral-800 h-12 md:h-16 flex items-center justify-center">Design</span>
                <span className="text-4xl md:text-6xl font-display font-bold text-neutral-800 h-12 md:h-16 flex items-center justify-center">Logic</span>
                <span className="text-4xl md:text-6xl font-display font-bold text-white h-12 md:h-16 flex items-center justify-center">Experience</span>
            </motion.div>
         </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Loading Assets</span>
            <span className="font-display text-6xl md:text-8xl font-bold leading-none tracking-tighter text-white">
                {Math.round(count)}%
            </span>
        </div>
        
        {/* Progress Line */}
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
                style={{ width: `${count}%` }}
                className="absolute top-0 left-0 h-full bg-accent"
            />
        </div>
      </div>
    </motion.div>
  );
};