import React, { useEffect, useState, useRef } from 'react';
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
  // Initialize with proper check to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


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
    ([base, fade]: number[]) => Math.min(base, fade)
  );

  // Cursor-reactive motion for the name mark
  const lastTiltX = useMotionValue(0);
  const lastTiltY = useMotionValue(0);
  const nameContainerRef = useRef<HTMLDivElement>(null);

  // LAST name = slightly stronger + snappier
  const lastTiltXSpring = useSpring(lastTiltX, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  const lastTiltYSpring = useSpring(lastTiltY, {
    stiffness: 80,
    damping: 32,
    mass: 0.55,
  });

  // Mouse move handler for name - using global mouse tracking
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nameContainerRef.current) return;
      
      const rect = nameContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within reasonable distance of the name
      const distanceX = Math.abs(mouseX - centerX);
      const distanceY = Math.abs(mouseY - centerY);
      const maxDistance = Math.max(rect.width, rect.height) * 1.5;
      
      if (distanceX > maxDistance || distanceY > maxDistance) {
        // Mouse is far away, reset to center
        lastTiltX.set(0);
        lastTiltY.set(0);
        return;
      }
      
      // Calculate offset from center (normalized to -1 to 1)
      const offsetX = (mouseX - centerX) / (rect.width / 2);
      const offsetY = (mouseY - centerY) / (rect.height / 2);
      
      // Apply tilt with max range (adjust multiplier for intensity)
      const maxTilt = 6; // pixels - very subtle effect
      lastTiltX.set(offsetX * maxTilt);
      lastTiltY.set(offsetY * maxTilt);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Combine scroll parallax with cursor tilt on Y (separate per layer)
  const titleParallaxWithLastTilt = useTransform(
    [titleParallax, lastTiltYSpring],
    ([base, tilt]: number[]) => base + tilt
  );

  return (
    <>
      <section className="relative w-full bg-black overflow-hidden">
      
        {/* Background Ambience - simplified & softer to avoid flicker */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
          {/* Base dark glow - static, just gives depth */}
          <div
            className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-[#020202] rounded-full blur-[120px]"
          />

          {/* Warm accent glow - light breathing (GPU-friendly) */}
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={reduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[18%] left-[18%] w-[55vw] h-[55vw] bg-accent rounded-full blur-[170px] will-change-transform"
          />

          {/* Vertical light streak - static (cheap) */}
          <div
            className="absolute top-[12%] right-[30%] w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-white/8 to-transparent blur-[1px] opacity-70"
          />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 min-h-0 md:min-h-screen flex flex-col items-center justify-start md:justify-end pb-6 md:pb-16 lg:pb-20">
          

          {/* Central Hero Image */}
          <motion.div 
            style={isMobile ? { opacity: 1 } : { y: yParallax, opacity: opacityParallax }}
            className="absolute inset-0 z-5 md:z-15 flex items-start md:items-center justify-center pointer-events-none"
          >
            {/* Image Container with Fade Mask and light sweep */}
            <div className="relative w-full max-w-2xl h-[50vh] md:h-[85vh] mt-10 md:mt-[-5vh] -translate-y-0 md:-translate-y-6 translate-x-0 md:translate-x-0 md:translate-y-0">
              <img 
                src="/images/hero-artur.png"
                alt="Artur Lubin"
                loading={isMobile ? "eager" : "lazy"}
                className="w-full h-full object-contain object-center md:object-top opacity-95 md:opacity-90 [mask-image:none] md:[mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
              />
            </div>
          </motion.div>

          {/* Text Container */}
          <div className="relative w-full flex flex-col items-center mt-[27vh] md:mt-24 lg:mt-28 mb-0 z-20">

            {/*
              IMPORTANT:
              - The name axis must be stable across all screens.
              - Do NOT center using max-width containers (it shifts on ultrawide).
              - Use a shared left padding that is based on the viewport.
            */}

            <motion.div
              ref={nameContainerRef}
              style={isMobile ? {
                opacity: 1,
                y: 0,
                x: 0
              } : {
                y: titleParallaxWithLastTilt,
                x: lastTiltXSpring,
                opacity: headerOpacity,
              }}
              className="scale-[0.85] md:scale-[0.92] lg:scale-[0.88] origin-center transform-gpu select-none relative z-30"
              initial={isMobile ? { 
                opacity: 0, 
                y: 20
              } : { 
                opacity: 0, 
                y: 30,
                scale: 0.85,
                filter: "blur(20px)"
              }}
              animate={isMobile ? { 
                opacity: 1, 
                y: 0
              } : { 
                opacity: 1, 
                y: 0,
                scale: 1,
                filter: "blur(0px)"
              }}
              transition={isMobile ? { 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1]
              } : { 
                duration: 1.2, 
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.8, delay: 0.3 },
                y: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 1.0, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                filter: { duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <motion.img
                src="/lubin-artur.svg"
                alt={name}
                draggable={false}
                className="h-auto w-[var(--hero-name-w)] [--hero-name-w:clamp(280px,38vw,480px)] md:[--hero-name-w:clamp(260px,32vw,480px)] min-[1700px]:[--hero-name-w:clamp(480px,60vw,1600px)] [filter:saturate(1.25)_brightness(1.08)] drop-shadow-[0_18px_46px_rgba(234,80,39,0.35)]"
                initial={isMobile ? {
                  opacity: 0,
                  y: 15
                } : {
                  clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                  x: -80,
                  scale: 0.7,
                  opacity: 0,
                }}
                animate={isMobile ? {
                  opacity: 1,
                  y: 0
                } : {
                  clipPath: [
                    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                    "polygon(0% 0%, 15% 0%, 15% 100%, 0% 100%)",
                    "polygon(0% 0%, 35% 0%, 35% 100%, 0% 100%)",
                    "polygon(0% 0%, 55% 0%, 55% 100%, 0% 100%)",
                    "polygon(0% 0%, 75% 0%, 75% 100%, 0% 100%)",
                    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  ],
                  x: 0,
                  scale: 1,
                  opacity: 1,
                }}
                transition={isMobile ? {
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                } : {
                  clipPath: {
                    duration: 1.2,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    times: [0, 0.15, 0.35, 0.55, 0.75, 1],
                  },
                  x: {
                    duration: 1.0,
                    delay: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                  scale: {
                    duration: 1.0,
                    delay: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                  opacity: {
                    duration: 0.6,
                    delay: 0.4,
                    ease: "easeOut",
                  },
                }}
                style={isMobile ? { 
                  display: 'block',
                  visibility: 'visible'
                } : {}}
              />
            </motion.div>

            {/* Role line: keep it below the big letters (no overlap) */}
            <motion.p
              style={isMobile ? { opacity: 1, y: 0 } : { y: subheadParallax, opacity: headerOpacity }}
              initial={{ opacity: 0, y: isMobile ? 10 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={isMobile ? { delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { delay: 0.9, duration: 0.45 }}
              className={`pointer-events-none relative z-25
                mt-2 md:mt-4 lg:mt-5
                mb-2 md:mb-4 lg:mb-5
                text-base md:text-base lg:text-lg font-display font-semibold text-white/90 uppercase
                text-center tracking-[0.28em] leading-relaxed
                drop-shadow-[0_10px_28px_rgba(0,0,0,0.9)]`}
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
          <div className="w-full flex justify-center relative z-40 isolate mt-6 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 15 : 20 }}
              animate={isMobile ? { opacity: 1, y: 0 } : undefined}
              whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
              viewport={isMobile ? undefined : { once: true, amount: 0.35 }}
              transition={isMobile ? {
                duration: 0.7,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1]
              } : {
                type: "spring",
                stiffness: 140,
                damping: 18,
                delay: 0.05,
              }}
              className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 px-4 md:px-10 lg:px-12 py-3 md:py-5 lg:py-5 rounded-3xl md:rounded-full border border-white/10 bg-black/25 bg-gradient-to-r from-white/6 via-white/3 to-white/6 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.6)] relative z-10"
            >
              {/* Col 1 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1 relative group"
                initial={{ opacity: 0, y: isMobile ? 10 : 22 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.45 }}
                transition={isMobile ? {
                  duration: 0.6,
                  delay: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                } : {
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.05,
                }}
                whileHover={isMobile ? undefined : { y: -4, scale: 1.02 }}
                whileTap={isMobile ? undefined : { scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <span className="text-accent font-display text-base md:text-lg font-semibold">{`{ }`}</span>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs md:text-sm">
                    {t("hero.expertiseTitle")}
                  </h3>
                </div>
                <p className="text-neutral-400 font-sans text-sm md:text-base max-w-[280px] leading-relaxed">
                  {t("hero.expertiseDescription")}
                </p>
                <p className="text-accent/70 font-sans text-xs md:text-sm max-w-[280px] leading-relaxed mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  {t("hero.expertiseHover")}
                </p>
              </motion.div>

              {/* Col 2 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1 relative group"
                initial={{ opacity: 0, y: isMobile ? 10 : 22 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.45 }}
                transition={isMobile ? {
                  duration: 0.6,
                  delay: 0.75,
                  ease: [0.22, 1, 0.36, 1]
                } : {
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.16,
                }}
                whileHover={isMobile ? undefined : { y: -4, scale: 1.02 }}
                whileTap={isMobile ? undefined : { scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <span className="text-accent font-display text-base md:text-lg font-semibold">9+</span>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs md:text-sm">
                    {t("hero.specializationTitle")}
                  </h3>
                </div>
                <p className="text-neutral-400 font-sans text-sm md:text-base max-w-[280px] leading-relaxed">
                  {t("hero.specializationDescription")}
                </p>
                <p className="text-accent/70 font-sans text-xs md:text-sm max-w-[280px] leading-relaxed mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  {t("hero.specializationHover")}
                </p>
              </motion.div>

              {/* Col 3 */}
              <motion.div
                className="flex flex-col items-center text-center space-y-1 relative group"
                initial={{ opacity: 0, y: isMobile ? 10 : 22 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.45 }}
                transition={isMobile ? {
                  duration: 0.6,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                } : {
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.27,
                }}
                whileHover={isMobile ? undefined : { y: -4, scale: 1.02 }}
                whileTap={isMobile ? undefined : { scale: 0.99 }}
              >
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 1L3 14h8v9l10-13h-8V1z"/>
                  </svg>
                  <h3 className="text-white font-display uppercase tracking-widest text-xs md:text-sm">
                    {t("hero.locationLabel")}
                  </h3>
                </div>
                <p className="text-neutral-400 font-sans text-sm md:text-base max-w-[280px] leading-relaxed">
                  {t("hero.location")}
                </p>
                <p className="text-accent/70 font-sans text-xs md:text-sm max-w-[280px] leading-relaxed mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  {t("hero.locationHover")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Brands / Clients row lives in the same hero background */}
        <div className="relative w-full pt-2 md:pt-10 lg:pt-12 pb-2 md:pb-10 lg:pb-12 z-20">
          <div className="w-full px-6 md:px-12">
            <div className="flex flex-col items-center gap-2 md:gap-8 lg:gap-10">
              <div className="w-full max-w-6xl mx-auto mb-2 md:mb-8 lg:mb-10">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-70" />
              </div>

              {/* Marquee row of brands */}
              <div className="w-full max-w-6xl mx-auto overflow-hidden py-3 md:py-7 relative">
                <motion.div
                  className="flex items-center gap-x-10 md:gap-x-14 will-change-transform"
                  animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
                  transition={reduceMotion ? {} : {
                    duration: isMobile ? 6 : 10,
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
              <div className="w-full max-w-6xl mx-auto mt-2 md:mt-8 lg:mt-10">
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
