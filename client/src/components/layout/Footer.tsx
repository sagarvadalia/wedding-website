import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-ocean-deep text-sand-pearl">
      {/* Wavy top edge — extends above the footer boundary into the content area */}
      <div className="absolute -top-14 left-0 right-0 h-16 pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z"
            fill="#1E3A5F"
          />
        </svg>
      </div>

      <div className="relative pt-16 px-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          

          {/* Names with heart */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-heading text-2xl md:text-3xl">Sagar</span>
            <Heart className="w-6 h-6 text-coral fill-coral" />
            <span className="font-heading text-2xl md:text-3xl">Grace</span>
          </div>

          {/* Date */}
          <p className="text-lg text-sand-pearl/80 mb-2">
            April 2-5, 2027
          </p>
          <p className="text-sand-pearl/60 mb-8">
            Dreams Playa Mujeres • Cancun, Mexico
          </p>

          {/* Decorative line */}
          <div className="h-px w-32 mx-auto mb-8 gold-divider" />

          {/* Hashtag */}
          {/* <p className="text-gold font-medium mb-4">
            #SagarAndGrace2027
          </p> */}

          {/* Registry & Guestbook links */}
          <p className="text-sand-pearl/50 text-xs mb-6 max-w-sm mx-auto">
            Your presence is our gift.{' '}
            <a
              href="/registry"
              className="text-gold/80 hover:text-gold hover:underline transition-colors duration-200"
            >
              View our registry
            </a>
            {' · '}
            <a
              href="/guestbook"
              className="text-gold/80 hover:text-gold hover:underline transition-colors duration-200"
            >
              Sign the guestbook
            </a>
          </p>

         
        </div>
      </div>
    </footer>
  );
}
