import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Layers, User, Mail, Cpu } from 'lucide-react';
import { useI18n } from '../services/i18n';

// Public CV PDF (served from /public/cv/...)
const CV_URL = "/cv/artur-lubin-cv-classic.pdf";

// Full Screen Menu Overlay
export const FullMenu: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (id: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
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
                     href={CV_URL}
                     target="_blank"
                     rel="noopener noreferrer"
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
};
