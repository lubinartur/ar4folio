import React from "react";
import { useI18n } from "../services/i18n";
import { motion } from "framer-motion";

export const AboutIntro: React.FC = () => {
  const { t, language } = useI18n();

  // Функция для выделения фразы оранжевым цветом
  const highlightPhrase = (text: string): React.ReactNode => {
    // Паттерны для поиска фразы на разных языках
    const patterns: Record<string, RegExp> = {
      en: /(Product & UX Designer with 9\+ years)/gi,
      ru: /(Product & UX дизайнер с опытом более 9 лет)/gi,
      et: /(Product & UX disainer üle 9-aastase kogemusega)/gi,
    };

    const pattern = patterns[language] || patterns.en;
    if (!pattern) return text;

    const matches = Array.from(text.matchAll(pattern));
    if (matches.length === 0) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, matchIndex) => {
      if (match.index !== undefined) {
        // Добавляем текст до совпадения
        if (match.index > lastIndex) {
          parts.push(
            <React.Fragment key={`text-${matchIndex}`}>
              {text.substring(lastIndex, match.index)}
            </React.Fragment>
          );
        }
        // Добавляем выделенную фразу
        parts.push(
          <span key={`highlight-${matchIndex}`} className="text-accent">
            {match[0]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }
    });

    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push(
        <React.Fragment key="text-end">
          {text.substring(lastIndex)}
        </React.Fragment>
      );
    }

    return <>{parts}</>;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const titleItem = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.92,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.5, ease: "easeOut" },
        y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
      },
    },
  };

  const textItem = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.4, ease: "easeOut" },
        y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    },
  };

  const buttonItem = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
        opacity: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
        scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      },
    },
  };

  return (
    <section id="about-intro" className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex gap-10 md:gap-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Text content with left accent border */}
          <div className="w-full pl-0">
            <motion.div
              className="border-l-4 border-accent/80 pl-6 md:pl-10 inline-block"
              variants={titleItem}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-display font-semibold text-white mb-8 break-words">
                {highlightPhrase(t("about.heroStatement"))}
              </h1>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-white/70 mb-10 pl-6 md:pl-10 border-l-4 border-transparent"
              variants={textItem}
            >
              {t("about.shortSpecialization")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pl-6 md:pl-10"
              variants={buttonItem}
            >
              <motion.a
                href="/cv/artur-lubin-cv-classic.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-black transition"
                variants={buttonItem}
              >
                {t("about.downloadCv")}
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/artur-lubin-0588a0168/"
                target="_blank"
                className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition"
                rel="noreferrer"
                variants={buttonItem}
              >
                {t("about.viewLinkedIn")}
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutIntro;