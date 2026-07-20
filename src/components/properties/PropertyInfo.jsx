'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Car,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Heart,
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import {
  useLikePropertyMutation,
  useUnlikePropertyMutation,
  useCheckLikeStatusQuery,
} from '@/store/services/likeApi';

function getLocationText(location) {
  if (!location) return 'Cameroon';
  if (typeof location === 'object') {
    const parts = [];
    if (location.quarter) parts.push(location.quarter);
    if (location.city) parts.push(location.city);
    if (parts.length === 0 && location.address) parts.push(location.address);
    return parts.join(', ') || 'Cameroon';
  }
  return location;
}

export function PropertyInfo({ property }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userId = user?.uid;
  const [listingDate, setListingDate] = useState('');

  const { data: likeData } = useCheckLikeStatusQuery(
    { user_id: userId, property_id: property.id },
    { skip: !property.id || !userId },
  );

  const [like] = useLikePropertyMutation();
  const [unlike] = useUnlikePropertyMutation();

  const isLiked = likeData?.data?.liked || false;
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    const created = property.created_at;
    if (created?._seconds) {
      setListingDate(new Date(created._seconds * 1000).toLocaleDateString());
    } else if (created) {
      setListingDate(new Date(created).toLocaleDateString());
    } else {
      setListingDate('');
    }
  }, [property.created_at]);

  const handleLikeToggle = async () => {
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

  const specs = property.specifications || {};
  const bedrooms = specs.bedrooms || 0;
  const bathrooms = specs.bathrooms || 0;
  const area = specs.area_sqm || specs.area || 0;
  const isRent = property.category === 'for-rent';
  const locationText = getLocationText(property.location);

  const specItems = [
    { icon: BedDouble, value: bedrooms, unit: `Bed${bedrooms !== 1 ? 's' : ''}` },
    { icon: Bath, value: bathrooms, unit: `Bath${bathrooms !== 1 ? 's' : ''}` },
    { icon: Maximize, value: area.toLocaleString(), unit: 'm\u00B2' },
    { icon: Car, value: specs.parking ? 'Parking' : 'No Parking' },
  ];

  const advantages = property.advantages || [];

  return (
    <div className="space-y-10">
      {/* Title, location, engagement */}
      <div>
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center mt-2 text-gray-500 text-sm font-medium">
              <MapPin className="w-4 h-4 mr-1.5 text-primary flex-shrink-0" />
              <span>{locationText}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 flex-shrink-0">
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-1.5 text-sm font-bold"
            >
              <motion.div
                animate={{ scale: localIsLiked ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 12 }}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    localIsLiked
                      ? 'fill-red-400 text-red-400'
                      : 'text-gray-400'
                  }`}
                />
              </motion.div>
              <span className={localIsLiked ? 'text-red-400' : 'text-gray-500'}>
                {property.likes_count || 0}
              </span>
            </button>
            <span className="text-gray-300 mx-2">|</span>
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-sm font-bold">{property.views_count || 0}</span>
              <span className="text-[10px] font-medium">views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specs strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {specItems.map((spec, i) => (
          <div
            key={i}
            className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4"
          >
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
              <spec.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-navy">{spec.value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{spec.unit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-bold text-navy tracking-tight mb-3">
          About this property
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {property.description ||
            `A premium property in ${locationText}. Fully verified and ready for your first visit.`}
        </p>
      </div>

      {/* Advantages / Amenities */}
      {advantages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-navy tracking-tight mb-3">
            Features & amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advantages.map((adv, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 border border-gray-200"
              >
                <div className="p-1.5 bg-primary/15 rounded-lg text-primary flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-navy tracking-tight">
                  {adv}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listing metadata */}
      <div className="pt-8 border-t border-gray-200 flex flex-wrap gap-x-8 gap-y-2 text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">
            Listed{listingDate ? ` ${listingDate}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">
            ID: {property.id?.slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-medium text-primary/70">
            {isRent ? 'Rental' : 'Sale'} listing
          </span>
        </div>
      </div>
    </div>
  );
}
