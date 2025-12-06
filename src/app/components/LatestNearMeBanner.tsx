'use client';
import React, { useEffect, useState } from 'react';
import { useEarthquakes } from '../../store/earthquakeStore';
import { MapPin, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { truncateMagnitude } from '../../utils/format';

const toRad = (v: number) => (v * Math.PI) / 180;
const haversineKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const LatestNearMeBanner: React.FC = () => {
  const earthquakes = useEarthquakes();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [nearest, setNearest] = useState<{
    id: string;
    place: string;
    km: number;
    magnitude: number;
    depth: number;
    timestamp: Date;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setUserLoc(null)
      );
    }
  }, []);

  useEffect(() => {
    if (!userLoc || earthquakes.length === 0) return;

    const withDistance = earthquakes.map((eq) => ({
      id: eq.id,
      place: eq.location.place,
      km: haversineKm(userLoc.lat, userLoc.lng, eq.location.latitude, eq.location.longitude),
      magnitude: eq.magnitude,
      depth: eq.depth,
      timestamp: new Date(eq.timestamp),
      url: eq.url,
    }));

    const nearby = withDistance.filter((x) => x.km <= 500);
    let pick = nearby.length > 0 
      ? nearby.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
      : withDistance.sort((a, b) => a.km - b.km)[0] || null;
      
    setNearest(pick);
  }, [userLoc, earthquakes]);

  if (!nearest) return null;

  return (
    <div className="mb-6 relative overflow-hidden rounded-xl border border-blue-500/30 group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <MapPin className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Latest Near You
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/20 font-medium">
                {nearest.km.toFixed(0)} km away
              </span>
            </h2>
            <p className="text-blue-100 mt-1 text-lg">{nearest.place}</p>
            <p className="text-sm text-blue-300 mt-1">
              {nearest.timestamp.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div>
            <div className={clsx(
              "text-4xl font-bold mb-1",
              nearest.magnitude >= 5 ? "text-amber-400" : "text-emerald-400"
            )}>
              {truncateMagnitude(nearest.magnitude)}M
            </div>
            <p className="text-blue-200 text-sm">Depth: {nearest.depth}km</p>
          </div>
          
          <a
            href={nearest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 group-hover:border-white/20"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LatestNearMeBanner;
