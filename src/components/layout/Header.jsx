'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, User, Menu, X, PlusCircle,
  ChevronRight, Phone, MapPin, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from '@/store/slices/authSlice';

const navigation = [
  { name: 'Home',         href: '/' },
  { name: 'Rent',         href: '/rent' },
  { name: 'Buy',          href: '/buy' },
  { name: 'Real Estate',  href: '/real-estate' },
  { name: 'Guest Houses', href: '/guest-houses' },
];

export function Header() {
  const dispatch          = useDispatch();
  const user              = useSelector(selectCurrentUser);
  const isAuthenticated   = useSelector(selectIsAuthenticated);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname          = usePathname();
  const router            = useRouter();

  const handleSearchClick = () => {
    if (pathname === '/') {
      document.getElementById('properties-grid')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/rent');
    }
  };

  /* ── Close drawer on route change ─────────────────────────── */
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  /* ── Scroll shadow ────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Prevent body scroll when drawer open ─────────────────── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      setDrawerOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP UTILITY BAR                                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="bg-navy text-white hidden sm:block" role="banner">
        <div className="container-wide flex items-center justify-between py-2 gap-4">
          <div className="flex items-center gap-5 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse flex-shrink-0" />
              100% Verified Listings
            </span>
            <span className="text-white/30 hidden md:block">·</span>
            <span className="hidden md:flex items-center gap-1.5 text-white/60">
              <MapPin className="w-3 h-3 text-primary-light flex-shrink-0" />
              Douala · Yaoundé · Bafoussam · Buea · Kribi
            </span>
          </div>
          <a
            href="tel:+237672676029"
            className="flex items-center gap-1.5 text-[11px] font-medium text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            <Phone className="w-3 h-3 text-primary-light" />
            +237 672 676 029
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN STICKY HEADER                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-[100] bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-none'
        } border-b border-border`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="KamerNdah home">
              <div className="w-9 h-9 bg-navy group-hover:bg-primary rounded-xl flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                <span className="text-white font-black text-base leading-none">K</span>
              </div>
              <div className="leading-tight">
                <p className="text-[17px] font-black tracking-tight text-navy leading-none">
                  Kamer<span className="text-primary">Ndah</span>
                </p>
                <p className="text-[8.5px] uppercase tracking-[0.28em] text-slate-400 font-semibold mt-0.5">
                  Verified Properties
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-[13.5px] font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/8'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  {isActive(item.href) && (
                    <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* ── Desktop Actions ───────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <button
                onClick={handleSearchClick}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-50 transition-all border border-transparent hover:border-border"
                aria-label="Browse properties"
                title={pathname === '/' ? 'Jump to listings' : 'Browse all rentals'}
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <div className="hidden sm:block w-px h-5 bg-border mx-0.5" />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-border"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {user?.displayName?.split(' ')[0] || 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-navy border border-border hover:border-slate-400 rounded-lg transition-all"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/submit-property"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                List Property
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-navy hover:bg-slate-50 transition-all border border-border"
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={drawerOpen}
              >
                {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE DRAWER BACKDROP                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        className={`lg:hidden fixed inset-0 z-[90] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE DRAWER PANEL                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-[95] w-[300px] max-w-[85vw] bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <span className="text-[16px] font-black tracking-tight text-navy">
              Kamer<span className="text-primary">Ndah</span>
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-navy hover:bg-slate-50 transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          <div className="py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center justify-between px-5 py-4 text-[15px] font-semibold border-b border-slate-50 transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-700 hover:text-navy hover:bg-slate-50'
                }`}
              >
                {item.name}
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive(item.href) ? 'text-primary' : 'text-slate-300'}`} />
              </Link>
            ))}
          </div>
        </nav>

        {/* Drawer footer actions */}
        <div className="px-5 py-5 space-y-3 border-t border-border">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-semibold text-[14px] rounded-xl transition-all border border-border"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 font-semibold text-[14px] rounded-xl transition-all border border-red-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center w-full py-3 border border-border text-navy font-semibold text-[14px] rounded-xl hover:border-navy hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/submit-property"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-[14px] rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            List Your Property
          </Link>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-5 pt-1 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              100% Verified
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary" />
              All Cameroon
            </span>
          </div>
        </div>
      </div>
    </>
  );
}