'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
 Building2,
 TrendingUp,
 Briefcase,
 Rocket
} from 'lucide-react';

export default function RealEstatePage() {
 const [email, setEmail] = useState('');
 const [isSubscribed, setIsSubscribed] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const handleSubscribe = async (e) => {
   e.preventDefault();
   if (!email) return;

   setIsLoading(true);
   // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 1500));
   setIsSubscribed(true);
   setEmail('');
   setIsLoading(false);
 };

 const features = [
   {
     icon: Building2,
     title: 'Commercial Excellence',
     description: 'Office spaces, retail locations, and commercial investments with high ROI potential.'
   },
   {
     icon: TrendingUp,
     title: 'Development Projects',
     description: 'New construction projects and land development opportunities across Cameroon.'
   },
   {
     icon: Briefcase,
     title: 'Investment Portfolios',
     description: 'Curated property investment options for both local and international investors.'
   }
 ];

 const investmentCities = [
   { name: 'Douala', type: 'Commercial Hub', potential: 'High' },
   { name: 'Yaoundé', type: 'Government & Diplomatic', potential: 'High' },
   { name: 'Buea', type: 'Tourism & Education', potential: 'Medium' },
   { name: 'Limbe', type: 'Tourism & Port City', potential: 'Medium' },
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
     
     {/* Background Glows (Blue/Primary mixed with Gold/Secondary) */}
     <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
     <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

     {/* Hero Section */}
     <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 text-center">
       <motion.div 
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="max-w-4xl mx-auto"
       >
         <motion.div variants={itemVariants} className="w-24 h-24 bg-slate-50 border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-8 premium-shadow relative">
           <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
           <Rocket className="w-10 h-10 text-primary relative z-10" />
         </motion.div>
         
         <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
           Invest in <br className="md:hidden" />
           <span className="text-gradient-gold">Commercial Legacy</span>
         </motion.h1>
         
         <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
           Exclusive real estate investment opportunities coming soon to Cameroon's fastest growing markets.
         </motion.p>

         {/* Email Subscription */}
         <motion.div variants={itemVariants} className="max-w-lg mx-auto">
           {!isSubscribed ? (
             <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter your email for early access..."
                 className="flex-1 bg-white border border-border rounded-2xl px-6 py-4 text-navy font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-400"
                 required
               />
               <button
                 type="submit"
                 disabled={isLoading}
                 className="bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
               >
                 {isLoading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     <span>Transmitting</span>
                   </>
                 ) : (
                   <span>Request Access</span>
                 )}
               </button>
             </form>
           ) : (
             <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
               <p className="text-emerald-700 font-bold uppercase tracking-widest text-sm">
                 ✓ Priority Access Granted
               </p>
               <p className="text-emerald-600 text-xs mt-2 font-medium">You will be notified prior to public launch.</p>
             </div>
           )}
         </motion.div>
       </motion.div>
     </div>

     {/* Features Section */}
     <div className="relative z-10 border-y border-border bg-slate-50 py-24">
       <div className="container mx-auto px-4">
         <div className="text-center mb-16 space-y-4">
           <h2 className="text-3xl font-black uppercase tracking-tighter">Strategic Opportunities</h2>
           <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Asset Classes Coming Soon</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {features.map((feature, index) => (
             <div key={index} className="bg-white border border-border rounded-[2.5rem] p-10 text-center hover:bg-slate-50/50 transition-all group">
               <div className="w-20 h-20 bg-slate-50 border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                 <feature.icon className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
               <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* Investment Cities */}
     <div className="relative z-10 container mx-auto px-4 py-24">
       <div className="text-center mb-16 space-y-4">
         <h2 className="text-3xl font-black uppercase tracking-tighter">Prime Markets</h2>
         <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Target Geographies</p>
       </div>
       
       <div className="max-w-5xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {investmentCities.map((city, index) => (
             <div key={index} className="bg-white border border-border rounded-[2rem] p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <h3 className="text-2xl font-black tracking-tighter uppercase">{city.name}</h3>
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     city.potential === 'High' 
                       ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                       : 'bg-secondary/10 text-secondary-dark border-secondary/20'
                   }`}>
                     {city.potential} Potential
                   </span>
                 </div>
                 <p className="text-primary font-medium text-sm mb-6">Focus: {city.type}</p>
               </div>
               <div className="flex space-x-2">
                 {['Commercial', 'Residential', 'Development'].map((tag) => (
                   <span key={tag} className="bg-slate-100 text-slate-600 border border-border px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                     {tag}
                   </span>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* CTA Section */}
     <div className="relative z-10 container mx-auto px-4 pb-24 text-center">
       <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[3rem] p-16">
         <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
           Ready to Scale in Cameroon?
         </h2>
         <p className="text-primary-dark mb-10 max-w-xl mx-auto font-medium leading-relaxed">
           Our corporate concierge team is ready to discuss off-market opportunities and high-yield asset acquisitions.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link
             href="/contact"
             className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all emerald-glow"
           >
             Contact Advisory Team
           </Link>
           <Link
             href="/buy"
             className="bg-slate-50 border border-border text-navy px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:border-slate-300 transition-all"
           >
             Browse Consumer Assets
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
}