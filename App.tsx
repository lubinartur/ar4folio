import React, { useState, useEffect } from 'react';
import { useI18n } from './services/i18n';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutIntro } from './components/AboutIntro';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { AIChat } from './components/AIChat';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { FullMenu } from './components/FullMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { language, setLanguage } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile immediately
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

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
                    onBack={() => {
                      setActiveProject(null);
                      // Scroll to Projects section after closing
                      setTimeout(() => {
                        const projectsSection = document.querySelector('#projects');
                        if (projectsSection) {
                          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 300); // Wait for exit animation
                    }}
                    onProjectClick={setActiveProject}
                />
                ) : (
                <motion.main 
                    key="main-content"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: isMobile ? 0.3 : 0.8 }}
                >
                    <div id="home">
                      <Hero />
                    </div>
                    <AboutIntro />
                    <Projects onProjectClick={setActiveProject} />
                    <Skills />
                    <Experience />
                    <Services />
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