'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Heart,
  Sparkles,
  Key,
  Calendar,
} from 'lucide-react';
import { useGetPropertyByIdQuery } from '@/store/services/propertyApi';
import { useState } from 'react';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertyInfo } from '@/components/properties/PropertyInfo';
import { PropertyActionSidebar } from '@/components/properties/PropertyActionSidebar';
import { VisitScheduleModal } from '@/components/properties/VisitScheduleModal';
import { CreateBookingModal } from '@/components/properties/CreateBookingModal';
import { SimilarProperties } from '@/components/properties/SimilarProperties';
import { MOCK_PROPERTIES } from '@/data/mockProperties';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { data: realProperty, isLoading } = useGetPropertyByIdQuery(id);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const propertyData = realProperty?.data || realProperty;
  const property = propertyData || MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse" />
          <Sparkles className="w-8 h-8 text-primary-light animate-spin-slow" />
        </div>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em] mt-6 animate-pulse">
          Loading
        </p>
      </div>
    );
  }

  const backLink = property?.category === 'for-sale' ? '/buy' : '/rent';
  const isRent = property?.category === 'for-rent';

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="main-container h-14 md:h-16 flex items-center justify-between">
          <Link
            href={backLink}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all group"
          >
            <div className="p-1.5 bg-gray-100 border border-gray-200 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">
              Back
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-all text-gray-400 hover:text-gray-700">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="pt-0">
        <div className="main-container">
          <PropertyGallery property={property} />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mt-6 md:mt-10">
        <div className="main-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 lg:gap-14">
            <div className="lg:col-span-8 space-y-8 md:space-y-10">
              <PropertyInfo property={property} />

              <SimilarProperties
                city={typeof property.location === 'object' ? property.location?.city : property.location}
                propertyType={property.type}
                currentPropertyId={property.id}
              />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20">
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

      {/* Mobile sticky bottom CTA bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              {isRent ? 'Monthly' : 'Price'}
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {property?.price?.toLocaleString()} FCFA{isRent ? '/mo' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsVisitModalOpen(true)}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-700 px-3.5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visit</span>
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-primary-dark transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isRent ? 'Rent' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>

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
