import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from "../services/i18n";

export const Hero: React.FC = () => {
  const { language, t } = useI18n();
  const { scrollY } = useScroll();
  
  // Parallax effects
  // Image moves significantly slower than scroll to act as a background anchor
  const yParallax = useTransform(scrollY, [0, 500], [0, 200]); 
  const opacityParallax = useTransform(scrollY, [0, 400], [1, 0]);
  
  // Text Parallax - Positive Y creates a "slower than scroll" effect (lag)
  // Differing values create separation between layers: Subhead (Front/Fastest) -> Title (Mid) -> Image (Back/Slowest)
  const subheadParallax = useTransform(scrollY, [0, 500], [0, 80]);
  const titleParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const textOpacity = useTransform(scrollY, [0, 220], [1, 0]);

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-end">
      
      {/* Background Ambience - "Deep Void Fluidity" */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
         {/* Layer 1: The Deep Foundation - Slow breathing dark grey */}
         <motion.div 
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.45, 0.7, 0.45],
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-20%] left-[-20%] w-[140vw] h-[140vw] bg-[#080808] rounded-full blur-[140px]" 
         />
         
         {/* Layer 2: Moving Shadow - Top Right */}
         <motion.div 
           animate={{ 
             x: ["10%", "-10%", "10%"],
             y: ["-5%", "5%", "-5%"],
           }}
           transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#0A0A0A] rounded-full blur-[160px] opacity-95" 
         />

         {/* Layer 3: The "Ghost" Accent - Extremely subtle warmth, barely visible */}
         <motion.div 
           animate={{ 
             opacity: [0.06, 0.12, 0.06],
             scale: [1, 1.2, 1],
             x: ["-20%", "20%", "-20%"]
           }}
           transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-accent rounded-full blur-[220px] mix-blend-screen" 
         />
         
         {/* Layer 4: Vertical Flow - Subtle detail */}
         <motion.div
            animate={{
              y: ["0%", "15%", "0%"],
              opacity: [0, 0.1, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[30%] w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-white/10 to-transparent blur-[1px]"
         />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col items-center justify-end pb-8 md:pb-12">
        

        {/* Central Hero Image */}
        <motion.div 
          style={{ y: yParallax, opacity: opacityParallax }}
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        >
          {/* Image Container with Fade Mask */}
          <div className="relative w-full max-w-2xl h-[70vh] md:h-[85vh] mt-0 md:mt-[-5vh]">
             <img 
               src="/images/hero-artur.png"
               alt="Artur Lubin"
               className="w-full h-full object-contain object-top opacity-80 md:opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
             />
          </div>
        </motion.div>

        {/* Text Container */}
        <div className="relative z-20 w-full flex flex-col items-center mt-16 md:mt-24 mb-8 md:mb-10">
          
          {/* Massive Typography - Gradient Overlay */}
          <motion.h1 
            style={{ y: titleParallax, opacity: textOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-[12vw] md:text-[14vw] leading-[0.85] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-accent/60 to-neutral-100 animate-gradient-xy bg-[length:200%_auto] tracking-[-0.01em] text-center whitespace-nowrap mix-blend-overlay md:mix-blend-normal drop-shadow-2xl"
          >
            {t("hero.name")}
          </motion.h1>
          <motion.p
            style={{ y: subheadParallax, opacity: textOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-4 md:mt-5 text-[10px] md:text-xs font-display font-medium text-neutral-200 tracking-[0.35em] uppercase text-center"
          >
            {t("hero.role")}
          </motion.p>
        </div>

        {/* Footer Info Columns - Glassmorphism Bar */}
        <div className="w-full flex justify-center relative z-20">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-7 rounded-3xl md:rounded-full border border-white/10 bg-gradient-to-r from-white/5 via-white/2 to-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
            
            {/* Col 1 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <span className="text-accent font-display text-xs">01</span>
                <h3 className="text-white font-display uppercase tracking-widest text-xs">{t("hero.expertiseTitle")}</h3>
              </div>
              <p className="text-neutral-300 font-sans text-sm md:text-base max-w-[220px] leading-relaxed">
                {t("hero.expertiseDescription")}
              </p>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <span className="text-accent font-display text-xs">02</span>
                <h3 className="text-white font-display uppercase tracking-widest text-xs">{t("hero.specializationTitle")}</h3>
              </div>
              <p className="text-neutral-300 font-sans text-sm md:text-base max-w-[280px] leading-relaxed">
                {t("hero.specializationDescription")}
              </p>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <span className="text-accent font-display text-xs">03</span>
                <h3 className="text-white font-display uppercase tracking-widest text-xs">{t("hero.locationLabel")}</h3>
              </div>
              <p className="text-neutral-300 font-sans text-sm md:text-base leading-relaxed">
                {t("hero.location")}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
