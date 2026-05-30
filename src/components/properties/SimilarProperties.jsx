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
 const filters = {
 city: city,
 type: propertyType,
 status: 'verified'
 };
 const properties = await fetchSimilarProperties(filters);
 // Filter out current property and limit to 3
 const filtered = properties
 .filter(prop => prop.id !== currentPropertyId)
 .slice(0, 3);
 setSimilarProperties(filtered);
 } catch (error) {
 console.error('Error loading similar properties:', error);
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
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <h3 className="text-xl font-semibold text-gray-900 mb-6">
 Similar Properties
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[1, 2, 3].map(i => (
 <div key={i} className="animate-pulse">
 <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
 </div>
 ))}
 </div>
 </div>
 );
 }

 if (similarProperties.length === 0) {
 return null;
 }

 return (
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <h3 className="text-xl font-semibold text-gray-900 mb-6">
 Similar Properties in {city}
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {similarProperties.map((property) => (
 <PropertyCard key={property.id} property={property} />
 ))}
 </div>
 </div>
 );
}