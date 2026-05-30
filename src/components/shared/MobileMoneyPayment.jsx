'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Smartphone, 
 ShieldCheck, 
 Loader2, 
 AlertCircle, 
 CheckCircle2, 
 XCircle,
 Phone,
 ArrowRight,
 Lock,
 Zap,
 Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function MobileMoneyPayment({ amount, onSuccess, onCancel, description }) {
 const [provider, setProvider] = useState('mtn'); // 'mtn' or 'orange'
 const [phone, setPhone] = useState('');
 const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'waiting_ussd' | 'success' | 'failed'
 const [error, setError] = useState(null);

 const handleInitiate = (e) => {
 e.preventDefault();
 if (!phone) return;
 setStatus('processing');
 
 // Simulate network delay for USSD prompt
 setTimeout(() => {
 setStatus('waiting_ussd');
 }, 2000);
 };

 const handleSimulateSuccess = () => {
 setStatus('success');
 setTimeout(() => {
 onSuccess?.({
 provider,
 phone,
 transaction_id: `KND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
 amount
 });
 }, 1500);
 };

 const handleSimulateFailure = () => {
 setStatus('failed');
 setError('Insufficient funds or transaction timed out. Please try again.');
 };

 return (
 <div className="space-y-8 min-h-[400px] flex flex-col justify-between">
 <AnimatePresence mode="wait">
 {status === 'idle' && (
 <motion.div 
 key="idle"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="space-y-8"
 >
 {/* Header */}
 <div className="text-center space-y-3">
 <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-2">
 <Lock className="w-3.5 h-3.5 text-emerald-500" />
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Secure Payment Protocol</span>
 </div>
 <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Checkout</h3>
 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{description}</p>
 </div>

 {/* Provider Selection */}
 <div className="grid grid-cols-2 gap-4">
 {[
 { id: 'mtn', name: 'MTN MoMo', color: 'bg-[#FFCC00]', text: 'text-black' },
 { id: 'orange', name: 'Orange Money', color: 'bg-[#FF6600]', text: 'text-white' }
 ].map((p) => (
 <button
 key={p.id}
 onClick={() => setProvider(p.id)}
 className={`relative p-5 rounded-3xl border transition-all h-24 flex flex-col items-center justify-center space-y-2 overflow-hidden ${
 provider === p.id 
 ? 'border-white/20 ring-2 ring-primary ring-offset-4 ring-offset-[#0c0c0e]' 
 : 'border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
 }`}
 >
 <div className={`absolute top-0 left-0 w-full h-1.5 ${p.color}`} />
 <span className={`text-[10px] font-black uppercase tracking-widest text-white`}>{p.name}</span>
 {provider === p.id && <div className="absolute top-4 right-4"><CheckCircle2 className="w-4 h-4 text-primary" /></div>}
 </button>
 ))}
 </div>

 {/* Form */}
 <form onSubmit={handleInitiate} className="space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Payment Phone</label>
 <div className="relative">
 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input 
 type="tel"
 required
 placeholder="6XX XXX XXX"
 value={phone}
 onChange={(e) => setPhone(e.target.value)}
 className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-white font-bold text-lg focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
 />
 </div>
 </div>

 <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
 <div className="space-y-1">
 <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest">Amount Due</p>
 <p className="text-2xl font-black text-white tracking-tighter">{formatPrice(amount)}</p>
 </div>
 <button 
 type="submit"
 className="bg-primary text-white h-14 w-14 rounded-2xl flex items-center justify-center emerald-glow group"
 >
 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 </form>
 </motion.div>
 )}

 {(status === 'processing' || status === 'waiting_ussd') && (
 <motion.div 
 key="loading"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="flex flex-col items-center justify-center text-center space-y-10 py-12"
 >
 <div className="relative">
 <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
 <div className="absolute inset-0 flex items-center justify-center">
 <Smartphone className="w-8 h-8 text-primary animate-pulse" />
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
 {status === 'processing' ? 'Authenticating Identity' : 'Waiting for Device'}
 </h3>
 <p className="text-gray-500 text-xs font-medium max-w-xs mx-auto leading-relaxed">
 {status === 'processing' 
 ? 'Verifying provider credentials and secure line...' 
 : `Please check your phone connected to ${phone}. Enter your MoMo PIN to authorize ${formatPrice(amount)}.`}
 </p>
 </div>

 {status === 'waiting_ussd' && (
 <div className="flex flex-col space-y-4 w-full pt-8">
 <div className="text-[10px] font-black uppercase tracking-widest text-amber-500/50">Simulation Controls</div>
 <div className="grid grid-cols-2 gap-4">
 <button onClick={handleSimulateSuccess} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
 Simulate Success
 </button>
 <button onClick={handleSimulateFailure} className="bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
 Simulate Failure
 </button>
 </div>
 </div>
 )}
 </motion.div>
 )}

 {status === 'success' && (
 <motion.div 
 key="success"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center text-center space-y-8 py-12"
 >
 <div className="w-28 h-28 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 relative">
 <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] rounded-full" />
 <CheckCircle2 className="w-14 h-14 text-emerald-500" />
 </div>
 <div className="space-y-3">
 <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Payment Cleared</h3>
 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Transaction Securely Transmitted</p>
 </div>
 </motion.div>
 )}

 {status === 'failed' && (
 <motion.div 
 key="failed"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center text-center space-y-8 py-12"
 >
 <div className="w-28 h-28 bg-red-500/20 rounded-[2.5rem] flex items-center justify-center border border-red-500/20 relative">
 <XCircle className="w-14 h-14 text-red-500" />
 </div>
 <div className="space-y-4 max-w-xs">
 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Authorization failed</h3>
 <p className="text-red-500/60 text-xs font-medium leading-relaxed">{error}</p>
 </div>
 <button 
 onClick={() => setStatus('idle')}
 className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
 >
 Try Secure Line Again
 </button>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="pt-8 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
 <div className="flex items-center space-x-2">
 <ShieldCheck className="w-3.5 h-3.5" />
 <span className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Secure Portal</span>
 </div>
 <div className="flex items-center space-x-2">
 <Sparkles className="w-3.5 h-3.5" />
 <span className="text-[8px] font-black uppercase tracking-[0.2em]">Institutional Clearing</span>
 </div>
 </div>
 </div>
 );
}
