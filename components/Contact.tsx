import React, { useRef, useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useI18n } from '../services/i18n';

export const Contact: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [20, -15]);
  const formY = useTransform(scrollYProgress, [0, 1], [15, -10]);
  
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothTitleOpacity = useSpring(titleOpacity, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });
  const smoothFormY = useSpring(formY, { stiffness: 100, damping: 30 });

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("contact.formErrors.nameRequired") || "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t("contact.formErrors.emailRequired") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.formErrors.emailInvalid") || "Invalid email address";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t("contact.formErrors.messageRequired") || "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:${SOCIAL_LINKS.email}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ message: t("contact.formErrors.submitError") || "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

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
              className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-12 leading-[0.9]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const title = t("contact.heroTitle");
                // Разбиваем текст на части для цветовой палитры
                // "Let's work on something meaningful."
                const match = title.match(/^(.+?)(something)(.+?)(meaningful\.?)$/i);
                
                if (match) {
                  const [, beforeSomething, something, between, meaningful] = match;
                  return (
                    <span className="block">
                      {/* Первая часть - белый */}
                      <span className="text-white">{beforeSomething}</span>
                      {/* "something" - градиент от светло-серого к темно-серому */}
                      <span className="bg-gradient-to-r from-[#C0C0C0] via-[#A0A0A0] to-[#606060] text-transparent bg-clip-text">
                        {something}
                      </span>
                      {/* Между словами - белый */}
                      <span className="text-white">{between}</span>
                      {/* "meaningful." - оранжевый цвет */}
                      <span className="text-accent">{meaningful}</span>
                    </span>
                  );
                }
                
                // Fallback - если паттерн не совпал, используем оригинальный градиент
                return (
                  <span className="bg-gradient-to-b from-white via-neutral-400 to-accent text-transparent bg-clip-text">
                    {title}
                  </span>
                );
              })()}
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
          
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            style={{ y: smoothFormY }}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1], 
              delay: 0.2
            }}
            className="max-w-2xl mx-auto"
          >
            <div className="space-y-6 mb-8">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-accent focus:ring-accent/50'
                  }`}
                  placeholder={t("contact.formNamePlaceholder") || "Your name"}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-accent focus:ring-accent/50'
                  }`}
                  placeholder={t("contact.formEmailPlaceholder") || "your.email@example.com"}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-accent focus:ring-accent/50'
                  }`}
                  placeholder={t("contact.formMessagePlaceholder") || "Tell me about your project..."}
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-accent text-sm">
                    {t("contact.formSuccess") || "Thank you! Your email client will open with your message."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-accent text-black px-12 py-6 rounded-full text-lg font-bold font-display uppercase tracking-wider relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <span className="relative z-10">
                {isSubmitting ? (t("contact.formSubmitting") || "Sending...") : (t("contact.formSubmit") || "Send Message")}
              </span>
              <motion.div
                className="relative z-10"
                animate={isSubmitting ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0, ease: "linear" }}
              >
                {isSubmitting ? (
                  <Send className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Alternative: Direct email link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-500 text-sm mb-3">or</p>
              <motion.a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-accent transition-colors text-sm"
                whileHover={{ x: 4 }}
              >
                <Mail className="w-4 h-4" />
                {SOCIAL_LINKS.email}
              </motion.a>
            </div>
          </motion.form>
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
