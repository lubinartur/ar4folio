import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { TESTIMONIALS, SOCIAL_LINKS } from '../constants';

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// Recommendations from LinkedIn. Quotes stay in their original language on purpose.
export const Testimonials: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="testimonials" className="py-16 md:py-28 bg-[#050505] relative z-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-10 md:mb-14 pb-6 md:pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-sm font-sans text-accent tracking-[0.2em] uppercase block mb-3">
              {t('testimonials.kicker')}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              {t('testimonials.title')}
            </h2>
            <p className="text-neutral-400 text-base md:text-lg max-w-2xl">{t('testimonials.subtitle')}</p>
          </div>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors cursor-none self-start md:self-auto"
          >
            {t('testimonials.cta')}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <motion.figure
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-8%' }}
              className="group break-inside-avoid mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 hover:border-accent/30 transition-colors duration-300"
            >
              <Quote className="w-7 h-7 text-accent/80 mb-5" aria-hidden="true" />
              <blockquote
                className={`text-neutral-300 leading-relaxed group-hover:text-white transition-colors duration-300 ${
                  item.featured ? 'text-lg md:text-xl' : 'text-base'
                }`}
              >
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent font-display font-bold text-sm"
                  aria-hidden="true"
                >
                  {initials(item.name)}
                </span>
                <span className="block">
                  <span className="block text-white font-display font-bold">{item.name}</span>
                  <span className="block text-sm text-neutral-500">{item.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
