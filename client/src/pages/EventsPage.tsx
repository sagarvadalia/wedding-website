import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { VisaStamp } from '@/components/passport/VisaStamp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Shirt, CalendarPlus, ExternalLink } from 'lucide-react';
import type { EventType, WeddingEvent } from '@/types';

/** Google Maps link for the resort (all events are held here). */
const RESORT_MAPS_URL = 'https://maps.google.com/?q=Dreams+Playa+Mujeres+Golf+%26+Spa+Resort,+Playa+Mujeres,+Cancun,+Mexico';

interface CalendarEvent {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
}

function toICSDatetime(date: string, time: string): string {
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };
  const parts = date.replace(/,/g, '').split(' ');
  const month = months[parts[0]] ?? '01';
  const day = (parts[1] ?? '01').padStart(2, '0');
  const year = parts[2] ?? '2027';

  const [rawTime, ampm] = time.split(' ');
  const [hoursStr, minutesStr] = (rawTime ?? '12:00').split(':');
  let hours = parseInt(hoursStr ?? '12', 10);
  const minutes = minutesStr ?? '00';
  if (ampm?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;

  return `${year}${month}${day}T${String(hours).padStart(2, '0')}${minutes}00`;
}

function downloadICS(event: CalendarEvent): void {
  const dtStart = toICSDatetime(event.startDate, event.startTime);
  const dtEnd = toICSDatetime(event.endDate, event.endTime);
  const uid = `${dtStart}-${event.name.replace(/\s/g, '')}@sagarandgrace`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SagarAndGrace//Wedding//EN',
    'BEGIN:VEVENT',
    `DTSTART;TZID=America/Cancun:${dtStart}`,
    `DTEND;TZID=America/Cancun:${dtEnd}`,
    `SUMMARY:${event.name} - Sagar & Grace Wedding`,
    `LOCATION:${event.location}\\, Dreams Playa Mujeres\\, Cancun\\, Mexico`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `UID:${uid}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.name.replace(/\s+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAllEventsICS(events: WeddingEvent[]): void {
  const vevents = events.map((event) => {
    const timeRange = event.time.split(' - ');
    const startTime = timeRange[0] ?? '12:00 PM';
    const endTime = timeRange[1] ?? timeRange[0] ?? '12:00 PM';
    const dateParts = event.date.replace(/^\w+,\s*/, '');
    const dtStart = toICSDatetime(dateParts, startTime);
    const dtEnd = toICSDatetime(dateParts, endTime);
    const uid = `${dtStart}-${event.name.replace(/\s/g, '')}@sagarandgrace`;
    return [
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/Cancun:${dtStart}`,
      `DTEND;TZID=America/Cancun:${dtEnd}`,
      `SUMMARY:${event.name} - Sagar & Grace Wedding`,
      `LOCATION:${event.location}\\, Dreams Playa Mujeres\\, Cancun\\, Mexico`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `UID:${uid}`,
      'END:VEVENT',
    ].join('\r\n');
  });

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SagarAndGrace//Wedding//EN',
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sagar-grace-wedding-events.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
    time: '3:00 PM - 4:00 PM',
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
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        // Center the event card in the viewport and account for fixed nav (avoid overshooting)
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [hash]);

  return (
    <PassportPage pageNumber={3}>
      <PageHeader
        title="Wedding Events"
        subtitle="Your official itinerary for our celebration"
      />

      <Section>
        {/* Add All to Calendar + Map CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            variant="gold"
            size="lg"
            onClick={() => downloadAllEventsICS(events)}
          >
            <CalendarPlus className="w-5 h-5 mr-2 shrink-0" />
            Add All Events to Calendar
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href={RESORT_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center whitespace-nowrap"
            >
              <MapPin className="w-5 h-5 mr-2 shrink-0" />
              View Resort on Map
              <ExternalLink className="w-4 h-4 ml-1.5 shrink-0" />
            </a>
          </Button>
        </motion.div>

        {/* Events Grid */}
        <div className="space-y-8">
          {events.map((event, index) => {
            const timeRange = event.time.split(' - ');
            const startTime = timeRange[0] ?? '12:00 PM';
            const endTime = timeRange[1] ?? timeRange[0] ?? '12:00 PM';
            const dateParts = event.date.replace(/^\w+,\s*/, '');

            return (
              <motion.div
                key={event.id}
                id={event.id}
                className="scroll-mt-24"
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
                          <a
                            href={RESORT_MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-ocean-caribbean hover:text-ocean-deep transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <div className="flex items-center gap-2 text-sm">
                            <Shirt className="w-4 h-4 text-ocean-caribbean" />
                            <span className="text-sand-dark">{event.dressCode}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            downloadICS({
                              name: event.name,
                              startDate: dateParts,
                              startTime,
                              endDate: dateParts,
                              endTime,
                              location: event.location,
                              description: event.description,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-sm text-ocean-caribbean hover:text-ocean-deep transition-colors mt-1"
                        >
                          <CalendarPlus className="w-4 h-4" />
                          Add to Calendar
                        </button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
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

        {/* Dress Code Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-heading text-center text-ocean-deep mb-3">
            What to Wear
          </h2>
          <p className="text-center text-ocean-deep/80 mb-8 max-w-2xl mx-auto">
            Our wedding spans multiple events with different vibes. Here's a guide to help you plan your outfits for each occasion.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Resort Casual / Beach',
                events: 'Welcome Dinner',
                color: 'from-ocean-sky to-ocean-caribbean',
                items: [
                  'Flowy sundress, linen pants & a nice blouse, or a guayabera shirt',
                  'Light fabrics — cotton, linen, chiffon',
                  'Sandals or dressy flats (think sand-friendly)',
                  'Ocean / tropical color palette welcome',
                ],
              },
              {
                title: 'Yellow / White Attire',
                events: 'Haldi Ceremony',
                color: 'from-gold to-sand-warm',
                items: [
                  'Wear yellow, white, or light-colored clothing',
                  'Expect to get messy — turmeric stains!',
                  'Old clothes you don\'t mind ruining are perfect',
                  'Skip jewelry you\'d be upset about staining',
                ],
              },
              {
                title: 'Colorful Indian Attire',
                events: 'Mehndi Ceremony',
                color: 'from-coral to-gold',
                items: [
                  'Bright, colorful outfits — think vibrant greens, pinks, blues, oranges',
                  'Lehengas, kurtas, salwar kameez, or sarees for those who have them',
                  'Western outfits in bold colors are equally welcome',
                  'Comfortable shoes for dancing',
                ],
              },
              {
                title: 'Formal Indian Attire',
                events: 'Baraat & Wedding Ceremony',
                color: 'from-ocean-deep to-ocean-caribbean',
                items: [
                  'Traditional Indian formalwear — sarees, lehengas, sherwanis, kurta pajamas',
                  'Western formal in rich jewel tones also works great',
                  'Avoid white/ivory (reserved for the bride)',
                  'Embellished accessories and statement jewelry encouraged',
                ],
              },
              {
                title: 'Formal / Evening Wear',
                events: 'Cocktail Hour & Reception',
                color: 'from-ocean-caribbean to-ocean-sky',
                items: [
                  'Cocktail dresses, evening gowns, or suits',
                  'Indian formalwear is also perfect — sarees, lehengas, or indo-western',
                  'Dressy heels, wedges, or formal flats',
                  'Think elegant — it\'s time to celebrate!',
                ],
              },
              {
                title: 'Pro Tips',
                events: 'All Events',
                color: 'from-sand-driftwood to-sand-warm',
                items: [
                  'Many events are outdoors — skip stilettos on grass/sand',
                  'Cancun in April is warm (80°F+) — breathable fabrics are your friend',
                  'Bring a light shawl for air-conditioned indoor spaces',
                  'Don\'t have Indian outfits? No worries — colorful western wear is welcome!',
                ],
              },
            ].map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full overflow-hidden">
                  <div className={`h-2 bg-linear-to-r ${guide.color}`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <p className="text-xs text-ocean-caribbean font-medium uppercase tracking-wider">
                      {guide.events}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-sand-dark">
                          <Shirt className="w-3.5 h-3.5 mt-0.5 text-ocean-caribbean shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
