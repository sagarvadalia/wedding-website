import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: 'travel' | 'events' | 'accommodation' | 'general';
}

const faqs: FAQ[] = [
  {
    category: 'travel',
    question: 'Do I need a passport to travel to Mexico?',
    answer: 'Yes! All US citizens need a valid passport to enter Mexico. Make sure your passport is valid for at least 6 months beyond your travel dates. If you don\'t have a passport, we recommend applying as soon as possible as processing can take several weeks.',
  },
  {
    category: 'travel',
    question: 'Do I need a visa to visit Mexico?',
    answer: 'US citizens do not need a visa for stays under 180 days. You\'ll receive a tourist card (FMM) upon arrival. If you\'re traveling from another country, please check the Mexican embassy website for your specific requirements.',
  },
  {
    category: 'travel',
    question: 'What airport do I fly into?',
    answer: 'You\'ll want to fly into Cancun International Airport (airport code: CUN). It\'s the closest major airport to Dreams Playa Mujeres, located about 35-45 minutes from the resort.',
  },
  {
    category: 'travel',
    question: 'How do I get from the airport to the resort?',
    answer: 'The resort offers shuttle services, or you can arrange private transportation. We\'ll provide more details closer to the wedding date. Taxi and rental car options are also available at the airport.',
  },
  {
    category: 'accommodation',
    question: 'Is there a room block for wedding guests?',
    answer: 'Yes! We have reserved a block of rooms at Dreams Playa Mujeres for our guests. Details on how to book will be provided with your invitation. We recommend booking early as rooms are limited.',
  },
  {
    category: 'accommodation',
    question: 'What is included at the all-inclusive resort?',
    answer: 'Dreams Playa Mujeres is all-inclusive, meaning your room rate covers: all meals at 10+ restaurants, unlimited drinks (including alcohol), room service, pools, beach access, water sports, entertainment, WiFi, and more!',
  },
  {
    category: 'accommodation',
    question: 'Can I bring my children?',
    answer: 'Dreams Playa Mujeres is a family-friendly resort with activities for all ages, including a kids\' club and water park. However, please note that most evening wedding events are adults-only. Babysitting services are available at the resort.',
  },
  {
    category: 'events',
    question: 'What should I wear to each event?',
    answer: 'Dress codes vary by event: Welcome Party is resort casual/beach attire, Mehndi is colorful Indian attire (we love seeing guests in bright colors!), Baraat and Wedding are formal Indian attire, Reception is formal/evening wear, and the After Party is come as you are!',
  },
  {
    category: 'events',
    question: 'Can I attend just some of the events?',
    answer: 'Absolutely! We understand travel can be challenging. Feel free to join us for as many events as you\'re able to attend. The main event is the Wedding Ceremony and Reception on Sunday, April 6th.',
  },
  {
    category: 'events',
    question: 'What is a Baraat?',
    answer: 'The Baraat is a traditional Indian wedding procession where the groom arrives in style! It\'s a lively celebration with music and dancing as Sagar makes his way to the wedding venue. Everyone is welcome to join in the dancing!',
  },
  {
    category: 'events',
    question: 'What is a Mehndi ceremony?',
    answer: 'Mehndi is a pre-wedding ritual where beautiful henna designs are applied to the bride\'s hands and feet. It\'s a fun, celebratory event with music, food, and dancing. Guests are welcome to get henna designs too!',
  },
  {
    category: 'general',
    question: 'What is the weather like in Cancun in April?',
    answer: 'April is one of the best times to visit Cancun! Expect warm, sunny weather with average highs around 82°F (28°C) and lows around 72°F (22°C). Rain is minimal this time of year.',
  },
  {
    category: 'general',
    question: 'Is it safe to travel to Cancun?',
    answer: 'Cancun\'s hotel and resort areas are very safe and welcoming to tourists. The resort is in the exclusive Playa Mujeres gated community. As with any travel, use common sense and stay aware of your surroundings.',
  },
  {
    category: 'general',
    question: 'What currency is used in Mexico?',
    answer: 'The official currency is the Mexican Peso (MXN), but US dollars are widely accepted in tourist areas. Credit cards are accepted at most establishments. ATMs are available at the airport and resort.',
  },
  {
    category: 'general',
    question: 'Are gifts expected?',
    answer: 'Your presence at our destination wedding is the greatest gift! If you\'d like to give a gift, we have a registry linked on our website. We also welcome contributions to our honeymoon fund.',
  },
  {
    category: 'general',
    question: 'Who can I contact with questions?',
    answer: 'Feel free to reach out to us directly! Email us at wedding@sagarandgrace.com or use the contact information provided below.',
  },
];

const categories = [
  { id: 'travel', label: 'Travel & Transportation' },
  { id: 'accommodation', label: 'Accommodation' },
  { id: 'events', label: 'Wedding Events' },
  { id: 'general', label: 'General Questions' },
];

export function FaqPage() {
  return (
    <PassportPage pageNumber={7}>
      <PageHeader
        title="FAQ"
        subtitle="Answers to your most common questions"
      />

      <Section>
        {/* FAQ Sections */}
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl md:text-2xl font-heading text-ocean-deep mb-4">
              {category.label}
            </h2>
            
            <Accordion type="single" collapsible>
              {faqs
                .filter((faq) => faq.category === category.id)
                .map((faq, index) => (
                  <AccordionItem key={index} value={`${category.id}-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </motion.div>
        ))}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-ocean-deep text-sand-pearl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-heading mb-4">Still Have Questions?</h3>
              <p className="text-sand-pearl/80 mb-6">
                We're happy to help! Reach out to us anytime.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a 
                  href="mailto:wedding@sagarandgrace.com"
                  className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>wedding@sagarandgrace.com</span>
                </a>
                <a 
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>(123) 456-7890</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
