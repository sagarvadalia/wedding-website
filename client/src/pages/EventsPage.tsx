import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { VisaStamp } from '@/components/passport/VisaStamp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Shirt } from 'lucide-react';
import type { EventType, WeddingEvent } from '@/types';

const events: WeddingEvent[] = [
  {
    id: 'welcome',
    name: 'Welcome Dinner',
    date: 'Friday, April 2, 2027',
    time: '6:00 PM - 10:00 PM',
    location: 'Beachfront Terrace',
    dressCode: 'Resort Casual / Beach Attire',
    description: 'Join us as we kick off our wedding weekend! Enjoy tropical cocktails, delicious appetizers, and the beautiful Cancun sunset. This is a casual affair to reconnect with family and friends before the festivities begin.',
    stampTheme: 'beach',
  },
  {
    id: 'haldi',
    name: 'Haldi Ceremony',
    date: 'Saturday, April 3, 2027',
    time: '11:00 AM - 1:00 PM',
    location: 'Garden Pavilion',
    dressCode: 'Yellow / White Attire (clothes may get stained!)',
    description: 'A joyful pre-wedding ritual where turmeric paste is applied to the bride and groom for blessings of prosperity and to give their skin a beautiful glow. Wear clothes you don\'t mind getting messy - it\'s part of the fun!',
    stampTheme: 'haldi',
  },
  {
    id: 'mehndi',
    name: 'Mehndi Ceremony',
    date: 'Saturday, April 3, 2027',
    time: '3:00 PM - 7:00 PM',
    location: 'Garden Pavilion',
    dressCode: 'Colorful Indian Attire',
    description: 'Experience the beautiful tradition of Mehndi, where intricate henna designs are applied to the bride\'s hands and feet. Enjoy music, dancing, and traditional Indian snacks while celebrating this joyful pre-wedding ritual.',
    stampTheme: 'henna',
  },
  {
    id: 'baraat',
    name: 'Baraat Procession',
    date: 'Sunday, April 4, 2027',
    time: '3:00 PM',
    location: 'Resort Main Entrance',
    dressCode: 'Formal Indian Attire',
    description: 'The groom arrives in style! Join us for the lively Baraat procession featuring music, dancing, and celebration as Sagar makes his way to the wedding venue. This is a high-energy event you won\'t want to miss!',
    stampTheme: 'elephant',
  },
  {
    id: 'wedding',
    name: 'Wedding Ceremony',
    date: 'Sunday, April 4, 2027',
    time: '4:00 PM - 6:00 PM',
    location: 'Oceanfront Mandap',
    dressCode: 'Formal Indian Attire',
    description: 'The moment we\'ve been waiting for! Witness Sagar and Grace exchange vows in a traditional Hindu ceremony under a beautiful mandap overlooking the Caribbean Sea. This sacred ceremony will unite our families forever.',
    stampTheme: 'mandap',
  },
  {
    id: 'cocktail',
    name: 'Cocktail Hour',
    date: 'Sunday, April 4, 2027',
    time: '6:00 PM - 7:00 PM',
    location: 'Oceanfront Terrace',
    dressCode: 'Formal / Evening Wear',
    description: 'Enjoy refreshing cocktails and hors d\'oeuvres while mingling with family and friends as the newlyweds take their first photos as a married couple. The perfect transition from ceremony to celebration!',
    stampTheme: 'cocktail',
  },
  {
    id: 'reception',
    name: 'Reception Dinner',
    date: 'Sunday, April 4, 2027',
    time: '7:00 PM - 11:00 PM',
    location: 'Grand Ballroom',
    dressCode: 'Formal / Evening Wear',
    description: 'Celebrate with us at our reception dinner! Enjoy a gourmet meal, heartfelt speeches, our first dance, and plenty of time to dance the night away. This elegant evening celebrates our union with all our loved ones.',
    stampTheme: 'celebration',
  },
];

const stampThemeToEventType: Record<string, EventType> = {
  beach: 'welcome',
  haldi: 'haldi',
  henna: 'mehndi',
  elephant: 'baraat',
  mandap: 'wedding',
  cocktail: 'cocktail',
  celebration: 'reception',
};

export function EventsPage() {
  return (
    <PassportPage pageNumber={3}>
      <PageHeader
        title="Wedding Events"
        subtitle="Your official itinerary for our celebration"
      />

      <Section>
        {/* Events Grid */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Stamp Section */}
                  <div className="lg:w-1/3 bg-sand-light p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-sand-driftwood/20">
                    <VisaStamp
                      event={stampThemeToEventType[event.stampTheme]}
                      date={event.date.split(', ')[1].replace(', 2027', '')}
                      size="lg"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-2/3">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl text-ocean-deep">
                        {event.name}
                      </CardTitle>
                      <p className="text-ocean-caribbean font-medium">
                        {event.date}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sand-dark leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-sand-driftwood/20">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-ocean-caribbean" />
                          <span className="text-sand-dark">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-ocean-caribbean" />
                          <span className="text-sand-dark">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shirt className="w-4 h-4 text-ocean-caribbean" />
                          <span className="text-sand-dark">{event.dressCode}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Schedule Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-heading text-center text-ocean-deep mb-8">
            At a Glance
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { day: 'Friday', date: 'April 2', events: ['Welcome Dinner'] },
              { day: 'Saturday', date: 'April 3', events: ['Haldi', 'Mehndi'] },
              { day: 'Sunday', date: 'April 4', events: ['Baraat', 'Wedding', 'Cocktail Hour', 'Reception'] },
            ].map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-ocean-deep text-sand-pearl py-3 rounded-t-lg">
                  <p className="text-lg font-heading">{day.day}</p>
                  <p className="text-sm text-sand-pearl/70">{day.date}</p>
                </div>
                <div className="bg-sand-light border border-t-0 border-sand-driftwood/20 rounded-b-lg p-4">
                  <ul className="space-y-2">
                    {day.events.map((event) => (
                      <li key={event} className="text-sand-dark">
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
