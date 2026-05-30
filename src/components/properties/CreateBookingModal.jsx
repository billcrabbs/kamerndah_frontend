'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 X, 
 CheckCircle2, 
 ChevronRight, 
 ChevronLeft,
 Calendar,
 Zap,
 ShieldCheck,
 Building2,
 Key,
 CreditCard,
 FileText
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useCreateBookingMutation } from '@/store/services/bookingApi';
import { useCreateTransactionMutation } from '@/store/services/transactionApi';
import { showModal } from '@/store/slices/uiSlice';
import { MobileMoneyPayment } from '../shared/MobileMoneyPayment';

export function CreateBookingModal({ property, isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [createBooking] = useCreateBookingMutation();
  const [createTransaction] = useCreateTransactionMutation();
 
 const [step, setStep] = useState(1);
 const [formData, setFormData] = useState({
 booking_type: property.category === 'for-rent' ? 'lease' : 'purchase',
 move_in_date: '',
 duration_months: 12,
 agreed_price: property.price,
 notes: ''
 });
 const [isSuccess, setIsSuccess] = useState(false);

 const handlePaymentSuccess = async (paymentData) => {
 try {
 // 1. Create Booking Record
 await createBooking({
 property_id: property.id,
 user_id: user.uid,
 ...formData
 }).unwrap();

 // 2. record Transaction
 await createTransaction({
 amount: 25000,
 transaction_type: 'platform_fee',
 property_id: property.id,
 user_id: user.uid,
 landlord_id: property.landlord_id || '',
 service_details: {
 type: 'booking_deposit',
 booking_type: formData.booking_type,
 payment_data: paymentData
 },
 extra_notes: `Commitment deposit for ${property.title}`
 }).unwrap();
 
 setIsSuccess(true);
 } catch (err) {
 console.error('Booking failed:', err);
 dispatch(showModal({
 type: 'error',
 title: 'Booking Failed',
 message: err?.data?.error || 'Your legal commitment could not be processed at this time.',
 actionText: 'Retry'
 }));
 }
 };

 if (!isOpen) return null;

 const steps = [
 { title: 'Agreement Strategy', icon: ShieldCheck },
 { title: 'Logistics & Terms', icon: Calendar },
 { title: 'Legal Review', icon: Zap },
 { title: 'Elite Commitment', icon: CreditCard }
 ];

 return (
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} 
 animate={{ opacity: 1 }} 
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
 />
 
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 30 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 30 }}
 className="relative w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-[3rem] overflow-hidden premium-shadow"
 >
 {/* Progress Bar */}
 {!isSuccess && (
 <div className="absolute top-0 inset-x-0 h-1 bg-white/5">
 <motion.div 
 className="h-full bg-primary emerald-glow"
 initial={{ width: '0%' }}
 animate={{ width: `${(step / steps.length) * 100}%` }}
 />
 </div>
 )}

 {/* Content Container */}
 <div className="p-10 md:p-14">
 <AnimatePresence mode="wait">
 {isSuccess ? (
 <motion.div 
 key="success"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center text-center space-y-8 py-10"
 >
 <div className="w-28 h-28 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border border-primary/20 relative">
 <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
 <CheckCircle2 className="w-14 h-14 text-primary-light" />
 </div>
 <div className="space-y-4">
 <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Agreement Transmitted</h2>
 <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
 Your legal commitment to "{property.title}" has been recorded. Our concierge and the owner will finalize the verified documents shortly.
 </p>
 </div>
 <button 
 onClick={onClose}
 className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow"
 >
 Dashboard Overview
 </button>
 </motion.div>
 ) : (
 <motion.div key={step}>
 {/* Modal Header */}
 <div className="flex justify-between items-start mb-10">
 <div>
 <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-3">
 {steps[step-1].title}
 </h2>
 <div className="flex items-center space-x-2 text-primary-light">
 {(() => {
 const StepIcon = steps[step-1].icon;
 return <StepIcon className="w-3.5 h-3.5" />;
 })()}
 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Phase {step} of 4</span>
 </div>
 </div>
 <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-500">
 <X className="w-5 h-5" />
 </button>
 </div>

 {step === 1 && (
 <div className="space-y-8">
 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center space-x-6">
 <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200'} className="w-20 h-20 rounded-2xl object-cover" alt="" />
 <div>
 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Elite Estate</p>
 <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none">{property.title}</h4>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 { id: 'lease', label: 'Lease Agreement', icon: Key, desc: 'Secure the property for rental.' },
 { id: 'purchase', label: 'Asset Acquisition', icon: Building2, desc: 'Full ownership transfer.' }
 ].map((type) => (
 <button
 key={type.id}
 onClick={() => setFormData({...formData, booking_type: type.id})}
 className={`p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${
 formData.booking_type === type.id 
 ? 'bg-primary/10 border-primary text-white' 
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
 }`}
 >
 <div className={`p-4 rounded-2xl mb-4 w-fit ${formData.booking_type === type.id ? 'bg-primary text-white' : 'bg-white/10'}`}>
 <type.icon className="w-6 h-6" />
 </div>
 <h5 className="font-black uppercase tracking-tighter text-lg mb-1">{type.label}</h5>
 <p className="text-[10px] font-bold opacity-50">{type.desc}</p>
 </button>
 ))}
 </div>

 <button 
 onClick={() => setStep(2)}
 className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-3 emerald-glow"
 >
 <span>Configure Terms</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Deployment Date</label>
 <div className="relative">
 <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
 <input 
 type="date" 
 value={formData.move_in_date}
 onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold text-sm focus:outline-none focus:border-primary/50"
 />
 </div>
 </div>

 {formData.booking_type === 'lease' && (
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Lease Span (Months)</label>
 <div className="relative">
 <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
 <input 
 type="number" 
 value={formData.duration_months}
 onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold text-sm focus:outline-none focus:border-primary/50"
 />
 </div>
 </div>
 )}
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Investment Summary</label>
 <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="p-4 bg-primary/20 rounded-2xl text-primary-light">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Offered Capital</p>
 <p className="text-xl font-black text-white tracking-tighter uppercase">{(formData.agreed_price).toLocaleString()} FCFA</p>
 </div>
 </div>
 <div className="text-right">
 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Market Verified</span>
 </div>
 </div>
 </div>

 <div className="flex space-x-4">
 <button onClick={() => setStep(1)} className="p-5 rounded-3xl border border-white/10 text-gray-400 hover:text-white transition-all">
 <ChevronLeft className="w-5 h-5" />
 </button>
 <button 
 onClick={() => setStep(3)}
 className="flex-1 bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all emerald-glow"
 >
 Review & Commit
 </button>
 </div>
 </div>
 )}

 {step === 3 && (
 <div className="space-y-8">
 <div className="p-10 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[3rem] space-y-6">
 <div className="flex items-center space-x-3 text-secondary">
 <Zap className="w-5 h-5" />
 <h4 className="text-xl font-black uppercase tracking-tighter">Legal Commitment</h4>
 </div>
 <p className="text-sm text-gray-400 font-medium leading-relaxed">
 By finalizing this booking, you are transmitting a formal intent to {formData.booking_type === 'lease' ? 'lease' : 'acquire'} the estate at the specified terms. You will be redirected to the secure transaction portal once the owner acknowledges.
 </p>
 <div className="pt-6 border-t border-white/10 flex items-center justify-between">
 <div className="flex items-center space-x-2">
 <ShieldCheck className="w-4 h-4 text-emerald-500" />
 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">KamerNdah Protection</span>
 </div>
 <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">ID: {property.id?.slice(0, 8)}</span>
 </div>
 </div>

 <div className="flex space-x-4">
 <button onClick={() => setStep(2)} className="p-5 rounded-3xl border border-white/10 text-gray-400 hover:text-white transition-all">
 <ChevronLeft className="w-5 h-5" />
 </button>
 <button 
 onClick={() => setStep(4)}
 className="flex-1 bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all"
 >
 Proceed to Deposit
 </button>
 </div>
 </div>
 )}

 {step === 4 && (
 <MobileMoneyPayment 
 amount={25000}
 description="Professional Commitment Deposit"
 onSuccess={handlePaymentSuccess}
 onCancel={() => setStep(3)}
 />
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </motion.div>
 </div>
 );
}
