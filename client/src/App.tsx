import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { OurStoryPage } from '@/pages/OurStoryPage';
import { EventsPage } from '@/pages/EventsPage';
import { TravelPage } from '@/pages/TravelPage';
import { ThingsToDoPage } from '@/pages/ThingsToDoPage';
import { PhotosPage } from '@/pages/PhotosPage';
import { RsvpPage } from '@/pages/RsvpPage';
import { FaqPage } from '@/pages/FaqPage';
import { AdminPage } from '@/pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Home page has its own layout without nav */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin page has its own layout */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* All other pages with nav and footer */}
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <main className="flex-1 pt-16 md:pt-16">
                  <Routes>
                    <Route path="/our-story" element={<OurStoryPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/travel" element={<TravelPage />} />
                    <Route path="/things-to-do" element={<ThingsToDoPage />} />
                    <Route path="/photos" element={<PhotosPage />} />
                    <Route path="/rsvp" element={<RsvpPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
