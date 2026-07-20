'use client';
import { useSelector } from 'react-redux';
import { useGetBookingsByLandlordQuery, useUpdateBookingStatusMutation } from '@/store/services/bookingApi';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { LandlordActionCard } from '@/components/dashboard/LandlordActionCard';
import { Gavel, History, Building2 } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function LandlordManageBookingsPage() {
  const user = useSelector(selectCurrentUser);
  const { data: bookingsData, isLoading, refetch } = useGetBookingsByLandlordQuery(user?.uid, { skip: !user?.uid });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateStatus({ id: bookingId, status }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update booking status:', err);
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

  const bookings = bookingsData?.data || [];
  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'active');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Agreements"
        title="Strategic"
        highlight="Commitments."
        description="Manage lease and purchase agreements."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingBookings.length, icon: Gavel, color: 'text-amber-400' },
          { label: 'Active Deals', value: activeBookings.length, icon: Building2, color: 'text-emerald-400' },
          { label: 'Total', value: bookings.length, icon: History, color: 'text-primary' },
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
        <h3 className="text-sm font-bold text-white/70 tracking-tight">Agreement Pipeline</h3>

        {bookings.length === 0 ? (
          <div className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-16 text-center space-y-4">
            <div className="w-14 h-14 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto">
              <Gavel className="w-6 h-6 text-white/20" />
            </div>
            <div>
              <p className="text-base font-bold text-white">Empty Pipeline</p>
              <p className="text-sm text-white/30 mt-1">No lease or purchase intents yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <LandlordActionCard key={booking.id} item={booking} type="booking" onStatusUpdate={handleStatusUpdate} isUpdating={isUpdating} />
            ))}
          </div>
        )}
      </div>

      {/* Legal Banner */}
      <div className="bg-amber-500/[0.04] border border-amber-500/[0.12] rounded-2xl p-5 flex items-center gap-4">
        <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-400 flex-shrink-0">
          <Gavel className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Binding Action</p>
          <p className="text-xs text-white/30 mt-0.5">Approving marks the property as Rented/Sold in your verified inventory.</p>
        </div>
      </div>
    </div>
  );
}
