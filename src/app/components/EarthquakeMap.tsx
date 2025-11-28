import React, { useState } from 'react';
import { useFilteredEarthquakes } from '../../store/earthquakeStore';

// This is a placeholder component for the map
// In a full implementation, you would use Leaflet or Mapbox
const EarthquakeMap: React.FC = () => {
  const earthquakes = useFilteredEarthquakes();
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'bg-red-500';
    if (magnitude >= 5) return 'bg-orange-500';
    if (magnitude >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMagnitudeSize = (magnitude: number) => {
    const size = Math.max(8, Math.min(32, magnitude * 4));
    return `w-${Math.round(size/4)*4} h-${Math.round(size/4)*4}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">🗺️ Earthquake Map</h2>
        <div className="text-sm text-gray-400">
          Showing {earthquakes.length} earthquakes
        </div>
      </div>
      
      {/* Map placeholder */}
      <div className="relative bg-gray-900 rounded-lg h-96 overflow-hidden border border-gray-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-lg font-medium">Interactive Map</p>
            <p className="text-sm">Map implementation coming soon</p>
            <p className="text-xs mt-2">Will integrate with Leaflet/Mapbox</p>
          </div>
        </div>
        
        {/* Earthquake markers simulation */}
        <div className="absolute inset-0 p-4">
          {earthquakes.slice(0, 20).map((earthquake, index) => (
            <div
              key={earthquake.id}
              className={`absolute rounded-full cursor-pointer opacity-75 hover:opacity-100 transition-opacity ${getMagnitudeColor(earthquake.magnitude)}`}
              style={{
                left: `${20 + (index % 10) * 8}%`,
                top: `${20 + Math.floor(index / 10) * 15}%`,
                width: `${Math.max(8, Math.min(24, earthquake.magnitude * 3))}px`,
                height: `${Math.max(8, Math.min(24, earthquake.magnitude * 3))}px`,
              }}
              onClick={() => setSelectedEarthquake(earthquake.id)}
              title={`${earthquake.magnitude}M - ${earthquake.location.place}`}
            />
          ))}
        </div>
      </div>
      
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
          onClick={() => console.log('Center map on latest earthquake')}
        >
          Center on Latest
        </button>
      </div>
      
      {/* Selected earthquake details */}
      {selectedEarthquake && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="font-medium text-white mb-2">Selected Earthquake</h3>
          {(() => {
            const earthquake = earthquakes.find(eq => eq.id === selectedEarthquake);
            if (!earthquake) return null;
            
            return (
              <div className="text-sm text-gray-300 space-y-1">
                <div><strong>Magnitude:</strong> {earthquake.magnitude}M</div>
                <div><strong>Location:</strong> {earthquake.location.place}</div>
                <div><strong>Depth:</strong> {earthquake.depth}km</div>
                <div><strong>Time:</strong> {new Date(earthquake.timestamp).toLocaleString()}</div>
                {earthquake.alert && (
                  <div><strong>Alert:</strong> <span className="text-yellow-400">{earthquake.alert}</span></div>
                )}
                <div className="mt-2">
                  <a
                    href={earthquake.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EarthquakeMap;
