'use client';
import { motion } from 'framer-motion';
import { 
 Calendar, 
 MapPin, 
 User, 
 CheckCircle2, 
 XCircle, 
 Clock,
 ArrowRight,
 ShieldCheck,
 Zap,
 Phone,
 MessageCircle,
 TrendingUp,
 FileText
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function LandlordActionCard({ 
 item, 
 type, // 'visit' | 'booking'
 onStatusUpdate, 
 isUpdating 
}) {
 const isVisit = type === 'visit';
 const status = item.status;

 const statusColors = {
 requested: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
 pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
 confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
 completed: 'bg-primary/10 text-primary-light border-primary/20',
 active: 'bg-primary/10 text-primary-light border-primary/20',
 cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-8 space-y-8 hover:border-white/10 transition-all group overflow-hidden relative"
 >
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
 
 {/* Card Header: Client Info */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
 <div className="flex items-center space-x-5">
 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
 {item.user_photo ? (
 <img src={item.user_photo} className="w-full h-full object-cover" alt="" />
 ) : (
 <User className="w-8 h-8 text-gray-700" />
 )}
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light mb-1">Incoming Request</p>
 <h4 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
 {item.user_name || 'Verified Client'}
 </h4>
 <div className="flex items-center space-x-3 mt-2">
 <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColors[status]}`}>
 {status}
 </span>
 {isVisit && (
 <div className="flex items-center space-x-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
 <Clock className="w-3 h-3" />
 <span>{new Date(item.scheduled_date).toLocaleDateString()}</span>
 </div>
 )}
 </div>
 </div>
 </div>
 
 <div className="text-right">
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Target Asset</p>
 <p className="text-sm font-bold text-white tracking-tight ">{item.property_title}</p>
 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Douala, LT • {item.property_id?.slice(0, 8)}</p>
 </div>
 </div>

 {/* Details Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
 <div className="space-y-1.5">
 <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
 <ShieldCheck className="w-3 h-3 text-emerald-500" />
 <span>Verification State</span>
 </div>
 <p className="text-xs font-bold text-gray-300">Identity Cleared</p>
 </div>
 <div className="space-y-1.5 text-center md:text-left">
 <div className="flex items-center justify-center md:justify-start space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
 <FileText className="w-3 h-3 text-secondary" />
 <span>Agreement Type</span>
 </div>
 <p className="text-xs font-bold text-white uppercase tracking-tighter ">
 {isVisit ? 'Physical Audit' : `${item.booking_type} Intent`}
 </p>
 </div>
 <div className="space-y-1.5 text-right">
 <div className="flex items-center justify-end space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
 <TrendingUp className="w-3 h-3 text-primary" />
 <span>Financial Standing</span>
 </div>
 <p className="text-xs font-bold text-emerald-500">
 {isVisit ? 'Fee Cleared' : `${formatPrice(item.agreed_price)} Committed`}
 </p>
 </div>
 </div>

 {/* Notes Section if exists */}
 {item.notes && (
 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-[10px] font-medium text-gray-500 leading-relaxed ">
 "{item.notes}"
 </div>
 )}

 {/* Action Area */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
 <div className="flex items-center space-x-4">
 <button className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/20 transition-all">
 <Phone className="w-5 h-5" />
 </button>
 <button className="p-4 bg-primary/10 text-primary-light rounded-2xl border border-primary/10 hover:bg-primary/20 transition-all">
 <MessageCircle className="w-5 h-5" />
 </button>
 </div>

 <div className="flex items-center space-x-4 w-full md:w-auto">
 {(status === 'requested' || status === 'pending') && (
 <>
 <button 
 disabled={isUpdating}
 onClick={() => onStatusUpdate(item.id, 'cancelled')}
 className="flex-1 md:flex-none px-8 py-4 rounded-2xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
 >
 Reject
 </button>
 <button 
 disabled={isUpdating}
 onClick={() => onStatusUpdate(item.id, 'confirmed')}
 className="flex-1 md:flex-none px-10 py-5 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest emerald-glow flex items-center justify-center space-x-2"
 >
 <span>{isVisit ? 'Confirm Audit' : 'Approve Agreement'}</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </>
 )}

 {status === 'confirmed' && (
 <button 
 disabled={isUpdating}
 onClick={() => onStatusUpdate(item.id, isVisit ? 'completed' : 'active')}
 className="w-full md:w-auto px-10 py-5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest emerald-glow flex items-center justify-center space-x-2"
 >
 <CheckCircle2 className="w-5 h-5" />
 <span>Mark as {isVisit ? 'Concluded' : 'Active Deal'}</span>
 </button>
 )}

 {(status === 'completed' || status === 'active' || status === 'cancelled') && (
 <div className="flex items-center space-x-3 text-gray-600">
 <CheckCircle2 className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">Transaction archived</span>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 );
}
