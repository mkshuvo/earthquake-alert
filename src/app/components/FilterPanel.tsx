import React, { useState } from 'react';
import { useFilters, useEarthquakeStore } from '../../store/earthquakeStore';
import { Filter, ChevronDown, ChevronUp, MapPin, Calendar, Activity } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const filters = useFilters();
  const { setFilters } = useEarthquakeStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-600">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 text-slate-200">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          {/* Magnitude Range */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <Activity className="w-3 h-3" />
              Magnitude Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min</label>
                <input
                  type="number"
                  value={filters.minMagnitude}
                  onChange={(e) => handleFilterChange('minMagnitude', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Max</label>
                <input
                  type="number"
                  value={filters.maxMagnitude}
                  onChange={(e) => handleFilterChange('maxMagnitude', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
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
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          {/* Date Range - Optional if implemented in store */}
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
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500/50"
                />
                <input 
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500/50"
                />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
