'use client';
import { 
 Zap, 
 Phone, 
 MessageCircle, 
 Calendar, 
 ArrowRight,
 Sparkles,
 ShieldCheck,
 Key
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function PropertyActionSidebar({ property, onScheduleVisit, onBookNow }) {
 const isRent = property.category === 'for-rent';
 const actionLabel = isRent ? 'Apply to Rent' : 'Make an Offer';
 
 // WhatsApp Link Construction (Cameroon Country Code +237)
 const whatsappNumber = '237672676029'; // Dynamic in production
 const locationCity = property.location?.city || (typeof property.location === 'string' ? property.location : '') || property.city || 'Cameroon';
 const message = `Hello KamerNdah! I am interested in "${property.title}" in ${locationCity}. Can we discuss a bargain? (ID: ${property.id})`;
 const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

 return (
  <div className="space-y-6">
  <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-8 premium-shadow relative overflow-hidden">
  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
  
  {/* Price & Badge */}
  <div className="space-y-4 relative">
  <div className="flex items-center space-x-2 text-secondary-dark">
  <Sparkles className="w-3.5 h-3.5" />
  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-dark">{isRent ? 'Monthly Rent' : 'Asking Price'}</span>
  </div>
  <div className="flex flex-col">
  <span className="text-4xl font-black text-navy tracking-tighter">
  {formatPrice(property.price)}
  {isRent && <span className="text-sm font-medium text-slate-500 ml-2">/ month</span>}
  </span>
  {property.price_negotiable && (
  <span className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest flex items-center">
  <Zap className="w-3 h-3 mr-1 text-secondary" />
  Price Negotiable
  </span>
  )}
  </div>
  </div>

  {/* Action Buttons */}
  <div className="space-y-4">
  <button 
  onClick={onBookNow}
  className="flex items-center justify-center space-x-3 bg-primary text-white p-5 rounded-2xl w-full text-center font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 emerald-glow"
  >
  <Key className="w-5 h-5" />
  <span>{actionLabel}</span>
  </button>

  <div className="grid grid-cols-2 gap-3">
  <button 
  onClick={onScheduleVisit}
  className="flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-navy p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-border"
  >
  <Calendar className="w-4 h-4" />
  <span>Schedule Visit</span>
  </button>
  <a
  href={whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-200"
  >
  <MessageCircle className="w-4 h-4" />
  <span>WhatsApp</span>
  </a>
  </div>
  </div>

  {/* Feature Highlights */}
  <div className="pt-8 border-t border-border space-y-4">
  <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
  <ShieldCheck className="w-4 h-4 text-primary" />
  <span>Full Identity Verification</span>
  </div>
  <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
  <Zap className="w-4 h-4 text-secondary" />
  <span>Direct WhatsApp negotiation</span>
  </div>
  </div>
  </div>

  {/* Concierge Card */}
  <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 flex items-center space-x-4">
  <div className="bg-primary p-3 rounded-2xl emerald-glow">
  <Phone className="w-5 h-5 text-white" />
  </div>
  <div>
  <p className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-1">Corporate Support</p>
  <p className="text-sm font-bold text-navy">+237 672 676 029</p>
  </div>
  </div>
  </div>
 );
}
