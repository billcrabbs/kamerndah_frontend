'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
 PlusCircle, 
 MapPin, 
 BedDouble, 
 Bath, 
 Maximize, 
 ChevronRight,
 Sparkles,
 Building2,
 Trash2,
 Edit,
 Eye,
 Heart
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetPropertiesByLandlordQuery } from '@/store/services/propertyApi';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function LandlordPropertiesPage() {
 const user = useSelector(selectCurrentUser);
 const { data: propertiesData, isLoading } = useGetPropertiesByLandlordQuery(user?.uid, {
 skip: !user?.uid
 });

 // Robust Data Extractor & Trace Logging
 const properties = (() => {
 if (!propertiesData) return [];
 
 // Deep Extraction logic
 const rawData = propertiesData.data;
 const extracted = Array.isArray(rawData) ? rawData : (rawData?.data && Array.isArray(rawData.data)) ? rawData.data : [];
 
 // Trace log for debugging Hidden Properties
 console.log('[DEBUG] Landlord Sync Trace:', {
 hasData: !!propertiesData,
 count: propertiesData.count,
 extractedCount: extracted.length,
 currentUserId: user?.uid,
 firstPropertyLandlord: extracted[0]?.landlord_id
 });

 return extracted;
 })();

 if (isLoading) {
 return (
 <div className="space-y-8 animate-pulse">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-64 bg-white/5 rounded-[3rem]" />
 ))}
 </div>
 );
 }

 return (
 <div className="space-y-12 pb-20">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
 <div className="space-y-6">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Building2 className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Asset Management</span>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase ">
 My <br />
 <span className="text-gradient-gold">Inventory.</span>
 </h1>
 </div>

 <Link
 href="/submit-property"
 className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow hover:scale-105 transition-all flex items-center space-x-3 self-start md:self-auto"
 >
 <PlusCircle className="w-5 h-5" />
 <span>Deploy New Estate</span>
 </Link>
 </div>

 {/* Stats Summary */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Total Assets', value: properties.length, icon: Building2 },
 { label: 'Verified', value: properties.filter(p => p.status === 'verified').length, icon: Sparkles },
 { label: 'Rented/Sold', value: properties.filter(p => !['available', 'verified'].includes(p.status)).length, icon: ChevronRight },
 { label: 'Total Views', value: properties.reduce((acc, p) => acc + (p.views_count || 0), 0), icon: Eye },
 ].map((stat, i) => (
 <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center space-y-2">
 <stat.icon className="w-4 h-4 text-primary-light opacity-50" />
 <p className="text-2xl font-black text-white">{stat.value}</p>
 <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest">{stat.label}</p>
 </div>
 ))}
 </div>

 {/* Grid */}
 {properties.length === 0 ? (
 <div className="bg-white/5 border border-white/5 rounded-[3.5rem] p-24 text-center space-y-8">
 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 relative">
 <div className="absolute inset-0 bg-white/5 blur-3xl" />
 <Building2 className="w-10 h-10 text-gray-700" />
 </div>
 <div className="space-y-3">
 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">No Active Listings</h3>
 <p className="text-gray-500 font-medium max-w-sm mx-auto">
 Your portfolio is currently empty. Start listing your premium properties to attract KamerNdah elite clients.
 </p>
 </div>
 <Link 
 href="/submit-property"
 className="inline-flex bg-white/5 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 transition-all"
 >
 Get Started
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-8">
 {properties.map((property, index) => (
 <motion.div
 key={property.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 className="group bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden hover:border-white/10 transition-all duration-700"
 >
 <div className="flex flex-col md:flex-row">
 <div className="w-full md:w-80 h-64 md:h-auto overflow-hidden relative">
 <img 
 src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'} 
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
 alt=""
 />
 <div className="absolute top-6 left-6 px-4 py-2 bg-background/80 backdrop-blur-md rounded-2xl border border-white/10">
 <span className={`text-[9px] font-black uppercase tracking-widest ${property.status === 'verified' ? 'text-emerald-500' : 'text-amber-500'}`}>
 {property.status}
 </span>
 </div>
 </div>

 <div className="flex-1 p-10 flex flex-col justify-between">
 <div>
 <div className="flex items-start justify-between mb-4">
 <div className="space-y-2">
 <h3 className="text-3xl font-black text-white tracking-tighter uppercase line-clamp-1">{property.title}</h3>
 <div className="flex items-center text-gray-500 font-bold text-xs uppercase tracking-widest">
 <MapPin className="w-4 h-4 mr-2 text-primary" />
 {property.location?.city}, {property.location?.quarter}
 </div>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-2xl font-black text-white tracking-tighter">{formatPrice(property.price)}</span>
 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{property.category}</span>
 </div>
 </div>

 <div className="flex items-center space-x-6 py-6 border-y border-white/5">
 <div className="flex items-center space-x-2 text-gray-400">
 <BedDouble className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest text-white">{property.specifications?.bedrooms} Bed</span>
 </div>
 <div className="flex items-center space-x-2 text-gray-400">
 <Bath className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest text-white">{property.specifications?.bathrooms} Bath</span>
 </div>
 <div className="flex items-center space-x-2 text-gray-400">
 <Maximize className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest text-white">{property.specifications?.area_sqm} m²</span>
 </div>
 </div>
 </div>

 <div className="mt-8 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
 <Eye className="w-3.5 h-3.5 text-gray-600" />
 <span className="text-[10px] font-black text-gray-400">{property.views_count || 0}</span>
 </div>
 <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
 <Heart className="w-3.5 h-3.5 text-red-500/40" />
 <span className="text-[10px] font-black text-gray-400">{property.likes_count || 0}</span>
 </div>
 </div>

 <div className="flex items-center space-x-3">
 <button className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10">
 <Edit className="w-5 h-5" />
 </button>
 <button className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10">
 <Trash2 className="w-5 h-5" />
 </button>
 <Link 
 href={`/properties/${property.id}`}
 className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105"
 >
 Public View
 </Link>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 );
}
