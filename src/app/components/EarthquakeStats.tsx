import React, { useEffect, useState } from 'react';
import { useEarthquakeStats } from '../../store/earthquakeStore';
import apiService from '../../services/apiService';

// Truncate number to 1 decimal place (no rounding)
const truncateToOneDecimal = (num: number): number => {
  return Math.floor(num * 10) / 10;
};

interface ServerStats {
  total: number;
  last24Hours: number;
  significantEarthquakes: number;
  lastFetchTime: string;
  connectedClients: number;
  mqttConnected: boolean;
}

const EarthquakeStats: React.FC = () => {
  const clientStats = useEarthquakeStats();
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServerStats = async () => {
      setIsLoading(true);
      try {
        const stats = await apiService.getEarthquakeStatistics();
        setServerStats(stats);
      } catch (error) {
        console.error('Failed to fetch server statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerStats();
    
    // Refresh stats every 60 seconds
    const interval = setInterval(fetchServerStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, color = 'text-blue-400' }: {
    title: string;
    value: number | string;
    icon: string;
    color?: string;
  }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );

  if (isLoading && !serverStats) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">📊 Statistics</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white">📊 Statistics</h3>
      
      <div className="space-y-3">
        <StatCard
          title="Total Earthquakes"
          value={serverStats?.total || clientStats.total}
          icon="🌍"
          color="text-blue-400"
        />
        
        <StatCard
          title="Last 24 Hours"
          value={serverStats?.last24Hours || clientStats.last24Hours}
          icon="🕐"
          color="text-green-400"
        />
        
        <StatCard
          title="Significant (5.0+)"
          value={serverStats?.significantEarthquakes || clientStats.significant}
          icon="⚠️"
          color="text-yellow-400"
        />
        
        <StatCard
          title="High Alert (7.0+)"
          value={clientStats.highAlert}
          icon="🚨"
          color="text-red-400"
        />

        <StatCard
          title="Average Magnitude"
          value={truncateToOneDecimal(clientStats.averageMagnitude).toFixed(1)}
          icon="📏"
          color="text-purple-400"
        />
        
        {serverStats && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Connected Clients:</span>
                <span className="text-blue-400">{serverStats.connectedClients}</span>
              </div>
              <div className="flex justify-between">
                <span>MQTT Status:</span>
                <span className={serverStats.mqttConnected ? 'text-green-400' : 'text-red-400'}>
                  {serverStats.mqttConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Fetch:</span>
                <span className="text-gray-300">
                  {new Date(serverStats.lastFetchTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthquakeStats;
