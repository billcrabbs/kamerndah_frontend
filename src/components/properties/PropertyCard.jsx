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
  TrendingUp,
} from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

import {
  useLikePropertyMutation,
  useUnlikePropertyMutation,
  useCheckLikeStatusQuery,
} from '@/store/services/likeApi';

export function PropertyCard({ property, priority = false }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userId = user?.uid;
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: likeData } = useCheckLikeStatusQuery(
    { user_id: userId, property_id: property?.id },
    { skip: !property?.id || !userId },
  );

  const [like] = useLikePropertyMutation();
  const [unlike] = useUnlikePropertyMutation();

  const isLiked = likeData?.data?.liked || false;
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  if (!property) return null;

  const isRent = property.category === 'for-rent';
  const isVerified = property.status === 'verified' || property.isVerified;
  const imageUrl =
    property.images?.[0] ||
    property.image ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop';

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      router.push('/login');
      return;
    }
    setLocalIsLiked(!localIsLiked);
    try {
      if (localIsLiked) {
        await unlike({ user_id: userId, property_id: property.id }).unwrap();
      } else {
        await like({ user_id: userId, property_id: property.id }).unwrap();
      }
    } catch {
      setLocalIsLiked(localIsLiked);
    }
  };

  const bedrooms =
    property.specifications?.bedrooms || property.bedrooms || 0;
  const bathrooms =
    property.specifications?.bathrooms || property.bathrooms || 0;
  const area =
    property.specifications?.area_sqm ||
    property.specifications?.area ||
    property.area ||
    0;

  const locationText = (() => {
    const loc = property.location;
    if (!loc) return property.city || 'Cameroon';
    if (typeof loc === 'object') {
      const parts = [];
      if (loc.quarter) parts.push(loc.quarter);
      if (loc.city) parts.push(loc.city);
      if (parts.length === 0 && loc.address) parts.push(loc.address);
      return parts.join(', ') || 'Cameroon';
    }
    return loc;
  })();

  const advantages = property.advantages || [];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-lg flex flex-col h-full"
    >
      <Link href={`/properties/${property.id}`} className="flex flex-col flex-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={property.title || 'Property'}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                'object-cover transition-all duration-700 group-hover:scale-105',
                imageLoaded ? 'blur-0' : 'blur-sm scale-105',
              )}
              onLoadingComplete={() => setImageLoaded(true)}
            />
          </div>

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Verified badge */}
          {isVerified && (
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 z-10 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                Verified
              </span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 z-10">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isRent ? 'bg-blue-400' : 'bg-amber-400',
                )}
              />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                {isRent ? 'Rent' : 'Sale'}
              </span>
            </div>
          </div>

          {/* Featured badge */}
          {property.isFeatured && (
            <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-lg z-10">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-white" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          {/* Title & Location */}
          <div className="mb-3">
            <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-500 gap-1 mt-1">
              <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-[11px] font-medium line-clamp-1">
                {locationText}
              </span>
            </div>
          </div>

          {/* Advantages pills */}
          {advantages.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {advantages.slice(0, 2).map((adv, i) => (
                <span
                  key={i}
                  className="text-[9px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md"
                >
                  {adv}
                </span>
              ))}
              {advantages.length > 2 && (
                <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                  +{advantages.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Specs Row */}
          <div className="flex items-center gap-3 py-2.5 border-t border-gray-100 mb-3">
            <div className="flex items-center gap-1.5 flex-1 justify-center border-r border-gray-100">
              <BedDouble className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-bold text-gray-900">
                {bedrooms}
                <span className="text-gray-400 font-medium ml-0.5">Bed</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 justify-center border-r border-gray-100">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-bold text-gray-900">
                {bathrooms}
                <span className="text-gray-400 font-medium ml-0.5">Bath</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <Maximize className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-bold text-gray-900">
                {area.toLocaleString()}
                <span className="text-gray-400 font-medium ml-0.5">m&sup2;</span>
              </span>
            </div>
          </div>

          {/* Bottom: Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 gap-2">
            <div className="min-w-0 flex-shrink">
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block leading-none mb-0.5">
                {isRent ? 'Monthly' : 'Price'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base md:text-lg font-bold text-gray-900 truncate">
                  {formatPrice(property.price)}
                </span>
                {isRent && (
                  <span className="text-[9px] font-medium text-gray-400 flex-shrink-0">
                    /mo
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Like button */}
              <button
                onClick={handleLikeToggle}
                className={cn(
                  'p-2 rounded-lg border transition-all',
                  localIsLiked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100',
                )}
                aria-label={localIsLiked ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={cn(
                    'w-3.5 h-3.5 transition-all',
                    localIsLiked && 'fill-current',
                  )}
                />
              </button>

              <span className="flex items-center gap-1.5 bg-gray-50 hover:bg-primary text-gray-700 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 border border-gray-200 hover:border-primary text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                Details
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
