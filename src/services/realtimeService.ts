import { io, Socket } from 'socket.io-client';
import { useEarthquakeStore, EarthquakeEvent } from '../store/earthquakeStore';

class RealtimeService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    // In the browser, we use relative paths to leverage Next.js proxy/rewrites
    // In other environments (SSR), we use the environment variable
    this.url = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_WEBSOCKET_URL || '').replace(/\/$/, '');
  }

  connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Preflight: attempt health check; skip socket if backend unreachable
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const healthUrl = this.url ? `${this.url}/api/earthquakes/health` : '/api/earthquakes/health';
          console.log(`🔍 Checking backend health at: ${healthUrl}`);
          const res = await fetch(healthUrl, { signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok) throw new Error(String(res.status));
          console.log('✅ Backend health check passed');
        } catch (e: any) {
          console.error('❌ Backend health check failed:', e.message);
          return reject(new Error('backend-unreachable'));
        }

        console.log(`🔌 Connecting to Socket.IO at: ${this.url || 'relative path'}`);
        this.socket = io(this.url, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          withCredentials: true,
        });

        // Connection timeout to prevent hanging
        const connectionTimeout = setTimeout(() => {
          if (this.socket && !this.socket.connected) {
            this.socket.disconnect();
            reject(new Error('Socket.IO connection timeout'));
          }
        }, 10000);

        this.socket.on('connect', () => {
          clearTimeout(connectionTimeout);
          console.log('✅ Socket.IO connected:', this.socket?.id);
          
          // Subscribe to earthquake updates
          this.socket?.emit('subscribe-earthquakes', {});
          
          useEarthquakeStore.getState().updateServerStatus({
            isConnected: true,
            socketConnected: true,
            lastUpdate: new Date(),
          });
          resolve();
        });

        this.socket.on('connect_error', (err) => {
          console.error('❌ Socket.IO connection error:', err);
          // Don't reject immediately on first error to allow reconnection attempts within timeout
        });

        this.socket.on('disconnect', (reason) => {
          console.warn('⚠️ Socket.IO disconnected:', reason);
          useEarthquakeStore.getState().updateServerStatus({ 
            isConnected: false,
            socketConnected: false 
          });
        });

        // Listen for 'new-earthquake' event (matching backend)
        this.socket.on('new-earthquake', (payload: EarthquakeEvent) => {
          console.log('⚡ Received realtime earthquake:', payload.id);
          this.addEvent(payload);
        });

        this.socket.on('earthquakes:bulk', (items: EarthquakeEvent[]) => {
          if (Array.isArray(items)) {
            const normalized = items.map(this.normalize);
            useEarthquakeStore.getState().setEarthquakes(normalized);
            useEarthquakeStore.getState().updateServerStatus({ lastUpdate: new Date() });
          }
        });

        // Fallback catch-all
        this.socket.on('message', (payload: any) => {
          if (payload && payload.id && payload.magnitude && payload.location) {
            this.addEvent(payload as EarthquakeEvent);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private normalize = (eq: EarthquakeEvent): EarthquakeEvent => ({
    ...eq,
    timestamp: new Date(eq.timestamp),
    createdAt: eq.createdAt ? new Date(eq.createdAt) : new Date(eq.timestamp),
    updatedAt: eq.updatedAt ? new Date(eq.updatedAt) : new Date(eq.timestamp),
  });

  private addEvent(eq: EarthquakeEvent) {
    const normalized = this.normalize(eq);
    useEarthquakeStore.getState().addEarthquake(normalized);
    useEarthquakeStore.getState().updateServerStatus({ lastUpdate: new Date() });
    if (normalized.magnitude >= 5.0 && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Earthquake Alert - ${normalized.magnitude}M`, {
        body: `${normalized.location.place}\nDepth: ${normalized.depth}km`,
        icon: '/earthquake-icon.png',
        tag: normalized.id,
        requireInteraction: true,
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const realtimeService = new RealtimeService();
export default realtimeService;
