import React, { useRef } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Project } from '../types';
import { useI18n } from '../services/i18n';

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

interface ProjectsProps {
  onProjectClick: (project: Project) => void;
}

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
    const { t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Create local scroll progress for this specific card
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the image: moves slightly opposite to scroll
    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }} // Smooth ease-out-quart with subtle stagger
            viewport={{ once: true, margin: "-10%" }}
            onClick={onClick}
            className="group relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center cursor-pointer mb-10 md:mb-14 lg:mb-32 last:mb-0"
        >
            {/* Image Side */}
            <motion.div
                style={{ perspective: 1000 }}
                className={`relative lg:col-span-7 aspect-[16/10] overflow-hidden rounded-sm bg-[#111] border border-white/5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                whileHover={{ rotateX: 3, rotateY: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
                <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                
                {/* Parallax Image - Applied directly to motion.img */}
                <motion.img 
                    style={{ y: imageY }}
                    src={project.image} 
                    alt={t(project.title)} 
                    className="w-full h-[120%] -mt-[10%] object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 filter grayscale group-hover:grayscale-0" 
                />
                
                {/* Overlay Text */}
                <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-mono text-white/70">{project.tags[0]}</span>
                </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
                style={{ y: textY }}
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className={`lg:col-span-5 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1 lg:text-right items-end' : 'items-start'}`}
            >
                <motion.div
                    variants={itemVariants}
                    className="mb-6 flex flex-wrap gap-2"
                >
                    {project.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-[11px] uppercase tracking-wider border border-white/10 text-neutral-400 font-medium group-hover:border-accent/30 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
                
                <motion.h3
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-display font-bold mb-3 text-white group-hover:text-accent transition-colors duration-300"
                >
                    {t(project.title)}
                </motion.h3>
                
                <motion.h4
                    variants={itemVariants}
                    className="text-lg text-white/60 mb-6 font-sans"
                >
                    {t(project.role)}
                </motion.h4>
                
                <motion.p
                    variants={itemVariants}
                    className="text-neutral-400 leading-relaxed text-base md:text-lg mb-8 max-w-md"
                >
                    {t(project.description)}
                </motion.p>
                
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors group/btn"
                >
                    {t("projects.viewCaseStudy")}
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export const Projects: React.FC<ProjectsProps> = ({ onProjectClick }) => {
  const { t } = useI18n();
  return (
    <section id="projects" className="py-16 md:py-32 bg-[#050505] relative z-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-12 border-b border-white/5"
        >
          <div className="space-y-2">
             <h2 className="text-sm font-sans text-accent tracking-[0.2em] uppercase mb-4">{t("projects.sectionKicker")}</h2>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">{t("projects.sectionTitle")}</h2>
          </div>
        </motion.div>

        <div className="flex flex-col">
          {PROJECTS.map((project, index) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                onClick={() => onProjectClick(project)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};