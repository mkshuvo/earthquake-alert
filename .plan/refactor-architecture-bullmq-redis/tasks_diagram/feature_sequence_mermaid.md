sequenceDiagram
    participant S as Scheduler
    participant Q as FetchQueue
    participant W as FetchWorker
    participant USGS as USGS API
    participant M as MongoDB
    participant R as Redis
    participant AQ as AlertQueue
    participant AW as AlertWorker
    participant MQTT as EMQX

    loop Every 30s
        S->>Q: Add 'fetch-latest' Job
    end

    Q->>W: Process Job
    W->>USGS: GET /summary/all_hour.geojson
    USGS-->>W: JSON Data
    
    loop For Each Quake
        W->>M: FindOne(id)
        alt Is New
            W->>M: Save(Document)
            W->>R: ZADD earthquakes:recent score=time val=json
            opt Magnitude >= 5.0
                W->>AQ: Add 'send-alert' Job
            end
        end
    end

    AQ->>AW: Process Alert Job
    AW->>MQTT: Publish 'alerts/earthquake'
