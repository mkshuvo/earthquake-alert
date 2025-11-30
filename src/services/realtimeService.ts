import { io, Socket } from 'socket.io-client';
import { useEarthquakeStore, EarthquakeEvent } from '../store/earthquakeStore';

class RealtimeService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    const base = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '';
    this.url = base.replace(/\/$/, '');
  }

  connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Preflight: attempt health check; skip socket if backend unreachable
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const res = await fetch(`${this.url}/api/earthquakes/health`, { signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok) throw new Error(String(res.status));
        } catch {
          return reject(new Error('backend-unreachable'));
        }

        this.socket = io(this.url, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        this.socket.on('connect', () => {
          useEarthquakeStore.getState().updateServerStatus({
            isConnected: true,
            lastUpdate: new Date(),
            // socketConnected flag will be merged by store extension
          });
          resolve();
        });

        this.socket.on('disconnect', () => {
          useEarthquakeStore.getState().updateServerStatus({ isConnected: false });
        });

        // Common event names; adjust if backend differs
        this.socket.on('earthquake:new', (payload: EarthquakeEvent) => {
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
