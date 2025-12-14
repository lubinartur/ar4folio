import React, { useRef } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useI18n } from '../services/i18n';

export const Contact: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [15, -10]);
  
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothTitleOpacity = useSpring(titleOpacity, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });
  const smoothButtonY = useSpring(buttonY, { stiffness: 100, damping: 30 });

  return (
    <footer 
      ref={sectionRef}
      id="contact" 
      className="relative bg-black pt-40 pb-12 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-32">
          <motion.div
            style={{ y: smoothTitleY, opacity: smoothTitleOpacity }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h2
              className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-12 leading-[0.9] bg-gradient-to-b from-white via-neutral-400 to-accent text-transparent bg-clip-text"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {t("contact.heroTitle")}
            </motion.h2>
          </motion.div>
          
          <motion.p
            style={{ y: smoothSubtitleY }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-neutral-400 mb-12 max-w-xl mx-auto font-light font-sans"
          >
            {t("contact.subtitle")}
          </motion.p>
          
          <motion.a
            href={`mailto:${SOCIAL_LINKS.email}`}
            style={{ y: smoothButtonY }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1], 
              delay: 0.2,
              hover: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="inline-flex items-center gap-4 bg-accent text-black px-12 py-6 rounded-full text-lg font-bold font-display uppercase tracking-wider relative overflow-hidden group"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">{t("contact.cta")}</span>
            <motion.div
              className="relative z-10"
              whileHover={{ rotate: 45, x: 4, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="border-t border-white/10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-neutral-500 text-xs font-mono uppercase tracking-widest text-center md:text-left"
          >
            <span className="text-white">{t("contact.footerInfo")}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex gap-8 items-center"
          >
            <motion.a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4 relative"
              whileHover={{ 
                x: 4,
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {t("contact.linkedin")}
            </motion.a>
            <motion.a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4 relative"
              whileHover={{ 
                x: 4,
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {t("contact.email")}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
