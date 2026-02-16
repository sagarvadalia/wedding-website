import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Compass, Home, CalendarHeart } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-ocean-mist via-ocean-light to-ocean-sky flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="mb-6"
        >
          <Compass className="w-20 h-20 mx-auto text-ocean-caribbean opacity-60" />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-heading text-ocean-deep mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-heading text-ocean-caribbean mb-4">
          Looks like you've wandered off the map!
        </h2>
        <p className="text-ocean-deep/70 mb-8">
          This page doesn't exist — but our wedding celebration definitely does. Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="gold" size="lg" asChild>
            <Link to="/" className="inline-flex items-center">
              <Home className="w-4 h-4 mr-2 shrink-0" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/events" className="inline-flex items-center">
              <CalendarHeart className="w-4 h-4 mr-2 shrink-0" />
              View Events
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
