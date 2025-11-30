# Tasks: Refactor to BullMQ & Redis Architecture

[x] TASK-001: Infrastructure Setup
    [x] Install dependencies: `@nestjs/bullmq`, `bullmq`, `ioredis`
    [x] Configure Redis connection in `app.module.ts` and `ConfigService`
    [x] Setup BullMQ root module registration

[x] TASK-002: Implement Data Ingestion (Fetch Workers)
    [x] Create `FetchProducer` service to schedule cron-like jobs
    [x] Create `FetchConsumer` (Worker) class
    [x] Implement `fetch-latest` job handler (USGS API call)
    [x] Implement Dual-Write logic (MongoDB Upsert + Redis `ZADD`)
    [x] Verify concurrency settings (4 workers)

[x] TASK-003: API Optimization (Redis Integration)
    [x] Inject Redis client into `EarthquakeService`
    [x] Refactor `findAll` to attempt Redis read (`ZREVRANGE`) first
    [x] Implement fallback to MongoDB
    [x] Ensure data consistency (Redis format matches API DTO)

[x] TASK-004: Alerting System
    [x] Create `AlertProducer` (or use method in FetchWorker)
    [x] Create `AlertConsumer` (Worker) class
    [x] Implement MQTT publishing logic in AlertConsumer (replacing old service logic)
    [x] Connect to EMQX broker

[x] TASK-005: Cleanup & Migration
    [x] Remove old `@Cron` fetch method from `EarthquakeService`
    [x] Remove raw RabbitMQ code if fully replaced (or keep as legacy if needed for other consumers)
    [x] Verify frontend `GET /earthquakes` receives data correctly

[x] TASK-006: Verification
    [x] Run full stack (Docker)
    [x] Check Redis keys (`earthquakes:recent`)
    [x] Check MongoDB documents
    [x] Check BullMQ Dashboard (optional/logs)
    [x] Verify Mobile Alert via MQTT subscription test
