import { Heart } from 'lucide-react';
import { WeddingCountdown } from './WeddingCountdown';
import { HONEYMOON_FUND_VENMO_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative bg-ocean-deep text-sand-pearl overflow-hidden">
      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1440 100"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z"
            fill="currentColor"
            className="text-sand-pearl"
          />
        </svg>
      </div>

      <div className="relative pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <p className="text-sand-pearl/80 italic mb-2">
            With love, Sagar & Grace
          </p>
          <WeddingCountdown className="mb-4" />

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
          <div 
            className="h-[1px] w-32 mx-auto mb-8"
            style={{
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            }}
          />

          {/* Hashtag */}
          <p className="text-gold font-medium mb-4">
            #SagarAndGrace2027
          </p>

          {/* Optional honeymoon fund - subtle */}
          <p className="text-sand-pearl/50 text-xs mb-6 max-w-sm mx-auto">
            Your presence is our gift. If you'd like to contribute to our honeymoon,{' '}
            <a
              href={HONEYMOON_FUND_VENMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold hover:underline"
            >
              Venmo us here
            </a>
            .
          </p>

          {/* Copyright */}
          <p className="text-sm text-sand-pearl/40">
            © 2027 Sagar & Grace Wedding
          </p>
        </div>
      </div>
    </footer>
  );
}
