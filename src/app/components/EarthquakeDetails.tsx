'use client';

import { EarthquakeEvent } from '../../store/earthquakeStore';
import { X, MapPin, Clock, Activity, Layers, TrendingUp, ExternalLink, AlertCircle, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EarthquakeDetailsProps {
  earthquake: EarthquakeEvent;
  onClose: () => void;
}

export const EarthquakeDetails = ({ earthquake, onClose }: EarthquakeDetailsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return 'red';
    if (mag >= 5.5) return 'orange';
    if (mag >= 4) return 'yellow';
    if (mag >= 2.5) return 'blue';
    return 'green';
  };

  const color = getMagnitudeColor(earthquake.magnitude);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200 flex items-center justify-center group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className={`relative h-48 bg-gradient-to-br from-${color}-500 to-${color}-700 rounded-t-2xl overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
            <div className="text-6xl font-bold mb-2">{earthquake.magnitude.toFixed(2)}</div>
            <div className="text-xl font-medium uppercase tracking-wider">Magnitude</div>
            {earthquake.tsunami === 1 && (
               <div className="mt-2 px-3 py-1 bg-red-500/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                 <Waves className="w-4 h-4 text-white" />
                 Tsunami Warning
               </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{earthquake.location.place}</h2>
            <p className="text-slate-400">Event ID: {earthquake.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              icon={Clock}
              label="Occurred"
              value={formatDate(earthquake.timestamp)}
              color={color}
            />
            <DetailItem
              icon={MapPin}
              label="Coordinates"
              value={`${earthquake.location.latitude.toFixed(4)}°, ${earthquake.location.longitude.toFixed(4)}°`}
              color={color}
            />
            <DetailItem
              icon={Layers}
              label="Depth"
              value={`${earthquake.depth.toFixed(2)} km`}
              color={color}
            />
            {/*
            <DetailItem
              icon={TrendingUp}
              label="Significance"
              value={properties.sig.toString()}
              color={color}
            />
            */}
          </div>

          <div className="flex gap-3">
            <a
              href={earthquake.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 px-4 py-3 bg-${color}-500 hover:bg-${color}-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105`}
            >
              <ExternalLink className="w-4 h-4" />
              View on USGS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}

const DetailItem = ({ icon: Icon, label, value, color }: DetailItemProps) => (
  <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
    <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <div className="min-w-0">
      <div className="text-slate-400 text-sm mb-1">{label}</div>
      <div className="text-white font-medium break-words">{value}</div>
    </div>
  </div>
);
