'use client';
import React from 'react';
import { useFilteredEarthquakes, useFilters } from '../../store/earthquakeStore';

const RecentLocalEarthquakes: React.FC = () => {
  // Get top 5 earthquakes from the filtered list
  const earthquakes = useFilteredEarthquakes().slice(0, 5);
  const filters = useFilters();
  
  const title = filters.location 
    ? `📋 Latest 5 Earthquakes in ${filters.location}`
    : '📋 Latest 5 Earthquakes';

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-red-500';
    if (magnitude >= 5) return 'text-orange-500';
    if (magnitude >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (earthquakes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <p className="text-gray-400 text-center py-4">No recent earthquakes found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-700 text-gray-200 uppercase font-medium">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Magnitude</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 rounded-tr-lg">Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {earthquakes.map((eq) => (
              <tr key={eq.id} className="hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3">
                  <span className={`font-bold text-lg ${getMagnitudeColor(eq.magnitude)}`}>
                    {eq.magnitude.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {eq.location.place}
                </td>
                <td className="px-4 py-3">
                  {formatTime(eq.timestamp)}
                </td>
                <td className="px-4 py-3">
                  {eq.depth} km
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLocalEarthquakes;
