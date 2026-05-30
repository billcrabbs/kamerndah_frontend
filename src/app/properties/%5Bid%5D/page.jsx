'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
 ArrowLeft, 
 Share2, 
 Heart,
 ShieldCheck,
 Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useGetPropertyByIdQuery } from '@/store/services/propertyApi';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertyInfo } from '@/components/properties/PropertyInfo';
import { PropertyActionSidebar } from '@/components/properties/PropertyActionSidebar';

export default function PropertyDetailsPage() {
 const { id } = useParams();
 const { data: realProperty, isLoading } = useGetPropertyByIdQuery(id);

 // Fallback to mock data if real API is loading or returns nothing/error
 // This ensures the USER always sees a premium UI during development
 const property = realProperty || MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center">
 <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 return (
 <div className="bg-background min-h-screen pb-20 pt-24">
 <div className="main-container">
 
 {/* Navigation & Actions Top Bar */}
 <div className="flex items-center justify-between mb-8">
 <Link 
 href="/" 
 className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
 >
 <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10">
 <ArrowLeft className="w-5 h-5" />
 </div>
 <span className="text-sm font-bold uppercase tracking-widest">Back to Gallery</span>
 </Link>
 
 <div className="flex items-center space-x-3">
 <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
 <Share2 className="w-5 h-5" />
 </button>
 <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 transition-all">
 <Heart className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Verified Status Tag */}
 {property.status === 'verified' && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl mb-6 mb-8"
 >
 <div className="p-1 bg-primary rounded-lg emerald-glow">
 <ShieldCheck className="w-3 h-3 text-white" />
 </div>
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">Elite Verified Estate</span>
 <div className="h-3 w-px bg-white/10 mx-2" />
 <Sparkles className="w-3 h-3 text-secondary" />
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Premium Listing</span>
 </motion.div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
 
 {/* Main Content (Images + Info) */}
 <div className="lg:col-span-8 space-y-12">
 <PropertyGallery images={property.images} title={property.title} />
 <PropertyInfo property={property} />
 </div>

 {/* Sidebar (Price + Booking) */}
 <div className="lg:col-span-4 sticky top-32">
 <PropertyActionSidebar property={property} />
 </div>

 </div>
 </div>
 </div>
 );
}
