import React, { useRef, useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useI18n } from '../services/i18n';
import { ContactRequestModal } from './ContactRequestModal';

export const Contact: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [15, -10]);
  
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothTitleOpacity = useSpring(titleOpacity, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });
  const smoothButtonY = useSpring(buttonY, { stiffness: 100, damping: 30 });

  return (
    <footer 
      ref={sectionRef}
      id="contact" 
      className="relative bg-black pt-20 md:pt-40 pb-12 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto mb-16 md:mb-32 flex flex-col items-center text-center">
          <motion.div
            style={{ y: smoothTitleY, opacity: smoothTitleOpacity }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h2
              className="mx-auto max-w-[34ch] sm:max-w-[36ch] text-center text-6xl sm:text-7xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-10 md:mb-12 leading-[0.9] text-pretty"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const title = t("contact.heroTitle");
                // Разбиваем текст на строки и выделяем последнее слово оранжевым
                const lines = title.split('\n');
                if (lines.length === 0) return title;
                
                return (
                  <span className="inline-flex flex-col items-center">
                    {lines.map((line, lineIndex) => {
                      const isLastLine = lineIndex === lines.length - 1;
                      const trimmedLine = line.trim();
                      const words = trimmedLine.split(/\s+/);
                      const lastWord = words[words.length - 1];
                      const beforeLastWord = words.slice(0, -1).join(' ');
                      
                      return (
                        <span key={lineIndex} className="block text-center">
                          <span className="inline-block whitespace-normal">
                            {isLastLine ? (
                              <>
                                {beforeLastWord && <span className="text-white">{beforeLastWord} </span>}
                                <span className="text-accent">{lastWord}</span>
                              </>
                            ) : (
                              <span className="text-white">{trimmedLine}</span>
                            )}
                          </span>
                        </span>  
                      );
                    })}
                  </span>
                );
              })()}
            </motion.h2>
          </motion.div>
          
          <motion.p
            style={{ y: smoothSubtitleY }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-lg sm:text-xl text-neutral-300 mb-10 md:mb-12 max-w-xl mx-auto font-light font-sans"
          >
            {t("contact.subtitle")}
          </motion.p>
          
          {/* CTA Button to Open Modal */}
          <motion.div
            style={{ y: smoothButtonY }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1], 
              delay: 0.2
            }}
            className="w-full max-w-2xl mx-auto"
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-4 bg-accent text-black px-8 sm:px-10 py-6 sm:py-6 rounded-full text-lg sm:text-lg font-bold font-display uppercase tracking-wider relative overflow-hidden group"
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <span className="relative z-10 whitespace-nowrap">
                {t("contact.formSubmit") || "Get in Touch"}
              </span>
              <ArrowRight className="w-6 h-6 sm:w-5 sm:h-5 relative z-10" />
            </motion.button>
          </motion.div>

          {/* Alternative: Direct email link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-neutral-500 text-sm mb-3">or</p>
            <motion.a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-accent transition-colors text-sm"
              whileHover={{ x: 4 }}
            >
              <Mail className="w-4 h-4" />
              {SOCIAL_LINKS.email}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="border-t border-white/10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-neutral-500 text-xs font-mono uppercase tracking-widest text-center md:text-left"
          >
            <span className="text-white">{t("contact.footerInfo")}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex gap-8 items-center"
          >
            <motion.a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4 relative"
              whileHover={{ 
                x: 4,
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {t("contact.linkedin")}
            </motion.a>
            <motion.a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4 relative"
              whileHover={{ 
                x: 4,
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {t("contact.email")}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Request Modal */}
      <ContactRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </footer>
  );
};
