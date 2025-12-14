import React, { useEffect, useRef } from 'react';
import { Project } from '../types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { PROJECTS } from '../constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const { t } = useI18n();
  const roleLabel = project.role ? t(project.role) : '';
  const clientName = roleLabel.replace(/^Client:\s*/i, '');
  // Other projects (for footer navigation)
  const otherProjects = PROJECTS.filter((p) => p.title !== project.title).slice(0, 2);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.6, 0.9, 1]);
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 });
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 });
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      ref={sectionRef}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#050505] pt-24 pb-20 relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Back Button (fixed, always visible) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-6 bottom-8 z-40"
        >
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-neutral-400 hover:text-white hover:border-accent/60 transition-colors"
          >
            <motion.div
              className="w-9 h-9 rounded-full border border-white/20 bg-white text-black flex items-center justify-center transition-all 
            group-hover:bg-accent group-hover:text-black group-hover:border-accent"
              whileHover={{ rotate: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.25em]">
              Back to Projects
            </span>
          </motion.button>
        </motion.div>

        {/* Header */}
        <motion.div
          style={{ y: smoothHeaderY, opacity: smoothHeaderOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-8"
          >
             <div>
                <motion.h4
                  variants={itemVariants}
                  className="text-accent font-mono text-sm mb-4"
                >
                  {project.tags.join(' / ')}
                </motion.h4>
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-7xl font-display font-bold text-white mb-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {t(project.title)}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-2xl text-neutral-400"
                >
                  {roleLabel}
                </motion.p>
             </div>
             <motion.div
               variants={itemVariants}
               className="text-right"
               whileHover={{ scale: 1.1 }}
               transition={{ duration: 0.3 }}
             >
                <span className="text-4xl font-display font-bold text-white/10">{project.year}</span>
             </motion.div>
          </motion.div>
          {project.description && (
            <motion.p
              variants={itemVariants}
              className="text-neutral-400 text-[16px] md:text-[16px] max-w-3xl"
            >
              {t(project.description)}
            </motion.p>
          )}
        </motion.div>

        {/* Main Image */}
        <motion.div
          initial={{ y: 50, opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
          className="w-full aspect-video bg-[#111] rounded-3xl overflow-hidden mb-20 group relative"
        >
           <motion.img
             src={project.image}
             alt={project.title}
             className="w-full h-full object-cover"
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
           />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        </motion.div>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid md:grid-cols-12 gap-12 mb-24"
        >
           <motion.div className="md:col-span-8 space-y-16">
              
              <motion.div variants={itemVariants}>
                 <h3 className="text-2xl text-white font-display font-bold mb-4">The Challenge</h3>
                 <div className="text-neutral-400 text-[16px] leading-relaxed space-y-3">
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
              </motion.div>

              <motion.div variants={itemVariants}>
                 <motion.h3
                   className="text-2xl text-white font-display font-bold mb-4"
                   whileHover={{ x: 4, color: "#ff6b35" }}
                   transition={{ duration: 0.2 }}
                 >
                   The Solution
                 </motion.h3>
                 <div className="text-neutral-400 text-[16px] leading-relaxed space-y-4">
                   <motion.p variants={itemVariants}>
                     I redesigned the Placet App end‑to‑end with focus on calm structure, transparency, and instant comprehension.
                   </motion.p>
                   <motion.ul
                     variants={containerVariants}
                     className="space-y-1"
                   >
                     {[
                       "Rebuilt authentication with Smart‑ID, Mobile‑ID, FaceID",
                       "Glance‑first dashboard for clear balance, next payment, actions",
                       "Multi‑state financial architecture: processing, active, overdue",
                       "Dense, readable transaction feed with color‑coding",
                       "Redesigned full card journey: ordered → shipped → active",
                       "Unified light & dark premium fintech themes"
                     ].map((item, i) => (
                       <motion.li
                         key={i}
                         custom={i}
                         variants={listItemVariants}
                         className="flex items-start gap-2 group/item"
                         whileHover={{ x: 4 }}
                       >
                         <motion.span
                           className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0 group-hover/item:bg-accent group-hover/item:scale-150 transition-all duration-300"
                         />
                         <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                       </motion.li>
                     ))}
                   </motion.ul>
                 </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                 <motion.h3
                   className="text-2xl text-white font-display font-bold mb-4"
                   whileHover={{ x: 4, color: "#ff6b35" }}
                   transition={{ duration: 0.2 }}
                 >
                   The Result
                 </motion.h3>
                 <div className="text-neutral-400 text-[16px] leading-relaxed space-y-6">
                   <motion.p variants={itemVariants}>
                     The redesign strengthened user confidence and reduced ambiguity.
                   </motion.p>
                   <motion.ul
                     variants={containerVariants}
                     className="space-y-1"
                   >
                     {[
                       "Fewer support questions from clearer financial states",
                       "Faster understanding of upcoming payments",
                       "Smoother onboarding and everyday flows",
                       "Consistent experience across dark & light modes"
                     ].map((item, i) => (
                       <motion.li
                         key={i}
                         custom={i}
                         variants={listItemVariants}
                         className="flex items-start gap-2 group/item"
                         whileHover={{ x: 4 }}
                       >
                         <motion.span
                           className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/70 block shrink-0 group-hover/item:bg-accent group-hover/item:scale-150 transition-all duration-300"
                         />
                         <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                       </motion.li>
                     ))}
                   </motion.ul>
                 </div>
              </motion.div>

           </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="md:col-span-4 space-y-10"
          >
            {/* Overview */}
            <motion.div variants={itemVariants}>
              <motion.h3
                className="text-2xl text-white font-display font-bold mb-4"
                whileHover={{ x: 4, color: "#ff6b35" }}
                transition={{ duration: 0.2 }}
              >
                Overview
              </motion.h3>
              <div className="space-y-5 text-neutral-400 text-[16px] md:text-[16px] leading-relaxed">
                {[
                  { label: "Client", value: clientName },
                  { label: "Year", value: project.year }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 mb-1.5">
                      {item.label}
                    </div>
                    <div className="text-neutral-100">
                      {item.value}
                    </div>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants}>
                  <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 mb-1.5">
                    Focus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        custom={i}
                        variants={listItemVariants}
                        whileHover={{ scale: 1.05, borderColor: "rgba(255, 107, 53, 0.5)", color: "#ff6b35" }}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.18em] text-neutral-100 transition-all duration-300"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div variants={itemVariants}>
              <motion.h3
                className="text-2xl text-white font-display font-bold mb-4"
                whileHover={{ x: 4, color: "#ff6b35" }}
                transition={{ duration: 0.2 }}
              >
                Impact
              </motion.h3>
              <div className="space-y-5">
                {[
                  { value: "+XX%", label: "On-time repayments" },
                  { value: "-YY%", label: "Support questions" },
                  { value: "3x", label: "Faster to insight" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={listItemVariants}
                    whileHover={{ scale: 1.02, y: -4, borderColor: "rgba(255, 107, 53, 0.3)" }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 transition-all duration-300"
                  >
                    <div className="text-2xl font-display font-bold text-accent mb-1">
                      {item.value}
                    </div>
                    <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Screens / Gallery */}
        {project.screens && project.screens.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="space-y-16 mb-24"
          >
            {project.screens.map((screen, index) => (
              <motion.section
                key={screen.title + index}
                custom={index}
                variants={itemVariants}
                className="space-y-6 group"
              >
                <div className="space-y-3">
                  <motion.p
                    className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500"
                    whileHover={{ x: 4 }}
                  >
                    Process {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </motion.p>
                  <motion.h3
                    className="text-2xl md:text-3xl font-display font-semibold text-white"
                    whileHover={{ x: 4, color: "#ff6b35" }}
                    transition={{ duration: 0.2 }}
                  >
                    {screen.title}
                  </motion.h3>
                  {screen.description && (
                    <motion.p
                      className="text-neutral-400 text-[16px] md:text-[16px] leading-relaxed"
                      whileHover={{ color: "#ffffff" }}
                    >
                      {screen.description}
                    </motion.p>
                  )}
                </div>
                <motion.div
                  className="w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10 group/image"
                  whileHover={{ scale: 1.01, borderColor: "rgba(255, 107, 53, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={screen.image}
                    alt={screen.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </motion.div>
              </motion.section>
            ))}
          </motion.div>
        ) : (
          project.gallery && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="grid md:grid-cols-2 gap-8 mb-24"
            >
              {project.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={itemVariants}
                  className="aspect-[4/3] bg-[#111] rounded-3xl overflow-hidden group"
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <motion.img
                    src={img}
                    alt={`Gallery ${i}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )
        )}

        {/* Browse More Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="border-t border-white/10 pt-16 pb-12 mt-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 w-full md:w-auto">
              <motion.p
                variants={itemVariants}
                className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500"
              >
                More projects
              </motion.p>

              <div className="grid gap-4 sm:grid-cols-2">
                {otherProjects.map((p, i) => (
                  <motion.button
                    key={p.title}
                    custom={i}
                    variants={listItemVariants}
                    type="button"
                    onClick={onBack}
                    whileHover={{ scale: 1.02, y: -4, borderColor: "rgba(255, 107, 53, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left cursor-pointer hover:bg-white/[0.06] transition-colors"
                  >
                    <motion.div
                      className="w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border border-white/10 bg-[#111]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={p.image}
                        alt={t(p.title)}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </motion.div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                        {p.tags.join(' / ')}
                      </p>
                      <h3 className="text-sm md:text-base font-display font-semibold text-white group-hover:text-accent transition-colors">
                        {t(p.title)}
                      </h3>
                      {p.role && (
                        <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors">
                          {t(p.role)}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
        {/* Next Project CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="border-t border-white/10 pt-20 text-center"
        >
            <motion.h3
              variants={itemVariants}
              className="text-neutral-500 mb-6 font-mono uppercase tracking-widest"
            >
              Interested in this workflow?
            </motion.h3>
            <motion.a
              variants={itemVariants}
              href="mailto:contact@arturlubin.com"
              whileHover={{ scale: 1.05, color: "#ff6b35" }}
              className="inline-flex items-center gap-2 text-3xl md:text-5xl font-display font-bold text-white hover:text-accent transition-colors group"
            >
              Let's Discuss Your Project
              <motion.div
                whileHover={{ rotate: 45, x: 4, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12" />
              </motion.div>
            </motion.a>
        </motion.div>

      </div>
    </motion.div>
  );
};