'use client'
// Import React and Tailwind CSS
import React, { useState, useEffect } from 'react';
import GoogleLocation from './GoogleLocation';

// Define an interface for the earthquake data
interface Earthquake {
  properties: {
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
  id: string;
}

const EarthquakeList: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

  useEffect(() => {
    const fetchEarthquakeData = () => {
      fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
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

  const getColorIndicator = (magnitude: number) => {
    if (magnitude >= 0 && magnitude < 3) {
      return 'bg-green-500';
    } else if (magnitude >= 3 && magnitude < 5) {
      return 'bg-blue-500';
    } else if (magnitude >= 5 && magnitude < 7) {
      return 'bg-orange-500';
    } else if (magnitude >= 7 && magnitude <= 9) {
      return 'bg-red-800';
    }
    return ''; // Default color or no color
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {earthquakes.map((earthquake, index) => (
          <div key={index} className="relative bg-white rounded-md overflow-hidden shadow-md">
            {/* Color Indicator Sidebar */}
            <div
              className={`absolute top-0 bottom-0 left-0 ${
                getColorIndicator(earthquake.properties.mag)
              } w-3`}
            ></div>
            <div className="p-6">
              <h1 className="text-2xl mb-2">
                <p>Magnitude:</p> <strong className="text-3xl">{earthquake.properties.mag}</strong>
              </h1>
              <h3 className="text-xl font-semibold text-gray-800">{earthquake.properties.place}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Date and Time:</strong>{' '}
                {new Date(earthquake.properties.time).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Coordinates:</strong> Latitude: {earthquake.geometry.coordinates[1]}, Longitude:{' '}
                {earthquake.geometry.coordinates[0]}, Altitude: {earthquake.geometry.coordinates[2]} km
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Location Name:</strong>{' '}
                <GoogleLocation lat={earthquake.geometry.coordinates[1]} long={earthquake.geometry.coordinates[0]} />
              </p>
              <p className="text-gray-600">
                <strong>Google Maps:</strong>{' '}
                <a
                  href={getGoogleMapsLink(
                    earthquake.geometry.coordinates[1],
                    earthquake.geometry.coordinates[0]
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarthquakeList;

