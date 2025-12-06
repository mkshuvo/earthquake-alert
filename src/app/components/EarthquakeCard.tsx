'use client';

import { EarthquakeEvent } from '../../store/earthquakeStore';
import { MapPin, Clock, Activity, AlertTriangle, Waves, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { truncateMagnitude } from '../../utils/format';

interface EarthquakeCardProps {
  earthquake: EarthquakeEvent;
  index: number;
  onSelect?: (earthquake: EarthquakeEvent) => void;
}

export const EarthquakeCard = ({ earthquake, index, onSelect }: EarthquakeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return 'from-red-500 to-red-700';
    if (mag >= 5.5) return 'from-orange-500 to-orange-700';
    if (mag >= 4) return 'from-yellow-500 to-yellow-700';
    if (mag >= 2.5) return 'from-blue-500 to-blue-700';
    return 'from-green-500 to-green-700';
  };

  const getMagnitudeTextColor = (mag: number) => {
    if (mag >= 7) return 'text-red-400';
    if (mag >= 5.5) return 'text-orange-400';
    if (mag >= 4) return 'text-yellow-400';
    if (mag >= 2.5) return 'text-blue-400';
    return 'text-green-400';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeAgo = (date: Date) => {
    const timestamp = new Date(date).getTime();
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isNew = (date: Date) => {
    const timestamp = new Date(date).getTime();
    return Date.now() - timestamp < 60 * 60 * 1000; // 1 hour
  };

  return (
    <div
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
      style={{
        animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(earthquake)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getMagnitudeColor(earthquake.magnitude)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />
      
      {/* New Badge */}
      {isNew(earthquake.timestamp) && (
        <div className="absolute top-0 right-0">
          <div className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-bl-xl border-l border-b border-cyan-500/20">
            NEW
          </div>
        </div>
      )}

      <div className="relative z-10 flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${getMagnitudeColor(earthquake.magnitude)} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          style={{
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{truncateMagnitude(earthquake.magnitude)}</div>
            <div className="text-xs text-white/80 uppercase">MAG</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {earthquake.location.place}
            </h3>
            {earthquake.tsunami === 1 && (
              <div className="flex-shrink-0 px-2 py-1 bg-red-500/20 rounded-full flex items-center gap-1">
                <Waves className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Tsunami</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="group-hover:text-cyan-400 transition-colors">{timeAgo(earthquake.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="group-hover:text-cyan-400 transition-colors">
                  {earthquake.depth.toFixed(1)}km depth
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className={`font-medium ${getMagnitudeTextColor(earthquake.magnitude)}`}>
                  Magnitude {truncateMagnitude(earthquake.magnitude)}
                </span>
              </div>
              {/* Assuming sig is not available in current model, skipping for now or adding logic if needed */}
              {earthquake.magnitude > 5.0 && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-medium">Significant</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-500">{formatDate(earthquake.timestamp)}</span>
              <a 
                href={earthquake.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                More Info <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
        style={{
          width: isHovered ? '100%' : '0%',
        }}
      />
    </div>
  );
};
