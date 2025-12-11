import React from "react";
import { useI18n } from "../services/i18n";
import { motion } from "framer-motion";

export const AboutIntro: React.FC = () => {
  const { t } = useI18n();
  return (
    <section id="about-intro" className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex gap-10 md:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Text content with left accent border */}
          <div className="w-full pl-0">
            <motion.div
              className="border-l-4 border-accent/80 pl-6 md:pl-10 inline-block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-display font-semibold text-white mb-8 break-words">
                {t("about.heroStatement")}
              </h1>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-white/70 mb-10 pl-6 md:pl-10 border-l-4 border-transparent"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.6 }}
            >
              {t("about.shortSpecialization")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pl-6 md:pl-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <a
                href="/cv-classic.pdf"
                className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-black transition"
              >
                {t("about.downloadCv")}
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition"
                rel="noreferrer"
              >
                {t("about.viewLinkedIn")}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutIntro;