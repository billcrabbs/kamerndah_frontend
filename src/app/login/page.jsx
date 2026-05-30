'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import { 
 signInWithEmailAndPassword, 
 signInWithPopup, 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { 
 Mail, 
 Lock, 
 ArrowRight, 
 Chrome, 
 Sparkles,
 AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
 
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   if (isAuthenticated) {
     router.push('/');
   }
 }, [isAuthenticated, router]);

 const handleEmailLogin = async (e) => {
 e.preventDefault();
 setIsLoading(true);
 setError('');
 
 try {
   await signInWithEmailAndPassword(auth, email, password);
   dispatch(showModal({
     type: 'success',
     title: 'Connection Established',
     message: 'Welcome back to KamerNdah. Your session has been secured.',
     actionText: 'Enter Dashboard',
     redirect: '/dashboard'
   }));
 } catch (err) {
   const errorMsg = err.message.replace('Firebase:', '');
   setError(errorMsg);
   dispatch(showModal({
     type: 'error',
     title: 'Access Denied',
     message: errorMsg,
     actionText: 'Retry'
   }));
 } finally {
 setIsLoading(false);
 }
 };

 const handleGoogleLogin = async () => {
 setIsLoading(true);
 setError('');
 try {
 await signInWithPopup(auth, googleProvider);
 router.push('/');
 } catch (err) {
 setError(err.message.replace('Firebase:', ''));
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-screen pt-20 flex bg-[#08080a]">
 {/* Background pattern */}
 <div className="absolute inset-0 pattern-afro opacity-[0.03] pointer-events-none" />

 <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-center">
 <motion.div 
 initial={{ opacity: 0, y: 40 }}
 animate={{ opacity: 1, y: 0 }}
 className="w-full max-w-md space-y-12"
 >
 {/* Branding Header */}
 <div className="text-center space-y-4">
 <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Access Portal</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Welcome <br />
 <span className="text-gradient-gold">Back.</span>
 </h1>
 </div>

 {/* Error Message */}
 {error && (
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold"
 >
 <AlertCircle className="w-5 h-5 flex-shrink-0" />
 <span>{error}</span>
 </motion.div>
 )}

 {/* Form */}
 <form onSubmit={handleEmailLogin} className="space-y-6">
 <div className="space-y-4">
 <div className="relative group">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
 <input 
 type="email" 
 placeholder="Email Address"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
 />
 </div>

 <div className="relative group">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
 <input 
 type="password" 
 placeholder="Security Password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
 />
 </div>
 </div>

 <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest px-2">
 <label className="flex items-center space-x-2 text-gray-500 cursor-pointer">
 <input type="checkbox" className="accent-primary" />
 <span>Remember Me</span>
 </label>
 <Link href="/forgot-password" title="Recover Password" className="text-primary-light hover:text-white transition-colors">Recover Access</Link>
 </div>

 <button 
 type="submit"
 disabled={isLoading}
 className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all emerald-glow flex items-center justify-center space-x-3 disabled:opacity-50"
 >
 {isLoading ? (
 <span className="animate-pulse">Verifying Identity...</span>
 ) : (
 <>
 <span>Establish Connection</span>
 <ArrowRight className="w-4 h-4" />
 </>
 )}
 </button>
 </form>

 {/* Divider */}
 <div className="relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-white/5"></div>
 </div>
 <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
 <span className="px-4 bg-[#08080a] text-gray-600">Or Continue With</span>
 </div>
 </div>

 {/* Social */}
 <button 
 onClick={handleGoogleLogin}
 type="button"
 className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-gray-200 flex items-center justify-center space-x-3"
 >
 <Chrome className="w-5 h-5 text-red-500" />
 <span>Google Passport</span>
 </button>

 {/* Footer */}
 <p className="text-center text-gray-500 font-bold text-sm">
 New to KamerNdah? <Link href="/register" className="text-white hover:text-primary-light transition-colors">Request Membership</Link>
 </p>
 </motion.div>
 </div>
 </div>
 );
}
