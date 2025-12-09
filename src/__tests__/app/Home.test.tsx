import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../../app/page';
import webSocketService from '../../services/websocketService';
import '@testing-library/jest-dom';

// Mock hooks and services
jest.mock('../../hooks/useAppInitialization', () => ({
  useAppInitialization: () => ({ isConnecting: false }),
}));

jest.mock('../../store/earthquakeStore', () => ({
  useEarthquakeStore: () => ({ earthquakes: [], isLoading: false }),
  useFilteredEarthquakes: () => [],
  useEarthquakeStats: () => ({
    total: 10,
    significant: 2,
    maxMagnitude: 5.0,
    avgDepth: 10,
    tsunamiCount: 0,
  }),
}));

jest.mock('../../services/websocketService', () => ({
  setUserCountry: jest.fn(),
  setNotificationsEnabled: jest.fn(),
  requestNotificationPermission: jest.fn().mockResolvedValue(true),
  testNotification: jest.fn(),
}));

// Mock child components to avoid complex rendering
jest.mock('../../app/components/ParallaxBackground', () => () => <div data-testid="parallax-bg" />);
jest.mock('../../app/components/StatCard', () => () => <div data-testid="stat-card" />);
jest.mock('../../app/components/FilterPanel', () => () => <div data-testid="filter-panel" />);
jest.mock('../../app/components/LatestNearMeBanner', () => () => <div data-testid="banner" />);
jest.mock('../../app/components/EarthquakeCard', () => () => <div data-testid="earthquake-card" />);
jest.mock('../../app/components/ConnectionStatus', () => () => <div data-testid="connection-status" />);

describe('Home Page Notification Logic', () => {
  const originalLocalStorage = window.localStorage;
  const originalNotification = window.Notification;

  beforeAll(() => {
    // Mock LocalStorage
    const localStorageMock = (function() {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Mock Notification
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
        requestPermission: jest.fn().mockResolvedValue('granted'),
      },
      writable: true,
    });
    
    // Mock Alert
    window.alert = jest.fn();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    Object.defineProperty(window, 'Notification', { value: originalNotification });
  });

  beforeEach(() => {
    window.localStorage.clear();
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (webSocketService.setNotificationsEnabled as jest.Mock).mockClear();
    // Default permission granted
    // @ts-ignore
    window.Notification.permission = 'granted';
  });

  it('renders "Unsubscribe" button when permission is granted and not disabled', () => {
    render(<Home />);
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
  });

  it('renders "Enable Notifications" button when permission is default', () => {
    // @ts-ignore
    window.Notification.permission = 'default';
    render(<Home />);
    expect(screen.getByText('Enable Notifications')).toBeInTheDocument();
  });

  it('handles Unsubscribe flow correctly', () => {
    render(<Home />);
    
    // Initial state: Unsubscribe button visible
    const unsubscribeBtn = screen.getByText('Unsubscribe');
    expect(unsubscribeBtn).toBeInTheDocument();

    // Click Unsubscribe
    fireEvent.click(unsubscribeBtn);

    // Verify localStorage update
    expect(window.localStorage.setItem).toHaveBeenCalledWith('earthquake_notifications_disabled', 'true');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('userCountry');
    
    // Verify Service update
    expect(webSocketService.setNotificationsEnabled).toHaveBeenCalledWith(false);

    // Verify UI update
    expect(screen.getByText('Enable Notifications')).toBeInTheDocument();
    expect(screen.queryByText('Unsubscribe')).not.toBeInTheDocument();
  });

  it('persists Unsubscribed state after reload', () => {
    // Simulate previous unsubscribe action
    window.localStorage.setItem('earthquake_notifications_disabled', 'true');
    
    // Render component (simulating reload)
    render(<Home />);

    // Should show "Enable Notifications" despite Notification.permission being 'granted'
    expect(screen.getByText('Enable Notifications')).toBeInTheDocument();
    expect(screen.queryByText('Unsubscribe')).not.toBeInTheDocument();
    
    // Verify service was initialized correctly
    expect(webSocketService.setNotificationsEnabled).toHaveBeenCalledWith(false);
  });

  it('handles Re-subscribe flow correctly', async () => {
    // Start from unsubscribed state
    window.localStorage.setItem('earthquake_notifications_disabled', 'true');
    render(<Home />);

    const enableBtn = screen.getByText('Enable Notifications');
    fireEvent.click(enableBtn);

    // Verify localStorage update
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('earthquake_notifications_disabled');
    
    // Wait for async permission request
    await act(async () => {
      await Promise.resolve(); // flush promises
    });

    // Should show Unsubscribe button
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
  });
});

