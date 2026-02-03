import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportCover } from '@/components/passport/PassportCover';
import { Button } from '@/components/ui/button';
import { StampCollection } from '@/components/passport/VisaStamp';
import { Calendar, MapPin, Heart } from 'lucide-react';

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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Passport Cover */}
              <PassportCover
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
              />
              
              {/* Subtitle below passport */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-ocean-deep/70 text-center"
              >
                You're invited to our destination wedding
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl"
            >
              {/* Welcome content */}
              <div className="bg-sand-pearl/90 backdrop-blur-sm rounded-2xl shadow-passport p-8 md:p-12">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <p className="text-ocean-caribbean text-sm uppercase tracking-[0.3em] mb-2">
                    You are cordially invited to
                  </p>
                  <h1 className="text-4xl md:text-6xl font-heading text-ocean-deep mb-4">
                    Sagar & Grace
                  </h1>
                  <p className="text-xl md:text-2xl text-sand-dark font-light">
                    are getting married!
                  </p>
                </motion.div>

                {/* Decorative divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-[2px] w-48 mx-auto mb-8"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                  }}
                />

                {/* Event details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gold" />
                    <span className="text-ocean-deep">April 2-5, 2027</span>
                  </div>
                  <div className="hidden md:block w-2 h-2 rounded-full bg-gold" />
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gold" />
                    <span className="text-ocean-deep">Cancun, Mexico</span>
                  </div>
                </motion.div>

                {/* Resort name */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-sand-dark mb-10"
                >
                  Dreams Playa Mujeres Golf & Spa Resort
                </motion.p>

                {/* Stamp collection preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-10"
                >
                  <p className="text-center text-sm text-sand-dark mb-6 uppercase tracking-widest">
                    Collect all your stamps
                  </p>
                  <StampCollection />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Button
                    size="lg"
                    variant="gold"
                    onClick={() => navigate('/rsvp')}
                    className="w-full sm:w-auto"
                  >
                    RSVP Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/our-story')}
                    className="w-full sm:w-auto"
                  >
                    Our Story
                  </Button>
                </motion.div>

                {/* Heart decoration */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center mt-10"
                >
                  <Heart className="w-6 h-6 text-coral fill-coral" />
                </motion.div>
              </div>

              {/* Click to go back hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-4 text-ocean-deep/50 text-sm"
              >
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:text-ocean-deep transition-colors"
                >
                  ← Return to passport cover
                </button>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
