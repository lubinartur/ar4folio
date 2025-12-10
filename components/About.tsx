import React from 'react';
import { EXPERIENCE, SERVICES } from '../constants';
import { useI18n } from '../services/i18n';
import { motion } from 'framer-motion';
import { Layout, Box, TrendingUp, PenTool, Zap } from 'lucide-react';

const iconMap: Record<string, any> = {
  layout: Layout,
  box: Box,
  'trending-up': TrendingUp,
  'pen-tool': PenTool,
  zap: Zap
};

export const About: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="bg-[#0f0f0f] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Intro + Snapshot Section */}
      <section id="about" className="py-32 container mx-auto px-6">
        <div id="cv" className="h-0" />
        <div className="w-full space-y-12">
          {/* Hero Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l-2 border-accent/50 pl-8 md:pl-12"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.1] text-neutral-200">
              {t("about.heroStatement")}
            </h2>
          </motion.div>

          {/* Short specialization line */}
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl pl-8 md:pl-12 font-light leading-relaxed">
            {t("about.shortSpecialization")}
          </p>

          <div className="flex flex-wrap gap-3 pl-8 md:pl-12 mt-8">
            <a
              href="/cv/artur-lubin-cv-classic.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full border border-accent/80 bg-accent/10 text-accent text-sm font-medium hover:bg-accent hover:text-black transition-colors"
            >
              {t("about.downloadCv")}
            </a>
            <a
              href="https://www.linkedin.com/in/artur-lubin-0588a0168"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 text-neutral-300 text-sm font-medium hover:border-accent/50 hover:text-accent transition-colors"
            >
              {t("about.viewLinkedIn")}
            </a>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          {/* Section header - aligned with Featured projects style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-white/5"
          >
            <div className="space-y-3 max-w-3xl">
              <span className="text-accent text-sm tracking-widest font-medium">
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

          {/* Timeline content */}
          <div className="relative space-y-16 mt-10">
            {/* Timeline Vertical Line */}
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
                {/* Timeline Dot */}
                <div className="absolute left-[-2px] md:left-[-5px] top-3 w-[11px] h-[11px] rounded-full bg-[#0f0f0f] border-2 border-accent z-10 group-hover:bg-accent transition-colors" />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-2xl font-display font-bold text-white">{job.company}</h3>
                  <span className="font-mono text-sm text-accent bg-accent/10 px-2 py-1 rounded">
                    {t(job.period)}
                  </span>
                </div>

                <h4 className="text-lg text-neutral-300 mb-4 font-medium">{t(job.role)}</h4>

                {job.items ? (
                  <ul className="grid md:grid-cols-2 gap-2">
                    {job.items.map((item, i) => (
                      <li key={i} className="text-neutral-400 text-sm flex items-start gap-2">
                        <span className="text-accent/50 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 block shrink-0" />
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-400 max-w-2xl text-sm leading-relaxed">
                    {t(job.description)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex items-end justify-between">
            <div className="flex flex-col space-y-2">
              <span className="text-accent text-sm tracking-widest font-medium">
                {t("about.selectedWorkLabel")}
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-white">
                {t("about.servicesTitle")}
              </h2>
            </div>
            <div className="h-[1px] flex-1 bg-white/10 ml-8 mb-2 hidden md:block" />
          </div>

          {(() => {
            const serviceCardVariants = {
              hidden: { opacity: 0, y: 30 },
              visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: "easeOut",
                },
              }),
            };
            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service, idx) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <motion.div
                      key={idx}
                      variants={serviceCardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      custom={idx}
                      whileHover={{
                        y: -10,
                        scale: 1.03,
                        boxShadow: "0 28px 80px rgba(0,0,0,0.75)",
                        transition: { type: "spring", stiffness: 260, damping: 22 },
                      }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/35 via-white/5 to-transparent p-[1px]"
                    >
                      {/* Card body */}
                      <div className="relative h-full rounded-2xl bg-[#101010] border border-white/5 px-7 py-8 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:border-accent/40">
                        {/* Soft glow on hover */}
                        <div className="pointer-events-none absolute inset-[-40%] bg-[radial-gradient(circle_at_top_right,rgba(255,120,80,0.16),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Large background icon */}
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-15 transition-opacity duration-500">
                          <Icon className="w-28 h-28 text-accent" />
                        </div>

                        <div className="relative z-[1] flex flex-col gap-6">
                          {/* Index pill + small icon */}
                          <div className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono tracking-[0.25em] uppercase text-accent/80">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="w-11 h-11 bg-white/5 rounded-md flex items-center justify-center text-neutral-400 group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Title + copy */}
                          <div>
                            <h3 className="text-lg md:text-xl font-display font-semibold mb-3 text-white">
                              {t(service.title)}
                            </h3>
                            <p className="text-neutral-400 leading-relaxed text-sm md:text-[15px]">
                              {t(service.description)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
};