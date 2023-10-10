'use client';
import React, { useEffect } from 'react';
import EarthquakeList from './components/EarthquakeList';
import {RecoilRoot} from "recoil";

const Home: React.FC = () => {
  return (
    <div>
      <h2 className="text-8xl text-center text- font-semibold mb-4">Earthquakes</h2>
      <div className="flex flex-wrap">
          <RecoilRoot>
              <EarthquakeList />
          </RecoilRoot>

      </div>
    </div>
  );
};

export default Home;
