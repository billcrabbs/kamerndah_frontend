'use client';
import { useSelector } from 'react-redux';
import { useGetVisitsByLandlordQuery, useUpdateVisitStatusMutation } from '@/store/services/visitApi';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { LandlordActionCard } from '@/components/dashboard/LandlordActionCard';
import { Calendar, Info, UserCheck, Activity, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function LandlordManageVisitsPage() {
  const user = useSelector(selectCurrentUser);
  const { data: visitsData, isLoading, refetch } = useGetVisitsByLandlordQuery(user?.uid, { skip: !user?.uid });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateVisitStatusMutation();

  const handleStatusUpdate = async (visitId, status) => {
    try {
      await updateStatus({ id: visitId, status, notes: `Action taken by landlord at ${new Date().toLocaleString()}` }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update visit status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-white/[0.04] rounded-2xl" />
        {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-white/[0.04] rounded-2xl" />
        ))}
      </div>
    );
  }

  const visits = visitsData?.data || [];
  const pendingVisits = visits.filter((v) => v.status === 'requested');
  const activeVisits = visits.filter((v) => v.status === 'confirmed');

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Audit Management"
        title="Manage"
        highlight="Physical Audits."
        description="Review and respond to inspection requests from clients."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'New Requests', value: pendingVisits.length, icon: UserCheck, color: 'text-amber-400' },
          { label: 'Confirmed', value: activeVisits.length, icon: Activity, color: 'text-emerald-400' },
          { label: 'Completed', value: visits.filter((v) => v.status === 'completed').length, icon: ClipboardList, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.04] p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white/70 tracking-tight">Audit Requests</h3>

        {visits.length === 0 ? (
          <div className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-16 text-center space-y-4">
            <div className="w-14 h-14 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-white/20" />
            </div>
            <div>
              <p className="text-base font-bold text-white">No Requests</p>
              <p className="text-sm text-white/30 mt-1">Share your properties to attract investors.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visits.map((visit) => (
              <LandlordActionCard key={visit.id} item={visit} type="visit" onStatusUpdate={handleStatusUpdate} isUpdating={isUpdating} />
            ))}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-primary/[0.04] border border-primary/[0.12] rounded-2xl p-5 flex items-center gap-4">
        <div className="p-2.5 bg-primary/15 rounded-xl text-primary flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Protocol</p>
          <p className="text-xs text-white/30 mt-0.5">Confirming an audit verifies the asset is available for viewing.</p>
        </div>
      </div>
    </div>
  );
}
