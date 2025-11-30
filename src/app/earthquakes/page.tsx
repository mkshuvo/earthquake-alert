'use client';
import React from 'react';
import Link from 'next/link';
import EarthquakeList from '../components/EarthquakeList';
import ConnectionStatus from '../components/ConnectionStatus';
import { useAppInitialization } from '../../hooks/useAppInitialization';

const EarthquakesPage: React.FC = () => {
  const { isConnecting } = useAppInitialization();

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Loading Earthquakes</h2>
          <p className="text-gray-400">Connecting to data source...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-400">📋 Earthquakes</h1>
            <ConnectionStatus />
          </div>
          <Link 
            href="/"
            className="px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            🌍 Map View
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <EarthquakeList />
      </main>
    </div>
  );
};

export default EarthquakesPage;
