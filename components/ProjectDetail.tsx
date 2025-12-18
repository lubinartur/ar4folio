import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { PROJECTS } from '../constants';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import et from '../locales/et.json';

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

const staticItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
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

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onProjectClick: (project: Project) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onProjectClick }) => {
  const { t, language } = useI18n();
  const roleLabel = project.role ? t(project.role) : '';
  // Other projects (for footer navigation)
  const otherProjects = PROJECTS.filter((p) => p.title !== project.title).slice(0, 2);
  // Map project.id to localization key (e.g., 'placet-selfservice' -> 'placetSelfservice')
  const projectKey = project.id === 'placet-selfservice' ? 'placetSelfservice' : project.id;
  
  // Get project data from locale files
  const dictionaries: Record<string, any> = { en, ru, et };
  const dict = dictionaries[language] || dictionaries.en;
  const projectData = dict?.projects?.[projectKey];
  
  // Get role and client from project data
  const myRole = projectData?.role ? t(projectData.role) : roleLabel;
  // Extract client name - try from projectData.client first, then fallback to old format
  let clientName = '';
  if (projectData?.client) {
    clientName = t(projectData.client);
  } else {
    // Fallback: try to extract from role if it contains "Client:", "Клиент:", "Klient:"
    const roleText = projectData?.role ? t(projectData.role) : roleLabel;
    const match = roleText.match(/(?:Client|Клиент|Klient):\s*(.+)/i);
    if (match) {
      clientName = match[1].split('/')[0].trim();
    }
  }
  
  // Get impact metrics from locale files
  const impactMetrics = (Array.isArray(projectData?.impact) ? projectData.impact : [
    { value: "+XX%", label: t("projectDetail.onTimeRepayments") },
    { value: "-YY%", label: t("projectDetail.supportQuestions") },
    { value: "3x", label: t("projectDetail.fasterToInsight") }
  ]) as Array<{ value: string; label: string; description?: string }>;
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

  const backButton = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-6 bottom-8 z-[100] pointer-events-auto"
      style={{ position: 'fixed' }}
    >
      <motion.button
        onClick={() => onBack()}
        whileHover={{ scale: 1.05, x: 4 }}
        whileTap={{ scale: 0.95 }}
        className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-neutral-300 hover:text-white hover:border-accent/60 transition-colors shadow-lg"
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
          {t("projects.backToProjects")}
        </span>
      </motion.button>
    </motion.div>
  );

  return (
    <>
      {typeof document !== 'undefined' && createPortal(backButton, document.body)}
      <motion.div 
        ref={sectionRef}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen bg-[#050505] pt-24 pb-20 relative"
        style={{ overflow: 'visible' }}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
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
                  {myRole}
                </motion.p>
             </div>
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

        {/* Project Media */}
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
             alt={typeof project.title === 'string' ? project.title : t(project.title)}
             loading="eager"
             decoding="async"
             className="w-full h-full object-cover block"
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
           />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        </motion.div>

        {/* Case top: Overview (one card) + Impact (stacked metrics) */}
        <section className="pb-16 md:pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Overview */}
              <motion.div variants={itemVariants} className="flex flex-col h-full min-h-0">
                <motion.h3
                  className="text-2xl text-white font-display font-bold mb-4"
                  whileHover={{ x: 4, color: "#ff6b35" }}
                  transition={{ duration: 0.2 }}
                >
                  {t("projectDetail.overview")}
                </motion.h3>

                {/* One overview card (contains 2 blocks) */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.01, borderColor: "rgba(255, 107, 53, 0.3)" }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-6 py-4 transition-all duration-300 flex-1 min-h-0 flex flex-col gap-6"
                >
                  {/* Block 1: client / role / year */}
                  <div className="flex flex-col gap-4 text-neutral-400 text-[16px] leading-relaxed">
                    {[
                      { label: t("projectDetail.client"), value: clientName },
                      { label: t("projectDetail.myRole"), value: myRole },
                      { label: t("projectDetail.year"), value: project.year }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col min-w-0">
                        <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 mb-1.5">
                          {item.label}
                        </div>
                        <div className="text-neutral-100 leading-snug">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-white/10" />

                  {/* Block 2: focus */}
                  <div className="flex flex-col gap-3">
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                      {t("projectDetail.focus")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <motion.span
                          key={tag}
                          custom={i}
                          variants={listItemVariants}
                          whileHover={{ scale: 1.05, borderColor: "rgba(255, 107, 53, 0.5)", color: "#ff6b35" }}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.18em] text-neutral-100 transition-all duration-300 whitespace-nowrap"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Impact */}
              <motion.div variants={itemVariants} className="flex flex-col h-full min-h-0">
                <motion.h3
                  className="text-2xl text-white font-display font-bold mb-4"
                  whileHover={{ x: 4, color: "#ff6b35" }}
                  transition={{ duration: 0.2 }}
                >
                  {t("projectDetail.impact")}
                </motion.h3>

                <div className="flex flex-col gap-4 flex-1 min-h-0">
                  {impactMetrics.map((item: { value: string; label: string; description?: string }, i: number) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={listItemVariants}
                      whileHover={{ scale: 1.02, y: -4, borderColor: "rgba(255, 107, 53, 0.3)" }}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-6 py-4 transition-all duration-300 flex-1 min-h-0"
                    >
                      <div className="text-2xl font-display font-bold text-accent mb-1">
                        {item.value}
                      </div>
                      <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Challenge, Solution, Result */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="space-y-16 mb-24"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl text-white font-display font-bold mb-4">{t("projectDetail.challenge")}</h3>
            <div className="text-neutral-400 text-[16px] leading-relaxed space-y-3">
              <p className="whitespace-pre-line">{t(`projects.${projectKey}.challenge`) || project.fullDescription?.challenge || "Managing consumer finance is inherently stressful. Users seek clarity, predictability, and control, yet most financial apps overwhelm them with numbers, legal language, and fragmented flows. Placet's mobile experience suffered from inconsistent user journeys, unclear financial states, and non-uniform interface logic across loans, credit lines, and card features."}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-2xl text-white font-display font-bold mb-4"
              whileHover={{ x: 4, color: "#ff6b35" }}
              transition={{ duration: 0.2 }}
            >
              {t("projectDetail.solution")}
            </motion.h3>
            <div className="text-neutral-400 text-[16px] leading-relaxed space-y-4">
              <motion.p variants={itemVariants} className="whitespace-pre-line">
                {t(`projects.${projectKey}.solution`) || project.fullDescription?.solution || "I redesigned the Placet app end-to-end with a focus on calm structure, transparency, and instant comprehension. Authentication was rebuilt using Smart-ID, Mobile-ID, and Face ID to establish trust from the first interaction. The dashboard follows a glance-first model, showing balance, next payment, and actions within seconds. A multi-state financial architecture was designed: processing, active, overdue, and empty states. The transaction feed was rebuilt into a dense but readable list with clear hierarchy and color-coded amounts. A full physical card journey was designed: ordered, shipped, expected delivery, activation, and active use. Both dark and light themes share a unified premium fintech visual language."}
              </motion.p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-2xl text-white font-display font-bold mb-4"
              whileHover={{ x: 4, color: "#ff6b35" }}
              transition={{ duration: 0.2 }}
            >
              {t("projectDetail.result")}
            </motion.h3>
            <div className="text-neutral-400 text-[16px] leading-relaxed space-y-6">
              <motion.p variants={itemVariants} className="whitespace-pre-line">
                {t(`projects.${projectKey}.result`) || project.fullDescription?.result || "The redesign improved user confidence and reduced ambiguity in daily financial actions. Support requests decreased due to clearer states and predictable flows. Users understood upcoming payments faster and navigated the app with less friction. The structure strengthened trust — the most valuable currency in fintech."}
              </motion.p>
            </div>
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
            {project.screens.map((screen, index) => {
              const screenKey = `screen${index + 1}`;
              const localizedTitle = t(`projects.${projectKey}.screens.${screenKey}.title`) || screen.title;
              const localizedDescription = t(`projects.${projectKey}.screens.${screenKey}.description`) || screen.description;
              
              return (
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
                    {t("projectDetail.process")} {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </motion.p>
                  <motion.h3
                    className="text-2xl md:text-3xl font-display font-semibold text-white"
                    whileHover={{ x: 4, color: "#ff6b35" }}
                    transition={{ duration: 0.2 }}
                  >
                    {localizedTitle}
                  </motion.h3>
                  {localizedDescription && (
                    <motion.p
                      className="text-neutral-400 text-[16px] md:text-[16px] leading-relaxed"
                      whileHover={{ color: "#ffffff" }}
                    >
                      {localizedDescription}
                    </motion.p>
                  )}
                </div>
                <motion.div
                  className="w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10 group/image aspect-[16/10] min-h-[220px] md:min-h-[380px]"
                  whileHover={{ scale: 1.01, borderColor: "rgba(255, 107, 53, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={screen.image}
                    alt={screen.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover block"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </motion.div>
                </motion.section>
              );
            })}
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
                {t("projects.relatedProjects")}
              </motion.p>

              <div className="grid gap-4 sm:grid-cols-2">
                {otherProjects.map((p, i) => (
                  <motion.button
                    key={p.title}
                    custom={i}
                    variants={listItemVariants}
                    type="button"
                    onClick={() => onProjectClick(p)}
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
                        {p.id === 'placet' && <span className="text-neutral-500 font-normal"> {t("projects.placetContext")}</span>}
                        {p.id === 'paskolos' && <span className="text-neutral-500 font-normal"> {t("projects.paskolosContext")}</span>}
                        {p.id === 'placet-selfservice' && <span className="text-neutral-500 font-normal"> {t("projects.placetSelfserviceContext")}</span>}
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
              {t("projectDetail.interestedInWorkflow")}
            </motion.h3>
            <motion.a
              variants={itemVariants}
              href="mailto:contact@arturlubin.com"
              whileHover={{ scale: 1.05, color: "#ff6b35" }}
              className="inline-flex items-center gap-2 text-3xl md:text-5xl font-display font-bold text-white hover:text-accent transition-colors group"
            >
              {t("projectDetail.discussProject")}
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
    </>
  );
};