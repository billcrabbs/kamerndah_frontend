'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import {
 createUserWithEmailAndPassword, 
 signInWithPopup, 
 updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useCreateUserMutation } from '@/store/services/userApi';
import { 
 User, 
 Building2, 
 Mail, 
 Lock, 
 UserCircle,
 ArrowRight, 
 Chrome, 
 Sparkles,
 AlertCircle,
 CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [syncProfile] = useCreateUserMutation();
 
 const [step, setStep] = useState(1);
 const [formData, setFormData] = useState({
 fullName: '',
 email: '',
 password: '',
 userType: 'visitor' // Default
 });
 
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   if (isAuthenticated) {
     router.push('/');
   }
 }, [isAuthenticated, router]);

 const handleNext = (e) => {
 e.preventDefault();
 setStep(2);
 };

 const handleRegister = async () => {
 setIsLoading(true);
 setError('');
 
 try {
 // 1. Create Firebase Auth user
 const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
 
 // 2. Update Firebase Display Name
 await updateProfile(user, { displayName: formData.fullName });
 
 // 3. Sync to Backend Firestore
 await syncProfile({
 uid: user.uid,
 email: user.email,
 display_name: formData.fullName,
 photo_url: '',
 user_type: formData.userType
 }).unwrap();
 
 dispatch(showModal({
    type: 'success',
    title: 'Welcome to KamerNdah',
    message: `Your ${formData.userType} account has been created successfully. Welcome to the elite collective.`,
    actionText: 'Enter Marketplace',
    redirect: '/'
  }));
 } catch (err) {
 setError(err.message.replace('Firebase:', ''));
 dispatch(showModal({
    type: 'error',
    title: 'Registration Error',
    message: err.message.replace('Firebase:', ''),
    actionText: 'Retry'
  }));
 setStep(1); // Go back to fix info
 } finally {
 setIsLoading(false);
 }
 };

 const handleGoogleRegister = async () => {
 setIsLoading(true);
 setError('');
 try {
 const { user } = await signInWithPopup(auth, googleProvider);
 
 // For social register, default is 'visitor'
 await syncProfile({
 uid: user.uid,
 email: user.email,
 display_name: user.displayName,
 photo_url: user.photoURL,
 user_type: 'visitor'
 }).unwrap();
 
 router.push('/');
 } catch (err) {
 setError(err.message.replace('Firebase:', ''));
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-screen pt-20 flex bg-[#08080a]">
 <div className="absolute inset-0 pattern-afro opacity-[0.03] pointer-events-none" />

 <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-center">
 <div className="w-full max-w-md space-y-12 py-20">
 
 {/* Header */}
 <div className="text-center space-y-4">
 <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Join the Collective</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Secure Your <br />
 <span className="text-gradient-gold">Identity.</span>
 </h1>
 </div>

 {/* Error Message */}
 {error && (
 <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold">
 <AlertCircle className="w-5 h-5 flex-shrink-0" />
 <span>{error}</span>
 </div>
 )}

 <AnimatePresence mode="wait">
 {step === 1 ? (
 <motion.form 
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 onSubmit={handleNext} 
 className="space-y-6"
 >
 <div className="space-y-4">
 <div className="relative group">
 <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 placeholder="Full Legal Name"
 value={formData.fullName}
 onChange={(e) => setFormData({...formData, fullName: e.target.value})}
 required
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
 />
 </div>
 <div className="relative group">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
 <input 
 type="email" 
 placeholder="Email Address"
 value={formData.email}
 onChange={(e) => setFormData({...formData, email: e.target.value})}
 required
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
 />
 </div>
 <div className="relative group">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
 <input 
 type="password" 
 placeholder="Security Password"
 value={formData.password}
 onChange={(e) => setFormData({...formData, password: e.target.value})}
 required
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
 />
 </div>
 </div>

 <button 
 type="submit"
 className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all emerald-glow flex items-center justify-center space-x-3"
 >
 <span>Define Account Type</span>
 <ArrowRight className="w-4 h-4" />
 </button>

 <div className="relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-white/5"></div>
 </div>
 <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
 <span className="px-4 bg-[#08080a] text-gray-600">Or Register With</span>
 </div>
 </div>

 <button 
 onClick={handleGoogleRegister}
 type="button"
 className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-gray-200 flex items-center justify-center space-x-3"
 >
 <Chrome className="w-5 h-5 text-red-500" />
 <span>Google Authorization</span>
 </button>
 </motion.form>
 ) : (
 <motion.div 
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-10"
 >
 <div className="grid grid-cols-1 gap-4">
 {[
 { id: 'visitor', title: 'I Am A Renter/Buyer', icon: User, desc: 'Discover & invest in verified premium estates.' },
 { id: 'landlord', title: 'I Am A Property Owner', icon: Building2, desc: 'List and manage luxury inventory across Cameroon.' }
 ].map((role) => (
 <button
 key={role.id}
 onClick={() => setFormData({...formData, userType: role.id})}
 className={`relative p-8 rounded-3xl border text-left transition-all ${
 formData.userType === role.id 
 ? 'bg-primary/10 border-primary text-white' 
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
 }`}
 >
 <div className="flex justify-between items-start mb-4">
 <div className={`p-4 rounded-2xl ${formData.userType === role.id ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}>
 <role.icon className="w-6 h-6" />
 </div>
 {formData.userType === role.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
 </div>
 <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{role.title}</h3>
 <p className="text-xs font-medium text-gray-500 leading-relaxed">{role.desc}</p>
 </button>
 ))}
 </div>

 <div className="flex flex-col space-y-4">
 <button 
 onClick={handleRegister}
 disabled={isLoading}
 className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all emerald-glow disabled:opacity-50"
 >
 {isLoading ? 'Processing Membership...' : 'Finalize Registration'}
 </button>
 <button 
 onClick={() => setStep(1)}
 className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors"
 >
 Go Back
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <p className="text-center text-gray-500 font-bold text-sm">
 Already Registered? <Link href="/login" className="text-white hover:text-primary-light transition-colors">SignIn Securely</Link>
 </p>
 </div>
 </div>
 </div>
 );
}
