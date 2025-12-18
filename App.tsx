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
import { PROJECTS } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [scrollToProjectsOnClose, setScrollToProjectsOnClose] = useState(false);
  const [scrollTargetIdOnClose, setScrollTargetIdOnClose] = useState<string>('projects-start');
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

  useEffect(() => {
    const escapeId = (id: string) => {
      // CSS.escape not supported in some older browsers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cssAny = (window as any).CSS;
      if (cssAny && typeof cssAny.escape === 'function') return cssAny.escape(id);
      return id.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
    };

    if (activeProject !== null) return;
    if (!scrollToProjectsOnClose) return;

    setScrollToProjectsOnClose(false);

    const target = scrollTargetIdOnClose || 'projects';

    // Keep URL deterministic: always land on Home with hash
    if (`${window.location.pathname}${window.location.hash}` !== `/#${target}`) {
      window.history.replaceState(null, '', `/#${target}`);
    }

    const tryScroll = (attempt = 0) => {
      const selector = `#${escapeId(target)}`;
      const element =
        // If target is the section, land at start of cards list (below header) when available
        (target === 'projects' ? document.querySelector('#projects-start') : null) ||
        document.querySelector(selector) ||
        document.querySelector('#projects-start') ||
        document.querySelector('#projects');

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (attempt < 40) {
        window.requestAnimationFrame(() => tryScroll(attempt + 1));
      }
    };

    window.requestAnimationFrame(() => tryScroll(0));
  }, [activeProject, scrollToProjectsOnClose, scrollTargetIdOnClose]);

  // Support direct open / refresh on case URL:
  // /cases/:id?from=project-xxx
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { pathname, search, hash } = window.location;
    const isCase = pathname.startsWith('/cases/');

    // If we are on main page with hash, ensure scroll on first paint
    if (!isCase && hash) {
      const id = hash.replace('#', '');
      setScrollTargetIdOnClose(id || 'projects');
      setScrollToProjectsOnClose(true);
      return;
    }

    if (!isCase) return;

    const projectId = pathname.replace('/cases/', '').split('/')[0];
    const project = PROJECTS.find((p) => p.id === projectId) || null;
    if (!project) return;

    const params = new URLSearchParams(search);
    const from = params.get('from') || '';
    setScrollTargetIdOnClose(from || 'projects');
    setActiveProject(project);
  }, []);

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
                      // Deterministic return (no history.back):
                      // If from exists -> /#from else /#projects, then guaranteed scroll after Home mounts.
                      const params = new URLSearchParams(window.location.search);
                      const from = params.get('from') || '';
                      const target = from || 'projects';
                      window.history.pushState(null, '', `/#${target}`);
                      setScrollTargetIdOnClose(target);
                      setScrollToProjectsOnClose(true);
                      setActiveProject(null);
                    }}
                    onProjectClick={(p) => {
                      // Opening a case from inside a case: fallback to projects as return target
                      window.history.pushState(null, '', `/cases/${p.id}`);
                      setScrollTargetIdOnClose('projects-start');
                      setActiveProject(p);
                    }}
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
                    <Projects onProjectClick={(project) => {
                      const from = `project-${project.id}`;
                      // Navigate to case with `from`
                      window.history.pushState(null, '', `/cases/${project.id}?from=${encodeURIComponent(from)}`);
                      setScrollTargetIdOnClose(from);
                      setActiveProject(project);
                    }} />
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