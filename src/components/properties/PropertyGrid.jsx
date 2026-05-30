import { PropertyCard } from './PropertyCard';
import { motion } from 'framer-motion';
import { Sparkles, XCircle } from 'lucide-react';

export function PropertyGrid({ properties: rawProperties, loading, emptyMessage }) {
 const properties = Array.isArray(rawProperties) ? rawProperties : [];
 
 if (loading) {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/5 premium-shadow animate-pulse">
 <div className="aspect-[4/3] bg-white/5"></div>
 <div className="p-8 space-y-6">
 <div className="space-y-3">
 <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
 <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
 </div>
 <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
 <div className="h-8 bg-white/5 rounded-lg w-full"></div>
 <div className="h-8 bg-white/5 rounded-lg w-full border-x border-white/5 px-2"></div>
 <div className="h-8 bg-white/5 rounded-lg w-full"></div>
 </div>
 <div className="flex justify-between items-center">
 <div className="h-8 bg-white/10 rounded-lg w-1/3"></div>
 <div className="h-10 bg-white/10 rounded-xl w-24"></div>
 </div>
 </div>
 </div>
 ))}
 </div>
 );
 }

 if (properties.length === 0) {
 return (
 <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[3rem] premium-shadow px-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
 <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 text-gray-500">
 <XCircle className="w-10 h-10" />
 </div>
 <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-4 relative z-10">No Estates Found</h3>
 <p className="text-gray-400 font-medium mb-8 max-w-md mx-auto relative z-10 leading-relaxed">
 {emptyMessage}
 </p>
 <button
 onClick={() => window.location.reload()}
 className="relative z-10 bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all hover:scale-105"
 >
 Reset Search
 </button>
 </div>
 );
 }

 return (
 <div className="space-y-12">
 {/* Grid Layout */}
 <motion.div 
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
 initial="hidden"
 animate="visible"
 variants={{
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: { staggerChildren: 0.1 }
 }
 }}
 >
 {properties.map((property) => (
 <motion.div 
 key={property.id}
 variants={{
 hidden: { y: 40, opacity: 0 },
 visible: { 
 y: 0, 
 opacity: 1,
 transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
 }
 }}
 >
 <PropertyCard property={property} />
 </motion.div>
 ))}
 </motion.div>

 {/* Results Count */}
 <div className="text-center pt-8 border-t border-white/5">
 <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary" />
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">
 Showing {properties.length} Premium Propert{properties.length === 1 ? 'y' : 'ies'}
 </p>
 </div>
 </div>
 </div>
 );
}