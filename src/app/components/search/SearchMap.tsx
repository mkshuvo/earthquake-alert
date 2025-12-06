'use client';

import React from 'react';
import EarthquakeMap from '../EarthquakeMap';
import { EarthquakeEvent } from '../../../store/earthquakeStore';

interface SearchMapProps {
  results: EarthquakeEvent[];
}

export default function SearchMap({ results }: SearchMapProps) {
  return (
    <div className="h-[600px] rounded-xl overflow-hidden border border-slate-700/50 shadow-xl relative">
      <EarthquakeMap earthquakes={results} />
    </div>
  );
}
