'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Building2,
  User,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetVisitsByUserQuery } from '@/store/services/visitApi';
import Link from 'next/link';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

const STATUS_STYLES = {
  confirmed: { icon: CheckCircle2, text: 'Confirmed', class: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  requested: { icon: Clock3, text: 'Pending', class: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  cancelled: { icon: XCircle, text: 'Cancelled', class: 'bg-red-500/10 border-red-500/20 text-red-400' },
};

const getStatusBadge = (status) =>
  STATUS_STYLES[status] || { icon: Clock3, text: status, class: 'bg-white/[0.04] border-white/10 text-white/40' };

export default function UserVisitsPage() {
  const user = useSelector(selectCurrentUser);
  const { data: visitsData, isLoading } = useGetVisitsByUserQuery(user?.uid, { skip: !user?.uid });

  const visits = visitsData?.data || [];

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-8">
        <div className="w-20 h-20 bg-white/[0.04] rounded-2xl flex items-center justify-center border border-white/[0.06]">
          <User className="w-8 h-8 text-white/20" />
        </div>
        <div className="max-w-sm space-y-2">
          <h2 className="text-xl font-bold text-white">Sign in Required</h2>
          <p className="text-sm text-white/40">Please log in to manage your property audits.</p>
        </div>
        <Link href="/login" className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/[0.04] rounded-2xl" />
        ))}
      </div>
    );
  }

  const confirmedCount = visits.filter((v) => v.status === 'confirmed').length;

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Audits"
        title="Physical"
        highlight="Audits."
        description="Track your scheduled and past property visits."
      >
        <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5">
          <div className="text-center px-3 border-r border-white/[0.06]">
            <p className="text-lg font-bold text-white">{visits.length}</p>
            <p className="text-[10px] text-white/30 font-bold tracking-wider uppercase">Total</p>
          </div>
          <div className="text-center px-3">
            <p className="text-lg font-bold text-primary">{confirmedCount}</p>
            <p className="text-[10px] text-white/30 font-bold tracking-wider uppercase">Confirmed</p>
          </div>
        </div>
      </DashboardPageHeader>

      {visits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-16 flex flex-col items-center text-center gap-6"
        >
          <div className="w-16 h-16 bg-white/[0.04] rounded-full flex items-center justify-center">
            <Search className="w-7 h-7 text-white/20" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Audits Scheduled</h3>
            <p className="text-sm text-white/30 mt-1 max-w-sm">You haven&apos;t requested any property viewings yet.</p>
          </div>
          <Link href="/rent" className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider transition-all">
            Browse Properties
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visits.map((visit, index) => {
            const status = getStatusBadge(visit.status);
            return (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/[0.08] transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-56 h-40 md:h-auto overflow-hidden relative flex-shrink-0">
                    <img
                      src={visit.property_data?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] to-transparent opacity-60 md:hidden" />
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider flex items-center gap-1.5 ${status.class}`}>
                            <status.icon className="w-3 h-3" />
                            <span>{status.text}</span>
                          </span>
                          <span className="text-[10px] text-white/20 font-medium">ID: {visit.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white line-clamp-1">
                          {visit.property_data?.title || 'Loading...'}
                        </h3>
                        <div className="flex items-center text-white/40 text-sm font-medium">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary flex-shrink-0" />
                          {(() => {
                            const loc = visit.property_data?.location;
                            if (!loc) return visit.property_data?.city || 'Cameroon';
                            if (typeof loc === 'object') {
                              const parts = [];
                              if (loc.quarter) parts.push(loc.quarter);
                              if (loc.city) parts.push(loc.city);
                              if (parts.length === 0 && loc.address) parts.push(loc.address);
                              return parts.join(', ') || 'Cameroon';
                            }
                            return loc;
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.04] rounded-xl px-4 py-3 flex-shrink-0">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-3.5 h-3.5 text-primary mb-1" />
                          <span className="text-xs font-bold text-white">
                            {new Date(visit.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Clock className="w-3.5 h-3.5 text-primary mb-1" />
                          <span className="text-xs font-bold text-white">
                            {new Date(visit.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-white/30 text-[10px] font-medium">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Type: {visit.visit_type === 'physical' ? 'On-Site' : 'Assisted'}</span>
                      </div>
                      <Link
                        href={`/properties/${visit.property_id}`}
                        className="flex items-center gap-1.5 text-primary hover:text-white transition-colors text-[10px] font-bold tracking-wider"
                      >
                        <span>View Property</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
