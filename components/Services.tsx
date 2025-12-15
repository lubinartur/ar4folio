import React, { useRef, useState } from "react";
import { useI18n } from "../services/i18n";
import { SERVICES } from "../constants";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Layout, Box, TrendingUp, PenTool, Zap, ChevronLeft, ChevronRight } from "lucide-react";

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
  isActive: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, t, isActive }) => {
  const Icon = iconMap[service.icon] ?? Layout;
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.6, 0.9, 1]);
  const smoothY = useSpring(cardY, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(cardOpacity, { stiffness: 100, damping: 30 });

  // Different gradient colors for each card
  const gradients = [
    "from-accent/40 via-accent/20 to-transparent", // Orange-red
    "from-accent/30 via-accent/15 to-transparent",
    "from-accent/35 via-accent/18 to-transparent",
    "from-accent/25 via-accent/12 to-transparent",
    "from-accent/40 via-accent/20 to-transparent",
  ];

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        y: smoothY, 
        opacity: smoothOpacity,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex-shrink-0 w-[380px] md:w-[420px] lg:w-[480px] h-[520px] md:h-[580px] rounded-3xl overflow-hidden"
    >
      {/* Card background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-3xl`} />
      
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/10" />
      
      {/* Glowing accent in top-left */}
      <motion.div
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-accent/30 blur-3xl"
        animate={isActive ? { 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-8 md:p-10">
        {/* Top badge area */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Icon className="w-5 h-5 text-accent" />
            </div>
          </div>
          {index === 0 && (
            <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold">
              75%
            </div>
          )}
        </div>

        {/* Large central icon with glow */}
        <motion.div
          className="flex-1 flex items-center justify-center mb-8"
          animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
            <Icon className="relative w-32 h-32 md:w-40 md:h-40 text-accent drop-shadow-[0_0_30px_rgba(255,61,0,0.5)]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl md:text-3xl font-display font-bold text-white mb-4"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {t(service.title)}
        </motion.h3>

        {/* Description with bullet points style */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              {t(service.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 });
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const cardWidth = 480; // lg:w-[480px]
      const gap = 24; // gap-6
      const scrollPosition = index * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const nextCard = () => {
    const next = (activeIndex + 1) % SERVICES.length;
    scrollToCard(next);
  };

  const prevCard = () => {
    const prev = (activeIndex - 1 + SERVICES.length) % SERVICES.length;
    scrollToCard(prev);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 md:py-32 bg-[#050505] relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Panel - Title and Description */}
          <motion.div
            style={{ y: smoothHeaderY, opacity: smoothHeaderOpacity }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-accent text-sm tracking-widest font-medium uppercase block"
              >
                {t("services.kicker")}
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight"
              >
                {t("about.servicesTitle")}
              </motion.h2>

              {/* Gradient underline accent */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "120px" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent rounded-full"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-md"
              >
                {t("services.sectionSubtitle") || "We handle your technological challenges so you can focus on scaling your business."}
              </motion.p>
            </div>
          </motion.div>

          {/* Right Panel - Carousel */}
          <div className="lg:col-span-8">
            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevCard}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:border-accent/50 hover:bg-accent/10 flex items-center justify-center text-white transition-all duration-300 -translate-x-6"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextCard}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:border-accent/50 hover:bg-accent/10 flex items-center justify-center text-white transition-all duration-300 translate-x-6"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Scrollable Cards */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => {
                  const target = e.currentTarget;
                  const cardWidth = 480;
                  const gap = 24;
                  const newIndex = Math.round(target.scrollLeft / (cardWidth + gap));
                  if (newIndex !== activeIndex && newIndex >= 0 && newIndex < SERVICES.length) {
                    setActiveIndex(newIndex);
                  }
                }}
              >
                {SERVICES.map((service, index) => (
                  <div key={service.title} className="snap-center">
                    <ServiceCard 
                      service={service} 
                      index={index} 
                      t={t}
                      isActive={index === activeIndex}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {SERVICES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeIndex
                        ? "w-3 h-3 bg-accent"
                        : "w-2 h-2 bg-neutral-600 hover:bg-neutral-500"
                    }`}
                    aria-label={`Go to service ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Services;
