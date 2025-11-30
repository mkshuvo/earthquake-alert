'use client';
import React, { useEffect, useState } from 'react';
import { useEarthquakes } from '../../store/earthquakeStore';

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

const truncateToOneDecimal = (num: number): number => Math.floor(num * 10) / 10;

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

    // compute nearest; prefer most recent among those within 500km, else nearest overall
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
    let pick: typeof withDistance[number] | null = null;
    if (nearby.length > 0) {
      pick = nearby.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    } else {
      pick = withDistance.sort((a, b) => a.km - b.km)[0] || null;
    }
    setNearest(pick);
  }, [userLoc, earthquakes]);

  if (!nearest) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg border border-blue-500 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">📍</div>
          <div>
            <h2 className="text-xl font-bold text-white">Latest Near You</h2>
            <p className="text-blue-100">{nearest.place}</p>
            <p className="text-sm text-blue-200">
              {nearest.timestamp.toLocaleString()} • {nearest.km.toFixed(0)} km away
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-yellow-300">
            {truncateToOneDecimal(nearest.magnitude).toFixed(1)}M
          </div>
          <p className="text-blue-100">Depth: {nearest.depth}km</p>
        </div>
      </div>
      <div className="mt-2 text-right">
        <a
          href={nearest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200 hover:text-white underline text-sm"
        >
          View details
        </a>
      </div>
    </div>
  );
};

export default LatestNearMeBanner;
