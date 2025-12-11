import React from "react";
import { useI18n } from "../services/i18n";
import { SERVICES } from "../constants";
import { motion } from "framer-motion";
import { Layout, Box, TrendingUp, PenTool, Zap } from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  layout: Layout,
  box: Box,
  "trending-up": TrendingUp,
  "pen-tool": PenTool,
  zap: Zap,
};

export const Services: React.FC = () => {
  const { t } = useI18n();

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
    <section id="services" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-white/5">
          <div className="flex flex-col space-y-2">
            <span className="text-accent text-sm tracking-widest font-medium">
              {t("about.selectedWorkLabel")}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-white">
              {t("about.servicesTitle")}
            </h2>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => {
            const Icon = iconMap[service.icon] ?? Layout;

            return (
              <motion.div
                key={service.title}
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
      </div>
    </section>
  );
};

export default Services;