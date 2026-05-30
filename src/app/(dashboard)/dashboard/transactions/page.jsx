'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
 CreditCard, 
 ArrowUpRight, 
 ArrowDownLeft, 
 Download, 
 Search,
 Filter,
 ShieldCheck,
 TrendingUp,
 History,
 CheckCircle2,
 Clock,
 AlertCircle,
 Sparkles
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetTransactionsByUserQuery } from '@/store/services/transactionApi';
import { formatPrice } from '@/lib/utils';

export default function TransactionsPage() {
 const user = useSelector(selectCurrentUser);
 const { data: transactionsData, isLoading } = useGetTransactionsByUserQuery(user?.uid, {
 skip: !user?.uid
 });

 const transactions = transactionsData?.data || [];

 const getStatusStyle = (status) => {
 switch (status) {
 case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
 case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
 case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
 default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
 }
 };

 if (isLoading) {
 return (
 <div className="space-y-8 animate-pulse">
 <div className="h-48 bg-white/5 rounded-[3rem]" />
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-20 bg-white/5 rounded-2xl" />
 ))}
 </div>
 );
 }

 return (
 <div className="space-y-12 pb-20">
 {/* Header */}
 <div className="space-y-6">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <ShieldCheck className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Financial Clearance</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Asset <br />
 <span className="text-gradient-gold">Transactions.</span>
 </h1>
 </div>

 {/* Financial Overview Card */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
 
 <div className="relative z-10 space-y-8">
 <div className="flex items-center justify-between">
 <div className="bg-primary/20 p-4 rounded-2xl">
 <CreditCard className="w-8 h-8 text-primary-light" />
 </div>
 <div className="text-right">
 <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Account Standing</p>
 <p className="text-xs font-black text-emerald-500 tracking-tighter uppercase">Verified Elite</p>
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-600">Total Capital Deployed</p>
 <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
 {formatPrice(transactions.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.amount, 0))}
 </h2>
 </div>

 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
 <div className="space-y-1">
 <p className="text-[9px] uppercase font-black tracking-widest text-gray-500">Active Commitments</p>
 <p className="text-2xl font-black text-white ">{transactions.filter(t => t.status === 'pending').length}</p>
 </div>
 <div className="space-y-1 text-right">
 <p className="text-[9px] uppercase font-black tracking-widest text-gray-500">Cleared Assets</p>
 <p className="text-2xl font-black text-white ">{transactions.filter(t => t.status === 'completed').length}</p>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between space-y-8">
 <div className="space-y-4">
 <div className="flex items-center space-x-3 text-secondary">
 <TrendingUp className="w-5 h-5" />
 <span className="text-[10px] font-black uppercase tracking-widest">Market Insight</span>
 </div>
 <p className="text-sm font-medium text-gray-400 leading-relaxed">
 KamerNdah transactions are routed through secure, verified gateway protocols to ensure institutional-grade clearance for every professional estate.
 </p>
 </div>
 <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] emerald-glow-light">
 Request Statement
 </button>
 </div>
 </div>

 {/* Transaction List */}
 <div className="space-y-8">
 <div className="flex items-center justify-between px-4">
 <div className="flex items-center space-x-3">
 <History className="w-5 h-5 text-gray-500" />
 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Identity History</h3>
 </div>
 <div className="flex items-center space-x-4">
 <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-white transition-all">
 <Filter className="w-4 h-4" />
 </button>
 <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-white transition-all">
 <Search className="w-4 h-4" />
 </button>
 </div>
 </div>

 {transactions.length === 0 ? (
 <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-20 text-center space-y-6">
 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
 <CreditCard className="w-6 h-6 text-gray-700" />
 </div>
 <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">No verified transactions discovered</p>
 </div>
 ) : (
 <div className="space-y-4">
 {transactions.map((transaction, index) => (
 <motion.div
 key={transaction.id}
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.05 }}
 className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 transition-all group"
 >
 <div className="flex items-center space-x-6">
 <div className={`p-4 rounded-2xl ${
 transaction.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary-light'
 }`}>
 {transaction.type === 'payment' ? <ArrowUpRight className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
 </div>
 <div className="space-y-1">
 <h4 className="text-white font-black uppercase tracking-widest text-[11px] ">{transaction.description || 'Estate Transaction'}</h4>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">PID: {transaction.reference_id?.slice(0, 8)} • {new Date(transaction.created_at).toLocaleDateString()}</p>
 </div>
 </div>

 <div className="flex items-center justify-between md:justify-end gap-10">
 <div className="text-right">
 <p className="text-lg font-black text-white tracking-tighter">{formatPrice(transaction.amount)}</p>
 <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{transaction.payment_method || 'Mobile Money'}</p>
 </div>
 <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(transaction.status)}`}>
 {transaction.status}
 </div>
 <button className="hidden md:block p-3 text-gray-700 hover:text-white transition-opacity opacity-0 group-hover:opacity-100">
 <Download className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>

 {/* Security Banner */}
 <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
 <div className="flex items-center space-x-4">
 <div className="p-3 bg-primary/20 rounded-2xl text-primary-light">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <p className="text-white font-black uppercase tracking-widest text-[11px]">Secure Liquidity Network</p>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Institutional Escrow Verified</p>
 </div>
 </div>
 <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
 <AlertCircle className="w-4 h-4" />
 <span>Encrypted Transactions via MTN/Orange Money</span>
 </div>
 </div>
 </div>
 );
}
