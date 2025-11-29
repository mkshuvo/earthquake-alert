import axios, { AxiosResponse } from 'axios';
import { EarthquakeEvent, EarthquakeFilters } from '../store/earthquakeStore';

const API_BASE_URL = '/api';
const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

if (typeof window !== 'undefined') {
  console.log('[ApiService] Initialized with API_BASE_URL:', API_BASE_URL);
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface EarthquakeStats {
  total: number;
  last24Hours: number;
  significantEarthquakes: number;
  lastFetchTime: string;
  connectedClients: number;
  mqttConnected: boolean;
}

interface HealthCheck {
  status: string;
  details: {
    database: string;
    rabbitmq: string;
    mqtt: string;
    lastFetch: string;
    connectedClients: number;
  };
}

class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  async getEarthquakes(filters?: Partial<EarthquakeFilters>): Promise<EarthquakeEvent[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.minMagnitude !== undefined) params.append('minMagnitude', filters.minMagnitude.toString());
      if (filters.maxMagnitude !== undefined) params.append('maxMagnitude', filters.maxMagnitude.toString());
      if (filters.location) params.append('location', filters.location);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
    }
    try {
      console.log(`[ApiService] Fetching from ${API_BASE_URL}/earthquakes`);
      const response: AxiosResponse<EarthquakeEvent[]> = await this.axiosInstance.get(
        `/earthquakes?${params.toString()}`
      );
      console.log(`[ApiService] Got ${response.data.length} earthquakes from API`);
      // Transform string dates to Date objects
      return response.data.map(earthquake => ({
        ...earthquake,
        timestamp: new Date(earthquake.timestamp),
        createdAt: new Date(earthquake.createdAt),
        updatedAt: new Date(earthquake.updatedAt),
      }));
    } catch (error: any) {
      console.error(`[ApiService] FAILED to fetch from ${API_BASE_URL}:`, error.message);
      throw error; // NO FALLBACK - fail hard so we know API is down
    }
  }

  private async getFromUSGS(): Promise<EarthquakeEvent[]> {
    try {
      const response = await axios.get(USGS_URL, { timeout: 10000 });
      const data = response.data;
      if (!data.features) return [];
      return data.features.map((feature: any) => ({
        id: feature.id,
        magnitude: feature.properties.mag || 0,
        location: {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          place: feature.properties.place || 'Unknown location',
        },
        depth: feature.geometry.coordinates[2] || 0,
        timestamp: new Date(feature.properties.time),
        url: feature.properties.url || '',
        alert: feature.properties.alert,
        tsunami: feature.properties.tsunami || 0,
      })).filter((eq: EarthquakeEvent) => eq.magnitude > 0);
    } catch (error) {
      console.error('Failed to fetch from USGS:', error);
      throw new Error('Unable to fetch earthquake data from any source');
    }
  }

  async getEarthquakeStatistics(): Promise<EarthquakeStats> {
    try {
      const response: AxiosResponse<EarthquakeStats> = await this.axiosInstance.get('/earthquakes/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch earthquake statistics:', error);
      throw new Error('Failed to fetch earthquake statistics');
    }
  }

  async getHealthCheck(): Promise<HealthCheck> {
    try {
      const response: AxiosResponse<HealthCheck> = await this.axiosInstance.get('/earthquakes/health');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      throw new Error('Failed to fetch health status');
    }
  }

  async triggerManualFetch(): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.axiosInstance.get('/earthquakes/fetch');
      return response.data;
    } catch (error) {
      console.error('Failed to trigger manual fetch:', error);
      throw new Error('Failed to trigger manual fetch');
    }
  }

  // Utility method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Method to get recent earthquakes for fallback when WebSocket is down
  async getRecentEarthquakes(limit: number = 50): Promise<EarthquakeEvent[]> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
      
      // Call getEarthquakes directly with filters to avoid infinite recursion
      const params = new URLSearchParams();
      params.append('startDate', startDate.toISOString());
      params.append('endDate', endDate.toISOString());
      params.append('limit', limit.toString());
      params.append('minMagnitude', '0');
      params.append('maxMagnitude', '10');
      
      try {
        console.log(`[ApiService] Fetching recent earthquakes from ${API_BASE_URL}`);
        const response: AxiosResponse<EarthquakeEvent[]> = await this.axiosInstance.get(
          `/earthquakes?${params.toString()}`
        );
        console.log(`[ApiService] Got ${response.data.length} recent earthquakes`);
        // Transform string dates to Date objects
        return response.data.map(earthquake => ({
          ...earthquake,
          timestamp: new Date(earthquake.timestamp),
          createdAt: new Date(earthquake.createdAt),
          updatedAt: new Date(earthquake.updatedAt),
        }));
      } catch (error: any) {
        console.error(`[ApiService] FAILED to fetch recent earthquakes from ${API_BASE_URL}:`, error.message);
        throw error; // NO FALLBACK - fail hard
      }
    } catch (error) {
      console.error('[ApiService] Failed to fetch recent earthquake data:', error);
      throw error;
    }
  }
}

// Singleton instance
const apiService = new ApiService();

export default apiService;
