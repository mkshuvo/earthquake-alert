'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, List, Server, Database } from 'lucide-react';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeStats from './components/EarthquakeStats';
import FilterPanel from './components/FilterPanel';
import ConnectionStatus from './components/ConnectionStatus';
import LatestNearMeBanner from './components/LatestNearMeBanner';
import RecentLocalEarthquakes from './components/RecentLocalEarthquakes';
import { useEarthquakeStore } from '../store/earthquakeStore';
import { useAppInitialization } from '../hooks/useAppInitialization';
import clsx from 'clsx';

const Home: React.FC = () => {
  const { isConnecting } = useAppInitialization();
  const { earthquakes, error: storeError } = useEarthquakeStore();
  
  // Debug info
  const [debugInfo, setDebugInfo] = useState<{apiUrl: string, count: number}>({ apiUrl: '', count: 0 });

  useEffect(() => {
    setDebugInfo({
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'undefined',
      count: earthquakes.length
    });
  }, [earthquakes]);

  if (isConnecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing System</h2>
          <p className="text-slate-400">Connecting to global earthquake network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
                Earthquake Alert
              </h1>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <ConnectionStatus />
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/earthquakes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">All Earthquakes</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full space-y-6">
        {storeError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
            <div className="mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-red-400">System Error</h3>
              <p className="text-sm text-red-400/80 mt-1">{storeError}</p>
            </div>
          </div>
        )}
        
        <LatestNearMeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 h-fit lg:sticky lg:top-24">
            <EarthquakeStats />
            <FilterPanel />
            
            {/* Debug Info (Desktop) */}
            <div className="hidden lg:block p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Server className="w-3 h-3" />
                <span className="font-semibold uppercase tracking-wider">System Status</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>API Endpoint:</span>
                  <span className="text-slate-400 truncate max-w-[150px]" title={debugInfo.apiUrl}>
                    {debugInfo.apiUrl}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cached Events:</span>
                  <span className="text-slate-400">{debugInfo.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <EarthquakeMap />
            <RecentLocalEarthquakes />
          </div>
        </div>

        {/* Debug Info (Mobile) */}
        <div className="lg:hidden p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Database className="w-3 h-3" />
            <span className="font-semibold uppercase tracking-wider">Debug Data</span>
          </div>
          <p>API: {debugInfo.apiUrl}</p>
          <p>Events: {debugInfo.count}</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
