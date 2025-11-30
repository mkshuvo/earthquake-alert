# Requirements: Scalable Earthquake Data Ingestion & Alerting System

## 1. Overview
Refactor the existing monolithic cron-based data fetching into a scalable, event-driven architecture using **BullMQ**, **Redis**, and **MongoDB**. The system will decouple data ingestion, storage, and alerting into separate background processes, ensuring high availability, faster API responses, and reliable alert delivery.

## 2. Functional Requirements

### 2.1 Data Ingestion (USGS -> System)
- **Source:** USGS Earthquake Hazards Program API.
- **Frequency:** Continuous fetching (near real-time).
- **Mechanism:**
  - Replace single Cron job with **BullMQ** background workers.
  - **Load Balancing:** Configure 3-4 parallel workers to handle different fetch strategies (e.g., "Last Hour", "Last 24H", "Significant Earthquakes") concurrently.
  - **De-duplication:** Ensure the same earthquake event is not processed multiple times unnecessarily.

### 2.2 Data Storage (Dual Write)
- **Primary Store (Persistent):** **MongoDB**. Stores full history and details.
- **Cache Store (High Performance):** **Redis**. Stores the latest ~100 earthquakes and active alerts for rapid API access.
- **Consistency:** Writes should occur in parallel or eventually consistent manner (Redis for speed, Mongo for durability).

### 2.3 API Optimization
- **Read Path:** `GET /earthquakes` must read from **Redis** first.
- **Fallback:** If Redis is empty/down, fall back to MongoDB.
- **Performance Goal:** Sub-10ms response time for standard queries.

### 2.4 Alerting System
- **Trigger:** New earthquake detected with Magnitude >= X (configurable, e.g., 5.0) AND/OR location match.
- **Queue:** Dedicated `alert-queue` in BullMQ.
- **Worker:** `AlertWorker` processes jobs from `alert-queue`.
- **Delivery:**
  - Publish to **EMQX (MQTT)** topic `alerts/earthquake`.
  - Mobile apps subscribe to this topic to trigger loud sound alerts.

### 2.5 Frontend Integration
- Ensure the Next.js frontend (`earthquake-alert`) correctly consumes the optimized API.
- Fix current data visibility issues ("No data" bug).
- Remove legacy/unused code (old polling logic if replaced, raw RabbitMQ if fully replaced by BullMQ/Redis flow).

## 3. Tech Stack
- **Backend Framework:** NestJS
- **Queue System:** BullMQ (Redis-backed)
- **Database:** MongoDB (Mongoose)
- **Cache/Fast Store:** Redis (ioredis)
- **Real-time Messaging:** EMQX (MQTT) + Socket.IO (Frontend)
- **Frontend:** Next.js 14

## 4. Constraints & Assumptions
- **USGS Rate Limits:** Must respect upstream API limits (though generous, we shouldn't spam).
- **Concurrency:** Workers must handle potential race conditions when upserting to DB.
- **Environment:** Dockerized environment with Redis and MongoDB containers available.

## 5. Compliance & Security
- **Data Validation:** Strict schema validation before storage.
- **Error Handling:** Retry mechanism for failed API calls or DB writes (BullMQ automatic retries).
