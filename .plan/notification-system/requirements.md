# Notification System Requirements

## 1. Feature Overview
The Notification System provides real-time desktop alerts to users for earthquake events. It allows users to subscribe to alerts relevant to their location (country-specific) or significant global events.

## 2. Functional Requirements
### 2.1 Subscription Management
- **Enable Notifications**: Users can opt-in to receive notifications.
- **Geolocation Detection**: The system attempts to automatically detect the user's country using the browser's Geolocation API and OpenStreetMap Nominatim service.
- **Fallback Mechanism**: If location detection fails or is denied, the system defaults to "Global" mode (significant events only).
- **Unsubscribe**: Users can opt-out, which clears their stored preferences and stops notifications.

### 2.2 Alert Logic
- **Significant Events**: Notify for any earthquake with Magnitude ≥ 3.1 (Global scope).
- **Local Events**: Notify for *any* earthquake detected within the user's subscribed country (regardless of magnitude).
- **Test Notification**: Users can manually trigger a test alert to verify browser permissions and UI rendering.

### 2.3 User Interface
- **Dynamic Button**: Shows "Enable Notifications", "Subscribing..." (loading), or "Unsubscribe" based on state.
- **Status Display**: Shows "Monitoring [Country]" when active.
- **Feedback**: Provides clear alerts for permission errors or location failures.

## 3. Non-Functional Requirements
- **Persistence**: User's country preference persists across sessions using `localStorage`.
- **Performance**: Geolocation requests have a 10s timeout; Geocoding API has a 5s timeout.
- **Privacy**: Location data is processed client-side and only the country name is stored locally.
- **Browser Support**: Uses standard Web Notification API.

## 4. Tech Stack
- **Frontend**: Next.js (React), TypeScript
- **State Management**: React `useState`, `localStorage`
- **Services**: `WebSocketService` (Singleton), OpenStreetMap Nominatim API
- **Testing**: Jest (Unit testing for notification logic)
