// components/properties/PropertyCard.jsx
'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
 Heart, 
 MapPin, 
 BedDouble, 
 Bath, 
 Maximize, 
 ShieldCheck,
 ChevronRight,
 Sparkles,
 TrendingUp,
 Eye
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

import { 
 useLikePropertyMutation, 
 useUnlikePropertyMutation, 
 useCheckLikeStatusQuery 
} from '@/store/services/likeApi';

export function PropertyCard({ property, priority = false }) {
 const router = useRouter();
 const dispatch = useDispatch();
 const user = useSelector(selectCurrentUser);
 const userId = user?.uid;
 const [imageLoaded, setImageLoaded] = useState(false);

 if (!property) return null;

 const isRent = property.category === 'for-rent';
 const isVerified = property.status === 'verified' || property.isVerified;
 const imageUrl = property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop';
 
 const { data: likeData } = useCheckLikeStatusQuery(
 { user_id: userId, property_id: property.id },
 { skip: !property.id || !userId }
 );
 
 const [like] = useLikePropertyMutation();
 const [unlike] = useUnlikePropertyMutation();
 
 const isLiked = likeData?.data?.liked || false;
 const [localIsLiked, setLocalIsLiked] = useState(isLiked);

 useEffect(() => {
   setLocalIsLiked(isLiked);
 }, [isLiked]);

 const handleLikeToggle = async (e) => {
 e.preventDefault();
 e.stopPropagation();
 if (!userId) {
 router.push('/login');
 return;
 }

 // Responsive/Optimistic State Switch
 setLocalIsLiked(!localIsLiked);

 try {
 if (localIsLiked) {
 await unlike({ user_id: userId, property_id: property.id }).unwrap();
 } else {
 await like({ user_id: userId, property_id: property.id }).unwrap();
 }
 } catch (err) {
 // Revert UI to match actual DB state on failure
 setLocalIsLiked(localIsLiked);
 console.error('Failed to toggle like:', err);
 dispatch(showModal({
   type: 'error',
   title: 'Acquisition Failed',
   message: 'Could not sync favorites with the database. Please try again.',
   actionText: 'Retry'
 }));
 }
 };

 // Format specs safely
 const bedrooms = property.specifications?.bedrooms || property.bedrooms || 0;
 const bathrooms = property.specifications?.bathrooms || property.bathrooms || 0;
 const area = property.specifications?.area_sqm || property.specifications?.area || property.area || 0;
 
 // Get location safely
 const locationText = property.location?.quarter 
 ? `${property.location.quarter}, ${property.location.city || 'Cameroon'}`
 : property.location || property.city || 'Cameroon';

 return (
 <motion.div 
 whileHover={{ y: -12 }}
 transition={{ duration: 0.3, ease: "easeOut" }}
 className="group relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 premium-shadow"
 >
 {/* Visual Header */}
 <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
 {/* Optimized Image with Next.js */}
 <div className="relative w-full h-full">
 <Image
 src={imageUrl}
 alt={property.title || 'Property'}
 fill
 priority={priority}
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className={`
 object-cover transition-all duration-1000
 group-hover:scale-110
 ${imageLoaded ? 'blur-0' : 'blur-sm scale-105'}
 `}
 onLoadingComplete={() => setImageLoaded(true)}
 />
 </div>
 
 {/* Skeleton loader while image loads */}
 {!imageLoaded && (
 <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
 )}
 
 {/* Glow Overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

 {/* Verification Overlay */}
 {isVerified && (
 <div className="absolute top-5 left-5 glass-effect px-4 py-2 rounded-2xl flex items-center space-x-2 border-primary/20 z-10">
 <div className="bg-primary p-1 rounded-lg emerald-glow">
 <ShieldCheck className="w-3.5 h-3.5 text-white" />
 </div>
 <span className="text-[11px] font-black uppercase tracking-widest text-primary-light">Verified</span>
 </div>
 )}

 {/* Category Badge */}
 <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 z-10">
 <div className="flex items-center space-x-1.5">
 <div className={`w-1.5 h-1.5 rounded-full ${isRent ? 'bg-blue-400' : 'bg-red-500'} animate-pulse`} />
 <span>{isRent ? 'For Rent' : 'For Sale'}</span>
 </div>
 </div>

 {/* Featured Badge (if property is featured) */}
 {property.isFeatured && (
 <div className="absolute bottom-5 left-5 bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-md px-4 py-2 rounded-2xl z-10">
 <div className="flex items-center space-x-1.5">
 <TrendingUp className="w-3 h-3 text-white" />
 <span className="text-[10px] font-black uppercase tracking-widest text-white">Featured</span>
 </div>
 </div>
 )}

 {/* Favorite Button - Enhanced with tooltip */}
 <button 
 onClick={handleLikeToggle}
 className={`
 absolute bottom-5 right-5 backdrop-blur-md p-3 rounded-2xl border 
 transition-all group/heart z-20
 ${localIsLiked 
 ? 'bg-red-500/20 border-red-500/30 text-red-500 shadow-lg shadow-red-500/20' 
 : 'bg-white/10 border-white/10 text-white/70 hover:bg-red-500/20 hover:border-red-500/30'
 }
 `}
 aria-label={localIsLiked ? 'Remove from favorites' : 'Add to favorites'}
 >
 <motion.div
   animate={{ scale: localIsLiked ? 1.25 : 1 }}
   transition={{ type: "spring", stiffness: 350, damping: 12 }}
 >
   <Heart className={`
   w-5 h-5 transition-all duration-300
   ${localIsLiked ? 'fill-current text-red-500' : 'text-white/70 group-hover/heart:text-red-500'}
   `} />
 </motion.div>
 </button>
 </div>

 {/* Content */}
 <div className="p-8 relative">
 <div className="flex justify-between items-start mb-6">
 <div className="flex-1">
 <h3 className="text-2xl font-bold text-white line-clamp-1 group-hover:text-primary-light transition-colors mb-2">
 {property.title}
 </h3>
 <div className="flex items-center text-gray-400">
 <MapPin className="w-4 h-4 mr-1.5 text-primary flex-shrink-0" />
 <span className="text-sm font-medium tracking-wide line-clamp-1">
 {locationText}
 </span>
 </div>
 </div>
 </div>

 {/* Specs Grid - Enhanced with hover effects */}
 <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-8">
 <div className="flex flex-col items-center group/spec">
 <BedDouble className="w-5 h-5 text-primary/40 mb-2 group-hover/spec:text-primary transition-colors" />
 <span className="text-xs font-bold text-white">{bedrooms} Bed{bedrooms !== 1 ? 's' : ''}</span>
 </div>
 <div className="flex flex-col items-center border-x border-white/5 group/spec">
 <Bath className="w-5 h-5 text-primary/40 mb-2 group-hover/spec:text-primary transition-colors" />
 <span className="text-xs font-bold text-white">{bathrooms} Bath{bathrooms !== 1 ? 's' : ''}</span>
 </div>
 <div className="flex flex-col items-center group/spec">
 <Maximize className="w-5 h-5 text-primary/40 mb-2 group-hover/spec:text-primary transition-colors" />
 <span className="text-xs font-bold text-white">{area.toLocaleString()} m²</span>
 </div>
 </div>

 {/* Bottom Actions */}
 <div className="flex items-center justify-between">
 <div className="flex flex-col">
 <div className="flex items-center space-x-1 mb-1">
 <Sparkles className="w-3 h-3 text-secondary" />
 <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
 {isRent ? 'Monthly' : 'Investment'}
 </span>
 </div>
 <div className="flex items-baseline gap-1">
 <span className="text-2xl font-black text-white">
 {formatPrice(property.price)}
 </span>
 {isRent && <span className="text-xs font-medium text-gray-400">/month</span>}
 </div>
 </div>
 
 <Link
 href={`/properties/${property.id}`}
 className="flex items-center space-x-2 bg-white/5 text-white px-5 py-4 rounded-2xl hover:bg-primary transition-all duration-300 border border-white/10 group/btn emerald-glow"
 >
 <span className="text-xs font-black uppercase tracking-widest px-1">Details</span>
 <div className="bg-white/10 p-1.5 rounded-xl group-hover/btn:bg-white/20 transition-all">
 <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
 </div>
 </Link>
 </div>

 {/* Quick View Badge - Optional enhancement */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
 <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
 <Eye className="w-4 h-4 text-primary" />
 <span className="text-xs font-bold text-white">Quick View</span>
 </div>
 </div>
 </div>
 </motion.div>
 );
}