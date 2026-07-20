'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200',
];

function isVideo(url) {
  return url ? /\.(mp4|m4v|webm|mov|mkv)(\?|$)/i.test(url) : false;
}

export function PropertyGallery({ property }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const hasRealMedia = property?.images && property.images.length > 0;
  const displayImages = hasRealMedia ? property?.images : FALLBACK_IMAGES;

  const next = useCallback(() => setIndex((i) => (i + 1) % displayImages.length), [displayImages.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + displayImages.length) % displayImages.length), [displayImages.length]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
      touchStartX.current = null;
    },
    [next, prev],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const currentMedia = displayImages[index];
  const currentIsVideo = isVideo(currentMedia);

  return (
    <div className="space-y-3 md:space-y-4">
      <div
        className="relative aspect-[16/10] md:aspect-[16/7] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {currentIsVideo ? (
            <motion.video
              key={`video-${index}`}
              src={currentMedia}
              controls
              autoPlay
              muted
              loop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.img
              key={`img-${index}`}
              src={currentMedia}
              alt={`${property?.title || 'Property'} - ${index + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Desktop nav arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/30 backdrop-blur text-white hover:bg-black/50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/30 backdrop-blur text-white hover:bg-black/50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur rounded-lg px-2.5 py-1 border border-white/10">
          <span className="text-[11px] font-bold text-white">
            {index + 1} / {displayImages.length}
          </span>
        </div>

        {/* Swipe hint on mobile */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 md:hidden flex gap-1">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? 'bg-white w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails strip (desktop only) */}
      {displayImages.length > 1 && (
        <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((media, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                index === i
                  ? 'border-primary scale-105'
                  : 'border-gray-200 opacity-60 hover:opacity-100'
              }`}
            >
              {isVideo(media) ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Play className="w-4 h-4 text-gray-500" />
                </div>
              ) : (
                <img
                  src={media}
                  alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
