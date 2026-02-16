import { useState, useEffect } from 'react';

const WEDDING_DATE = new Date('2027-04-02T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getDaysUntil(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  const diff = t.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface WeddingCountdownProps {
  variant?: 'inline' | 'standalone' | 'hero' | 'heroOverlay';
  className?: string;
}

export function WeddingCountdown({ variant = 'standalone', className = '' }: WeddingCountdownProps) {
  const [days, setDays] = useState<number>(() => getDaysUntil(WEDDING_DATE));
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(WEDDING_DATE));

  useEffect(() => {
    if (variant === 'hero' || variant === 'heroOverlay') {
      const tick = () => setTimeLeft(getTimeLeft(WEDDING_DATE));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    } else {
      const tick = () => setDays(getDaysUntil(WEDDING_DATE));
      tick();
      const id = setInterval(tick, 60 * 60 * 1000);
      return () => clearInterval(id);
    }
  }, [variant]);

  const isPast = days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const isHeroVariant = variant === 'hero' || variant === 'heroOverlay';
  const isOverlay = variant === 'heroOverlay';

  if (isHeroVariant) {
    if (isPast) {
      return (
        <div className={`text-center ${className}`}>
          <p className="text-2xl md:text-3xl font-heading text-gold">
            We said I do!
          </p>
        </div>
      );
    }

    const segments: { value: number; label: string }[] = [
      { value: timeLeft.days, label: 'Days' },
      { value: timeLeft.hours, label: 'Hours' },
      { value: timeLeft.minutes, label: 'Minutes' },
      { value: timeLeft.seconds, label: 'Seconds' },
    ];

    const subtitleClass = isOverlay ? 'text-white/80' : 'text-sand-dark/80';
    const valueClass = isOverlay ? 'text-white' : 'text-ocean-deep';
    const labelClass = isOverlay ? 'text-white/70' : 'text-sand-dark';
    const colonClass = isOverlay ? 'text-gold' : 'text-gold';

    return (
      <div className={`text-center ${className}`}>
        <p className={`text-sm uppercase tracking-widest mb-3 ${subtitleClass}`}>
          Counting down to forever
        </p>
        <div className="flex items-center justify-center gap-3 md:gap-5">
          {segments.map((seg, i) => (
            <div key={seg.label} className="flex items-center gap-3 md:gap-5">
              <div className="flex flex-col items-center">
                <span className={`text-3xl md:text-5xl font-heading tabular-nums leading-none ${valueClass}`}>
                  {String(seg.value).padStart(2, '0')}
                </span>
                <span className={`text-[10px] md:text-xs uppercase tracking-wider mt-1 ${labelClass}`}>
                  {seg.label}
                </span>
              </div>
              {i < segments.length - 1 && (
                <span className={`text-2xl md:text-4xl font-light -mt-4 ${colonClass}`}>:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const text =
    days > 0
      ? `${days} day${days === 1 ? '' : 's'} until we say I do`
      : "We said I do!";

  if (variant === 'inline') {
    return (
      <span className={className}>
        {text}
      </span>
    );
  }

  return (
    <p className={`text-sm text-sand-pearl/70 ${className}`}>
      {text}
    </p>
  );
}
