'use client';
import React, { useEffect } from 'react';
import EarthquakeList from './components/EarthquakeList';
import {RecoilRoot} from "recoil";
import {useFetchAndSetEarthquakeData} from "@/app/components/earthquakeData/api";

const Home: React.FC = () => {
    const fetchAndSetEarthquakeData = useFetchAndSetEarthquakeData();

    useEffect(() => {
        fetchAndSetEarthquakeData();
    }, [fetchAndSetEarthquakeData]);
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
