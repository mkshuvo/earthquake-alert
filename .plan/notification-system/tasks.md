# Notification System Implementation Tasks

[x] TASK-001: Implement Core Notification Logic
    [x] Update WebSocketService to handle user country
    [x] Implement filtering logic (Mag >= 3.1 or Local)
    [x] Add showNotification method

[x] TASK-002: User Interface Implementation
    [x] Create notification state management in Home component
    [x] Implement "Enable Notifications" button with loading state
    [x] Implement "Unsubscribe" button
    [x] Add "Test Notification" button
    [x] Style components using Tailwind CSS

[x] TASK-003: Geolocation & Geocoding Integration
    [x] Implement browser Geolocation API call
    [x] Integrate OpenStreetMap Nominatim for reverse geocoding
    [x] Handle timeouts (10s for geo, 5s for fetch)
    [x] Implement error handling and fallback to global alerts

[x] TASK-004: Persistence
    [x] Save user country to localStorage
    [x] Load saved preference on app initialization
    [x] Clear storage on Unsubscribe

[x] TASK-005: Testing & Verification
    [x] Create Unit Test for WebSocketService.testNotification
    [x] Manual verification of UI flows
    [x] Verify Docker build stability

[x] TASK-006: Bug Fixes & Improvements
    [x] Fix Unsubscribe state persistence (localStorage flag)
    [x] Ensure global alerts are silenced when unsubscribed
    [x] Rename localStorage key to avoid localhost collisions
