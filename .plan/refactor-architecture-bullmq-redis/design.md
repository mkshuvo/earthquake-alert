# Design: Event-Driven Earthquake Architecture

## 1. Architecture Overview

```mermaid
graph TD
    subgraph "External"
        USGS[USGS API]
    end

    subgraph "NestJS Backend (earthquake-alert-server)"
        Scheduler[Job Scheduler]
        
        subgraph "Queues (BullMQ)"
            FQ[Fetch Queue]
            AQ[Alert Queue]
        end
        
        subgraph "Workers"
            FW[Fetch Workers (x4)]
            AW[Alert Worker]
        end
        
        subgraph "Services"
            API[API Service]
        end
    end

    subgraph "Data Layer"
        Redis[(Redis Cache)]
        Mongo[(MongoDB)]
    end

    subgraph "Messaging"
        EMQX[EMQX MQTT Broker]
        SocketIO[Socket.IO Gateway]
    end

    subgraph "Clients"
        Web[Web Frontend]
        Mobile[Mobile App]
    end

    Scheduler -->|1. Add Job| FQ
    FQ -->|2. Process| FW
    FW -->|3. Fetch| USGS
    FW -->|4. Write (Upsert)| Mongo
    FW -->|5. Write (Cache)| Redis
    FW -->|6. New Event?| AQ
    
    AQ -->|7. Process| AW
    AW -->|8. Publish| EMQX
    EMQX -->|9. Alert| Mobile
    
    API -->|Query| Redis
    API -.->|Fallback| Mongo
    API -->|Response| Web
    
    FW -->|Broadcast| SocketIO
    SocketIO -->|Realtime Update| Web
```

## 2. Component Design

### 2.1 Queues
1.  **Fetch Queue (`earthquake-fetch`)**
    *   **Jobs:**
        *   `fetch-latest`: Pulls "All Earthquakes from Past Hour". High frequency (every 30s).
        *   `fetch-significant`: Pulls "Significant Earthquakes Past 30 Days". Low frequency (every 5m).
        *   `fetch-history`: Pulls "All Earthquakes Past 24 Hours". Catch-up frequency (every 10m).
    *   **Concurrency:** 4 (Parallel processing of different feed types).

2.  **Alert Queue (`earthquake-alert`)**
    *   **Jobs:** `process-alert`
    *   **Payload:** `{ earthquakeId, magnitude, location, timestamp }`
    *   **Concurrency:** 2

### 2.2 Data Models

#### Redis Schema
*   **Key:** `earthquakes:recent` (Sorted Set)
    *   **Score:** Timestamp
    *   **Value:** JSON String of Earthquake Object
*   **Key:** `earthquakes:detail:{id}` (String/Hash)
    *   Value: Full Earthquake Object (with detailed geometry if needed)
*   **TTL:** 24 Hours for cache keys.

#### MongoDB Schema (Existing)
*   Collection: `earthquakes`
*   Index: `id` (Unique), `properties.time`, `properties.mag`

### 2.3 API Flow (Read Strategy)
1.  **Request:** `GET /api/earthquakes?limit=10`
2.  **Service:** `EarthquakeService.getRecent()`
3.  **Step 1:** `redis.zrevrange('earthquakes:recent', 0, 9)`
4.  **Step 2:** If data found, parse and return.
5.  **Step 3:** If Redis empty or error, query MongoDB `find().sort({time: -1}).limit(10)`.

### 2.4 Alert Flow
1.  **Ingestion:** `FetchWorker` detects a new ID not in DB.
2.  **Check:** If `mag >= 5.0` (configurable), `alertQueue.add('process-alert', data)`.
3.  **Processing:** `AlertWorker` receives job.
4.  **Action:**
    *   Publish to MQTT topic `alerts/earthquake`.
    *   Payload: `{ title: "Earthquake Alert!", body: "5.2M Earthquake detected in Tokyo", ... }`

## 3. Deployment
*   **Docker Compose:**
    *   Add `redis` service (already likely present, verify).
    *   Ensure `earthquake-alert-server` links to `redis`.

## 4. Testing Strategy
*   **Unit Tests:** Mock BullMQ queues and Redis client.
*   **Integration:** Trigger manual fetch job and verify data appears in Redis and Mongo.
