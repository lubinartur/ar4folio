import React from "react";
import { EXPERIENCE } from "../constants";
import { useI18n } from "../services/i18n";
import { motion } from "framer-motion";

export const Experience: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="experience"
      className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a]"
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-white/5"
        >
          <div className="space-y-3 max-w-3xl">
            <span className="text-accent text-sm tracking-widest font-medium uppercase">
              {t("about.selectedWorkLabel")}
            </span>

            <h2 className="text-4xl md:text-5xl font-display font-semibold text-white">
              {t("about.experienceTitle")}
            </h2>

            <p className="text-neutral-400 text-base md:text-lg max-w-2xl">
              {t("about.experienceDescription")}
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative space-y-16 mt-10">
          {/* Vertical Line */}
          <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-accent to-transparent opacity-30 md:left-0" />

          {EXPERIENCE.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-12 md:pl-16 group"
            >
              {/* Dot */}
              <div className="absolute left-[-2px] md:left-[-5px] top-3 w-[11px] h-[11px] rounded-full bg-[#0a0a0a] border-2 border-accent z-10 group-hover:bg-accent transition-colors" />

              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                <h3 className="text-2xl font-display font-bold text-white">
                  {t(job.company)}
                </h3>

                <span className="font-mono text-sm text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/25">
                  {t(job.period)}
                </span>
              </div>

              <h4 className="text-lg text-neutral-300 mb-4 font-medium">
                {t(job.role)}
              </h4>

              {job.items ? (
                <ul className="grid md:grid-cols-2 gap-2">
                  {job.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-neutral-400 text-base flex items-start gap-2"
                    >
                      <span className="text-accent/50 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 block shrink-0" />
                      {t(item)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-400 text-base md:text-base leading-relaxed">
                  {t(job.description)}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;