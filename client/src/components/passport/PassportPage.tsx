import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface PassportPageProps {
  children: React.ReactNode;
  pageNumber?: number;
  className?: string;
}

// Generate stable bubble data
function generateBubbles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 4 + (i % 6) * 2,
    left: `${(i * 7.3) % 100}%`,
    delay: (i * 0.4) % 12,
    duration: 10 + (i % 8) * 3,
  }));
}

// Generate fish data - distributed throughout entire screen
function generateFish(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 24 + (i % 4) * 10, // Minimum 24px for clarity
    top: `${8 + (i * 17) % 75}%`,
    direction: i % 2 === 0 ? 'left' : 'right',
    delay: (i * 1) % 20,
    duration: 18 + (i % 6) * 5,
    opacity: 0.12 + (i % 4) * 0.04,
  }));
}

// Generate floating particles (plankton/sediment)
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + (i % 3),
    left: `${(i * 13.7) % 100}%`,
    top: `${(i * 11.3) % 100}%`,
    delay: (i * 0.8) % 15,
    duration: 20 + (i % 10) * 4,
  }));
}

// Generate kelp strands
function generateKelp(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${5 + i * 18}%`,
    height: 120 + (i % 3) * 40,
    delay: i * 0.5,
    swayAmount: 8 + (i % 3) * 4,
  }));
}

export function PassportPage({ children, pageNumber, className }: PassportPageProps) {
  const bubbles = useMemo(() => generateBubbles(40), []);
  const fish = useMemo(() => generateFish(12), []);
  const particles = useMemo(() => generateParticles(20), []);
  const kelp = useMemo(() => generateKelp(5), []);

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
      {/* Deep ocean gradient background - enhanced depth (visible immediately on page load) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(135, 206, 235, 0.35) 0%,
            rgba(46, 139, 139, 0.25) 25%,
            rgba(30, 58, 95, 0.35) 60%,
            rgba(15, 35, 60, 0.45) 100%
          )`,
        }}
      />
      
      {/* Enhanced underwater light rays (god rays) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ray 1 - Left side */}
        <motion.div 
          className="absolute top-0 w-[300px] h-[700px]"
          style={{
            left: '10%',
            background: 'linear-gradient(180deg, rgba(135,206,235,0.5) 0%, rgba(135,206,235,0.1) 60%, transparent 100%)',
            transform: 'rotate(-20deg)',
            transformOrigin: 'top center',
            filter: 'blur(30px)',
          }}
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Ray 2 - Left-center */}
        <motion.div 
          className="absolute top-0 w-[250px] h-[600px]"
          style={{
            left: '25%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(135,206,235,0.15) 50%, transparent 100%)',
            transform: 'rotate(-10deg)',
            transformOrigin: 'top center',
            filter: 'blur(25px)',
          }}
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Ray 3 - Center */}
        <motion.div 
          className="absolute top-0 w-[280px] h-[650px]"
          style={{
            left: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(135,206,235,0.12) 55%, transparent 100%)',
            transform: 'rotate(5deg)',
            transformOrigin: 'top center',
            filter: 'blur(28px)',
          }}
          animate={{ opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 4.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Ray 4 - Right-center */}
        <motion.div 
          className="absolute top-0 w-[220px] h-[550px]"
          style={{
            left: '62%',
            background: 'linear-gradient(180deg, rgba(135,206,235,0.45) 0%, rgba(135,206,235,0.1) 60%, transparent 100%)',
            transform: 'rotate(15deg)',
            transformOrigin: 'top center',
            filter: 'blur(22px)',
          }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5.5, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Ray 5 - Right side */}
        <motion.div 
          className="absolute top-0 w-[260px] h-[580px]"
          style={{
            left: '78%',
            background: 'linear-gradient(180deg, rgba(135,206,235,0.4) 0%, rgba(46,139,139,0.1) 55%, transparent 100%)',
            transform: 'rotate(22deg)',
            transformOrigin: 'top center',
            filter: 'blur(26px)',
          }}
          animate={{ opacity: [0.14, 0.24, 0.14] }}
          transition={{ duration: 4.8, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Water surface shimmer effect at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(135,206,235,0.1) 50%, transparent 100%)',
        }}
      />

      {/* Floating bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.left,
              bottom: -20,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
              boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.4), 0 0 6px rgba(135,206,235,0.2)',
            }}
            animate={{
              y: [0, -1100],
              x: [0, Math.sin(bubble.id) * 30, 0],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Floating particles (plankton/sediment) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full bg-white/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -50, 0, 30, 0],
              x: [0, 20, 0, -15, 0],
              opacity: [0.2, 0.4, 0.3, 0.4, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Subtle water caustics effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
        }}
        animate={{ opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Kelp/Seaweed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: '200px' }}>
        {kelp.map((strand) => (
          <motion.div
            key={`kelp-${strand.id}`}
            className="absolute bottom-0"
            style={{ left: strand.left }}
            animate={{
              skewX: [-strand.swayAmount, strand.swayAmount, -strand.swayAmount],
            }}
            transition={{
              duration: 4 + strand.delay,
              delay: strand.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg 
              viewBox="0 0 20 100" 
              style={{ width: 16, height: strand.height }}
              className="text-ocean-caribbean"
            >
              <path 
                d="M10 100 Q5 80 10 60 Q15 40 10 20 Q8 10 10 0" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none"
                opacity="0.4"
                strokeLinecap="round"
              />
              {/* Kelp leaves */}
              <ellipse cx="6" cy="30" rx="5" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-20 6 30)" />
              <ellipse cx="14" cy="50" rx="5" ry="8" fill="currentColor" opacity="0.3" transform="rotate(20 14 50)" />
              <ellipse cx="7" cy="70" rx="4" ry="6" fill="currentColor" opacity="0.25" transform="rotate(-15 7 70)" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Ocean floor gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(15,35,60,0.5) 0%, rgba(30,58,95,0.2) 50%, transparent 100%)',
        }}
      />

      {/* Content - fades in after sea life background is already visible */}
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

      {/* Swimming fish throughout the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Individual fish at various depths */}
        {fish.map((f) => (
          <motion.div
            key={f.id}
            className="absolute"
            style={{
              top: f.top,
              left: f.direction === 'right' ? '-8%' : '108%',
              opacity: f.opacity,
            }}
            animate={{
              x: f.direction === 'right' ? ['0vw', '116vw'] : ['0vw', '-116vw'],
              y: [0, Math.sin(f.id) * 25, 0, Math.sin(f.id + 1) * -20, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Improved fish SVG with cubic beziers - single continuous path */}
            <svg 
              viewBox="0 0 40 20"
              style={{ 
                width: f.size, 
                height: f.size / 2,
                transform: f.direction === 'right' ? 'scaleX(-1)' : 'none',
              }}
              className="text-ocean-deep"
            >
              {/* Fish body + tail as connected path */}
              <path 
                fill="currentColor" 
                d="M4 10 C8 4, 18 4, 24 10 C18 16, 8 16, 4 10 M24 10 L34 4 L34 16 Z"
              />
              {/* Eye */}
              <circle cx="10" cy="9" r="1.5" fill="currentColor" opacity="0.4" />
              {/* Dorsal fin */}
              <path fill="currentColor" opacity="0.6" d="M14 4 Q17 2 20 4 L17 8 Z" />
            </svg>
          </motion.div>
        ))}
        
        {/* School of small fish - TOP area - moving LEFT */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`school-top-${i}`}
            className="absolute"
            style={{
              top: `${10 + (i * 4) % 15}%`,
              right: '-6%',
              opacity: 0.18,
            }}
            animate={{
              x: ['0vw', '-112vw'],
              y: [0, Math.sin(i * 2) * 12, 0],
            }}
            transition={{
              duration: 22 + i * 3,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Small fish facing left */}
            <svg viewBox="0 0 24 12" style={{ width: 20, height: 10 }} className="text-ocean-sky">
              <path fill="currentColor" d="M2 6 C4 2, 10 2, 14 6 C10 10, 4 10, 2 6 M14 6 L20 2 L20 10 Z" />
            </svg>
          </motion.div>
        ))}

        {/* School of small fish - MIDDLE area - moving RIGHT */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`school-mid-${i}`}
            className="absolute"
            style={{
              top: `${38 + (i * 5) % 25}%`,
              left: '-6%',
              opacity: 0.16,
            }}
            animate={{
              x: ['0vw', '112vw'],
              y: [0, Math.sin(i * 2) * 15, 0],
            }}
            transition={{
              duration: 24 + i * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Small fish facing right */}
            <svg viewBox="0 0 24 12" style={{ width: 22, height: 11 }} className="text-ocean-caribbean">
              <path fill="currentColor" d="M22 6 C20 2, 14 2, 10 6 C14 10, 20 10, 22 6 M10 6 L4 2 L4 10 Z" />
            </svg>
          </motion.div>
        ))}

        {/* School of small fish - BOTTOM area - moving LEFT */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`school-bottom-${i}`}
            className="absolute"
            style={{
              top: `${68 + (i * 5) % 18}%`,
              right: '-6%',
              opacity: 0.14,
            }}
            animate={{
              x: ['0vw', '-112vw'],
              y: [0, Math.sin(i * 3) * 10, 0],
            }}
            transition={{
              duration: 26 + i * 3,
              delay: i * 1.2 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Small fish facing left */}
            <svg viewBox="0 0 24 12" style={{ width: 18, height: 9 }} className="text-ocean-deep">
              <path fill="currentColor" d="M2 6 C4 2, 10 2, 14 6 C10 10, 4 10, 2 6 M14 6 L20 2 L20 10 Z" />
            </svg>
          </motion.div>
        ))}

        {/* Larger tropical fish */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`tropical-${i}`}
            className="absolute"
            style={{
              top: `${15 + i * 25}%`,
              left: i % 2 === 0 ? '-10%' : '110%',
              opacity: 0.15,
            }}
            animate={{
              x: i % 2 === 0 ? ['0vw', '120vw'] : ['0vw', '-120vw'],
              y: [0, -20, 0, 20, 0],
            }}
            transition={{
              duration: 30 + i * 5,
              delay: i * 6,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg 
              viewBox="0 0 50 30"
              style={{ 
                width: 50 + i * 8, 
                height: 30 + i * 5,
                transform: i % 2 === 0 ? 'scaleX(-1)' : 'none',
              }} 
              className="text-ocean-caribbean"
            >
              {/* Tropical fish - elegant curves */}
              <path 
                fill="currentColor" 
                d="M6 15 C12 6, 28 6, 36 15 C28 24, 12 24, 6 15 M36 15 L48 6 L48 24 Z"
              />
              {/* Top fin */}
              <path fill="currentColor" opacity="0.7" d="M18 6 Q24 2 30 6 L24 12 Z" />
              {/* Bottom fin */}
              <path fill="currentColor" opacity="0.6" d="M20 24 Q24 28 28 24 L24 18 Z" />
              {/* Eye */}
              <circle cx="14" cy="14" r="2.5" fill="white" opacity="0.4" />
              <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.3" />
            </svg>
          </motion.div>
        ))}

        {/* Jellyfish */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`jelly-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 22}%`,
              bottom: '-12%',
              opacity: 0.12 + (i % 2) * 0.04,
            }}
            animate={{
              y: [0, -1100],
              x: [0, Math.sin(i * 3) * 50, 0, Math.sin(i * 2) * -35, 0],
            }}
            transition={{
              duration: 35 + i * 6,
              delay: i * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 40 60" style={{ width: 32 + i * 4, height: 48 + i * 6 }} className="text-ocean-sky">
              {/* Dome */}
              <ellipse cx="20" cy="14" rx="16" ry="12" fill="currentColor" opacity="0.7" />
              {/* Inner dome highlight */}
              <ellipse cx="20" cy="12" rx="10" ry="7" fill="currentColor" opacity="0.3" />
              {/* Tentacles with curves */}
              <path d="M8 22 Q4 35 10 52" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
              <path d="M14 24 Q10 40 15 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
              <path d="M20 25 Q20 42 20 57" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
              <path d="M26 24 Q30 40 25 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
              <path d="M32 22 Q36 35 30 52" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        ))}

        {/* Sea turtle */}
        <motion.div
          className="absolute"
          style={{
            top: '20%',
            left: '-12%',
            opacity: 0.14,
          }}
          animate={{
            x: ['0vw', '124vw'],
            y: [0, -25, 0, 25, 0],
          }}
          transition={{
            duration: 50,
            delay: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 70 45" style={{ width: 70, height: 45 }} className="text-ocean-caribbean">
            {/* Shell with pattern */}
            <ellipse cx="32" cy="24" rx="22" ry="16" fill="currentColor" />
            <ellipse cx="32" cy="24" rx="15" ry="10" fill="currentColor" opacity="0.6" />
            {/* Head */}
            <ellipse cx="58" cy="22" rx="7" ry="5" fill="currentColor" />
            {/* Flippers - natural angles */}
            <ellipse cx="18" cy="12" rx="10" ry="4" fill="currentColor" transform="rotate(-35 18 12)" />
            <ellipse cx="18" cy="36" rx="10" ry="4" fill="currentColor" transform="rotate(35 18 36)" />
            <ellipse cx="46" cy="14" rx="8" ry="3" fill="currentColor" transform="rotate(25 46 14)" />
            <ellipse cx="46" cy="34" rx="8" ry="3" fill="currentColor" transform="rotate(-25 46 34)" />
            {/* Tail */}
            <path d="M10 24 L4 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.div>
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
