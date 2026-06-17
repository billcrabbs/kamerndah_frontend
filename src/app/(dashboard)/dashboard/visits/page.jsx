'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
 Calendar, 
 Clock, 
 MapPin, 
 ChevronRight, 
 Sparkles,
 Search,
 CheckCircle2,
 Clock3,
 XCircle,
 Building2,
 User
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetVisitsByUserQuery } from '@/store/services/visitApi';
import Link from 'next/link';

export default function UserVisitsPage() {
 const user = useSelector(selectCurrentUser);
 const { data: visitsData, isLoading } = useGetVisitsByUserQuery(user?.uid, {
 skip: !user?.uid
 });

 const visits = visitsData?.data || [];

 const getStatusBadge = (status) => {
 switch (status) {
 case 'confirmed':
 return { 
 icon: CheckCircle2, 
 text: 'Confirmed', 
 class: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
 };
 case 'requested':
 return { 
 icon: Clock3, 
 text: 'Pending', 
 class: 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
 };
 case 'cancelled':
 return { 
 icon: XCircle, 
 text: 'Cancelled', 
 class: 'bg-red-500/10 border-red-500/20 text-red-500' 
 };
 default:
 return { 
 icon: Clock3, 
 text: status, 
 class: 'bg-white/5 border-white/10 text-gray-500' 
 };
 }
 };

 if (!user) {
 return (
 <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10">
 <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5 relative">
 <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
 <User className="w-12 h-12 text-gray-500" />
 </div>
 <div className="space-y-4 max-w-sm">
 <h2 className="text-3xl font-black text-white tracking-tighter uppercase ">Secure Access Required</h2>
 <p className="text-gray-500 font-medium leading-relaxed">
 Property audits and physical viewings require identity verification. Please log in to manage your appointments.
 </p>
 </div>
 <Link 
 href="/login"
 className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow hover:scale-105 transition-transform"
 >
 Identity Portal
 </Link>
 </div>
 );
 }

 if (isLoading) {
 return (
 <div className="space-y-8 animate-pulse">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-48 bg-white/5 rounded-3xl" />
 ))}
 </div>
 );
 }

 return (
 <div className="space-y-12 pb-20">
 {/* Header Section */}
 <div className="space-y-6">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
 <div className="space-y-4">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Schedule Overview</span>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase ">
 Physical <br />
 <span className="text-gradient-gold">Audits.</span>
 </h1>
 </div>
 <div className="flex items-center space-x-4 bg-white/5 p-2 rounded-2xl border border-white/5">
 <div className="px-6 py-3 text-center border-r border-white/5">
 <p className="text-2xl font-black text-white">{visits.length}</p>
 <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Total Audits</p>
 </div>
 <div className="px-6 py-3 text-center">
 <p className="text-2xl font-black text-primary-light">
 {visits.filter(v => v.status === 'confirmed').length}
 </p>
 <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Confirmed</p>
 </div>
 </div>
 </div>
 </div>

 {/* Main List */}
 {visits.length === 0 ? (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="bg-white/5 border border-white/5 rounded-[3rem] p-20 flex flex-col items-center text-center space-y-8"
 >
 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5 relative">
 <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
 <Search className="w-10 h-10 text-gray-600" />
 </div>
 <div className="space-y-3">
 <h3 className="text-2xl font-black text-white uppercase tracking-tighter ">No Scheduled Audits</h3>
 <p className="text-gray-500 font-medium max-w-sm">
 You haven't requested any property viewings yet. Explore our inventory to find your next investment.
 </p>
 </div>
 <Link 
 href="/rent"
 className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 emerald-glow"
 >
 Browse Estates
 </Link>
 </motion.div>
 ) : (
 <div className="grid grid-cols-1 gap-6">
 {visits.map((visit, index) => {
 const status = getStatusBadge(visit.status);
 return (
 <motion.div 
 key={visit.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.1 }}
 className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500"
 >
 <div className="flex flex-col md:flex-row h-full">
 {/* Property Image / Teaser */}
 <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
 <img 
 src={visit.property_data?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'} 
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 alt=""
 />
 <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-60 md:hidden" />
 </div>

 {/* Visit Content */}
 <div className="flex-1 p-8 flex flex-col justify-between">
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
 <div className="space-y-2">
 <div className="flex items-center space-x-3 mb-2">
 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${status.class}`}>
 <status.icon className="w-3.5 h-3.5" />
 <span>{status.text}</span>
 </div>
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">ID: {visit.id.slice(0, 8)}</span>
 </div>
 <h3 className="text-2xl font-black text-white tracking-tighter uppercase line-clamp-1 ">
 {visit.property_data?.title || 'Loading Property...'}
 </h3>
 <div className="flex items-center text-gray-500 font-bold text-sm">
 <MapPin className="w-4 h-4 mr-2 text-primary" />
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

 <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center space-x-6">
 <div className="flex flex-col text-center px-4 border-r border-white/5">
 <Calendar className="w-4 h-4 text-primary-light mx-auto mb-2" />
 <span className="text-xs font-black text-white uppercase tracking-tighter">
 {new Date(visit.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
 </span>
 </div>
 <div className="flex flex-col text-center px-4">
 <Clock className="w-4 h-4 text-primary-light mx-auto mb-2" />
 <span className="text-xs font-black text-white uppercase tracking-tighter">
 {new Date(visit.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 </div>
 </div>

 <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <Building2 className="w-4 h-4 text-gray-600" />
 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
 Audit Type: {visit.visit_type === 'physical' ? 'On-Site' : 'Assisted'}
 </span>
 </div>
 <Link 
 href={`/properties/${visit.property_id}`}
 className="flex items-center space-x-2 text-primary-light hover:text-white transition-colors group/link"
 >
 <span className="text-[10px] font-black uppercase tracking-widest px-2">View Estate</span>
 <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
