import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

interface NextPageCTAProps {
  nextPath: string;
  nextLabel: string;
  teaser: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function NextPageCTA({ nextPath, nextLabel, teaser }: NextPageCTAProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="pt-16 pb-8"
    >
      {/* Wave divider */}
      <motion.div variants={item} className="flex justify-center mb-8">
        <svg
          viewBox="0 0 1440 100"
          className="w-48 md:w-72 h-6"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="3"
            strokeOpacity="0.5"
          />
          <path
            d="M0,60 C300,20 600,80 900,40 C1100,55 1300,60 1440,50"
            fill="none"
            stroke="var(--color-sand-pearl)"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="text-center">
        <motion.div variants={item}>
          <Compass className="w-8 h-8 mx-auto mb-3 text-gold" />
        </motion.div>

        <motion.p
          variants={item}
          className="text-lg md:text-xl font-heading text-sand-pearl mb-2"
        >
          Continue Your Journey
        </motion.p>

        <motion.p
          variants={item}
          className="text-sand-pearl/70 text-sm md:text-base mb-6"
        >
          {teaser}
        </motion.p>

        <motion.div variants={item}>
          <Link
            to={nextPath}
            className={cn(
              buttonVariants({ variant: 'gold', size: 'lg' }),
              'group gap-2'
            )}
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
