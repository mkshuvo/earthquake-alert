import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { earthquakeState } from './atoms';

export const fetchEarthquakeData = async () => {
    try {
        const response = await fetch(
            'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.features.slice(0, 30);
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        return [];
    }
};

// export const useFetchAndSetEarthquakeData = () => {
//     const setEarthquakes = useSetRecoilState(earthquakeState);

//     return async () => {
//         const data = await fetchEarthquakeData();
//         setEarthquakes(data);
//     };
// };
