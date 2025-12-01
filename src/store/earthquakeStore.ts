import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useMemo } from 'react';

export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  location: {
    latitude: number;
    longitude: number;
    place: string;
  };
  depth: number;
  timestamp: Date;
  url: string;
  alert: string | null;
  tsunami: number;
  processed: boolean;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EarthquakeFilters {
  minMagnitude: number;
  maxMagnitude: number;
  location: string;
  startDate: string;
  endDate: string;
  limit: number;
}

interface ServerStatus {
  isConnected: boolean;
  lastUpdate: Date | null;
  connectedClients: number;
  socketConnected?: boolean;
  mqttConnected?: boolean;
  lastRealtimeUpdate?: Date | null;
}

interface EarthquakeStore {
  earthquakes: EarthquakeEvent[];
  serverStatus: ServerStatus;
  filters: EarthquakeFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEarthquakes: (earthquakes: EarthquakeEvent[]) => void;
  addEarthquake: (earthquake: EarthquakeEvent) => void;
  updateServerStatus: (status: Partial<ServerStatus>) => void;
  setFilters: (filters: Partial<EarthquakeFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEarthquakes: () => void;
}

const defaultFilters: EarthquakeFilters = {
  minMagnitude: 0,
  maxMagnitude: 10,
  location: '',
  startDate: '',
  endDate: '',
  limit: 100,
};

const defaultServerStatus: ServerStatus = {
  isConnected: false,
  lastUpdate: null,
  connectedClients: 0,
};

export const useEarthquakeStore = create<EarthquakeStore>()(
  subscribeWithSelector((set, get) => ({
    earthquakes: [],
    serverStatus: defaultServerStatus,
    filters: defaultFilters,
    isLoading: false,
    error: null,

    setEarthquakes: (earthquakes) => {
      // Deduplicate incoming earthquakes based on ID
      const uniqueEarthquakes = Array.from(
        new Map(earthquakes.map(eq => [eq.id, eq])).values()
      );
      set({ earthquakes: uniqueEarthquakes, error: null });
    },

    addEarthquake: (earthquake) =>
      set((state) => {
        const index = state.earthquakes.findIndex(eq => eq.id === earthquake.id);
        
        let newEarthquakes;
        if (index !== -1) {
             newEarthquakes = [...state.earthquakes];
             newEarthquakes[index] = earthquake;
        } else {
             newEarthquakes = [earthquake, ...state.earthquakes];
        }
        
        // Sort and slice
        newEarthquakes = newEarthquakes
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 1000); // Keep only latest 1000 earthquakes

        return { earthquakes: newEarthquakes };
      }),

    updateServerStatus: (status) =>
      set((state) => ({
        serverStatus: { ...state.serverStatus, ...status },
      })),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    clearEarthquakes: () => set({ earthquakes: [] }),
  }))
);

// Selector hooks for performance optimization
export const useEarthquakes = () => useEarthquakeStore((state) => state.earthquakes);
export const useServerStatus = () => useEarthquakeStore((state) => state.serverStatus);
export const useFilters = () => useEarthquakeStore((state) => state.filters);
export const useIsLoading = () => useEarthquakeStore((state) => state.isLoading);
export const useError = () => useEarthquakeStore((state) => state.error);

// Filtered earthquakes selector
export const useFilteredEarthquakes = () => {
  const earthquakes = useEarthquakeStore((state) => state.earthquakes);
  const filters = useEarthquakeStore((state) => state.filters);
  
  return useMemo(() => {
    return earthquakes.filter((earthquake) => {
      if (earthquake.magnitude < filters.minMagnitude) return false;
      if (earthquake.magnitude > filters.maxMagnitude) return false;
      if (filters.location && !earthquake.location.place.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (new Date(earthquake.timestamp) < startDate) return false;
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        if (new Date(earthquake.timestamp) > endDate) return false;
      }
      
      return true;
    }).slice(0, filters.limit);
  }, [earthquakes, filters]);
};

// Statistics selector
export const useEarthquakeStats = () => {
  const earthquakes = useEarthquakeStore((state) => state.earthquakes);
  
  // Use useMemo to prevent recalculation on every render
  return useMemo(() => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: earthquakes.length,
      last24Hours: earthquakes.filter(eq => new Date(eq.timestamp) >= last24Hours).length,
      lastWeek: earthquakes.filter(eq => new Date(eq.timestamp) >= lastWeek).length,
      significant: earthquakes.filter(eq => eq.magnitude >= 5.0).length,
      highAlert: earthquakes.filter(eq => eq.magnitude >= 7.0).length,
      averageMagnitude: earthquakes.length > 0 
        ? earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / earthquakes.length 
        : 0,
    };
  }, [earthquakes]);
};

// Utility: compute nearest earthquake to a given lat/lng
export const getNearestEarthquake = (
  lat: number,
  lng: number,
  earthquakes: EarthquakeEvent[]
) => {
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

  if (earthquakes.length === 0) return null;
  const withDistance = earthquakes.map((eq) => ({
    eq,
    km: haversineKm(lat, lng, eq.location.latitude, eq.location.longitude),
  }));
  const nearest = withDistance.sort((a, b) => a.km - b.km)[0];
  return nearest?.eq || null;
};
