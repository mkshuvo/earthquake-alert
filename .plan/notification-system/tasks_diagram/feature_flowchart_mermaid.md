```mermaid
flowchart TD
    Start([User Visits App]) --> Init{Permission Granted?}
    Init -- Yes --> LoadStore[Load Country from LocalStorage]
    Init -- No --> ShowEnable[Show "Enable Notifications" Button]
    
    LoadStore --> SetService[Update WebSocketService]
    SetService --> ShowStatus[Show "Monitoring..." UI]
    
    ShowEnable --> UserClick[User Clicks Enable]
    UserClick --> ReqPerm[Request Notification Permission]
    
    ReqPerm -- Denied --> ShowError[Alert: Permission Denied]
    ReqPerm -- Granted --> GetLoc[Get Geolocation]
    
    GetLoc -- Success --> RevGeo[Fetch Country (Nominatim)]
    GetLoc -- Error/Timeout --> Fallback[Fallback to Global Mode]
    
    RevGeo -- Success --> SaveStore[Save to LocalStorage]
    RevGeo -- Fail --> Fallback
    
    SaveStore --> UpdateSvc[Update WebSocketService Country]
    Fallback --> UpdateSvcGlobal[Update WebSocketService (Null)]
    
    UpdateSvc --> ShowStatus
    UpdateSvcGlobal --> ShowStatus
    
    ShowStatus --> IncomingEvent{{New Earthquake Event}}
    IncomingEvent --> CheckMag{Magnitude >= 3.1?}
    IncomingEvent --> CheckLoc{Location Matches Country?}
    
    CheckMag -- Yes --> TriggerNotif[Show Notification]
    CheckMag -- No --> CheckLoc
    CheckLoc -- Yes --> TriggerNotif
    CheckLoc -- No --> Ignore[Ignore Event]
    
    ShowStatus --> UserUnsub[User Clicks Unsubscribe]
    UserUnsub --> ClearStore[Clear LocalStorage]
    ClearStore --> ResetSvc[Reset WebSocketService]
    ResetSvc --> ShowEnable
```
