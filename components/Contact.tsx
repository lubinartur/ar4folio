import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../services/i18n';

export const Contact: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer id="contact" className="relative bg-black pt-40 pb-12 overflow-hidden">
      {/* Glow Effect */}
      <motion.div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{
          opacity: [0.2, 0.6, 0.25],
          scale: [0.9, 1.05, 0.95],
          y: [40, 0, 30],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 120, scale: 0.88, rotateX: 30, rotateZ: -4 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 16,
                  mass: 0.9,
                },
              },
            }}
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.18,
                    duration: 0.9,
                    ease: "easeOut",
                  },
                },
              }}
              className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-12 leading-[0.9] bg-gradient-to-b from-white via-neutral-400 to-accent text-transparent bg-clip-text"
            >
              {t("contact.heroTitle")}
            </motion.h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="text-xl text-neutral-400 mb-12 max-w-xl mx-auto font-light font-sans"
          >
            {t("contact.subtitle")}
          </motion.p>
          
          <motion.a
            href={`mailto:${SOCIAL_LINKS.email}`}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.85, ease: "easeOut" }}
            whileHover={{
              scale: 1.12,
              rotate: -2,
              boxShadow: "0 0 80px rgba(255,61,0,0.75)",
            }}
            whileTap={{ scale: 0.95, rotate: 0 }}
            className="inline-flex items-center gap-4 bg-accent text-black px-12 py-6 rounded-full text-lg font-bold font-display uppercase tracking-wider transition-all hover:bg-white shadow-[0_0_40px_rgba(255,61,0,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            {t("contact.cta")} <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>

        <div className="border-t border-white/10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest text-center md:text-left">
            <span className="text-white">{t("contact.footerInfo")}</span>
          </div>
          
          <div className="flex gap-8 items-center">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4">{t("contact.linkedin")}</a>
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-accent underline-offset-4">{t("contact.email")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
