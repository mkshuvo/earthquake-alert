'use client';
import React, { useState } from 'react';
import { useFilteredEarthquakes, useIsLoading } from '../../store/earthquakeStore';
import { EarthquakeEvent } from '../../store/earthquakeStore';

// Truncate number to 1 decimal place (no rounding)
const truncateToOneDecimal = (num: number): number => {
  return Math.floor(num * 10) / 10;
};

const EarthquakeList: React.FC = () => {
  const earthquakes = useFilteredEarthquakes();
  const isLoading = useIsLoading();
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);

  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'bg-red-500';
    if (magnitude >= 5) return 'bg-orange-500';
    if (magnitude >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMagnitudeTextColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-red-400';
    if (magnitude >= 5) return 'text-orange-400';
    if (magnitude >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">📋 Recent Earthquakes</h2>
        <div className="text-sm text-gray-400 mt-2">
          {earthquakes.length} earthquake{earthquakes.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      <div className="p-6">
        {earthquakes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-medium text-white mb-2">No earthquakes found</h3>
            <p className="text-gray-400">Check back later for earthquake data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {earthquakes.map((earthquake) => (
              <div
                key={earthquake.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-4 h-4 rounded-full ${getMagnitudeColor(earthquake.magnitude)}`}></div>
                      <span className={`text-xl font-bold ${getMagnitudeTextColor(earthquake.magnitude)}`}>
                        {truncateToOneDecimal(earthquake.magnitude).toFixed(1)}M
                      </span>
                      {earthquake.alert && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                          {earthquake.alert.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-medium mb-1">
                      {earthquake.location.place}
                    </h3>
                    
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>📍 {earthquake.location.latitude.toFixed(3)}, {earthquake.location.longitude.toFixed(3)}</div>
                      <div>⬇️ Depth: {earthquake.depth}km</div>
                      <div>🕐 {formatTimestamp(earthquake.timestamp)}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <a
                      href={getGoogleMapsLink(earthquake.location.latitude, earthquake.location.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                    >
                      📍 Map
                    </a>
                    
                    <a
                      href={earthquake.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                    >
                      📊 Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthquakeList;
