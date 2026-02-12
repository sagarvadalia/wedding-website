import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportCover } from '@/components/passport/PassportCover';
import { PassportPolaroid } from '@/components/passport/PassportPolaroid';
import { Button } from '@/components/ui/button';
import { StampCollection } from '@/components/passport/VisaStamp';
import { FEATURED_PHOTOS } from '@/lib/constants';
import { Calendar, MapPin } from 'lucide-react';

/** Rotations for the 4 polaroids (closed state): left-top, left-bottom, right-top, right-bottom */
const CLOSED_POLAROID_ROTATIONS = [4, -3, -4, 3];

// Generate stable particle data
interface Particle {
  width: number;
  height: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    width: Math.random() * 20 + 5,
    height: Math.random() * 20 + 5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));
}

export function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Memoize particles to avoid regeneration on re-render
  const particles = useMemo(() => generateParticles(20), []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated ocean background */}
      <div className="fixed inset-0 bg-gradient-to-b from-ocean-mist via-ocean-light to-ocean-sky" />
      
      {/* Floating particles/bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Wave decoration at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z"
            fill="#1E3A5F"
            animate={{
              d: [
                "M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z",
                "M0,60 C360,20 720,80 1080,40 C1260,55 1380,60 1440,60 L1440,100 L0,100 Z",
                "M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* Content - when invite open, overflow hidden so only the card scrolls */}
      <div
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-8 md:py-8 ${isOpen ? 'overflow-hidden' : ''}`}
        onClick={isOpen ? () => setIsOpen(false) : undefined}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-5xl"
            >
              {/* Mobile: passport + subtitle + countdown first */}
              {/* Desktop: left polaroids column */}
              <div className="hidden md:flex flex-col justify-between items-center gap-4 py-4 min-h-[400px]">
                <PassportPolaroid
                  src={FEATURED_PHOTOS[0]?.src ?? ''}
                  alt={FEATURED_PHOTOS[0]?.alt ?? ''}
                  size="md"
                  rotate={CLOSED_POLAROID_ROTATIONS[0]}
                />
                <PassportPolaroid
                  src={FEATURED_PHOTOS[1]?.src ?? ''}
                  alt={FEATURED_PHOTOS[1]?.alt ?? ''}
                  size="md"
                  rotate={CLOSED_POLAROID_ROTATIONS[1]}
                />
              </div>
              {/* Center: passport + subtitle + countdown */}
              <div className="flex flex-col items-center shrink-0">
                <PassportCover
                  isOpen={isOpen}
                  onOpen={() => setIsOpen(true)}
                />
               
                
              </div>
              {/* Desktop: right polaroids column */}
              <div className="hidden md:flex flex-col justify-between items-center gap-4 py-4 min-h-[400px]">
                <PassportPolaroid
                  src={FEATURED_PHOTOS[2]?.src ?? ''}
                  alt={FEATURED_PHOTOS[2]?.alt ?? ''}
                  size="md"
                  rotate={CLOSED_POLAROID_ROTATIONS[2]}
                />
                <PassportPolaroid
                  src={FEATURED_PHOTOS[3]?.src ?? ''}
                  alt={FEATURED_PHOTOS[3]?.alt ?? ''}
                  size="md"
                  rotate={CLOSED_POLAROID_ROTATIONS[3]}
                />
              </div>
              {/* Mobile: 2x2 polaroid grid below passport */}
              <div className="grid grid-cols-2 gap-3 md:hidden justify-items-center w-full max-w-sm">
                {[0, 1, 2, 3].map((i) => (
                  <PassportPolaroid
                    key={i}
                    src={FEATURED_PHOTOS[i]?.src ?? ''}
                    alt={FEATURED_PHOTOS[i]?.alt ?? ''}
                    size="sm"
                    rotate={CLOSED_POLAROID_ROTATIONS[i]}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl flex flex-col md:flex-row items-stretch shadow-2xl rounded-lg overflow-hidden my-6 md:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left page (passport-style) */}
              <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-[80vh] max-h-[85vh] overflow-y-auto paper-texture bg-sand-pearl p-4 md:p-6 flex flex-col rounded-t-lg md:rounded-l-lg md:rounded-r-none border border-b-0 md:border-b md:border-r-0 border-sand-driftwood/20">
                {/* Passport photo slot (compact to avoid scroll) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center mb-3"
                >
                  <div className="w-28 h-36 md:w-32 md:h-40 border-2 border-ocean-deep/30 overflow-hidden bg-sand-warm/30">
                    {FEATURED_PHOTOS[0]?.src ? (
                      <img
                        src={FEATURED_PHOTOS[0].src}
                        alt={FEATURED_PHOTOS[0].alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-caribbean flex items-center justify-center">
                        <span className="text-white/60 text-xs">Photo</span>
                      </div>
                    )}
                  </div>
                </motion.div>
                <p className="text-center text-[10px] md:text-xs text-sand-dark/70 uppercase tracking-widest mb-2">Type: P · Destination: Mexico</p>
                {/* Visa stamps */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-center text-xs text-sand-dark mb-2 uppercase tracking-widest">Collect all your stamps</p>
                  <div className="scale-[0.65] origin-center md:scale-75">
                    <StampCollection twoRows />
                  </div>
                </motion.div>
              </div>

              {/* Book spine (desktop) / divider (mobile) */}
              <div
                className="w-full h-2 md:h-full md:w-2 flex-shrink-0 md:min-h-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 100%)',
                }}
              />

              {/* Right page (invite + CTAs) */}
              <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-[80vh] max-h-[85vh] overflow-y-auto paper-texture bg-sand-pearl p-4 md:p-6 flex flex-col rounded-b-lg md:rounded-r-lg md:rounded-l-none border border-t-0 md:border-t md:border-l-0 border-sand-driftwood/20">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-3"
                >
                  <h1 className="text-2xl md:text-4xl font-heading text-ocean-deep mb-1">
                    Sagar & Grace
                  </h1>
                  <p className="text-lg md:text-xl text-sand-dark font-light">
                    are getting married!
                  </p>
                  <p className="text-sand-dark/90 text-sm mt-1 italic">
                    We can't wait to celebrate with you!
                  </p>
                 
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-[2px] w-32 mx-auto mb-3"
                  style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="text-ocean-deep text-sm">April 2-5, 2027</span>
                  </div>
                  <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gold" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-ocean-deep text-sm">Cancun, Mexico</span>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-sand-dark text-sm mb-4"
                >
                  Dreams Playa Mujeres Golf & Spa Resort
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4"
                >
                  <Button variant="gold" onClick={() => navigate('/rsvp')} className="w-full sm:w-auto">
                    RSVP Now
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/our-story')} className="w-full sm:w-auto">
                    Our Story
                  </Button>
                </motion.div>
                {/* Polaroids on right page (2x2 grid, larger to fill page) */}
                <div className="grid grid-cols-2 gap-3 justify-items-center mt-4">
                  {FEATURED_PHOTOS.slice(2, 6).map((photo, i) => (
                    <PassportPolaroid
                      key={i}
                      src={photo.src}
                      alt={photo.alt}
                      size="md"
                      rotate={[-3, 2, 3, -2][i]}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
