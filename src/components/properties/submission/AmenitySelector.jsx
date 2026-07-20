'use client';
import {
  Zap,
  Droplets,
  Wifi,
  Shield,
  Waves,
  Wind,
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
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {AMENITIES.map((amenity) => {
        const isActive = selected.includes(amenity.id);
        return (
          <button
            key={amenity.id}
            type="button"
            onClick={() => toggleAmenity(amenity.id)}
            className={`flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-xl border transition-all ${
              isActive
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <amenity.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-center">
              {amenity.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
