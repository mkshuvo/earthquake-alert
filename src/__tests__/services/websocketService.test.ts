import webSocketService from '../../services/websocketService';

describe('WebSocketService Notification Test', () => {
  const originalNotification = window.Notification;
  let notificationMock: jest.Mock;

  beforeEach(() => {
    notificationMock = jest.fn();
    // Mock the Notification constructor
    window.Notification = notificationMock as any;
    // Mock permission to be 'granted'
    Object.defineProperty(window.Notification, 'permission', {
      value: 'granted',
      writable: true
    });
  });

  afterEach(() => {
    window.Notification = originalNotification;
    jest.clearAllMocks();
  });

  test('testNotification triggers a notification with correct layout and format', () => {
    // Act
    webSocketService.testNotification();

    // Assert
    expect(notificationMock).toHaveBeenCalledTimes(1);
    
    // Verify Notification Title (Format)
    expect(notificationMock.mock.calls[0][0]).toBe('Earthquake Alert - 7.5M');
    
    // Verify Notification Options (Layout/Body)
    const options = notificationMock.mock.calls[0][1];
    expect(options).toEqual(expect.objectContaining({
      body: 'Test Location - Pacific Ocean\nDepth: 10km',
      icon: '/earthquake-icon.png',
      requireInteraction: true,
    }));
    
    // Verify tag format
    expect(options.tag).toMatch(/^test-\d+$/);
  });
});
