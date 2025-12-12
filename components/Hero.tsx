import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useI18n } from "../services/i18n";

const ROLE_KEYS = ["hero.roles.fintech", "hero.roles.product", "hero.roles.uiux", "hero.roles.graphic"];


export const Hero: React.FC = () => {
  const { language, t } = useI18n();
  const { scrollY } = useScroll();
  
  const name = t("hero.name");
  const _reduceMotionPref = useReducedMotion();
  const reduceMotion = false; // force animations in Hero
  const nameClipId = "hero-name-clip";

  const nameReveal = {
    hidden: {
      opacity: 0,
      y: 10,
      x: 0,
      skewX: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      skewX: 0,
      filter: "blur(0px)",
      transition: {
        // базовое плавное появление
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const clipRect = {
    hidden: { scaleX: 0 },
    show: {
      scaleX: 1,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05,
      },
    },
  };



  const brands = [
    { name: "Decus",          src: "/brands/decus.svg" },
    { name: "K-Rauta",        src: "/brands/k-rauta.svg" },
    { name: "Kaup24",         src: "/brands/kaup24.svg" },
    { name: "Melior Clinics", src: "/brands/melior-clinics.svg" },
    { name: "MyTour",         src: "/brands/mytour.svg" },
    { name: "Piletilevi",     src: "/brands/piletilevi.svg" },
    { name: "Placet Group",   src: "/brands/placet-group.svg" },
    { name: "Whales Heaven",  src: "/brands/whales-heaven.svg" },
  ];
  
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isRoleDeleting, setIsRoleDeleting] = useState(false);


  useEffect(() => {
    const translated = t(ROLE_KEYS[roleIndex]) || "";
    const current = translated.toUpperCase();
    let timeout: ReturnType<typeof setTimeout>;

    if (!isRoleDeleting && roleText === current) {
      // Pause a bit on fully typed word
      timeout = setTimeout(() => {
        setIsRoleDeleting(true);
      }, 1400);
    } else if (isRoleDeleting && roleText === "") {
      // Move to next word after deleting
      timeout = setTimeout(() => {
        setIsRoleDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLE_KEYS.length);
      }, 260);
    } else {
      const nextLength = roleText.length + (isRoleDeleting ? -1 : 1);
      timeout = setTimeout(
        () => {
          setRoleText(current.slice(0, nextLength));
        },
        isRoleDeleting ? 70 : 110
      );
    }

    return () => clearTimeout(timeout);
  }, [roleIndex, roleText, isRoleDeleting, t]);
  
  // Parallax effects
  // Image moves significantly slower than scroll to act as a background anchor
  const yParallax = useTransform(scrollY, [0, 500], [0, 200]); 
  const opacityParallax = useTransform(scrollY, [0, 260, 700], [1, 1, 0]);
  
  // Text Parallax - Positive Y creates a "slower than scroll" effect (lag)
  // Differing values create separation between layers: Subhead (Front/Fastest) -> Title (Mid) -> Image (Back/Slowest)
  const subheadParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const titleParallax = useTransform(scrollY, [0, 500], [0, 150]);
  // Fade text out more slowly so the name & role stay visible longer while scrolling
  const textOpacity = useTransform(scrollY, [0, 340, 900], [1, 1, 0]);
  // Additional fade-out so the main name + role are fully gone
  // by the time the glass info bar becomes the focus
  const nameFadeOut = useTransform(scrollY, [260, 520], [1, 0]);
  const headerOpacity = useTransform(
    [textOpacity, nameFadeOut],
    ([base, fade]) => Math.min(base, fade)
  );

  // Cursor-reactive motion for the name mark
  const lastTiltX = useMotionValue(0);
  const lastTiltY = useMotionValue(0);

  // LAST name = slightly stronger + snappier
  const lastTiltXSpring = useSpring(lastTiltX, {
    stiffness: 140,
    damping: 16,
    mass: 0.28,
  });

  const lastTiltYSpring = useSpring(lastTiltY, {
    stiffness: 140,
    damping: 18,
    mass: 0.32,
  });


  // Combine scroll parallax with cursor tilt on Y (separate per layer)
  const titleParallaxWithLastTilt = useTransform(
    [titleParallax, lastTiltYSpring],
    ([base, tilt]) => base + tilt
  );

  return (
    <>
      <section className="relative w-full bg-black overflow-hidden">
      
        {/* Background Ambience - simplified & softer to avoid flicker */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
          {/* Base dark glow - static, just gives depth */}
          <div
            className="absolute top-[-25%] left-[-25%] w-[150vw] h-[150vw] bg-[#020202] rounded-full blur-[160px]"
          />

          {/* Slow moving shadow blob */}
          <motion.div
            animate={{
              x: ["-6%", "4%", "-6%"],
              y: ["-4%", "3%", "-4%"],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] right-[-15%] w-[90vw] h-[90vw] bg-[#070707] rounded-full blur-[170px] opacity-40"
          />

          {/* Warm accent glow - very subtle breathing */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[18%] left-[18%] w-[65vw] h-[65vw] bg-accent rounded-full blur-[230px]"
          />

          {/* Vertical light streak - minimal motion */}
          <motion.div
            animate={{
              y: ["0%", "12%", "0%"],
              opacity: [0, 0.12, 0],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[12%] right-[30%] w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-white/12 to-transparent blur-[1px]"
          />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 min-h-screen flex flex-col items-center justify-end pb-8 md:pb-12">
          

          {/* Central Hero Image */}
          <motion.div 
            style={{ y: yParallax, opacity: opacityParallax }}
            className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
          >
            {/* Image Container with Fade Mask and light sweep */}
            <div className="relative w-full max-w-2xl h-[70vh] md:h-[85vh] mt-0 md:mt-[-5vh] -translate-y-6 translate-x-2 md:translate-x-0 md:translate-y-0">
              <img 
                src="/images/hero-artur.png"
                alt="Artur Lubin"
                className="w-full h-full object-contain object-[55%_0%] md:object-top opacity-80 md:opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
              />
            </div>
          </motion.div>

          {/* Text Container */}
          <div className="relative w-full flex flex-col items-center mt-14 md:mt-20 mb-6 md:mb-7">

            {/*
              IMPORTANT:
              - The name axis must be stable across all screens.
              - Do NOT center using max-width containers (it shifts on ultrawide).
              - Use a shared left padding that is based on the viewport.
            */}

            {/* Name mark (SVG): stable across monitors */}
            <motion.div
              style={{ y: titleParallaxWithLastTilt, x: lastTiltXSpring, opacity: headerOpacity }}
              className="relative z-30 w-full flex justify-center"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
                const relY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

                lastTiltX.set(relX * 30);
                lastTiltY.set(relY * 18);
              }}
              onMouseLeave={() => {
                lastTiltX.set(0);
                lastTiltY.set(0);
              }}
            >
              <motion.svg
                role="img"
                aria-label={name}
                viewBox="0 0 806.16 153.9"
                className="h-auto w-[min(94vw,1100px)] md:w-[min(90vw,1350px)] lg:w-[min(86vw,1600px)] 2xl:w-[min(84vw,1750px)] drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)]"
                variants={reduceMotion ? undefined : nameReveal}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
              >
                {!reduceMotion && (
                  <defs>
                    <clipPath id={nameClipId}>
                      <motion.rect
                        x={0}
                        y={0}
                        width={806.16}
                        height={153.9}
                        initial="hidden"
                        animate="show"
                        variants={clipRect}
                        transformOrigin="0% 50%"
                        style={{ transformBox: 'fill-box' as any }}
                      />
                    </clipPath>

                    <linearGradient
                      id={`${nameClipId}-shine`}
                      x1="0"
                      y1="0"
                      x2="220"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="white" stopOpacity="0" />
                      <stop offset="0.45" stopColor="white" stopOpacity="0.85" />
                      <stop offset="0.55" stopColor="white" stopOpacity="0.85" />
                      <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    <mask id={`${nameClipId}-lubin-mask`} maskUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="806.16" height="153.9" fill="black" />
                      {/* LUBIN shape as mask */}
                      <path fill="white" d="M0,152.38V.64h52.68v106.44h86.27v45.31H0Z" />
                      <path fill="white" d="M163.88.64h52.78v107.74h59.18V.64h52.78v117.82c0,14.6-3.78,24.15-11.33,28.67-7.55,4.52-17.97,6.77-31.27,6.77h-79.66c-6.58,0-12.48-.49-17.72-1.46-5.24-.98-9.68-2.75-13.33-5.31-3.65-2.56-6.47-6.16-8.45-10.78-1.99-4.62-2.98-10.58-2.98-17.88V.64Z" />
                      <path fill="white" d="M367.64,152.38V.64h117.92c6.79,0,12.79.72,17.99,2.17,5.2,1.45,9.54,3.67,13.01,6.67,3.47,3,6.09,6.79,7.86,11.38,1.77,4.59,2.66,9.99,2.66,16.2v6.83c0,7.52-1.64,13.89-4.93,19.13-3.29,5.24-8.26,9.38-14.9,12.41,7.51,3.11,12.99,7.59,16.42,13.44,3.43,5.85,5.15,13.01,5.15,21.46v6.29c0,6.21-.87,11.58-2.6,16.1-1.73,4.52-4.3,8.24-7.7,11.16-3.4,2.93-7.7,5.08-12.9,6.45-5.2,1.37-11.31,2.06-18.32,2.06h-119.66ZM420.31,57.76h46.06c3.11,0,5.4-.65,6.88-1.95,1.48-1.3,2.22-3.21,2.22-5.74v-5.31c0-2.38-.74-4.24-2.22-5.58-1.48-1.34-3.78-2.01-6.88-2.01h-46.06v20.59ZM420.31,115.53h46.61c3.04,0,5.31-.67,6.83-2.01,1.52-1.34,2.28-3.2,2.28-5.58v-6.29c0-2.53-.76-4.44-2.28-5.74-1.52-1.3-3.79-1.95-6.83-1.95h-46.61v21.57Z" />
                      <path fill="white" d="M629.28,152.38V.64h39.13l88.77,77.93V.64h48.99v151.74h-39.34l-88.55-77.06v77.06h-48.99Z" />
                    </mask>
                  </defs>
                )}
                <g clipPath={!reduceMotion ? `url(#${nameClipId})` : undefined}>
                {/* LUBIN (accent) */}
                <g className="text-accent">
                  <path className="fill-current" d="M0,152.38V.64h52.68v106.44h86.27v45.31H0Z"/>
                  <path className="fill-current" d="M163.88.64h52.78v107.74h59.18V.64h52.78v117.82c0,14.6-3.78,24.15-11.33,28.67-7.55,4.52-17.97,6.77-31.27,6.77h-79.66c-6.58,0-12.48-.49-17.72-1.46-5.24-.98-9.68-2.75-13.33-5.31-3.65-2.56-6.47-6.16-8.45-10.78-1.99-4.62-2.98-10.58-2.98-17.88V.64Z"/>
                  <path className="fill-current" d="M367.64,152.38V.64h117.92c6.79,0,12.79.72,17.99,2.17,5.2,1.45,9.54,3.67,13.01,6.67,3.47,3,6.09,6.79,7.86,11.38,1.77,4.59,2.66,9.99,2.66,16.2v6.83c0,7.52-1.64,13.89-4.93,19.13-3.29,5.24-8.26,9.38-14.9,12.41,7.51,3.11,12.99,7.59,16.42,13.44,3.43,5.85,5.15,13.01,5.15,21.46v6.29c0,6.21-.87,11.58-2.6,16.1-1.73,4.52-4.3,8.24-7.7,11.16-3.4,2.93-7.7,5.08-12.9,6.45-5.2,1.37-11.31,2.06-18.32,2.06h-119.66ZM420.31,57.76h46.06c3.11,0,5.4-.65,6.88-1.95,1.48-1.3,2.22-3.21,2.22-5.74v-5.31c0-2.38-.74-4.24-2.22-5.58-1.48-1.34-3.78-2.01-6.88-2.01h-46.06v20.59ZM420.31,115.53h46.61c3.04,0,5.31-.67,6.83-2.01,1.52-1.34,2.28-3.2,2.28-5.58v-6.29c0-2.53-.76-4.44-2.28-5.74-1.52-1.3-3.79-1.95-6.83-1.95h-46.61v21.57Z"/>
                  <path className="fill-current" d="M629.28,152.38V.64h39.13l88.77,77.93V.64h48.99v151.74h-39.34l-88.55-77.06v77.06h-48.99Z"/>
                </g>

                {!reduceMotion && (
                  <g
                    mask={`url(#${nameClipId}-lubin-mask)`}
                    opacity={0.75}
                    style={{ mixBlendMode: 'screen' as any }}
                  >
                    <motion.rect
                      x={-320}
                      y={0}
                      width={320}
                      height={153.9}
                      fill={`url(#${nameClipId}-shine)`}
                      initial={{ x: -320, opacity: 0 }}
                      animate={{ x: 900, opacity: [0, 1, 0] }}
                      transition={{ duration: 0.75, ease: "easeInOut", delay: 0.2 }}
                    />
                  </g>
                )}

                {/* ARTUR (white, vertical) */}
                <g className="text-white">
                  <path className="fill-current" d="M595.39,152.18l-32.12-12.31v-7.74l32.12-12.36v9.66l-4.98,1.75v10.49l4.98,1.9v8.61ZM583.24,138.92v-5.31l-7.23,2.53,7.23,2.77Z"/>
                  <path className="fill-current" d="M595.39,116.6h-32.12v-18.33c0-2.02.48-3.64,1.43-4.86.96-1.22,2.9-1.84,5.84-1.84h6.77c2.26,0,3.93.42,5.01,1.25,1.08.83,1.74,2.02,1.98,3.55v.41l11.08-7.35v10.07l-10.09,6.41v2.43h10.09v8.27ZM576.79,108.34v-7.28c0-.44-.13-.78-.4-1-.27-.23-.68-.34-1.23-.34h-1.4c-.52,0-.92.11-1.2.34-.28.23-.42.56-.42,1v7.28h4.66Z"/>
                  <path className="fill-current" d="M595.39,79.56h-22.53v8.47h-9.59v-25.22h9.59v8.47h22.53v8.28Z"/>
                  <path className="fill-current" d="M563.28,59.15v-8.28h22.8v-9.29h-22.8v-8.28h24.94c3.09,0,5.11.59,6.07,1.78.96,1.19,1.43,2.82,1.43,4.91v12.5c0,1.03-.1,1.96-.31,2.78-.21.82-.58,1.52-1.12,2.09-.54.57-1.3,1.02-2.28,1.33-.98.31-2.24.47-3.79.47h-24.94Z"/>
                  <path className="fill-current" d="M595.39,27.18h-32.12V8.84c0-2.02.48-3.64,1.43-4.86.96-1.22,2.9-1.84,5.84-1.84h6.77c2.26,0,3.93.42,5.01,1.25,1.08.83,1.74,2.02,1.98,3.55v.41l11.08-7.35v10.07l-10.09,6.41v2.43h10.09v8.27ZM576.79,18.91v-7.28c0-.44-.13-.78-.4-1-.27-.23-.68-.34-1.23-.34h-1.4c-.52,0-.92.11-1.2.34-.28.23-.42.56-.42,1v7.28h4.66Z"/>
                </g>
                </g>
              </motion.svg>
            </motion.div>

            {/* Role line: keep it below the big letters (no overlap) */}
            <motion.p
              style={{ y: subheadParallax, opacity: headerOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.45 }}
              className={`pointer-events-none relative z-25 mt-[clamp(9px,1.1vw,17px)] text-base md:text-xl font-display font-semibold text-white uppercase text-center tracking-[0.28em] drop-shadow-[0_10px_28px_rgba(0,0,0,0.9)]`}
            >
              <span className="inline-flex items-center justify-center min-h-[1em] gap-1">
                <span className="inline-block text-accent tracking-[0.35em]">
                  {roleText || "\u00A0"}
                </span>
                <span className="inline-block text-white tracking-[0.28em]">
                  {t("hero.designerLabel")}
                </span>
              </span>
            </motion.p>
          </div>

          {/* Footer Info Columns - Glassmorphism Bar */}
          <div className="w-full flex justify-center relative z-40 isolate">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 18,
                delay: 0.05,
              }}
              className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-7 rounded-3xl md:rounded-full border border-white/10 bg-black/25 bg-gradient-to-r from-white/6 via-white/3 to-white/6 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.6)] relative z-10"
            >
              {/* Col 1 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.05,
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <span className="text-accent font-display text-xs">01</span>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs">
                    {t("hero.expertiseTitle")}
                  </h3>
                </div>
                <p className="text-neutral-300 font-sans text-sm md:text-base max-w-[220px] leading-relaxed">
                  {t("hero.expertiseDescription")}
                </p>
              </motion.div>

              {/* Col 2 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.16,
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <span className="text-accent font-display text-xs">02</span>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs">
                    {t("hero.specializationTitle")}
                  </h3>
                </div>
                <p className="text-neutral-300 font-sans text-sm md:text-base max-w-[280px] leading-relaxed">
                  {t("hero.specializationDescription")}
                </p>
              </motion.div>

              {/* Col 3 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.27,
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <span className="text-accent font-display text-xs">03</span>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs">
                    {t("hero.locationLabel")}
                  </h3>
                </div>
                <p className="text-neutral-300 font-sans text-sm md:text-base leading-relaxed">
                  {t("hero.location")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Brands / Clients row lives in the same hero background */}
        <div className="relative w-full pt-4 md:pt-6 pb-4 md:pb-6 z-20">
          <div className="w-full px-6 md:px-12">
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <div className="w-full max-w-6xl mx-auto mb-5 md:mb-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-70" />
              </div>

              {/* Marquee row of brands */}
              <div className="w-full max-w-6xl mx-auto overflow-hidden py-6 md:py-7 relative">
                <motion.div
                  className="flex items-center gap-x-10 md:gap-x-14"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...brands, ...brands].map((brand, index) => {
                    const isMyTour = brand.name === "MyTour";

                    return (
                      <div
                        key={`${brand.name}-${index}`}
                        className={
                          "flex-shrink-0 flex items-center justify-center " +
                          "min-w-[140px] md:min-w-[165px] lg:min-w-[180px] " +
                          (isMyTour ? " -mx-3 md:-mx-4 lg:-mx-5" : "")
                        }
                      >
                        <img
                          src={brand.src}
                          alt={brand.name}
                          loading="lazy"
                          className={
                            "h-8 md:h-9 lg:h-10 " +
                            "w-auto max-w-[150px] md:max-w-[180px] lg:max-w-[200px] " +
                            "object-contain opacity-60 " +
                            (isMyTour ? "scale-[1.15]" : "")
                          }
                        />
                      </div>
                    );
                  })}
                </motion.div>

                {/* Edge fade masks: very subtle, just to soften logo cut-off */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-black/0 via-black/40 to-black/0" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-black/0 via-black/40 to-black/0" />
              </div>
              <div className="w-full max-w-6xl mx-auto mt-5 md:mt-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
        {/* Global subtle noise texture over hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light"
          style={{
            backgroundImage: "url('/textures/noise.png')",
            backgroundSize: "auto",
          }}
        />
      </section>

    </>
  );
};
