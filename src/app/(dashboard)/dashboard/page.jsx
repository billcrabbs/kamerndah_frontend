'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
 Sparkles, 
 TrendingUp, 
 ShieldCheck, 
 Zap,
 Clock,
 ArrowUpRight,
 Heart,
 Calendar,
 CreditCard,
 User
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { useGetPropertiesByLandlordQuery } from '@/store/services/propertyApi';
import { useGetVisitsByUserQuery, useGetVisitsByLandlordQuery } from '@/store/services/visitApi';
import { LandlordOnboarding } from '@/components/dashboard/LandlordOnboarding';
import { Building2 } from 'lucide-react';

export default function DashboardPage() {
 const user = useSelector(selectCurrentUser);
 const router = useRouter();

 // Redirect if no user
 useEffect(() => {
 if (!user) {
 router.push('/login');
 }
 }, [user, router]);

 // Don't render anything while checking auth
 if (!user) {
 return (
 <div className="flex items-center justify-center min-h-screen">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
 </div>
 );
 }

 const { data: profileData, isLoading, error } = useGetUserByIdQuery(user?.uid, {
 skip: !user?.uid
 });

 // Dynamic Data Fetching for Stats
 const { data: propertiesData } = useGetPropertiesByLandlordQuery(user?.uid, {
 skip: !user?.uid
 });
 
 const isLandlordProfile = profileData?.data?.role === 'landlord';

 const { data: userVisitsData } = useGetVisitsByUserQuery(user?.uid, {
 skip: !user?.uid || isLandlordProfile
 });

 const { data: landlordVisitsData } = useGetVisitsByLandlordQuery(user?.uid, {
 skip: !user?.uid || !isLandlordProfile
 });

 const visitsData = isLandlordProfile ? landlordVisitsData : userVisitsData;

 // Handle errors gracefully
 if (error) {
 console.error('Dashboard error:', error);
 return (
 <div className="text-center py-20">
 <p className="text-red-400">Error loading dashboard. Please try again.</p>
 <button 
 onClick={() => window.location.reload()}
 className="mt-4 bg-primary text-white px-6 py-2 rounded-xl"
 >
 Refresh
 </button>
 </div>
 );
 }

 const profile = profileData?.data || {};
 const isLandlord = profile.role === 'landlord';

 const propertiesCount = propertiesData?.data?.data?.length || propertiesData?.data?.length || 0;
 const visitsItems = visitsData?.data || [];
 const visitsCount = Array.isArray(visitsItems) ? visitsItems.filter(v => ['scheduled', 'confirmed'].includes(v.status)).length : 0;

 if (isLoading) {
 return (
 <div className="space-y-8 animate-pulse">
 <div className="h-64 bg-white/5 rounded-[3rem]" />
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-12">
 {/* Header Section */}
 <div className="relative group">
 <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
 <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
 <div className="space-y-4">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Vested Identity</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Identity <br />
 <span className="text-gradient-gold">Overview.</span>
 </h1>
 <p className="text-gray-500 text-sm font-medium tracking-wide">
 Welcome back, <span className="text-white font-black ">{profile.displayName || user?.email?.split('@')[0] || 'Associate'}</span>. Your estate ecosystem is synchronized.
 </p>
 </div>

 <div className="flex items-center space-x-4">
 <div className="text-right">
 <p className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-1">Current Persona</p>
 <p className="text-xl font-black text-white tracking-tighter uppercase">{isLandlord ? 'Elite Landlord' : 'Verified Renter'}</p>
 </div>
 <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center">
 <User className="w-8 h-8 text-gray-700" />
 </div>
 </div>
 </div>
 </div>

 {/* Conditionally Show Landlord Onboarding for Non-Landlords */}
 {!isLandlord && <LandlordOnboarding />}

 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: isLandlord ? 'Total Assets' : 'Saved Assets', value: isLandlord ? propertiesCount : '12', icon: isLandlord ? Building2 : Heart, color: 'text-primary-light' },
 { label: 'Active Audits', value: visitsCount, icon: Calendar, color: 'text-amber-500' },
 { label: 'Cleared Fees', value: isLandlord ? 'N/A' : '25k', icon: CreditCard, color: 'text-emerald-500' },
 { label: 'Market Velocity', value: '+12%', icon: TrendingUp, color: 'text-primary-light' }
 ].map((stat, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.1 }}
 className="bg-[#0c0c0e] border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group overflow-hidden relative"
 >
 <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
 <div className="flex flex-col space-y-4 relative z-10">
 <div className="flex items-center justify-between">
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
 <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
 </div>
 <div className="flex items-baseline space-x-2">
 <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
 {stat.label === 'Market Velocity' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
 </div>
 </div>
 </motion.div>
 ))}
 </div>

  {/* Activity Sections */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
  {/* Visit Activity Feed */}
  <div className="lg:col-span-2 space-y-8">
  <div className="flex items-center justify-between px-4">
  <div className="flex items-center space-x-3">
  <Zap className="w-5 h-5 text-secondary" />
  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Recent Visits</h3>
  </div>
  </div>

  <div className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] p-4">
  {Array.isArray(visitsItems) && visitsItems.length > 0 ? (
  visitsItems.slice(0, 3).map((visit, i) => (
  <div 
  key={visit.id || i} 
  className={`flex items-center justify-between p-8 rounded-[2.5rem] transition-all hover:bg-white/5 ${i !== Math.min(visitsItems.length, 3) - 1 ? 'border-b border-white/5' : ''}`}
  >
  <div className="flex items-center space-x-6">
  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
  visit.status === 'confirmed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
  visit.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
  'bg-amber-500/10 border-amber-500/20 text-amber-400'
  }`}>
  <Calendar className="w-5 h-5" />
  </div>
  <div>
  <p className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-2">
  Visit {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'Scheduled'}
  </p>
  <p className="text-[10px] text-gray-500 font-medium">
  {visit.property?.title || `Property visit - ${visit.property_id?.slice(0, 8) || 'Unknown'}`}
  </p>
  </div>
  </div>
  <div className="text-right">
  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-end space-x-2">
  <Clock className="w-3 h-3" />
  <span>{visit.scheduled_date ? new Date(visit.scheduled_date).toLocaleDateString() : 'TBD'}</span>
  </p>
  </div>
  </div>
  ))
  ) : (
  <div className="flex flex-col items-start space-y-4 p-10">
  <Calendar className="w-8 h-8 text-gray-700" />
  <p className="text-sm font-black text-white">No visits yet</p>
  <p className="text-[10px] text-gray-600 font-medium">When you schedule property visits, they'll appear here.</p>
  </div>
  )}
  </div>
  </div>

 {/* Strategic Insights */}
 <div className="lg:col-span-1 space-y-8">
 <div className="px-4">
 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Insights</h3>
 </div>
 
 <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 space-y-8 group hover:bg-primary/10 transition-all">
 <div className="w-16 h-16 bg-primary/20 rounded-[1.5rem] flex items-center justify-center border border-primary/20">
 <ShieldCheck className="w-8 h-8 text-primary-light" />
 </div>
 <div className="space-y-4">
 <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Security Rating: ELITE</h4>
 <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
 Your identity is fully verified on the KmerNdah network. You have priority access to all verified physical audits.
 </p>
 </div>
 <div className="pt-4">
 <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: '100%' }}
 className="bg-primary h-full rounded-full" 
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}