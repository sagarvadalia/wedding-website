import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';

interface PassportPolaroidProps {
  src: string;
  alt: string;
  /** Size of the image area (frame is slightly larger) */
  size?: 'sm' | 'md' | 'lg';
  /** Rotation in degrees */
  rotate?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32 md:w-40 md:h-40',
  lg: 'w-40 h-40 md:w-44 md:h-44',
};

const placeholderGradients = [
  'from-ocean-deep to-ocean-caribbean',
  'from-ocean-caribbean to-ocean-sky',
  'from-sand-warm to-sand-driftwood',
  'from-coral to-gold',
];

export function PassportPolaroid({
  src,
  alt,
  size = 'md',
  rotate = 0,
  className,
}: PassportPolaroidProps) {
  const imageSize = sizeClasses[size];
  const gradient =
    placeholderGradients[
      Math.abs(alt.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
        placeholderGradients.length
    ];

  return (
    <motion.div
      className={cn('flex-shrink-0', className)}
      style={{ rotate }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-sand-pearl px-2 pt-2 pb-6 md:px-3 md:pt-3 md:pb-8 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
        <div
          className={cn(
            imageSize,
            'bg-sand-warm/50 flex items-center justify-center border border-sand-driftwood/20 overflow-hidden'
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <div className="text-center text-white/80">
                <Camera className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 opacity-70" />
                <p className="text-xs">Photo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
