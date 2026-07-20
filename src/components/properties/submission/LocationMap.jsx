'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Loader2 } from 'lucide-react';

// Create a custom premium marker icon using L.divIcon
const customMarkerIcon = new L.divIcon({
 html: `
 <div style="
 background-color: #00cf82; 
 width: 24px; 
 height: 24px; 
 border-radius: 50% 50% 50% 0;
 transform: rotate(-45deg);
 border: 2px solid white;
 box-shadow: 0 0 15px rgba(0, 207, 130, 0.5);
 display: flex;
 align-items: center;
 justify-content: center;
 ">
 <div style="
 width: 8px;
 height: 8px;
 background-color: white;
 border-radius: 50%;
 "></div>
 </div>
 `,
 className: '', // Removes default leaflet styling classes
 iconSize: [24, 24],
 iconAnchor: [12, 24],
});

// Component to handle clicks on the map
function MapClickHandler({ onLocationSelect }) {
 useMapEvents({
 click(e) {
 onLocationSelect({
 lat: e.latlng.lat,
 lng: e.latlng.lng,
 });
 },
 });
 return null;
}

// Component to fly map to new center
function MapFlyTo({ center }) {
 const map = useMap();
 useEffect(() => {
 if (center) {
 map.flyTo(center, 14, { duration: 1.5 });
 }
 }, [center, map]);
 return null;
}

export default function LocationMap({ position, onPositionChange }) {
 const [isMounted, setIsMounted] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [isSearching, setIsSearching] = useState(false);
 
 // Default to Douala, Cameroon if no position is provided
 const defaultCenter = [4.0511, 9.7085];
 
 const currentCenter = position && position.lat && position.lng 
 ? [parseFloat(position.lat), parseFloat(position.lng)] 
 : defaultCenter;

 const [mapCenter, setMapCenter] = useState(currentCenter);

 useEffect(() => {
 setIsMounted(true);
 }, []);

 const handleSearch = async (e) => {
 e.preventDefault();
 if (!searchQuery.trim()) return;

 setIsSearching(true);
 try {
 const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
 const data = await res.json();
 
 if (data && data.length > 0) {
 const newLat = parseFloat(data[0].lat);
 const newLng = parseFloat(data[0].lon);
 
 // Update map center to fly to location
 setMapCenter([newLat, newLng]);
 
 // Auto-pin the location and notify parent
 onPositionChange({
 lat: newLat,
 lng: newLng
 });
 }
 } catch (err) {
 console.error('Map search failed:', err);
 } finally {
 setIsSearching(false);
 }
 };

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl border border-gray-200 flex items-center justify-center">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 relative z-0 flex flex-col">
      {/* Search Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400]">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg py-2.5 pl-3.5 pr-9 text-xs font-bold text-gray-900 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-400 shadow-md"
            />
 {isSearching && (
 <Loader2 className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
 )}
 </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 flex-shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <MapContainer
        center={currentCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[300px] z-0 rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && position.lat && position.lng && (
          <Marker
            position={[parseFloat(position.lat), parseFloat(position.lng)]}
            icon={customMarkerIcon}
          />
        )}
        <MapClickHandler
          onLocationSelect={(pos) => {
            onPositionChange(pos);
            setMapCenter([pos.lat, pos.lng]);
          }}
        />
        <MapFlyTo center={mapCenter} />
      </MapContainer>
    </div>
  );
}
