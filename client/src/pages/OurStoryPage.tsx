import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Plane, MapPin, Star } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timeline: TimelineEvent[] = [
  {
    year: '2020',
    title: 'First Connection',
    description: 'Our paths crossed in the most unexpected way. What started as a simple conversation turned into hours of talking, laughing, and discovering how much we had in common.',
    icon: <Star className="w-5 h-5" />,
  },
  {
    year: '2021',
    title: 'First Date',
    description: 'Nervous excitement filled the air as we met for coffee that turned into dinner, that turned into a walk under the stars. We knew this was something special.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    year: '2022',
    title: 'Adventures Together',
    description: 'From spontaneous road trips to cozy nights in, every moment together felt like an adventure. We traveled, we laughed, we grew—together.',
    icon: <Plane className="w-5 h-5" />,
  },
  {
    year: '2023',
    title: 'Building Our Life',
    description: 'We took the leap and moved in together. Our apartment became filled with love, inside jokes, and the occasional debate about whose turn it was to do dishes.',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    year: '2024',
    title: 'The Proposal',
    description: 'Under a sky full of stars, with hearts full of love, Sagar got down on one knee and asked the question. Through happy tears, Grace said YES!',
    icon: <Heart className="w-5 h-5 fill-current" />,
  },
  {
    year: '2027',
    title: 'Forever Begins',
    description: 'And now, we invite you to join us in Cancun as we say "I do" and begin our greatest adventure yet—a lifetime together.',
    icon: <Star className="w-5 h-5 fill-current" />,
  },
];

export function OurStoryPage() {
  return (
    <PassportPage pageNumber={2}>
      <PageHeader
        title="Our Story"
        subtitle="Every love story is beautiful, but ours is our favorite"
      />

      <Section>
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-lg text-sand-dark leading-relaxed">
            From strangers to soulmates, our journey has been filled with laughter, 
            love, and countless memories. Here's how our story unfolded...
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-ocean-caribbean via-gold to-coral hidden md:block" />

          {/* Timeline events */}
          <div className="space-y-12 md:space-y-24">
            {timeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content card */}
                <div className="flex-1 w-full md:w-auto">
                  <Card className={`relative ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    {/* Stamp-like year badge */}
                    <div 
                      className="absolute -top-4 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 md:-right-4 z-10"
                    >
                      <div className="bg-ocean-deep text-sand-pearl px-4 py-2 rounded-full text-sm font-mono shadow-md transform -rotate-3">
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
                      <p className="text-sand-dark leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Center dot (desktop) */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-sand-pearl shadow-md z-10" />

                {/* Empty space for opposite side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fun stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-heading text-center text-ocean-deep mb-12">
            Our Journey in Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '5+', label: 'Years Together' },
              { number: '12', label: 'Countries Visited' },
              { number: '∞', label: 'Cups of Coffee' },
              { number: '1', label: 'Forever' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-heading text-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-sand-dark uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo placeholder section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-heading text-center text-ocean-deep mb-8">
            Moments We Cherish
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square bg-sand-warm/50 rounded-lg flex items-center justify-center border-2 border-dashed border-sand-driftwood/30"
              >
                <div className="text-center text-sand-dark/50">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs">Photo {index + 1}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sand-dark/60 mt-4 text-sm">
            Add your favorite photos here
          </p>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
