'use client';
import { useState } from 'react';
import { 
 Filter, 
 X,
 ChevronDown,
 ChevronUp 
} from 'lucide-react';
import { CAMEROON_CITIES } from '@/config/cities';

export function SearchFilters({ filters, onFilterChange, onReset, activeFilterCount, priceRanges: customPriceRanges, isSalePage = false }) {
 const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

 const propertyTypes = [
 { value: 'apartment', label: 'Apartment' },
 { value: 'house', label: 'House' },
 { value: 'studio', label: 'Studio' },
 { value: 'commercial', label: 'Commercial' },
 ];

 const bedroomOptions = [
 { value: '1', label: '1 bedroom' },
 { value: '2', label: '2 bedrooms' },
 { value: '3', label: '3 bedrooms' },
 { value: '4', label: '4+ bedrooms' },
 ];

 const priceRanges = {
 douala: { min: 50000, max: 500000 },
 yaounde: { min: 40000, max: 400000 },
 buea: { min: 30000, max: 200000 },
 bamenda: { min: 25000, max: 150000 },
 bafoussam: { min: 20000, max: 120000 },
 };

 const priceLabel = isSalePage ? 'Price Range (XAF)' : 'Price Range (XAF/month)';
 
 const getPriceRange = () => {
 const city = filters.city;
 return priceRanges[city] || { min: 0, max: 500000 };
 };

 const handleInputChange = (key, value) => {
 onFilterChange({
 ...filters,
 [key]: value
 });
 };
 
 const FilterSection = ({ title, children }) => (
 <div className="border-b border-white/5 pb-6 mb-6">
 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">{title}</h3>
 {children}
 </div>
 );

 const MobileFilterButton = () => (
 <button
 onClick={() => setIsMobileFiltersOpen(true)}
 className="lg:hidden flex items-center justify-center space-x-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 w-full mb-6 glass-effect text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px]"
 >
 <Filter className="w-4 h-4 text-primary" />
 <span>Filters</span>
 {activeFilterCount > 0 && (
 <span className="bg-primary text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center drop-shadow-md">
 {activeFilterCount}
 </span>
 )}
 </button>
 );

 const FilterContent = () => (
 <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 sticky top-24 premium-shadow">
 {/* Header */}
 <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
 <h2 className="text-xl font-black text-white tracking-tighter uppercase">Filters</h2>
 <div className="flex items-center space-x-4">
 {activeFilterCount > 0 && (
 <button
 onClick={onReset}
 className="text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-white transition-colors"
 >
 Reset All
 </button>
 )}
 <button
 onClick={() => setIsMobileFiltersOpen(false)}
 className="lg:hidden p-2 bg-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* City Filter */}
 <FilterSection title="Destination">
 <select
 value={filters.city || ''}
 onChange={(e) => handleInputChange('city', e.target.value)}
 className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
 >
 <option value="" className="bg-background">All Locations</option>
 {Object.entries(CAMEROON_CITIES).map(([key, city]) => (
 <option key={key} value={key} className="bg-background text-white">
 {city.name}
 </option>
 ))}
 </select>
 </FilterSection>

 {/* Property Type */}
 <FilterSection title="Category">
 <div className="space-y-3">
 {propertyTypes.map((type) => (
 <label key={type.value} className="flex items-center group cursor-pointer">
 <div className="relative flex items-center justify-center w-5 h-5 mr-3">
 <input
 type="radio"
 name="propertyType"
 value={type.value}
 checked={filters.type === type.value}
 onChange={(e) => handleInputChange('type', e.target.value)}
 className="peer appearance-none w-full h-full border border-white/20 rounded-full checked:border-primary transition-all cursor-pointer bg-black/20"
 />
 <div className="absolute w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
 </div>
 <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{type.label}</span>
 </label>
 ))}
 </div>
 </FilterSection>

 {/* Price Range */}
 <FilterSection title={priceLabel}>
 <div className="space-y-5">
 <div className="flex space-x-4">
 <div className="flex-1">
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Minimum</label>
 <input
 type="number"
 value={filters.minPrice || ''}
 onChange={(e) => handleInputChange('minPrice', e.target.value)}
 placeholder={getPriceRange().min.toLocaleString()}
 className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
 />
 </div>
 <div className="flex-1">
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Maximum</label>
 <input
 type="number"
 value={filters.maxPrice || ''}
 onChange={(e) => handleInputChange('maxPrice', e.target.value)}
 placeholder={getPriceRange().max.toLocaleString()}
 className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
 />
 </div>
 </div>
 {filters.city && (
 <div className="flex items-start space-x-2 bg-primary/5 border border-primary/10 rounded-xl p-3">
 <div className="text-[10px] text-primary-light font-medium leading-relaxed">
 Market range in {CAMEROON_CITIES[filters.city]?.name}:<br/>
 <span className="font-black tracking-wider text-white">
 {getPriceRange().min.toLocaleString()} - {getPriceRange().max.toLocaleString()} XAF
 </span>
 {!isSalePage && <span className="text-gray-400">/mo</span>}
 </div>
 </div>
 )}
 </div>
 </FilterSection>

 {/* Bedrooms */}
 <FilterSection title="Bedrooms">
 <div className="grid grid-cols-2 gap-3">
 {bedroomOptions.map((option) => (
 <button
 key={option.value}
 onClick={() => handleInputChange('bedrooms', filters.bedrooms === option.value ? '' : option.value)}
 className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${
 filters.bedrooms === option.value
 ? 'bg-primary/20 text-white border-primary/50 shadow-[0_0_15px_rgba(45,91,255,0.3)]'
 : 'bg-black/20 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
 }`}
 >
 {option.label}
 </button>
 ))}
 </div>
 </FilterSection>

 {/* Quick City Links */}
 <FilterSection title="Popular Destinations">
 <div className="space-y-2">
 {Object.entries(CAMEROON_CITIES).slice(0, 3).map(([key, city]) => (
 <button
 key={key}
 onClick={() => handleInputChange('city', key)}
 className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
 filters.city === key
 ? 'bg-primary/20 text-primary-light border border-primary/30'
 : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
 }`}
 >
 {city.name}
 </button>
 ))}
 </div>
 </FilterSection>
 </div>
 );

 return (
 <>
 <MobileFilterButton />
 <div className="hidden lg:block relative z-20">
 <FilterContent />
 </div>
 {/* Mobile Overlay */}
 {isMobileFiltersOpen && (
 <div className="fixed inset-0 z-[200] lg:hidden">
 <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsMobileFiltersOpen(false)} />
 <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#0c0c0e] border-l border-white/5 overflow-y-auto custom-scrollbar shadow-2xl">
 <FilterContent />
 </div>
 </div>
 )}
 </>
 );
}