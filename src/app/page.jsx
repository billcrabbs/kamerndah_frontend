// app/page.jsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ShieldCheck, ArrowRight,
  Zap, Award, X, CheckCircle2, Building2,
  Users, TrendingUp,
} from 'lucide-react';
import { useGetPropertiesQuery } from '@/store/services/propertyApi';
import { PropertyCard } from '@/components/properties/PropertyCard';

/* ─── Stat items ────────────────────────────────────────────────── */
const quickCities = ['Douala', 'Yaoundé', 'Bonapriso', 'Bastos', 'Buea'];

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property is physically inspected by our team before going live.',
    offset: false,
  },
  {
    icon: Zap,
    title: 'Fast Communication',
    desc: 'Direct contact between landlords and tenants — no unnecessary delays.',
    offset: true,
  },
  {
    icon: MapPin,
    title: 'Local Knowledge',
    desc: 'Deep neighborhood expertise across Douala, Yaoundé, Bafoussam and more.',
    offset: false,
  },
  {
    icon: Award,
    title: 'Secure Payments',
    desc: 'Mobile money integrations built for Cameroonian renters and buyers.',
    offset: true,
  },
];

const landlordStats = [
  { value: '500+', label: 'Active renters' },
  { value: '48h',  label: 'Avg. first inquiry' },
  { value: '0%',   label: 'Contact commission' },
];

/* ─────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]     = useState('');

  const { data: propertiesResult, isLoading, error, refetch } = useGetPropertiesQuery();

  const properties = useMemo(() => {
    if (propertiesResult?.data?.data) return propertiesResult.data.data;
    if (propertiesResult?.data)       return propertiesResult.data;
    if (Array.isArray(propertiesResult))  return propertiesResult;
    return [];
  }, [propertiesResult]);

  const filteredProperties = useMemo(() => {
    let list = properties;
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => {
        const loc = typeof p.location === 'object'
          ? `${p.location?.quarter || ''} ${p.location?.city || ''}`.toLowerCase()
          : (p.location || '').toLowerCase();
        return loc.includes(q)
          || (p.title || '').toLowerCase().includes(q)
          || (p.description || '').toLowerCase().includes(q);
      });
    }
    return list;
  }, [properties, activeCategory, searchQuery]);

  // Count listings added in the last 7 days
  const recentCount = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const count = properties.filter(p => {
      const created = p.created_at ? new Date(p.created_at).getTime() : 0;
      return created > cutoff;
    }).length;
    return count > 0 ? count : null; // null = hide the badge
  }, [properties]);

  const statsData = [
    { value: properties.length > 0 ? `${properties.length}+` : '0', label: 'Verified listings' },
    { value: '6',    label: 'Cities covered' },
    { value: '100%', label: 'Inspected properties' },
    { value: '500+', label: 'Happy tenants' },
  ];

  const scrollToGrid = () =>
    document.getElementById('properties-grid')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-0 lg:pt-14 bg-white">
        {/* Subtle afro-dot background pattern */}
        <div className="absolute inset-0 pattern-afro pointer-events-none" />
        {/* Bottom fade into white */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_46%] gap-8 lg:gap-16 items-center">

            {/* LEFT — copy */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="py-4 lg:py-12 space-y-7"
            >
              {/* Live pill badge */}
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 px-4 py-2 rounded-full text-primary text-[11.5px] font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {properties.length > 0
                  ? `${properties.length} verified listings live`
                  : 'Verified listings live'}
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.06] tracking-tight text-navy">
                Find a home<br className="hidden sm:block" />
                you&apos;ll actually<br />
                <span className="text-primary">love.</span>
              </h1>

              <p className="text-[15px] sm:text-base text-slate-500 max-w-md leading-relaxed">
                Verified apartments, houses, and commercial spaces across Cameroon.
                Every listing is physically inspected before it goes live.
              </p>

              {/* Search bar */}
              <div className="w-full max-w-[520px] space-y-3">
                <div className="flex items-center bg-white border-2 border-border hover:border-primary/40 focus-within:border-primary rounded-2xl transition-colors shadow-sm overflow-hidden">
                  <div className="flex-1 flex items-center px-4 gap-2.5">
                    <Search className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    <input
                      type="search"
                      id="hero-search"
                      placeholder="City, neighborhood, property type…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') scrollToGrid(); }}
                      className="bg-transparent text-navy font-medium text-sm focus:outline-none w-full placeholder:text-slate-400 py-3.5 min-w-0"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-slate-300 hover:text-slate-500 transition p-0.5 flex-shrink-0"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={scrollToGrid}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-3 m-1.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0 whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>

                {/* Quick searches */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-xs font-medium">Popular:</span>
                  {quickCities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSearchQuery(city); scrollToGrid(); }}
                      className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors bg-slate-50 hover:bg-primary/8 px-3 py-1.5 rounded-lg border border-border hover:border-primary/20"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {[
                  { icon: ShieldCheck, text: '100% verified listings' },
                  { icon: MapPin,      text: 'Douala · Yaoundé · Kribi' },
                  { icon: Users,       text: '500+ happy tenants' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-sm text-slate-500 ${i > 0 ? 'hidden sm:flex' : ''}`}>
                    {i > 0 && <span className="w-px h-4 bg-border mr-1.5" />}
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[570px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src="/hero-cameroon.svg"
                  fill
                  className="object-cover"
                  alt="Modern home in Cameroon"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" />
              </div>

              {/* Floating verified badge */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.45 }}
                className="absolute bottom-10 -left-8 bg-white border border-border rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-navy font-bold text-sm leading-tight">Verified Property</p>
                  <p className="text-slate-400 text-xs mt-0.5">Inspected · Ready to view</p>
                </div>
              </motion.div>

              {/* Floating new listings card */}
              {recentCount !== null && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.95, duration: 0.45 }}
                  className="absolute top-8 right-6 bg-white border border-border rounded-2xl shadow-xl p-4"
                >
                  <p className="text-slate-400 text-[11px] font-semibold mb-1 uppercase tracking-wide">New this week</p>
                  <p className="text-navy font-black text-2xl">+{recentCount} listing{recentCount !== 1 ? 's' : ''}</p>
                </motion.div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* STATS BAR                                                       */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="bg-navy" aria-label="Key statistics">
        <div className="container-wide py-8 lg:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`flex flex-col items-center justify-center py-5 px-4 text-center ${
                  i === 0 ? '' : ''
                }`}
              >
                <p className="text-3xl lg:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-white/45 text-[10.5px] font-bold uppercase tracking-[0.18em] mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* PROPERTIES GRID                                                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="properties-grid" className="bg-surface py-16 lg:py-24" aria-label="Property listings">
        <div className="container-wide">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-10">
            <div>
              <p className="text-primary text-[11px] font-bold uppercase tracking-widest mb-2">
                {searchQuery ? `Search results` : 'Browse listings'}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy tracking-tight">
                {searchQuery
                  ? `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`
                  : 'Latest Properties'
                }
              </h2>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all',      label: 'All' },
                { id: 'for-rent', label: 'For Rent' },
                { id: 'for-sale', label: 'For Sale' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    activeCategory === cat.id
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-white text-slate-500 hover:text-navy border border-border hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {(activeCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="text-sm font-medium text-slate-400 hover:text-navy transition-colors px-3 py-2.5 min-h-[44px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Grid / States */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Skeleton grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[420px] bg-white rounded-2xl border border-border animate-pulse" />
                ))}
              </div>
            ) : error ? (
              /* Error state */
              <div className="text-center py-20 bg-white rounded-2xl border border-border max-w-md">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Connection Issue</h3>
                <p className="text-slate-400 text-sm mb-6 px-4">
                  Unable to load properties. Please check your connection and try again.
                </p>
                <button onClick={() => refetch()} className="btn-primary mx-auto">
                  Try Again
                </button>
              </div>
            ) : filteredProperties.length > 0 ? (
              /* Property cards */
              <motion.div
                key={`grid-${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
              >
                {filteredProperties.map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PropertyCard property={property} priority={idx < 3} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 bg-white border border-border rounded-2xl px-8 flex flex-col items-start space-y-4 max-w-lg"
              >
                <Search className="w-8 h-8 text-slate-300" />
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1">No properties found</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We couldn&apos;t find listings matching your search. Try removing some filters or searching a broader area.
                  </p>
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="btn-outline">
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* View all link */}
          {filteredProperties.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border">
              <Link
                href="/rent"
                className="inline-flex items-center gap-2 text-navy font-bold hover:text-primary transition-colors group text-sm"
              >
                View all available listings
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* WHY KAMERNDAH                                                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="bg-navy py-20 lg:py-28" aria-labelledby="why-heading">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

            {/* Left — heading */}
            <div className="lg:w-[38%] space-y-5 lg:pt-2">
              <p className="text-primary-light text-[11px] font-bold uppercase tracking-widest">Why KamerNdah</p>
              <h2 id="why-heading" className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                The smarter way to find property in Cameroon.
              </h2>
              <p className="text-white/55 text-sm lg:text-base leading-relaxed">
                We cut out the middleman, eliminate fake listings, and give you direct access
                to verified properties and landlords.
              </p>
              <Link
                href="/rent"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors mt-2"
              >
                Start browsing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — 2×2 feature grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 16, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.09 }}
                  className={`space-y-3.5 p-6 bg-white/[0.06] border border-white/10 rounded-2xl hover:bg-white/[0.09] hover:border-white/20 transition-all ${
                    feat.offset ? 'lg:mt-6' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <feat.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <h3 className="text-[15px] font-bold text-white">{feat.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* LANDLORD CTA                                                    */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container-wide">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark shadow-xl">
            {/* Background glows */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row">

              {/* Content */}
              <div className="flex-1 p-8 sm:p-10 lg:p-14 xl:p-16 space-y-6">
                <p className="text-white/65 text-[11px] font-bold uppercase tracking-widest">
                  For Landlords &amp; Agents
                </p>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  List your property.<br />Reach real tenants.
                </h2>
                <p className="text-white/65 leading-relaxed max-w-md text-sm lg:text-base">
                  Thousands of verified renters browse KamerNdah every week. Get your listing in front
                  of the right people — fast, securely, and with zero commission on first contact.
                </p>

                {/* Mini stats */}
                <div className="flex flex-wrap gap-7 py-5 border-y border-white/20">
                  {landlordStats.map((s, i) => (
                    <div key={i}>
                      <p className="text-2xl font-black text-white">{s.value}</p>
                      <p className="text-white/50 text-[11px] font-semibold mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/submit-property"
                    className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-primary px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:shadow-lg"
                  >
                    <Building2 className="w-4 h-4" />
                    List Your Property
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>

              {/* Decorative image panel */}
              <div className="hidden lg:block w-72 xl:w-88 relative overflow-hidden flex-shrink-0">
                <Image
                  src="/hero-cameroon.svg"
                  fill
                  className="object-cover opacity-25"
                  alt="Apartment building"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
                {/* Floating mini listing card */}
                <div className="absolute bottom-10 left-5 bg-white/15 backdrop-blur border border-white/25 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-white flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">New listing live</p>
                      <p className="text-white/55 text-[10px] mt-0.5">Bonapriso · 3 bed · 180k XAF</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}