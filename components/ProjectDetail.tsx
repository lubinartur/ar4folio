import React, { useEffect } from 'react';
import { Project } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../services/i18n';

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const { t } = useI18n();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#050505] pt-24 pb-20"
    >
      <div className="container mx-auto px-6">
        {/* Back Button (fixed, always visible) */}
        <div className="fixed left-6 bottom-8 z-40">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-neutral-400 hover:text-white hover:border-accent/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-full border border-white/20 bg-white text-black flex items-center justify-center transition-all 
            group-hover:bg-accent group-hover:text-black group-hover:border-accent">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.25em]">
              Back to Projects
            </span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-8">
             <div>
                <h4 className="text-accent font-mono text-sm mb-4">{project.tags.join(' / ')}</h4>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2">{t(project.title)}</h1>
                <p className="text-2xl text-neutral-400">{t(project.role)}</p>
             </div>
             <div className="text-right">
                <span className="text-4xl font-display font-bold text-white/10">{project.year}</span>
             </div>
          </div>
          {project.description && (
            <p className="text-neutral-400 text-base md:text-lg max-w-3xl">
              {t(project.description)}
            </p>
          )}
        </div>

        {/* Main Image */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full aspect-video bg-[#111] rounded-sm overflow-hidden mb-20"
        >
           <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-12 gap-12 mb-24">
           <div className="md:col-span-8 space-y-16">
              
              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Challenge</h3>
                 <div className="text-neutral-400 text-lg leading-relaxed space-y-3">
                   <p>Users want clarity, predictability, and control — but most financial apps overload screens with complexity. Placet’s mobile experience suffered from:</p>
                   <ul className="space-y-1">
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Scattered and inconsistent user flows</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Unclear financial states across loans, credit lines, and cards</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Non‑uniform interface logic</span>
                     </li>
                   </ul>
                 </div>
              </div>

              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Solution</h3>
                 <div className="text-neutral-400 text-lg leading-relaxed space-y-4">
                   <p>I redesigned the Placet App end‑to‑end with focus on calm structure, transparency, and instant comprehension.</p>
                   <ul className="space-y-1">
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Rebuilt authentication with Smart‑ID, Mobile‑ID, FaceID</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Glance‑first dashboard for clear balance, next payment, actions</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Multi‑state financial architecture: processing, active, overdue</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Dense, readable transaction feed with color‑coding</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Redesigned full card journey: ordered → shipped → active</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Unified light & dark premium fintech themes</span>
                     </li>
                   </ul>
                 </div>
              </div>

              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Result</h3>
                 <div className="text-neutral-400 text-lg leading-relaxed space-y-6">
                   <p>The redesign strengthened user confidence and reduced ambiguity.</p>
                   <ul className="space-y-1">
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Fewer support questions from clearer financial states</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Faster understanding of upcoming payments</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Smoother onboarding and everyday flows</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0" />
                       <span>Consistent experience across dark & light modes</span>
                     </li>
                   </ul>
                 </div>
              </div>

           </div>
           <div className="md:col-span-4">
              <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Overview</h3>
              <div className="space-y-4 text-sm text-neutral-400">
                <div>
                  <div className="text-neutral-500 uppercase tracking-[0.25em] text-[10px] mb-1">
                    Role
                  </div>
                  <div className="text-neutral-100">
                    {t(project.role)}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 uppercase tracking-[0.25em] text-[10px] mb-1">
                    Year
                  </div>
                  <div className="text-neutral-100">
                    {project.year}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 uppercase tracking-[0.25em] text-[10px] mb-1">
                    Focus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 space-y-4">
                <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-[0.28em]">
                  Impact
                </h3>
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
                    <div className="text-2xl font-display font-bold text-accent mb-1">
                      +XX%
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                      On-time repayments
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
                    <div className="text-2xl font-display font-bold text-accent mb-1">
                      -YY%
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                      Support questions
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
                    <div className="text-2xl font-display font-bold text-accent mb-1">
                      3x
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                      Faster to insight
                    </p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Screens / Gallery */}
        {project.screens && project.screens.length > 0 ? (
          <div className="space-y-16 mb-24">
            {project.screens.map((screen, index) => (
              <section key={screen.title + index} className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                    Process {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-white">
                    {screen.title}
                  </h3>
                  {screen.description && (
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                      {screen.description}
                    </p>
                  )}
                </div>
                <div className="w-full bg-[#111] rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={screen.image}
                    alt={screen.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </section>
            ))}
          </div>
        ) : (
          project.gallery && (
            <div className="grid md:grid-cols-2 gap-8 mb-24">
              {project.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] bg-[#111] rounded-sm overflow-hidden">
                  <img
                    src={img}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              ))}
            </div>
          )
        )}

        {/* Next Project CTA */}
        <div className="border-t border-white/10 pt-20 text-center">
            <h3 className="text-neutral-500 mb-6 font-mono uppercase tracking-widest">Interested in this workflow?</h3>
            <a href="mailto:contact@arturlubin.com" className="inline-flex items-center gap-2 text-3xl md:text-5xl font-display font-bold text-white hover:text-accent transition-colors">
              Let's Discuss Your Project <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12" />
            </a>
        </div>

      </div>
    </motion.div>
  );
};