import { useCallback, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuestOptional } from '@/contexts/GuestContext';

/* ─── Nav structure ─────────────────────────────────────────────── */

interface NavItem {
  path: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Our Story',
    items: [
      { path: '/our-story', label: 'Our Story' },
      { path: '/the-cast', label: 'The Cast' },
    ],
  },
  {
    label: 'The Wedding',
    items: [
      { path: '/events', label: 'Events' },
      { path: '/travel', label: 'Travel' },
      { path: '/things-to-do', label: 'Things to Do' },
    ],
  },
  {
    label: 'Guest',
    items: [
      { path: '/photos', label: 'Photos' },
      { path: '/faq', label: 'FAQ' },
    ],
  },
];

/* ─── Desktop dropdown ──────────────────────────────────────────── */

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [trackedPath, setTrackedPath] = useState(pathname);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGroupActive = group.items.some((i) => pathname === i.path);

  // Close dropdown when route changes
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (open) setOpen(false);
  }

  const handleEnter = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ocean-deep',
          isGroupActive
            ? 'text-ocean-deep bg-sand-pearl'
            : 'text-sand-pearl/80 hover:text-sand-pearl hover:bg-ocean-caribbean/30'
        )}
      >
        {group.label}
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 pt-1 min-w-[180px] bg-ocean-deep/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50"
          >
            {group.items.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'block px-4 py-2.5 text-sm transition-colors',
                    active
                      ? 'bg-sand-pearl text-ocean-deep font-medium'
                      : 'text-sand-pearl/90 hover:bg-ocean-caribbean/30 hover:text-sand-pearl'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Navigation ───────────────────────────────────────────── */

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const guestContext = useGuestOptional();

  const handleLogout = () => {
    guestContext?.logout();
    navigate('/');
    setIsOpen(false);
  };

  const rsvpLabel = guestContext?.group ? 'My RSVP' : 'RSVP';
  const rsvpActive = location.pathname === '/rsvp';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden md:block bg-ocean-deep/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-heading text-sm">S&G</span>
              </div>
              <span className="text-sand-pearl font-heading text-lg hidden lg:block group-hover:text-gold transition-colors">
                Sagar & Grace
              </span>
            </Link>

            {/* Spacer: pushes nav + account to the right */}
            <div className="flex-1 min-w-0" />

            {/* Right: Nav groups + RSVP + Account */}
            <div className="flex items-center gap-2 shrink-0">
              {navGroups.map((group) => (
                <NavDropdown key={group.label} group={group} pathname={location.pathname} />
              ))}

              {/* Standalone RSVP link */}
              <Link
                to="/rsvp"
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ocean-deep',
                  rsvpActive
                    ? 'text-ocean-deep bg-sand-pearl'
                    : 'text-sand-pearl/80 hover:text-sand-pearl hover:bg-ocean-caribbean/30'
                )}
              >
                {rsvpLabel}
              </Link>

              {guestContext?.group && (
                <div className="flex items-center gap-2 ml-5">
                  <span className="text-sm text-sand-pearl/90">
                    {guestContext.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-sand-pearl/70 hover:text-sand-pearl hover:bg-ocean-caribbean/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ocean-deep"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Mobile header */}
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-ocean-deep/95 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Guest account section */}
                {guestContext?.group && (
                  <>
                    <p className="px-4 py-2 text-sand-pearl/90 text-sm font-medium">
                      {guestContext.displayName}
                    </p>
                    <Link
                      to="/rsvp"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-md font-medium',
                        rsvpActive
                          ? 'bg-sand-pearl text-ocean-deep'
                          : 'text-sand-pearl hover:bg-ocean-caribbean/30'
                      )}
                    >
                      My RSVP
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-md font-medium text-sand-pearl hover:bg-ocean-caribbean/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                    <div className="border-t border-sand-pearl/20 my-2" />
                  </>
                )}

                {/* Grouped nav sections */}
                {navGroups.map((group, gi) => (
                  <div key={group.label}>
                    <p className="px-4 pt-3 pb-1 text-xs text-sand-pearl/50 uppercase tracking-wider font-medium">
                      {group.label}
                    </p>
                    {group.items.map((item, ii) => {
                      const active = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (gi * 3 + ii) * 0.04 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'block px-6 py-2.5 rounded-md transition-colors font-medium',
                              active
                                ? 'bg-sand-pearl text-ocean-deep'
                                : 'text-sand-pearl hover:bg-ocean-caribbean/30'
                            )}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}

                {/* Standalone RSVP */}
                <div className="border-t border-sand-pearl/20 my-2" />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/rsvp"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-md transition-colors font-medium',
                      rsvpActive
                        ? 'bg-sand-pearl text-ocean-deep'
                        : 'text-gold hover:bg-ocean-caribbean/30'
                    )}
                  >
                    {rsvpLabel}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
