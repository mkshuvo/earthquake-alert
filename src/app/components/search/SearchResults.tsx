'use client';

import { EarthquakeEvent } from '../../../store/earthquakeStore';
import { EarthquakeCard } from '../EarthquakeCard';
import { AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: EarthquakeEvent[];
  isLoading: boolean;
  total: number;
}

export default function SearchResults({ results, isLoading, total }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No earthquakes found</p>
        <p className="text-sm opacity-70">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-slate-400 text-sm px-2">
        <span>Found {total} results</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {results.map((earthquake, index) => (
          <EarthquakeCard 
            key={earthquake.id} 
            earthquake={earthquake} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
