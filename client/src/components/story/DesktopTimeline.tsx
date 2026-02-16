import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { TimelineEvent } from '@/pages/OurStoryPage';

const POLAROID_ROTATIONS = [-3, 2, -2, 4, -4, 1];

interface DesktopTimelineProps {
  events: TimelineEvent[];
}

export function DesktopTimeline({ events }: DesktopTimelineProps) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-linear-to-b from-ocean-caribbean via-gold to-coral" />

      {/* Timeline events */}
      <div className="space-y-24">
        {events.map((event, index) => {
          const isExpanded = expandedSet.has(index);
          const isLeft = index % 2 === 0;
          const rotation = POLAROID_ROTATIONS[index] ?? 0;

          return (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                'relative flex items-start gap-10',
                isLeft ? 'flex-row' : 'flex-row-reverse'
              )}
            >
              {/* Content card */}
              <div className="flex-1">
                <Card className={cn('relative', isLeft ? 'mr-8' : 'ml-8')}>
                  {/* Stamp-like year badge */}
                  <div className="absolute -top-4 -right-4 z-10">
                    <div className="bg-ocean-deep text-sand-pearl px-4 py-2 rounded-full text-sm font-mono shadow-md -rotate-3">
                      {event.year}
                    </div>
                  </div>

                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-ocean-caribbean/10 flex items-center justify-center text-ocean-caribbean">
                        {event.icon}
                      </div>
                      <h3 className="text-xl font-heading text-ocean-deep">
                        {event.title}
                      </h3>
                    </div>

                    <AnimatePresence initial={false}>
                      <motion.div
                        key={isExpanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p
                          className={cn(
                            'text-sand-dark leading-relaxed',
                            !isExpanded && 'line-clamp-4'
                          )}
                        >
                          {event.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {event.description.length > 200 && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="text-ocean-caribbean text-sm font-medium mt-2 hover:underline cursor-pointer"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-sand-pearl shadow-md z-10" />

              {/* Polaroid */}
              <div
                className={cn(
                  'flex-1 flex min-w-0',
                  isLeft ? 'justify-start pl-4' : 'justify-end pr-4'
                )}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    rotate: rotation - 5,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="shrink-0"
                >
                  <div className="bg-sand-pearl px-4 pt-4 pb-12 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
                    <div className="w-72 h-72 bg-sand-warm/50 flex items-center justify-center border border-sand-driftwood/20 overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-sand-dark/50">
                          <Heart className="w-12 h-12 mx-auto mb-1" />
                          <p className="text-sm">Photo {index + 1}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
