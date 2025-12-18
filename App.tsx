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

const RETURN_TARGET_KEY = 'portfolio:returnTarget';
const SCROLL_RESTORE_KEY = 'portfolio:scrollRestore';

type ScrollRestorePayload = {
  key: string;
  y: number;
  x: number;
  ts: number;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [scrollToProjectsOnClose, setScrollToProjectsOnClose] = useState(false);
  const [scrollTargetIdOnClose, setScrollTargetIdOnClose] = useState<string>('projects-start');
  const { language, setLanguage } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  const getSlugOrIdFromUrl = () => {
    if (typeof window === 'undefined') return '';
    const path = window.location.pathname || '/';
    const parts = path.split('/').filter(Boolean);
    const idx = parts.indexOf('cases');
    return idx >= 0 ? parts[idx + 1] || '' : '';
  };

  // Normalize incoming project objects to the canonical PROJECTS entry (full data).
  const canonicalize = (p: Project | null) => {
    if (!p) return p;
    const key = (p as any)?.slug || p.id;
    return (
      PROJECTS.find((x) => (x as any)?.slug === key || x.id === key) ||
      PROJECTS.find((x) => x.id === p.id) ||
      p
    );
  };

  // Disable native browser scroll restoration to avoid Safari/Chrome interference on push/replaceState.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const safeSessionGet = (key: string) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSessionSet = (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // ignore
    }
  };

  const safeSessionRemove = (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  };

  const normalizeTarget = (raw: string | null | undefined) => {
    const v = (raw || '').trim();
    if (!v) return '';
    return v.replace(/^#/, '');
  };

  const getReturnTarget = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const from = normalizeTarget(params.get('from'));
    if (from) return from;
    return normalizeTarget(safeSessionGet(RETURN_TARGET_KEY));
  };

  const setReturnTarget = (target: string) => {
    const normalized = normalizeTarget(target);
    if (!normalized) return;
    safeSessionSet(RETURN_TARGET_KEY, normalized);
  };

  const clearReturnTarget = () => {
    safeSessionRemove(RETURN_TARGET_KEY);
  };

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

    const resolveAndScroll = (targetRaw: string) => {
      const target = normalizeTarget(targetRaw) || 'projects';

      // Keep URL deterministic: always land on Home with hash (no history.back)
      if (`${window.location.pathname}${window.location.hash}` !== `/#${target}`) {
        window.history.replaceState(null, '', `/#${target}`);
      }

      const maxFrames = 60; // as requested

      const tryScroll = (frame = 0) => {
        if (frame >= maxFrames) {
          const fallback =
            document.querySelector('#projects-start') || document.querySelector('#projects');
          fallback?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearReturnTarget();
          // After scroll attempt, clean URL (remove hash/search) to avoid sticky anchors.
          // Use BASE_URL for deployments under subpaths (Vite). Fallback to "/".
          const base = (import.meta as any)?.env?.BASE_URL || '/';
          window.requestAnimationFrame(() => {
            window.history.replaceState(null, '', base);
          });
          return;
        }

        const selector = `#${escapeId(target)}`;
        const element =
          // If target is section, land at start of cards list (below header) when available
          (target === 'projects' ? document.querySelector('#projects-start') : null) ||
          document.querySelector(selector) ||
          document.querySelector('#projects-start') ||
          document.querySelector('#projects');

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clean up after success (no sticky return targets)
          clearReturnTarget();
          // After successful scroll, clean URL (remove hash/search) to avoid sticky anchors.
          const base = (import.meta as any)?.env?.BASE_URL || '/';
          window.requestAnimationFrame(() => {
            window.history.replaceState(null, '', base);
          });
          return;
        }

        window.requestAnimationFrame(() => tryScroll(frame + 1));
      };

      window.requestAnimationFrame(() => tryScroll(0));
    };

    // Only resolve when Home is actually mounted (activeProject null) and caller asked for it.
    if (activeProject !== null) return;
    if (!scrollToProjectsOnClose) return;

    setScrollToProjectsOnClose(false);
    resolveAndScroll(scrollTargetIdOnClose || 'projects');
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

    const slugOrId = pathname.replace('/cases/', '').split('/')[0];
    const project =
      PROJECTS.find((p) => (p as any)?.slug === slugOrId || p.id === slugOrId) || null;
    if (!project) return;

    const params = new URLSearchParams(search);
    const from = normalizeTarget(params.get('from'));
    if (from) setReturnTarget(from);
    setScrollTargetIdOnClose(from || 'projects');
    setActiveProject(project);
  }, []);

  // Language switch: preserve scroll position across re-render.
  const handleLanguageChange = (nextLang: typeof language) => {
    if (typeof window !== 'undefined') {
      const payload: ScrollRestorePayload = {
        key: `${window.location.pathname}${window.location.search}${window.location.hash}`,
        y: window.scrollY,
        x: window.scrollX,
        ts: Date.now(),
      };
      safeSessionSet(SCROLL_RESTORE_KEY, JSON.stringify(payload));
    }
    setLanguage(nextLang);
  };

  // Restore scroll after language change (best-effort).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = safeSessionGet(SCROLL_RESTORE_KEY);
    if (!raw) return;

    let payload: ScrollRestorePayload | null = null;
    try {
      payload = JSON.parse(raw) as ScrollRestorePayload;
    } catch {
      safeSessionRemove(SCROLL_RESTORE_KEY);
      return;
    }

    const nowKey = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    // Only restore on the same "route key"; ignore stale entries (e.g. after navigation).
    if (!payload || payload.key !== nowKey) {
      // Even if route changed, don't keep stale restore payload around.
      safeSessionRemove(SCROLL_RESTORE_KEY);
      return;
    }
    if (Date.now() - payload.ts > 3000) {
      safeSessionRemove(SCROLL_RESTORE_KEY);
      return;
    }

    const restore = (frame = 0) => {
      window.scrollTo({ top: payload!.y, left: payload!.x, behavior: 'auto' });
      if (Math.abs(window.scrollY - payload!.y) <= 2 || frame >= 10) {
        safeSessionRemove(SCROLL_RESTORE_KEY);
        return;
      }
      window.requestAnimationFrame(() => restore(frame + 1));
    };

    window.requestAnimationFrame(() => restore(0));
  }, [language]);

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
                onLanguageChange={handleLanguageChange}
            />
            
            <FullMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={handleNavigate}
            />

            <AnimatePresence mode='wait'>
                {activeProject ? (
                <ProjectDetail 
                    // IMPORTANT: force remount on case -> related -> case navigation
                    key={`project-detail-${((activeProject as any)?.slug || activeProject.id || getSlugOrIdFromUrl()) ?? 'unknown'}`}
                    project={activeProject} 
                    onBack={() => {
                      // Deterministic return (no history.back):
                      // If returnTarget/from exists -> /#<id> else /#projects, then guaranteed scroll after Home mounts.
                      const from = getReturnTarget();
                      const target = from || 'projects';
                      // Normalize URL immediately: after Back, URL must never contain /cases/* or ?from=.
                      window.history.replaceState(null, '', `/#${target}`);
                      setScrollTargetIdOnClose(target);
                      setScrollToProjectsOnClose(true);
                      setActiveProject(null);
                    }}
                    onProjectClick={(p) => {
                      // Opening a case from inside a case: always keep the already-known return target.
                      const from =
                        normalizeTarget(scrollTargetIdOnClose) ||
                        getReturnTarget() ||
                        'projects';

                      const canonical = canonicalize(p);
                      const slugOrId = (canonical as any)?.slug || canonical?.id || (p as any)?.slug || p.id;
                      setReturnTarget(from);
                      window.history.pushState(null, '', `/cases/${slugOrId}?from=${encodeURIComponent(from)}`);
                      setScrollTargetIdOnClose(from);
                      setActiveProject(canonical);
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
                      const canonical = canonicalize(project);
                      const slugOrId = (canonical as any)?.slug || canonical?.id || (project as any)?.slug || project.id;
                      setReturnTarget(from);
                      window.history.pushState(null, '', `/cases/${slugOrId}?from=${encodeURIComponent(from)}`);
                      setScrollTargetIdOnClose(from);
                      setActiveProject(canonical);
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