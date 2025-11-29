import { useEarthquakeStore, EarthquakeEvent } from '../store/earthquakeStore';
import apiService from './apiService';

class WebSocketService {
  private pollInterval: NodeJS.Timeout | null = null;
  private lastKnownEarthquakes: Set<string> = new Set();
  private isConnected = false;

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
          
          // Show notification for significant earthquakes
          if (earthquake.magnitude >= 5.0) {
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
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
