'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
 ArrowLeft, 
 Share2, 
 Heart,
 ChevronRight,
 Sparkles
} from 'lucide-react';
import { useGetPropertyByIdQuery } from '@/store/services/propertyApi';
import { useState } from 'react';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertyInfo } from '@/components/properties/PropertyInfo';
import { PropertyActionSidebar } from '@/components/properties/PropertyActionSidebar';
import { VisitScheduleModal } from '@/components/properties/VisitScheduleModal';
import { CreateBookingModal } from '@/components/properties/CreateBookingModal';
import { MOCK_PROPERTIES } from '@/data/mockProperties';

export default function PropertyDetailPage() {
 const { id } = useParams();
 const { data: realProperty, isLoading } = useGetPropertyByIdQuery(id);
 const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
 const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
 
 // Backend returns { success: true, data: { title, price, ... } }
 // Extract the actual property object from the response envelope
 const propertyData = realProperty?.data || realProperty;
 const property = propertyData || MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center space-y-8">
 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 relative">
 <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse" />
 <Sparkles className="w-10 h-10 text-primary-light animate-spin-slow" />
 </div>
 <p className="text-gray-500 font-bold uppercase tracking-[0.5em] animate-pulse">Retrieving Estate Data</p>
 </div>
 );
 }

 const backLink = property?.category === 'for-sale' ? '/buy' : '/rent';

 return (
  <main className="min-h-screen bg-background pb-32">
  {/* Dynamic Header / Breadcrumbs */}
  <div className="relative h-20 bg-white border-b border-border z-50">
  <div className="main-container h-full flex items-center justify-between">
  <Link 
  href={backLink} 
  className="flex items-center space-x-3 text-slate-500 hover:text-navy transition-all group"
  >
  <div className="p-2 bg-slate-50 border border-border rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
  <ArrowLeft className="w-4 h-4" />
  </div>
  <span className="text-xs font-black uppercase tracking-widest">Explore {property?.category?.replace('-', ' ') || 'Properties'}</span>
  </Link>
  
  <div className="flex items-center space-x-4">
  <button className="p-3 bg-slate-50 rounded-2xl border border-border hover:bg-slate-100 transition-all text-slate-400 hover:text-navy group">
  <Share2 className="w-5 h-5 transition-transform group-hover:scale-110" />
  </button>
  <button 
  onClick={() => {
  // Future: Handle favorite toggle from here too if needed
  }}
  className="p-3 bg-slate-50 rounded-2xl border border-border text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
  >
  <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
  </button>
  </div>
  </div>
  </div>
 
  {/* Hero Gallery Section */}
  <section className="pt-12">
  <div className="main-container">
  <PropertyGallery property={property} />
  </div>
  </section>
 
  {/* Main Content Grid */}
  <section className="mt-12">
  <div className="main-container">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
  
  {/* Left: Detailed Info */}
  <div className="lg:col-span-8 space-y-12">
  <PropertyInfo property={property} />
  
  {/* Luxury Map Placeholder */}
  <div className="bg-white border border-border rounded-[3rem] p-12 relative overflow-hidden group premium-shadow">
  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
  <Sparkles className="w-8 h-8 text-primary" />
  </div>
  <div className="space-y-2">
  <h3 className="text-2xl font-black text-navy tracking-tighter uppercase">Geographic Precision</h3>
  <p className="text-slate-500 font-medium max-w-sm">Interactive neighborhood heatmaps and landmark proximity arriving shortly.</p>
  </div>
  </div>
  </div>
  </div>
 
  {/* Right: Actions Sidebar (Sticky) */}
  <div className="lg:col-span-4">
  <div className="sticky top-32">
  <PropertyActionSidebar 
  property={property} 
  onScheduleVisit={() => setIsVisitModalOpen(true)}
  onBookNow={() => setIsBookingModalOpen(true)}
  />
  </div>
  </div>
 
  </div>
  </div>
  </section>

 <VisitScheduleModal 
 property={property} 
 isOpen={isVisitModalOpen} 
 onClose={() => setIsVisitModalOpen(false)} 
 />

 <CreateBookingModal
 property={property}
 isOpen={isBookingModalOpen}
 onClose={() => setIsBookingModalOpen(false)}
 />
 </main>
 );
}