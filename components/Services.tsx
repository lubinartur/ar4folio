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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ServiceCardProps {
  service: typeof SERVICES[0];
  index: number;
  t: (key: string) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, t }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[service.icon] ?? Layout;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.4, 0.8, 1]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const smoothY = useSpring(cardY, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(cardOpacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(cardScale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      style={{ 
        y: smoothY, 
        opacity: smoothOpacity, 
        scale: smoothScale,
      }}
      whileHover={{
        y: -12,
        scale: 1.04,
        rotateX: 2,
        rotateY: -2,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/35 via-white/5 to-transparent p-[1px]"
    >
      {/* Card body */}
      <motion.div
        className="relative h-full rounded-2xl bg-[#101010] border border-white/5 px-7 py-8 flex flex-col justify-between overflow-hidden"
        whileHover={{
          borderColor: "rgba(255, 107, 53, 0.4)",
          transition: { duration: 0.3 },
        }}
      >
        {/* Animated gradient glow on hover */}
        <motion.div
          className="pointer-events-none absolute inset-[-40%] bg-[radial-gradient(circle_at_top_right,rgba(255,120,80,0.16),transparent_60%)]"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Large background icon with animation */}
        <motion.div
          className="absolute -right-6 -top-6"
          initial={{ opacity: 0.05, scale: 1, rotate: 0 }}
          whileHover={{ opacity: 0.15, scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-28 h-28 text-accent" />
        </motion.div>

        <div className="relative z-[1] flex flex-col gap-6">
          {/* Index pill + small icon with animation */}
          <div className="flex items-center justify-between gap-4">
            <motion.span
              className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono tracking-[0.25em] uppercase text-accent/80"
              whileHover={{
                borderColor: "rgba(255, 107, 53, 0.5)",
                color: "#ff6b35",
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <motion.div
              className="w-11 h-11 bg-white/5 rounded-md flex items-center justify-center text-neutral-400"
              whileHover={{
                backgroundColor: "#ff6b35",
                color: "#000",
                scale: 1.1,
                rotate: 5,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>

          {/* Title + copy with animation */}
          <motion.div
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.h3
              className="text-lg md:text-xl font-display font-semibold mb-3 text-white"
              whileHover={{ x: 4, color: "#ff6b35" }}
              transition={{ duration: 0.2 }}
            >
              {t(service.title)}
            </motion.h3>
            <motion.p
              className="text-neutral-400 leading-relaxed text-sm md:text-[15px]"
              whileHover={{ color: "#ffffff" }}
              transition={{ duration: 0.2 }}
            >
              {t(service.description)}
            </motion.p>
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%", opacity: 0 }}
          whileHover={{ x: "100%", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }}
        />
      </motion.div>
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
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.8, 1]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with parallax */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-white/5"
        >
          <div className="flex flex-col space-y-3">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-accent text-sm tracking-widest font-medium uppercase"
            >
              {t("services.kicker")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-display font-semibold text-white"
            >
              {t("about.servicesTitle")}
            </motion.h2>
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          style={{ perspective: 1000 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, idx) => (
            <ServiceCard key={service.title} service={service} index={idx} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;