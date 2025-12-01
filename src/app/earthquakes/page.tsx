'use client';

import { useEffect, useState } from 'react';
import { Activity, Map as MapIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAppInitialization } from '../../hooks/useAppInitialization';
import { useFilteredEarthquakes, useEarthquakeStore, EarthquakeEvent } from '../../store/earthquakeStore';
import ParallaxBackground from '../components/ParallaxBackground';
import FilterPanel from '../components/FilterPanel';
import { EarthquakeCard } from '../components/EarthquakeCard';
import { EarthquakeDetails } from '../components/EarthquakeDetails';
import ConnectionStatus from '../components/ConnectionStatus';
import dynamic from 'next/dynamic';

// Dynamically import Map component to avoid SSR issues with Leaflet
const EarthquakeMap = dynamic(() => import('../components/EarthquakeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <MapIcon className="w-8 h-8" />
        <span className="text-sm">Loading Map...</span>
      </div>
    </div>
  ),
});

export default function EarthquakesPage() {
  const { isConnecting } = useAppInitialization();
  const filteredEarthquakes = useFilteredEarthquakes();
  const { earthquakes, isLoading } = useEarthquakeStore();
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeEvent | null>(null);

  if (isConnecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden text-white">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Earthquakes</h2>
          <p className="text-slate-400">Connecting to global network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 relative flex flex-col">
      <ParallaxBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-800 hidden sm:block" />
              <h1 className="text-lg font-bold text-white hidden sm:block">
                Global Earthquake Map
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)]">
        {/* Sidebar List */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4 h-full overflow-hidden">
          <FilterPanel />
          
          <div className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="font-bold text-white">Recent Events</h2>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                {filteredEarthquakes.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isLoading && earthquakes.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-700/30 rounded-xl animate-pulse" />
                ))
              ) : filteredEarthquakes.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No earthquakes match your filters
                </div>
              ) : (
                filteredEarthquakes.map((earthquake, index) => (
                  <EarthquakeCard
                    key={earthquake.id}
                    earthquake={earthquake}
                    index={index}
                    onSelect={setSelectedEarthquake}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden min-h-[400px] relative">
           <EarthquakeMap />
           {/* Overlay gradient for better integration */}
           <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] z-[400]" />
        </div>
      </main>

      {selectedEarthquake && (
        <EarthquakeDetails
          earthquake={selectedEarthquake}
          onClose={() => setSelectedEarthquake(null)}
        />
      )}
    </div>
  );
}
