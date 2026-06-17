'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  Calendar,
  Home,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserLikesQuery } from '@/store/services/likeApi';
import { useGetVisitsByUserQuery } from '@/store/services/visitApi';

export default function FavoritesPage() {
  const user = useSelector(selectCurrentUser);

  const { data: likesData, isLoading: likesLoading } = useGetUserLikesQuery(user?.uid, {
    skip: !user?.uid
  });
  const { data: visitsData, isLoading: visitsLoading } = useGetVisitsByUserQuery(user?.uid, {
    skip: !user?.uid
  });

  const likedProperties = likesData?.data || [];
  const visits = visitsData?.data || [];
  const upcomingVisits = Array.isArray(visits)
    ? visits.filter(v => ['scheduled', 'confirmed'].includes(v.status)).slice(0, 3)
    : [];

  const statusColors = {
    scheduled: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    confirmed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    completed: 'bg-white/5 border-white/10 text-gray-500',
    cancelled: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-3 bg-red-500/10 border border-red-500/20 px-5 py-2.5 rounded-full">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Saved Properties</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">
          Favorites &<br />
          <span className="text-gradient-gold">Scheduled Visits</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Track the properties you've saved and your upcoming property visits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Liked Properties */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center space-x-3">
              <Heart className="w-5 h-5 text-red-400" />
              <span>Saved Properties</span>
            </h2>
            <Link href="/rent" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center space-x-1">
              <span>Browse More</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {likesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : likedProperties.length > 0 ? (
            <div className="space-y-3">
              {likedProperties.map((like, i) => {
                const p = like.property || like;
                return (
                  <motion.div
                    key={like.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={`/properties/${p.id}`}
                      className="flex items-center space-x-5 p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-primary-light transition-colors">
                          {p.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1 text-primary" />
                          <span>
                            {(() => {
                              const loc = p.location;
                              if (!loc) return p.city || 'Cameroon';
                              if (typeof loc === 'object') {
                                const parts = [];
                                if (loc.quarter) parts.push(loc.quarter);
                                if (loc.city) parts.push(loc.city);
                                if (parts.length === 0 && loc.address) parts.push(loc.address);
                                return parts.join(', ') || 'Cameroon';
                              }
                              return loc;
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-black text-sm">{p.price?.toLocaleString()} XAF</p>
                        <p className="text-gray-600 text-[10px] font-medium">{p.category === 'for-rent' ? '/month' : 'for sale'}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-start space-y-5 bg-white/[0.02] border border-white/5 rounded-3xl px-10">
              <Heart className="w-10 h-10 text-gray-700" />
              <div>
                <h3 className="text-xl font-black text-white mb-2">No saved properties yet</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Browse listings and tap the heart icon on any property to save it here for later.
                </p>
              </div>
              <Link
                href="/rent"
                className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Visits */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-light" />
              <span>Upcoming Visits</span>
            </h2>
          </div>

          {visitsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : upcomingVisits.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.map((visit, i) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-black text-white line-clamp-2 leading-tight">
                      {visit.property?.title || 'Property Visit'}
                    </h3>
                    <span className={`flex-shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColors[visit.status] || statusColors.scheduled}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {visit.scheduled_date
                        ? new Date(visit.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        : 'Date TBD'}
                      {visit.scheduled_time && ` at ${visit.scheduled_time}`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-start space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl px-8">
              <Calendar className="w-8 h-8 text-gray-700" />
              <div>
                <h3 className="text-base font-black text-white mb-1">No visits scheduled</h3>
                <p className="text-gray-500 text-sm">Find a property you like and schedule an in-person visit.</p>
              </div>
              <Link
                href="/rent"
                className="inline-flex items-center space-x-2 text-primary-light text-xs font-black uppercase tracking-widest hover:underline"
              >
                <span>Explore Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}