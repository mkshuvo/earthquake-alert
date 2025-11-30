'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useFilteredEarthquakes } from '../../store/earthquakeStore';

const EarthquakeMap: React.FC = () => {
  const earthquakes = useFilteredEarthquakes();
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return '#DC2626';
    if (magnitude >= 5) return '#EA580C';
    if (magnitude >= 3) return '#EAB308';
    return '#16A34A';
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

  // Initialize map when earthquakes or user location changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically load Leaflet from CDN
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
  }, [earthquakes, userLocation]);

  const initializeMap = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Destroy existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Center on user location if available, otherwise on first earthquake or world
    let center: [number, number];
    if (userLocation) {
      center = [userLocation.lat, userLocation.lng];
    } else if (earthquakes.length > 0) {
      center = [earthquakes[0].location.latitude, earthquakes[0].location.longitude];
    } else {
      center = [20, 0];
    }

    const map = L.map(mapRef.current).setView(center, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

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
      ).addTo(map);
      userMarker.bindPopup('<div class="text-sm"><strong>Your Location</strong></div>');
    }

    // Add earthquake markers
    earthquakes.forEach((earthquake) => {
      const color = getMagnitudeColor(earthquake.magnitude);

      // Create circle ripple effect
      L.circle(
        [earthquake.location.latitude, earthquake.location.longitude],
        {
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          radius: Math.pow(10, earthquake.magnitude) * 1000,
          weight: 2,
        }
      ).addTo(map);

      // Create marker
      const marker = L.circleMarker(
        [earthquake.location.latitude, earthquake.location.longitude],
        {
          radius: 15,
          fillColor: color,
          color: 'white',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
        }
      ).addTo(map);

      // Add popup
      marker.bindPopup(`
        <div class="text-sm">
          <strong>${earthquake.magnitude}M</strong><br/>
          ${earthquake.location.place}<br/>
          Depth: ${earthquake.depth}km<br/>
          ${new Date(earthquake.timestamp).toLocaleString()}
        </div>
      `);

      marker.on('click', () => {
        setSelectedEarthquake(earthquake.id);
      });
    });

    mapInstanceRef.current = map;
  };

  const selectedEarthquakeData = earthquakes.find(eq => eq.id === selectedEarthquake);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">🗺️ Earthquake Map</h2>
        <div className="text-sm text-gray-400">
          Showing {earthquakes.length} earthquakes
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div
        ref={mapRef}
        className="relative bg-gray-900 rounded-lg h-96 border border-gray-600 mb-4"
        style={{ minHeight: '400px' }}
      />

      {/* Map Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">Magnitude:</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-400">0-3</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-400">3-5</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-400">5-7</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-400">7+</span>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
          onClick={() => {
            if (userLocation && mapInstanceRef.current) {
              mapInstanceRef.current.setView(
                [userLocation.lat, userLocation.lng],
                10
              );
            } else if (earthquakes.length > 0 && mapInstanceRef.current) {
              const latest = earthquakes[0];
              mapInstanceRef.current.setView(
                [latest.location.latitude, latest.location.longitude],
                8
              );
            }
          }}
        >
          {userLocation ? 'Center on Me' : 'Center on Latest'}
        </button>
      </div>

      {/* Selected earthquake details */}
      {selectedEarthquakeData && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="font-medium text-white mb-2">Selected Earthquake</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div><strong>Magnitude:</strong> {selectedEarthquakeData.magnitude}M</div>
            <div><strong>Location:</strong> {selectedEarthquakeData.location.place}</div>
            <div><strong>Depth:</strong> {selectedEarthquakeData.depth}km</div>
            <div><strong>Time:</strong> {new Date(selectedEarthquakeData.timestamp).toLocaleString()}</div>
            {selectedEarthquakeData.alert && (
              <div><strong>Alert:</strong> <span className="text-yellow-400">{selectedEarthquakeData.alert}</span></div>
            )}
            <div className="mt-2">
              <a
                href={selectedEarthquakeData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthquakeMap;
