import { motion } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent } from '@/components/ui/card';
import { CAST_MEMBERS } from '@/lib/constants';
import { Camera } from 'lucide-react';

function CastPhotoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="w-full aspect-3/4 bg-linear-to-br from-ocean-caribbean/20 to-ocean-deep/20 flex flex-col items-center justify-center border border-sand-driftwood/20 rounded-t-xl"
      aria-hidden
    >
      <Camera className="w-12 h-12 text-ocean-caribbean/50 mb-2" />
      <span className="text-sand-dark/50 text-sm text-center px-2">{name}</span>
    </div>
  );
}

export function CastPage() {
  return (
    <PassportPage pageNumber={6}>
      <PageHeader
        title="The Cast"
        subtitle="The people who make our story (and this weekend) unforgettable"
      />

      <Section>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sand-dark max-w-2xl mx-auto mb-12"
        >
          Meet the crew—our favorite humans who&apos;ll be by our side. Fun photos, silly titles, and the short version of why we love them.
        </motion.p>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Wedding party and cast members"
        >
          {CAST_MEMBERS.map((member, index) => (
            <motion.li
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="list-none"
              role="listitem"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Photo - fun, prominent */}
                  <div className="relative">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={`${member.name}, ${member.role}`}
                        className="w-full aspect-3/4 object-cover"
                      />
                    ) : (
                      <CastPhotoPlaceholder name={member.name} />
                    )}
                    {/* Role label - always visible */}
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-ocean-deep/90 text-sand-pearl shadow-md"
                      aria-label={`Role: ${member.role}`}
                    >
                      {member.role}
                    </span>
                  </div>
                  {/* Name + short blurb */}
                  <div className="p-4">
                    <h3 className="text-xl font-heading text-ocean-deep mb-2">
                      {member.name}
                    </h3>
                    <p className="text-sand-dark text-sm leading-relaxed">
                      {member.blurb}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </ul>
      </Section>
    </PassportPage>
  );
}
