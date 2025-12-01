'use client';

import { Filter, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useEarthquakeStore, useFilters } from '../../store/earthquakeStore';

export default function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const filters = useFilters();
  const setFilters = useEarthquakeStore((state) => state.setFilters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const limits = [10, 25, 50, 100, 250, 500];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold">Filters & Sorting</span>
        </div>
        <Filter className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[800px]' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 space-y-6 border-t border-slate-700/50">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Magnitude Range: {filters.minMagnitude.toFixed(1)} - {filters.maxMagnitude.toFixed(1)}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Minimum</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minMagnitude}
                  onChange={(e) => handleFilterChange('minMagnitude', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Maximum</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.maxMagnitude}
                  onChange={(e) => handleFilterChange('maxMagnitude', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Location Search */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <MapPin className="w-3 h-3" />
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Search places..."
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
             <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              Date Range
            </label>
             <div className="grid grid-cols-2 gap-3">
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
                />
                <input 
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Results Limit</label>
            <div className="grid grid-cols-3 gap-2">
              {limits.map((limit) => (
                <button
                  key={limit}
                  onClick={() => handleFilterChange('limit', limit)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filters.limit === limit
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
