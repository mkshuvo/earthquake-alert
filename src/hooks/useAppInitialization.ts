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
    
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // Request notification permission
        await webSocketService.requestNotificationPermission();
        
        // Load initial data first
        console.log('Loading initial earthquake data...');
        try {
          // Fetch global data instead of filtered data to ensure store has data for "Latest Near You"
          const earthquakes = await apiService.getRecentEarthquakes(100);
          setEarthquakes(earthquakes);
        } catch (error) {
          console.error('Failed to load initial data:', error);
          setError('Failed to load earthquake data');
        }
        
        // Connect to socket.io real-time updates (preferred)
        try {
          console.log('Connecting to socket.io realtime...');
          await realtimeService.connect();
        } catch (e) {
          console.warn('Realtime socket failed, falling back to polling');
          await webSocketService.connect();
        }
        
        setLoading(false);
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Failed to initialize application');
        setLoading(false);
        setIsConnecting(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      realtimeService.disconnect();
      webSocketService.disconnect();
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return { isConnecting };
};
