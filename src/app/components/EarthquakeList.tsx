'use client';
import React, { useState } from 'react';
import { useFilteredEarthquakes, useIsLoading } from '../../store/earthquakeStore';
import { Waves, Clock, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

// Truncate number to 1 decimal place (no rounding)
const truncateToOneDecimal = (num: number): number => {
  return Math.floor(num * 10) / 10;
};

const getMagnitudeColorClass = (magnitude: number) => {
  if (magnitude >= 7) return 'text-red-500 bg-red-500/10 border-red-500/20';
  if (magnitude >= 5) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  if (magnitude >= 3) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
};

const EarthquakeList: React.FC = () => {
  const earthquakes = useFilteredEarthquakes();
  const isLoading = useIsLoading();
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-700/50 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Waves className="w-5 h-5 text-blue-400" />
          Recent Activity
        </h2>
        <div className="text-sm text-slate-400 mt-1">
          {earthquakes.length} events detected
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {earthquakes.length === 0 ? (
          <div className="text-center py-12">
            <Waves className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No earthquakes found</h3>
            <p className="text-slate-500 text-sm">Adjust filters to see more data.</p>
          </div>
        ) : (
          earthquakes.map((eq) => (
            <div 
              key={eq.id}
              className="group bg-slate-900/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 p-3 rounded-xl transition-all cursor-pointer relative overflow-hidden"
              onClick={() => window.open(eq.url, '_blank')}
            >
              <div className="flex justify-between items-start gap-3 relative z-10">
                <div className={clsx(
                  "flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-lg border",
                  getMagnitudeColorClass(eq.magnitude)
                )}>
                  <span className="text-lg font-bold leading-none">{truncateToOneDecimal(eq.magnitude).toFixed(1)}</span>
                  <span className="text-[10px] opacity-75 mt-1">MAG</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                      {eq.location.place}
                    </h4>
                    {eq.alert && (
                      <span className={clsx(
                        "px-1.5 py-0.5 text-[10px] uppercase font-bold rounded border",
                        eq.alert === 'red' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        eq.alert === 'orange' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        eq.alert === 'yellow' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      )}>
                        {eq.alert}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Waves className="w-3 h-3" />
                      <span>{eq.depth}km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(eq.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EarthquakeList;
