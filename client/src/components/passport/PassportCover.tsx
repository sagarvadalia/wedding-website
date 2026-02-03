import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PassportCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  className?: string;
}

export function PassportCover({ isOpen, onOpen, className }: PassportCoverProps) {
  return (
    <div className={cn('relative perspective-1000', className)}>
      {/* Passport Book */}
      <motion.div
        className="relative cursor-pointer transform-style-3d"
        onClick={onOpen}
        initial={false}
        animate={{
          rotateY: isOpen ? -180 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Cover */}
        <div
          className="relative w-[340px] h-[480px] md:w-[400px] md:h-[560px] rounded-r-lg shadow-passport"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, #1E3A5F 0%, #152C47 50%, #1E3A5F 100%)',
          }}
        >
          {/* Leather Texture Overlay */}
          <div 
            className="absolute inset-0 rounded-r-lg opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Gold Emblem */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
              />
              {/* Inner decorative circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* Heart symbol */}
              <path
                d="M50 75 C50 75, 25 55, 25 40 C25 30, 35 25, 50 35 C65 25, 75 30, 75 40 C75 55, 50 75, 50 75Z"
                fill="url(#goldGradient)"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8960C" />
                  <stop offset="25%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#E6C65C" />
                  <stop offset="75%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8960C" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title Text */}
          <div className="absolute top-44 md:top-52 left-1/2 -translate-x-1/2 text-center">
            <h1 
              className="text-2xl md:text-3xl tracking-[0.3em] font-light mb-2"
              style={{
                background: 'linear-gradient(90deg, #B8960C 0%, #D4AF37 25%, #E6C65C 50%, #D4AF37 75%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              PASSPORT
            </h1>
            <div 
              className="w-32 md:w-40 h-[1px] mx-auto"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              }}
            />
          </div>

          {/* Names */}
          <div className="absolute top-64 md:top-80 left-1/2 -translate-x-1/2 text-center">
            <p 
              className="text-lg md:text-xl font-heading tracking-wide"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E6C65C, #D4AF37)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Sagar & Grace
            </p>
          </div>

          {/* Destination */}
          <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs md:text-sm text-gold/70 tracking-widest uppercase mb-1">
              Destination
            </p>
            <p 
              className="text-sm md:text-base font-medium tracking-wide"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E6C65C, #D4AF37)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Cancun, Mexico
            </p>
          </div>

          {/* Date */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p 
              className="text-xs md:text-sm tracking-[0.2em]"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E6C65C, #D4AF37)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              APRIL 2-5, 2027
            </p>
          </div>

          {/* Click hint */}
          <motion.div
            className="absolute bottom-2 right-4 text-gold/50 text-xs"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Click to open →
          </motion.div>

          {/* Spine shadow */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-8"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.3), transparent)',
              borderRadius: '0 0 0 8px',
            }}
          />
        </div>

        {/* Back of cover (visible when flipped) */}
        <div
          className="absolute inset-0 w-[340px] h-[480px] md:w-[400px] md:h-[560px] rounded-l-lg paper-texture"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Page texture */}
          <div className="absolute inset-0 rounded-l-lg bg-sand-pearl" />
        </div>
      </motion.div>
    </div>
  );
}
