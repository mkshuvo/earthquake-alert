import { useEffect, useState } from 'react';
import { useEarthquakeStore } from '../store/earthquakeStore';
import webSocketService from '../services/websocketService';
import apiService from '../services/apiService';
import realtimeService from '../services/realtimeService';

export const useAppInitialization = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const { setEarthquakes, setError, setLoading } = useEarthquakeStore();

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;
    let isMounted = true;
    
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // Load initial data first
        console.log('Loading initial earthquake data...');
        try {
          // Fetch global data instead of filtered data to ensure store has data for "Latest Near You"
          const earthquakes = await apiService.getRecentEarthquakes(100);
          if (isMounted) {
            setEarthquakes(earthquakes);
          }
        } catch (error) {
          console.error('Failed to load initial data:', error);
          if (isMounted) {
            setError('Failed to load earthquake data');
          }
        }
        
        // Connect to socket.io real-time updates in background (non-blocking)
        realtimeService.connect().catch((e) => {
          console.warn('Realtime socket failed, falling back to polling:', e);
          webSocketService.connect();
        });
        
        if (isMounted) {
          setLoading(false);
          setIsConnecting(false);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        if (isMounted) {
          setError('Failed to initialize application');
          setLoading(false);
          setIsConnecting(false);
        }
      }
    };

    // Safety timeout: ensure loading screen is dismissed even if network stalls
    timeoutHandle = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setIsConnecting(false);
      }
    }, 3000);

    initializeApp();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      realtimeService.disconnect();
      webSocketService.disconnect();
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return { isConnecting };
};
