'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ChevronRight,
  Building2,
  Trash2,
  Edit,
  Eye,
  Heart,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetPropertiesByLandlordQuery } from '@/store/services/propertyApi';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function LandlordPropertiesPage() {
  const user = useSelector(selectCurrentUser);
  const { data: propertiesData, isLoading } = useGetPropertiesByLandlordQuery(user?.uid, { skip: !user?.uid });

  const properties = (() => {
    if (!propertiesData) return [];
    const rawData = propertiesData.data;
    return Array.isArray(rawData) ? rawData : rawData?.data && Array.isArray(rawData.data) ? rawData.data : [];
  })();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-white/[0.04] rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Total', value: properties.length, icon: Building2 },
    { label: 'Verified', value: properties.filter((p) => p.status === 'verified').length, icon: Eye },
    { label: 'Rented/Sold', value: properties.filter((p) => !['available', 'verified'].includes(p.status)).length, icon: ChevronRight },
    { label: 'Total Views', value: properties.reduce((acc, p) => acc + (p.views_count || 0), 0), icon: Eye },
  ];

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Properties"
        title="My"
        highlight="Inventory."
        description="Manage your listed properties."
      >
        <Link
          href="/submit-property"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-bold tracking-wider transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Listing</span>
        </Link>
      </DashboardPageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.04] p-5 rounded-xl flex flex-col items-center text-center gap-2">
            <stat.icon className="w-4 h-4 text-primary opacity-50" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-16 text-center space-y-6">
          <div className="w-16 h-16 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7 text-white/20" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Listings Yet</h3>
            <p className="text-sm text-white/30 mt-1 max-w-sm mx-auto">Your portfolio is empty. Start listing your premium properties.</p>
          </div>
          <Link
            href="/submit-property"
            className="inline-flex bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider transition-all"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/[0.08] transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-60 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt=""
                  />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span
                      className={`text-[10px] font-bold tracking-wider ${
                        property.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-white/40 text-xs font-medium mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary flex-shrink-0" />
                          {(() => {
                            const loc = property.location;
                            if (!loc) return property.city || 'Cameroon';
                            if (typeof loc === 'object') {
                              const parts = [];
                              if (loc.quarter) parts.push(loc.quarter);
                              if (loc.city) parts.push(loc.city);
                              if (parts.length === 0 && loc.address) parts.push(loc.address);
                              return parts.join(', ') || 'Cameroon';
                            }
                            return loc;
                          })()}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-white">{formatPrice(property.price)}</p>
                        <p className="text-[10px] text-white/30 font-medium tracking-wider uppercase">{property.category}</p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-5 py-4 border-t border-white/[0.04] text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{property.specifications?.bedrooms || 0} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{property.specifications?.bathrooms || 0} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5" />
                        <span>{property.specifications?.area_sqm || 0} m&sup2;</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{property.views_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-medium">
                        <Heart className="w-3.5 h-3.5 text-red-400/40" />
                        <span>{property.likes_count || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2.5 bg-white/[0.04] rounded-xl text-white/30 hover:text-white transition-colors border border-white/[0.04]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white/[0.04] rounded-xl text-white/30 hover:text-red-400 transition-colors border border-white/[0.04]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/properties/${property.id}`}
                        className="bg-white/[0.06] hover:bg-primary text-white hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-wider transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
