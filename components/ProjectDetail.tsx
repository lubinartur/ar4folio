import React, { useEffect } from 'react';
import { Project } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  
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
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-neutral-400 hover:text-white mb-12 transition-colors"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
             <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-mono uppercase tracking-widest">Back to Projects</span>
        </button>

        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-8">
             <div>
                <h4 className="text-accent font-mono text-sm mb-4">{project.tags.join(' / ')}</h4>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2">{project.title}</h1>
                <p className="text-2xl text-neutral-400">{project.role}</p>
             </div>
             <div className="text-right">
                <span className="text-4xl font-display font-bold text-white/10">{project.year}</span>
             </div>
          </div>
          {project.description && (
            <p className="text-neutral-400 text-base md:text-lg max-w-3xl">
              {project.description}
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
           <div className="md:col-span-4">
              <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Overview</h3>
              <div className="space-y-4 text-sm text-neutral-400">
                <div>
                  <div className="text-neutral-500 uppercase tracking-[0.25em] text-[10px] mb-1">
                    Role
                  </div>
                  <div className="text-neutral-100">
                    {project.role}
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
           </div>
           <div className="md:col-span-8 space-y-16">
              
              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Challenge</h3>
                 <p className="text-neutral-400 text-lg leading-relaxed">{project.fullDescription.challenge}</p>
              </div>

              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Solution</h3>
                 <p className="text-neutral-400 text-lg leading-relaxed">{project.fullDescription.solution}</p>
              </div>

              <div>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Result</h3>
                 <p className="text-neutral-400 text-lg leading-relaxed">{project.fullDescription.result}</p>
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
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-3xl">
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