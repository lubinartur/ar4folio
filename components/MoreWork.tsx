import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../services/i18n';
import { MORE_WORK } from '../constants';
import { Media } from './Media';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// Compact secondary work grid: same card language as the featured projects, smaller footprint.
export const MoreWork: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="more-work" className="pb-20 md:pb-32 bg-[#050505] relative z-20">
      <div className="container mx-auto px-6">
        <div className="mb-8 md:mb-12 pb-6 md:pb-8 border-b border-white/5">
          <span className="text-sm font-sans text-accent tracking-[0.2em] uppercase block mb-3">
            {t('moreWork.kicker')}
          </span>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            {t('moreWork.title')}
          </h3>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl">{t('moreWork.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {MORE_WORK.map((item, i) => {
            const base = `moreWork.items.${item.key}`;
            const inner = (
              <>
                <div className="relative w-full overflow-hidden rounded-3xl bg-[#111] border border-white/5 group-hover:border-accent/30 transition-colors duration-300 mb-6">
                  <div className="absolute inset-0 z-10 pointer-events-none bg-transparent md:bg-black/40 md:group-hover:bg-transparent transition-colors duration-700" />
                  <Media
                    src={item.image}
                    alt={t(`${base}.title`)}
                    aspect="16/10"
                    className="rounded-3xl"
                    imgClassName="opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-all duration-700 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[11px] uppercase tracking-wider border border-white/10 text-neutral-400 font-medium rounded-full group-hover:border-accent/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h4 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-accent transition-colors duration-300">
                  {t(`${base}.title`)}
                </h4>
                <p className="text-base text-white/60 mb-3 group-hover:text-white transition-colors duration-300">
                  {t(`${base}.role`)}
                </p>
                <p className="text-neutral-400 leading-relaxed text-base mb-4 line-clamp-3 group-hover:text-neutral-300 transition-colors duration-300">
                  {t(`${base}.description`)}
                </p>

                <div className="mt-auto pt-1">
                {item.href ? (
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white group-hover:text-accent transition-colors">
                    {t('moreWork.visitSite')}
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                    {t('moreWork.inDevelopment')}
                  </span>
                )}
                </div>
              </>
            );

            const cls = 'group flex flex-col items-start h-full';
            return (
              <motion.article
                key={item.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-10%' }}
                className="h-full"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} cursor-none`}
                    aria-label={`${t(`${base}.title`)} (${t('moreWork.opensInNewTab')})`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
