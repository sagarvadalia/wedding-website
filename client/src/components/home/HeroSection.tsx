import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroPhoto {
  src: string;
  alt: string;
  /**
   * CSS object-position for desktop — controls which part of the photo
   * stays visible when cropped.
   *
   * Format: 'X Y' where
   *   X = horizontal (left / center / right / 0%-100%)
   *   Y = vertical   (top  / center / bottom / 0%-100%)
   *
   * Example: '60% 20%' = show the area 60% from left edge, 20% from top.
   * Default: 'center'
   */
  objectPosition?: string;
  /** Same as objectPosition but applied on mobile (<768px) where
   *  the crop is usually very different due to portrait orientation. */
  mobileObjectPosition?: string;
}

interface HeroSectionProps {
  /** Photo to display as the full-bleed background */
  photo: HeroPhoto;
  /** ID of the element to smooth-scroll to when the chevron is clicked */
  scrollTargetId: string;
  /** Whether the page has a fixed navbar above — subtracts its height from the section */
  hasNavbar?: boolean;
  /** Content to overlay on the hero (headings, countdowns, etc.) */
  children: ReactNode;
}

export function HeroSection({
  photo,
  scrollTargetId,
  hasNavbar = false,
  children,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Image gently zooms in as user scrolls — cinematic Ken-Burns feel */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  /* Content fades out and drifts before the section exits the viewport */
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const handleScrollDown = () => {
    document
      .getElementById(scrollTargetId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasImage = !!photo.src;

  return (
    <section
      ref={sectionRef}
      className='relative overflow-hidden h-dvh'
      style={{ zIndex: 15 }}
    >
      {/* Background image with scroll-linked zoom */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: imageScale }}
      >
        {hasImage ? (
          <img
            src={photo.src}
            alt={photo.alt}
            className="hero-img h-full w-full object-cover"
            style={
              {
                '--hero-obj-pos-mobile':
                  photo.mobileObjectPosition ?? photo.objectPosition ?? 'center',
                '--hero-obj-pos-desktop': photo.objectPosition ?? 'center',
              } as React.CSSProperties
            }
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-ocean-deep via-ocean-caribbean to-ocean-sky" />
        )}
      </motion.div>

      {/* Dark gradient overlay for text legibility */}
      <div className="hero-overlay absolute inset-0" />

      {/* Centered content — fades and drifts as user scrolls */}
      <motion.div
        className="relative flex h-full flex-col items-center justify-center px-4 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {children}
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-white/80 transition-colors hover:text-white"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-8 w-8 md:h-10 md:w-10" />
        </motion.div>
      </motion.button>
    </section>
  );
}
