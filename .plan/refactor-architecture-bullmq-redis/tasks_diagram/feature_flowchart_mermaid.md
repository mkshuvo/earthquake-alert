graph TD
    subgraph "Scheduler"
        A[FetchProducer] -->|Every 30s| B(Fetch Queue)
    end
    
    subgraph "Workers"
        B --> C[FetchConsumer]
        C -->|1. GET| D[USGS API]
        C -->|2. Filter New| E{Is New?}
        E -- Yes --> F[Save to MongoDB]
        E -- Yes --> G[Save to Redis]
        E -- Yes --> H{High Mag?}
        H -- Yes --> I(Alert Queue)
    end
    
    subgraph "Alerting"
        I --> J[AlertConsumer]
        J -->|Publish| K[EMQX MQTT]
    end
    
    subgraph "API"
        L[Client Request] --> M[Controller]
        M -->|Read| G
        G -.->|Miss| F
        M --> L
    end