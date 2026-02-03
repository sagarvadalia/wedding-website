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
    size: 3 + (i % 7) * 2.5,
    left: `${(i * 7.3) % 100}%`,
    delay: (i * 0.4) % 12,
    duration: 8 + (i % 8) * 2,
  }));
}

// Generate fish data - distributed throughout entire screen
function generateFish(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 12 + (i % 5) * 8,
    top: `${5 + (i * 17) % 85}%`, // Full vertical range from 5% to 90%
    direction: i % 2 === 0 ? 'left' : 'right',
    delay: (i * 1.2) % 15,
    duration: 12 + (i % 6) * 4,
    opacity: 0.15 + (i % 4) * 0.05, // Much more visible: 0.15 to 0.30
  }));
}

export function PassportPage({ children, pageNumber, className }: PassportPageProps) {
  const bubbles = useMemo(() => generateBubbles(60), []);
  const fish = useMemo(() => generateFish(16), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative min-h-screen pt-16 md:pt-16 overflow-hidden',
        className
      )}
    >
      {/* Deep ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-sky/40 via-ocean-caribbean/20 to-ocean-deep/30" />
      
      {/* Underwater light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-[600px] opacity-20"
          style={{
            background: 'linear-gradient(180deg, rgba(135,206,235,0.6) 0%, transparent 100%)',
            transform: 'rotate(-15deg)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute top-0 right-1/4 w-72 h-[500px] opacity-15"
          style={{
            background: 'linear-gradient(180deg, rgba(135,206,235,0.5) 0%, transparent 100%)',
            transform: 'rotate(10deg)',
            filter: 'blur(30px)',
          }}
        />
        <div 
          className="absolute top-0 left-1/2 w-64 h-[400px] opacity-10"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            transform: 'translateX(-50%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Animated wave layers - TOP (water surface from below) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Wave 1 - Surface ripples (brightest, like sunlight) */}
        <svg 
          className="absolute top-0 left-0 w-[200%] animate-wave-fast opacity-60 rotate-180"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '180px' }}
        >
          <path 
            fill="#B5D8E8" 
            d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
        
        {/* Top Wave 2 - Mid surface */}
        <svg 
          className="absolute top-0 left-0 w-[200%] animate-wave-medium opacity-50 rotate-180"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '150px' }}
        >
          <path 
            fill="#87CEEB" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Top Wave 3 - Deeper layer */}
        <svg 
          className="absolute top-0 left-0 w-[200%] animate-wave-slow opacity-40 rotate-180"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '120px' }}
        >
          <path 
            fill="#2E8B8B" 
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,154.7C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* BOTTOM Waves */}
        {/* Wave 1 - Back (deepest) */}
        <svg 
          className="absolute bottom-0 left-0 w-[200%] animate-wave-slow opacity-70"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '220px' }}
        >
          <path 
            fill="#1E3A5F" 
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        {/* Wave 2 - Middle */}
        <svg 
          className="absolute bottom-0 left-0 w-[200%] animate-wave-medium opacity-60"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '180px' }}
        >
          <path 
            fill="#2E8B8B" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        {/* Wave 3 - Front (lightest) */}
        <svg 
          className="absolute bottom-0 left-0 w-[200%] animate-wave-fast opacity-45"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ height: '140px' }}
        >
          <path 
            fill="#87CEEB" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Floating bubbles - more of them and more visible */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-white/60 backdrop-blur-[1px]"
            style={{
              width: bubble.size * 1.3,
              height: bubble.size * 1.3,
              left: bubble.left,
              bottom: -20,
              boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(135,206,235,0.3)',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
            animate={{
              y: [0, -1200],
              x: [0, Math.sin(bubble.id) * 50],
              opacity: [0, 0.9, 0.9, 0],
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

      {/* Subtle water caustics effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Page number */}
      {pageNumber && (
        <div className="absolute bottom-4 right-6 text-white/50 text-sm font-mono z-20">
          {pageNumber}
        </div>
      )}

      {/* Swimming fish throughout the ENTIRE background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Individual fish at all depths */}
        {fish.map((f) => (
          <motion.div
            key={f.id}
            className="absolute"
            style={{
              top: f.top,
              left: f.direction === 'right' ? '-10%' : '110%',
              opacity: f.opacity,
            }}
            animate={{
              x: f.direction === 'right' ? ['0vw', '120vw'] : ['0vw', '-120vw'],
              y: [0, Math.sin(f.id) * 30, 0, Math.sin(f.id + 1) * -20, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg 
              viewBox="0 0 60 30" 
              style={{ 
                width: f.size, 
                height: f.size / 2,
                transform: f.direction === 'right' ? 'scaleX(-1)' : 'none',
              }}
              className="text-ocean-deep"
            >
              {/* Fish facing left by default: head at left (x=0), tail at right (x=60) */}
              <path fill="currentColor" d="M0 15 Q15 5 30 15 Q15 25 0 15 M45 15 C55 15 60 10 60 10 L60 20 C60 20 55 15 45 15" />
              <circle cx="8" cy="14" r="2" fill="currentColor" opacity="0.5" />
              <path fill="currentColor" opacity="0.7" d="M15 15 Q20 8 25 15" />
            </svg>
          </motion.div>
        ))}
        
        {/* School of tiny fish - TOP area (near surface) - moving LEFT */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`school-top-${i}`}
            className="absolute"
            style={{
              top: `${8 + (i * 3) % 15}%`,
              right: '-5%',
              opacity: 0.25,
            }}
            animate={{
              x: ['0vw', '-115vw'],
              y: [0, Math.sin(i * 2) * 10, 0],
            }}
            transition={{
              duration: 18 + i * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Fish facing left: head at x=0, tail at x=30 */}
            <svg viewBox="0 0 30 15" style={{ width: 22, height: 11 }} className="text-ocean-sky">
              <path fill="currentColor" d="M0 7.5 Q7 2 15 7.5 Q7 13 0 7.5 M22 7.5 C27 7.5 30 5 30 5 L30 10 C30 10 27 7.5 22 7.5" />
            </svg>
          </motion.div>
        ))}

        {/* School of tiny fish - MIDDLE area - moving RIGHT */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`school-mid-${i}`}
            className="absolute"
            style={{
              top: `${35 + (i * 5) % 30}%`,
              left: '-5%',
              opacity: 0.22,
            }}
            animate={{
              x: ['0vw', '115vw'],
              y: [0, Math.sin(i * 2) * 15, 0],
            }}
            transition={{
              duration: 20 + i * 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Fish facing right: head at x=30, tail at x=0 */}
            <svg viewBox="0 0 30 15" style={{ width: 24, height: 12 }} className="text-ocean-caribbean">
              <path fill="currentColor" d="M30 7.5 Q23 2 15 7.5 Q23 13 30 7.5 M8 7.5 C3 7.5 0 5 0 5 L0 10 C0 10 3 7.5 8 7.5" />
            </svg>
          </motion.div>
        ))}

        {/* School of tiny fish - BOTTOM area - moving LEFT */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`school-bottom-${i}`}
            className="absolute"
            style={{
              top: `${70 + (i * 4) % 20}%`,
              right: '-5%',
              opacity: 0.18,
            }}
            animate={{
              x: ['0vw', '-115vw'],
              y: [0, Math.sin(i * 3) * 12, 0],
            }}
            transition={{
              duration: 22 + i * 3,
              delay: i * 0.8 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Fish facing left: head at x=0, tail at x=30 */}
            <svg viewBox="0 0 30 15" style={{ width: 20, height: 10 }} className="text-ocean-deep">
              <path fill="currentColor" d="M0 7.5 Q7 2 15 7.5 Q7 13 0 7.5 M22 7.5 C27 7.5 30 5 30 5 L30 10 C30 10 27 7.5 22 7.5" />
            </svg>
          </motion.div>
        ))}

        {/* Larger tropical fish near top */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`tropical-${i}`}
            className="absolute"
            style={{
              top: `${10 + i * 8}%`,
              left: i % 2 === 0 ? '-8%' : '108%',
              opacity: 0.2,
            }}
            animate={{
              x: i % 2 === 0 ? ['0vw', '116vw'] : ['0vw', '-116vw'],
              y: [0, -15, 0, 15, 0],
            }}
            transition={{
              duration: 25 + i * 3,
              delay: i * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Fish faces left by default (head left, tail right) */}
            {/* i % 2 === 0 moves RIGHT, so flip to face right */}
            {/* i % 2 === 1 moves LEFT, so keep facing left */}
            <svg 
              viewBox="0 0 50 35" 
              style={{ 
                width: 45 + i * 6, 
                height: 32 + i * 4,
                transform: i % 2 === 0 ? 'scaleX(-1)' : 'none',
              }} 
              className="text-ocean-caribbean"
            >
              {/* Tropical fish body - facing left */}
              <ellipse cx="22" cy="17" rx="18" ry="12" fill="currentColor" />
              {/* Tail on right */}
              <path fill="currentColor" d="M38 17 L50 8 L50 26 Z" />
              {/* Dorsal fin */}
              <path fill="currentColor" opacity="0.8" d="M15 5 Q22 2 28 5 L22 12 Z" />
              {/* Eye on left */}
              <circle cx="12" cy="15" r="3" fill="white" opacity="0.5" />
            </svg>
          </motion.div>
        ))}

        {/* Jellyfish throughout */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`jelly-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              bottom: '-15%',
              opacity: 0.15 + (i % 2) * 0.05,
            }}
            animate={{
              y: [0, -1200],
              x: [0, Math.sin(i * 3) * 60, 0, Math.sin(i * 2) * -40, 0],
            }}
            transition={{
              duration: 30 + i * 5,
              delay: i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 40 60" style={{ width: 35 + i * 5, height: 52 + i * 8 }} className="text-ocean-sky">
              <ellipse cx="20" cy="15" rx="18" ry="12" fill="currentColor" opacity="0.8" />
              <path d="M8 20 Q6 35 10 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M15 22 Q13 40 16 55" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M20 23 Q20 42 20 58" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M25 22 Q27 40 24 55" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M32 20 Q34 35 30 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </motion.div>
        ))}

        {/* Sea turtle near top */}
        <motion.div
          className="absolute"
          style={{
            top: '15%',
            left: '-12%',
            opacity: 0.18,
          }}
          animate={{
            x: ['0vw', '124vw'],
            y: [0, -20, 0, 20, 0],
          }}
          transition={{
            duration: 45,
            delay: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 80 50" style={{ width: 80, height: 50 }} className="text-ocean-caribbean">
            {/* Shell */}
            <ellipse cx="40" cy="28" rx="25" ry="18" fill="currentColor" />
            {/* Head */}
            <ellipse cx="68" cy="25" rx="8" ry="6" fill="currentColor" />
            {/* Flippers */}
            <ellipse cx="25" cy="15" rx="12" ry="5" fill="currentColor" transform="rotate(-30 25 15)" />
            <ellipse cx="25" cy="41" rx="12" ry="5" fill="currentColor" transform="rotate(30 25 41)" />
            <ellipse cx="55" cy="15" rx="10" ry="4" fill="currentColor" transform="rotate(20 55 15)" />
            <ellipse cx="55" cy="41" rx="10" ry="4" fill="currentColor" transform="rotate(-20 55 41)" />
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
