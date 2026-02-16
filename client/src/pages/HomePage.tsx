import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportCover } from '@/components/passport/PassportCover';
import { PassportPolaroid } from '@/components/passport/PassportPolaroid';
import { Button } from '@/components/ui/button';
import { StampCollection } from '@/components/passport/VisaStamp';
import { FEATURED_PHOTOS, HERO_PHOTO, PASSPORT_SPREAD_PHOTO } from '@/lib/constants';
import { WeddingCountdown } from '@/components/layout/WeddingCountdown';
import { Calendar, MapPin } from 'lucide-react';
import { OceanBackground } from '@/components/layout/OceanBackground';
import { HeroSection } from '@/components/home/HeroSection';

const PASSPORT_SECTION_ID = 'passport-section';

export function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const availablePhotos = FEATURED_PHOTOS.slice(2, 6).filter(p => p.src);

  return (
    <div className="relative">
      {/* ── Section 1: Full-viewport hero photo ── */}
      <HeroSection photo={HERO_PHOTO} scrollTargetId={PASSPORT_SECTION_ID}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-heading text-4xl text-white drop-shadow-lg md:text-6xl lg:text-7xl"
        >
          Sagar &amp; Grace
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-4 h-[2px] w-24 md:w-32"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg font-light text-white/90 drop-shadow-md md:text-xl lg:text-2xl"
        >
          April 2–5, 2027 · Cancun, Mexico
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6"
        >
          <WeddingCountdown variant="heroOverlay" className="drop-shadow-md" />
        </motion.div>
      </HeroSection>

      {/* ── Section 2: Passport ── */}
      <div id={PASSPORT_SECTION_ID} className="relative min-h-screen overflow-hidden">
        <OceanBackground variant="surface" />
        {/* Wave decoration at bottom (layered over ocean background) */}
        <div className="fixed bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none" style={{ zIndex: 6 }}>
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

        {/* Passport content — when invite open, overflow hidden so only the card scrolls */}
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
              {/* Center: passport */}
              <div className="flex flex-col items-center shrink-0">
                <PassportCover
                  isOpen={isOpen}
                  onOpen={() => setIsOpen(true)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl flex flex-col md:flex-row items-stretch shadow-2xl rounded-lg overflow-hidden my-6 md:my-8 border border-gold/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Left page — photo with scattered stamps ── */}
              <div className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-[80vh] max-h-[85vh] overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-r-none">
                {/* Full-bleed background image */}
                <img
                  src={PASSPORT_SPREAD_PHOTO.src}
                  alt={PASSPORT_SPREAD_PHOTO.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: PASSPORT_SPREAD_PHOTO.objectPosition }}
                />
                {/* Dark overlay for stamp contrast */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Stamps overlay — semi-arch along the top */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="absolute inset-x-0 top-0 z-10 px-2 pt-2 md:pt-4"
                >
                  <StampCollection topArch stampSize="sm" />
                </motion.div>

                {/* Page number */}
                <p className="absolute bottom-2 right-3 z-10 font-accent text-xs text-white/50">pg. 1</p>
              </div>

              {/* ── Book spine ── */}
              <div
                className="w-full h-3 md:h-full md:w-3 shrink-0 md:min-h-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.15) 100%)',
                }}
              />

              {/* ── Right page — invitation ── */}
              <div
                className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-[80vh] max-h-[85vh] overflow-y-auto paper-texture p-5 md:p-8 flex flex-col items-center justify-center rounded-b-lg md:rounded-r-lg md:rounded-l-none"
                style={{ boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.05)' }}
              >
                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/30" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/30" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/30" />

                <div className="text-center flex flex-col items-center justify-center flex-1 py-6">
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
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="h-[2px] w-32 md:w-40 mb-6"
                    style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gold" />
                      <span className="text-ocean-deep text-base md:text-lg font-medium">April 2&#x2013;5, 2027</span>
                    </div>
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gold" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gold" />
                      <span className="text-ocean-deep text-base md:text-lg font-medium">Cancun, Mexico</span>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-accent text-sm text-sand-dark/70 tracking-wider mb-8"
                  >
                    Dreams Playa Mujeres Golf &amp; Spa Resort
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                  >
                    <Button variant="gold" size="lg" onClick={() => navigate('/rsvp')} className="w-full sm:w-auto">
                      RSVP Now
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/our-story')} className="w-full sm:w-auto">
                      Our Story
                    </Button>
                  </motion.div>

                  {availablePhotos.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                      className="mt-8"
                    >
                      <div className="grid grid-cols-2 gap-3 justify-items-center">
                        {availablePhotos.map((photo, i) => (
                          <PassportPolaroid
                            key={photo.alt}
                            src={photo.src}
                            alt={photo.alt}
                            size="sm"
                            rotate={[-3, 2, 3, -2][i]}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                      className="mt-8 flex items-center gap-3"
                    >
                      <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                      <span className="text-gold/50 text-lg">{'\u2665'}</span>
                      <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
                    </motion.div>
                  )}
                </div>

                <p className="text-right w-full font-accent text-xs text-gold/50">pg. 2</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
