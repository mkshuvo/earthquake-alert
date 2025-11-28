import { io, Socket } from 'socket.io-client';
import { useEarthquakeStore, EarthquakeEvent } from '../store/earthquakeStore';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private serverUrl: string;

  constructor() {
    this.serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8080';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        timeout: 20000,
        forceNew: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to earthquake server');
        this.reconnectAttempts = 0;
        
        useEarthquakeStore.getState().updateServerStatus({
          isConnected: true,
          lastUpdate: new Date(),
        });

        // Subscribe to earthquake updates
        this.socket?.emit('subscribe-earthquakes');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        useEarthquakeStore.getState().updateServerStatus({
          isConnected: false,
        });
        useEarthquakeStore.getState().setError(`Connection failed: ${error.message}`);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('🔌 Disconnected from server:', reason);
        useEarthquakeStore.getState().updateServerStatus({
          isConnected: false,
        });

        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnect();
        }
      });

      this.socket.on('new-earthquake', (earthquake: EarthquakeEvent) => {
        console.log('🆕 New earthquake received:', earthquake);
        
        // Transform timestamp to Date object if it's a string
        if (typeof earthquake.timestamp === 'string') {
          earthquake.timestamp = new Date(earthquake.timestamp);
        }
        if (typeof earthquake.createdAt === 'string') {
          earthquake.createdAt = new Date(earthquake.createdAt);
        }
        if (typeof earthquake.updatedAt === 'string') {
          earthquake.updatedAt = new Date(earthquake.updatedAt);
        }

        useEarthquakeStore.getState().addEarthquake(earthquake);
        
        // Show notification for significant earthquakes
        if (earthquake.magnitude >= 5.0) {
          this.showNotification(earthquake);
        }
      });

      this.socket.on('server-status', (status: { isConnected: boolean; lastUpdate: string }) => {
        useEarthquakeStore.getState().updateServerStatus({
          isConnected: status.isConnected,
          lastUpdate: new Date(status.lastUpdate),
        });
      });

      this.socket.on('subscribed', (message: string) => {
        console.log('📺 Subscribed to earthquake updates:', message);
      });

      this.socket.on('error', (error: any) => {
        console.error('🚨 Socket error:', error);
        useEarthquakeStore.getState().setError(`Socket error: ${error.message || error}`);
      });

      // Set connection timeout
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      useEarthquakeStore.getState().setError('Unable to reconnect to server. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect();
          }
        });
      }
    }, this.reconnectInterval * this.reconnectAttempts);
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
    if (this.socket) {
      this.socket.emit('unsubscribe-earthquakes');
      this.socket.disconnect();
      this.socket = null;
      
      useEarthquakeStore.getState().updateServerStatus({
        isConnected: false,
      });
      
      console.log('🔌 Disconnected from earthquake server');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Manual trigger for testing
  triggerFetch(): void {
    if (this.socket?.connected) {
      this.socket.emit('trigger-fetch');
    }
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
