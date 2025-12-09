'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Calendar, SlidersHorizontal, ArrowDownUp, Filter } from 'lucide-react';
import { SearchQueryParams } from '../../../services/apiService';
import { truncateMagnitude } from '../../../utils/format';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(true);

  const [filters, setFilters] = useState<Partial<SearchQueryParams>>({
    q: searchParams.get('q') || '',
    minMagnitude: searchParams.get('minMagnitude') ? Number(searchParams.get('minMagnitude')) : 0,
    maxMagnitude: searchParams.get('maxMagnitude') ? Number(searchParams.get('maxMagnitude')) : 10,
    minDepth: searchParams.get('minDepth') ? Number(searchParams.get('minDepth')) : undefined,
    maxDepth: searchParams.get('maxDepth') ? Number(searchParams.get('maxDepth')) : undefined,
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortBy: (searchParams.get('sortBy') as any) || 'time',
    order: (searchParams.get('order') as any) || 'desc',
  });

  // Update local state when URL params change (e.g. back button)
  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      minMagnitude: searchParams.get('minMagnitude') ? Number(searchParams.get('minMagnitude')) : 0,
      maxMagnitude: searchParams.get('maxMagnitude') ? Number(searchParams.get('maxMagnitude')) : 10,
      minDepth: searchParams.get('minDepth') ? Number(searchParams.get('minDepth')) : undefined,
      maxDepth: searchParams.get('maxDepth') ? Number(searchParams.get('maxDepth')) : undefined,
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      sortBy: (searchParams.get('sortBy') as any) || 'time',
      order: (searchParams.get('order') as any) || 'desc',
    });
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.minMagnitude !== undefined && filters.minMagnitude > 0) params.set('minMagnitude', filters.minMagnitude.toString());
    if (filters.maxMagnitude !== undefined && filters.maxMagnitude < 10) params.set('maxMagnitude', filters.maxMagnitude.toString());
    if (filters.minDepth !== undefined) params.set('minDepth', filters.minDepth.toString());
    if (filters.maxDepth !== undefined) params.set('maxDepth', filters.maxDepth.toString());
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.order) params.set('order', filters.order);
    
    // Reset to page 1 on filter change
    params.set('page', '1');

    router.push(`/earthquakes/search?${params.toString()}`);
  };

  const handleChange = (key: keyof SearchQueryParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold">Search & Filter</span>
        </div>
        <Filter className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 space-y-6 border-t border-slate-700/50">
          
          {/* Keyword Search */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => handleChange('q', e.target.value)}
                placeholder="Search location, e.g., 'Japan'"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
            </div>
          </div>

          {/* Magnitude Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Magnitude: {truncateMagnitude(filters.minMagnitude || 0)} - {truncateMagnitude(filters.maxMagnitude || 10)}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Min</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minMagnitude}
                  onChange={(e) => handleChange('minMagnitude', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Max</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.maxMagnitude}
                  onChange={(e) => handleChange('maxMagnitude', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Depth Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Depth (km)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Min Depth</label>
                <input
                  type="number"
                  min="0"
                  value={filters.minDepth || ''}
                  onChange={(e) => handleChange('minDepth', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Any"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Max Depth</label>
                <input
                  type="number"
                  min="0"
                  value={filters.maxDepth || ''}
                  onChange={(e) => handleChange('maxDepth', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Any"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm"
                />
              </div>
            </div>
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
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <ArrowDownUp className="w-3 h-3" />
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="time">Time</option>
                <option value="magnitude">Magnitude</option>
                <option value="depth">Depth</option>
              </select>
              <select
                value={filters.order}
                onChange={(e) => handleChange('order', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-cyan-500/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
