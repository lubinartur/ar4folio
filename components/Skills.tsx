import React, { useRef } from "react";
import { useI18n } from "../services/i18n";
import { motion, useScroll, useTransform } from "framer-motion";

interface Skill {
  name: string;
  descriptor: string;
  icon: string | React.ReactNode;
  group: 'tools' | 'ai';
}

// Компонент иконки Figma (официальные цвета)
const FigmaIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 300C77.6142 300 100 277.614 100 250V200H50C22.3858 200 0 222.386 0 250C0 277.614 22.3858 300 50 300Z" fill="#1ABCFE"/>
    <path d="M0 150C0 122.386 22.3858 100 50 100H100V200H50C22.3858 200 0 177.614 0 150Z" fill="#A259FF"/>
    <path d="M0 50C0 22.3858 22.3858 0 50 0H100V100H50C22.3858 100 0 77.6142 0 50Z" fill="#F24E1E"/>
    <path d="M100 0H150C177.614 0 200 22.3858 200 50C200 77.6142 177.614 100 150 100H100V0Z" fill="#FF7262"/>
    <path d="M200 150C200 177.614 177.614 200 150 200C122.386 200 100 177.614 100 150C100 122.386 122.386 100 150 100C177.614 100 200 122.386 200 150Z" fill="#0ACF83"/>
  </svg>
);

// Компонент иконки Photoshop (официальный логотип из Adobe)
const PhotoshopIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 240 234" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Фон */}
    <path d="M42.5,0h155C221,0,240,19,240,42.5v149c0,23.5-19,42.5-42.5,42.5h-155C19,234,0,215,0,191.5v-149C0,19,19,0,42.5,0z" fill="#001E36"/>
    {/* Буква P */}
    <path d="M54,164.1V61.2c0-0.7,0.3-1.1,1-1.1c1.7,0,3.3,0,5.6-0.1c2.4-0.1,4.9-0.1,7.6-0.2c2.7-0.1,5.6-0.1,8.7-0.2c3.1-0.1,6.1-0.1,9.1-0.1c8.2,0,15,1,20.6,3.1c5,1.7,9.6,4.5,13.4,8.2c3.2,3.2,5.7,7.1,7.3,11.4c1.5,4.2,2.3,8.5,2.3,13c0,8.6-2,15.7-6,21.3c-4,5.6-9.6,9.8-16.1,12.2c-6.8,2.5-14.3,3.4-22.5,3.4c-2.4,0-4,0-5-0.1c-1-0.1-2.4-0.1-4.3-0.1v32.1c0.1,0.7-0.4,1.3-1.1,1.4c-0.1,0-0.2,0-0.4,0H55.2C54.4,165.4,54,165,54,164.1z M75.8,79.4V113c1.4,0.1,2.7,0.2,3.9,0.2H85c3.9,0,7.8-0.6,11.5-1.8c3.2-0.9,6-2.8,8.2-5.3c2.1-2.5,3.1-5.9,3.1-10.3c0.1-3.1-0.7-6.2-2.3-8.9c-1.7-2.6-4.1-4.6-7-5.7c-3.7-1.5-7.7-2.1-11.8-2c-2.6,0-4.9,0-6.8,0.1C77.9,79.2,76.5,79.3,75.8,79.4L75.8,79.4z" fill="#31A8FF"/>
    {/* Буква s */}
    <path d="M192,106.9c-3-1.6-6.2-2.7-9.6-3.4c-3.7-0.8-7.4-1.3-11.2-1.3c-2-0.1-4.1,0.2-6,0.7c-1.3,0.3-2.4,1-3.1,2c-0.5,0.8-0.8,1.8-0.8,2.7c0,0.9,0.4,1.8,1,2.6c0.9,1.1,2.1,2,3.4,2.7c2.3,1.2,4.7,2.3,7.1,3.3c5.4,1.8,10.6,4.3,15.4,7.3c3.3,2.1,6,4.9,7.9,8.3c1.6,3.2,2.4,6.7,2.3,10.3c0.1,4.7-1.3,9.4-3.9,13.3c-2.8,4-6.7,7.1-11.2,8.9c-4.9,2.1-10.9,3.2-18.1,3.2c-4.6,0-9.1-0.4-13.6-1.3c-3.5-0.6-7-1.7-10.2-3.2c-0.7-0.4-1.2-1.1-1.1-1.9v-17.4c0-0.3,0.1-0.7,0.4-0.9c0.3-0.2,0.6-0.1,0.9,0.1c3.9,2.3,8,3.9,12.4,4.9c3.8,1,7.8,1.5,11.8,1.5c3.8,0,6.5-0.5,8.3-1.4c1.6-0.7,2.7-2.4,2.7-4.2c0-1.4-0.8-2.7-2.4-4c-1.6-1.3-4.9-2.8-9.8-4.7c-5.1-1.8-9.8-4.2-14.2-7.2c-3.1-2.2-5.7-5.1-7.6-8.5c-1.6-3.2-2.4-6.7-2.3-10.2c0-4.3,1.2-8.4,3.4-12.1c2.5-4,6.2-7.2,10.5-9.2c4.7-2.4,10.6-3.5,17.7-3.5c4.1,0,8.3,0.3,12.4,0.9c3,0.4,5.9,1.2,8.6,2.3c0.4,0.1,0.8,0.5,1,0.9c0.1,0.4,0.2,0.8,0.2,1.2v16.3c0,0.4-0.2,0.8-0.5,1C192.9,107.1,192.4,107.1,192,106.9z" fill="#31A8FF"/>
  </svg>
);

// Компонент иконки Illustrator (официальный логотип из Adobe)
const IllustratorIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Фон */}
    <path d="M2 12.1333C2 8.58633 2 6.81283 2.69029 5.45806C3.29749 4.26637 4.26637 3.29749 5.45806 2.69029C6.81283 2 8.58633 2 12.1333 2H19.8667C23.4137 2 25.1872 2 26.5419 2.69029C27.7336 3.29749 28.7025 4.26637 29.3097 5.45806C30 6.81283 30 8.58633 30 12.1333V19.8667C30 23.4137 30 25.1872 29.3097 26.5419C28.7025 27.7336 27.7336 28.7025 26.5419 29.3097C25.1872 30 23.4137 30 19.8667 30H12.1333C8.58633 30 6.81283 30 5.45806 29.3097C4.26637 28.7025 3.29749 27.7336 2.69029 26.5419C2 25.1872 2 23.4137 2 19.8667V12.1333Z" fill="#330000"/>
    {/* Буква Ai */}
    <path d="M15.5686 19.5963H11.2297L10.3469 22.409C10.3224 22.5135 10.2262 22.5875 10.1215 22.5823H7.92384C7.79851 22.5823 7.75469 22.5117 7.79236 22.3704L11.549 11.2738C11.5866 11.1582 11.6242 11.0266 11.6617 10.8789C11.7109 10.6218 11.736 10.3606 11.7369 10.0987C11.7261 10.0213 11.7941 9.95294 11.8683 9.96378H14.8549C14.9424 9.96378 14.9924 9.9959 15.0051 10.0601L19.269 22.3897C19.3065 22.5182 19.269 22.5824 19.1563 22.5823H16.7144C16.6288 22.5921 16.547 22.5334 16.5266 22.4475L15.5686 19.5963ZM11.9059 17.1689H14.8737C14.3861 15.5027 13.8358 13.8584 13.3898 12.1793C12.9086 13.8613 12.3836 15.5365 11.9059 17.1689Z" fill="#FF9A00"/>
    <path d="M21.8045 12.0058C21.6129 12.0137 21.4219 11.98 21.2438 11.907C21.0658 11.834 20.9048 11.7232 20.7714 11.582C20.6384 11.4346 20.535 11.2618 20.4673 11.0733C20.3996 10.8849 20.3689 10.6846 20.3769 10.4839C20.3701 10.2852 20.4042 10.0873 20.477 9.90305C20.5499 9.71881 20.6598 9.5524 20.7996 9.41468C20.938 9.27839 21.1014 9.17161 21.2804 9.10052C21.4593 9.02942 21.6502 8.99543 21.842 9.00049C22.2929 9.00049 22.6466 9.13856 22.9033 9.41468C23.0329 9.55818 23.1336 9.72648 23.1997 9.90995C23.2657 10.0934 23.2959 10.2885 23.2883 10.4839C23.2962 10.6853 23.2645 10.8864 23.1951 11.075C23.1258 11.2636 23.0201 11.436 22.8845 11.582C22.7428 11.7253 22.5736 11.8369 22.3878 11.9099C22.2019 11.9828 22.0033 12.0155 21.8045 12.0058ZM20.5084 22.3896V13.181C20.5084 13.0654 20.5583 13.0076 20.6587 13.0076H22.9691C23.0691 13.0076 23.1192 13.0654 23.1193 13.181V22.3896C23.1193 22.5182 23.0692 22.5824 22.9691 22.5823H20.6775C20.5648 22.5823 20.5084 22.5181 20.5084 22.3896Z" fill="#FF9A00"/>
  </svg>
);

// Компонент иконки Cursor AI (логотип Cursor - цветная версия)
const CursorIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <img 
    src="/icons/cursor-color.svg" 
    alt="Cursor AI" 
    className={className}
  />
);

// Компонент иконки ChatGPT (официальный логотип)
const ChatGPTIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="-9999" y="-9999">ChatGPT</text>
    <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z" fill="white" stroke="none"/>
  </svg>
);

// Компонент иконки AI Studio (Google AI Studio)
const AIStudioIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <img 
    src="/icons/aistudio-color.svg" 
    alt="AI Studio" 
    className={className}
  />
);

// Компонент иконки Midjourney
const MidjourneyIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style={{ fill: "none", stroke: "currentColor", strokeWidth: "18px", strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d="m 174,794 c 20,0 50,-42 85,-48 c 20,0 35,42 85,48 c 35,0 50,-42 85,-42 c 35,0 50,42 85,42 c 35,0 50,-42 85,-42 c 35,0 50,42 85,42 c 35,0 50,-42 85,-42 c 35,0 50,42 85,42"/>
      <path d="M 242.4,752.2 L 219.5,708.4 L 809.5,670.4 C 763.1,712.6 703.5,746.8 643.2,774.8"/>
      <path d="M 454.4,300.4 C 554.8,331.1 695.2,479.4 743,638.8 C 716.8,628.5 697.2,618 660.4,627.4 C 624.8,497.9 561.1,374.2 454.4,300.4 z"/>
      <path d="M 267.7,229.5 C 396.3,284.5 572.7,437.6 605.1,641.5 C 456.8,581.7 343.9,613.6 265.3,662.1 C 385.2,509.7 331.4,336.4 267.7,229.5 z"/>
    </g>
  </svg>
);

// Иконки для инструментов
const getToolIcon = (name: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    "Figma": <FigmaIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "Photoshop": <PhotoshopIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "Illustrator": <IllustratorIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "Cursor AI": <CursorIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "ChatGPT": <ChatGPTIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "Midjourney": <MidjourneyIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "AI Studio": <AIStudioIcon className="w-16 h-16 md:w-20 md:h-20" />,
    "Sketch": <span className="text-5xl md:text-6xl">💎</span>,
    "Adobe XD": <span className="text-5xl md:text-6xl">⚫</span>,
  };
  return icons[name] || <span className="text-5xl md:text-6xl">🎯</span>;
};

export const Skills: React.FC = () => {
  const { t } = useI18n();
  
  const designTools: Skill[] = [
    { name: "Figma", descriptor: t("skills.figmaDescriptor"), icon: getToolIcon("Figma"), group: 'tools' },
    { name: "Photoshop", descriptor: t("skills.photoshopDescriptor"), icon: getToolIcon("Photoshop"), group: 'tools' },
    { name: "Illustrator", descriptor: t("skills.illustratorDescriptor"), icon: getToolIcon("Illustrator"), group: 'tools' },
  ];

  const aiTools: Skill[] = [
    { name: "ChatGPT", descriptor: t("skills.chatgptDescriptor"), icon: getToolIcon("ChatGPT"), group: 'ai' },
    { name: "Cursor AI", descriptor: t("skills.cursorDescriptor"), icon: getToolIcon("Cursor AI"), group: 'ai' },
    { name: "Midjourney", descriptor: t("skills.midjourneyDescriptor"), icon: getToolIcon("Midjourney"), group: 'ai' },
  ];
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.8, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-10 pb-4 md:pb-6 border-b border-white/5"
        >
          <div className="flex flex-col space-y-3">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-accent text-sm tracking-widest font-medium uppercase"
            >
              {t("skills.kicker")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-display font-semibold text-white"
            >
              {t("skills.sectionTitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-neutral-400 text-base md:text-lg max-w-2xl"
            >
              {t("skills.subtitle")}
            </motion.p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full">
          {/* Left Column: Design Tools */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            style={{ perspective: 1000 }}
            className="flex flex-col"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xl md:text-2xl font-display font-semibold text-white mb-4 h-[2.5rem] md:h-[3rem] flex items-end"
            >
              {t("skills.designColumnTitle")}
            </motion.h3>
            <div className="grid grid-rows-3 gap-4">
              {designTools.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
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
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-accent/35 via-white/5 to-transparent p-[1px] rounded-2xl overflow-hidden group/card h-full">
                    <div className="relative h-full rounded-2xl bg-[#101010] border border-white/5 px-5 py-5 flex flex-row items-center gap-5 overflow-hidden group-hover/card:border-accent/30 transition-all duration-300">
                      {/* Animated gradient glow on hover */}
                      <motion.div
                        className="pointer-events-none absolute inset-[-40%] bg-[radial-gradient(circle_at_top_right,rgba(255,120,80,0.16),transparent_60%)]"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Icon */}
                      <div className="relative z-[1] flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        {typeof skill.icon === 'string' ? (
                          <span className="text-5xl md:text-6xl">{skill.icon}</span>
                        ) : (
                          skill.icon
                        )}
                      </div>

                      {/* Text content */}
                      <div className="relative z-[1] flex flex-col justify-center flex-1 min-w-0">
                        {/* Name */}
                        <h4 className="text-lg md:text-xl font-display font-semibold text-white mb-1.5 group-hover:text-accent transition-colors duration-300">
                          {skill.name}
                        </h4>

                        {/* Descriptor */}
                        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                          {skill.descriptor}
                        </p>
                      </div>

                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ pointerEvents: "none" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: AI-assisted workflow */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            style={{ perspective: 1000 }}
            className="flex flex-col"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xl md:text-2xl font-display font-semibold text-white mb-4 h-[2.5rem] md:h-[3rem] flex items-end"
            >
              {t("skills.aiColumnTitle")}
            </motion.h3>
            <div className="grid grid-rows-3 gap-4">
              {aiTools.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
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
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-accent/35 via-white/5 to-transparent p-[1px] rounded-2xl overflow-hidden group/card h-full">
                    <div className="relative h-full rounded-2xl bg-[#101010] border border-white/5 px-5 py-5 flex flex-row items-center gap-5 overflow-hidden group-hover/card:border-accent/30 transition-all duration-300">
                      {/* Animated gradient glow on hover */}
                      <motion.div
                        className="pointer-events-none absolute inset-[-40%] bg-[radial-gradient(circle_at_top_right,rgba(255,120,80,0.16),transparent_60%)]"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Icon */}
                      <div className="relative z-[1] flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        {typeof skill.icon === 'string' ? (
                          <span className="text-5xl md:text-6xl">{skill.icon}</span>
                        ) : (
                          skill.icon
                        )}
                      </div>

                      {/* Text content */}
                      <div className="relative z-[1] flex flex-col justify-center flex-1 min-w-0">
                        {/* Name */}
                        <h4 className="text-lg md:text-xl font-display font-semibold text-white mb-1.5 group-hover:text-accent transition-colors duration-300">
                          {skill.name}
                        </h4>

                        {/* Descriptor */}
                        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                          {skill.descriptor}
                        </p>
                      </div>

                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ pointerEvents: "none" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
