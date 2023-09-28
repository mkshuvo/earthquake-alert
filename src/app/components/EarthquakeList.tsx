'use client'
import React, { useState, useEffect } from 'react';
import GoogleLocation from './GoogleLocation';

// Define an interface for the earthquake data
interface Earthquake {
    properties: {
        mag: number;
        place: string;
        time: number;
        updated: number;
        tz: string | null;
        url: string;
        detail: string;
        felt: number | null;
        cdi: number | null;
        mmi: number | null;
        alert: string | null;
        status: string;
        tsunami: number;
        sig: number;
        net: string;
        code: string;
        ids: string;
        sources: string;
        types: string;
        nst: number | null;
        dmin: number | null;
        rms: number;
        gap: number | null;
        magType: string;
        type: string;
        title: string;
    };
    geometry: {
        type: string;
        coordinates: [number,number,number];
    };
    id: string;
}
// interface Coordinates{
//     lat: number,
//     long: number, 
//     alt: number
// }


const EarthquakeList: React.FC = () => {
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

useEffect(() => {
  const fetchEarthquakeData = () => {
    fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
      // 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEarthquakes(data.features.slice(0, 10));
      })
      .catch((error) => {
        console.error('Error fetching earthquake data:', error);
      });
  };

  fetchEarthquakeData();
}, []);

  
    const getGoogleMapsLink = (lat: number, long: number) => {
      return `https://www.google.com/maps?q=${lat},${long}`;
    };

      
  
    return (
      <div>
        <h2>Earthquake List</h2>
        <ul>
          {earthquakes.map((earthquake, index) => (
            <li key={index}>
              <strong>Magnitude:</strong> {earthquake.properties.mag}<br />
              <strong>Date and Time:</strong> {new Date(earthquake.properties.time).toLocaleString()}<br />
              <strong>Coordinates:</strong> 
              Latitude: {earthquake.geometry.coordinates[1]}, 
              Longitude: {earthquake.geometry.coordinates[0]}, 
              Altitude: {earthquake.geometry.coordinates[2]} km<br />
              <strong>Location Name:</strong> 
              <span id={`location-name-${index}`}>
              <GoogleLocation lat={earthquake.geometry.coordinates[1]} long={earthquake.geometry.coordinates[0]} />
              </span>
              <br />
              <strong>Google Maps:</strong> 
              <a
                href={getGoogleMapsLink(
                  earthquake.geometry.coordinates[1],
                  earthquake.geometry.coordinates[0]
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default EarthquakeList;
