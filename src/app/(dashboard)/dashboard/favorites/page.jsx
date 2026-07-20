'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  Clock3,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserLikesQuery } from '@/store/services/likeApi';
import { useGetVisitsByUserQuery } from '@/store/services/visitApi';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

const STATUS_COLORS = {
  scheduled: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  confirmed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  completed: 'bg-white/[0.04] border-white/10 text-white/40',
  cancelled: 'bg-red-500/10 border-red-500/20 text-red-400',
};

export default function FavoritesPage() {
  const user = useSelector(selectCurrentUser);

  const { data: likesData, isLoading: likesLoading } = useGetUserLikesQuery(user?.uid, { skip: !user?.uid });
  const { data: visitsData, isLoading: visitsLoading } = useGetVisitsByUserQuery(user?.uid, { skip: !user?.uid });

  const likedProperties = likesData?.data || [];
  const visits = visitsData?.data || [];
  const upcomingVisits = Array.isArray(visits)
    ? visits.filter((v) => ['scheduled', 'confirmed'].includes(v.status)).slice(0, 3)
    : [];

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill={null}
        title="Favorites"
        highlight="& Visits."
        description="Properties you&apos;ve saved and your upcoming audits."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Properties */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white/70 tracking-wider uppercase flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Saved</span>
            </h2>
            <Link href="/rent" className="text-[10px] font-bold text-primary tracking-wider hover:text-white transition-colors flex items-center gap-1">
              <span>Browse</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {likesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white/[0.04] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : likedProperties.length > 0 ? (
            <div className="space-y-2">
              {likedProperties.map((like, i) => {
                const p = like.property || like;
                return (
                  <motion.div
                    key={like.id || i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={`/properties/${p.id}`}
                      className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.08] transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">{p.title}</h3>
                        <div className="flex items-center text-white/40 text-xs mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-primary flex-shrink-0" />
                          <span className="truncate">
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
                        <p className="text-sm font-bold text-white">{p.price?.toLocaleString()} XAF</p>
                        <p className="text-[10px] text-white/30">{p.category === 'for-rent' ? '/month' : 'for sale'}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 px-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col items-start gap-4">
              <Heart className="w-7 h-7 text-white/20" />
              <div>
                <h3 className="text-base font-bold text-white">Nothing saved yet</h3>
                <p className="text-sm text-white/30 mt-0.5">Tap the heart icon on any property to save it here.</p>
              </div>
              <Link href="/rent" className="bg-white/[0.06] border border-white/[0.08] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-wider hover:bg-white/[0.10] transition-all">
                Browse Properties
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Visits */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-white/70 tracking-wider uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Upcoming</span>
          </h2>

          {visitsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-white/[0.04] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : upcomingVisits.length > 0 ? (
            <div className="space-y-2">
              {upcomingVisits.map((visit, i) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                      {visit.property?.title || 'Property Visit'}
                    </h3>
                    <span className={`flex-shrink-0 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[visit.status] || STATUS_COLORS.scheduled}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>
                      {visit.scheduled_date
                        ? new Date(visit.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        : 'Date TBD'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-10 px-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col items-start gap-4">
              <Calendar className="w-7 h-7 text-white/20" />
              <div>
                <h3 className="text-base font-bold text-white">None scheduled</h3>
                <p className="text-sm text-white/30 mt-0.5">Find a property and schedule a visit.</p>
              </div>
              <Link href="/rent" className="text-[10px] font-bold text-primary tracking-wider hover:text-white transition-colors flex items-center gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
