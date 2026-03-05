import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { NextPageCTA } from '@/components/layout/NextPageCTA';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HONEYMOON_FUND_VENMO_URL } from '@/lib/constants';
import { Heart, Gift, Palmtree, Plane } from 'lucide-react';

const honeymoonIdeas = [
  { icon: Plane, label: 'Flights' },
  { icon: Palmtree, label: 'Excursions' },
  { icon: Heart, label: 'Experiences' },
];

export function RegistryPage() {
  return (
    <PassportPage pageNumber={8}>
      <PageHeader
        title="Registry"
        subtitle="Your love and presence mean everything to us"
      />

      <Section>
        {/* Main messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <Gift className="w-8 h-8 text-gold" />
            </div>
          </div>
          <p className="text-lg text-sand-dark leading-relaxed mb-4">
            The greatest gift you can give us is celebrating with us in Mexico.
            We truly mean it&mdash;your presence is our present.
          </p>
          <p className="text-sand-dark/80 leading-relaxed">
            Since we&apos;re having a destination wedding, we kindly ask that you
            skip the boxed gifts. Hauling a toaster through customs is nobody&apos;s
            idea of a vacation!
          </p>
        </motion.div>

        {/* Honeymoon fund */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="max-w-xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-ocean-deep text-sand-pearl p-8 text-center">
                <h2 className="text-2xl font-heading mb-3">Honeymoon Fund</h2>
                <p className="text-sand-pearl/80 text-sm leading-relaxed mb-6">
                  If you&apos;d like to gift us something, we&apos;d love contributions
                  toward our honeymoon adventures. Every little bit helps us make
                  unforgettable memories together.
                </p>

                <div className="flex justify-center gap-8 mb-8">
                  {honeymoonIdeas.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-ocean-caribbean/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <span className="text-xs text-sand-pearl/70">{label}</span>
                    </div>
                  ))}
                </div>

                <Button variant="gold" size="lg" className="rounded-full" asChild>
                  <a
                    href={HONEYMOON_FUND_VENMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Contribute via Venmo
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <NextPageCTA
          nextPath="/guestbook"
          nextLabel="Sign the Guestbook"
          teaser="Leave us a message, photo, or voice note"
        />
      </Section>
    </PassportPage>
  );
}
