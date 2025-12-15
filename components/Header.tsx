import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, X, Globe } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { Language } from '../services/i18n';

// Public CV PDF (served from /public/cv/...)
const CV_URL = "/cv/artur-lubin-cv-classic.pdf";

// Header Component
export const Header: React.FC<{
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}> = ({ isMenuOpen, onMenuToggle, language, onLanguageChange }) => {
  const { t } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const langLabels: Record<Language, string> = {
    en: t("languages.en"),
    et: t("languages.et"),
    ru: t("languages.ru"),
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: isMobile ? 0 : 0.75, duration: isMobile ? 0.4 : 0.75, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-8 flex justify-between items-center"
    >
       {/* Left: Status Badge Only (not clickable) */}
       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 h-[42px] px-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
           <span className="text-neutral-300 text-xs font-mono uppercase tracking-wider">
             <span className="hidden sm:inline">{t("header.availableLong")}</span>
             <span className="sm:hidden">{t("header.availableShort")}</span>
           </span>
         </div>
       </div>

       {/* Right: Actions */}
       <div className="flex items-center gap-6">
          
          {/* CV Button - open PDF in new tab */}
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 h-[42px] px-5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-colors cursor-none"
          >
            {t("header.cv")}
          </a>

          {/* Language Switcher - Icon Based (now also visible on mobile) */}
          <div className="relative flex items-center cursor-none">
            <button
              className="flex items-center gap-2 h-[42px] px-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-colors cursor-none"
              onClick={() => setIsLangOpen((prev) => !prev)}
            >
              <Globe className="w-4 h-4" />
              <span className="md:hidden">{language.toUpperCase()}</span>
              <span className="hidden md:inline">{langLabels[language]}</span>
            </button>

            {/* Dropdown / Expand */}
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 top-full mt-2 w-[170px] bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-2"
                >
                  {( ['en', 'et', 'ru'] as Language[] ).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onLanguageChange(l);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-full text-xs font-mono uppercase tracking-widest cursor-none transition-colors ${
                        language === l
                          ? 'bg-white/10 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Button - Fixed Width to prevent jumping */}
          <button
            onClick={onMenuToggle}
            className="group relative h-[42px] w-[48px] sm:w-[130px] flex items-center justify-center sm:justify-between sm:pl-5 pr-1 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full transition-all cursor-none"
          >
            {/* Text Label - Absolute positioned for smooth transition */}
            <div className="hidden sm:block relative h-4 w-16 overflow-hidden">
                <motion.span 
                    initial={false}
                    animate={{ y: isMenuOpen ? -20 : 0, opacity: isMenuOpen ? 0 : 1 }}
                    className="absolute inset-0 text-xs font-mono font-medium text-white uppercase tracking-widest flex items-center"
                >
                    {t("header.menu")}
                </motion.span>
                <motion.span 
                    initial={false}
                    animate={{ y: isMenuOpen ? 0 : 20, opacity: isMenuOpen ? 1 : 0 }}
                    className="absolute inset-0 text-xs font-mono font-medium text-white uppercase tracking-widest flex items-center"
                >
                    {t("header.close")}
                </motion.span>
            </div>

            {/* Icon */}
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-white/10 shrink-0">
                 <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                 >
                    {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <LayoutGrid className="w-4 h-4 text-white" />}
                 </motion.div>
            </div>
          </button>
       </div>
    </motion.header>
  );
};
