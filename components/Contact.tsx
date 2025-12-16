import React, { useRef, useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useI18n } from '../services/i18n';
import { ContactRequestModal } from './ContactRequestModal';

export const Contact: React.FC = () => {
  const { t, language } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothTitleOpacity = useSpring(titleOpacity, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });

  return (
    <>
      <footer 
        ref={sectionRef}
        id="contact" 
        className="relative bg-black pt-40 pb-12 overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-32">
            {/* Header */}
            <motion.div
              style={{ y: smoothTitleY, opacity: smoothTitleOpacity }}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-12"
            >
              <motion.h2
                className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-12 leading-[0.9]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const title = t("contact.heroTitle");
                  const lang = language;
                  
                  // Паттерны для разных языков
                  let match: RegExpMatchArray | null = null;
                  
                  if (lang === "en") {
                    // "Let's work on something meaningful."
                    match = title.match(/^(.+?)(something)(.+?)(meaningful\.?)$/i);
                  } else if (lang === "ru") {
                    // "Давайте сделаем продукт, который работает."
                    match = title.match(/^(.+?)(продукт,?)(.+?)(работает\.?)$/i);
                  } else if (lang === "et") {
                    // "Teeme midagi tõeliselt mõtestatut."
                    match = title.match(/^(.+?)(midagi)(.+?)(mõtestatut\.?)$/i);
                  }
                  
                  if (match) {
                    const [, beforeWord, middleWord, between, lastWord] = match;
                    
                    // Для русского языка разбиваем на 3 строки
                    if (lang === "ru") {
                      return (
                        <span className="block">
                          {/* Первая строка: "Давайте сделаем" - белый */}
                          <span className="text-white block">{beforeWord.trim()}</span>
                          {/* Вторая строка: "продукт," - серый градиент */}
                          <span className="bg-gradient-to-r from-[#C0C0C0] via-[#A0A0A0] to-[#606060] text-transparent bg-clip-text block">
                            {middleWord}
                          </span>
                          {/* Третья строка: "который работает." - белый + оранжевый */}
                          <span className="text-white block">
                            {between.trim()}{' '}
                            <span className="text-accent">{lastWord}</span>
                          </span>
                        </span>
                      );
                    }
                    
                    // Для других языков - стандартная раскраска
                    return (
                      <span className="block">
                        {/* Первая часть - белый */}
                        <span className="text-white">{beforeWord}</span>
                        {/* Среднее слово - градиент от светло-серого к темно-серому */}
                        <span className="bg-gradient-to-r from-[#C0C0C0] via-[#A0A0A0] to-[#606060] text-transparent bg-clip-text">
                          {middleWord}
                        </span>
                        {/* Между словами - белый */}
                        <span className="text-white">{between}</span>
                        {/* Последнее слово - оранжевый цвет */}
                        <span className="text-accent">{lastWord}</span>
                      </span>
                    );
                  }
                  
                  // Fallback - если паттерн не совпал, используем белый текст
                  return (
                    <span className="text-white">
                      {title}
                    </span>
                  );
                })()}
              </motion.h2>
              
              <motion.p
                style={{ y: smoothSubtitleY }}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-lg md:text-xl text-neutral-400 font-light font-sans mb-8"
              >
                {t("contact.subtitle")}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-accent text-black px-12 py-6 rounded-full text-lg font-bold font-display uppercase tracking-wider relative overflow-hidden group"
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                <span className="relative z-10">
                  {t("contact.requestQuote") || "Request a quote"}
                </span>
                <motion.div
                  className="relative z-10"
                  whileHover={{ rotate: 45, x: 4, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* Helper text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-4 text-sm text-neutral-500 font-sans"
              >
                {t("contact.responseTime") || "I usually reply within 24 hours"}
              </motion.p>
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
      </footer>

      {/* Modal */}
      <ContactRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
