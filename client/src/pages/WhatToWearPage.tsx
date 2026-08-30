import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Shirt } from 'lucide-react';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { NextPageCTA } from '@/components/layout/NextPageCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  eventOutfitGuides,
  googleMapsSearchUrl,
  proOutfitTips,
  shoppingAreas,
  shoppingIntro,
  type OutfitSide,
} from '@/data/outfits';

function OutfitImage({ side, label }: { side: OutfitSide; label: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-sand-pearl/40 border border-sand-driftwood/20">
      {!hasError ? (
        <img
          src={side.imageSrc}
          alt={side.imageAlt}
          className="h-full w-full object-cover object-top"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
          <Shirt className="h-10 w-10 text-ocean-caribbean/60" aria-hidden="true" />
          <p className="text-sm font-medium text-ocean-deep/70">Photo coming soon</p>
          <p className="text-xs text-sand-dark/70">{label}</p>
        </div>
      )}
    </div>
  );
}

function OutfitSideColumn({
  title,
  side,
}: {
  title: string;
  side: OutfitSide;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-heading text-ocean-deep">{title}</h4>
      <OutfitImage side={side} label={title} />
      <ul className="space-y-2">
        {side.tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-sand-dark">
            <Shirt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ocean-caribbean" aria-hidden="true" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhatToWearPage() {
  return (
    <PassportPage pageNumber={10}>
      <PageHeader
        title="What to Wear"
        subtitle="Our wedding spans multiple events with different vibes — here is a guide to help you plan outfits for each occasion."
      />

      <Section>
        <div className="space-y-16">
          {eventOutfitGuides.map((guide, index) => (
            <motion.section
              key={guide.eventId}
              id={guide.eventId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="overflow-hidden">
                <div className={`h-2 bg-linear-to-r ${guide.accent}`} />
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{guide.name}</CardTitle>
                  <p className="text-xs font-medium uppercase tracking-wider text-ocean-deep/90">
                    {guide.dressCode}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-10 md:grid-cols-2">
                    <OutfitSideColumn title="For her" side={guide.her} />
                    <OutfitSideColumn title="For him" side={guide.him} />
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pro Tips</CardTitle>
              <p className="text-xs font-medium uppercase tracking-wider text-ocean-deep/90">
                All Events
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {proOutfitTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-sand-dark">
                    <Shirt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ocean-caribbean" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="mb-3 text-center text-2xl font-heading text-sand-pearl">
            Where to Shop
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sand-pearl/90">
            {shoppingIntro}
          </p>

          <div className="space-y-12">
            {shoppingAreas.map((area) => (
              <div key={area.id}>
                <h3 className="mb-2 text-xl font-heading text-sand-pearl">{area.label}</h3>
                <p className="mb-6 text-sm text-sand-pearl/80">{area.blurb}</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {area.stores.map((store) => (
                    <Card key={store.name} className="h-full">
                      <CardContent className="flex h-full flex-col gap-3 p-5">
                        <h4 className="font-heading text-lg text-ocean-deep">{store.name}</h4>
                        <p className="flex items-start gap-2 text-sm text-sand-dark">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean-caribbean" aria-hidden="true" />
                          <span>{store.address}</span>
                        </p>
                        <p className="flex-1 text-sm text-sand-dark/90">{store.note}</p>
                        <a
                          href={googleMapsSearchUrl(store.mapsQuery)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-caribbean hover:text-ocean-deep transition-colors"
                        >
                          Open in Google Maps
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <NextPageCTA
          nextPath="/faq"
          nextLabel="Read the FAQ"
          teaser="Still have questions about the wedding?"
        />
      </Section>
    </PassportPage>
  );
}
