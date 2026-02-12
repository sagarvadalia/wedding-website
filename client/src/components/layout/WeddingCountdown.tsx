import { useState, useEffect } from 'react';

const WEDDING_DATE = new Date('2027-04-02T00:00:00');

function getDaysUntil(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  const diff = t.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface WeddingCountdownProps {
  variant?: 'inline' | 'standalone';
  className?: string;
}

export function WeddingCountdown({ variant = 'standalone', className = '' }: WeddingCountdownProps) {
  const [days, setDays] = useState<number>(() => getDaysUntil(WEDDING_DATE));

  useEffect(() => {
    const tick = () => setDays(getDaysUntil(WEDDING_DATE));
    tick();
    const id = setInterval(tick, 60 * 60 * 1000); // update hourly
    return () => clearInterval(id);
  }, []);

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
