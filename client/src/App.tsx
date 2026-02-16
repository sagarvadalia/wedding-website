import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GuestProvider } from '@/contexts/GuestContext';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AudioPlayer } from '@/components/layout/AudioPlayer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { PageTransition } from '@/components/layout/PageTransition';
import { HomePage } from '@/pages/HomePage';
import { OurStoryPage } from '@/pages/OurStoryPage';
import { EventsPage } from '@/pages/EventsPage';
import { TravelPage } from '@/pages/TravelPage';
import { ThingsToDoPage } from '@/pages/ThingsToDoPage';
import { PhotosPage } from '@/pages/PhotosPage';
import { RsvpPage } from '@/pages/RsvpPage';
import { FaqPage } from '@/pages/FaqPage';
import { AdminPage } from '@/pages/AdminPage';
import { CastPage } from '@/pages/CastPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/** Inner page routes with animated transitions. */
function AnimatedPages() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/our-story" element={<PageTransition><OurStoryPage /></PageTransition>} />
        <Route path="/the-cast" element={<PageTransition><CastPage /></PageTransition>} />
        <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
        <Route path="/travel" element={<PageTransition><TravelPage /></PageTransition>} />
        <Route path="/things-to-do" element={<PageTransition><ThingsToDoPage /></PageTransition>} />
        <Route path="/photos" element={<PageTransition><PhotosPage /></PageTransition>} />
        <Route path="/rsvp" element={<PageTransition><RsvpPage /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FaqPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Public layout: Navigation, AudioPlayer, Footer all persist across page
 * navigations so audio playback is never interrupted.
 * On the home page, navbar and footer are hidden so the passport is the only entry point.
 */
function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isRsvpPage = location.pathname === '/rsvp';
  const showChrome = !isHomePage;
  const showFooter = showChrome && !isRsvpPage;

  return (
    <>
      {showChrome && <Navigation />}
      <AudioPlayer />
      <main className="flex-1">
        <AnimatedPages />
      </main>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GuestProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </div>
      </GuestProvider>
    </BrowserRouter>
  );
}

export default App;
