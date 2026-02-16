import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Minimize (dismiss prompt) when user clicks outside the player UI (e.g. passport, navbar)
  useEffect(() => {
    if (!showPrompt || hasInteracted) return;

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target instanceof Node ? e.target : null;
      if (playerContainerRef.current && target && !playerContainerRef.current.contains(target)) {
        setShowPrompt(false);
        setHasInteracted(true);
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [showPrompt, hasInteracted]);

  // Handle audio loading and errors
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      setAudioError(false);
    };

    const handleError = () => {
      setAudioError(true);
      setIsLoaded(false);
      console.error('Audio file failed to load. Make sure lucky.mp3 exists in public/music/');
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Try to autoplay when component mounts and audio is loaded
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    // Check if user previously enabled music
    const savedPreference = localStorage.getItem('wedding-music-enabled');
    
    if (savedPreference === 'true') {
      // Try to play automatically
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowPrompt(false);
            setHasInteracted(true);
          })
          .catch(() => {
            // Autoplay was prevented, show prompt
            setShowPrompt(true);
          });
      }
    }
  }, [isLoaded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem('wedding-music-enabled', 'false');
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
        setShowPrompt(false);
        localStorage.setItem('wedding-music-enabled', 'true');
      }).catch((err) => {
        console.error('Failed to play audio:', err);
      });
    }
  };

  const handlePromptClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioError) {
      console.error('Cannot play - audio file not found');
      return;
    }

    audio.play().then(() => {
      setIsPlaying(true);
      setHasInteracted(true);
      setShowPrompt(false);
      localStorage.setItem('wedding-music-enabled', 'true');
    }).catch((err) => {
      console.error('Failed to play audio:', err);
      setAudioError(true);
    });
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    setHasInteracted(true);
    localStorage.setItem('wedding-music-enabled', 'false');
  };

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/lucky.mp3"
      />

      {/* Wrapper for click-outside: only the prompt and button are "inside"; pointer-events-none so wrapper doesn't block clicks */}
      <div
        ref={playerContainerRef}
        className="fixed inset-0 pointer-events-none z-50"
        aria-hidden
      >
        {/* Initial prompt to enable music */}
        <AnimatePresence>
          {showPrompt && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto"
            >
            <div className="bg-ocean-deep/95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                {audioError ? (
                  <AlertCircle className="w-6 h-6 text-coral" />
                ) : (
                  <Music className="w-6 h-6 text-gold" />
                )}
              </div>
              <div className="text-left">
                {audioError ? (
                  <>
                    <p className="font-medium text-coral">Audio not available</p>
                    <p className="text-sm text-sand-pearl/70">Add lucky.mp3 to public/music/</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Play our song?</p>
                    <p className="text-sm text-sand-pearl/70">"Lucky" by Jason Mraz</p>
                  </>
                )}
              </div>
              {!audioError && (
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={handlePromptClick}
                    disabled={!isLoaded}
                    className="px-4 py-2 bg-gold text-ocean-deep rounded-full text-sm font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoaded ? 'Play' : 'Loading...'}
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    No thanks
                  </button>
                </div>
              )}
              {audioError && (
                <button
                  onClick={dismissPrompt}
                  className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors ml-2"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Floating control button */}
        {hasInteracted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={togglePlay}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-ocean-deep/90 backdrop-blur-sm text-white shadow-lg hover:bg-ocean-deep transition-colors flex items-center justify-center group pointer-events-auto"
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1 bg-ocean-deep/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? 'Mute' : 'Play music'}
          </span>

          {/* Playing indicator animation */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-gold"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
        )}
      </div>
    </>
  );
}
