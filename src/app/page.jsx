// app/page.jsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Award,
  X,
  CheckCircle2,
  Building2,
  Users,
  TrendingUp
} from 'lucide-react';
import { useGetPropertiesQuery } from '@/store/services/propertyApi';
import { PropertyCard } from '@/components/properties/PropertyCard';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: propertiesResult, isLoading, error, refetch } = useGetPropertiesQuery();
  
  const properties = useMemo(() => {
    if (propertiesResult?.data?.data) return propertiesResult.data.data;
    if (propertiesResult?.data) return propertiesResult.data;
    if (Array.isArray(propertiesResult)) return propertiesResult;
    return [];
  }, [propertiesResult]);

  const filteredProperties = useMemo(() => {
    let filtered = properties;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const locationString = typeof p.location === 'object'
          ? `${p.location?.quarter || ''} ${p.location?.city || ''}`.toLowerCase()
          : (p.location || '').toLowerCase();
        return locationString.includes(query) ||
               (p.title || '').toLowerCase().includes(query) ||
               (p.description || '').toLowerCase().includes(query) ||
               (p.city || '').toLowerCase().includes(query);
      });
    }
    return filtered;
  }, [properties, activeCategory, searchQuery]);

  if (error) {
    return (
      <div className="min-h-screen flex items-start justify-start pt-32 px-8 lg:px-24">
        <div className="space-y-6 max-w-md">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-white">Connection Issue</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Unable to load properties. Please check your connection and try again.
          </p>
          <button 
            onClick={() => refetch()}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        {/* Subtly animated afro-geometric pattern layered with deep background */}
        <div className="absolute inset-0 pattern-afro opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background to-background pointer-events-none" />
        
        {/* Subtle ambient glow — top-left only so it's not centered */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="main-container relative z-10">
          {/* Two-column: text left, image right — image overflows at the bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_45%] gap-0 items-start">

            {/* LEFT — copy starts at the very top, strictly left-aligned */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 pb-24 pr-0 lg:pr-16 space-y-8"
            >
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary-light text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {properties.length > 0 ? `${properties.length}+ verified listings` : 'Verified listings live'}
              </div>

              {/* Headline — no centering, just raw left-aligned power */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                Find a home<br />
                you'll actually<br />
                <span className="text-primary">love.</span>
              </h1>

              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Verified apartments, houses, and commercial spaces across Cameroon. 
                Browse with confidence — every listing is inspected before it goes live.
              </p>

              {/* Search bar */}
              <div className="w-full max-w-lg">
                <div className="flex bg-[#121214] border border-white/10 rounded-2xl p-1.5 shadow-2xl focus-within:border-primary/40 transition-colors">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="City, neighborhood, property type…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('properties-grid')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-transparent text-white font-medium text-sm focus:outline-none w-full placeholder:text-gray-600"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-gray-600 hover:text-white transition p-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => document.getElementById('properties-grid')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Quick searches */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="text-gray-700 text-xs">Try:</span>
                  {['Douala', 'Yaoundé', 'Bonapriso', 'Bastos'].map(q => (
                    <button 
                      key={q} 
                      onClick={() => {
                        setSearchQuery(q);
                        document.getElementById('properties-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-primary transition-colors text-xs font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inline social-proof strip — not centered, left-aligned pill row */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>100% verified listings</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Douala · Yaoundé · Kribi</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-primary" />
                  <span>500+ happy tenants</span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — image panel, taller, bleeds off the bottom edge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Main image — no rounded bottom so it bleeds into next section */}
              <div className="relative h-[680px] w-full rounded-t-[2.5rem] overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400" 
                  fill
                  className="object-cover"
                  alt="Modern home in Cameroon"
                  priority
                />
                {/* Gradient fade at the bottom to blend into next section */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
              </div>

              {/* Floating card — positioned off the left edge to break symmetry */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-20 -left-10 bg-[#0e0e10]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Verified Property</p>
                  <p className="text-gray-500 text-xs mt-0.5">Inspected · Ready to view</p>
                </div>
              </motion.div>

              {/* Second floating stat card, top right */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-8 right-6 bg-[#0e0e10]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
              >
                <p className="text-gray-500 text-xs font-medium mb-1">New this week</p>
                <p className="text-white font-black text-xl">+12 listings</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROPERTIES GRID ───────────────────────────────────────────────── */}
      <section id="properties-grid" className="py-20 relative bg-[#0a0a0c] border-t border-white/5">
        <div className="main-container">

          {/* Section header — left-aligned, filter tabs float right */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse listings'}
              </p>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                {searchQuery 
                  ? `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`
                  : 'Latest Properties'
                }
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'for-rent', label: 'For Rent' },
                { id: 'for-sale', label: 'For Sale' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {(activeCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-white/[0.03] rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <motion.div 
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProperties.map((property, index) => (
                  <motion.div 
                    key={property.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PropertyCard property={property} priority={index < 3} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 bg-white/[0.02] border border-white/5 rounded-3xl px-10 flex flex-col items-start space-y-6 max-w-2xl"
              >
                <Search className="w-8 h-8 text-gray-700" />
                <div>
                  <h3 className="text-xl font-black text-white mb-2">No properties found</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We couldn't find any listings that match your search. Try removing some filters or searching a broader area.
                  </p>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-white bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link — left aligned, not centered */}
          {filteredProperties.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/5">
              <Link 
                href="/rent" 
                className="inline-flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group text-sm"
              >
                <span>View all available listings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY KAMERNDAH ─────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="main-container">
          {/* Intentionally NOT a grid — left column is heading, right is staggered cards */}
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Left — heading stays at the top, not vertically centered */}
            <div className="lg:w-[38%] space-y-6 lg:pt-4">
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Why KamerNdah</p>
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                The smarter way to find property in Cameroon.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                We cut out the middleman, eliminate fake listings, and give you direct access to verified properties and landlords.
              </p>
              <Link 
                href="/rent" 
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Start browsing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — 2x2 feature grid, staggered top offset for organic feel */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { 
                  icon: ShieldCheck, 
                  title: 'Verified Listings', 
                  desc: 'Every property is physically inspected by our team before going live.',
                  offset: false
                },
                { 
                  icon: Zap, 
                  title: 'Fast Communication', 
                  desc: 'Direct contact between landlords and tenants — no unnecessary delays.',
                  offset: true
                },
                { 
                  icon: MapPin, 
                  title: 'Local Knowledge', 
                  desc: 'Deep neighborhood expertise across Douala, Yaoundé, Bafoussam and more.',
                  offset: false
                },
                {
                  icon: Award,
                  title: 'Secure Payments',
                  desc: 'Mobile money integrations built for Cameroonian renters and buyers.',
                  offset: true
                }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`space-y-4 p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all ${feat.offset ? 'lg:mt-8' : ''}`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LANDLORD CTA ──────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="main-container">
          {/* Asymmetric layout — text left, image right, no "items-center" trap */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0d1a0f] border border-primary/20">
            {/* Background glow — left-biased */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
              {/* Left — content block */}
              <div className="flex-1 p-10 lg:p-16 space-y-6">
                <p className="text-primary text-xs font-bold uppercase tracking-widest">For Landlords & Agents</p>
                <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  List your property.<br />
                  Reach real tenants.
                </h2>
                <p className="text-gray-400 leading-relaxed max-w-md">
                  Thousands of verified renters browse KamerNdah every week. Get your listing in front of the right people — fast, securely, and with zero commission on first contact.
                </p>

                {/* Stats row — left aligned */}
                <div className="flex flex-wrap gap-8 py-4 border-y border-white/5">
                  {[
                    { value: '500+', label: 'Active renters' },
                    { value: '48h', label: 'Avg. first inquiry' },
                    { value: '0%', label: 'Contact commission' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                      <p className="text-gray-500 text-xs font-medium mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/submit-property" 
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-colors text-sm"
                  >
                    List Your Property
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold transition-colors text-sm"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>

              {/* Right — decorative panel with a light image */}
              <div className="hidden lg:block w-80 xl:w-96 relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                  fill
                  className="object-cover opacity-30"
                  alt="Apartment building"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a0f] to-transparent" />
                {/* Floating mini-card */}
                <div className="absolute bottom-10 left-6 bg-[#0e0e10]/90 backdrop-blur border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white text-xs font-bold">New listing live</p>
                      <p className="text-gray-500 text-[10px]">Bonapriso · 3 bed · 180k XAF</p>
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