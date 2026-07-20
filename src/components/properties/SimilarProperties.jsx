'use client';
import { useEffect, useState } from 'react';
import { usePropertyStore } from '@/stores/usePropertyStore';
import { PropertyCard } from './PropertyCard';

export function SimilarProperties({ city, propertyType, currentPropertyId }) {
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchSimilarProperties } = usePropertyStore();

  useEffect(() => {
    const loadSimilarProperties = async () => {
      setLoading(true);
      try {
        const filters = { city, type: propertyType, status: 'verified' };
        const properties = await fetchSimilarProperties(filters);
        const filtered = properties
          .filter((prop) => prop.id !== currentPropertyId)
          .slice(0, 3);
        setSimilarProperties(filtered);
      } catch {
        setSimilarProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (city && propertyType) {
      loadSimilarProperties();
    }
  }, [city, propertyType, currentPropertyId, fetchSimilarProperties]);

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-bold text-navy tracking-tight mb-5">
          Similar Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] bg-gray-200 rounded-2xl mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarProperties.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-navy tracking-tight mb-5">
        Similar Properties{city ? ` in ${city}` : ''}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
