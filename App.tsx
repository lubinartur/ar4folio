import React, { useState, useEffect } from 'react';
import { useI18n } from './services/i18n';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AIChat } from './components/AIChat';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { LayoutGrid, X, Home, Briefcase, Layers, User, Mail, Cpu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIAL_LINKS } from './constants';
import { Project } from './types';
import { Language } from './services/i18n';

// Header Component
const Header: React.FC<{
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onHome: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}> = ({ isMenuOpen, onMenuToggle, onHome, language, onLanguageChange }) => {
  const { t } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langLabels: Record<Language, string> = {
    en: t("languages.en"),
    et: t("languages.et"),
    ru: t("languages.ru"),
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.75, duration: 0.75, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-8 flex justify-between items-center"
    >
       {/* Left: Status Badge Only (Name removed) */}
       <div className="flex items-center gap-4 cursor-pointer" onClick={onHome}>
         <button className="flex items-center gap-2 h-[42px] px-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-colors cursor-none">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
           <span className="text-neutral-300 text-xs font-mono uppercase tracking-wider">
             <span className="hidden sm:inline">{t("header.availableLong")}</span>
             <span className="sm:hidden">{t("header.availableShort")}</span>
           </span>
         </button>
       </div>

       {/* Right: Actions */}
       <div className="flex items-center gap-6">
          
          {/* CV Button - scroll to CV/About section */}
          <button
            className="hidden md:flex items-center gap-2 h-[42px] px-5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-colors cursor-none"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('cv');
              if (el) {
                const rect = el.getBoundingClientRect();
                const headerOffset = 120;
                const targetY = window.scrollY + rect.top - headerOffset;
                window.scrollTo({
                  top: targetY,
                  behavior: 'smooth',
                });
              }
            }}
          >
            {t("header.cv")}
          </button>

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

// Full Screen Menu Overlay
const FullMenu: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (id: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useI18n();
  const menuItems = [
    { key: 'home', href: '#home', icon: Home },
    { key: 'experience', href: '#about', icon: Briefcase },
    { key: 'services', href: '#services', icon: Cpu },
    { key: 'portfolio', href: '#projects', icon: Layers },
    { key: 'skills', href: '#about', icon: User },
    { key: 'contact', href: '#contact', icon: Mail },
  ];

  return (
    <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[40] bg-[#050505] flex flex-col cursor-none"
          >
            <div className="container mx-auto px-6 flex-1 flex flex-col justify-between md:justify-center pt-20 pb-6 md:pt-24 md:pb-10 relative z-10">
              {/* Mobile menu: compact vertical list, fits into one screen */}
              <div className="md:hidden w-full max-w-lg mx-auto">
                <div className="space-y-3">
                  {menuItems.map((item, idx) => (
                    <motion.button
                      key={item.key}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.href);
                        onClose();
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="w-full flex items-center justify-between px-4 py-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 cursor-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-black border border-white/10 text-neutral-400">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="block text-base font-medium text-white">
                            {t(`menu.${item.key}.name`)}
                          </span>
                          <span className="block text-[13px] font-mono uppercase tracking-[0.16em] text-neutral-500">
                            {t(`menu.${item.key}.desc`)}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Desktop / tablet menu: card grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto w-full">
                {menuItems.map((item, idx) => (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.href);
                      onClose();
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-start gap-6 p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300 relative overflow-hidden cursor-none"
                  >
                    <div className="p-4 bg-black rounded-xl border border-white/10 group-hover:border-accent/50 text-neutral-400 group-hover:text-accent transition-colors duration-300 relative z-10">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {t(`menu.${item.key}.name`)}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider group-hover:text-neutral-300">
                        {t(`menu.${item.key}.desc`)}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Mobile Footer in Menu */}
             <div className="p-8 border-t border-white/10 md:hidden">
                <div className="flex justify-center">
                   <a
                     href={SOCIAL_LINKS.cv}
                     className="text-white text-sm font-bold cursor-none"
                   >
                     {t("menu.downloadCv")}
                   </a>
                </div>
             </div>

          </motion.div>
        )}
    </AnimatePresence>
  )
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { language, setLanguage } = useI18n();

  useEffect(() => {
    // Disable scrolling while loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else if (isMenuOpen || activeProject) {
       // Also disable scrolling on menu or modal
       document.body.style.overflow = activeProject ? 'auto' : 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLoading, isMenuOpen, activeProject]);

  useEffect(() => {
    if (activeProject) {
      // When opening a project detail view, jump to the top to avoid mid-page scroll flicker
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [activeProject]);

  const handleNavigate = (id: string) => {
    setActiveProject(null); // Close project view if open
    // Simple hash navigation
    const element = document.querySelector(id);
    if (element) {
      setTimeout(() => {
         element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="bg-background text-white min-h-screen selection:bg-accent selection:text-white overflow-x-hidden font-sans">
      <CustomCursor />
      
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
            <Header 
                isMenuOpen={isMenuOpen} 
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
                onHome={() => setActiveProject(null)}
                language={language}
                onLanguageChange={setLanguage}
            />
            
            <FullMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={handleNavigate}
            />

            <AnimatePresence mode='wait'>
                {activeProject ? (
                <ProjectDetail 
                    key="project-detail"
                    project={activeProject} 
                    onBack={() => setActiveProject(null)} 
                />
                ) : (
                <motion.main 
                    key="main-content"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div id="home"><Hero /></div>
                    <Projects onProjectClick={setActiveProject} />
                    <About />
                    <Contact />
                </motion.main>
                )}
            </AnimatePresence>

            <AIChat />
        </>
      )}
    </div>
  );
};

export default App;