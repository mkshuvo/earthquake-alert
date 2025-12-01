'use client';
import React from 'react';
import { useFilteredEarthquakes, useFilters } from '../../store/earthquakeStore';
import { Clock, MapPin, Activity, ArrowDownToLine, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const RecentLocalEarthquakes: React.FC = () => {
  // Get top 5 earthquakes from the filtered list
  const earthquakes = useFilteredEarthquakes().slice(0, 5);
  const filters = useFilters();
  
  const title = filters.location 
    ? `Latest Earthquakes in ${filters.location}`
    : 'Latest Earthquakes';

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-red-400';
    if (magnitude >= 5) return 'text-orange-400';
    if (magnitude >= 3) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getMagnitudeBadgeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'bg-red-500/20 border-red-500/30';
    if (magnitude >= 5) return 'bg-orange-500/20 border-orange-500/30';
    if (magnitude >= 3) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-emerald-500/20 border-emerald-500/30';
  };

  if (earthquakes.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm p-8 mt-6 text-center">
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
        <p className="text-slate-400 text-sm">No recent earthquakes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white">{title}</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700">
          Last 5 Records
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider font-medium">
            <tr>
              <th className="px-4 py-3">Magnitude</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {earthquakes.map((eq) => (
              <tr key={eq.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className={clsx(
                    "inline-flex items-center justify-center px-2.5 py-1 rounded-md border font-bold text-sm",
                    getMagnitudeBadgeColor(eq.magnitude),
                    getMagnitudeColor(eq.magnitude)
                  )}>
                    {eq.magnitude.toFixed(1)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    <span className="text-slate-200 font-medium">{eq.location.place}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">
                  {new Date(eq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <span className="text-slate-600 ml-1 text-xs">
                    {new Date(eq.timestamp).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <ArrowDownToLine className="w-3 h-3" />
                    {eq.depth} km
                  </div>
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
