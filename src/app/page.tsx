'use client';
import React, { useEffect, useState } from 'react';
import EarthquakeList from './components/EarthquakeList';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeStats from './components/EarthquakeStats';
import FilterPanel from './components/FilterPanel';
import ConnectionStatus from './components/ConnectionStatus';
import { useEarthquakeStore } from '../store/earthquakeStore';
import webSocketService from '../services/websocketService';
import apiService from '../services/apiService';

const Home: React.FC = () => {
  const [isMapView, setIsMapView] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const { setEarthquakes, setError, setLoading, earthquakes } = useEarthquakeStore();
  const latestEarthquake = earthquakes.length > 0 ? earthquakes[0] : null;

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;
    
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // Request notification permission
        await webSocketService.requestNotificationPermission();
        
        // Load initial data first
        console.log('Loading initial earthquake data...');
        await loadInitialData();
        
        // Connect to WebSocket for real-time updates
        console.log('Connecting to real-time WebSocket...');
        await webSocketService.connect();
        
        setLoading(false);
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Failed to initialize application');
        setLoading(false);
        setIsConnecting(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const loadInitialData = async () => {
    try {
      const earthquakes = await apiService.getRecentEarthquakes(100);
      setEarthquakes(earthquakes);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load earthquake data');
    }
  };

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
            <button
              onClick={() => setIsMapView(!isMapView)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMapView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isMapView ? '📋 List View' : '🗺️ Map View'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Latest Earthquake Banner */}
        {latestEarthquake && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg border border-blue-500 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">📍</div>
                <div>
                  <h2 className="text-xl font-bold text-white">Latest Earthquake</h2>
                  <p className="text-blue-100">{latestEarthquake.location.place}</p>
                  <p className="text-sm text-blue-200">{new Date(latestEarthquake.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-yellow-300">{latestEarthquake.magnitude}M</div>
                <p className="text-blue-100">Depth: {latestEarthquake.depth}km</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <EarthquakeStats />
            <FilterPanel />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {isMapView ? (
              <EarthquakeMap />
            ) : (
              <EarthquakeList />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
