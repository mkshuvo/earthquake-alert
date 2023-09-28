// GoogleLocation.tsx

import React, { useState, useEffect } from 'react';

interface GoogleLocationProps {
  lat: number;
  long: number;
}

const GoogleLocation: React.FC<GoogleLocationProps> = ({ lat, long }) => {
  const [location, setLocation] = useState<string>('Location not found');
  const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const reverseGeocode = async () => {
      const cacheKey: string = `${lat},${long}`;

      // Check if the location details are cached
      if (locationCache[cacheKey]) {
        setLocation(locationCache[cacheKey]);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAEHRs0j7bVP7__SmyGZvkZh4SiqKVjRH0`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location details');
        }

        const data = await response.json();
        console.log(data?.results[0].formatted_address);
        const locationName = data?.results[0]?.formatted_address || "Location Not Found";

        // Cache the location details to avoid duplicate requests
        setLocationCache((prevCache) => ({ ...prevCache, [cacheKey]: locationName }));
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };

    reverseGeocode();
  },  [lat, long, locationCache]);

  return <span>{location}</span>;
};

export default GoogleLocation;
