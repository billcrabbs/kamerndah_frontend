'use client';
import { useState } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SearchFilters } from '@/components/properties/SearchFilters';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { useGetPropertiesQuery } from '@/store/services/propertyApi';
import { motion } from 'framer-motion';

export default function RentPage() {
 const [localFilters, setLocalFilters] = useState({
 city: '',
 type: '',
 minPrice: '',
 maxPrice: '',
 bedrooms: ''
 });

 // Always fetch properties for-rent and verified
 const { data: propertiesResult, isLoading } = useGetPropertiesQuery({
 category: 'for-rent',
 status: 'verified',
 // We only pass non-empty filters to the API
 ...Object.fromEntries(Object.entries(localFilters).filter(([_, v]) => v !== ''))
 });

 const properties = propertiesResult?.data?.data || propertiesResult?.data || [];
 const displayProperties = Array.isArray(properties) ? properties : [];

 const handleFilterChange = (newFilters) => {
 setLocalFilters(newFilters);
 };

 const handleResetFilters = () => {
 setLocalFilters({
 city: '',
 type: '',
 minPrice: '',
 maxPrice: '',
 bedrooms: '',
 });
 };

 const getActiveFilterCount = () => {
 return Object.values(localFilters).filter(value => value !== '').length;
 };

 return (
 <div className="relative min-h-screen bg-background pt-24 pb-12 overflow-hidden">
 {/* Afro-Geometric Anchor */}
 <div className="absolute inset-0 pattern-afro opacity-[0.03] pointer-events-none" />
 
 {/* Background Glows */}
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
 
 {/* Page Header */}
 <div className="relative z-10 main-container mb-16 px-4">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6"
 >
 <div className="max-w-2xl">
 <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-6">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
 </span>
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Premium Leasing</span>
 </div>
 
 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
 Residences <span className="text-primary-light">For Rent</span>
 </h1>
 <p className="text-gray-400 font-medium text-lg leading-relaxed">
 Discover unparalleled rental homes across Cameroon. Fully verified, meticulously curated.
 </p>
 </div>
 
 <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Market Scope</p>
 <p className="text-white font-bold">
 <span className="text-2xl text-primary-light mr-2">{displayProperties.length}</span>
 Estates Found
 {getActiveFilterCount() > 0 && (
 <span className="text-gray-400 text-sm ml-2 font-normal">
 ({getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied)
 </span>
 )}
 </p>
 </div>
 </motion.div>
 </div>

 {/* Main Content */}
 <div className="relative z-10 main-container px-4">
 <div className="flex flex-col lg:flex-row gap-10">
 {/* Filters Sidebar */}
 <div className="lg:w-80 flex-shrink-0">
 <SearchFilters 
 filters={localFilters}
 onFilterChange={handleFilterChange}
 onReset={handleResetFilters}
 activeFilterCount={getActiveFilterCount()}
 />
 </div>

 {/* Property Grid */}
 <div className="flex-1">
 <PropertyGrid 
 properties={displayProperties}
 loading={isLoading}
 emptyMessage="No rental estates found matching your exact criteria. Try broadening your market scope."
 />
 </div>
 </div>
 </div>
 </div>
 );
}