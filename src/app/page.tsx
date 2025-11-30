'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EarthquakeList from './components/EarthquakeList';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeStats from './components/EarthquakeStats';
import FilterPanel from './components/FilterPanel';
import ConnectionStatus from './components/ConnectionStatus';
import LatestNearMeBanner from './components/LatestNearMeBanner';
import RecentLocalEarthquakes from './components/RecentLocalEarthquakes';
import { useEarthquakeStore } from '../store/earthquakeStore';
import { useAppInitialization } from '../hooks/useAppInitialization';

// Truncate number to 1 decimal place (no rounding)
const truncateToOneDecimal = (num: number): number => {
  return Math.floor(num * 10) / 10;
};

const Home: React.FC = () => {
  const [isMapView, setIsMapView] = useState(true);
  const { isConnecting } = useAppInitialization();
  const { earthquakes, error: storeError } = useEarthquakeStore();
  const latestEarthquake = earthquakes.length > 0 ? earthquakes[0] : null;

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Connecting to Earthquake Alert System</h2>
          <p className="text-gray-400">Establishing real-time connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-blue-400">🌍 Earthquake Alert System</h1>
            <ConnectionStatus />
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/earthquakes"
              className="px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              📋 Earthquakes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {storeError && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-white">
            <h3 className="font-bold">Error</h3>
            <p>{storeError}</p>
          </div>
        )}
        
        <LatestNearMeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <EarthquakeStats />
            <FilterPanel />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <EarthquakeMap />
            <RecentLocalEarthquakes />
          </div>
        </div>

        {/* Debug Footer */}
        <div className="mt-8 p-4 bg-gray-800 rounded text-xs text-gray-400 font-mono">
          <p>Debug Info:</p>
          <p>API URL: {debugInfo.apiUrl}</p>
          <p>Earthquakes in Store: {debugInfo.count}</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
