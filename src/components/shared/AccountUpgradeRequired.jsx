'use client';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function AccountUpgradeRequired({ 
  title = "Account Upgrade Required", 
  message = "Only registered Elite Landlords can access this feature.",
  buttonText = "Upgrade Account",
  buttonHref = "/dashboard/profile"
}) {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-12 text-center space-y-8 premium-shadow"
      >
        <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldCheck className="w-10 h-10 text-amber-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{title}</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link 
            href={buttonHref}
            className="block w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs emerald-glow-light transition-all hover:scale-105"
          >
            {buttonText}
          </Link>
          <Link href="/" className="block text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
