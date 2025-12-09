# Notification System Design

## 1. Architecture Overview
The notification logic is implemented primarily in the frontend client, leveraging the `WebSocketService` for event processing and the `Home` component for user interaction.

### Key Components:
- **`page.tsx` (Home)**: Handles user interaction (Enable/Unsubscribe/Test), manages UI state (`isSubscribing`, `notificationState`), and invokes Geolocation APIs.
- **`WebSocketService`**: Singleton service that maintains the WebSocket connection, filters incoming earthquake events based on criteria, and triggers the browser `Notification` API.
- **`localStorage`**: Stores the `userCountry` key to persist location, and `earthquake_notifications_disabled` to persist opt-out status.

## 2. Data Flow

### 2.1 Subscription Flow
1. User clicks "Enable Notifications".
2. App requests `Notification.requestPermission()`.
3. If granted:
   - Clears `earthquake_notifications_disabled` flag in `localStorage`.
   - App requests `navigator.geolocation.getCurrentPosition()`.
   - On success: Coordinates are sent to OpenStreetMap Nominatim API.
   - Response contains `address.country`.
   - Country is stored in `localStorage` and passed to `WebSocketService.setUserCountry()`.
   - UI updates to "Monitoring [Country]".
4. If location fails/denied:
   - App falls back to Global mode (`country = null`).
   - UI updates to "Monitoring Global".

### 2.2 Unsubscribe Flow
1. User clicks "Unsubscribe".
2. `userCountry` is removed from `localStorage`.
3. `earthquake_notifications_disabled` is set to `'true'` in `localStorage`.
4. `WebSocketService` is notified to disable notifications.
5. UI reverts to "Enable Notifications" state.

### 2.3 Notification Trigger Flow
1. `WebSocketService` receives new earthquake data via polling/socket.
2. Checks internal `notificationsEnabled` flag (synced with `localStorage`).
3. Checks against filter criteria:
   - `isSignificant`: Magnitude >= 3.1
   - `isLocal`: `userCountry` matches `earthquake.location.place`
4. If (`isSignificant || isLocal`) AND `notificationsEnabled`:
   - Checks `Notification.permission === 'granted'`.
   - Creates `new Notification(...)`.

## 3. Data Models

### Notification State (React)
```typescript
interface NotificationState {
  permission: NotificationPermission | 'default';
  country: string | null;
}
```

### Earthquake Event (Store)
```typescript
interface EarthquakeEvent {
  id: string;
  magnitude: number;
  location: {
    place: string;
    // ...
  };
  // ...
}
```

## 4. Error Handling
- **Geolocation Timeout**: 10-second hard timeout to prevent UI hanging.
- **API Timeout**: 5-second timeout for Nominatim fetch.
- **Permission Denied**: Graceful degradation to "Global only" or "Disabled" with user alerts.

## 5. Security & Privacy
- **HTTPS**: Required for Service Worker / Notification API (in production).
- **Data Minimization**: Only the country name is extracted and stored; precise coordinates are discarded immediately.
