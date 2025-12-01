import React, { useEffect, useState } from 'react';
import { useEarthquakeStats } from '../../store/earthquakeStore';
import apiService from '../../services/apiService';
import { Activity, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

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

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: {
    title: string;
    value: number | string;
    icon: any;
    colorClass: string;
    bgClass: string;
  }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm transition-all hover:border-slate-600">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <span className="text-slate-400 text-sm font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );

  if (isLoading && !serverStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-24 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <StatCard
        title="Total Earthquakes"
        value={serverStats?.total || clientStats.total}
        icon={Activity}
        colorClass="text-blue-400"
        bgClass="bg-blue-500/10"
      />
      
      <StatCard
        title="Last 24 Hours"
        value={serverStats?.last24Hours || clientStats.last24Hours}
        icon={Clock}
        colorClass="text-emerald-400"
        bgClass="bg-emerald-500/10"
      />
      
      <StatCard
        title="Significant (5.0+)"
        value={serverStats?.significantEarthquakes || clientStats.significant}
        icon={AlertTriangle}
        colorClass="text-amber-400"
        bgClass="bg-amber-500/10"
      />
      
      <StatCard
        title="Max Magnitude"
        value={`${clientStats.maxMagnitude.toFixed(1)}M`}
        icon={TrendingUp}
        colorClass="text-red-400"
        bgClass="bg-red-500/10"
      />
    </div>
  );
};

export default EarthquakeStats;
