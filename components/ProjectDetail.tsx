import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { PROJECTS } from '../constants';
import { Media, MotionMedia } from './Media';
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
  // Canonical project resolution:
  // - Always prefer slug/id from URL (/cases/:slugOrId)
  // - Then fallback to incoming prop (may be a lightweight preview object)
  const routeSlugOrId =
    typeof window !== 'undefined'
      ? window.location.pathname.replace('/cases/', '').split('/')[0]
      : '';

  const canonicalProject =
    PROJECTS.find((p) => (p as any)?.slug === routeSlugOrId || p.id === routeSlugOrId) ||
    (project?.id ? PROJECTS.find((p) => p.id === project.id) : undefined) ||
    project;

  const roleLabel = canonicalProject.role ? t(canonicalProject.role) : '';
  // Other projects (for footer navigation)
  const otherProjects = PROJECTS.filter((p) => p.title !== canonicalProject.title).slice(0, 2);
  // Map project.id to localization key (e.g., 'placet-selfservice' -> 'placetSelfservice')
  const projectKey = canonicalProject.id === 'placet-selfservice' ? 'placetSelfservice' : canonicalProject.id;
  
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

  const impactIcons = [TrendingUp, ShieldCheck, Zap] as const;
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
                  {canonicalProject.tags.join(' / ')}
                </motion.h4>
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-2 break-words [hyphens:auto] [overflow-wrap:anywhere]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {t(canonicalProject.title)}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-2xl text-neutral-400"
                >
                  {myRole}
                </motion.p>
             </div>
          </motion.div>
          {canonicalProject.description && (
            <motion.p
              variants={itemVariants}
              className="text-neutral-400 text-[16px] md:text-[16px] max-w-3xl"
            >
              {t(canonicalProject.description)}
            </motion.p>
          )}
        </motion.div>

        {/* Project Media */}
        <motion.div
          initial={{ y: 50, opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mb-20 group relative"
        >
          {/* Hover on container, not on Media internals */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full"
          >
          {canonicalProject.image ? (
            <MotionMedia
              src={canonicalProject.image}
              alt={
                typeof canonicalProject.title === 'string'
                  ? canonicalProject.title
                  : t(canonicalProject.title)
              }
              aspect="16/9"
              className="w-full rounded-3xl bg-[#111]"
              imgClassName="transition-transform duration-700 ease-out"
              priority
            />
          ) : null}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        </motion.div>

        {/* Impact (full width) */}
        <section className="pb-16 md:pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl text-white font-display font-bold mb-4 md:mb-6"
              whileHover={{ x: 4, color: "#ff6b35" }}
              transition={{ duration: 0.2 }}
            >
              {t("projectDetail.impact")}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
              {impactMetrics.map((item: { value: string; label: string; description?: string }, i: number) => {
                const Icon = impactIcons[i % impactIcons.length];
                return (
                <motion.article
                  key={i}
                  custom={i}
                  variants={listItemVariants}
                  whileHover={{ borderColor: "rgba(255, 107, 53, 0.3)" }}
                  className="h-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 flex flex-col transition-colors duration-300"
                >
                  {/* Icon above title */}
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                    <Icon size={18} />
                  </span>

                  {/* Title: clamp to 1 line */}
                  <div className="mt-4 text-accent font-display font-bold text-xl md:text-2xl leading-tight line-clamp-1">
                    {item.label}
                    {item.value && !item.label.includes(item.value) ? ` ${item.value}` : ""}
                  </div>
                  {item.description && (
                    <div className="mt-3 text-white/70 leading-relaxed text-base max-w-[60ch] line-clamp-2">
                      {item.description}
                    </div>
                  )}
                  <div className="mt-auto" />
                </motion.article>
                );
              })}
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
                {t(`projects.${projectKey}.solution`) || canonicalProject.fullDescription?.solution || "I redesigned the Placet app end-to-end with a focus on calm structure, transparency, and instant comprehension. Authentication was rebuilt using Smart-ID, Mobile-ID, and Face ID to establish trust from the first interaction. The dashboard follows a glance-first model, showing balance, next payment, and actions within seconds. A multi-state financial architecture was designed: processing, active, overdue, and empty states. The transaction feed was rebuilt into a dense but readable list with clear hierarchy and color-coded amounts. A full physical card journey was designed: ordered, shipped, expected delivery, activation, and active use. Both dark and light themes share a unified premium fintech visual language."}
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
                {t(`projects.${projectKey}.result`) || canonicalProject.fullDescription?.result || "The redesign improved user confidence and reduced ambiguity in daily financial actions. Support requests decreased due to clearer states and predictable flows. Users understood upcoming payments faster and navigated the app with less friction. The structure strengthened trust — the most valuable currency in fintech."}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Screens / Gallery */}
        {canonicalProject.screens && canonicalProject.screens.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="space-y-16 mb-24"
          >
            {canonicalProject.screens.map((screen, index) => {
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
                  className="w-full group/image relative"
                  whileHover={{ scale: 1.01, borderColor: "rgba(255, 107, 53, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  {screen.image ? (
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="w-full"
                    >
                      <MotionMedia
                        src={screen.image}
                        alt={screen.title}
                        aspect="16/10"
                        className="w-full rounded-3xl bg-[#111] border border-white/10"
                        imgClassName="transition-transform duration-700 ease-out"
                      />
                    </motion.div>
                  ) : null}
                </motion.div>
                </motion.section>
              );
            })}
          </motion.div>
        ) : (
          canonicalProject.gallery && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="grid md:grid-cols-2 gap-8 mb-24"
            >
              {canonicalProject.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={itemVariants}
                  className="relative group"
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  {img ? (
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="w-full"
                    >
                      <MotionMedia
                        src={img}
                        alt={`Gallery ${i}`}
                        aspect="4/3"
                        className="w-full rounded-3xl bg-[#111]"
                        imgClassName="opacity-80 group-hover:opacity-100 transition-opacity duration-500 transition-transform duration-700 ease-out"
                      />
                    </motion.div>
                  ) : null}
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
                    onClick={() => {
                      const slugOrId = (p as any)?.slug || p.id;
                      const canonical =
                        PROJECTS.find((x) => (x as any)?.slug === slugOrId || x.id === slugOrId) || p;
                      onProjectClick(canonical);
                    }}
                    whileHover={{ scale: 1.02, y: -4, borderColor: "rgba(255, 107, 53, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left cursor-pointer hover:bg-white/[0.06] transition-colors"
                  >
                    <motion.div
                      className="w-28 md:w-32 rounded-xl border border-white/10 bg-[#111] relative overflow-hidden"
                      // Hover on container, not on img
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <Media
                        src={p.image}
                        alt={t(p.title)}
                        aspect="4/3"
                        className="w-full rounded-xl bg-[#111]"
                        imgClassName="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
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