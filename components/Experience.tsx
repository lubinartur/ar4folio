import React, { useRef } from "react";
import { EXPERIENCE } from "../constants";
import { useI18n } from "../services/i18n";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface ExperienceItemProps {
  job: typeof EXPERIENCE[0];
  index: number;
  t: (key: string) => string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ job, index, t }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center start"],
  });

  const itemY = useTransform(itemProgress, [0, 1], [30, -10]);
  const itemOpacity = useTransform(itemProgress, [0, 0.3, 1], [0.3, 0.8, 1]);

  return (
    <motion.div
      ref={itemRef}
      variants={itemVariants}
      style={{ y: itemY, opacity: itemOpacity }}
      className="relative grid grid-cols-[24px_1fr] gap-6 md:gap-8 group cursor-default"
    >
      {/* Timeline column (dot). The vertical line stays global. */}
      <div className="relative flex justify-center pointer-events-none pt-6 md:pt-8">
        {/* Dot: aligned to first line of company title */}
        <motion.span
          className="relative z-10 mt-[0.62em] w-[11px] h-[11px] rounded-full bg-[#0a0a0a] border-2 border-accent pointer-events-auto"
          whileHover={{
            scale: 1.5,
            backgroundColor: "#ff6b35",
            boxShadow: "0 0 20px rgba(255, 107, 53, 0.6)",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {/* Glow ring */}
          <motion.span
            className="absolute inset-0 rounded-full bg-accent opacity-0 pointer-events-none"
            whileHover={{ opacity: 0.3, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </div>

      {/* Content Card with hover effect */}
      <motion.div
        className="relative p-6 md:p-8 rounded-2xl bg-white/0 border border-white/0 group-hover:border-white/10 group-hover:bg-white/5 transition-all duration-500"
        whileHover={{ scale: 1.01, x: 8 }}
      >
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3">
          <motion.h3
            className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors duration-300"
            whileHover={{ x: 4 }}
          >
            {t(job.company)}
          </motion.h3>

          <motion.span
            className="font-mono text-sm text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25 inline-flex w-fit self-start md:self-auto group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {t(job.period)}
          </motion.span>
        </div>

        <motion.h4
          className="text-lg text-neutral-300 mb-4 font-medium group-hover:text-white transition-colors duration-300"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {t(job.role)}
        </motion.h4>

        {job.items ? (
          <motion.ul
            className="grid md:grid-cols-2 gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {job.items.map((item, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={listItemVariants}
                className="text-neutral-400 text-base flex items-start gap-3 group/item"
                whileHover={{ x: 4, color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="text-accent/50 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 block shrink-0 group-hover/item:bg-accent group-hover/item:scale-150 transition-all duration-300"
                />
                <span className="group-hover/item:text-white transition-colors duration-300">
                  {t(item)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p
            className="text-neutral-400 text-base md:text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {t(job.description)}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export const Experience: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Animated timeline line progress
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const smoothProgress = useSpring(lineProgress, {
    stiffness: 100,
    damping: 30,
  });
  
  const lineHeight = useTransform(smoothProgress, (progress) => `${progress * 100}%`);
  const lineOpacity = useTransform(smoothProgress, [0, 0.3, 1], [0, 0.5, 1]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-white/5"
        >
          <div className="space-y-3 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-accent text-sm tracking-widest font-medium uppercase"
            >
              {t("about.selectedWorkLabel")}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-display font-semibold text-white"
            >
              {t("about.experienceTitle")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-neutral-400 text-base md:text-lg max-w-2xl"
            >
              {t("about.experienceDescription")}
            </motion.p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative space-y-16 mt-10">
          {/* Animated Vertical Line */}
          <div className="absolute left-[12px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-30 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent via-accent to-transparent"
              style={{
                height: lineHeight,
                opacity: lineOpacity,
              }}
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            {EXPERIENCE.map((job, idx) => (
              <ExperienceItem key={idx} job={job} index={idx} t={t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;