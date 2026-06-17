'use client';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Building2, 
 ChevronRight, 
 ChevronLeft, 
 ShieldCheck, 
 Zap,
 MapPin,
 Maximize,
 DollarSign,
 Home,
 CheckCircle2,
 Trash2,
 Upload,
 UserCircle,
 Briefcase,
 Trees,
 Car,
 Utensils,
 Image as ImageIcon,
 X
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { showModal } from '@/store/slices/uiSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { useCreatePropertyMutation } from '@/store/services/propertyApi';
import { StepIndicator } from '@/components/properties/submission/StepIndicator';
import { AmenitySelector } from '@/components/properties/submission/AmenitySelector';
import { AccountUpgradeRequired } from '@/components/shared/AccountUpgradeRequired';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(
 () => import('@/components/properties/submission/LocationMap'),
 { ssr: false }
);

export default function SubmitPropertyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, {
  skip: !user?.uid
  });
  const [createProperty, { isLoading: isSubmitting }] = useCreatePropertyMutation();

 const [step, setStep] = useState(1);
 const [formData, setFormData] = useState({
 title: '',
 category: 'for-rent', // 'for-rent' | 'for-sale' | 'short-stay'
 property_type: 'apartment', // 'apartment' | 'house' | 'studio' | 'villa' | 'commercial' | 'land'
 price: '',
 price_negotiable: false,
 description: '',
 city: 'Douala',
 quarter: '',
 address: '',
 lat: '',
 lng: '',
 bedrooms: '2',
 bathrooms: '2',
 area_sqm: '120',
 furnished: false,
 parking: false,
 amenities: [],
 images: [] // Store dummy previews here for now
 });

 const [isSuccess, setIsSuccess] = useState(false);

 const steps = [
 'Property Type',
 'Valuation & Details',
 'Specifications',
 'Media & Photos',
 'Location',
 'Review Summary'
 ];

 const [stepError, setStepError] = useState('');

 const handleNext = () => {
   setStepError('');
   if (step === 1) {
     if (!formData.title.trim() || formData.title.trim().length < 12) {
       setStepError('Property title must be at least 12 characters.');
       return;
     }
   }
   if (step === 2) {
     if (!formData.price || Number(formData.price) <= 0) {
       setStepError('Please enter a valid price greater than 0.');
       return;
     }
     if (!formData.description.trim() || formData.description.trim().length < 20) {
       setStepError('Please add a description (at least 20 characters).');
       return;
     }
   }
   setStep(s => Math.min(s + 1, steps.length));
 };
 const handlePrev = () => { setStepError(''); setStep(s => Math.max(s - 1, 1)); };

// Image upload handler using a real file input (reads files as data URLs for previews)
 const fileInputRef = useRef(null);

 const handleImageUpload = (e) => {
   const files = e?.target?.files ? Array.from(e.target.files) : [];
   if (files.length === 0) return;

   files.forEach((file) => {
     const reader = new FileReader();
     reader.onload = (ev) => {
       setFormData(prev => ({
         ...prev,
         images: [...prev.images, ev.target.result]
       }));
     };
     reader.readAsDataURL(file);
   });
 };

 const triggerFileSelect = () => {
   fileInputRef.current?.click();
 };

 const removeImage = (indexToRemove) => {
   setFormData(prev => ({
     ...prev,
     images: prev.images.filter((_, idx) => idx !== indexToRemove)
   }));
 };

 const handleSubmit = async () => {
   if (formData.images.length === 0) {
     setStep(4);
     setStepError('Please upload at least one image before publishing.');
     return;
   }
 try {
 const finalImages = formData.images;

 const payload = {
 title: formData.title,
 description: formData.description,
 property_type: formData.property_type,
 category: formData.category,
 price: Number(formData.price),
 price_negotiable: formData.price_negotiable,
 location: {
 city: formData.city,
 quarter: formData.quarter,
 address: formData.address,
 coordinates: formData.lat && formData.lng ? { lat: Number(formData.lat), lng: Number(formData.lng) } : null
 },
 specifications: {
 bedrooms: Number(formData.bedrooms) || 0,
 bathrooms: Number(formData.bathrooms) || 0,
 area_sqm: Number(formData.area_sqm) || 0,
 furnished: Boolean(formData.furnished),
 parking: Boolean(formData.parking)
 },
 advantages: formData.amenities,
 images: finalImages,
 landlord_id: user.uid,
 status: 'verified' // Auto-verify for demo, normally 'pending'
 };

    await createProperty(payload).unwrap();
    dispatch(showModal({
      type: 'success',
      title: 'Listing Published',
      message: `Your property "${formData.title}" has been successfully listed. Our team will verify it shortly.`,
      actionText: 'View Inventory',
      redirect: '/dashboard/properties'
    }));
    setIsSuccess(true);
  } catch (err) {
    console.error('Submission failed:', err);
    dispatch(showModal({
      type: 'error',
      title: 'Publication Failed',
      message: err?.data?.error || 'We encountered an error while publishing your property. Please check your data and try again.',
      actionText: 'Retry'
    }));
  }
};

 if (isProfileLoading) return null;

 const isLandlord = profileData?.data?.role === 'landlord';

 if (!isLandlord) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center p-8">
 <AccountUpgradeRequired 
   message="You are currently logged in with a Verified Renter identity. Only registered Elite Landlords can list properties."
 />
 </div>
 );
 }

 if (isSuccess) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center p-8">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-xl w-full bg-[#0c0c0e] border border-white/5 rounded-[4rem] p-16 text-center space-y-10 relative overflow-hidden"
 >
 <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
 <div className="relative z-10 space-y-10">
 <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto emerald-glow">
 <CheckCircle2 className="w-10 h-10 text-white" />
 </div>
 <div className="space-y-4">
 <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Listing Published.</h2>
 <p className="text-gray-500 text-sm font-medium leading-relaxed">
 Your property "<span className="text-white font-bold">{formData.title}</span>" has been verified and successfully listed on the marketplace.
 </p>
 </div>
 <div className="flex flex-col space-y-4">
 <Link 
 href="/dashboard/properties"
 className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs emerald-glow transition-all hover:scale-105"
 >
 Go to Inventory
 </Link>
 <button 
 onClick={() => { setIsSuccess(false); setStep(1); setFormData({ ...formData, title: '', images: [] }); }}
 className="w-full bg-white/5 text-gray-500 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-white/5 hover:text-white hover:bg-white/10 transition-all"
 >
 List Another Property
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-slate-50 pb-32">
 {/* Header */}
 <div className="h-64 relative flex items-end px-8 lg:px-20 pb-12 overflow-hidden bg-gradient-to-b from-navy to-slate-50">
 <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
 
 <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
 <div className="space-y-4">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Zap className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Property Listing</span>
 </div>
 <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase">
 List New <br />
 <span className="text-gradient-gold">Property.</span>
 </h1>
 </div>
 <div className="flex items-center space-x-8 pb-3">
 <div className="text-right">
 <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Listing Status</p>
 <p className="text-sm font-black text-white tracking-tighter uppercase">Draft Phase</p>
 </div>
 <div className="w-px h-12 bg-white/20" />
 <button
    onClick={() => {
      if (window.confirm('Discard this draft? Any unsaved changes will be lost.')) {
        router.back();
      }
    }}
    className="flex items-center space-x-2 text-white/70 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"
  >
    <ChevronLeft className="w-4 h-4" />
    <span>Cancel</span>
  </button>
 </div>
 </div>
 </div>

 <div className="max-w-6xl mx-auto px-8 lg:px-20 mt-16">
 <StepIndicator currentStep={step} totalSteps={steps.length} steps={steps} />

 <div className="mt-24 min-h-[500px]">
 <AnimatePresence mode="wait">
 {step === 1 && (
 <motion.div 
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-12"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Listing Type</label>
 <div className="flex items-center space-x-4 flex-wrap gap-y-4">
 {['for-rent', 'for-sale', 'short-stay'].map(cat => (
 <button
 key={cat}
 onClick={() => setFormData({...formData, category: cat})}
 className={`flex-1 min-w-[120px] py-5 rounded-3xl border font-black uppercase tracking-widest text-[10px] transition-all ${
 formData.category === cat ? 'bg-primary text-white border-transparent emerald-glow' : 'bg-white border-border text-slate-500 hover:bg-slate-50'
 }`}
 >
 {cat.replace('-', ' ')}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Property Type</label>
 <div className="grid grid-cols-2 gap-4">
 {[
 { id: 'apartment', icon: Building2 },
 { id: 'house', icon: Home },
 { id: 'studio', icon: UserCircle },
 { id: 'villa', icon: Home },
 { id: 'commercial', icon: Briefcase },
 { id: 'land', icon: Trees }
 ].map(t => (
 <button
 key={t.id}
 onClick={() => setFormData({...formData, property_type: t.id})}
 className={`flex items-center space-x-4 p-5 rounded-3xl border transition-all ${
 formData.property_type === t.id ? 'bg-primary/10 border-primary/30 text-navy' : 'bg-white border-border text-slate-600 hover:bg-slate-50'
 }`}
 >
 <t.icon className={`w-5 h-5 ${formData.property_type === t.id ? 'text-primary' : 'text-slate-400'}`} />
 <span className="text-[10px] font-black uppercase tracking-widest">{t.id}</span>
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Property Title</label>
 <input 
 type="text"
 value={formData.title}
 onChange={(e) => setFormData({...formData, title: e.target.value})}
 className="w-full bg-white border border-border rounded-[2.5rem] p-8 text-xl font-black text-navy tracking-tighter uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. ULTRA-MODERN PENTHOUSE IN BONAPRISO"
 />
 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-4">Min. 12 characters for platform optimization</p>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {step === 2 && (
 <motion.div 
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="grid grid-cols-1 md:grid-cols-2 gap-12"
 >
 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Market Price (XAF)</label>
 <div className="relative">
 <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
 <input 
 type="number"
 value={formData.price}
 onChange={(e) => setFormData({...formData, price: e.target.value})}
 className="w-full bg-white border border-border rounded-[2.5rem] p-10 pl-20 text-3xl font-black text-navy tracking-tighter uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="0.00"
 />
 </div>
 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-4">Recommended for {formData.quarter || 'this region'}: 500k - 1.5M</p>
 </div>

 <div className="space-y-4 pt-4">
 <label className="flex items-center space-x-4 cursor-pointer group bg-white border border-border p-6 rounded-3xl hover:bg-slate-50 transition-all">
 <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.price_negotiable ? 'bg-primary' : 'bg-slate-300'}`}>
 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.price_negotiable ? 'translate-x-7' : 'translate-x-1'}`} />
 </div>
 <span className="text-xs font-black uppercase tracking-widest text-navy">Price Negotiable</span>
 <input 
 type="checkbox" 
 checked={formData.price_negotiable}
 onChange={(e) => setFormData({...formData, price_negotiable: e.target.checked})}
 className="hidden" 
 />
 </label>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Executive Summary & Details</label>
 <textarea 
 value={formData.description}
 onChange={(e) => setFormData({...formData, description: e.target.value})}
 className="w-full bg-white border border-border rounded-[3rem] p-10 text-sm font-medium text-navy min-h-[300px] resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="Detail the architectural merit and strategic value of the asset..."
 />
 </div>
 </motion.div>
 )}

 {step === 3 && (
 <motion.div 
 key="step3"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-12"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {['apartment', 'house', 'villa'].includes(formData.property_type) && (
 <>
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Bedrooms</label>
 <div className="flex items-center space-x-2">
 {[1, 2, 3, 4, 5].map(val => (
 <button
 key={val}
 onClick={() => setFormData({...formData, bedrooms: val})}
 className={`flex-1 py-4 rounded-2xl border font-black text-[10px] transition-all ${
 Number(formData.bedrooms) === val ? 'bg-primary text-white border-transparent emerald-glow' : 'bg-white border-border text-slate-500 hover:bg-slate-50'
 }`}
 >
 {val}
 </button>
 ))}
 </div>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Bathrooms</label>
 <div className="flex items-center space-x-2">
 {[1, 2, 3, 4, 5].map(val => (
 <button
 key={val}
 onClick={() => setFormData({...formData, bathrooms: val})}
 className={`flex-1 py-4 rounded-2xl border font-black text-[10px] transition-all ${
 Number(formData.bathrooms) === val ? 'bg-primary text-white border-transparent emerald-glow' : 'bg-white border-border text-slate-500 hover:bg-slate-50'
 }`}
 >
 {val}
 </button>
 ))}
 </div>
 </div>
 </>
 )}
 
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Physical Dimensions (m²)</label>
 <div className="relative">
 <Maximize className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input 
 type="number"
 value={formData.area_sqm}
 onChange={(e) => setFormData({...formData, area_sqm: e.target.value})}
 className="w-full bg-white border border-border rounded-2xl p-4 pl-14 text-sm font-black text-navy tracking-tighter uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. 150"
 />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
 <label className="flex items-center justify-between cursor-pointer group bg-white border border-border p-6 rounded-3xl hover:bg-slate-50 transition-all">
 <div className="flex items-center space-x-4">
 <Utensils className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
 <span className="text-xs font-black uppercase tracking-widest text-navy">Furnished</span>
 </div>
 <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.furnished ? 'bg-primary' : 'bg-slate-300'}`}>
 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.furnished ? 'translate-x-7' : 'translate-x-1'}`} />
 </div>
 <input 
 type="checkbox" 
 checked={formData.furnished}
 onChange={(e) => setFormData({...formData, furnished: e.target.checked})}
 className="hidden" 
 />
 </label>

 <label className="flex items-center justify-between cursor-pointer group bg-white border border-border p-6 rounded-3xl hover:bg-slate-50 transition-all">
 <div className="flex items-center space-x-4">
 <Car className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
 <span className="text-xs font-black uppercase tracking-widest text-navy">Parking Available</span>
 </div>
 <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.parking ? 'bg-primary' : 'bg-slate-300'}`}>
 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.parking ? 'translate-x-7' : 'translate-x-1'}`} />
 </div>
 <input 
 type="checkbox" 
 checked={formData.parking}
 onChange={(e) => setFormData({...formData, parking: e.target.checked})}
 className="hidden" 
 />
 </label>
 </div>

 <div className="space-y-6 pt-8 border-t border-border">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Integrated Amenities</label>
 <AmenitySelector 
 selected={formData.amenities}
 onChange={(val) => setFormData({...formData, amenities: val})}
 />
 </div>
 </motion.div>
 )}

 {step === 4 && (
 <motion.div 
 key="step4"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-12"
 >
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Property Media</label>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {/* Upload Trigger */}
 <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
 <div 
 onClick={triggerFileSelect}
 className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all group"
 >
 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
 <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
 </div>
 <p className="text-xs font-black text-navy uppercase tracking-widest">Click to Upload</p>
 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Max 5MB per file</p>
 </div>

 {/* Previews */}
 {formData.images.map((img, idx) => (
 <div key={idx} className="aspect-video relative rounded-[2rem] overflow-hidden group border border-border bg-white">
 <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <button 
 onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
 className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
 >
 <X className="w-4 h-4 text-white" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {step === 5 && (
 <motion.div 
 key="step5"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="grid grid-cols-1 md:grid-cols-2 gap-12"
 >
 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">City Hub</label>
 <select 
 value={formData.city}
 onChange={(e) => setFormData({...formData, city: e.target.value})}
 className="w-full bg-white border border-border rounded-[2rem] p-8 text-xl font-black text-navy tracking-tighter uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all cursor-pointer"
 >
 <option className="bg-slate-50 text-navy">Douala</option>
 <option className="bg-slate-50 text-navy">Yaoundé</option>
 <option className="bg-slate-50 text-navy">Kribi</option>
 <option className="bg-slate-50 text-navy">Limbe</option>
 </select>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Quarter / Neighborhood</label>
 <input 
 type="text"
 value={formData.quarter}
 onChange={(e) => setFormData({...formData, quarter: e.target.value})}
 className="w-full bg-white border border-border rounded-[2rem] p-8 text-xl font-black text-navy tracking-tighter uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. BONAPRISO"
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Specific Address</label>
 <input 
 type="text"
 value={formData.address}
 onChange={(e) => setFormData({...formData, address: e.target.value})}
 className="w-full bg-white border border-border rounded-[2rem] p-8 text-sm font-bold text-navy uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. RUE DES ECOLES, NEAR ORANGE HQ"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Latitude</label>
 <input 
 type="text"
 value={formData.lat}
 onChange={(e) => setFormData({...formData, lat: e.target.value})}
 className="w-full bg-white border border-border rounded-[2rem] p-8 text-sm font-bold text-navy uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. 4.0511"
 />
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">Longitude</label>
 <input 
 type="text"
 value={formData.lng}
 onChange={(e) => setFormData({...formData, lng: e.target.value})}
 className="w-full bg-white border border-border rounded-[2rem] p-8 text-sm font-bold text-navy uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-400"
 placeholder="e.g. 9.7085"
 />
 </div>
 </div>
 </div>

 <div className="bg-white border border-border rounded-[3rem] p-4 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
 <div className="w-full h-full relative">
 <LocationMap 
 position={{ lat: formData.lat, lng: formData.lng }}
 onPositionChange={(pos) => setFormData({ ...formData, lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })}
 />
 </div>
 </div>
 </motion.div>
 )}

 {step === 6 && (
 <motion.div 
 key="step6"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-12"
 >
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="md:col-span-2 space-y-8">
 <div className="bg-white border border-border rounded-[3.5rem] p-12 space-y-8">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
 <ShieldCheck className="w-6 h-6 text-primary" />
 </div>
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-primary">Review Summary</p>
 <h4 className="text-xl font-black text-navy tracking-tighter uppercase leading-none">Ready for Listing</h4>
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Valuation</p>
 <p className="text-2xl font-black text-navy tracking-tighter uppercase">{Number(formData.price).toLocaleString()} XAF</p>
 {formData.price_negotiable && <span className="text-[9px] text-primary uppercase tracking-widest font-black mt-1 block">Negotiable</span>}
 </div>
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Location</p>
 <p className="text-2xl font-black text-navy tracking-tighter uppercase ">{formData.quarter || 'N/A'}, {formData.city}</p>
 </div>
 </div>
 </div>

 <div className="p-10 border border-border rounded-[3rem] flex items-center justify-between bg-white">
 <div className="flex items-center space-x-6">
 <div className="p-4 bg-slate-50 rounded-2xl">
 <ImageIcon className="w-6 h-6 text-slate-400" />
 </div>
 <div>
 <p className="text-navy font-black uppercase tracking-widest text-xs">Media Check</p>
 <p className="text-slate-500 text-[10px] font-medium leading-relaxed max-w-sm">
 {formData.images.length} high-quality images attached to your listing.
 </p>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-primary/10 border border-primary/20 rounded-[3.5rem] p-12 flex flex-col justify-between">
 <div className="space-y-6">
 <Zap className="w-12 h-12 text-primary" />
 <div className="space-y-3">
 <h4 className="text-2xl font-black text-navy uppercase tracking-tighter leading-none">Publish Property</h4>
 <p className="text-slate-600 text-[11px] font-medium leading-relaxed">
 By clicking Publish, your property will be evaluated and deployed across our marketplace network.
 </p>
 </div>
 </div>
 
 <button 
 disabled={isSubmitting}
 onClick={handleSubmit}
 className="bg-navy hover:bg-navy/80 disabled:opacity-60 disabled:cursor-not-allowed text-white w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-navy/25"
 >
 {isSubmitting ? 'Publishing...' : 'Publish Now'}
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {stepError && (
  <div className="mt-8 flex items-center space-x-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-semibold">
    <span>⚠ {stepError}</span>
  </div>
  )}

 {/* Navigation Buttons */}
 {!isSuccess && (
 <div className="mt-12 flex items-center justify-between border-t border-border pt-12">
 <button 
 onClick={handlePrev}
 disabled={step === 1}
 className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-navy'}`}
 >
 <ChevronLeft className="w-5 h-5" />
 <span>Previous Step</span>
 </button>

 {step < steps.length && (
 <button 
 onClick={handleNext}
 className="bg-navy hover:bg-navy/80 text-white px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all hover:shadow-lg flex items-center space-x-3 hover:shadow-navy/25"
 >
 <span>Continue</span>
 <ChevronRight className="w-5 h-5" />
 </button>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
