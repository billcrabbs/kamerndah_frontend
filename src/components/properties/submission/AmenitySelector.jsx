'use client';
import { 
 Zap, 
 Droplets, 
 Wifi, 
 Car, 
 Shield, 
 Waves,
 Wind,
 Tv,
 Utensils
} from 'lucide-react';

const AMENITIES = [
 { id: 'electricity', label: 'Eneo Grid', icon: Zap },
 { id: 'water', label: 'CDE Water', icon: Droplets },
 { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
 { id: 'security', label: '24/7 Security', icon: Shield },
 { id: 'pool', label: 'Pool Access', icon: Waves },
 { id: 'ac', label: 'Air Cond.', icon: Wind },
];

export function AmenitySelector({ selected = [], onChange }) {
 const toggleAmenity = (id) => {
 if (selected.includes(id)) {
 onChange(selected.filter(item => item !== id));
 } else {
 onChange([...selected, id]);
 }
 };

 return (
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {AMENITIES.map((amenity) => {
 const isActive = selected.includes(amenity.id);
 return (
 <button
 key={amenity.id}
 type="button"
 onClick={() => toggleAmenity(amenity.id)}
 className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all space-y-3 ${
 isActive 
 ? 'bg-primary/10 border-primary text-white' 
 : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
 }`}
 >
 <amenity.icon className={`w-6 h-6 ${isActive ? 'text-primary-light' : 'opacity-40'}`} />
 <span className="text-[9px] font-black uppercase tracking-widest text-center">
 {amenity.label}
 </span>
 </button>
 );
 })}
 </div>
 );
}
