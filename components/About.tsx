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
        <div className="max-w-6xl mx-auto space-y-12">
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
      <section className="pt-16 pb-24 md:py-32 container mx-auto px-6 border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-display font-semibold mb-6">{t("about.experienceTitle")}</h2>
            <p className="text-neutral-400">
              {t("about.experienceDescription")}
            </p>
          </div>

          <div className="lg:col-span-8 space-y-16 relative">
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
            {t("about.servicesTitle")}
            <div className="h-[1px] flex-1 bg-white/10 ml-8 mb-2 hidden md:block" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-[#111] border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-24 h-24 text-accent" />
                  </div>

                  <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors text-neutral-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-display">{t(service.title)}</h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">{t(service.description)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};