'use client';
import { motion } from 'framer-motion';
import { 
 Building2, 
 TrendingUp, 
 ShieldCheck, 
 ArrowRight,
 Sparkles,
 Zap
} from 'lucide-react';
import Link from 'next/link';

export function LandlordOnboarding() {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative overflow-hidden group bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-10 md:p-14"
 >
 {/* Background Gloss */}
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
 
 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div className="space-y-8">
 <div className="inline-flex items-center space-x-3 bg-amber-500/10 border border-amber-500/20 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-amber-500" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Elite Partnership</span>
 </div>
 
 <div className="space-y-4">
 <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase ">
 Evolve into a <br />
 <span className="text-gradient-gold">Property Tycoon.</span>
 </h2>
 <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
 Stop simply visiting and start commanding. Join our network of verified landlords to list your assets, automate tenant audits, and secure high-value agreements.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
 {[
 { icon: TrendingUp, label: 'Asset Analytics', desc: 'Track view velocity and high-intent saves.' },
 { icon: ShieldCheck, label: 'Legal Safeguards', desc: 'Verified booking deposits for every deal.' },
 ].map((item, i) => (
 <div key={i} className="space-y-3">
 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
 <item.icon className="w-5 h-5 text-primary-light" />
 </div>
 <div>
 <p className="text-[11px] font-black uppercase tracking-widest text-white">{item.label}</p>
 <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed mt-1">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>

 <Link 
 href="/dashboard/profile"
 className="inline-flex items-center space-x-4 bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all hover:scale-105 emerald-glow-light"
 >
 <span>Begin Onboarding</span>
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>

 <div className="relative hidden lg:block">
 <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-[4rem] border border-white/10 flex items-center justify-center relative overflow-hidden">
 <Building2 className="w-32 h-32 text-gray-800 opacity-20" />
 
 {/* Floating Badges */}
 <motion.div 
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 4, repeat: Infinity }}
 className="absolute top-12 left-12 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl"
 >
 <div className="flex items-center space-x-3">
 <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
 <Zap className="w-4 h-4 text-white" />
 </div>
 <div>
 <p className="text-[8px] font-black text-white uppercase tracking-widest">Active Verification</p>
 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter ">Secured Asset</p>
 </div>
 </div>
 </motion.div>

 <motion.div 
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 5, repeat: Infinity, delay: 1 }}
 className="absolute bottom-12 right-12 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl"
 >
 <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Portfolio Growth</p>
 <div className="flex items-baseline space-x-2">
 <p className="text-2xl font-black text-white tracking-tighter uppercase">+128%</p>
 <TrendingUp className="w-3 h-3 text-emerald-500" />
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 </motion.div>
 );
}
