'use client';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function LandlordOnboarding() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">Partnership</span>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
              Become a <span className="text-primary">Landlord.</span>
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-md leading-relaxed">
              List your assets, automate tenant audits, and secure high-value agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: 'Asset Analytics', desc: 'Track views and saves.' },
              { icon: ShieldCheck, label: 'Legal Safeguards', desc: 'Verified booking deposits.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center border border-white/[0.04] flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider transition-all"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative hidden lg:block">
          <div className="aspect-square bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
            <Building2 className="w-24 h-24 text-white/[0.06]" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-8 left-8 bg-white/[0.04] backdrop-blur border border-white/[0.06] p-4 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-white/50 tracking-wider">Verification</p>
                  <p className="text-[10px] font-bold text-emerald-400">Secured</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-8 right-8 bg-white/[0.04] backdrop-blur border border-white/[0.06] p-4 rounded-xl"
            >
              <p className="text-[8px] font-bold text-white/40 tracking-wider mb-1">Growth</p>
              <div className="flex items-baseline gap-1">
                <p className="text-lg font-bold text-white">+128%</p>
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
