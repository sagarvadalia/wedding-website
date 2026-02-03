import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Home', pageNum: 1 },
  { path: '/our-story', label: 'Our Story', pageNum: 2 },
  { path: '/events', label: 'Events', pageNum: 3 },
  { path: '/travel', label: 'Travel', pageNum: 4 },
  { path: '/things-to-do', label: 'Things to Do', pageNum: 5 },
  { path: '/photos', label: 'Photos', pageNum: 6 },
  { path: '/rsvp', label: 'RSVP', pageNum: 7 },
  { path: '/faq', label: 'FAQ', pageNum: 8 },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop Navigation - Passport Tab Style */}
      <div className="hidden md:block bg-ocean-deep/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-heading text-sm">S&G</span>
              </div>
              <span className="text-sand-pearl font-heading text-lg hidden lg:block group-hover:text-gold transition-colors">
                Sagar & Grace
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-t-md',
                      isActive
                        ? 'text-ocean-deep bg-sand-pearl'
                        : 'text-sand-pearl/80 hover:text-sand-pearl hover:bg-ocean-caribbean/30'
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {/* Page number tab effect */}
                    <span 
                      className={cn(
                        'absolute -top-1 -right-1 text-[10px] font-mono',
                        isActive ? 'text-sand-dark' : 'text-sand-pearl/40'
                      )}
                    >
                      {link.pageNum}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-sand-pearl rounded-t-md -z-0"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-ocean-deep/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between h-14 px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-heading text-xs">S&G</span>
              </div>
              <span className="text-sand-pearl font-heading">Sagar & Grace</span>
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sand-pearl p-2 hover:bg-ocean-caribbean/30 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-ocean-deep/95 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-md transition-colors',
                          isActive
                            ? 'bg-sand-pearl text-ocean-deep'
                            : 'text-sand-pearl hover:bg-ocean-caribbean/30'
                        )}
                      >
                        <span className="font-medium">{link.label}</span>
                        <span className={cn(
                          'text-xs font-mono',
                          isActive ? 'text-sand-dark' : 'text-sand-pearl/40'
                        )}>
                          pg. {link.pageNum}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
