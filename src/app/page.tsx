// src/app/page.tsx
import React from 'react';
import EarthquakeList from './components/EarthquakeList';

const Home: React.FC = () => {
  return (
    <div>
      <h2 className="text-8xl text-center text- font-semibold mb-4">Earthquakes</h2>
      <div className="flex flex-wrap">

          <EarthquakeList />

      </div>
    </div>
  );
};

export default Home;
