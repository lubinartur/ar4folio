import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useI18n } from "../services/i18n";
import SplitText from "./SplitText";

const TypingRole: React.FC<{ roles: string[]; suffix?: string }> = ({
  roles,
  suffix = "DESIGNER",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;

    const current = roles[roleIndex % roles.length];
    const full = current.toUpperCase();

    const typingSpeed = 70;      // ms per char when typing
    const deletingSpeed = 40;    // ms per char when deleting
    const pauseAfterType = 1400; // pause at full word
    const pauseAfterDelete = 350;

    let timeout: number;

    if (!isDeleting && displayText.length < full.length) {
      timeout = window.setTimeout(() => {
        setDisplayText(full.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText.length === full.length) {
      timeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterType);
    } else if (isDeleting && displayText.length > 0) {
      timeout = window.setTimeout(() => {
        setDisplayText(full.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayText.length === 0) {
      timeout = window.setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, pauseAfterDelete);
    }

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <span className="inline-flex items-center justify-center gap-[0.25em] min-h-[1em]">
      <span className="text-accent">
        {displayText || "\u00A0"}
      </span>
      <span className="text-white/90">
        {suffix}
      </span>
    </span>
  );
};

export const Hero: React.FC = () => {
  const { language, t } = useI18n();
  const { scrollY } = useScroll();
  
  const name = t("hero.name");

  const roles =
    language === "ru"
      ? ["FINTECH", "PRODUCT", "UI/UX", "GRAPHIC"]
      : ["FINTECH", "PRODUCT", "UI/UX", "GRAPHIC"];

  // Split name into first and last for separate styling (e.g., "Artur Lubin")
  const nameParts = (name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  // Adjust heading size per language (RU is slightly smaller to avoid overlap, with stronger spacing)
  const nameSizeClasses =
    language === "ru"
      ? "text-[10.5vw] md:text-[12vw]"
      : "text-[14.5vw] md:text-[15vw]";

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
  
  // Parallax effects
  // Image moves significantly slower than scroll to act as a background anchor
  const yParallax = useTransform(scrollY, [0, 500], [0, 200]); 
  const opacityParallax = useTransform(scrollY, [0, 400], [1, 0]);
  
  // Text Parallax - Positive Y creates a "slower than scroll" effect (lag)
  // Differing values create separation between layers: Subhead (Front/Fastest) -> Title (Mid) -> Image (Back/Slowest)
  const subheadParallax = useTransform(scrollY, [0, 500], [0, 80]);
  const titleParallax = useTransform(scrollY, [0, 500], [0, 150]);
  // Fade text out more slowly so the name & role stay visible longer while scrolling
  const textOpacity = useTransform(scrollY, [0, 380], [1, 0]);

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

  return (
    <>
      <section className="relative w-full bg-black overflow-hidden">
      
        {/* Background Ambience - simplified & softer to avoid flicker */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
          {/* Base dark glow - static, just gives depth */}
          <div
            className="absolute top-[-25%] left-[-25%] w-[150vw] h-[150vw] bg-[#050505] rounded-full blur-[160px]"
          />

          {/* Slow moving shadow blob */}
          <motion.div
            animate={{
              x: ["-6%", "4%", "-6%"],
              y: ["-4%", "3%", "-4%"],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] right-[-15%] w-[90vw] h-[90vw] bg-[#070707] rounded-full blur-[170px] opacity-80"
          />

          {/* Warm accent glow - very subtle breathing */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.10, 0.22, 0.10],
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
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            {/* Image Container with Fade Mask */}
            <div className="relative w-full max-w-2xl h-[70vh] md:h-[85vh] mt-0 md:mt-[-5vh]">
               <img 
                 src="/images/hero-artur.png"
                 alt="Artur Lubin"
                 className="w-full h-full object-contain object-top opacity-80 md:opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
               />
            </div>
          </motion.div>

          {/* Text Container */}
          <div className="relative z-20 w-full flex flex-col items-center mt-16 md:mt-24 mb-8 md:mb-10">
            
            {/* Massive Typography - First name (white) + last name (accent) */}
            <motion.div 
              style={{ y: titleParallaxWithTilt, x: nameTiltXSpring, opacity: textOpacity }}
              className="flex items-baseline justify-center gap-[0.18em]"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
                const relY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

                // Small, premium-feel offsets
                nameTiltX.set(relX * 30); // horizontal sway
                nameTiltY.set(relY * 18); // vertical sway
              }}
              onMouseLeave={() => {
                nameTiltX.set(0);
                nameTiltY.set(0);
              }}
            >
              {/* First name: clean white */}
              <SplitText
                text={firstName}
                tag="h1"
                className={`${nameSizeClasses} leading-[0.85] font-display font-bold text-white tracking-[-0.01em] text-center whitespace-nowrap drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)]`}
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />

              {/* Last name: accent color, same animation */}
              {lastName && (
                <SplitText
                  text={lastName}
                  tag="h1"
                  className={`${nameSizeClasses} leading-[0.85] font-display font-bold text-accent tracking-[-0.01em] text-center whitespace-nowrap drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)]`}
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
            <motion.p
              style={{ y: subheadParallax, opacity: textOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.45 }}
              className={`${
                language === "ru" ? "mt-6 md:mt-8" : "mt-4 md:mt-5"
              } text-[12px] md:text-sm font-display font-semibold text-white tracking-[0.28em] uppercase text-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.75)]`}
            >
              <TypingRole roles={roles} suffix="DESIGNER" />
            </motion.p>
          </div>

          {/* Footer Info Columns - Glassmorphism Bar */}
          <div className="w-full flex justify-center relative z-20">
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
              className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-7 rounded-3xl md:rounded-full border border-white/10 bg-gradient-to-r from-white/5 via-white/2 to-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.6)]"
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
                    duration: 40,
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
      </section>

    </>
  );
};
