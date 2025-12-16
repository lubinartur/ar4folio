import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SOCIAL_LINKS } from '../constants';
import { X, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../services/i18n';

interface ContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

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
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[720px] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                {isSubmitted ? (
                  /* Success Screen */
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
                    >
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">
                      {t("contact.formSuccess") || "Thank you!"}
                    </h3>
                    <p className="text-neutral-400">
                      {t("contact.formHelperText") || "I usually reply within 1–2 business days."}
                    </p>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <input
                          ref={firstInputRef}
                          type="text"
                          id="modal-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          style={{ backgroundColor: '#0a0a0a' }}
                          className={`w-full px-5 py-4 border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 ${
                            errors.name 
                              ? 'border-red-500/50 focus:border-red-500/70' 
                              : 'border-white/10 bg-[#0a0a0a] focus:border-accent/50 hover:border-white/20'
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
                          id="modal-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ backgroundColor: '#0a0a0a' }}
                          className={`w-full px-5 py-4 border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 ${
                            errors.email 
                              ? 'border-red-500/50 focus:border-red-500/70' 
                              : 'border-white/10 bg-[#0a0a0a] focus:border-accent/50 hover:border-white/20'
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
                      <label className="block text-sm font-medium text-neutral-300 mb-3 font-sans">
                        {t("contact.step1Label")}
                      </label>
                      <div className="space-y-2">
                        {projectTypeOptions.map((option) => (
                          <motion.label
                            key={option.value}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            style={formData.projectType === option.value ? {
                              background: 'linear-gradient(to bottom right, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05))'
                            } : { backgroundColor: '#0a0a0a' }}
                            className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                              formData.projectType === option.value
                                ? 'border-accent/60 shadow-[0_0_20px_rgba(255,107,53,0.15)]'
                                : 'border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-[#111]'
                            } ${errors.projectType ? 'border-red-500/50' : ''}`}
                          >
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
                      <label className="block text-sm font-medium text-neutral-300 mb-3 font-sans">
                        {t("contact.step2Label")}
                      </label>
                      <div className="space-y-2">
                        {projectStageOptions.map((option) => (
                          <motion.label
                            key={option.value}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            style={formData.projectStage === option.value ? {
                              background: 'linear-gradient(to bottom right, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05))'
                            } : { backgroundColor: '#0a0a0a' }}
                            className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                              formData.projectStage === option.value
                                ? 'border-accent/60 shadow-[0_0_20px_rgba(255,107,53,0.15)]'
                                : 'border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-[#111]'
                            } ${errors.projectStage ? 'border-red-500/50' : ''}`}
                          >
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
                      <label className="block text-sm font-medium text-neutral-300 mb-3 font-sans">
                        {t("contact.step3Label")}
                      </label>
                      <textarea
                        id="modal-description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={6}
                        style={{ backgroundColor: '#0a0a0a' }}
                        className={`w-full px-5 py-4 border rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-all duration-300 resize-none leading-relaxed ${
                          errors.description 
                            ? 'border-red-500/50 focus:border-red-500/70' 
                            : 'border-white/10 bg-[#0a0a0a] focus:border-accent/50 hover:border-white/20'
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
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-3 font-sans">
                          {t("contact.optionalBudgetLabel")} <span className="text-neutral-600 text-xs font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          id="modal-budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          style={{ backgroundColor: '#0a0a0a' }}
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent/50 hover:border-white/20 transition-all duration-300 bg-[#0a0a0a]"
                          placeholder="e.g., €10k–€50k"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-3 font-sans">
                          {t("contact.optionalTimelineLabel")} <span className="text-neutral-600 text-xs font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          id="modal-timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          style={{ backgroundColor: '#0a0a0a' }}
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent/50 hover:border-white/20 transition-all duration-300 bg-[#0a0a0a]"
                          placeholder="e.g., Q2 2025"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center gap-3 bg-accent text-black px-8 py-4 rounded-2xl text-base font-semibold font-display relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
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
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
