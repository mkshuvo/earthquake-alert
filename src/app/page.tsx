// src/app/page.tsx
import React from 'react';
import DateFilter from './components/DateFilter';
import MagnitudeFilter from './components/MagnitudeFilter';
import LocationFilter from './components/LocationFilter';
import EarthquakeList from './components/EarthquakeList';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Earthquake Alerts</h1>

      <div className="flex flex-wrap">
        <div className="w-full md:w-1/4">
          <DateFilter />
          <MagnitudeFilter />
          <LocationFilter />
        </div>
        <div className="w-full md:w-3/4">
            <EarthquakeList />
        </div>
      </div>
    </div>
  );
};

export default Home;
