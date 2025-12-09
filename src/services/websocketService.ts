import { useEarthquakeStore, EarthquakeEvent } from '../store/earthquakeStore';
import apiService from './apiService';

class WebSocketService {
  private pollInterval: NodeJS.Timeout | null = null;
  private lastKnownEarthquakes: Set<string> = new Set();
  private isConnected = false;
   private userCountry: string | null = null;
  private notificationsEnabled = true;

  setUserCountry(country: string | null) {
    this.userCountry = country;
    if (country) {
      console.log(`📍 User country set to: ${country}`);
    } else {
      console.log('📍 User country cleared. Notifications disabled for local events.');
    }
  }

  setNotificationsEnabled(enabled: boolean) {
    this.notificationsEnabled = enabled;
    console.log(`🔔 Notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  connect(): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('🔌 Starting real-time earthquake polling...');
      
      // Load initial data
      try {
        const earthquakes = await apiService.getRecentEarthquakes(100);
        earthquakes.forEach(eq => this.lastKnownEarthquakes.add(eq.id));
        useEarthquakeStore.getState().setEarthquakes(earthquakes);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
      
      this.isConnected = true;
      useEarthquakeStore.getState().updateServerStatus({
        isConnected: true,
        lastUpdate: new Date(),
      });
      
      // Start polling for new earthquakes every 5 seconds
      this.pollInterval = setInterval(() => this.checkForNewEarthquakes(), 5000);
      console.log('✅ Connected and polling for earthquakes');
      resolve();
    });
  }

  private async checkForNewEarthquakes(): Promise<void> {
    try {
      const earthquakes = await apiService.getRecentEarthquakes(50);
      
      // Find new earthquakes
      for (const earthquake of earthquakes) {
        if (!this.lastKnownEarthquakes.has(earthquake.id)) {
          this.lastKnownEarthquakes.add(earthquake.id);
          
          // Add to store (which triggers UI update)
          useEarthquakeStore.getState().addEarthquake(earthquake);
          
          console.log('🆕 New earthquake detected:', earthquake.id);
          
          // Check criteria for notification
          const isSignificant = earthquake.magnitude >= 3.1;
          // Local threshold: Any event in user's country (High relevance)
          const isLocal = this.userCountry && earthquake.location.place.toLowerCase().includes(this.userCountry.toLowerCase());

          // Show notification for significant earthquakes or local ones
          if (isSignificant || isLocal) {
            this.showNotification(earthquake);
          }
        }
      }
      
      // Update server status
      useEarthquakeStore.getState().updateServerStatus({
        isConnected: true,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Polling error:', error);
      useEarthquakeStore.getState().updateServerStatus({
        isConnected: false,
      });
    }
  }

  private showNotification(earthquake: EarthquakeEvent): void {
    if (!this.notificationsEnabled) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Earthquake Alert - ${earthquake.magnitude}M`, {
        body: `${earthquake.location.place}\nDepth: ${earthquake.depth}km`,
        icon: '/earthquake-icon.png',
        tag: earthquake.id,
        requireInteraction: true,
      });
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    this.isConnected = false;
    useEarthquakeStore.getState().updateServerStatus({
      isConnected: false,
    });
    
    console.log('🔌 Disconnected from earthquake polling');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  testNotification(): void {
    const mockEarthquake: EarthquakeEvent = {
      id: `test-${Date.now()}`,
      magnitude: 7.5,
      location: {
        place: 'Test Location - Pacific Ocean',
        latitude: 0,
        longitude: 0
      },
      depth: 10,
      timestamp: new Date(),
      url: 'https://earthquake.usgs.gov',
      alert: null,
      tsunami: 1,
      processed: true,
      notificationSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.showNotification(mockEarthquake);
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
