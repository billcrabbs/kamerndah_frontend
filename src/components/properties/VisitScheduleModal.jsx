'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Calendar, 
 Clock, 
 User, 
 MapPin, 
 X, 
 CheckCircle2, 
 ArrowRight,
 Info,
 ChevronRight,
 ChevronLeft
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useScheduleVisitMutation } from '@/store/services/visitApi';
import { useCreateTransactionMutation } from '@/store/services/transactionApi';
import { showModal } from '@/store/slices/uiSlice';
import { MobileMoneyPayment } from '../shared/MobileMoneyPayment';

export function VisitScheduleModal({ property, isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [scheduleVisit] = useScheduleVisitMutation();
  const [createTransaction] = useCreateTransactionMutation();
 
 const [step, setStep] = useState(1);
 const [formData, setFormData] = useState({
 date: '',
 time: '10:00',
 visitType: 'physical', // 'physical' or 'assisted'
 notes: ''
 });
 const [isSuccess, setIsSuccess] = useState(false);

 const handlePaymentSuccess = async (paymentData) => {
 try {
 const scheduledDate = `${formData.date}T${formData.time}:00`;
 
 // 1. Create Visit Record
 await scheduleVisit({
 property_id: property.id,
 user_id: user.uid,
 scheduled_date: scheduledDate,
 visit_type: formData.visitType,
 notes: formData.notes
 }).unwrap();

 // 2. record Transaction
 await createTransaction({
 amount: 2500,
 transaction_type: 'visit_fee',
 property_id: property.id,
 user_id: user.uid,
 landlord_id: property.landlord_id || '',
 service_details: {
 type: 'property_audit',
 visit_type: formData.visitType,
 payment_data: paymentData
 },
 extra_notes: `Audit clearance for ${property.title}`
 }).unwrap();
 
 setIsSuccess(true);
 } catch (err) {
 console.error('Failed to finalize audit flow:', err);
 dispatch(showModal({
   type: 'error',
   title: 'Audit Failed',
   message: err?.data?.error || 'We could not process your audit request. Please check your connection and try again.',
   actionText: 'Retry'
 }));
 }
 };

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} 
 animate={{ opacity: 1 }} 
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-background/80 backdrop-blur-xl"
 />
 
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="relative w-full max-w-xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden premium-shadow"
 >
 {/* Header */}
 <div className="p-8 pb-0 flex justify-between items-start">
 <div>
 <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
 {isSuccess ? 'Audit Scheduled' : 'Schedule Audit'}
 </h2>
 <p className="text-xs font-black uppercase tracking-[0.3em] text-primary-light">Professional Inspection</p>
 </div>
 {!isSuccess && (
 <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-400">
 <X className="w-5 h-5" />
 </button>
 )}
 </div>

 <div className="p-8">
 <AnimatePresence mode="wait">
 {isSuccess ? (
 <motion.div 
 key="success"
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col items-center text-center space-y-6 py-12"
 >
 <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 relative">
 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
 <CheckCircle2 className="w-12 h-12 text-primary-light" />
 </div>
 <div className="space-y-2">
 <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Request Received</h3>
 <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
 The owner of "{property.title}" will be notified. We'll update you once the viewing is confirmed.
 </p>
 </div>
 <button 
 onClick={onClose}
 className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow"
 >
 Return to Inventory
 </button>
 </motion.div>
 ) : (
 <motion.div key={step}>
 {step === 1 && (
 <div className="space-y-8">
 <div className="flex items-center space-x-4 p-5 bg-white/5 rounded-3xl border border-white/5">
 <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200'} className="w-16 h-16 rounded-2xl object-cover" alt="" />
 <div>
 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Target Property</p>
 <h4 className="text-white font-black tracking-tight">{property.title}</h4>
 </div>
 </div>

 <div className="space-y-4">
 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Inspection Logistics</label>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
 <input 
 type="date" 
 value={formData.date}
 onChange={(e) => setFormData({...formData, date: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-all text-sm"
 />
 </div>
 <div className="relative">
 <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
 <select 
 value={formData.time}
 onChange={(e) => setFormData({...formData, time: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none"
 >
 {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
 <option key={t} value={t} className="bg-background text-white">{t} AM/PM</option>
 ))}
 </select>
 </div>
 </div>
 </div>

 <button 
 onClick={() => setStep(2)}
 disabled={!formData.date}
 className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-3 disabled:opacity-50 emerald-glow"
 >
 <span>Audit Strategy</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-8">
 <div className="grid grid-cols-1 gap-4">
 {[
 { id: 'physical', title: 'On-Site Inspection', desc: 'Full physical walkthrough and structural audit.', icon: MapPin },
 { id: 'assisted', title: 'Agent Assisted', desc: 'Virtual walkthrough with a certified estate agent.', icon: User }
 ].map((type) => (
 <button
 key={type.id}
 onClick={() => setFormData({...formData, visitType: type.id})}
 className={`p-6 rounded-[2rem] border text-left transition-all ${
 formData.visitType === type.id 
 ? 'bg-primary/10 border-primary text-white' 
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
 }`}
 >
 <div className="flex justify-between items-start mb-3">
 <div className={`p-3 rounded-xl ${formData.visitType === type.id ? 'bg-primary text-white' : 'bg-white/10'}`}>
 <type.icon className="w-5 h-5" />
 </div>
 {formData.visitType === type.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
 </div>
 <h5 className="font-black uppercase tracking-tighter text-lg">{type.title}</h5>
 <p className="text-[10px] font-bold text-gray-500">{type.desc}</p>
 </button>
 ))}
 </div>

 <div className="space-y-4">
 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Specific Requirements</label>
 <textarea 
 placeholder="e.g. Please bring keys for the rooftop, checking water pressure..."
 value={formData.notes}
 onChange={(e) => setFormData({...formData, notes: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white font-medium text-sm focus:outline-none focus:border-primary/50 min-h-[100px] resize-none"
 />
 </div>

 <div className="flex space-x-4">
 <button onClick={() => setStep(1)} className="p-5 rounded-3xl border border-white/10 text-gray-400 hover:text-white transition-all">
 <ChevronLeft className="w-5 h-5" />
 </button>
 <button 
 onClick={() => setStep(3)}
 className="flex-1 bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all emerald-glow"
 >
 Proceed to Clearance
 </button>
 </div>
 </div>
 )}

 {step === 3 && (
 <MobileMoneyPayment 
 amount={2500}
 description="Property Audit Clearance Fee"
 onSuccess={handlePaymentSuccess}
 onCancel={() => setStep(2)}
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
