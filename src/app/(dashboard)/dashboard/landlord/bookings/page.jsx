'use client';
import { useSelector } from 'react-redux';
import { 
 useGetBookingsByLandlordQuery, 
 useUpdateBookingStatusMutation 
} from '@/store/services/bookingApi';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { LandlordActionCard } from '@/components/dashboard/LandlordActionCard';
import { 
 ShieldCheck, 
 Zap, 
 Building2, 
 ArrowUpRight,
 Gavel,
 History
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandlordManageBookingsPage() {
 const user = useSelector(selectCurrentUser);
 const { data: bookingsData, isLoading, refetch } = useGetBookingsByLandlordQuery(user?.uid, {
 skip: !user?.uid
 });
 const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

 const handleStatusUpdate = async (bookingId, status) => {
 try {
 await updateStatus({ 
 id: bookingId, 
 status
 }).unwrap();
 refetch();
 } catch (err) {
 console.error('Failed to update booking status:', err);
 }
 };

 if (isLoading) {
 return (
 <div className="space-y-8 animate-pulse">
 <div className="h-48 bg-white/5 rounded-[3rem]" />
 {[1, 2].map(i => (
 <div key={i} className="h-64 bg-white/5 rounded-[2.5rem]" />
 ))}
 </div>
 );
 }

 const bookings = bookingsData?.data || [];
 const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');
 const pendingBookings = bookings.filter(b => b.status === 'pending');

 return (
 <div className="space-y-12 pb-20">
 {/* Header */}
 <div className="space-y-6">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <ShieldCheck className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Vested Agreements</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Strategic <br />
 <span className="text-gradient-gold">Commitments.</span>
 </h1>
 </div>

 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { label: 'Pending Signature', value: pendingBookings.length, icon: Gavel, color: 'text-amber-500' },
 { label: 'Active Deals', value: activeBookings.length, icon: Building2, color: 'text-emerald-500' },
 { label: 'Total Volume', value: bookings.length, icon: History, color: 'text-primary-light' }
 ].map((stat, i) => (
 <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between">
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
 <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
 </div>
 <div className="p-4 bg-white/5 rounded-2xl">
 <stat.icon className={`w-6 h-6 ${stat.color}`} />
 </div>
 </div>
 ))}
 </div>

 {/* Main List */}
 <div className="space-y-8">
 <div className="flex items-center space-x-3 px-4">
 <Zap className="w-5 h-5 text-secondary" />
 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Agreement Pipeline</h3>
 </div>

 {bookings.length === 0 ? (
 <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-20 text-center space-y-6">
 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
 <ArrowUpRight className="w-8 h-8 text-gray-700" />
 </div>
 <div className="space-y-2">
 <p className="text-white font-black uppercase tracking-widest tracking-tighter">Empty Pipeline</p>
 <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">No active lease or purchase intents currently transmitted</p>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-6">
 {bookings.map((booking) => (
 <LandlordActionCard 
 key={booking.id}
 item={booking}
 type="booking"
 onStatusUpdate={handleStatusUpdate}
 isUpdating={isUpdating}
 />
 ))}
 </div>
 )}
 </div>

 {/* Legal Banner */}
 <div className="bg-secondary/5 border border-secondary/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
 <div className="flex items-center space-x-6">
 <div className="p-4 bg-secondary/20 rounded-2xl">
 <ShieldCheck className="w-6 h-6 text-secondary" />
 </div>
 <div className="space-y-1">
 <p className="text-white font-black uppercase tracking-widest text-xs ">Asset Finalization</p>
 <p className="text-gray-500 text-[10px] font-medium leading-relaxed max-w-sm">
 Approving a commitment will automatically mark the property as **Rented** or **Sold** in the verified inventory. This action is binding.
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
