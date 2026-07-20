'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  Heart,
  CreditCard,
  User,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { useGetPropertiesByLandlordQuery } from '@/store/services/propertyApi';
import { useGetVisitsByUserQuery, useGetVisitsByLandlordQuery } from '@/store/services/visitApi';
import { LandlordOnboarding } from '@/components/dashboard/LandlordOnboarding';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { Building2 } from 'lucide-react';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();

  const { data: profileData, isLoading, error } = useGetUserByIdQuery(user?.uid, { skip: !user?.uid });
  const { data: propertiesData } = useGetPropertiesByLandlordQuery(user?.uid, { skip: !user?.uid });

  const isLandlordProfile = profileData?.data?.role === 'landlord';

  const { data: userVisitsData } = useGetVisitsByUserQuery(user?.uid, { skip: !user?.uid || isLandlordProfile });
  const { data: landlordVisitsData } = useGetVisitsByLandlordQuery(user?.uid, { skip: !user?.uid || !isLandlordProfile });

  const visitsData = isLandlordProfile ? landlordVisitsData : userVisitsData;

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm font-medium">Error loading dashboard.</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider">
          Refresh
        </button>
      </div>
    );
  }

  const profile = profileData?.data || {};
  const isLandlord = profile.role === 'landlord';
  const propertiesCount = propertiesData?.data?.data?.length || propertiesData?.data?.length || 0;
  const visitsItems = visitsData?.data || [];
  const visitsCount = Array.isArray(visitsItems) ? visitsItems.filter((v) => ['scheduled', 'confirmed'].includes(v.status)).length : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-white/[0.04] rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/[0.04] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: isLandlord ? 'Total Assets' : 'Saved Properties',
      value: isLandlord ? propertiesCount : '12',
      icon: isLandlord ? Building2 : Heart,
      color: 'text-primary',
    },
    { label: 'Active Audits', value: visitsCount, icon: Calendar, color: 'text-amber-400' },
    { label: 'Cleared Fees', value: isLandlord ? 'N/A' : '25k', icon: CreditCard, color: 'text-emerald-400' },
    { label: 'Market Velocity', value: '+12%', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Overview"
        title={isLandlord ? 'Portfolio' : 'Discovery'}
        highlight={isLandlord ? 'Overview.' : 'Overview.'}
        description={`Welcome back, ${profile.displayName || user?.email?.split('@')[0] || 'Associate'}.`}
      >
        <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-5 py-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Persona</p>
            <p className="text-sm font-bold text-white">{isLandlord ? 'Landlord' : 'Renter'}</p>
          </div>
          <div className="w-10 h-10 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-center">
            <User className="w-5 h-5 text-white/20" />
          </div>
        </div>
      </DashboardPageHeader>

      {/* Landlord Onboarding */}
      {!isLandlord && <LandlordOnboarding />}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-[#0c0c0e] border border-white/[0.04] p-6 rounded-2xl hover:border-white/[0.08] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-50`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              {stat.label === 'Market Velocity' && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Visits */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white/70 tracking-tight">Recent Visits</h3>
          <div className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl divide-y divide-white/[0.04]">
            {Array.isArray(visitsItems) && visitsItems.length > 0 ? (
              visitsItems.slice(0, 3).map((visit, i) => (
                <div key={visit.id || i} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        visit.status === 'confirmed'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : visit.status === 'cancelled'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1">{visit.property?.title || `Visit - ${visit.property_id?.slice(0, 8) || 'Unknown'}`}</p>
                      <p className="text-[10px] text-white/30 font-medium capitalize">{visit.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{visit.scheduled_date ? new Date(visit.scheduled_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-start gap-3 p-8">
                <Calendar className="w-6 h-6 text-white/20" />
                <p className="text-sm font-bold text-white">No visits yet</p>
                <p className="text-xs text-white/30">Schedule a property visit to see it here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white/70 tracking-tight">Insights</h3>
          <div className="bg-primary/[0.04] border border-primary/[0.12] rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/10">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Security Rating: ELITE</h4>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">
                Your identity is fully verified. You have priority access to all verified physical audits.
              </p>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="bg-primary h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
