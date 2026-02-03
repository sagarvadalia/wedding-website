import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PassportPageProps {
  children: React.ReactNode;
  pageNumber?: number;
  className?: string;
}

export function PassportPage({ children, pageNumber, className }: PassportPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative min-h-screen bg-sand-pearl',
        className
      )}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'soft-light',
        }}
      />

      {/* Page binding shadow on left */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Page number */}
      {pageNumber && (
        <div className="absolute bottom-4 right-6 text-sand-dark/50 text-sm font-mono">
          {pageNumber}
        </div>
      )}

      {/* Decorative corner stamps - optional watermarks */}
      <div className="absolute top-4 right-4 w-16 h-16 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-ocean-deep">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="monospace">
            S&G
          </text>
        </svg>
      </div>
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
