'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';

const FALLBACK_IMAGES = [
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200'
];

function isVideo(url) {
 if (!url) return false;
 return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);
}

export function PropertyGallery({ property }) {
 const [index, setIndex] = useState(0);
 
 // Conditional: use real images/videos if available, fall back to stock photos
 const hasRealMedia = property?.images && property.images.length > 0;
 const displayImages = hasRealMedia ? property.images : FALLBACK_IMAGES;
 const title = property?.title || 'Property';

 const next = () => setIndex((i) => (i + 1) % displayImages.length);
 const prev = () => setIndex((i) => (i - 1 + displayImages.length) % displayImages.length);

 const currentMedia = displayImages[index];
 const currentIsVideo = isVideo(currentMedia);

 return (
 <div className="space-y-6">
 {/* Main Display */}
 <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/5 premium-shadow group">
 <AnimatePresence mode="wait">
 {currentIsVideo ? (
 <motion.video
 key={`video-${index}`}
 src={currentMedia}
 controls
 autoPlay
 muted
 loop
 initial={{ opacity: 0, scale: 1.1 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="w-full h-full object-cover"
 />
 ) : (
 <motion.img
 key={`img-${index}`}
 src={currentMedia}
 alt={`${title} - ${index + 1}`}
 initial={{ opacity: 0, scale: 1.1 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="w-full h-full object-cover"
 />
 )}
 </AnimatePresence>

 {/* Overlays */}
 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
 
 {/* Navigation Buttons */}
 {displayImages.length > 1 && (
 <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
 <button 
 onClick={prev}
 className="p-4 rounded-2xl glass-effect text-white hover:bg-primary transition-all hover:scale-110"
 >
 <ChevronLeft className="w-6 h-6" />
 </button>
 <button 
 onClick={next}
 className="p-4 rounded-2xl glass-effect text-white hover:bg-primary transition-all hover:scale-110"
 >
 <ChevronRight className="w-6 h-6" />
 </button>
 </div>
 )}

 {/* Info Overlay */}
 <div className="absolute bottom-10 left-10 flex items-center space-x-4">
 <div className="glass-effect rounded-2xl px-6 py-3 border-white/10">
 <span className="text-xs font-black text-white uppercase tracking-widest">
 {index + 1} / {displayImages.length} {hasRealMedia ? 'Media' : 'Preview Photos'}
 </span>
 </div>
 <button className="glass-effect p-3 rounded-2xl text-white hover:scale-110 transition-transform">
 <Maximize2 className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Thumbnails */}
 {displayImages.length > 1 && (
 <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
 {displayImages.map((media, i) => (
 <button
 key={i}
 onClick={() => setIndex(i)}
 className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
 index === i ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-transparent opacity-40 hover:opacity-100'
 }`}
 >
 {isVideo(media) ? (
 <div className="w-full h-full bg-black/50 flex items-center justify-center">
 <Play className="w-6 h-6 text-white" />
 </div>
 ) : (
 <img src={media} className="w-full h-full object-cover" alt="thumbnail" />
 )}
 </button>
 ))}
 </div>
 )}
 </div>
 );
}