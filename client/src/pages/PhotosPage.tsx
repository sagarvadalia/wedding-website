import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Heart, X, ChevronLeft, ChevronRight, Upload, ExternalLink } from 'lucide-react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: 'engagement' | 'couple' | 'venue' | 'guest';
}

// Placeholder photos - these would be replaced with actual photos
const photoCategories = [
  { id: 'engagement', name: 'Engagement', icon: Heart },
  { id: 'couple', name: 'Our Journey', icon: Camera },
  { id: 'venue', name: 'Venue', icon: Camera },
  { id: 'guest', name: 'Guest Uploads', icon: Upload },
] as const;

// Placeholder image URLs (using gradient placeholders)
const placeholderPhotos: Photo[] = [
  { id: '1', src: '', alt: 'Engagement photo 1', category: 'engagement' },
  { id: '2', src: '', alt: 'Engagement photo 2', category: 'engagement' },
  { id: '3', src: '', alt: 'Engagement photo 3', category: 'engagement' },
  { id: '4', src: '', alt: 'Couple photo 1', category: 'couple' },
  { id: '5', src: '', alt: 'Couple photo 2', category: 'couple' },
  { id: '6', src: '', alt: 'Couple photo 3', category: 'couple' },
  { id: '7', src: '', alt: 'Venue photo 1', category: 'venue' },
  { id: '8', src: '', alt: 'Venue photo 2', category: 'venue' },
  { id: '9', src: '', alt: 'Venue photo 3', category: 'venue' },
];

function PhotoPlaceholder({ index }: { index: number }) {
  const gradients = [
    'from-ocean-deep to-ocean-caribbean',
    'from-ocean-caribbean to-ocean-sky',
    'from-sand-warm to-sand-driftwood',
    'from-coral to-gold',
    'from-ocean-sky to-sand-pearl',
    'from-gold to-sand-warm',
  ];
  
  return (
    <div 
      className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}
    >
      <div className="text-center text-white/80">
        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">Photo Coming Soon</p>
      </div>
    </div>
  );
}

export function PhotosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredPhotos = selectedCategory === 'all' 
    ? placeholderPhotos 
    : placeholderPhotos.filter(p => p.category === selectedCategory);

  const openLightbox = (photo: Photo, index: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(newIndex);
    setLightboxPhoto(filteredPhotos[newIndex] ?? null);
  };

  return (
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
                className="aspect-square cursor-pointer group"
                onClick={() => openLightbox(photo, index)}
              >
                <Card className="h-full overflow-hidden">
                  <CardContent className="p-0 h-full relative">
                    {photo.src ? (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <PhotoPlaceholder index={index} />
                    )}
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
          <Card className="bg-gradient-to-r from-ocean-deep to-ocean-caribbean text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full" />
                <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full" />
              </div>
              
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
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Photos
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Shared Album
                  </Button>
                </div>
                <p className="text-sm text-sand-pearl/70 mt-4">
                  Use hashtag <span className="font-semibold">#SagarAndGrace2027</span> on social media
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photo Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sand-dark/70 text-sm">
            Photos from the wedding weekend will be uploaded after the celebration. 
            Check back soon for all the beautiful memories!
          </p>
        </motion.div>
      </Section>

      {/* Lightbox */}
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
              className="max-w-4xl max-h-[80vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxPhoto.src ? (
                <img
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.alt}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-ocean-deep to-ocean-caribbean rounded-lg flex items-center justify-center">
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
      </AnimatePresence>
    </PassportPage>
  );
}
