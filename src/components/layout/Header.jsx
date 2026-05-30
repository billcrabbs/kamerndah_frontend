'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
 Home, 
 Search, 
 User, 
 Menu, 
 X, 
 Building2, 
 Key, 
 PlusCircle,
 MapPin,
 Sparkles,
 ChevronDown,
 ArrowRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
 selectCurrentUser, 
 selectIsAuthenticated, 
 logout 
} from '@/store/slices/authSlice';

export function Header() {
 const dispatch = useDispatch();
 const user = useSelector(selectCurrentUser);
 const isAuthenticated = useSelector(selectIsAuthenticated);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const pathname = usePathname();

 const handleLogout = async () => {
 try {
 await signOut(auth);
 dispatch(logout());
 } catch (err) {
 console.error('Logout failed:', err);
 }
 };

 useEffect(() => {
 const handleScroll = () => {
 setScrolled(window.scrollY > 20);
 };
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const navigation = [
 { name: 'Home', href: '/' },
 { name: 'Rent', href: '/rent' },
 { name: 'Buy', href: '/buy' },
 { name: 'Real Estate', href: '/real-estate' },
 { name: 'Guest Houses', href: '/guest-houses' },
 ];

 const isActive = (path) => pathname === path;

 return (
 <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 ${
 scrolled 
 ? 'bg-background/70 backdrop-blur-3xl border-b border-primary/10 py-3 shadow-2xl shadow-primary/[0.02]' 
 : 'bg-transparent py-6 border-b border-transparent'
 }`}>
 <div className="main-container">
 <div className="flex items-center justify-between space-x-4">
 
 {/* ZONE 1: BRAND (Left) */}
 <div className="flex justify-start">
 <Link href="/" className="flex items-center space-x-4 group relative">
 <div className="relative flex-shrink-0">
 <div className="absolute inset-0 bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="relative bg-white/5 border border-white/10 p-2.5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
 <Home className="w-6 h-6 text-primary-light" />
 </div>
 </div>
 <div className="flex flex-col">
 <span className="text-xl font-black tracking-tighter text-white uppercase text-shadow-glow leading-none">
 Kamer<span className="text-primary-light">Ndah</span>
 </span>
 <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mt-1">
 Elite Estates
 </span>
 </div>
 </Link>
 </div>

 {/* ZONE 2: NAVIGATION (Centered) */}
 <nav className="hidden lg:flex justify-center">
 <div className="flex items-center space-x-2 flex-nowrap overflow-x-auto bg-white/5 border border-white/5 p-1 rounded-full px-2">
 {navigation.map((item) => {
 const active = isActive(item.href);
 return (
 <Link
 key={item.name}
 href={item.href}
 className={`relative px-5 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 ${
 active 
 ? 'text-white' 
 : 'text-gray-400 hover:text-white hover:bg-white/5'
 }`}
 >
 {active && (
 <motion.div 
 layoutId="nav-pill"
 className="absolute inset-0 bg-primary/20 rounded-full border border-primary/20"
 transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
 />
 )}
 <span className="relative z-10">{item.name}</span>
 </Link>
 );
 })}
 </div>
 </nav>

 {/* ZONE 3: ACTIONS (Right) */}
 <div className="flex justify-end items-center space-x-3">
 <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10">
 <Search className="w-5 h-5" />
 </button>
 
 <div className="hidden sm:block h-8 w-px bg-white/10 mx-2" />
 
 {isAuthenticated ? (
 <div className="flex items-center space-x-4">
 <Link
 href="/dashboard"
 className="hidden lg:flex items-center space-x-2 p-2 px-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
 >
 <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary-light group-hover:bg-primary group-hover:text-white transition-all">
 <User className="w-3.5 h-3.5" />
 </div>
 <span className="text-[11px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
 {user?.displayName?.split(' ')[0] || 'Member'}
 </span>
 </Link>
 <button 
 onClick={handleLogout}
 className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-red-500 transition-colors"
 >
 Logout
 </button>
 </div>
 ) : (
 <Link
 href="/login"
 className="flex items-center space-x-2 p-2.5 px-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group"
 >
 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Identity Portal</span>
 <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
 </Link>
 )}

 <Link
 href="/submit-property"
 className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all hover:scale-105 emerald-glow hidden md:flex items-center space-x-2 whitespace-nowrap"
 >
 <PlusCircle className="w-4 h-4" />
 <span>List Property</span>
 </Link>

 {/* Mobile Toggle */}
 <button
 className="lg:hidden p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10"
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 >
 {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile Menu */}
 {mobileMenuOpen && (
 <div className="lg:hidden fixed inset-x-4 top-24 glass-effect rounded-[2.5rem] p-8 animate-in slide-in-from-top-10 duration-500 premium-shadow border border-white/10">
 <div className="flex flex-col space-y-3">
 {navigation.map((item) => (
 <Link
 key={item.name}
 href={item.href}
 className={`flex items-center justify-between p-5 rounded-2xl text-lg font-black tracking-tight transition-all ${
 isActive(item.href) ? 'bg-primary/20 text-white border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
 }`}
 onClick={() => setMobileMenuOpen(false)}
 >
 <span>{item.name}</span>
 <ChevronDown className="w-5 h-5 opacity-30 -rotate-90" />
 </Link>
 ))}
 <div className="pt-8 space-y-4">
 <Link
 href="/submit-property"
 className="flex items-center justify-center space-x-3 bg-primary text-white p-5 rounded-2xl w-full text-center font-black uppercase tracking-widest text-sm"
 onClick={() => setMobileMenuOpen(false)}
 >
 <PlusCircle className="w-5 h-5" />
 <span>Submit Your Estate</span>
 </Link>
 </div>
 </div>
 </div>
 )}
 </header>
 );
}