import React, { useRef } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
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
    
    // Smooth spring animations
    const smoothImageY = useSpring(imageY, { stiffness: 100, damping: 30 });
    const smoothTextY = useSpring(textY, { stiffness: 100, damping: 30 });

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1], 
                delay: index * 0.08 
            }}
            viewport={{ once: true, margin: "-10%" }}
            onClick={onClick}
            className="group relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center cursor-pointer mb-16 md:mb-20 lg:mb-32 last:mb-0"
        >
            {/* Image Side */}
            <motion.div
                className="relative lg:col-span-7 aspect-[16/10] overflow-hidden rounded-3xl bg-[#111] border border-white/5 group/image"
                whileHover={{ rotateX: 3, rotateY: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
                <motion.div 
                    className="absolute inset-0 z-10 bg-transparent md:bg-black/40 md:group-hover:bg-transparent transition-colors duration-700"
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                />
                
                {/* Parallax Image - Applied directly to motion.img */}
                <motion.img 
                    style={{ y: smoothImageY }}
                    src={project.image} 
                    alt={t(project.title)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[120%] -mt-[10%] object-cover opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-all duration-700 filter md:grayscale md:group-hover:grayscale-0" 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
            </motion.div>

            {/* Content Side */}
            <motion.div 
                style={{ y: smoothTextY }}
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className="lg:col-span-5 flex flex-col justify-center items-start"
            >
                <motion.div
                    variants={itemVariants}
                    className="mb-6 flex flex-wrap gap-2"
                >
                    {project.tags.map((tag, tagIndex) => (
                        <motion.span
                            key={tag}
                            custom={tagIndex}
                            variants={itemVariants}
                            className="px-4 py-1 text-[11px] uppercase tracking-wider border border-white/10 text-neutral-400 font-medium rounded-full group-hover:border-accent/30 transition-colors"
                            whileHover={{ 
                                scale: 1.05, 
                                borderColor: "rgba(255, 107, 53, 0.5)",
                                color: "#ff6b35"
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {tag}
                        </motion.span>
                    ))}
                </motion.div>
                
                <motion.h3
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-display font-bold mb-3 text-white group-hover:text-accent transition-colors duration-300"
                    whileHover={{ x: 4 }}
                >
                    {t(project.title)}
                </motion.h3>
                
                
                <motion.h4
                    variants={itemVariants}
                    className="text-lg text-white/60 mb-6 font-sans group-hover:text-white transition-colors duration-300"
                >
                    {t(project.role).replace("Client:", "").trim()}
                </motion.h4>
                
                <motion.p
                    variants={itemVariants}
                    className="text-neutral-400 leading-relaxed text-base md:text-lg mb-8 max-w-md group-hover:text-neutral-300 transition-colors duration-300"
                >
                    {t(project.description)}
                </motion.p>
                
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors group/btn"
                    whileHover={{ x: 4 }}
                >
                    {t("projects.viewCaseStudy")}
                    <motion.div
                        whileHover={{ rotate: 45 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export const Projects: React.FC<ProjectsProps> = ({ onProjectClick }) => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.6, 0.9, 1]);
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 });
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="py-16 md:py-32 bg-[#050505] relative z-20 border-t border-white/5 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          style={{ y: smoothHeaderY, opacity: smoothHeaderOpacity }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-12 border-b border-white/5"
        >
          <div className="space-y-3">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-sm font-sans text-accent tracking-[0.2em] uppercase block"
            >
              {t("projects.sectionKicker")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-display font-bold text-white"
            >
              {t("projects.sectionTitle")}
            </motion.h2>
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