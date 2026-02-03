import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { EventType } from '@/types';

// Generate a stable random-ish rotation based on a seed string
function seededRotation(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return -5 + (Math.abs(hash) % 10);
}

interface VisaStampProps {
  event: EventType;
  date: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const stampConfigs: Record<EventType, {
  title: string;
  icon: JSX.Element;
  color: string;
  borderStyle: 'circle' | 'rectangle' | 'oval';
}> = {
  welcome: {
    title: 'WELCOME DINNER',
    color: '#2E8B8B',
    borderStyle: 'circle',
    icon: (
      <g>
        {/* Palm tree */}
        <path d="M50 70 L50 45" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M50 45 Q35 35 25 40" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 45 Q65 35 75 40" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 45 Q40 30 30 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 45 Q60 30 70 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 45 Q50 25 50 30" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Waves */}
        <path d="M20 75 Q30 72 40 75 Q50 78 60 75 Q70 72 80 75" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  haldi: {
    title: 'HALDI',
    color: '#F4C430',
    borderStyle: 'circle',
    icon: (
      <g>
        {/* Turmeric/flower bowl */}
        <ellipse cx="50" cy="60" rx="20" ry="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M30 60 Q30 45 50 45 Q70 45 70 60" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Turmeric mound */}
        <ellipse cx="50" cy="52" rx="12" ry="6" fill="currentColor" opacity="0.6" />
        {/* Marigold flowers */}
        <circle cx="35" cy="38" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="50" cy="32" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="65" cy="38" r="6" fill="currentColor" opacity="0.8" />
      </g>
    ),
  },
  mehndi: {
    title: 'MEHNDI',
    color: '#C4A77D',
    borderStyle: 'oval',
    icon: (
      <g>
        {/* Henna hand design */}
        <path d="M50 30 L50 55 M45 35 Q50 40 55 35 M40 45 Q50 50 60 45 M35 55 Q50 62 65 55" 
          stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Paisley accent */}
        <path d="M30 65 Q25 55 35 50 Q45 45 40 60 Q35 70 30 65" 
          stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M70 65 Q75 55 65 50 Q55 45 60 60 Q65 70 70 65" 
          stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
  },
  baraat: {
    title: 'BARAAT',
    color: '#FF6B6B',
    borderStyle: 'rectangle',
    icon: (
      <g>
        {/* Elephant silhouette */}
        <path d="M30 55 Q25 50 25 45 Q25 35 35 35 L40 35 Q42 30 45 30 L55 30 Q58 30 60 35 L65 35 Q75 35 75 45 Q75 50 70 55 L70 65 L65 65 L65 55 L35 55 L35 65 L30 65 Z" 
          fill="currentColor" />
        {/* Trunk */}
        <path d="M25 45 Q20 50 22 58 Q24 62 28 60" stroke="currentColor" strokeWidth="3" fill="none" />
        {/* Marigold decorations */}
        <circle cx="45" cy="45" r="3" fill="currentColor" />
        <circle cx="55" cy="45" r="3" fill="currentColor" />
      </g>
    ),
  },
  wedding: {
    title: 'WEDDING CEREMONY',
    color: '#D4AF37',
    borderStyle: 'circle',
    icon: (
      <g>
        {/* Mandap pillars */}
        <rect x="25" y="45" width="4" height="25" fill="currentColor" />
        <rect x="71" y="45" width="4" height="25" fill="currentColor" />
        {/* Mandap top */}
        <path d="M20 45 L50 25 L80 45" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="2" />
        {/* Decorative top */}
        <circle cx="50" cy="25" r="5" fill="currentColor" />
        {/* Fire/Agni */}
        <path d="M50 65 Q45 55 50 50 Q55 55 50 65" fill="currentColor" />
      </g>
    ),
  },
  cocktail: {
    title: 'COCKTAIL HOUR',
    color: '#1E3A5F',
    borderStyle: 'rectangle',
    icon: (
      <g>
        {/* Martini glass */}
        <path d="M35 35 L50 55 L65 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 55 L50 70" stroke="currentColor" strokeWidth="2" />
        <path d="M40 70 L60 70" stroke="currentColor" strokeWidth="2" />
        {/* Olive */}
        <circle cx="50" cy="42" r="4" fill="currentColor" />
        {/* Decorative bubbles */}
        <circle cx="30" cy="45" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="70" cy="50" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="68" cy="40" r="1.5" fill="currentColor" opacity="0.5" />
      </g>
    ),
  },
  reception: {
    title: 'RECEPTION',
    color: '#87CEEB',
    borderStyle: 'oval',
    icon: (
      <g>
        {/* Champagne glasses */}
        <path d="M35 35 L35 55 M30 55 L40 55 M35 55 L35 65 M30 65 L40 65" 
          stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M30 35 Q35 45 40 35" stroke="currentColor" strokeWidth="2" fill="none" />
        
        <path d="M65 35 L65 55 M60 55 L70 55 M65 55 L65 65 M60 65 L70 65" 
          stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M60 35 Q65 45 70 35" stroke="currentColor" strokeWidth="2" fill="none" />
        
        {/* Clink sparkle */}
        <path d="M47 40 L53 40 M50 37 L50 43" stroke="currentColor" strokeWidth="1.5" />
      </g>
    ),
  },
};

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-36 h-36',
  lg: 'w-48 h-48',
};

export function VisaStamp({ 
  event, 
  date, 
  animated = true, 
  size = 'md',
  className 
}: VisaStampProps) {
  const config = stampConfigs[event];
  const id = useId();
  const randomRotation = seededRotation(id + event);
  
  const StampContent = (
    <svg 
      viewBox="0 0 100 100" 
      className={cn(sizeClasses[size], className)}
      style={{ color: config.color }}
    >
      {/* Border based on style */}
      {config.borderStyle === 'circle' && (
        <>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}
      {config.borderStyle === 'rectangle' && (
        <>
          <rect x="4" y="4" width="92" height="92" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <rect x="8" y="8" width="84" height="84" rx="2" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}
      {config.borderStyle === 'oval' && (
        <>
          <ellipse cx="50" cy="50" rx="46" ry="40" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="42" ry="36" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}
      
      {/* Icon */}
      <g transform="translate(0, -8)">
        {config.icon}
      </g>
      
      {/* Title - curved at top */}
      <text
        x="50"
        y="18"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7"
        fontWeight="bold"
        fontFamily="monospace"
        letterSpacing="1"
      >
        {config.title}
      </text>
      
      {/* Date at bottom */}
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fill="currentColor"
        fontSize="6"
        fontFamily="monospace"
      >
        {date}
      </text>
      
      {/* APPROVED text */}
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fill="currentColor"
        fontSize="5"
        fontFamily="monospace"
        letterSpacing="2"
        opacity="0.8"
      >
        ✓ ENTRY GRANTED
      </text>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 2, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 0.85, rotate: randomRotation }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        whileHover={{ scale: 1.05, opacity: 1 }}
      >
        {StampContent}
      </motion.div>
    );
  }

  return (
    <div style={{ transform: `rotate(${randomRotation}deg)`, opacity: 0.85 }}>
      {StampContent}
    </div>
  );
}

export function StampCollection({ className }: { className?: string }) {
  const events: { event: EventType; date: string }[] = [
    { event: 'welcome', date: 'APR 2, 2027' },
    { event: 'haldi', date: 'APR 3, 2027' },
    { event: 'mehndi', date: 'APR 3, 2027' },
    { event: 'baraat', date: 'APR 4, 2027' },
    { event: 'wedding', date: 'APR 4, 2027' },
    { event: 'cocktail', date: 'APR 4, 2027' },
    { event: 'reception', date: 'APR 4, 2027' },
  ];

  return (
    <div className={cn('flex flex-wrap gap-6 justify-center', className)}>
      {events.map((e, index) => (
        <motion.div
          key={e.event}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <VisaStamp event={e.event} date={e.date} />
        </motion.div>
      ))}
    </div>
  );
}
