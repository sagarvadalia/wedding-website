import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OceanBackground } from '@/components/layout/OceanBackground';

interface PassportPageProps {
  children: React.ReactNode;
  pageNumber?: number;
  className?: string;
}

export function PassportPage({ children, pageNumber, className }: PassportPageProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative min-h-screen pt-16 md:pt-16 overflow-hidden',
        className
      )}
    >
      <OceanBackground variant="deep" />

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Page number */}
      {pageNumber && (
        <div className="absolute bottom-4 right-6 text-white/50 text-sm font-mono z-20">
          {pageNumber}
        </div>
      )}
    </motion.div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn('text-center py-12 md:py-16', className)}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl lg:text-6xl font-heading text-ocean-deep mb-4"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-sand-dark max-w-2xl mx-auto px-4"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 h-[2px] w-24 md:w-32 mx-auto"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
        }}
      />
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn('px-4 md:px-8 lg:px-16 py-8 md:py-12', className)}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
}
