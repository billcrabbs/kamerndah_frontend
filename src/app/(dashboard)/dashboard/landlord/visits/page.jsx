'use client';
import { useSelector } from 'react-redux';
import { 
 useGetVisitsByLandlordQuery, 
 useUpdateVisitStatusMutation 
} from '@/store/services/visitApi';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { LandlordActionCard } from '@/components/dashboard/LandlordActionCard';
import { 
 Calendar, 
 Info, 
 ShieldCheck, 
 Activity,
 UserCheck,
 ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandlordManageVisitsPage() {
 const user = useSelector(selectCurrentUser);
 const { data: visitsData, isLoading, refetch } = useGetVisitsByLandlordQuery(user?.uid, {
 skip: !user?.uid
 });
 const [updateStatus, { isLoading: isUpdating }] = useUpdateVisitStatusMutation();

 const handleStatusUpdate = async (visitId, status) => {
 try {
 await updateStatus({ 
 id: visitId, 
 status,
 notes: `Action taken by landlord at ${new Date().toLocaleString()}`
 }).unwrap();
 refetch();
 } catch (err) {
 console.error('Failed to update visit status:', err);
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

 const visits = visitsData?.data || [];
 const pendingVisits = visits.filter(v => v.status === 'requested');
 const activeVisits = visits.filter(v => v.status === 'confirmed');

 return (
 <div className="space-y-12 pb-20">
 {/* Header */}
 <div className="space-y-6">
 <div className="inline-flex items-center space-x-3 bg-secondary/10 border border-secondary/20 px-5 py-2.5 rounded-full">
 <Calendar className="w-4 h-4 text-secondary" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Audit Management</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Manage <br />
 <span className="text-gradient-gold">Physical Audits.</span>
 </h1>
 </div>

 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { label: 'New Requests', value: pendingVisits.length, icon: UserCheck, color: 'text-amber-500' },
 { label: 'Confirmed Audits', value: activeVisits.length, icon: Activity, color: 'text-emerald-500' },
 { label: 'Concluded', value: visits.filter(v => v.status === 'completed').length, icon: ClipboardList, color: 'text-primary-light' }
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
 <ShieldCheck className="w-5 h-5 text-emerald-500" />
 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Verified Audit Requests</h3>
 </div>

 {visits.length === 0 ? (
 <div className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-20 text-center space-y-6">
 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
 <Calendar className="w-8 h-8 text-gray-700" />
 </div>
 <div className="space-y-2">
 <p className="text-white font-black uppercase tracking-widest tracking-tighter">No Audit Requests Found</p>
 <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Share your properties to attract professional investors</p>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-6">
 {visits.map((visit) => (
 <LandlordActionCard 
 key={visit.id}
 item={visit}
 type="visit"
 onStatusUpdate={handleStatusUpdate}
 isUpdating={isUpdating}
 />
 ))}
 </div>
 )}
 </div>

 {/* Guidelines */}
 <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
 <div className="flex items-center space-x-6">
 <div className="p-4 bg-primary/20 rounded-2xl">
 <Info className="w-6 h-6 text-primary-light" />
 </div>
 <div className="space-y-1">
 <p className="text-white font-black uppercase tracking-widest text-xs ">Management Protocol</p>
 <p className="text-gray-500 text-[10px] font-medium leading-relaxed max-w-sm">
 Confirming an audit indicates you have verified the asset is available and a representative will be present at the specified date.
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
