'use client';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function AccountUpgradeRequired({
  title = 'Access Required',
  message = 'Only registered landlords can access this feature.',
  buttonText = 'Upgrade Account',
  buttonHref = '/dashboard/profile',
}) {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-10 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldCheck className="w-7 h-7 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-white/40 leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href={buttonHref}
            className="block w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all"
          >
            {buttonText}
          </Link>
          <Link href="/" className="block text-[10px] font-bold text-white/30 hover:text-white transition-colors">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
