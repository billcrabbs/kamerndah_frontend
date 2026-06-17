'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
 Home,
 MapPin,
 Star,
 Globe
} from 'lucide-react';

export default function GuestHousesPage() {
 const [email, setEmail] = useState('');
 const [isSubscribed, setIsSubscribed] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const handleSubscribe = async (e) => {
   e.preventDefault();
   if (!email) return;

   setIsLoading(true);
   await new Promise(resolve => setTimeout(resolve, 1500));
   setIsSubscribed(true);
   setEmail('');
   setIsLoading(false);
 };

 const features = [
   {
     icon: Home,
     title: 'Luxury Villas',
     description: 'Premium short-term accommodations with verified quality, high-end amenities, and ultimate privacy.'
   },
   {
     icon: MapPin,
     title: 'Prime Locations',
     description: 'Properties situated in the most sought-after tourist and diplomatic destinations across Cameroon.'
   },
   {
     icon: Star,
     title: 'Verified Quality',
     description: 'Every property is personally vetted by our concierge team to guarantee safety and luxury.'
   }
 ];

 const touristDestinations = [
   {
     name: 'Limbe Beachfront',
     type: 'Coastal Getaway',
     attractions: ['Private Beach', 'Ocean Views', 'Seafood']
   },
   {
     name: 'Buea Mountain View',
     type: 'Mountain Retreat', 
     attractions: ['Mount Cameroon', 'Cool Climate', 'Nature']
   },
   {
     name: 'Kribi Coastal',
     type: 'Tropical Vacation',
     attractions: ['White Sand', 'Lobe Waterfalls', 'Luxury Dining']
   },
   {
     name: 'Yaoundé Diplomatic',
     type: 'Executive Hub',
     attractions: ['Embassies', 'High Security', 'Central']
   }
 ];

 const containerVariants = {
   hidden: { opacity: 0 },
   visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
 };

 const itemVariants = {
   hidden: { y: 20, opacity: 0 },
   visible: { y: 0, opacity: 1 }
 };

 return (
   <div className="relative min-h-screen bg-background pt-24 pb-12 overflow-hidden text-navy">
     {/* Afro-Geometric Anchor */}
     <div className="absolute inset-0 pattern-afro opacity-[0.03] pointer-events-none" />
     
     {/* Background Glows (Emerald specific for Guest Houses) */}
     <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
     <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 pointer-events-none" />

     {/* Hero Section */}
     <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 text-center">
       <motion.div 
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="max-w-4xl mx-auto"
       >
         <motion.div variants={itemVariants} className="w-24 h-24 bg-slate-50 border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-8 premium-shadow relative">
           <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
           <Globe className="w-10 h-10 text-emerald-500 relative z-10" />
         </motion.div>
         
         <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
           Escape to <br className="md:hidden" />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">Premium Stays</span>
         </motion.h1>
         
         <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
           Discover exceptional short-term rentals and luxury guest houses in Cameroon's most beautiful destinations.
         </motion.p>

         {/* Email Subscription */}
         <motion.div variants={itemVariants} className="max-w-lg mx-auto">
           {!isSubscribed ? (
             <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter your email to unlock listings..."
                 className="flex-1 bg-white border border-border rounded-2xl px-6 py-4 text-navy font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-400"
                 required
               />
               <button
                 type="submit"
                 disabled={isLoading}
                 className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
               >
                 {isLoading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     <span>Transmitting</span>
                   </>
                 ) : (
                   <span>Get Access</span>
                 )}
               </button>
             </form>
           ) : (
             <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
               <p className="text-emerald-700 font-bold uppercase tracking-widest text-sm">
                 ✓ Concierge List Joined
               </p>
               <p className="text-emerald-600 text-xs mt-2 font-medium">We will email you our curated short-stay catalog shortly.</p>
             </div>
           )}
         </motion.div>
       </motion.div>
     </div>

     {/* Features Section */}
     <div className="relative z-10 border-y border-border bg-slate-50 py-24">
       <div className="container mx-auto px-4">
         <div className="text-center mb-16 space-y-4">
           <h2 className="text-3xl font-black uppercase tracking-tighter">Exceptional Experiences</h2>
           <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">The KamerNdah Standard</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {features.map((feature, index) => (
             <div key={index} className="bg-white border border-border rounded-[2.5rem] p-10 text-center hover:bg-slate-50/50 hover:border-emerald-500/30 transition-all group">
               <div className="w-20 h-20 bg-slate-50 border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                 <feature.icon className="w-8 h-8 text-emerald-500" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
               <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* Tourist Destinations */}
     <div className="relative z-10 container mx-auto px-4 py-24">
       <div className="text-center mb-16 space-y-4">
         <h2 className="text-3xl font-black uppercase tracking-tighter">Breathtaking Destinations</h2>
         <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Curated Locations</p>
       </div>
       
       <div className="max-w-6xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {touristDestinations.map((destination, index) => (
             <div key={index} className="bg-white border border-border rounded-[2rem] p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
               <div>
                 <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">{destination.name}</h3>
                 <p className="text-emerald-600 font-medium text-sm mb-6">{destination.type}</p>
               </div>
               <div className="space-y-3">
                 {destination.attractions.map((attraction, attrIndex) => (
                   <div key={attrIndex} className="flex items-center text-slate-500 text-sm font-medium">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                     {attraction}
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* CTA Section */}
     <div className="relative z-10 container mx-auto px-4 pb-24 text-center">
       <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[3rem] p-16">
         <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
           Own a Premium Guest House?
         </h2>
         <p className="text-emerald-700 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
           List your luxury property on the KamerNdah network and offer exclusive stays to thousands of high-net-worth travelers.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link
             href="/submit-property"
             className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
           >
             List Your Property
           </Link>
           <Link
             href="/contact"
             className="bg-slate-50 border border-border text-navy px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:border-slate-300 transition-all"
           >
             Learn More
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
}