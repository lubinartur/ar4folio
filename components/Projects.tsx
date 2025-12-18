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

const ProjectCard: React.FC<{ project: Project; index: number; totalProjects: number; onClick: () => void }> = React.memo(({ project, index, totalProjects, onClick }) => {
    const { t } = useI18n();
    const containerRef = useRef<HTMLElement>(null);
    
    // Use listDescription if available, otherwise fall back to description
    const descriptionKey = project.listDescription || project.description;
    const descriptionText = t(descriptionKey);
    
    // Create local scroll progress for this specific card
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the image: moves opposite to scroll for WOW effect (reduced to prevent overflow)
    const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.1, 1.05]);
    const textY = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
    
    // Smooth spring animations with more responsiveness
    const smoothImageY = useSpring(imageY, { stiffness: 80, damping: 25 });
    const smoothImageScale = useSpring(imageScale, { stiffness: 100, damping: 30 });
    const smoothTextY = useSpring(textY, { stiffness: 100, damping: 30 });

    return (
        <motion.article 
            ref={containerRef}
            id={`project-${project.id}`}
            data-project-id={project.id}
            initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1], 
                delay: index * 0.08 
            }}
            viewport={{ once: true, margin: "-10%" }}
            onClick={onClick}
            className={`group relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center cursor-pointer ${
              index === 0 
                ? 'mt-0 mb-16 md:mb-20 lg:mb-24' 
                : index === totalProjects - 1 
                ? 'mt-0 mb-0 pb-20 md:pb-28 lg:pb-36' 
                : 'mt-0 mb-16 md:mb-20 lg:mb-24'
            }`}
        >
            {/* Image Side */}
            <motion.div
                className="relative lg:col-span-7 aspect-[16/10] overflow-hidden rounded-3xl bg-[#111] border border-white/5 group-hover:border-accent/20 transition-colors duration-300"
            >
                <motion.div 
                    className="absolute inset-0 z-10 bg-transparent md:bg-black/40 md:group-hover:bg-transparent transition-colors duration-700"
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                />
                
                {/* Parallax Image - Enhanced WOW effect with strict clipping */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ clipPath: 'inset(0)', willChange: 'transform' }}>
                    <motion.div
                        style={{ 
                            y: smoothImageY,
                            scale: smoothImageScale,
                            width: '110%',
                            height: '110%',
                            left: '-5%',
                            top: '-5%'
                        }}
                        className="absolute"
                    >
                        <img 
                            src={project.image} 
                            alt={t(project.title)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-all duration-700 filter md:grayscale md:group-hover:grayscale-0" 
                            style={{
                                objectPosition: 'center',
                                display: 'block'
                            }}
                        />
                    </motion.div>
                </div>
                
            </motion.div>

            {/* Content Side */}
            <motion.div 
                style={{ y: smoothTextY }}
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className="lg:col-span-5 flex flex-col justify-center items-start max-w-[480px]"
            >
                {/* Tags */}
                <motion.div
                    variants={itemVariants}
                    className="mb-5 flex flex-wrap gap-2"
                >
                    {project.tags.map((tag, tagIndex) => (
                        <motion.span
                            key={tag}
                            custom={tagIndex}
                            variants={itemVariants}
                            className="px-4 py-1 text-[11px] uppercase tracking-wider border border-white/10 text-neutral-400 font-medium rounded-full group-hover:border-accent/30 transition-colors"
                        >
                            {tag}
                        </motion.span>
                    ))}
                </motion.div>
                
                {/* Text Content Group */}
                <div className="flex flex-col items-start">
                    <motion.h3
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-display font-bold mb-2 text-white group-hover:text-accent transition-colors duration-300"
                    >
                        {t(project.title)}
                    </motion.h3>
                    
                    <motion.h4
                        variants={itemVariants}
                        className="text-lg text-white/60 mb-4 font-sans group-hover:text-white transition-colors duration-300"
                    >
                        {t(project.role)}
                    </motion.h4>
                    
                    <motion.p
                        variants={itemVariants}
                        className="text-neutral-400 leading-relaxed text-base md:text-lg mb-4 group-hover:text-neutral-300 transition-colors duration-300"
                    >
                        {descriptionText}
                    </motion.p>
                    
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors group/btn"
                    >
                        {t("projects.viewCaseStudy")}
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.article>
    );
}, (prevProps, nextProps) => {
    // Memo comparison: only re-render if project data changes
    return prevProps.project.id === nextProps.project.id && 
           prevProps.index === nextProps.index;
});

ProjectCard.displayName = 'ProjectCard';

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
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}
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
          className="mb-8 md:mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-12 border-b border-white/5"
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
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-neutral-400 text-base md:text-lg max-w-2xl"
            >
              {t("projects.sectionSubtitle")}
            </motion.p>
          </div>
        </motion.div>

        {/* Anchor: start of project cards list (below section header) */}
        <div id="projects-start" />

        <div className="flex flex-col">
          {PROJECTS.map((project, index) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                totalProjects={PROJECTS.length}
                onClick={() => onProjectClick(project)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
