import React, { useRef, useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Mail, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useI18n } from '../services/i18n';

export const Contact: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    projectType: '',
    projectStage: '',
    description: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    projectType?: string;
    projectStage?: string;
    description?: string;
  }>({});

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
    const newErrors: { 
      name?: string; 
      email?: string; 
      projectType?: string;
      projectStage?: string;
      description?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("contact.formErrors.nameRequired") || "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t("contact.formErrors.emailRequired") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.formErrors.emailInvalid") || "Invalid email address";
    }
    
    if (!formData.projectType) {
      newErrors.projectType = t("contact.formErrors.projectTypeRequired") || "Please select a project type";
    }
    
    if (!formData.projectStage) {
      newErrors.projectStage = t("contact.formErrors.projectStageRequired") || "Please select a project stage";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t("contact.formErrors.descriptionRequired") || "Please describe your project";
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
      // Build structured message
      const messageParts = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        ``,
        `Project Type: ${t(`contact.step1Options.${formData.projectType}`)}`,
        `Project Stage: ${t(`contact.step2Options.${formData.projectStage}`)}`,
        ``,
        `Description:`,
        formData.description,
      ];

      if (formData.budget) {
        messageParts.push(``, `Budget: ${formData.budget}`);
      }

      if (formData.timeline) {
        messageParts.push(`Timeline: ${formData.timeline}`);
      }

      const body = encodeURIComponent(messageParts.join('\n'));
      const subject = encodeURIComponent(`Project inquiry: ${t(`contact.step1Options.${formData.projectType}`)}`);
      const mailtoLink = `mailto:${SOCIAL_LINKS.email}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setIsSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        projectType: '',
        projectStage: '',
        description: '',
        budget: '',
        timeline: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ description: t("contact.formErrors.submitError") || "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const projectTypeOptions = [
    { value: 'productUx', key: 'productUx' },
    { value: 'fintechLending', key: 'fintechLending' },
    { value: 'uxAudit', key: 'uxAudit' },
    { value: 'newIdea', key: 'newIdea' },
    { value: 'notSure', key: 'notSure' }
  ];

  const projectStageOptions = [
    { value: 'idea', key: 'idea' },
    { value: 'inProgress', key: 'inProgress' },
    { value: 'redesign', key: 'redesign' },
    { value: 'scaling', key: 'scaling' }
  ];

  return (
    <footer 
      ref={sectionRef}
      id="contact" 
      className="relative bg-black pt-40 pb-12 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-32">
          {/* Header */}
          <motion.div
            style={{ y: smoothTitleY, opacity: smoothTitleOpacity }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {t("contact.heroTitle")}
            </motion.h2>
            
            <motion.p
              style={{ y: smoothSubtitleY }}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-lg md:text-xl text-neutral-400 font-light font-sans"
            >
              {t("contact.subtitle")}
            </motion.p>
          </motion.div>
          
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
            className="space-y-8"
          >
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-[#0a0a0a] border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 ${
                    errors.name 
                      ? 'border-red-500/50 focus:border-red-500/70' 
                      : 'border-white/10 focus:border-accent/50 hover:border-white/20'
                  }`}
                  placeholder={t("contact.formNamePlaceholder") || "Your name"}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-[#0a0a0a] border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-500/50 focus:border-red-500/70' 
                      : 'border-white/10 focus:border-accent/50 hover:border-white/20'
                  }`}
                  placeholder={t("contact.formEmailPlaceholder") || "your.email@example.com"}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Step 1: Project Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-4 font-sans">
                {t("contact.step1Label")}
              </label>
              <div className="space-y-3">
                {projectTypeOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      formData.projectType === option.value
                        ? 'border-accent/60 bg-gradient-to-br from-accent/10 to-accent/5 shadow-[0_0_20px_rgba(255,107,53,0.15)]'
                        : 'border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-[#111]'
                    } ${errors.projectType ? 'border-red-500/50' : ''}`}
                  >
                    {/* Custom radio button */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        formData.projectType === option.value
                          ? 'border-accent bg-accent'
                          : 'border-white/30 bg-transparent group-hover:border-white/50'
                      }`}>
                        {formData.projectType === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-black" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="projectType"
                      value={option.value}
                      checked={formData.projectType === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-sans transition-colors duration-300 ${
                      formData.projectType === option.value
                        ? 'text-white'
                        : 'text-neutral-300 group-hover:text-white'
                    }`}>
                      {t(`contact.step1Options.${option.key}`)}
                    </span>
                  </motion.label>
                ))}
              </div>
              {errors.projectType && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {errors.projectType}
                </motion.p>
              )}
            </div>

            {/* Step 2: Project Stage */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-4 font-sans">
                {t("contact.step2Label")}
              </label>
              <div className="space-y-3">
                {projectStageOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      formData.projectStage === option.value
                        ? 'border-accent/60 bg-gradient-to-br from-accent/10 to-accent/5 shadow-[0_0_20px_rgba(255,107,53,0.15)]'
                        : 'border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-[#111]'
                    } ${errors.projectStage ? 'border-red-500/50' : ''}`}
                  >
                    {/* Custom radio button */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        formData.projectStage === option.value
                          ? 'border-accent bg-accent'
                          : 'border-white/30 bg-transparent group-hover:border-white/50'
                      }`}>
                        {formData.projectStage === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-black" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="projectStage"
                      value={option.value}
                      checked={formData.projectStage === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-sans transition-colors duration-300 ${
                      formData.projectStage === option.value
                        ? 'text-white'
                        : 'text-neutral-300 group-hover:text-white'
                    }`}>
                      {t(`contact.step2Options.${option.key}`)}
                    </span>
                  </motion.label>
                ))}
              </div>
              {errors.projectStage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {errors.projectStage}
                </motion.p>
              )}
            </div>

            {/* Step 3: Project Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-4 font-sans">
                {t("contact.step3Label")}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-5 py-4 bg-[#0a0a0a] border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 resize-none leading-relaxed ${
                  errors.description 
                    ? 'border-red-500/50 focus:border-red-500/70' 
                    : 'border-white/10 focus:border-accent/50 hover:border-white/20'
                }`}
                placeholder={t("contact.step3Placeholder") || "What problem are you trying to solve?\nWhat constraints should I know about (regulation, tech, timing)?\nWhat would success look like for you?"}
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {errors.description}
                </motion.p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-3 font-sans">
                  {t("contact.optionalBudgetLabel")} <span className="text-neutral-600 text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent/50 hover:border-white/20 transition-all duration-300"
                  placeholder="e.g., €10k–€50k"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-3 font-sans">
                  {t("contact.optionalTimelineLabel")} <span className="text-neutral-600 text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent/50 hover:border-white/20 transition-all duration-300"
                  placeholder="e.g., Q2 2025"
                />
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-accent text-sm">
                    {t("contact.formSuccess") || "Thank you! Your email client will open with your message."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Section */}
            <div className="space-y-4 pt-8">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-accent text-black px-8 py-4 rounded-2xl text-base font-semibold font-display relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
              >
                <span className="relative z-10">
                  {isSubmitting ? (t("contact.formSubmitting") || "Sending...") : (t("contact.formSubmit") || "Send message")}
                </span>
                <motion.div
                  className="relative z-10"
                  animate={isSubmitting ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0, ease: "linear" }}
                >
                  {isSubmitting ? (
                    <Send className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </motion.div>
              </motion.button>

              <p className="text-sm text-neutral-500 font-sans">
                {t("contact.formHelperText") || "I usually reply within 1–2 business days."}
              </p>
            </div>

            {/* Alternative: Direct email link */}
            <div className="pt-4 border-t border-white/5 text-center">
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
