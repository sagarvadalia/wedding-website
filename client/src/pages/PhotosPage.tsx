import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { NextPageCTA } from '@/components/layout/NextPageCTA';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Heart, X, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Upload, Users } from 'lucide-react';

const GOOGLE_PHOTOS_ALBUM_URL = 'https://photos.app.goo.gl/bAu9CCMBZ6sw4LQH6';

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: 'couple' | 'lovedones' | 'guest';
}

const photoCategories = [
  { id: 'lovedones', name: 'Loved Ones', icon: Users },
  { id: 'couple', name: 'Treasured Moments', icon: Camera },
  { id: 'guest', name: 'Guest Uploads', icon: Upload },
] as const;

const photos: Photo[] = [
  { id: '1', src: '/images/the-parents.avif', alt: 'Parents', category: 'lovedones' },
  { id: '2', src: '/images/the-family.avif', alt: 'Family', category: 'lovedones' },
  { id: '3', src: '/images/cosmo.avif', alt: 'Cosmo', category: 'lovedones' },
  { id: '4', src: '/images/best-friends.avif', alt: 'Best Friends', category: 'lovedones' },
  { id: '5', src: '/images/coldplay.avif', alt: 'Coldplay with Laura', category: 'lovedones' },
  { id: '6', src: '/images/cousins.avif', alt: 'Cousins', category: 'lovedones' },
  { id: '7', src: '/images/day-at-the-beach.avif', alt: 'Day at the Beach', category: 'couple' },
  { id: '8', src: '/images/skiing.avif', alt: 'Skiing', category: 'couple' },
  { id: '10', src: '/images/jasons-wedding.avif', alt: 'Graces family', category: 'lovedones' },
  { id: '11', src: '/images/foam-party.avif', alt: 'Foam Party', category: 'lovedones' },
  { id: '12', src: '/images/birthday.avif', alt: 'Birthday Party', category: 'lovedones' },
  { id: '13', src: '/images/pottery.avif', alt: 'Pottery together', category: 'couple' },
  { id: '14', src: '/images/snorkeling.avif', alt: 'Snorkeling', category: 'couple' },
  { id: '15', src: '/images/antelope-canyon.avif', alt: 'Antelope Canyon', category: 'couple' },
  { id: '16', src: '/images/arizona.avif', alt: 'Arizona', category: 'couple' },
  { id: '17', src: '/images/elephant.avif', alt: 'Elephant', category: 'couple' },
  { id: '18', src: '/images/halloween.avif', alt: 'Halloween', category: 'couple' },
  { id: '19', src: '/images/new-york.avif', alt: 'New York', category: 'couple' },
  { id: '20', src: '/images/pizza.avif', alt: 'Pizza', category: 'couple' },
  { id: '21', src: '/images/spa-day.avif', alt: 'Spa Day', category: 'couple' },
  { id: '22', src: '/images/night-spa-swim.avif', alt: 'Night Spa Swim', category: 'couple' },
  { id: '23', src: '/images/bao.avif', alt: 'Bao', category: 'lovedones' },
  { id: '24', src: '/images/cruise-kids.avif', alt: 'cruise kids!', category: 'lovedones' },
  {id: '47', src: 'images/cosmostare.avif', alt: 'cosmo', category: 'lovedones' },
  { id: '25', src: '/images/hershey.avif', alt: 'Hershey Park', category: 'lovedones' },
  { id: '26', src: '/images/theBoys.avif', alt: 'The Boys', category: 'lovedones' },
  { id: '27', src: '/images/grandparents.avif', alt: 'Grandparents', category: 'lovedones' },
  { id: '28', src: '/images/Laura.avif', alt: 'Laura and Grace', category: 'lovedones' },
  {id: '29', src: '/images/autumn.avif', alt: 'Autumn and Grace', category: 'lovedones' },
  {id: '30', src: '/images/childhood-friends.avif', alt: 'Once upon a time', category: 'lovedones' },
  {id: '31', src: '/images/thefamily.avif', alt: 'The Family', category: 'lovedones' },
  {id: '32', src: '/images/swimming-with-bapuji.avif', alt: 'At the pool with Bapuji', category: 'lovedones' },
  {id: '33', src: '/images/bao-liana-young.avif', alt: 'young friends', category: 'lovedones' },
  {id: '34', src: '/images/friends.avif', alt: 'Friends', category: 'lovedones' },
  {id: '35', src: '/images/the-half.avif', alt: 'Half marathon with liana', category: 'lovedones' },
  {id: '36', src: '/images/the-three-musketeers.avif', alt: 'The Three Musketeers', category: 'lovedones' },
  {id: '37', src: 'images/marlon.avif', alt: 'Marlon', category: 'lovedones' },
  {id: '38', src: 'images/family-old.avif', alt: 'Family Old', category: 'lovedones' },
  {id: '39', src: 'images/sagar-aakash.avif', alt: 'sagar and aakash', category: 'lovedones' },
  {id: '40', src: 'images/binal-graduation.avif', alt: 'binal graduation', category: 'lovedones' },
  {id: '41', src: 'images/greece.avif', alt: 'greece', category: 'couple' },
  {id: '42', src: 'images/atv.avif', alt: 'atv ride', category: 'couple' },
  {id: '43', src: 'images/top-golf.avif', alt: 'top golf', category: 'lovedones' },
  {id: '44', src: 'images/swimming.avif', alt: 'swimming', category: 'couple' },
  {id: '45', src: 'images/christmas.avif', alt: 'christmas', category: 'couple' },
  {id: '46', src: 'images/snorklin.avif', alt: 'snorkling in cancun', category: 'couple' },
  {id: '48', src: 'images/cosmohi.avif', alt: 'cosmo', category: 'lovedones' },
  {id: '49', src: 'images/michael.avif', alt: 'Michael', category: 'lovedones' },
  {id: '50', src: 'images/nighttime-couple.avif', alt: 'nighttime biking', category: 'couple' },
  {id: '51', src: 'images/old-photo.avif', alt: 'old photos', category: 'couple' },
  {id: '52', src: 'images/couple-nyc-skyline.avif', alt: 'nyc skyline', category: 'couple' },
  {id: '53', src: 'images/some-friends.avif', alt: 'friends at central park', category: 'lovedones' },
  {id: '54', src: 'images/moon-palace.avif', alt: 'moon palace', category: 'couple' },
{id: '55', src: 'images/aunt.avif', alt: 'aunt', category: 'lovedones' },
{id: '56', src: 'images/niagara.avif', alt: 'Niagara Falls', category: 'couple' },
 ];

export function PhotosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredPhotos = useMemo(
    () => selectedCategory === 'all'
      ? photos
      : photos.filter(p => p.category === selectedCategory),
    [selectedCategory],
  );

  const openLightbox = (photo: Photo, index: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
  };

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(newIndex);
    setLightboxPhoto(filteredPhotos[newIndex] ?? null);
  }, [lightboxIndex, filteredPhotos]);

  useEffect(() => {
    if (!lightboxPhoto) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxPhoto, navigateLightbox]);

  return (
    <>
    <PassportPage pageNumber={8}>
      <PageHeader
        title="Photo Gallery"
        subtitle="Memories from our journey together"
      />

      <Section>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="rounded-full"
          >
            All Photos
          </Button>
          {photoCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                className="aspect-square cursor-pointer group"
                onClick={() => openLightbox(photo, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(photo, index);
                  }
                }}
              >
                <Card className="h-full overflow-hidden">
                  <CardContent className="p-0 h-full relative">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-ocean-deep/0 group-hover:bg-ocean-deep/30 transition-colors duration-300 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Share Your Photos CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-linear-to-r from-ocean-deep to-ocean-caribbean text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center relative">
              <div className="relative z-10">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl md:text-3xl font-heading mb-4">
                  Share Your Photos!
                </h3>
                <p className="text-sand-pearl/90 max-w-2xl mx-auto mb-6 leading-relaxed">
                  We'd love to see the wedding through your eyes! Upload your photos from the celebration 
                  and help us create a complete album of our special day.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-ocean-deep hover:bg-sand-pearl"
                    asChild
                  >
                    <a href={GOOGLE_PHOTOS_ALBUM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 shrink-0" />
                      Add Your Photos
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <a href={GOOGLE_PHOTOS_ALBUM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      <ExternalLink className="w-5 h-5 mr-2 shrink-0" />
                      View Shared Album
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <NextPageCTA
          nextPath="/faq"
          nextLabel="Read the FAQ"
          teaser="Have questions?"
        />
      </Section>

    </PassportPage>

      {/* Lightbox — portaled to document.body to escape ancestor transforms that break fixed positioning */}
      {createPortal(
        <AnimatePresence>
          {lightboxPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-sand-pearl transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                className="absolute left-4 text-white hover:text-sand-pearl transition-colors z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                className="absolute right-4 text-white hover:text-sand-pearl transition-colors z-10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-10 h-10" />
              </button>

              <motion.div
                key={lightboxPhoto.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex items-center justify-center mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {lightboxPhoto.src ? (
                  <img
                    src={lightboxPhoto.src}
                    alt={lightboxPhoto.alt}
                    decoding="async"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="aspect-video max-w-4xl w-full bg-linear-to-br from-ocean-deep to-ocean-caribbean rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-heading">Photo Coming Soon</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="absolute bottom-4 text-white text-sm">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
