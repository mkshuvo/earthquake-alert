'use client';

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, AlertTriangle, Layers, Waves, RefreshCw, Search, Bell, BellRing, BellOff, MapPin, Loader2 } from 'lucide-react';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { useEarthquakeStore, useFilteredEarthquakes, useEarthquakeStats, EarthquakeEvent } from '../store/earthquakeStore';
import webSocketService from '../services/websocketService';
import ParallaxBackground from './components/ParallaxBackground';
import StatCard from './components/StatCard';
import FilterPanel from './components/FilterPanel';
import LatestNearMeBanner from './components/LatestNearMeBanner';
import { EarthquakeCard } from './components/EarthquakeCard';
import { EarthquakeDetails } from './components/EarthquakeDetails';
import ConnectionStatus from './components/ConnectionStatus';
import Link from 'next/link';
import { truncateMagnitude } from '../utils/format';

export default function Home() {
  const { isConnecting } = useAppInitialization();
  const filteredEarthquakes = useFilteredEarthquakes();
  const stats = useEarthquakeStats();
  const { earthquakes, isLoading } = useEarthquakeStore();
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeEvent | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [notificationState, setNotificationState] = useState<{
    permission: NotificationPermission | 'default';
    country: string | null;
  }>({ permission: 'default', country: null });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const storedCountry = localStorage.getItem('userCountry');
      // Use a more specific key to avoid collisions with other localhost apps
      const isExplicitlyDisabled = localStorage.getItem('earthquake_notifications_disabled') === 'true';
      
      console.log('🔔 [Init] Notification Status:', { 
        browserPermission: Notification.permission, 
        isExplicitlyDisabled,
        storedCountry 
      });

      // If permission is granted but user explicitly disabled in app, treat as default for UI
      // This allows users to "unsubscribe" even if browser permission remains granted
      const effectivePermission = isExplicitlyDisabled ? 'default' : Notification.permission;

      webSocketService.setNotificationsEnabled(!isExplicitlyDisabled);

      if (storedCountry && !isExplicitlyDisabled) {
        webSocketService.setUserCountry(storedCountry);
      }
      
      setNotificationState({
        permission: effectivePermission,
        country: isExplicitlyDisabled ? null : storedCountry
      });
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }

    setIsSubscribing(true);
    localStorage.removeItem('earthquake_notifications_disabled');
    webSocketService.setNotificationsEnabled(true);

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Get Location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Using OpenStreetMap Nominatim for reverse geocoding
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for fetch

              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`,
                { 
                  headers: { 'User-Agent': 'EarthquakeAlertApp/1.0' },
                  signal: controller.signal
                }
              );
              clearTimeout(timeoutId);
              
              if (!response.ok) throw new Error('Location service failed');
              
              const data = await response.json();
              const country = data.address?.country;
              
              if (country) {
                webSocketService.setUserCountry(country);
                localStorage.setItem('userCountry', country);
                setNotificationState({ permission: 'granted', country });
              } else {
                 setNotificationState({ permission: 'granted', country: null });
              }
            } catch (error) {
              console.error('Location detection failed:', error);
              // Fallback to global notifications if location fails
              setNotificationState({ permission: 'granted', country: null });
              alert('Could not detect location automatically. Subscribed to global alerts only.');
            } finally {
              setIsSubscribing(false);
            }
          }, (error) => {
            console.error('Geolocation error:', error);
            setNotificationState({ permission: 'granted', country: null });
            // Only alert if it's a genuine error, not if user denied location (code 1)
            if (error.code !== 1) {
                alert('Location access unavailable. Subscribed to global alerts only.');
            } else {
                alert('Location access denied. Subscribed to global alerts only.');
            }
            setIsSubscribing(false);
          }, {
            timeout: 10000, // 10 second timeout for geolocation
            enableHighAccuracy: false
          });
        } else {
          setNotificationState({ permission: 'granted', country: null });
          alert('Geolocation not supported. Subscribed to global alerts only.');
          setIsSubscribing(false);
        }
      } else {
        setNotificationState(prev => ({ ...prev, permission }));
        if (permission === 'denied') {
          alert('Notifications are blocked. Please enable them in your browser settings.');
        }
        setIsSubscribing(false);
      }
    } catch (error) {
      console.error('Notification request error:', error);
      setIsSubscribing(false);
    }
  };

  const handleDisableNotifications = () => {
    webSocketService.setUserCountry(null);
    webSocketService.setNotificationsEnabled(false);
    localStorage.removeItem('userCountry');
    localStorage.setItem('earthquake_notifications_disabled', 'true');
    console.log('🔔 [Action] Notifications disabled by user');
    // We can't revoke permission programmatically, but we can stop tracking the country
    // and treating it as 'default' state for our app logic effectively disabling personalized alerts
    setNotificationState({ permission: 'default', country: null });
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden text-white">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing System</h2>
          <p className="text-slate-400">Connecting to global earthquake network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 relative">
      <ParallaxBackground />

      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Earthquake Monitor
                </h1>
                <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">
                  Real-time Global Detection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus />
              
              <Link 
                href="/earthquakes/search"
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Advanced Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <button 
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={Activity}
            color="blue"
            delay={0}
          />
          <StatCard
            title="Significant"
            value={stats.significant}
            icon={AlertTriangle}
            color="orange"
            delay={100}
          />
          <StatCard
            title="Max Magnitude"
            value={truncateMagnitude(stats.maxMagnitude)}
            icon={TrendingUp}
            color="red"
            delay={200}
          />
          <StatCard
            title="Avg Depth"
            value={`${stats.avgDepth.toFixed(1)}km`}
            icon={Layers}
            color="purple"
            delay={300}
          />
          <StatCard
            title="Tsunami Warnings"
            value={stats.tsunamiCount}
            icon={Waves}
            color="cyan"
            delay={400}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterPanel />
              
              <div className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Real-time Alerts</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    {notificationState.permission === 'granted'
                      ? notificationState.country
                        ? `You are subscribed to alerts for ${notificationState.country} and major global events.`
                        : "You are subscribed to major global earthquake alerts."
                      : "Get instant notifications for earthquakes in your country and significant worldwide events."
                    }
                  </p>
                  
                  {notificationState.permission === 'granted' ? (
                    <div className="space-y-3">
                      {notificationState.country && (
                        <div className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                          <BellRing className="w-4 h-4" />
                          Monitoring {notificationState.country}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => webSocketService.testNotification()}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Bell className="w-4 h-4" />
                        Test Notification
                      </button>

                      <button 
                        onClick={handleDisableNotifications}
                        className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <BellOff className="w-4 h-4" />
                        Unsubscribe
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleEnableNotifications}
                      disabled={isSubscribing}
                      className="w-full py-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-slate-200 disabled:text-slate-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          Enable Notifications
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <LatestNearMeBanner />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Recent Earthquakes
                <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-400 font-normal">
                  {filteredEarthquakes.length} events
                </span>
              </h2>
            </div>

            {isLoading && earthquakes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEarthquakes.map((earthquake, index) => (
                  <EarthquakeCard
                    key={earthquake.id}
                    earthquake={earthquake}
                    index={index}
                    onSelect={setSelectedEarthquake}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedEarthquake && (
        <EarthquakeDetails
          earthquake={selectedEarthquake}
          onClose={() => setSelectedEarthquake(null)}
        />
      )}
    </div>
  );
}
