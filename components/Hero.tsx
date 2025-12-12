import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useI18n } from "../services/i18n";
import SplitText from "./SplitText";

const ROLE_KEYS = ["hero.roles.fintech", "hero.roles.product", "hero.roles.uiux", "hero.roles.graphic"];


export const Hero: React.FC = () => {
  const { language, t } = useI18n();
  const { scrollY } = useScroll();
  
  const name = t("hero.name");


  // Split name into first and last for separate styling (e.g., "Artur Lubin")
  const nameParts = (name || "").split(" ");
  const firstName = (nameParts[0] || "").toUpperCase();
  const lastName = nameParts.slice(1).join(" ").toUpperCase();

  // Adjust heading size per language for first and last name separately
  const firstNameClasses =
    language === "ru"
      ? "text-[6vw] md:text-[5vw]"
      : "text-[6.5vw] md:text-[5vw]";

  const lastNameClasses =
    language === "ru"
      ? "text-[24vw] md:text-[18vw]"
      : "text-[26vw] md:text-[18vw]";

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

  // Cursor-reactive motion for the main name (subtle tilt/shift)
  const nameTiltX = useMotionValue(0);
  const nameTiltY = useMotionValue(0);

  const nameTiltXSpring = useSpring(nameTiltX, {
    stiffness: 120,
    damping: 18,
    mass: 0.3,
  });

  const nameTiltYSpring = useSpring(nameTiltY, {
    stiffness: 120,
    damping: 22,
    mass: 0.35,
  });

  // Combine scroll parallax with cursor tilt on Y
  const titleParallaxWithTilt = useTransform(
    [titleParallax, nameTiltYSpring],
    ([base, tilt]) => base + tilt
  );
  // Highlight sweep for name - reacts to tilt X
  const nameHighlightX = useTransform(nameTiltXSpring, [-30, 30], ["-14%", "14%"]);

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
            <div className="relative w-full max-w-2xl h-[70vh] md:h-[85vh] mt-0 md:mt-[-5vh]">
              <img 
                src="/images/hero-artur.png"
                alt="Artur Lubin"
                className="w-full h-full object-contain object-top opacity-80 md:opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
              />
            </div>
          </motion.div>

          {/* Text Container */}
          <div className="relative w-full flex flex-col items-center mt-16 md:mt-24 mb-8 md:mb-10">
            
            {/* Massive Typography - Last name as main foreground layer */}
            <div className="relative w-full">
              {/* Last name (front layer) */}
              <motion.div
                style={{ y: titleParallaxWithTilt, x: nameTiltXSpring, opacity: headerOpacity }}
                className="relative z-30 flex justify-center md:justify-center"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
                  const relY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
                  nameTiltX.set(relX * 30);
                  nameTiltY.set(relY * 18);
                }}
                onMouseLeave={() => {
                  nameTiltX.set(0);
                  nameTiltY.set(0);
                }}
              >
                {lastName && (
                  <SplitText
                    text={lastName}
                    tag="h1"
                    className={`${lastNameClasses} leading-[0.8] font-science font-extrabold text-accent tracking-[-0.04em] text-center whitespace-nowrap drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)] md:inline-block md:align-baseline`}
                    delay={120}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                )}
              </motion.div>

              {/* First name aligned with last name, slightly above, acts as a second layer */}
              <motion.div
                style={{ y: titleParallaxWithTilt, x: nameTiltXSpring, opacity: headerOpacity }}
                className="pointer-events-none absolute left-[7%] md:left-[9%] -top-[5vw] md:-top-[4vw] z-10"
              >
                {firstName && (
                  <SplitText
                    text={firstName}
                    tag="h1"
                    className={`${firstNameClasses} leading-[0.9] font-science font-extrabold text-white/85 tracking-[-0.03em] text-left whitespace-nowrap drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)]`}
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                  />
                )}
              </motion.div>
            </div>
            <motion.p
              style={{ y: subheadParallax, opacity: headerOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.45 }}
              className={`pointer-events-none relative z-25 ${
                language === "ru" ? "mt-6 md:mt-8" : "mt-4 md:mt-5"
              } text-base md:text-xl font-display font-semibold text-white uppercase text-center tracking-[0.28em] drop-shadow-[0_10px_28px_rgba(0,0,0,0.9)]`}
            >
              <span className="inline-flex items-center justify-center min-h-[1em] gap-2">
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
