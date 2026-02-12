import { PageHeader, PassportPage, Section } from '@/components/passport/PassportPage';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Gem, Heart, House, Sparkle, Sunset, Waves } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timeline: TimelineEvent[] = [
  {
    year: '2014',
    title: 'First Connection',
    description: "In Fall 2014, we were two wide-eyed college freshmen at Cornell eager to start a new chapter in our lives. We both lived in a freshman dorm across the hallway from one another. Because of that, we would share frequent dining hall meals together and go to the typical college parties and events as a large group. One night in early November, the two of us attended a sorority paint party together- the first event we attended just the two of us. The night was filled with goofy pictures, endless dancing, colorful paint throwing, and undeniable chemistry between the two of us. In the days and weeks following the paint party, we were inseparable. We spent late nights chatting and getting to know each other, binging How I Met Your Mother (which became one of Grace’s favorite shows), playing piano in the dorm lounge, studying (and flirting) in the library, and gaining the freshman 15 at the dining hall. We eventually had our first “date” watching Interstellar at the Ithaca mall - a night to remember, where we got stuck in the mall at 2 am after the movie ended (our age is showing-this was pre-uber!). Even though our majors were different and we didn’t share any classes, we loved spending time together. Those few months were a spark-filled, beutiful yet fleeting time in both of our lives.",
    icon: (
      <span className="relative inline-block w-5 h-5">
        <Sparkle className="w-5 h-5 fill-current relative z-10" />
        {/* Small sparkles placed at top, right, bottom, left—aligned & matching color */}
        {/* Top */}
        <Sparkle className="absolute w-2 h-2 fill-current text-inherit left-1/2 -translate-x-1/2 -top-3 opacity-80 z-0" />
        {/* Right */}
        <Sparkle className="absolute w-2 h-2 fill-current text-inherit right-[-14px] top-1/2 -translate-y-1/2 opacity-70 z-0" />
        {/* Bottom */}
        <Sparkle className="absolute w-2 h-2 fill-current text-inherit left-1/2 -translate-x-1/2 -bottom-3 opacity-60 z-0" />
        {/* Left */}
        <Sparkle className="absolute w-2 h-2 fill-current text-inherit left-[-14px] top-1/2 -translate-y-1/2 opacity-65 z-0" />
      </span>
    ),
  },
  {
    year: '2015',
    title: 'Temporary "Goodbye"',
    description: "It was a beautiful friendship, and in a perfect world, it would have continued forever. However, as we all know, life is not always perfect, especially for two 18-year-olds finding their way through the ups and downs of college and self-discovery. Ultimately, we both chose different paths, not pursuing a romantic relationship at that time. Our friendship remained for a bit, but we eventually went our separate ways during college, only to reunite 7 years later.",
    icon: <Sunset className="w-5 h-5" />,
  },
  {
    year: '2021',
    title: 'Second Chance',
    description: 'In 2021, the world was coming out of the harshest COVID lockdowns. This was also the time when people longed for human connection. What better reason to reach out to that “one that got away” from nearly a decade ago…  And that’s what we did in June 2021, both single and starting our careers. A simple, innocent Facebook message out of the blue turned into a reunion dinner with an old friend in Long Island City, NY. We shared guac and chips, life stories from the past 7 years, growing butterflies, and by the end of the night, we both realized that night was not the last we would see of one another. We both went home excited, hopeful, and in awe of what fate had handed to us- a second chance at falling in love with that one that got away all those years ago. And yes, we FINALLY took that chance together, and it has been the best and most beautiful decision we made.',
    icon: <Heart className="w-5 h-5 fill-current" />,
  },
  {
    year: '2021-present',
    title: 'Life together in NYC',
    description: 'Over the next several years, we have grown our lives together, and our love has only continued to grow every day. We eventually made our first home in Long Island City, NYC, and have raised our sweet 4 legged boy, Cosmo. From our weekend bagels in Gantry Park (our most sacred tradition!) to our spontaneous ferry rides to explore different areas of NYC, we always treasure our adventures together. We both share a love of food, travel, and exploration. We have been fortunate to have visited various places around the country and world, including Aruba, India, Jamaica, Mexico, California, Arizona, and Greece.',
    icon: <House className="w-5 h-5 fill-current" />,
  },
  {
    year: '2024',
    title: 'Engaged!',
    description: 'We took a trip to Greece for our 3-year anniversary, where Sagar proposed on our 3rd anniversary overlooking a beautiful sunset in Mykonos. Grace was totally caught of guard and shocked and elated at the same time. It was a truly magical moment that we will never forget.',
    icon: <Gem className="w-5 h-5 fill-current" />,
  },
  {
    year: '2027',
    title: 'Forever Begins',
    description: 'Our love of life, travel, and everything related to the beach, swimming, and the ocean (yes, Sagar’s name actually means “ocean”) extends to you all. We are blessed and thrilled to celebrate our marriage together in beautiful Playa Mujeres, Cancun, Mexico.',
    icon: <Waves className="w-5 h-5 fill-current" />,
  },
];

export function OurStoryPage() {
  return (
    <PassportPage pageNumber={2}>
      <PageHeader
        title="Our Story"
        subtitle="As some of you may or may not know, this one is quite a story… so, grab the popcorn and enjoy!"
      />

      <Section>
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-lg text-sand-dark leading-relaxed">
        When people ask us about our first date, as funny as it is, there are always two answers: 
The first - back in November 2014, as two wide-eyed college freshmen who were still learning and growing in life, and the second -  June 2021, as two 25-year-olds making our mark in the working adult world. Why were our “first” dates 7 years apart? Well, it’s a beautiful story that portrays how the “ones that got away” eventually come back when the time is right. We are excited to share our story with you, and we hope you enjoy it as much as we cherish it every day. 

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

        {/* Moments we cherish - polaroid style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-heading text-center text-ocean-deep mb-12">
            Moments We Cherish
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 items-start">
            {[
              { rotate: -3, delay: 0 },
              { rotate: 2, delay: 0.05 },
              { rotate: -2, delay: 0.1 },
              { rotate: 4, delay: 0.15 },
              { rotate: -4, delay: 0.2 },
              { rotate: 1, delay: 0.25 },
            ].map(({ rotate, delay }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, rotate: rotate - 5 }}
                whileInView={{ opacity: 1, y: 0, rotate }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay }}
                className="flex-shrink-0"
              >
                {/* Polaroid frame: white border + shadow */}
                <div className="bg-sand-pearl px-3 pt-3 pb-10 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
                  <div className="w-40 h-40 md:w-44 md:h-44 bg-sand-warm/50 flex items-center justify-center border border-sand-driftwood/20">
                    <div className="text-center text-sand-dark/50">
                      <Heart className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-xs">Photo {index + 1}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sand-dark/60 mt-8 text-sm">
            Add your favorite photos here
          </p>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
