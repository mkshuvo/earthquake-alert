'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useFilteredEarthquakes, EarthquakeEvent } from '../../store/earthquakeStore';
import { Map, Maximize, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { truncateMagnitude } from '../../utils/format';

interface EarthquakeMapProps {
  earthquakes?: EarthquakeEvent[];
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ earthquakes: propEarthquakes }) => {
  const storeEarthquakes = useFilteredEarthquakes();
  const earthquakes = propEarthquakes || storeEarthquakes;
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return '#EF4444'; // red-500
    if (magnitude >= 5) return '#F97316'; // orange-500
    if (magnitude >= 3) return '#EAB308'; // yellow-500
    return '#10B981'; // emerald-500
  };

  // Get user location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log('[Map] User location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('[Map] Failed to get user location:', error.message);
        }
      );
    }
  }, []);

  // Initialize map ONCE
  useEffect(() => {
    if (!mapRef.current || (window as any).mapInitialized) return;

    // Dynamically load Leaflet from CDN if not present
    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    } else {
      initializeMap();
    }
    
    (window as any).mapInitialized = true;
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        (window as any).mapInitialized = false;
      }
    };
  }, []);

  // Update markers when earthquakes change
  useEffect(() => {
    updateMarkers();
  }, [earthquakes]);

  // Update map view when user location is found (only once if needed, or add button to center)
  useEffect(() => {
    if (userLocation && mapInstanceRef.current) {
      const L = (window as any).L;
      // Add or update user location marker
      // For now, just adding it to the map directly or a separate layer
      // We can keep it simple
    }
  }, [userLocation]);

  const initializeMap = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    // Default center
    const center: [number, number] = userLocation 
      ? [userLocation.lat, userLocation.lng] 
      : [20, 0];

    const map = L.map(mapRef.current).setView(center, userLocation ? 6 : 2);

    // Use CartoDB Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Create layer group for markers
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    
    // Initial markers update
    updateMarkers();
  };

  const updateMarkers = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Add user location marker if available
    if (userLocation) {
       const userMarker = L.circleMarker(
        [userLocation.lat, userLocation.lng],
        {
          radius: 8,
          fillColor: '#3B82F6',
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }
      );
      userMarker.bindPopup('<div class="text-slate-900 text-sm font-sans"><strong>Your Location</strong></div>');
      markersLayerRef.current.addLayer(userMarker);
    }

    earthquakes.forEach((earthquake) => {
      const color = getMagnitudeColor(earthquake.magnitude);

      // Ripple effect
      const ripple = L.circle(
        [earthquake.location.latitude, earthquake.location.longitude],
        {
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          radius: Math.pow(10, earthquake.magnitude) * 1000,
          weight: 1,
        }
      );
      markersLayerRef.current.addLayer(ripple);

      // Marker
      const marker = L.circleMarker(
        [earthquake.location.latitude, earthquake.location.longitude],
        {
          radius: 8,
          fillColor: color,
          color: '#1e293b',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }
      );

      marker.bindPopup(`
        <div class="text-slate-900 font-sans min-w-[150px]">
          <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <strong class="text-lg" style="color: ${color}">${truncateMagnitude(earthquake.magnitude)}M</strong>
            <span class="text-xs text-slate-500">${earthquake.depth}km depth</span>
          </div>
          <div class="text-sm font-medium text-slate-700 mb-1">${earthquake.location.place}</div>
          <div class="text-xs text-slate-500">
            ${new Date(earthquake.timestamp).toLocaleString()}
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedEarthquake(earthquake.id);
      });
      
      markersLayerRef.current.addLayer(marker);
    });
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white">Earthquake Map</h2>
        </div>
        <div className="text-sm text-slate-400 font-medium">
          Showing {earthquakes.length} earthquakes
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="relative h-[500px] w-full bg-slate-900">
        <div
          ref={mapRef}
          className="absolute inset-0 z-0"
        />
        
        {/* Custom Map Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] flex items-end justify-between pointer-events-none">
          {/* Legend */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-3 pointer-events-auto shadow-xl">
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Magnitude</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-emerald-500/20"></div>
                <span className="text-xs text-slate-300 font-medium">0-3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full ring-2 ring-yellow-500/20"></div>
                <span className="text-xs text-slate-300 font-medium">3-5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-orange-500/20"></div>
                <span className="text-xs text-slate-300 font-medium">5-7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-red-500/20"></div>
                <span className="text-xs text-slate-300 font-medium">7+</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pointer-events-auto">
             <button
              onClick={() => {
                if (userLocation && mapInstanceRef.current) {
                  mapInstanceRef.current.setView(
                    [userLocation.lat, userLocation.lng],
                    8
                  );
                }
              }}
              className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:bg-slate-800 text-blue-400 rounded-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userLocation}
              title="Go to my location"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                 if (earthquakes.length > 0 && mapInstanceRef.current) {
                  const latest = earthquakes[0];
                  mapInstanceRef.current.setView(
                    [latest.location.latitude, latest.location.longitude],
                    6
                  );
                }
              }}
              className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg shadow-xl transition-all"
              title="Center on latest earthquake"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeMap;
