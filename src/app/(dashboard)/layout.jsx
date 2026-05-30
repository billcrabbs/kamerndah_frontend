'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
 User,
 Home,
 Heart,
 Calendar,
 CreditCard,
 Settings,
 Menu,
 X,
 ArrowLeft,
 LayoutDashboard,
 LogOut,
 Sparkles,
 Zap,
 Gavel,
 ClipboardList,
 ShieldCheck
} from 'lucide-react';
import { selectCurrentUser, logout } from '@/store/slices/authSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { auth as firebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { AccountUpgradeRequired } from '@/components/shared/AccountUpgradeRequired';

 export default function DashboardLayout({ children }) {
 const dispatch = useDispatch();
 const user = useSelector(selectCurrentUser);
 const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, {
 skip: !user?.uid
 });
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const pathname = usePathname();

 const userRole = profileData?.data?.role || 'renter';
 const isLandlord = userRole === 'landlord';

 const handleLogout = async () => {
 await signOut(firebaseAuth);
 dispatch(logout());
 };

 const navigation = [
 { name: 'Identity Overview', href: '/dashboard', icon: LayoutDashboard },
 { name: 'My Properties', href: '/dashboard/properties', icon: Home, role: 'landlord' },
 { name: 'Manage Audits', href: '/dashboard/landlord/visits', icon: ClipboardList, role: 'landlord' },
 { name: 'Manage Agreements', href: '/dashboard/landlord/bookings', icon: Gavel, role: 'landlord' },
 { name: 'Physical Audits', href: '/dashboard/visits', icon: Calendar },
 { name: 'Asset Transactions', href: '/dashboard/transactions', icon: CreditCard },
 ].filter(item => !item.role || item.role === userRole);

 const isActive = (path) => pathname === path;

 if (isProfileLoading || !user) {
   return (
     <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
     </div>
   );
 }

 const isLandlordRoute = ['/dashboard/properties', '/dashboard/landlord/visits', '/dashboard/landlord/bookings'].some(route => pathname.startsWith(route));

 if (isLandlordRoute && !isLandlord) {
   return (
     <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-8">
       <AccountUpgradeRequired 
         message="You are currently logged in with a Verified Renter identity. Only registered Elite Landlords can access management features."
       />
     </div>
   );
 }

 return (
 <div className="min-h-screen bg-[#08080a] text-white lg:flex">
 {/* Sidebar backdrop */}
 <AnimatePresence>
 {sidebarOpen && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm lg:hidden"
 onClick={() => setSidebarOpen(false)}
 />
 )}
 </AnimatePresence>

 {/* Sidebar */}
 <div className={`
 fixed inset-y-0 left-0 z-[120] w-72 bg-[#0c0c0e] border-r border-white/5 transform transition-transform duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0
 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
 `}>
 {/* Brand */}
 <div className="flex items-center justify-between h-24 px-8 border-b border-white/5">
 <Link href="/" className="flex flex-col">
 <span className="text-xl font-black tracking-tighter text-white uppercase ">
 Kamer<span className="text-primary-light">Ndah</span>
 </span>
 <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-black">Elite Dashboard</span>
 </Link>
 <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
 <X className="w-6 h-6" />
 </button>
 </div>

 {/* User context */}
 <div className="p-8 border-b border-white/5">
 <div className="flex flex-col space-y-4">
 <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 relative group">
 <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
 <User className="w-6 h-6 text-primary-light relative z-10" />
 </div>
 <div>
 <p className="text-lg font-black text-white tracking-tight">{user?.displayName || 'Anonymous'}</p>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.email}</p>
 </div>
 </div>
 </div>

 {/* Nav */}
 <nav className="p-6 space-y-4 flex-1 overflow-y-auto">
 {navigation.map((item) => (
 <Link
 key={item.name}
 href={item.href}
 className={`
 flex items-center space-x-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
 ${isActive(item.href)
 ? 'bg-primary text-white emerald-glow'
 : 'text-gray-500 hover:text-white hover:bg-white/5'
 }
 `}
 onClick={() => setSidebarOpen(false)}
 >
 <item.icon className="w-4 h-4 flex-shrink-0" />
 <span>{item.name}</span>
 </Link>
 ))}
 </nav>

 {/* Bottom actions */}
 <div className="mt-auto p-8 border-t border-white/5 bg-[#0c0c0e]">
 <button 
 onClick={handleLogout}
 className="flex items-center space-x-4 text-gray-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors w-full text-left p-2 rounded-xl hover:bg-red-500/5"
 >
 <LogOut className="w-4 h-4 flex-shrink-0" />
 <span>Terminate Session</span>
 </button>
 </div>
 </div>

 {/* Main Container */}
 <div className="lg:flex-1 lg:flex lg:flex-col min-h-screen">
 {/* Toolbar */}
 <header className="h-24 bg-[#08080a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-[100]">
 <div className="flex items-center space-x-6">
 <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400">
 <Menu className="w-6 h-6" />
 </button>
 <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
 {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
 </h1>
 </div>

 <div className="flex items-center space-x-6">
 <Link href="/" className="hidden sm:flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Exit Desk</span>
 </Link>
 <Link
 href="/submit-property"
 className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest emerald-glow-light"
 >
 List Estate
 </Link>
 </div>
 </header>

 {/* Content */}
 <main className="p-8 lg:p-12 max-w-7xl">
 <AnimatePresence mode="wait">
 <motion.div
 key={pathname}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 >
 {children}
 </motion.div>
 </AnimatePresence>
 </main>
 </div>
 </div>
 );
}