'use client';

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, AlertTriangle, Layers, Waves, RefreshCw } from 'lucide-react';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { useEarthquakeStore, useFilteredEarthquakes, useEarthquakeStats, EarthquakeEvent } from '../store/earthquakeStore';
import ParallaxBackground from './components/ParallaxBackground';
import StatCard from './components/StatCard';
import FilterPanel from './components/FilterPanel';
import { EarthquakeCard } from './components/EarthquakeCard';
import { EarthquakeDetails } from './components/EarthquakeDetails';

export default function Home() {
  const { isConnecting } = useAppInitialization();
  const filteredEarthquakes = useFilteredEarthquakes();
  const stats = useEarthquakeStats();
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
          <h2 className="text-2xl font-bold text-white mb-2">Initializing System</h2>
          <p className="text-slate-400">Connecting to global earthquake network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 relative">
      <ParallaxBackground />

      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Earthquake Monitor
                </h1>
                <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">
                  Real-time Global Detection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Live Stream Active</span>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={Activity}
            color="blue"
            delay={0}
          />
          <StatCard
            title="Significant"
            value={stats.significant}
            icon={AlertTriangle}
            color="orange"
            delay={100}
          />
          <StatCard
            title="Max Magnitude"
            value={stats.maxMagnitude.toFixed(1)}
            icon={TrendingUp}
            color="red"
            delay={200}
          />
          <StatCard
            title="Avg Depth"
            value={`${stats.avgDepth.toFixed(1)}km`}
            icon={Layers}
            color="purple"
            delay={300}
          />
          <StatCard
            title="Tsunami Warnings"
            value={stats.tsunamiCount}
            icon={Waves}
            color="cyan"
            delay={400}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterPanel />
              
              <div className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Real-time Alerts</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Get instant notifications for significant seismic activities worldwide.
                  </p>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                    Enable Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Recent Earthquakes
                <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-400 font-normal">
                  {filteredEarthquakes.length} events
                </span>
              </h2>
            </div>

            {isLoading && earthquakes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEarthquakes.map((earthquake, index) => (
                  <EarthquakeCard
                    key={earthquake.id}
                    earthquake={earthquake}
                    index={index}
                    onSelect={setSelectedEarthquake}
                  />
                ))}
              </div>
            )}
          </div>
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
