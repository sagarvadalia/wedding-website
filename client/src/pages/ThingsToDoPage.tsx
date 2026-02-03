import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Waves, 
  Palmtree, 
  Utensils, 
  Camera, 
  ShoppingBag,
  Sparkles,
  Fish,
  Mountain
} from 'lucide-react';

interface Activity {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'resort' | 'excursion' | 'nearby';
}

const resortActivities: Activity[] = [
  {
    name: 'Pristine Beaches',
    description: 'Relax on the resort\'s private white sand beach with crystal-clear Caribbean waters.',
    icon: <Waves className="w-6 h-6" />,
    category: 'resort',
  },
  {
    name: 'World-Class Spa',
    description: 'Treat yourself to a massage, facial, or couples treatment at the Dreams Spa.',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'resort',
  },
  {
    name: 'Championship Golf',
    description: 'Play 18 holes at the stunning Playa Mujeres Golf Club designed by Greg Norman.',
    icon: <Palmtree className="w-6 h-6" />,
    category: 'resort',
  },
  {
    name: 'Water Sports',
    description: 'Kayaking, paddleboarding, snorkeling, and more included with your stay.',
    icon: <Fish className="w-6 h-6" />,
    category: 'resort',
  },
  {
    name: 'Fine Dining',
    description: '10+ restaurants serving international cuisine from Mexican to Asian to Italian.',
    icon: <Utensils className="w-6 h-6" />,
    category: 'resort',
  },
];

const excursions: Activity[] = [
  {
    name: 'Isla Mujeres',
    description: 'Take a short ferry ride to this charming island paradise with beautiful beaches, snorkeling, and a relaxed island vibe.',
    icon: <Waves className="w-6 h-6" />,
    category: 'excursion',
  },
  {
    name: 'Chichen Itza',
    description: 'Visit one of the New Seven Wonders of the World. This ancient Mayan city is about 2.5 hours away but absolutely worth the trip.',
    icon: <Mountain className="w-6 h-6" />,
    category: 'excursion',
  },
  {
    name: 'Cenote Swimming',
    description: 'Swim in magical underground cenotes (natural sinkholes) with crystal-clear water. A unique Mexican experience!',
    icon: <Fish className="w-6 h-6" />,
    category: 'excursion',
  },
  {
    name: 'Snorkeling & Diving',
    description: 'Explore the Mesoamerican Barrier Reef, the second-largest reef system in the world. Perfect for beginners and experts alike.',
    icon: <Waves className="w-6 h-6" />,
    category: 'excursion',
  },
];

const nearbyAttractions: Activity[] = [
  {
    name: 'Downtown Cancun',
    description: 'Explore the local markets, authentic restaurants, and vibrant culture of Cancun\'s downtown area.',
    icon: <ShoppingBag className="w-6 h-6" />,
    category: 'nearby',
  },
  {
    name: 'Hotel Zone',
    description: 'Visit Cancun\'s famous Hotel Zone for shopping, dining, and nightlife along the beautiful lagoon.',
    icon: <Camera className="w-6 h-6" />,
    category: 'nearby',
  },
  {
    name: 'Xcaret Park',
    description: 'An eco-archaeological park with snorkeling, wildlife, and cultural shows. A full day of fun!',
    icon: <Palmtree className="w-6 h-6" />,
    category: 'nearby',
  },
  {
    name: 'Tulum Ruins',
    description: 'Ancient Mayan ruins perched on a cliff overlooking the Caribbean Sea. About 2 hours south.',
    icon: <Mountain className="w-6 h-6" />,
    category: 'nearby',
  },
];

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ocean-caribbean/10 flex items-center justify-center text-ocean-caribbean">
              {activity.icon}
            </div>
            <CardTitle className="text-lg">{activity.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sand-dark text-sm leading-relaxed">
            {activity.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ThingsToDoPage() {
  return (
    <PassportPage pageNumber={5}>
      <PageHeader
        title="Things to Do"
        subtitle="Make the most of your time in paradise"
      />

      <Section>
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-lg text-sand-dark leading-relaxed">
            While we'll have planned events throughout the wedding weekend, we encourage you 
            to extend your stay and explore all that Cancun has to offer!
          </p>
        </motion.div>

        {/* Resort Activities */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-heading text-ocean-deep mb-6"
          >
            At the Resort
          </motion.h2>
          <p className="text-sand-dark mb-6">
            Dreams Playa Mujeres is an all-inclusive resort with endless activities. 
            Everything below is included with your stay!
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resortActivities.map((activity, index) => (
              <ActivityCard key={activity.name} activity={activity} index={index} />
            ))}
          </div>
        </div>

        {/* Day Trips & Excursions */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-heading text-ocean-deep mb-6"
          >
            Day Trips & Excursions
          </motion.h2>
          <p className="text-sand-dark mb-6">
            Looking for adventure? These popular excursions can be booked through 
            the resort concierge or various tour operators.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {excursions.map((activity, index) => (
              <ActivityCard key={activity.name} activity={activity} index={index} />
            ))}
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-heading text-ocean-deep mb-6"
          >
            Nearby Attractions
          </motion.h2>
          <p className="text-sand-dark mb-6">
            Venture beyond the resort to discover more of what the Yucatan Peninsula has to offer.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {nearbyAttractions.map((activity, index) => (
              <ActivityCard key={activity.name} activity={activity} index={index} />
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-ocean-deep text-sand-pearl">
            <CardContent className="p-8">
              <h3 className="text-xl font-heading mb-4">Pro Tips from the Couple</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-gold">★</span>
                  <span>Book excursions in advance, especially Chichen Itza tours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">★</span>
                  <span>Use reef-safe sunscreen to protect the beautiful marine life</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">★</span>
                  <span>The resort's unlimited dining is amazing - try a different restaurant each night!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">★</span>
                  <span>Consider extending your stay a few days before or after the wedding to fully enjoy the destination</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </PassportPage>
  );
}
