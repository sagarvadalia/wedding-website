import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { TimelineEvent } from '@/pages/OurStoryPage';

interface MobileTimelineProps {
  events: TimelineEvent[];
}

export function MobileTimeline({ events }: MobileTimelineProps) {
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
      {/* Left-aligned vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-linear-to-b from-ocean-caribbean via-gold to-coral" />

      {/* Timeline events */}
      <div className="space-y-8">
        {events.map((event, index) => {
          const isExpanded = expandedSet.has(index);

          return (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="relative pl-12"
            >
              {/* Dot on the timeline */}
              <div className="absolute left-[10px] top-1 w-3 h-3 rounded-full bg-gold border-2 border-sand-pearl shadow-sm z-10" />

              {/* Year badge inline */}
              <div className="mb-3">
                <span className="bg-ocean-deep text-sand-pearl px-3 py-1 rounded-full text-xs font-mono shadow-sm">
                  {event.year}
                </span>
              </div>

              {/* Card */}
              <Card className="relative">
                <CardContent className="p-4 pt-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-ocean-caribbean/10 flex items-center justify-center text-ocean-caribbean shrink-0">
                      {event.icon}
                    </div>
                    <h3 className="text-lg font-heading text-ocean-deep leading-tight">
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
                          'text-sm text-sand-dark leading-relaxed',
                          !isExpanded && 'line-clamp-3'
                        )}
                      >
                        {event.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {event.description.length > 150 && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-ocean-caribbean text-xs font-medium mt-2 hover:underline cursor-pointer"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}

                  {/* Photo revealed on expand */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4">
                          <div className="bg-sand-pearl px-3 pt-3 pb-8 shadow-md rounded-sm">
                            <div className="w-full aspect-square bg-sand-warm/50 flex items-center justify-center border border-sand-driftwood/20 overflow-hidden">
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center text-sand-dark/50">
                                  <Heart className="w-8 h-8 mx-auto mb-1" />
                                  <p className="text-xs">Photo {index + 1}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
