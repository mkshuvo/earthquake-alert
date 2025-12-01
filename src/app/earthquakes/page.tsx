'use client';
import React from 'react';
import Link from 'next/link';
import { List, Map as MapIcon, Activity } from 'lucide-react';
import EarthquakeList from '../components/EarthquakeList';
import ConnectionStatus from '../components/ConnectionStatus';
import { useAppInitialization } from '../../hooks/useAppInitialization';

const EarthquakesPage: React.FC = () => {
  const { isConnecting } = useAppInitialization();

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
          <h2 className="text-2xl font-bold text-white mb-2">Loading Earthquakes</h2>
          <p className="text-slate-400">Connecting to data source...</p>
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
                <List className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
                Earthquake List
              </h1>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <ConnectionStatus />
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full">
        <EarthquakeList />
      </main>
    </div>
  );
};

export default EarthquakesPage;
