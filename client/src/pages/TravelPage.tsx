import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Hotel, 
  Car, 
  Sun, 
  Briefcase, 
  CreditCard,
  FileText,
  ExternalLink
} from 'lucide-react';

const travelInfo = [
  {
    icon: <Plane className="w-6 h-6" />,
    title: 'Getting There',
    content: [
      'Fly into Cancun International Airport (CUN)',
      'Direct flights available from most major US cities',
      'We recommend booking flights early for best rates',
      'Flight time: ~3-4 hours from most US cities',
    ],
  },
  {
    icon: <Hotel className="w-6 h-6" />,
    title: 'Accommodations',
    content: [
      'Dreams Playa Mujeres Golf & Spa Resort',
      'All guests MUST book through our wedding block',
      'All-inclusive resort with 10+ dining options',
      'Book via Indian Destination Wedding (see link below)',
    ],
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Transportation',
    content: [
      'Resort is 35-45 minutes from the airport',
      'Shuttle services available through the resort',
      'We will arrange group transportation for wedding events',
      'Taxis and rental cars also available',
    ],
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Travel Documents',
    content: [
      'Valid passport required for US citizens',
      'Passport must be valid for 6+ months past travel date',
      'No visa required for US citizens (stays under 180 days)',
      'Check requirements for non-US passport holders',
    ],
  },
];

const packingList = [
  { category: 'Essentials', items: ['Passport', 'Travel insurance docs', 'Medications', 'Phone charger'] },
  { category: 'Wedding Events', items: ['Indian formal wear', 'Evening formal wear', 'Comfortable shoes', 'Accessories'] },
  { category: 'Beach & Resort', items: ['Swimsuit', 'Sunscreen (reef-safe)', 'Sunglasses', 'Hat'] },
  { category: 'Just in Case', items: ['Light jacket', 'Rain poncho', 'Hand sanitizer', 'Snacks'] },
];

export function TravelPage() {
  return (
    <PassportPage pageNumber={4}>
      <PageHeader
        title="Travel & Stay"
        subtitle="Everything you need to know for your journey to paradise"
      />

      <Section>
        {/* Resort Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            {/* Resort Image */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src="/images/dreams-playa-mujeres.jpg"
                alt="Dreams Playa Mujeres Golf & Spa Resort - Aerial view of the beachfront property"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback gradient if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback gradient shown if image fails to load */}
              <div className="hidden absolute inset-0 bg-gradient-to-br from-ocean-deep via-ocean-caribbean to-ocean-sky flex items-center justify-center">
                <div className="text-center text-white/80">
                  <Hotel className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add resort image to public/images/</p>
                </div>
              </div>
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/40 to-transparent" />
              {/* Resort name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h2 className="text-3xl md:text-4xl font-heading text-white mb-1">
                  Dreams Playa Mujeres
                </h2>
                <p className="text-lg text-sand-pearl/90">
                  Golf & Spa Resort
                </p>
              </div>
            </div>
            
            {/* Resort Info */}
            <div className="bg-gradient-to-r from-ocean-deep to-ocean-caribbean text-sand-pearl p-6 md:p-8">
              <p className="text-sand-pearl/70 mb-4">
                Playa Mujeres, Cancun, Mexico
              </p>
              <p className="text-sand-pearl/80 leading-relaxed mb-6">
                An all-inclusive luxury resort featuring pristine beaches, world-class amenities, 
                and breathtaking ocean views. Perfect for our destination wedding celebration!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" size="lg" asChild>
                  <a href="https://www.indiandestinationwedding.com/grace-sagar/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center whitespace-nowrap">
                    Book Your Room <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-sand-pearl/30 text-sand-pearl hover:bg-sand-pearl/10" asChild>
                  <a href="https://www.dreamsresorts.com/playa-mujeres" target="_blank" rel="noopener noreferrer" className="inline-flex items-center whitespace-nowrap">
                    View Resort <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                  </a>
                </Button>
              </div>
              <p className="text-sand-pearl/60 text-sm mt-4">
                <strong className="text-gold">Important:</strong> All guests must book accommodations through Indian Destination Wedding to attend wedding events.
              </p>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: '502', desc: 'Luxury Suites' },
                  { label: '10+', desc: 'Restaurants' },
                  { label: '12', desc: 'Bars & Lounges' },
                  { label: '65,000', desc: 'Sq Ft of Pools' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-heading text-ocean-deep">{stat.label}</p>
                    <p className="text-sm text-sand-dark">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Travel Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {travelInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-ocean-caribbean/10 flex items-center justify-center text-ocean-caribbean">
                      {info.icon}
                    </div>
                    <CardTitle>{info.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {info.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sand-dark">
                        <span className="text-gold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weather & Currency */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-gold" />
                <CardTitle>Weather in April</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-heading text-ocean-deep">82°F</p>
                  <p className="text-sm text-sand-dark">Average High</p>
                </div>
                <div>
                  <p className="text-4xl font-heading text-ocean-deep">72°F</p>
                  <p className="text-sm text-sand-dark">Average Low</p>
                </div>
              </div>
              <p className="text-sand-dark text-sm">
                April is one of the best months to visit Cancun! Expect warm, sunny days 
                with low humidity and minimal rain. Perfect beach weather!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-gold" />
                <CardTitle>Money Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sand-dark">
                <li>• Currency: Mexican Peso (MXN), USD widely accepted</li>
                <li>• Tipping: 15-20% at restaurants, $1-5 for services</li>
                <li>• ATMs available at airport and resort</li>
                <li>• Credit cards accepted almost everywhere</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Packing List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-heading text-center text-ocean-deep mb-8">
            <Briefcase className="w-6 h-6 inline-block mr-2 mb-1" />
            Packing Checklist
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packingList.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-sand-dark">
                          <input type="checkbox" className="rounded border-sand-driftwood" />
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
