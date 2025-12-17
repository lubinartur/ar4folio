import React, { useRef } from "react";
import { useI18n } from "../services/i18n";
import { SERVICES } from "../constants";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Layout, Box, TrendingUp, PenTool, Zap } from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  layout: Layout,
  box: Box,
  "trending-up": TrendingUp,
  "pen-tool": PenTool,
  zap: Zap,
};

interface ServiceCardProps {
  service: typeof SERVICES[0];
  index: number;
  t: (key: string) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, t }) => {
  const Icon = iconMap[service.icon] ?? Layout;
  const isPrimary = index === 0; // Product & UX дизайн - главная карточка

  // Refined gradient colors for each card
  const gradients = [
    "from-accent/60 via-accent/30 to-accent/10", // Primary card - более яркий и насыщенный
    "from-accent/25 via-accent/12 to-transparent",
    "from-accent/30 via-accent/15 to-transparent",
    "from-accent/20 via-accent/10 to-transparent",
    "from-accent/25 via-accent/12 to-transparent",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: isPrimary ? -6 : -3, 
        scale: isPrimary ? 1.02 : 1.01 
      }}
      className={`group relative rounded-3xl overflow-hidden ${
        isPrimary 
          ? 'md:col-span-1 md:row-span-2' 
          : 'min-h-0'
      }`}
    >
      {/* Refined card background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-3xl`} />
      
      {/* Dark base with refined border */}
      <div className={`absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-3xl border transition-all duration-500 ${
        isPrimary 
          ? 'border-accent/50 group-hover:border-accent/70 shadow-[0_0_30px_rgba(255,120,80,0.15)]' 
          : 'border-white/5 group-hover:border-white/12 shadow-[0_0_10px_rgba(255,255,255,0.03)]'
      }`} />
      
      {/* Multiple glowing accents for primary card */}
      {isPrimary && (
        <>
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-accent/25 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.35, 0.2],
              x: [0, 20, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </>
      )}

      {/* Content - vertical layout for primary card, horizontal for others */}
      {isPrimary ? (
        // Vertical centered layout for primary card
        <div className="relative z-10 flex flex-col items-center text-center justify-center h-full p-8 md:p-10 lg:p-12">
          {/* Large centered icon */}
          <motion.div
            className="mb-6 md:mb-8"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              {/* Icon glow */}
              <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-accent/40 to-accent/20 border-2 border-accent/60 flex items-center justify-center shadow-[0_0_40px_rgba(255,120,80,0.4)]">
                <Icon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 md:mb-6 group-hover:text-accent transition-colors duration-300">
            {t(service.title)}
          </h3>

          {/* Description - max 2 lines */}
          <p className="text-base md:text-lg lg:text-xl text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors duration-300 max-w-2xl line-clamp-2">
            {t(service.description)}
          </p>
        </div>
      ) : (
        // Horizontal layout for other cards - centered vertically
        <div className="relative z-10 flex flex-row gap-3 md:gap-4 p-4 md:p-5 h-full">
          {/* Fixed-size square icon - aligned with text block center */}
          <div className="flex items-center flex-shrink-0">
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent/25 to-accent/10 border border-accent/40 flex items-center justify-center group-hover:from-accent/35 group-hover:to-accent/20 group-hover:border-accent/60 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </motion.div>
          </div>
          
          {/* Text wrapper - left-aligned, centered vertically */}
          <div className="flex flex-col items-start justify-center flex-1 min-w-0">
            {/* Title - consistent font-weight */}
            <h3 className="text-base md:text-lg font-display font-semibold text-white group-hover:text-accent transition-colors duration-300 mb-1.5">
              {t(service.title)}
            </h3>

            {/* Description - muted color, max 2 lines */}
            <p className="text-sm md:text-base text-neutral-300 leading-snug group-hover:text-neutral-200 transition-colors duration-300 line-clamp-2">
              {t(service.description)}
            </p>
          </div>
        </div>
      )}

      {/* Refined hover shine effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent rounded-3xl ${
          isPrimary ? 'via-white/8' : 'via-white/4'
        }`}
        initial={{ x: "-100%", opacity: 0 }}
        whileHover={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />
      
      {/* Subtle inner glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 rounded-3xl"
        whileHover={{ 
          background: isPrimary 
            ? "linear-gradient(to bottom right, rgba(255,120,80,0.05), rgba(255,120,80,0.02), rgba(255,120,80,0))"
            : "linear-gradient(to bottom right, rgba(255,120,80,0.02), rgba(255,120,80,0.01), rgba(255,120,80,0))"
        }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: "none" }}
      />
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 });
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 md:py-32 bg-[#050505] relative"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          style={{ y: smoothHeaderY, opacity: smoothHeaderOpacity }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-12 border-b border-white/5"
        >
          <div className="space-y-3 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-sm font-sans text-accent tracking-[0.2em] uppercase block"
            >
              {t("services.kicker")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-display font-bold text-white"
            >
              {t("services.mainTitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-neutral-400 text-base md:text-lg max-w-2xl"
            >
              {t("services.subtitle")}
            </motion.p>
          </div>
        </motion.div>

        {/* Services Grid - Large card on left, 4 cards in 2x2 grid on right */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 md:auto-rows-[minmax(140px,auto)]">
          {SERVICES.map((service, index) => (
            <ServiceCard 
              key={service.title} 
              service={service} 
              index={index} 
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
