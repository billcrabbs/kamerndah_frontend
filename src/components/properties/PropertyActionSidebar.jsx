'use client';
import { Zap, MessageCircle, Calendar, Key, ShieldCheck, Phone } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function PropertyActionSidebar({ property, onScheduleVisit, onBookNow }) {
  const isRent = property.category === 'for-rent';
  const actionLabel = isRent ? 'Apply to Rent' : 'Make an Offer';
  const whatsappNumber = '237672676029';
  const locationCity =
    property.location?.city ||
    (typeof property.location === 'string' ? property.location : '') ||
    property.city ||
    'Cameroon';
  const message = `Hello KamerNdah! I'm interested in "${property.title}" in ${locationCity}. (ID: ${property.id})`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="space-y-4">
      {/* Price card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">
            {isRent ? 'Monthly rent' : 'Asking price'}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-navy tracking-tight">
              {formatPrice(property.price)}
            </span>
            {isRent && <span className="text-xs text-gray-500 font-medium">/mo</span>}
          </div>
          {property.price_negotiable && (
            <div className="flex items-center gap-1 mt-1 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              <span>Negotiable</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onBookNow}
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onScheduleVisit}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-navy py-3 rounded-xl text-[10px] font-bold tracking-wider transition-all border border-gray-200"
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span>Schedule Visit</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 py-3 rounded-xl text-[10px] font-bold tracking-wider transition-all border border-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          {[
            { icon: ShieldCheck, text: 'Identity verified', color: 'text-primary' },
            { icon: Zap, text: 'Direct WhatsApp contact', color: 'text-amber-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-2xl p-5">
        <div className="p-2.5 bg-primary rounded-xl flex-shrink-0">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary tracking-wider uppercase">Support</p>
          <p className="text-sm font-bold text-navy">+237 672 676 029</p>
        </div>
      </div>
    </div>
  );
}
