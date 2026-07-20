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
  Menu,
  X,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Gavel,
  ClipboardList,
} from 'lucide-react';
import { selectCurrentUser, logout } from '@/store/slices/authSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { auth as firebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { AccountUpgradeRequired } from '@/components/shared/AccountUpgradeRequired';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'My Properties', href: '/dashboard/properties', icon: Home, role: 'landlord' },
  { name: 'Manage Audits', href: '/dashboard/landlord/visits', icon: ClipboardList, role: 'landlord' },
  { name: 'Manage Agreements', href: '/dashboard/landlord/bookings', icon: Gavel, role: 'landlord' },
  { name: 'Physical Audits', href: '/dashboard/visits', icon: Calendar },
  { name: 'Asset Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
];

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, {
    skip: !user?.uid,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const userRole = profileData?.data?.role || 'renter';
  const isLandlord = userRole === 'landlord';

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    dispatch(logout());
  };

  const navigation = NAV_ITEMS.filter((item) => !item.role || item.role === userRole);

  const currentPage = navigation.find((item) => pathname === item.href);

  if (isProfileLoading || !user) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const landlordRoutes = ['/dashboard/properties', '/dashboard/landlord/visits', '/dashboard/landlord/bookings'];
  const isLandlordRoute = landlordRoutes.some((route) => pathname.startsWith(route));

  if (isLandlordRoute && !isLandlord) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-8">
        <AccountUpgradeRequired message="You are currently logged in as a Verified Renter. Only registered Elite Landlords can access management features." />
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
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[120] w-72 bg-[#0c0c0e] border-r border-white/[0.04] transform transition-transform duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-20 px-8 border-b border-white/[0.04]">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white uppercase">
              Kamer<span className="text-primary">Ndah</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/20 font-bold">
              Elite Dashboard
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/30 hover:text-white/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User context */}
        <div className="px-8 py-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary/15 rounded-2xl flex items-center justify-center border border-primary/10 flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.displayName || 'Anonymous'}</p>
              <p className="text-[10px] text-white/30 font-medium truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-all ${
                  active
                    ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(5,150,105,0.25)]'
                    : 'text-white/35 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto px-8 py-6 border-t border-white/[0.04]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/25 hover:text-red-400 text-xs font-bold tracking-wider transition-colors w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Toolbar */}
        <header className="h-16 bg-[#08080a]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6 md:px-8 sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/40 hover:text-white/70 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-white tracking-tight">
              {currentPage?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors text-[10px] font-bold tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to site</span>
            </Link>
            <Link
              href="/submit-property"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-wider transition-all"
            >
              + List Property
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
