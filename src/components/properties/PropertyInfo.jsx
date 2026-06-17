'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
 MapPin, 
 BedDouble, 
 Bath, 
 Maximize, 
 Car, 
 CheckCircle2,
 Calendar,
 Eye,
 Heart,
 ShieldCheck
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import { 
 useLikePropertyMutation, 
 useUnlikePropertyMutation, 
 useCheckLikeStatusQuery 
} from '@/store/services/likeApi';

export function PropertyInfo({ property }) {
 const router = useRouter();
 const dispatch = useDispatch();
 const user = useSelector(selectCurrentUser);
 const userId = user?.uid;
 
 const { data: likeData } = useCheckLikeStatusQuery(
 { user_id: userId, property_id: property.id },
 { skip: !property.id || !userId }
 );
 
 const [like] = useLikePropertyMutation();
 const [unlike] = useUnlikePropertyMutation();
 
 const isLiked = likeData?.data?.liked || false;
 const [localIsLiked, setLocalIsLiked] = useState(isLiked);

 useEffect(() => {
   setLocalIsLiked(isLiked);
 }, [isLiked]);

 const handleLikeToggle = async () => {
 if (!userId) {
 router.push('/login');
 return;
 }

 // Responsive/Optimistic State Switch
 setLocalIsLiked(!localIsLiked);

 try {
 if (localIsLiked) {
 await unlike({ user_id: userId, property_id: property.id }).unwrap();
 } else {
 await like({ user_id: userId, property_id: property.id }).unwrap();
 }
 } catch (err) {
 // Revert UI to match actual DB state on failure
 setLocalIsLiked(localIsLiked);
 console.error('Failed to toggle like:', err);
 dispatch(showModal({
   type: 'error',
   title: 'Acquisition Failed',
   message: 'Could not sync favorites with the database. Please try again.',
   actionText: 'Retry'
 }));
 }
 };

 const specs = [
 { icon: BedDouble, label: `${property.specifications?.bedrooms || 0} Bedrooms` },
 { icon: Bath, label: `${property.specifications?.bathrooms || 0} Bathrooms` },
 { icon: Maximize, label: `${property.specifications?.area_sqm || property.specifications?.area || 0} m² Area` },
 { icon: Car, label: property.specifications?.parking ? 'Parking Available' : 'No Parking' },
 ];

 return (
 <div className="space-y-12">
 {/* Title & Stats Section */}
 <div className="space-y-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="space-y-2">
 <h1 className="text-4xl lg:text-5xl font-black text-navy leading-tight tracking-tighter uppercase ">
 {property.title}
 </h1>
 <div className="flex items-center text-slate-500 font-medium">
 <MapPin className="w-5 h-5 text-primary mr-2" />
 <span className="text-lg">
   {(() => {
     const loc = property.location;
     if (!loc) return property.city || 'Cameroon';
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
 
 <div className="flex items-center space-x-6 bg-slate-50 border border-border p-4 rounded-3xl">
 <div className="text-center px-4">
 <div className="flex items-center justify-center text-primary mb-1">
 <Eye className="w-4 h-4 mr-1.5" />
 <span className="text-sm font-black text-navy">{property.views_count || 0}</span>
 </div>
 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Impressions</p>
 </div>
 <div className="w-px h-8 bg-border" />
 <div className="text-center px-4">
 <button 
 onClick={handleLikeToggle}
 className={`flex flex-col items-center justify-center transition-all ${localIsLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
 >
 <div className="flex items-center justify-center mb-1">
 <motion.div
   animate={{ scale: localIsLiked ? 1.25 : 1 }}
   transition={{ type: "spring", stiffness: 350, damping: 12 }}
 >
   <Heart className={`w-4 h-4 mr-1.5 ${localIsLiked ? 'fill-current text-red-500' : ''}`} />
 </motion.div>
 <span className="text-sm font-black">{property.likes_count || 0}</span>
 </div>
 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Favorites</p>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Specifications Icons */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {specs.map((spec, i) => (
 <div key={i} className="bg-slate-50 border border-border p-6 rounded-[2rem] flex flex-col items-center text-center space-y-3 group hover:border-primary/20 transition-all">
 <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all text-primary">
 <spec.icon className="w-6 h-6" />
 </div>
 <span className="text-sm font-bold text-navy">{spec.label}</span>
 </div>
 ))}
 </div>

 {/* Description Section */}
 <div className="space-y-6">
 <div className="flex items-center space-x-4">
 <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">About the Property</h2>
 <div className="flex-1 h-px bg-border" />
 </div>
 <div className="prose max-w-none">
 <p className="text-lg text-slate-600 leading-relaxed font-medium">
 {property.description || 'This premium property offers a sophisticated living experience in one of Cameroon\'s most sought-after neighborhoods. Fully verified and ready for your first visit.'}
 </p>
 </div>
 </div>

 {/* Advantages / Features */}
 {property.advantages && property.advantages.length > 0 && (
 <div className="space-y-8">
 <div className="flex items-center space-x-4">
 <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Property Features</h2>
 <div className="flex-1 h-px bg-border" />
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {property.advantages.map((adv, i) => (
 <div key={i} className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-50 border border-border group hover:bg-slate-100 transition-all">
 <div className="p-2 bg-primary/20 rounded-xl text-primary">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <span className="text-sm font-black text-slate-700 uppercase tracking-widest group-hover:text-navy transition-colors">{adv}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Listing Metadata */}
 <div className="pt-12 border-t border-border flex flex-wrap gap-8 opacity-60 text-slate-500">
 <div className="flex items-center space-x-2">
 <Calendar className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">
 Listed: {
 property.created_at?._seconds 
 ? new Date(property.created_at._seconds * 1000).toLocaleDateString()
 : new Date(property.created_at || Date.now()).toLocaleDateString()
 }
 </span>
 </div>
 <div className="flex items-center space-x-2">
 <ShieldCheck className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">ID: {property.id}</span>
 </div>
 </div>
 </div>
 );
}
